import * as vscode from 'vscode';

import { Minimatch } from 'minimatch';

function langFromExt(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'ts',
    tsx: 'tsx',
    js: 'js',
    jsx: 'jsx',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'md',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'bash',
    ps1: 'powershell',
    py: 'python',
    java: 'java',
    kt: 'kotlin',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
  };
  return map[ext] ?? '';
}

function seemsBinary(buf: Uint8Array): boolean {
  const len = Math.min(buf.length, 1024);
  for (let i = 0; i < len; i++) {
    const b = buf[i];
    if (b === 0) return true;
  }
  // heurística simple: demasiados control chars no comunes
  let ctrls = 0;
  for (let i = 0; i < len; i++) {
    const b = buf[i];
    if (b < 9 || (b > 13 && b < 32)) ctrls++;
  }
  return ctrls > len * 0.2;
}

async function readText(uri: vscode.Uri): Promise<string | null> {
  try {
    const data = await vscode.workspace.fs.readFile(uri);
    if (seemsBinary(data)) return null;
    return new TextDecoder('utf-8', { fatal: false }).decode(data);
  } catch {
    return null;
  }
}

function filterIgnored(uris: vscode.Uri[], ignoreGlobs: string[]): vscode.Uri[] {
  if (ignoreGlobs.length === 0) return uris;
  const matchers = ignoreGlobs.map(
    (g) => new Minimatch(g, { dot: true, nocase: true, nocomment: true }),
  );
  // replaceAll no está disponible en ES2020, usamos split/join para compatibilidad
  return uris.filter((u) => !matchers.some((mm) => mm.match(u.fsPath.split('\\').join('/'))));
}

async function flattenSelection(uris: vscode.Uri[]): Promise<vscode.Uri[]> {
  const out: vscode.Uri[] = [];
  for (const uri of uris) {
    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.type === vscode.FileType.File) {
      out.push(uri);
    } else if (stat.type === vscode.FileType.Directory) {
      const entries = await vscode.workspace.fs.readDirectory(uri);
      const children = entries.map(([name]) => vscode.Uri.joinPath(uri, name));
      out.push(...(await flattenSelection(children)));
    }
  }
  return out;
}

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand(
    'multicopy.copyAsBundle',
    async (single?: vscode.Uri, multi?: vscode.Uri[]) => {
      const cfg = vscode.workspace.getConfiguration('multicopy');
      const maxBytes = Math.max(1024, Number(cfg.get<number>('maxBytes') || 200000));
      const includeHeaders = Boolean(cfg.get<boolean>('includeHeaders'));
      const separator = String(cfg.get<string>('separator') || '\n\n');
      const ignoreGlobs = (cfg.get<string[]>('ignoreGlobs') || []).filter(Boolean);

      const selected = Array.isArray(multi) && multi.length ? multi : single ? [single] : [];
      if (!selected.length) {
        vscode.window.showInformationMessage(
          'No hay selección. Usa click derecho en el Explorador.',
        );
        return;
      }

      const all = await flattenSelection(selected);
      const files = filterIgnored(all, ignoreGlobs).sort((a, b) =>
        a.fsPath.localeCompare(b.fsPath),
      );
      if (!files.length) {
        vscode.window.showWarningMessage('Nada que copiar tras aplicar filtros.');
        return;
      }

      let total = 0;
      const chunks: string[] = [];
      let skippedBinary = 0;
      let truncated = false;

      for (const uri of files) {
        const content = await readText(uri);
        if (content === null) {
          skippedBinary++;
          continue;
        }

        const lang = langFromExt(uri.fsPath);
        const header = includeHeaders ? `${uri.fsPath}\n\`\`\`${lang}\n` : `\`\`\`${lang}\n`;
        const footer = `\n\`\`\``;

        const block = header + content + footer;
        const nextSize = new TextEncoder().encode(block + separator).length;

        if (total + nextSize > maxBytes) {
          // intentar meter truncado del último archivo si aún no hay nada
          if (chunks.length === 0) {
            // calcula cuánto cabe
            const available = maxBytes - new TextEncoder().encode(header + footer).length;
            if (available > 0) {
              const raw = new TextEncoder().encode(content);
              const slice = raw.slice(0, Math.max(0, available - 32)); // margen para el marcador
              const partial =
                header + new TextDecoder().decode(slice) + '\n/* ...truncado... */' + footer;
              chunks.push(partial);
              total = maxBytes;
              truncated = true;
            }
          }
          truncated = true;
          break;
        }
        chunks.push(block);
        total += nextSize;
        // añadir separador salvo para el último más tarde
      }

      const finalText = chunks.join(separator);
      if (!finalText) {
        vscode.window.showWarningMessage('Nada copiado. Archivos binarios o límite muy bajo.');
        return;
      }

      await vscode.env.clipboard.writeText(finalText);

      const noteParts: string[] = [`Copiados ${chunks.length} archivo(s)`, `~${total} bytes`];
      if (skippedBinary) noteParts.push(`${skippedBinary} omitido(s) por binarios`);
      if (truncated) noteParts.push('contenido truncado por límite');
      vscode.window.showInformationMessage(noteParts.join(' · '));
    },
  );

  context.subscriptions.push(cmd);
}

export function deactivate() {}
