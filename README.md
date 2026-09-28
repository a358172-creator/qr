# NEURO·VISTA

**Atlas 3D interactivo de mecanismos de neurotoxicidad.** La exploración comienza en una neurona y se aproxima a la dendrita, que permite entrar en dos microambientes celulares. Una cámara recorre estas escalas dentro de un mismo mundo 3D.

Los módulos disponibles son **excitotoxicidad glutamatérgica** y **disfunción mitocondrial, especies reactivas y daño de membranas**. El segundo traduce exclusivamente las relaciones del **panel D** de la referencia científica aportada en un compartimento 3D; no añade los paneles A, B o C. Señalización celular, activación microglial y apoptosis general permanecen como regiones futuras.

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

- La introducción acerca la cámara desde la neurona a la dendrita. El punto de excitotoxicidad glutamatérgica abre el detalle de esa misma sinapsis. El de disfunción mitocondrial conduce hacia una región de membrana y su compartimento intracelular.
- Arrastrar para orbitar y usar la rueda o un gesto de pinza para acercarse, con límites de cámara. Durante el recorrido narrativo, pausar o pulsar **Explorar** para moverla libremente.
- Con el canvas enfocado: flechas para orbitar, `+` / `−` para zoom y `Home` para restablecer la vista.
- Seleccionar estructuras directamente, desde sus etiquetas o mediante el selector **Estructuras** para abrir una explicación breve. El selector incluye las estructuras disponibles en la etapa actual y funciona con teclado. `Escape` cierra la información.
- Reproducir, pausar, avanzar, retroceder o elegir una de las seis etapas de cada mecanismo. El glutamatérgico conserva glutamato → AMPA → NMDA → Ca²⁺ → mitocondria → ROS. El mitocondrial presenta entrada de Ca²⁺, señales reactivas, daño de membranas, disfunción mitocondrial, AIF y contexto nuclear, e integración del daño.
- **Explorar** detiene el reloj narrativo y el movimiento biológico. **Continuar** reanuda desde el instante conservado. **Reiniciar** vuelve al comienzo del módulo.
- **Volver a la dendrita** invierte la aproximación y permite elegir otro mecanismo. Cada recorrido conserva su etapa y estado por separado. La navegación de escala también permite regresar a la neurona.
- `prefers-reduced-motion` omite la introducción y los desplazamientos animados de cámara. La narrativa comienza pausada.

## Arquitectura

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `src/styles.css` | Composición editorial, controles semánticos y disposición responsive |
| `src/main.js` | Carga diferida de WebGL, integración y alternativa sin gráficos |
| `src/interactions.js`, `src/content.js` | Interfaz compartida, navegación y contenido sináptico reutilizado |
| `src/scene.js` | Mundo compartido, iluminación, integración de anatomía y narrativa, render y limpieza |
| `src/atlas/neuron.js`, `src/atlas/organic.js` | Neurona, bifurcaciones fusionadas, espinas, superficies y materiales procedurales |
| `src/atlas/axon.js` | Continuidad de la terminal presináptica con el axón aferente |
| `src/atlas/config.js` | Catálogo de mecanismos y disponibilidad |
| `src/core/camera.js` | Transiciones entre escalas y control de cámara |
| `src/core/interaction.js`, `src/core/annotations.js` | Selección espacial, etiquetas y puntos de navegación |
| `src/core/timeline.js` | Reloj narrativo, pausa, reanudación y navegación por etapas |
| `src/core/mechanism-session.js` | Estado y tiempo independientes por módulo; pausa, búsqueda de etapas y reinicio coherentes |
| `src/mechanisms/registry.js` | Registro de módulos y carga diferida por identificador |
| `src/mechanisms/glutamate.js` | Definición del primer mecanismo, contenido, seis etapas y fábrica de escena |
| `src/mechanisms/mitochondrial-dysfunction.js` | Definición del panel D, seis etapas, siete cámaras, estados y contenido de estructuras |
| `src/scene/geometry.js` | Superficies orgánicas, texturas procedurales y materiales |
| `src/scene/anatomy.js` | Terminal, espina, receptores y mitocondria en corte con crestas |
| `src/scene/glutamate-environment.js` | Adaptación de la anatomía sináptica existente al contrato compartido de módulos |
| `src/scene/mitochondrial-environment.js` | Membrana, proteínas estilizadas, especies reactivas, peroxidación local y señal AIF |
| `src/scene/mitochondrial-organelle.js` | Mitocondria en corte, membranas externa e interna y crestas |
| `src/scene/particles.js` | Partículas instanciadas y trayectorias de glutamato, Na⁺, Ca²⁺ y ROS |
| `src/scene/molecular-particles.js` | Utilidades de partículas instanciadas y formas diferenciadas de especies |
| `content/` | Leyendas editoriales, alcance del modelo y bibliografía |
| `docs/panel-d.md`, `docs/scientific-notes.md` | Correspondencia científica del segundo mecanismo y límites de ambos recorridos |

El soma y las ramas se construyen mediante una unión suave de campos de distancia, convertida en una superficie continua. Las espinas y la anatomía sináptica usan superficies procedurales; las secciones de membrana revelan su interior. La sinapsis se coloca sobre la dendrita y permanece en las mismas coordenadas durante la exploración.

La anatomía se genera localmente: no se descargan modelos GLB/GLTF ni texturas. Three.js es la única dependencia de ejecución; Vite sirve y compila la aplicación. Esta arquitectura no añade dependencias, backend ni claves API.

Cada definición de mecanismo aporta contenido, etapas, encuadres y una fábrica de objetos 3D. El registro carga su módulo cuando se solicita; una sesión mantiene su estado y tiempo. El gestor conserva un único renderer, cámara, OrbitControls y sistema de selección, anotaciones e interfaz. Los módulos reutilizan el mismo controlador de timeline y no crean otra página ni sus propios controles. Para añadir uno se implementan su definición y fábrica, se registra su carga y se habilita su región en el catálogo.

## GitHub Pages

El flujo `.github/workflows/pages.yml` instala con `npm ci`, ejecuta las pruebas, compila y publica `dist/` al recibir cambios en `main`. Las pull requests ejecutan las pruebas y la compilación. Las acciones están fijadas por SHA.

En **Settings → Pages → Source**, seleccionar **GitHub Actions**. `base: './'` mantiene relativos los recursos y los módulos de carga diferida, por lo que el resultado funciona bajo `/qr/` y en otros prefijos. La sección de fuentes utiliza `#references` y admite acceso directo sin rutas de servidor adicionales.

La comprobación local de un prefijo de proyecto no modifica la configuración remota ni publica los cambios. Documentación de despliegue: [Vite / GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Alcance científico y técnico

Representación conceptual, no simulación cuantitativa ni reconstrucción molecular. Las escalas, partículas, intensidades y duraciones son ilustrativas. La mitocondria se ubica en la espina por claridad didáctica, sin generalizar esa localización. Se omiten visualmente astrocitos, recaptación, Mg²⁺ y coagonistas; el texto sí explica las condiciones de apertura de NMDA. La escena no compara grupos de edad ni calcula riesgos individuales. Los procesos pueden coexistir y retroalimentarse; el daño no es un desenlace inevitable.

El segundo mecanismo utiliza como referencia principal el panel D aportado por el usuario. NO, O₂•⁻, ONOO⁻ y ROS mitocondrial tienen formas y etiquetas diferenciadas. El peroxinitrito requiere la reacción entre NO y superóxido; la liberación de AA por cPLA₂ se distingue de la peroxidación lipídica. PTP es una representación funcional sin estructura molecular afirmada. AIF se desplaza hacia un contexto nuclear a distancia comprimida, sin atravesar ese poro ni situar un núcleo dentro de la dendrita. La apoptosis aparece sólo como posible consecuencia conceptual final. Las fuentes primarias y los matices están documentados en [panel-d.md](docs/panel-d.md).

El aspecto y la velocidad de render dependen de la GPU, del navegador y de WebGL 2. Una captura o una prueba con render por software no acredita el rendimiento en otros dispositivos.

## Revisión visual y pruebas

`npm test` comprueba la continuidad y orientación de la geometría, las transiciones de cámara y la pausa del reloj narrativo. Las pruebas de sesión verifican historias independientes, congelación del estado durante la exploración, reanudación, navegación y reinicio coherentes, límites de tiempo y consistencia de las definiciones del panel D.

Consultar el [registro de validación](docs/validation.md) para conocer las comprobaciones realizadas y sus límites.
