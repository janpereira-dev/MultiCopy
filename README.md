# MultiCopynator — copy files & folders in one click

[![VS Code Marketplace](https://vsmarketplacebadges.dev/version-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)
[![Installs](https://vsmarketplacebadges.dev/installs-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)
[![Rating](https://vsmarketplacebadges.dev/rating-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)

> **Select files → right-click → paste anywhere with paths, metadata, and syntax highlighting. That's it.**

Ever needed to share a batch of files in a GitHub issue, a PR review, or a chat with your team? Copying them one by one is painful. **MultiCopynator** turns any selection of files and folders into a single, clean, ready-to-paste text block — complete with relative paths and language-aware code fences.

## How to use

1. In the **Explorer**, select one or more files and/or folders.
2. Right-click → **"Copy selection as bundle"**.
3. Paste wherever you need it — the result is already formatted.

## Example output

````text
- Name: `extension.ts`
- Size: `12345 bytes`
- Relative path: `src/extension.ts`
```ts
import * as vscode from 'vscode';
// …file content
```

- Name: `package.json`
- Size: `890 bytes`
- Relative path: `package.json`
```json
{ "name": "my-project" }
```
````

## Why MultiCopynator?

- **One click, many files** — select as many files and folders as you want; they all end up in your clipboard as a single block.
- **Syntax highlighting built-in** — code fences with the correct language tag are added automatically based on file extension (100+ extensions supported).
- **Smart filtering** — binary files are detected and skipped. `node_modules`, `.git`, images, PDFs, and zips are ignored by default.
- **Safe for large projects** — a configurable byte limit prevents accidental huge pastes, with intelligent truncation so you never get a broken output.
- **JSON-aware** — large JSON files are truncated independently so they don't eat your entire budget.
- **Metadata at a glance** — each file shows its name, size, and relative path. You choose whether metadata goes inside or outside the code fence.
- **Markdown-friendly** — `.md` files are excluded by default to avoid nested fence conflicts, but you can include them if you want.
- **Runs everywhere** — works in untrusted workspaces (read-only by design) and supports multiple languages (English, Spanish, Portuguese).

## Settings

All settings are under `multicopy.*`:

| Setting               | Type     | Default       | Description                                                                  |
| --------------------- | -------- | ------------- | ---------------------------------------------------------------------------- |
| `maxBytes`            | number   | `20000000`    | Maximum total bytes to copy. The last file is truncated smartly if exceeded. |
| `separator`           | string   | `"\n\n"`      | Text placed between each file block.                                         |
| `includeHeaders`      | boolean  | `true`        | Show per-file metadata (Name, Size, Relative path).                          |
| `metadataInsideFence` | boolean  | `false`       | Place metadata inside the code fence instead of outside.                     |
| `excludeMarkdown`     | boolean  | `true`        | Skip `.md` files when copying.                                               |
| `maxJsonBytes`        | number   | `200000`      | Max size for full JSON inclusion; larger files are truncated with a marker.  |
| `ignoreGlobs`         | string[] | _(see below)_ | Glob patterns to ignore.                                                     |

**Default ignore patterns:** `**/node_modules/**`, `**/.git/**`, `**/*.png`, `**/*.jpg`, `**/*.jpeg`, `**/*.gif`, `**/*.pdf`, `**/*.zip`

## Tips

- Perfect for pasting code context into **GitHub issues, PR descriptions, ChatGPT, Copilot Chat**, or any Markdown-aware surface.
- Bump `maxBytes` when sharing large codebases; keep your target platform's paste limit in mind.
- Add patterns like `**/dist/**`, `**/*.lock` to `ignoreGlobs` to keep the output lean.

## Known limitations

- Binary detection is heuristic — unusual text files with many control characters may be treated as binary.
- Very low `maxBytes` values may result in only a partial copy of the first file.
- Images and binaries are skipped by design; attach them separately if needed.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator) or search **MultiCopynator** in the Extensions panel.

## License

MIT © 2025–present Jan Pereira — see [LICENSE](LICENSE).

---

<details>
<summary><strong>🇪🇸 Español</strong></summary>

## MultiCopynator — copia archivos y carpetas en un solo clic

> **Selecciona archivos → clic derecho → pega donde quieras con rutas, metadatos y resaltado de sintaxis.**

¿Alguna vez necesitaste compartir varios archivos en un issue, un PR o un chat con tu equipo? Copiarlos uno por uno es tedioso. **MultiCopynator** convierte cualquier selección de archivos y carpetas en un único bloque de texto limpio y listo para pegar, con rutas relativas y bloques de código con detección de lenguaje.

### Cómo usar

1. En el **Explorador**, selecciona uno o varios archivos y/o carpetas.
2. Clic derecho → **"Copiar selección como bloque"**.
3. Pega donde lo necesites — el resultado ya viene formateado.

### ¿Por qué MultiCopynator?

- **Un clic, muchos archivos** — selecciona los que quieras; todos quedan en tu portapapeles como un solo bloque.
- **Resaltado de sintaxis automático** — se añaden bloques de código con el lenguaje correcto según la extensión del archivo (+100 extensiones soportadas).
- **Filtrado inteligente** — los binarios se detectan y se saltan. `node_modules`, `.git`, imágenes, PDFs y zips se ignoran por defecto.
- **Seguro para proyectos grandes** — un límite de bytes configurable previene pegados gigantes accidentales, con truncado inteligente para que nunca obtengas un resultado roto.
- **Consciente de JSON** — los archivos JSON grandes se truncan de forma independiente para que no consuman todo tu presupuesto de bytes.
- **Metadatos de un vistazo** — cada archivo muestra nombre, tamaño y ruta relativa. Tú eliges si los metadatos van dentro o fuera del bloque de código.
- **Amigable con Markdown** — los archivos `.md` se excluyen por defecto para evitar conflictos de cercas anidadas, pero puedes incluirlos si quieres.
- **Funciona en todas partes** — compatible con espacios de trabajo no confiables (solo lectura) y disponible en varios idiomas (inglés, español, portugués).

### Configuración

Todos los ajustes están bajo `multicopy.*`:

| Ajuste                | Tipo     | Por defecto    | Descripción                                                                                  |
| --------------------- | -------- | -------------- | -------------------------------------------------------------------------------------------- |
| `maxBytes`            | number   | `20000000`     | Máximo de bytes totales a copiar. El último archivo se trunca inteligentemente si se excede. |
| `separator`           | string   | `"\n\n"`       | Texto separador entre cada bloque de archivo.                                                |
| `includeHeaders`      | boolean  | `true`         | Mostrar metadatos por archivo (Nombre, Tamaño, Ruta relativa).                               |
| `metadataInsideFence` | boolean  | `false`        | Ubicar los metadatos dentro del bloque de código en lugar de fuera.                          |
| `excludeMarkdown`     | boolean  | `true`         | Omitir archivos `.md` al copiar.                                                             |
| `maxJsonBytes`        | number   | `200000`       | Tamaño máximo para incluir JSON completo; los más grandes se truncan con una marca.          |
| `ignoreGlobs`         | string[] | _(ver arriba)_ | Patrones glob a ignorar.                                                                     |

### Consejos

- Ideal para pegar contexto de código en **issues de GitHub, descripciones de PR, ChatGPT, Copilot Chat** o cualquier superficie que entienda Markdown.
- Aumenta `maxBytes` cuando compartas repositorios grandes; ten en cuenta el límite de pegado de la plataforma destino.
- Agrega patrones como `**/dist/**`, `**/*.lock` a `ignoreGlobs` para mantener la salida limpia.

### Limitaciones conocidas

- La detección de binarios es heurística — archivos de texto con muchos caracteres de control pueden tratarse como binarios.
- Valores muy bajos de `maxBytes` pueden resultar en solo una copia parcial del primer archivo.
- Imágenes y binarios se omiten por diseño; adjúntalos por separado si los necesitas.

### Instalación

Instala desde el [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator) o busca **MultiCopynator** en el panel de Extensiones.

### Licencia

MIT © 2025–presente Jan Pereira — ver [LICENSE](LICENSE).

</details>
