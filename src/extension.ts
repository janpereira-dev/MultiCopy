import * as path from 'path';
import * as vscode from 'vscode';

import * as l10n from '@vscode/l10n';
import { Minimatch } from 'minimatch';

// ── Constantes reutilizables (se crean una sola vez) ──────────────────────

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: false });

/** Mapa extensión → lenguaje para bloques de código Markdown */
const FENCE_LANG_MAP: Readonly<Record<string, string>> = {
  // JS/TS
  ts: 'ts',
  tsx: 'ts',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  json: 'json',
  jsonc: 'jsonc',

  // Markdown y variantes
  md: 'markdown',
  markdown: 'markdown',
  mdown: 'markdown',
  mkd: 'markdown',
  mkdn: 'markdown',
  mdwn: 'markdown',
  mdtxt: 'markdown',
  mdtext: 'markdown',
  rmd: 'markdown',
  mdx: 'mdx',

  // Web
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',

  // Shell / scripts
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  ps1: 'powershell',
  ps: 'powershell',

  // YAML
  yml: 'yaml',
  yaml: 'yaml',

  // Python / Java
  py: 'python',
  java: 'java',

  // C/C++/C#
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  hpp: 'cpp',
  hh: 'cpp',
  hxx: 'cpp',
  cs: 'csharp',

  // Otros lenguajes populares
  go: 'go',
  rs: 'rust',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  rb: 'ruby',
  php: 'php',
  scala: 'scala',
  dart: 'dart',
  lua: 'lua',
  r: 'r',
  pl: 'perl',
  pm: 'perl',
  ex: 'elixir',
  exs: 'elixir',
  erl: 'erlang',
  sql: 'sql',
  toml: 'toml',
  ini: 'ini',
  conf: 'ini',
  cfg: 'ini',

  // Frontend frameworks
  vue: 'vue',
  svelte: 'svelte',
  astro: 'astro',

  // Infra/CI
  dockerfile: 'dockerfile',
  tf: 'hcl',
  hcl: 'hcl',
};

const VALID_EXT_RE = /^[a-z0-9+-]+$/i;

// ── Utilidades ────────────────────────────────────────────────────────────

/** Extrae la extensión de un path de forma segura usando path.extname */
function extFromPath(filePath: string): string {
  const ext = path.extname(filePath);
  // extname devuelve ".ts" → eliminamos el punto; sin extensión → ""
  return ext ? ext.slice(1).toLowerCase() : '';
}

function fenceLangFromExt(ext: string): string {
  const lang = FENCE_LANG_MAP[ext];
  if (lang) return lang;
  if (ext && VALID_EXT_RE.test(ext)) return ext.toLowerCase();
  return 'txt';
}

/**
 * Detecta si un buffer parece binario en un solo pase.
 * Retorna true si encuentra un byte nulo o >20% de caracteres de control.
 */
function seemsBinary(buf: Uint8Array): boolean {
  const len = Math.min(buf.length, 1024);
  if (len === 0) return false;
  let ctrls = 0;
  for (let i = 0; i < len; i++) {
    const b = buf[i];
    if (b === 0) return true;
    if (b < 9 || (b > 13 && b < 32)) ctrls++;
  }
  return ctrls > len * 0.2;
}

/** Resultado de leer un archivo: contenido de texto + tamaño en bytes */
interface FileReadResult {
  text: string;
  sizeBytes: number;
}

/**
 * Lee un archivo y devuelve texto + tamaño. Retorna null si es binario o hay error.
 * Evita la doble lectura (readFile + stat) obteniendo el tamaño del buffer leído.
 */
async function readText(uri: vscode.Uri): Promise<FileReadResult | null> {
  try {
    const data = await vscode.workspace.fs.readFile(uri);
    if (seemsBinary(data)) return null;
    return { text: decoder.decode(data), sizeBytes: data.byteLength };
  } catch {
    return null;
  }
}

function filterIgnored(uris: vscode.Uri[], ignoreGlobs: string[]): vscode.Uri[] {
  if (ignoreGlobs.length === 0) return uris;
  const matchers = ignoreGlobs.map((g) => new Minimatch(g, { dot: true, nocase: true, nocomment: true }));
  return uris.filter((u) => !matchers.some((mm) => mm.match(u.fsPath.replace(/\\/g, '/'))));
}

/**
 * Expande recursivamente directorios a archivos individuales.
 * Maneja archivos, directorios y symlinks correctamente.
 * Paraleliza la lectura de entradas de cada directorio.
 */
async function flattenSelection(uris: vscode.Uri[]): Promise<vscode.Uri[]> {
  const out: vscode.Uri[] = [];
  // Procesar URIs en paralelo para mejorar rendimiento
  const results = await Promise.all(
    uris.map(async (uri): Promise<vscode.Uri[]> => {
      let stat: vscode.FileStat;
      try {
        stat = await vscode.workspace.fs.stat(uri);
      } catch {
        return []; // archivo inaccesible, ignorar
      }
      const type = stat.type & ~vscode.FileType.SymbolicLink; // resolver symlinks
      if (type === vscode.FileType.File) {
        return [uri];
      }
      if (type === vscode.FileType.Directory) {
        const entries = await vscode.workspace.fs.readDirectory(uri);
        const children = entries.map(([name]) => vscode.Uri.joinPath(uri, name));
        return flattenSelection(children);
      }
      return [];
    }),
  );
  for (const batch of results) {
    out.push(...batch);
  }
  return out;
}

export async function activate(context: vscode.ExtensionContext) {
  await l10n.config({
    fsPath: path.join(context.extensionPath, 'l10n', 'bundle.l10n.json'),
  });

  const cmd = vscode.commands.registerCommand('multicopy.copyAsBundle', async (single?: vscode.Uri, multi?: vscode.Uri[]) => {
    const cfg = vscode.workspace.getConfiguration('multicopy');
    const maxBytes = Math.max(1024, Number(cfg.get<number>('maxBytes') || 20000000));
    const separator = String(cfg.get<string>('separator') || '\n\n');
    const ignoreGlobs = (cfg.get<string[]>('ignoreGlobs') || []).filter(Boolean);
    const excludeMarkdown = Boolean(cfg.get<boolean>('excludeMarkdown') ?? true);
    const maxJsonBytes = Math.max(1024, Number(cfg.get<number>('maxJsonBytes') || 200000));
    const includeHeaders = Boolean(cfg.get<boolean>('includeHeaders') ?? true);
    const metadataInsideFence = Boolean(cfg.get<boolean>('metadataInsideFence') ?? false);

    let selected: vscode.Uri[] = [];
    if (Array.isArray(multi) && multi.length) {
      selected = multi;
    } else if (single) {
      selected = [single];
    }
    if (!selected.length) {
      vscode.window.showWarningMessage(l10n.t('Nothing to copy after filters.'));
      return;
    }

    const all = await flattenSelection(selected);
    const files = filterIgnored(all, ignoreGlobs).sort((a, b) => a.fsPath.localeCompare(b.fsPath));
    if (!files.length) {
      vscode.window.showWarningMessage(l10n.t('Nothing to copy after filters.'));
      return;
    }

    let total = 0;
    const chunks: string[] = [];
    let skippedBinary = 0;
    let skippedExcluded = 0;
    let truncated = false;

    // Leer todos los archivos en paralelo (en lotes para no saturar I/O)
    const BATCH_SIZE = 20;
    const fileResults: (FileReadResult | null)[] = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map((uri) => readText(uri)));
      fileResults.push(...results);
    }

    for (let idx = 0; idx < files.length; idx++) {
      const uri = files[idx];
      const result = fileResults[idx];
      if (result === null) {
        skippedBinary++;
        continue;
      }

      const ext = extFromPath(uri.fsPath);
      if (excludeMarkdown && ext === 'md') {
        skippedExcluded++;
        continue;
      }

      const { text: content, sizeBytes } = result;
      const relPath = vscode.workspace.asRelativePath(uri, false);

      let body = content;
      if (ext === 'json') {
        const bytes = encoder.encode(body);
        if (bytes.length > maxJsonBytes) {
          const slice = bytes.slice(0, Math.max(0, maxJsonBytes - 64));
          body = decoder.decode(slice) + '\n/* ...JSON truncado... */';
        }
      }

      const fenceLang = fenceLangFromExt(ext);
      const codeOpen = `\`\`\`${fenceLang}\n`;
      const codeClose = `\n\`\`\``;
      const fileName = path.basename(uri.fsPath);
      const meta = `- ${l10n.t('Name')}: \`${fileName}\`\n- ${l10n.t('Size')}: \`${sizeBytes} bytes\`\n- ${l10n.t('Relative path')}: \`${relPath}\`\n`;
      let block: string;
      if (includeHeaders) {
        block = metadataInsideFence ? codeOpen + meta + body + codeClose : meta + codeOpen + body + codeClose;
      } else {
        block = codeOpen + body + codeClose;
      }
      const nextSize = encoder.encode(block + separator).length;

      if (total + nextSize > maxBytes) {
        if (chunks.length === 0) {
          const prefix = includeHeaders ? (metadataInsideFence ? codeOpen + meta : meta + codeOpen) : codeOpen;
          const suffixReal = `\n/* ...truncated... */` + codeClose;
          const overhead = encoder.encode(prefix).length + encoder.encode(suffixReal).length;
          const available = maxBytes - overhead;
          if (available > 0) {
            const raw = encoder.encode(body);
            const slice = raw.slice(0, Math.max(0, available));
            const bodyPart = decoder.decode(slice);
            chunks.push(prefix + bodyPart + suffixReal);
            total = maxBytes;
            truncated = true;
          }
        }
        truncated = true;
        break;
      }
      chunks.push(block);
      total += nextSize;
    }

    const finalText = chunks.join(separator);
    if (!finalText) {
      vscode.window.showWarningMessage(l10n.t('Nothing copied. Binary files or very low limit.'));
      return;
    }

    await vscode.env.clipboard.writeText(finalText);

    const noteParts: string[] = [l10n.t('Copied {0} file(s) · ~{1} bytes', chunks.length, total)];
    if (skippedBinary) noteParts.push(l10n.t('{0} skipped (binary)', skippedBinary));
    if (skippedExcluded) noteParts.push(l10n.t('{0} skipped (excluded)', skippedExcluded));
    if (truncated) noteParts.push(l10n.t('content truncated by limit'));
    vscode.window.showInformationMessage(noteParts.join(' · '));
  });

  context.subscriptions.push(cmd);
}

export function deactivate(): void {
  // noop
}
