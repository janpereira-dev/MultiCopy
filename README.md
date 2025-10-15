# MultiCopy

[![VS Code Marketplace](https://vsmarketplacebadges.dev/version-short/janpereira-dev.multicopy.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopy)
[![Installs](https://vsmarketplacebadges.dev/installs-short/janpereira-dev.multicopy.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopy)
[![Rating](https://vsmarketplacebadges.dev/rating-short/janpereira-dev.multicopy.svg)](https://marketplace.visualstudio.com/items?itemName=janpereira-dev.multicopy)


- Selecciona varios archivos y/o carpetas en el Explorador.
- Click derecho → “Copiar selección como bloque”.
- Se copia al portapapeles con el formato:

  ````text
  ruta/archivo.ext
  ```<lang>
  contenido
  ```
  ````

- Respeta `multicopy.maxBytes`. Omite binarios. Puede truncar el último archivo.

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
