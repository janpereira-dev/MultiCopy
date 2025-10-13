# `README.md` (uso rápido)

- Selecciona varios archivos y/o carpetas en el Explorador.
- Click derecho → “Copiar selección como bloque”.
- Se copia al portapapeles con el formato:

  ````
  ruta/archivo.ext
  ```<lang>
  contenido
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
