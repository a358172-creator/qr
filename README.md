# Vulnerabilidad del cerebro edad-dependiente

Experiencia WebGL interactiva sobre una sinapsis glutamatérgica, excitotoxicidad, calcio, disfunción mitocondrial y estrés oxidativo. Es un modelo conceptual educativo: no constituye una simulación cuantitativa ni una reconstrucción molecular a escala.

## Ejecutar localmente

Requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Vite mostrará la dirección local. Para crear una versión de producción:

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

La configuración de Vite usa rutas relativas (`base: './'`), por lo que `dist/` puede publicarse directamente desde una rama o mediante GitHub Actions.

1. Ejecuta `npm ci` y `npm run build` en el flujo de despliegue.
2. Publica el directorio generado `dist` con GitHub Pages.
3. En el repositorio, selecciona **Settings → Pages → GitHub Actions** como fuente, o usa una acción que publique `dist`.

No hay backend, claves API ni modelos remotos.
