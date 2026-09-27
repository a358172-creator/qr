# NEURO·VISTA

**Atlas 3D interactivo de mecanismos de neurotoxicidad.** La exploración comienza en una neurona, se aproxima a la dendrita y entra en una de sus espinas para estudiar la sinapsis glutamatérgica. Una cámara recorre estas escalas dentro de un mismo mundo 3D.

Esta primera implementación se concentra en la neurona, la dendrita, la espina y un único módulo: **excitotoxicidad glutamatérgica**. Las etiquetas de disfunción mitocondrial, señalización celular, activación microglial y apoptosis son marcadores para futuras ampliaciones; todavía no abren módulos.

## Ejecutar

Node.js **22.12 o posterior** (también compatible con 20.19+).

```bash
npm ci
npm run dev
```

Producción:

```bash
npm run build
npm run preview
```

El resultado está en `dist/`. La aplicación necesita WebGL 2 para mostrar el modelo. Si no está disponible, muestra un aviso y permite acceder a las referencias.

## Compartir y subir la web

```bash
npm run package
```

Genera `release/neurovista-web.zip`, listo para descomprimir y subir al hosting, y `release/neurovista-proyecto.zip`, con el proyecto editable. El ZIP web contiene `index.html`, `assets/` y `.nojekyll`; no necesita Node.js en el servidor. También se generan instrucciones breves y sumas SHA-256.

Sigue [PUBLICAR.md](PUBLICAR.md) para subir los archivos, utilizar GitHub Pages o entregar el proyecto a otra persona. Cada compilación verifica las rutas y la presencia de los recursos locales.

## Explorar

- La introducción acerca la cámara desde la neurona a la dendrita. Seleccionar el punto de excitotoxicidad glutamatérgica abre el detalle de esa misma sinapsis mediante una transición de cámara.
- Arrastrar para orbitar y usar la rueda o un gesto de pinza para acercarse, con límites de cámara. Durante el recorrido narrativo, pausar o pulsar **Explorar** para moverla libremente.
- Con el canvas enfocado: flechas para orbitar, `+` / `−` para zoom y `Home` para restablecer la vista.
- Seleccionar estructuras directamente o desde sus etiquetas para abrir una explicación breve. `Escape` cierra la información.
- Reproducir, pausar, avanzar, retroceder o elegir una de las seis etapas: glutamato → AMPA → NMDA → Ca²⁺ → mitocondria → ROS.
- **Explorar** detiene el reloj narrativo y el movimiento biológico. **Continuar** reanuda desde el instante conservado. **Reiniciar** vuelve al comienzo del módulo.
- **Volver a la dendrita** invierte la aproximación; la navegación de escala también permite regresar a la neurona.
- `prefers-reduced-motion` omite la introducción y los desplazamientos animados de cámara. La narrativa comienza pausada.

## Arquitectura

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `src/styles.css` | Composición editorial, controles semánticos y disposición responsive |
| `src/main.js` | Carga diferida de WebGL, integración y alternativa sin gráficos |
| `src/interactions.js`, `src/content.js` | Controles, navegación y explicaciones contextuales |
| `src/scene.js` | Mundo compartido, iluminación, integración de anatomía y narrativa, render y limpieza |
| `src/atlas/neuron.js`, `src/atlas/organic.js` | Neurona, bifurcaciones fusionadas, espinas, superficies y materiales procedurales |
| `src/atlas/axon.js` | Continuidad de la terminal presináptica con el axón aferente |
| `src/atlas/config.js` | Catálogo de mecanismos y disponibilidad |
| `src/core/camera.js` | Transiciones entre escalas y control de cámara |
| `src/core/interaction.js`, `src/core/annotations.js` | Selección espacial, etiquetas y puntos de navegación |
| `src/core/timeline.js` | Reloj narrativo, pausa, reanudación y navegación por etapas |
| `src/mechanisms/glutamate.js` | Las seis etapas, sus duraciones, focos e intensidades ilustrativas |
| `src/scene/geometry.js` | Superficies orgánicas, texturas procedurales y materiales |
| `src/scene/anatomy.js` | Terminal, espina, receptores y mitocondria en corte con crestas |
| `src/scene/particles.js` | Partículas instanciadas y trayectorias de glutamato, Na⁺, Ca²⁺ y ROS |
| `content/` | Leyendas editoriales, alcance del modelo y bibliografía |

El soma y las ramas se construyen mediante una unión suave de campos de distancia, convertida en una superficie continua. Las espinas y la anatomía sináptica usan superficies procedurales; las secciones de membrana revelan su interior. La sinapsis se coloca sobre la dendrita y permanece en las mismas coordenadas durante la exploración.

La anatomía se genera localmente: no se descargan modelos GLB/GLTF ni texturas. Three.js es la única dependencia de ejecución; Vite sirve y compila la aplicación. Esta arquitectura no añade dependencias, backend ni claves API. El catálogo y la narrativa están separados de los controladores; incorporar otro mecanismo requiere implementar su anatomía y conectarla al gestor de escena, además de habilitar su entrada en el catálogo.

## GitHub Pages

El flujo `.github/workflows/pages.yml` instala con `npm ci`, ejecuta las pruebas, compila y publica `dist/` al recibir cambios en `main`. Las pull requests ejecutan las pruebas y la compilación. Las acciones están fijadas por SHA.

En **Settings → Pages → Source**, seleccionar **GitHub Actions**. `base: './'` mantiene relativos los recursos y los módulos de carga diferida, por lo que el resultado funciona bajo `/qr/` y en otros prefijos. La sección de fuentes utiliza `#references` y admite acceso directo sin rutas de servidor adicionales.

La comprobación local de un prefijo de proyecto no modifica la configuración remota ni publica los cambios. Documentación de despliegue: [Vite / GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Alcance científico y técnico

Representación conceptual, no simulación cuantitativa ni reconstrucción molecular. Las escalas, partículas, intensidades y duraciones son ilustrativas. La mitocondria se ubica en la espina por claridad didáctica, sin generalizar esa localización. Se omiten visualmente astrocitos, recaptación, Mg²⁺ y coagonistas; el texto sí explica las condiciones de apertura de NMDA. La escena no compara grupos de edad ni calcula riesgos individuales. Los procesos pueden coexistir y retroalimentarse; el daño no es un desenlace inevitable.

El aspecto y la velocidad de render dependen de la GPU, del navegador y de WebGL 2. Una captura o una prueba con render por software no acredita el rendimiento en otros dispositivos.

## Revisión visual y pruebas

`npm test` comprueba la continuidad y orientación de la geometría, las transiciones de cámara y la pausa del reloj narrativo.

Consultar el [registro de validación](docs/validation.md) para conocer las comprobaciones realizadas y sus límites.
