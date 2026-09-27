# Compartir y publicar NEURO·VISTA

Para subir la web, utiliza **`release/neurovista-web.zip`**. Contiene la página ya compilada y todos sus recursos; el servidor no necesita instalar Node.js ni ejecutar comandos.

## 1. Subir los archivos a un hosting

1. Descarga `neurovista-web.zip` y descomprímelo.
2. Sube **todo el contenido** al directorio público de tu hosting, por ejemplo `public_html`, o a una carpeta dentro de él. Si tu gestor de archivos permite extraer ZIP, puedes subirlo y extraerlo directamente allí.
3. Abre la dirección de esa carpeta en el navegador. El resultado debe conservar esta estructura:

```text
directorio-publico/
├── index.html
├── assets/
│   └── archivos .js y .css generados
└── .nojekyll
```

`index.html` y `assets/` deben quedar juntos. No hace falta subir el ZIP como archivo descargable: el hosting debe servir su contenido descomprimido. La carpeta puede estar en la raíz del sitio o en una ruta como `/atlas/`; las rutas de los recursos son relativas.

Abre la página mediante su URL HTTP/HTTPS. El doble clic sobre `index.html` usa `file://`, que no sirve correctamente los módulos JavaScript de esta aplicación. Para revisar la compilación en tu equipo, usa `npm run preview` desde el proyecto editable; ese servidor es solo para pruebas locales. [Guía oficial de despliegue de Vite](https://vite.dev/guide/static-deploy.html).

El navegador necesita WebGL 2 para mostrar el modelo. La web no requiere backend, base de datos, claves API ni descargas externas de modelos.

## 2. Publicar el proyecto en GitHub Pages

Esta opción utiliza el código editable y el workflow incluido en `.github/workflows/pages.yml`.

1. Lleva los archivos del proyecto a la rama `main` del repositorio, incluida la carpeta oculta `.github`. No subas `node_modules/` ni los ZIP de `release/`.
2. En el repositorio, abre **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**.
3. Al guardar los cambios en `main`, el workflow ejecuta la instalación, las pruebas y la compilación, y despliega `dist/`. También puedes iniciarlo desde **Actions → Build and deploy GitHub Pages → Run workflow** seleccionando `main`.
4. Cuando termine, abre la dirección que aparece en **Settings → Pages** o en el despliegue de **Actions**.

Subir el ZIP como archivo al repositorio no publica su contenido. Para esta opción, sube o sincroniza los archivos del **proyecto editable**. El workflow publica la compilación resultante. [Configuración oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 3. Entregar el proyecto a otra persona

Envía **`release/neurovista-proyecto.zip`**. Al extraerlo aparece la carpeta `neurovista-proyecto/` con código, contenido, referencias, pruebas e instrucciones.

Con Node.js 22.12 o posterior instalado, abre una terminal dentro de esa carpeta:

```bash
npm ci
npm run dev
```

Para generar de nuevo los archivos de entrega después de editar:

```bash
npm test
npm run package
```

Se crearán:

| Archivo | Uso |
| --- | --- |
| `release/neurovista-web.zip` | Web compilada para subir al hosting |
| `release/neurovista-proyecto.zip` | Código editable para compartir |
| `release/LEEME.txt` | Instrucciones breves para el destinatario |
| `release/SHA256SUMS.txt` | Comprobar integridad de los ZIP después de copiarlos |

El empaquetado funciona con Node.js en Windows, macOS y Linux; no necesita herramientas ZIP ni Python. Comprueba que los recursos enlazados y los módulos diferidos estén presentes y utilicen rutas relativas. Los ZIP no incluyen dependencias instaladas, historial Git ni archivos locales de configuración del editor.

## Actualizar una página publicada

Después de modificar el proyecto, ejecuta `npm run package` y sube el contenido del nuevo ZIP web. Conserva la carpeta `assets/` junto a `index.html`; los nombres de los recursos cambian con cada compilación. En GitHub Pages, guardar los cambios en `main` activa automáticamente el workflow.
