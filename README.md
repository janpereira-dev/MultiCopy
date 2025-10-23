# MultiCopynator — copy multiple files as one block

[![VS Code Marketplace](https://vsmarketplacebadges.dev/version-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)
[![Installs](https://vsmarketplacebadges.dev/installs-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)
[![Rating](https://vsmarketplacebadges.dev/rating-short/janpereira-dev.multicopynator.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)

VS Code extension that copies multiple files and folders as a single text block, including relative paths and content with language-aware code fences.

In VS Code Explorer:

- Select one or more files and/or folders.
- Right-click → “Copy selection as bundle”.
- The result is copied to your clipboard with optional metadata and triple backtick code fences.

## Example output

````text
- Name: "src/extension.ts"
- Size: "12345 bytes"
- Relative path: "src/extension.ts"
```ts
// file content…
```

```json
{ "package": "content…" }
```
````

## Features

- Copy multiple files and folders into a single text output, sorted by path.
- Language detection for code fences (```lang) based on file extension.
- Automatically skips binary files.
- Configurable glob filters (by default ignores node_modules, .git, images, PDFs, zips, etc.).
- Total size limit to avoid huge pastes (with smart truncation of the last file if needed).
- Configurable truncation for large JSON files.
- Option to exclude Markdown files from the copy.
- Optional per-file metadata (Name/Size/Relative path) outside or inside the code fence.
- Copy summary after completion: file count, approx. bytes, and any skips/truncation.

## Command

- Explorer context menu: “Copy selection as bundle” (id: `multicopy.copyAsBundle`).

## Settings

These settings live under `multicopy.*` in VS Code settings:

- `multicopy.maxBytes` (number, default 20000000)
  - Maximum total bytes to copy. If exceeded, the last file may be truncated.

- `multicopy.separator` (string, default "\n\n")
  - Separator between files in the final block.

- `multicopy.includeHeaders` (boolean, default true)
  - Include per-file metadata: Name, Size, Relative path.

- `multicopy.metadataInsideFence` (boolean, default false)
  - If true, metadata is placed inside the code fence; if false, outside.

- `multicopy.excludeMarkdown` (boolean, default true)
  - Exclude `.md` files from the copy.

- `multicopy.maxJsonBytes` (number, default 200000)
  - Maximum size for including full JSON. Larger files are truncated and marked accordingly.

- `multicopy.ignoreGlobs` (array of strings)
  - Glob patterns to ignore. By default: `**/node_modules/**`, `**/.git/**`, `**/*.png`, `**/*.jpg`, `**/*.jpeg`, `**/*.gif`, `**/*.pdf`, `**/*.zip`.

## How it works

- Folders are expanded recursively when selected.
- Output is sorted alphabetically by path for stable results.
- Binary detection uses a simple heuristic and skips likely-binary files.
- JSON truncation is controlled by `multicopy.maxJsonBytes`, independent from the global `multicopy.maxBytes` limit.
- If nothing remains after filters (e.g., binary or ignored by globs), a warning is shown.

## Installation

- Marketplace: [janpereira-dev.multicopynator](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)

## Localization

The extension is localized (es, es-ES, pt-BR, pt-PT, en-US).

## Untrusted workspaces

Works in untrusted workspaces. It only reads files to build the copied block.

## Tips

- Great for sharing code context in issues, PRs, or chat, keeping paths and syntax highlighting.
- Adjust `maxBytes` for larger shares; mind the target platform limits where you paste.
- Customize `ignoreGlobs` to filter artifacts (dist, build, .lock, etc.).

## Known limitations

- Binary detection is heuristic; some unusual text files might be treated as binary.
- Very low `maxBytes` values can result in a partial copy of the first file only.
- Images and binaries are skipped by design; attach them separately if needed.

## License

MIT © 2024–present — see `LICENSE`.

## Español

Extensión para Visual Studio Code que permite copiar múltiples archivos y carpetas como un único bloque de texto, incluyendo rutas relativas y contenidos con resaltado por lenguaje.

En el Explorador de VS Code:

- Selecciona uno o varios archivos y/o carpetas.
- Clic derecho → “Copiar selección como bloque”.
- El resultado se copia al portapapeles con metadatos opcionales y bloques de código con triple acento grave.

### Ejemplo de salida

````text
- Name: "src/extension.ts"
- Size: "12345 bytes"
- Relative path: "src/extension.ts"
```ts
// contenido del archivo…
```

```json
{ "package": "contenido…" }
```
````

### Características

- Copia múltiples archivos y carpetas como un texto único, ordenado por ruta.
- Detección de lenguaje para las cercas de código (```lang) según la extensión.
- Omite archivos binarios automáticamente.
- Filtrado por patrones glob configurables (por defecto ignora node_modules, .git, imágenes, PDFs, zips, etc.).
- Límite total de bytes para evitar desbordes (con truncado inteligente del último archivo si es necesario).
- Truncado configurable para JSON grande (evita pegar JSONs enormes completos).
- Posibilidad de excluir Markdown del copiado.
- Metadatos opcionales por archivo (Nombre/Tamaño/Ruta relativa) fuera o dentro del bloque de código.
- Mensaje de estado tras copiar: cuenta de archivos, bytes aproximados y avisos (saltados/truncados).

### Comando

- Menú contextual del Explorador: “Copiar selección como bloque” (id: `multicopy.copyAsBundle`).

### Configuración

Estos ajustes están bajo `multicopy.*` en la configuración de VS Code:

- `multicopy.maxBytes` (number, por defecto 20000000)
  - Límite máximo de bytes del bloque total a copiar. Si se excede, el último archivo puede truncarse.

- `multicopy.separator` (string, por defecto "\n\n")
  - Texto separador entre cada archivo en el bloque final.

- `multicopy.includeHeaders` (boolean, por defecto true)
  - Incluye metadatos por archivo: Nombre, Tamaño y Ruta relativa.

- `multicopy.metadataInsideFence` (boolean, por defecto false)
  - Si es true, los metadatos se colocan dentro de la cerca de código; si es false, fuera.

- `multicopy.excludeMarkdown` (boolean, por defecto true)
  - Excluye archivos `.md` del copiado.

- `multicopy.maxJsonBytes` (number, por defecto 200000)
  - Tamaño máximo para incluir JSON completo. Si el archivo JSON sobrepasa este límite, se corta y se añade una marca de truncado.

- `multicopy.ignoreGlobs` (array de cadenas)
  - Patrones glob a ignorar. Por defecto incluye: `**/node_modules/**`, `**/.git/**`, `**/*.png`, `**/*.jpg`, `**/*.jpeg`, `**/*.gif`, `**/*.pdf`, `**/*.zip`.

### Detalles de funcionamiento

- Los archivos se expanden al seleccionar carpetas, y se listan de forma recursiva.
- El orden final está alfabetizado por ruta para obtener salidas consistentes.
- Detección de binarios por inspección del contenido; si parece binario, se omite.
- Para JSON, el truncado respeta `multicopy.maxJsonBytes` de forma independiente al límite total `multicopy.maxBytes`.
- Cuando no hay nada que copiar tras filtros (p. ej., todo binario o globs), se muestra un aviso.

### Instalación

- Marketplace: [janpereira-dev.multicopynator](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopynator)

### Idiomas

La extensión está localizada (es, es-ES, pt-BR, pt-PT, en-US).

### Permisos y espacios de trabajo no confiables

Funciona en espacios no confiables. Solo lee archivos para construir el bloque a copiar.

### Sugerencias de uso

- Útil para compartir contextos de código en issues, PRs o chats, conservando rutas y resaltado.
- Ajusta `maxBytes` si planeas compartir repos grandes; ten en cuenta las restricciones de cada plataforma donde lo pegarás.
- Personaliza `ignoreGlobs` para filtrar artefactos (dist, build, .lock, etc.).

### Limitaciones conocidas

- La detección de binarios es heurística; archivos de texto con caracteres de control atípicos pueden considerarse binarios.
- Si el límite `maxBytes` es muy bajo, podrías obtener solo un parcial del primer archivo.
- Imágenes y binarios se omiten por diseño; si necesitas incluirlos, adjúntalos por separado.

### Licencia

MIT © 2024–presente — ver `LICENSE`.
