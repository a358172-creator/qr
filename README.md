# NEURO·VISTA

**Atlas 3D interactivo de mecanismos de neurotoxicidad.** La exploración comienza en una neurona y se aproxima a la dendrita, que permite entrar en cuatro microambientes celulares. Una cámara recorre estas escalas dentro de un mismo mundo 3D.

Los módulos disponibles son **excitotoxicidad glutamatérgica**, **disfunción mitocondrial, especies reactivas y daño de membranas**, **remodelado microglial** y **plasticidad sináptica**. Se conserva el alcance de los paneles **B, D, C y A** descrito en la documentación científica. B distingue remodelado local de una posibilidad intrínseca de señalización apoptótica. C muestra una microglía ramificada en contacto con una espina en remodelado, mientras una vecina permanece estable. A muestra una conexión fisiológica con organización postsináptica y actina. No se añade un módulo independiente de apoptosis.

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

## Subir la web

Tras `npm run build`, se puede servir el contenido de `dist/` en un hosting estático. La web compilada no necesita Node.js en el servidor. Cada compilación verifica las rutas y la presencia de los recursos locales. La configuración de GitHub Pages se describe más abajo; no es necesario generar archivos de entrega ni paquetes ZIP.

## Explorar

- La introducción acerca la cámara desde la neurona a la dendrita. El punto de excitotoxicidad glutamatérgica abre el detalle de esa misma sinapsis. El de disfunción mitocondrial conduce hacia una región de membrana y su compartimento intracelular. El de microglía revela dos espinas y la célula ramificada próxima a ellas. El de plasticidad sináptica aproxima la cámara a una espina y su organización postsináptica.
- Arrastrar para orbitar y usar la rueda o un gesto de pinza para acercarse, con límites de cámara. Durante el recorrido narrativo, pausar o pulsar **Explorar** para moverla libremente.
- Con el canvas enfocado: flechas para orbitar, `+` / `−` para zoom y `Home` para restablecer la vista.
- Seleccionar estructuras directamente, desde sus etiquetas o mediante el selector **Estructuras** para abrir una explicación breve. El selector incluye las estructuras disponibles en la etapa actual y funciona con teclado. `Escape` cierra la información.
- Reproducir, pausar, avanzar, retroceder o elegir una etapa: B tiene ocho; A, C y D conservan seis. B recorre glutamato, AMPA, NMDA, Ca²⁺, mitocondria y ROS antes de presentar dos posibilidades diferenciadas: remodelado local y vía intrínseca contextual. D presenta entrada de Ca²⁺, señales reactivas, membranas, disfunción mitocondrial, AIF y contexto nuclear e integración del daño. C pasa de sinapsis conservada a alteración local, complemento y caspasa-3, aproximación, contacto y remodelado. A recorre arquitectura basal, NMDAR y Ca²⁺ moderado, PSD-95 y DISC1, Kalirin-7, actina y una vista conjunta. El orden guía la observación; no establece cadenas universales.
- Las fichas incluyen **Qué observar** para relacionar la explicación con la geometría. **Comprender el mecanismo** amplía el contenido y pausa el recorrido para leer. **Enfocar estructura** centra esa geometría, conserva la selección y cierra la ficha para dejar visible el modelo; la explicación puede abrirse de nuevo desde Estructuras.
- **Explorar** detiene el reloj narrativo y el movimiento biológico. **Continuar** reanuda desde el instante conservado. **Reiniciar** vuelve al comienzo del módulo.
- **Volver a la dendrita** invierte la aproximación y permite elegir otro mecanismo. Los módulos glutamatérgico y mitocondrial conservan su etapa y estado por separado. Los módulos microglial y de plasticidad vuelven a su estado basal al salir; entrar de nuevo comienza un recorrido nuevo. La navegación de escala también permite regresar a la neurona.
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
| `src/mechanisms/glutamate.js` | Definición de B, ocho etapas, contenido y fábrica de escena |
| `src/mechanisms/mitochondrial-dysfunction.js` | Definición del panel D, seis etapas, siete cámaras, estados y contenido de estructuras |
| `src/mechanisms/microglia.js` | Definición del panel C, seis etapas, encuadres, contenido y reinicio al salir |
| `src/mechanisms/synaptic-plasticity.js` | Definición del panel A, seis etapas, encuadres, contenido y reinicio al salir |
| `src/scene/geometry.js` | Superficies orgánicas, texturas procedurales y materiales |
| `src/scene/anatomy.js` | Terminal, espina, receptores y mitocondria en corte con crestas |
| `src/scene/glutamate-environment.js` | Anatomía local de B, mitocondria dendrítica proximal y posibilidades local/intrínseca diferenciadas |
| `src/scene/mitochondrial-environment.js` | Membrana, proteínas estilizadas, especies reactivas, peroxidación local y señal AIF |
| `src/scene/mitochondrial-organelle.js` | Mitocondria en corte, membranas externa e interna y crestas |
| `src/scene/microglia-environment.js` | Dendrita, dos espinas, señales locales y coordinación del contacto y remodelado |
| `src/scene/microglia-cell.js` | Superficie ramificada de la microglía y deformación de sus procesos con soma estable |
| `src/scene/plasticity-environment.js` | Espina continua con la dendrita, terminal, NMDAR, densidad postsináptica y complejos estructurales |
| `src/scene/actin-network.js` | Filamentos curvos en profundidad, ramificación localizada y remodelado reversible de la red de actina |
| `src/scene/particles.js` | Partículas instanciadas y trayectorias de glutamato, Na⁺, Ca²⁺ y ROS |
| `src/scene/molecular-particles.js` | Utilidades de partículas instanciadas y formas diferenciadas de especies |
| `content/` | Leyendas editoriales, alcance del modelo y bibliografía |
| `docs/panel-a.md`, `docs/panel-b.md`, `docs/panel-c.md`, `docs/panel-d.md`, `docs/scientific-notes.md` | Correspondencia científica, fuentes verificables y límites de los cuatro recorridos |

El soma y las ramas se construyen mediante una unión suave de campos de distancia, convertida en una superficie continua. Las espinas y la anatomía sináptica usan superficies procedurales; las secciones de membrana revelan su interior. Cada microambiente es una sección ampliada junto a su región dendrítica. B usa una anatomía propia para situar la mitocondria proximal sin deformar la dendrita principal.

La anatomía se genera localmente: no se descargan modelos GLB/GLTF ni texturas. Three.js es la única dependencia de ejecución; Vite sirve y compila la aplicación. Esta arquitectura no añade dependencias, backend ni claves API.

Cada definición de mecanismo aporta contenido, etapas, encuadres y una fábrica de objetos 3D. El registro carga su módulo cuando se solicita; una sesión mantiene su estado y tiempo. El gestor conserva un único renderer, cámara, OrbitControls y sistema de selección, anotaciones e interfaz. Los módulos reutilizan el mismo controlador de timeline y no crean otra página ni sus propios controles. Para añadir uno se implementan su definición y fábrica, se registra su carga y se habilita su región en el catálogo.

La microglía mantiene soma y uniones proximales estables mientras su proceso distal se extiende mediante un arco tridimensional. Su extremo sigue un punto de la membrana real de la espina durante la retracción. C1q y C3 permanecen al exterior; caspasa-3, al interior. La cabeza deja un remanente reconocible y la vecina conserva exactamente su geometría. El reloj integra cada tramo narrativo; pausa detiene la deformación conservando cámara y selección. `resetOnExit` restablece la sesión al salir.

La escena de plasticidad conserva la pared interna de ambos cortes de membrana e integra una densidad postsináptica con capas conectadas y dominios orgánicos, complejos orgánicos de PSD-95, DISC1 y Kalirin-7, y filamentos de actina distribuidos en la cabeza y el cuello. El remodelado cambia gradualmente orientaciones y ramificaciones locales junto con una deformación leve de la cabeza. Pausar congela la geometría y las posiciones biológicas; la transparencia de la membrana puede seguir ajustándose al acercamiento de la cámara. Seleccionar actina destaca sus filamentos y atenúa discretamente el contexto. Este módulo también utiliza `resetOnExit`.

## GitHub Pages

El flujo `.github/workflows/pages.yml` instala con `npm ci`, ejecuta las pruebas, compila y publica `dist/` al recibir cambios en `main`. Las pull requests ejecutan las pruebas y la compilación. Las acciones están fijadas por SHA.

En **Settings → Pages → Source**, seleccionar **GitHub Actions**. `base: './'` mantiene relativos los recursos y los módulos de carga diferida, por lo que el resultado funciona bajo `/qr/` y en otros prefijos. La sección de fuentes utiliza `#references` y admite acceso directo sin rutas de servidor adicionales.

La comprobación local de un prefijo de proyecto no modifica la configuración remota ni publica los cambios. Documentación de despliegue: [Vite / GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Alcance científico y técnico

Representación conceptual, no simulación cuantitativa ni reconstrucción molecular. Las escalas, partículas, intensidades y duraciones son ilustrativas. En B la mitocondria ocupa un segmento dendrítico proximal conectado con la espina. Se omiten visualmente astrocitos, recaptación, Mg²⁺ y coagonistas; el texto sí explica las condiciones de NMDA. No se comparan grupos de edad ni se calculan riesgos individuales. Los procesos pueden coexistir y retroalimentarse; el daño no es inevitable.

La Figura 1 original no está accesible en esta fase. Dos archivos de referencia del repositorio están vacíos; `assets/image.png` es un mockup de interfaz. Las relaciones documentadas se contrastan con fuentes primarias sin inventar la procedencia de la figura. No se presentan resultados experimentales propios ni mediciones de homogeneizados cerebrales.

B diferencia la caspasa-3 local y retracción de la espina de otra posibilidad: liberación de citocromo c desde el espacio intermembranal, Apaf-1/caspasa-9 y caspasas ejecutoras. La última etapa no es consecuencia obligatoria de la anterior ni simula muerte neuronal completa. La cabeza basal de esa vista indica un escenario alternativo, no recuperación biológica. Fuentes y límites en [panel-b.md](docs/panel-b.md).

El segundo mecanismo conserva el alcance documentado de D. NO, O₂•⁻, ONOO⁻ y ROS mitocondrial tienen identidades diferenciadas. El peroxinitrito requiere NO y superóxido; la liberación de AA por cPLA₂ se distingue de la peroxidación. PTP representa transición de permeabilidad interna, distinta de permeabilización externa. AIF puede participar en daño independiente de caspasas y se desplaza hacia un contexto nuclear comprimido, sin atravesar PTP ni situar un núcleo en la dendrita. Fuentes y matices en [panel-d.md](docs/panel-d.md).

El tercero conserva el alcance documentado de C. C1q y C3 son complejos extracelulares estilizados; CASP3 permanece intracelular. El complemento no es marcador universal de daño ni caspasa-3 una señal extracelular de reclutamiento. El contacto y la reducción de una espina ilustran una posibilidad de remodelado local, sin apoptosis neuronal ni fagocitosis completa. Fuentes y límites en [panel-c.md](docs/panel-c.md).

El cuarto conserva el alcance documentado de A. NMDAR permite una entrada moderada de Ca²⁺ en una conexión conservada; PSD-95, DISC1 y Kalirin-7 sitúan relaciones conceptuales con su organización y remodelado. Las proteínas coexisten: los cambios de foco no representan una cadena obligatoria de activaciones ni añaden intermediarios al alcance documentado. La red de actina y el cambio sutil de volumen de la cabeza ilustran plasticidad estructural sin cuantificar fuerza sináptica. Esta escena no incluye ROS, microglía, daño de membranas ni apoptosis. Las fuentes y convenciones se documentan en [panel-a.md](docs/panel-a.md).

El aspecto y la velocidad de render dependen de la GPU, del navegador y de WebGL 2. Una captura o una prueba con render por software no acredita el rendimiento en otros dispositivos.

## Revisión visual y pruebas

`npm test` ejecuta las comprobaciones de geometría, cámara, reloj narrativo y sesiones. Las pruebas de sesión cubren historias independientes, congelación del estado durante la exploración, reanudación, navegación y reinicio, incluido el restablecimiento opcional al salir de un módulo.

Consultar el [informe técnico de la fase 1](docs/phase1-report.md) y el [registro de validación](docs/validation.md) para conocer los cambios, capturas, comprobaciones y límites.
