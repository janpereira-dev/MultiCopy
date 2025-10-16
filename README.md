# MultiCopyneitor

[![VS Code Marketplace](https://vsmarketplacebadges.dev/version-short/janpereira-dev.multicopyneitor.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopyneitor)
[![Installs](https://vsmarketplacebadges.dev/installs-short/janpereira-dev.multicopyneitor.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopyneitor)
[![Rating](https://vsmarketplacebadges.dev/rating-short/janpereira-dev.multicopyneitor.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopyneitor)

- Selecciona varios archivos y/o carpetas en el Explorador.
- Click derecho → “Copiar selección como bloque”.
- Se copia al portapapeles con el formato:

  ````text
  ruta/archivo.ext
  ```<lang>
  contenido
  ```
  ````

- Respeta `multicopyneitor.maxBytes`. Omite binarios. Puede truncar el último archivo.

# Instalación local

```bash
npm i
npm run build
npx vsce package   # genera .vsix
# En VS Code: Extensiones → “Install from VSIX…”
```

# Ajustes recomendados en `settings.json`

```json
{
  "multicopy.maxBytes": 400000,
  "multicopy.includeHeaders": true,
  "multicopy.separator": "\n\n",
  "multicopy.ignoreGlobs": ["**/dist/**", "**/*.lock"]
}
```
