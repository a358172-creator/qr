# Validación · fase 1 (8 de octubre de 2026)

Esta sección corresponde al refinamiento anatómico y científico de la fase 1. El contenido posterior se conserva como **histórico** y sus cifras no describen la revisión actual. El [informe técnico](phase1-report.md) distingue mejoras comprobadas, límites y trabajo de una segunda fase.

## Pruebas y compilación

- `npm test`: **85 casos en 11 archivos**, todos aprobados. Node resume por archivo: 11 aprobados, cero fallos.
- Distribución: actina 6, cámara 6, geometría 4, B 8, sesiones 18, célula microglial 5, entorno C 9, D 8, partículas 4, A 9 y timeline 8.
- `npm run build`: 39 módulos; **19 archivos y 48 referencias locales** comprobados. Incluye los módulos diferidos y el favicon local, que corrige un 404 detectado en navegador.
- `git diff --check`: aprobado.

Los nuevos estados de B y los cambios de superficie tienen pruebas específicas: caspasas por etapa, alternativas independientes, liberación desde el espacio intermembranal, deformación reversible, luz interna abierta entre espinas y ejes, inserciones fijas, ramas conectadas, marcadores externos, contacto real y topología continua de las crestas. No son pruebas de una simulación biológica cuantitativa.

## Renderizado y comparación

Chromium, WebGL 2 y ANGLE/SwiftShader. Capturas de escritorio a 1280 × 900 y DPR 1. Los archivos `phase1-final-*` y sus registros JSON documentan las comprobaciones de esta fase; las capturas iniciales de ajuste no se utilizan como evidencia final. Las comparaciones siguientes son cualitativas: las capturas históricas no siempre comparten resolución, cámara o instante narrativo.

| Modelo | Captura histórica | Captura actual | Diferencia observada |
| --- | --- | --- | --- |
| B | [Sinapsis anterior](previews/atlas-synapse.png) | [Mitocondria proximal](previews/phase1-final-b-stage-5.png) | El orgánulo deja de dominar la cabeza y pasa a una sección del eje continua con el cuello. Se distinguen las posibilidades local e intrínseca en las etapas 7 y 8. |
| A | [Arquitectura anterior](previews/panel-a-desktop.png) | [Arquitectura actual](previews/phase1-final-a-stage-1.png) | La PSD ocupa un volumen submembranal más heterogéneo, las proteínas se distinguen y la actina conecta cabeza y cuello. Las vistas basal/final usan el mismo encuadre. |
| C | [Contacto anterior](previews/panel-c-contact.png) | [Contacto actual](previews/phase1-final-c-stage-5.png) | El proceso describe una aproximación curva y llega a la superficie real; se conserva un remanente visible y la espina vecina estable. |
| D | [Mitocondria anterior](previews/panel-d-stage-4.png) | [Mitocondria actual](previews/phase1-final-d-stage-4.png) | Las crestas son pliegues de la membrana interna, se conserva el espacio intermembranal y el nuevo encuadre incluye NMDAR sin cruzar el título. |

## Reproducir la comprobación

El [registro de escritorio](previews/phase1-final-validation.json) reúne **28 imágenes**: las 26 etapas más citocromo c avanzado en B y reacción avanzada en D. Se comprobaron **44 selecciones** (B 16, A 9, C 6, D 13), pausa exacta, exploración y dos regresos por módulo. No hubo errores de consola, página, HTTP ni solicitudes fallidas. Los modelos se completaron en procesos separados con `--resume` para conservar evidencia ante interrupciones del entorno; un registro parcial no se interpreta como una ejecución completa.

La pasada final de B también comprueba `labelVisible=true` al seleccionar caspasa-3 local en la etapa 7. Se retiró una exclusión antigua del sistema de anotaciones que ocultaba esa clave en todas las etapas; la disponibilidad sigue restringida por el mecanismo y no aparece en la transmisión inicial.

El máximo de triángulos observado entre las capturas fue B 286.884, A 117.414, C 143.800 y D 239.502. Son recuentos de render en esos estados, no medidas de FPS ni de consumo en otros dispositivos.

Las pasadas de [390 × 844](previews/phase1-mobile390-validation.json) y [320 × 740](previews/phase1-mobile320-validation.json) completaron las vistas inicial y final de A–D, con ocho imágenes cada una y cero errores de consola, página, HTTP o solicitudes. Se inspeccionaron texto, controles y regiones funcionales: no se detectaron regresiones importantes. Pueden salir del encuadre extremos contextuales del eje, axón o bicapa. Las proteínas pequeñas siguen requiriendo la exploración/enfoque existente para ver su detalle.

Después de cargar los cuatro módulos, la pasada de 390 px repitió cuatro ciclos B → A → C → D. Los cuatro registraron exactamente **149 geometrías, 2 texturas y 4 sesiones**, con el estado pausado estable. Es evidencia de ausencia de acumulación en esos ciclos, sin extrapolarla a sesiones prolongadas ni a memoria total de proceso.

### Movimiento normal: comprobación incompleta

El [registro de movimiento](previews/phase1-motion-validation.json) queda explícitamente **fallido por timeout**, no como validación aprobada. Desde el hub estable, B registró 39 posiciones distintas y finitas, pero no completó la entrada en 90 segundos. El [diagnóstico adicional](previews/phase1-motion-debug-validation.json) mostró `transitioning=true`, `cameraMoving=true`, documento visible y solo ocho posiciones distintas en 20 segundos. No se observaron errores de consola en esos intentos.

El recorrido de entrada necesita al menos 53 fotogramas porque el controlador limita el avance de cámara a 0,1 s por fotograma; la suma de los tramos es 5,27 s de animación. La pose de entrada y la vista general de B coinciden, de modo que el último tramo mantiene posición mientras termina su duración. Con el rendimiento observado de SwiftShader, alcanzar visualmente la pose no significa haber concluido el recorrido. Se conserva el comportamiento de la aplicación y se deja pendiente comprobar su duración/fluidez completa con un renderizador más rápido. No se extrapola este rendimiento a GPU física ni se certifica la introducción automática.

El [script de captura](../scripts/capture-phase1.mjs) utiliza la caché opcional local de Playwright/Chromium, sin añadir paquetes de ejecución a la aplicación. Se pueden indicar rutas externas con `NEUROVISTA_PLAYWRIGHT` y `NEUROVISTA_CHROMIUM`.

```bash
node scripts/capture-phase1.mjs --modules B,A,C,D --tag final --cycles 4
node scripts/capture-phase1.mjs --modules C --tag final --resume
node scripts/capture-phase1.mjs --modules B,A,C,D --width 390 --height 844 --quick --tag mobile390
node scripts/capture-phase1.mjs --modules B,A,C,D --width 320 --height 740 --quick --tag mobile320
```

El informe registra consola, errores de página y solicitudes, motor gráfico, etapa, cámara, selección, pausa y recursos del renderer. Las capturas se obtienen con el estado pausado. La imagen avanzada de B exige permanecer en etapa 8 con al menos ocho segundos transcurridos; la de D exige etapa 2 con al menos seis segundos. Se evita así confundir una repetición automática con la etapa solicitada.

La verificación de recursos compara cuatro ciclos completos después de cargar los modelos. Un recuento estable de geometrías/texturas y sesiones descarta acumulación en esos ciclos; no mide memoria total del proceso ni sustituye una prueba prolongada.

## Límites

Los paneles científicos originales no están disponibles. Las comprobaciones WebGL por software no certifican rendimiento en GPU física, navegadores móviles reales ni todos los ángulos posibles. El build verifica recursos estáticos compatibles con GitHub Pages; no se desplegó la web. Los controles generales, CSS y workflows se conservan.

---

# Histórico previo a la fase 1

# Validación del atlas neuronal

Revisión de modelos, animación y lectura: 6 de octubre de 2026. Las comprobaciones previas de A y C se conservan como antecedentes.

## Alcance

Cuatro mecanismos disponibles en la dendrita: excitotoxicidad glutamatérgica, disfunción mitocondrial (panel D), remodelado microglial (panel C) y plasticidad sináptica (panel A). Esta ampliación incorpora A mediante el registro dinámico y conserva los tres módulos existentes. El hotspot general de apoptosis permanece sin disponibilidad.

## Entorno y comprobaciones automatizadas

Node.js 24.20.0, Vite 7.3.6 y Three.js 0.180.0. Chromium mediante Playwright instalado en una carpeta ignorada, sin añadir dependencias al proyecto. Se utiliza SwiftShader para el render de comprobación; no equivale a una medición de rendimiento en una GPU física.

`npm test` pasa. Las pruebas cubren **68 casos** en diez archivos: 6 de cámara, 8 del reloj narrativo, 4 de geometría neuronal, 18 de sesiones y contratos, 5 del microambiente mitocondrial, 4 de la célula microglial, 6 del entorno de C, 6 de actina, 7 del entorno de A y 4 de partículas. El ejecutor de este entorno agrupa su resumen por archivo.

`npm run build` pasa sin advertencias y comprueba **17 archivos y 39 referencias locales**, incluidos los módulos diferidos. `git diff --check` pasa. No se generan paquetes ZIP ni archivos de entrega.

## Refinamiento de modelos y lectura

- La respuesta biológica se integra por cada tramo consumido de una etapa, antes de notificar la siguiente. Una prueba compara un fotograma de 6,25 segundos con 625 de 0,01 segundos y con la solución analítica. Las pausas en frontera no consumen el tiempo sobrante y el tiempo final coincide con la duración del recorrido.
- La fase del calcio glutamatérgico depende del reloj, sin cambiar bruscamente al variar su intensidad. Se comprueban cruces por los poros NMDA, reversibilidad, selección y límites de las nubes móviles.
- La terminal del panel A conserva la pared interna de su corte. La PSD tiene tres profundidades conectadas, bifurcaciones y dominios proteicos pequeños, con acabado mate. Se mantiene por debajo de 120.000 triángulos incluso con ambas reservas moleculares completas.
- La actina resuelve las uniones de las ramas una vez por fotograma, evitando cálculos recursivos repetidos. La comparación de cuatro fotogramas antes y después conservó posiciones, normales y diagnóstico byte por byte; esta comprobación no mide FPS de dispositivos físicos.
- Se añaden 27 explicaciones ampliadas y 48 indicaciones «Qué observar». El texto inicial sigue siendo breve. «Comprender el mecanismo» pausa la animación; «Enfocar estructura» centra la geometría seleccionada y deja libre el modelo al cerrar la ficha.

En navegador se comprobó en los cuatro módulos que ampliar la explicación pausa el recorrido, enfocar conserva el estado biológico y la selección, y girar la cámara no altera ese estado. Las explicaciones se pueden reabrir y la reproducción continúa hasta completar cada recorrido. A 390 y 320 px se verificaron lectura con desplazamiento, cierre siempre visible, enfoque y regreso sin desbordamiento horizontal. No se detectaron errores de JavaScript ni shaders en las comprobaciones completadas.

El enfoque con movimiento normal también se activó durante la reproducción: no desplaza bruscamente la cámara al pulsar, pausa la biología y conserva exactamente su estado durante el viaje. El muestreo registró 13 posiciones de cámara distintas y confirmó que los controles se habilitan al terminar, conservando la selección. Este recuento verifica la transición, no el rendimiento en una GPU física.

La composición incorpora un fondo degradado suave detrás de la narrativa para mantener el contraste cuando la dendrita pasa bajo el texto. Las fichas tienen encabezado fijo, texto de mayor tamaño y un despliegue nativo accesible por teclado. Las pruebas extensas con render por software se dividieron por módulos para completar la revisión dentro del tiempo de ejecución del entorno.

## Geometría y estados del panel A

- Espina mushroom con una membrana continua, corte de inspección, cabeza ancha y cuello estrecho. El morph modifica la cabeza de forma gradual; el cuello y la unión dendrítica permanecen fijos. Volver a la primera etapa recupera exactamente la superficie basal.
- Cincuenta filamentos curvos de actina en una sola malla de 17.952 triángulos. Las 38 bifurcaciones mantienen su origen unido al filamento padre; 27 ramas cambian de longitud localmente. Las pruebas verifican profundidad, mayor densidad en la cabeza y continuidad hacia el cuello curvado.
- La PSD es una red irregular con profundidad; PSD-95 ocupa una posición próxima al receptor, DISC1 una región más profunda y Kalirin-7 el entorno de actina. Cambia el énfasis visual, sin transportar proteínas a lo largo de una cadena molecular.
- NMDAR presenta cuatro subunidades y un canal abierto geométricamente. Los cruces de Ca²⁺ permanecen sobre el eje del poro antes de dispersarse dentro de la espina. La reserva tiene un máximo de ocho iones; los estados narrativos utilizan cantidades menores.
- No se construyen ROS, microglía, mitocondrias dañadas ni maquinaria de apoptosis para este módulo.
- Tiempo, geometrías, normales, posiciones de proteínas y matrices de partículas se conservan al repetir un estado pausado. Selección y proximidad de cámara sólo modifican la apariencia; la membrana conserva visibilidad.

La revisión visual corrigió bandas de la dendrita mediante normales exteriores y una sola superficie translúcida. La PSD perdió su cuadrícula inicial y pasó a arcos y bifurcaciones orgánicos. El pigmento de actina varía discretamente con la profundidad para distinguir los filamentos superpuestos.

## Interacción del panel A

Comprobado en Chromium: reproducción desde la arquitectura basal, activación de NMDAR y calcio moderado, organización postsináptica, Kalirin-7 y remodelado gradual. PSD-95 se introduce antes que DISC1 mediante fases de anotación. Se seleccionan las tres proteínas, actina, PSD, NMDAR, espina y Ca²⁺ desde el selector nativo.

La pausa y Explorar conservan exactamente el estado biológico. El giro y el zoom siguen disponibles y la opacidad responde a la cámara sin modificar ese estado. La selección directa de filamentos mediante raycast funciona sobre la geometría real. Al continuar se alcanza el final de los 60 segundos narrativos; volver a las etapas basal y final revierte y recupera el morph. Salir y reentrar devuelve el módulo a la etapa inicial y la cabeza a su forma basal. No se detectaron errores de JavaScript ni shaders durante estas comprobaciones.

La entrada de A con movimiento normal registra **53 posiciones intermedias**. No cambia bruscamente la cámara al pulsar el hotspot y mantiene OrbitControls desactivado durante el viaje; primero alcanza el encuadre próximo y luego la vista general. El regreso registra **49 posiciones intermedias** y restaura el estado basal. Se verifica de nuevo el congelado exacto mientras se orbita. Esta comprobación utiliza 800 × 720 y densidad de render 0,5 con SwiftShader; las capturas de composición utilizan densidad 1.

## Regresión de los cuatro módulos

Las entradas A → C → B → D y los retornos a B/D verifican sesiones independientes. A y C vuelven al estado basal; B y D conservan su avance. Las partículas glutamatérgicas no aparecen en los otros módulos y las anotaciones no se duplican.

A **390 × 844 y 320 × 740**, los cuatro hotspots permanecen visibles y se pueden activar con clic real, inspeccionar estructuras mediante el selector y regresar a la dendrita. No hay desbordamiento horizontal ni errores de consola, JavaScript o shaders en estos recorridos.

La prueba de regreso animado detectó que el título ocultaba el acceso a Plasticidad a 800 px. El encuadre del hub reserva ahora espacio lateral en anchuras intermedias. La corrección se verificó a **641, 700, 760, 800, 900 y 960 px**, con los cuatro accesos visibles; el clic real de entrada y regreso a 800 px también pasa.

## Geometría y estados del panel C (revisión previa)

- Una membrana microglial conectada, con 47 ramificaciones y profundidad real. Las pruebas comprueban continuidad de sus índices, valores finitos y volumen tridimensional.
- El soma y las uniones proximales permanecen fijos. La superficie distal cambia gradualmente y alcanza físicamente el objetivo; la comprobación utiliza vértices de la membrana, además del diagnóstico de la punta.
- La espina conservada mantiene posiciones, normales y transformaciones. Sólo la espina en estudio se retrae; el proceso sigue su superficie.
- La retracción requiere aproximación y contacto efectivos. No empieza sólo por entrar en la etapa narrativa.
- Ca²⁺ atraviesa el canal contextual NMDAR; se comprueban numerosos cruces. Hay tres complejos C1q y dos C3, con morfologías distintas, y CASP3 permanece intracelular.
- Repetir un mismo tiempo y estado conserva exactamente geometrías, normales y matrices moleculares. La selección y el giro en pausa no reconstruyen innecesariamente la membrana microglial.

La microglía utiliza dos mallas y 64.296 triángulos. En la revisión de escritorio, la escena C registra 128.128 triángulos y 13 llamadas de dibujo al inicio; con señales, 141.608 y 17; al final, 117.576 y 11. Estos recuentos no son una garantía de velocidad para todos los dispositivos.

## Navegador del panel C (revisión previa)

Se ha comprobado selección sobre la geometría microglial mediante raycast, selección de estructuras y moléculas desde el control nativo, giro y zoom por teclado durante Explorar, y conservación exacta del tiempo y del modelo pausados. La reproducción muestra aproximación gradual y contacto seguido de retracción, alcanza los 60 segundos narrativos y conserva la espina vecina. C1q, C3 y CASP3 abren sus explicaciones.

La revisión visual corrigió bandas de transparencia en terminales y espinas y separó el modelo del texto narrativo. Los encuadres mantienen la comparación entre espinas. El hotspot microglial se sitúa en una rama visible del hub móvil.

A **390 × 844 y 320 × 740**, los tres hotspots permiten entrar, seleccionar estructuras y regresar. No hay desbordamiento horizontal ni errores de consola, JavaScript o shaders en esos recorridos. La comprobación de 320 px detectó una colisión del hotspot superior con el título; el hub compensa ahora su encuadre en pantallas bajas.

Las entradas consecutivas C → B → D → C → B → D verifican que los estados de B y D se conservan por separado y que C vuelve al estado funcional inicial. Las partículas del módulo glutamatérgico se ocultan fuera de su vista detallada, también cuando se revela el contexto neuronal al alejarse de C o D; se restauran al reentrar en B. El cambio conserva seis controles narrativos y el juego de anotaciones propio, sin duplicarlos.

La entrada con movimiento normal conserva la posición al pulsar el hotspot y mantiene OrbitControls bloqueado durante el recorrido. El muestreo registra 53 posiciones intermedias; la cámara llega primero al encuadre próximo a la espina y retrocede para revelar la microglía. El regreso registra 51 posiciones intermedias, restablece el módulo y vuelve a habilitar los tres hotspots. No se detectaron errores de consola o WebGL. El modelo permanece congelado al pasar a Explorar y girar la cámara. Los materiales se preparan antes del viaje y el avance por fotograma se limita para evitar saltos tras un render lento.

Para esta comprobación de trayectoria se mantuvo una interfaz de 800 × 720 con densidad de render 0,5: SwiftShader no permitió completar la prueba a densidad 1 dentro de su tiempo límite. La composición visual se revisó por separado a densidad 1. Estos resultados verifican estados y recorrido; no afirman fluidez o rendimiento de hardware real.

## Compilación estática bajo `/qr/`

La revisión del 6 de octubre repitió el recorrido sobre la compilación refinada: en los cuatro módulos se abrió una explicación ampliada durante la reproducción, se comprobó la pausa y se enfocó la estructura antes de regresar a la dendrita. Pasaron la carga bajo `/qr/`, las veinte referencias mediante enlace directo, la ausencia de diagnósticos de desarrollo y las alternativas sin WebGL y sin JavaScript. No se detectaron errores HTTP, JavaScript ni shaders.

La compilación se sirvió desde un servidor estático local sin fallback de rutas, bajo `/qr/`. Chromium abrió los cuatro módulos, seleccionó sus estructuras y comprobó el reinicio de A. Los recursos diferidos cargaron correctamente. Los diagnósticos de desarrollo no están expuestos en producción.

La compilación final conserva los cuatro hotspots a 800, 641, 390 y 320 px: se verificaron entrada por clic real, selección de actina y regreso. La comprobación móvil también permite seleccionar Kalirin-7. La entrada directa por `#references` muestra las veinte referencias. Se comprobaron las alternativas sin WebGL y sin JavaScript, así como el acceso a las notas desde el aviso gráfico. No se detectaron errores HTTP, JavaScript ni shaders en la comprobación final.

La primera sesión extensa de capturas se cerró al redimensionar el navegador de software después de comprobar los cuatro módulos. La repetición final completó ambas anchuras móviles y las alternativas sin gráficos. Esto no constituye una prueba de rendimiento en dispositivos físicos.

Se verificó el resultado compilado; no se ha publicado en un servidor remoto.

## Capturas de revisión

Las capturas muestran el canvas 3D real. Las del refinamiento se tomaron en el navegador de desarrollo; las revisiones anteriores de paneles se tomaron en la compilación estática.

- [Paredes internas y PSD refinadas](previews/refined-plasticity.png)
- [Explicación ampliada de actina](previews/refined-explanation.png)
- [Actina enfocada en 3D](previews/refined-actin-focus.png)
- [Enfoque a 390 px](previews/refined-mobile-390.png)
- [Enfoque a 320 px](previews/refined-mobile-320.png)
- [Arquitectura de la espina al inicio](previews/panel-a-desktop.png)
- [PSD-95 y DISC1 en su contexto](previews/panel-a-organization.png)
- [Remodelado de actina](previews/panel-a-actin.png)
- [Selección del citoesqueleto](previews/panel-a-selection.png)
- [Estado estructural final](previews/panel-a-result.png)
- [Panel A a 390 px](previews/panel-a-mobile.png)
- [Panel A a 320 px](previews/panel-a-mobile-320.png)
- [Hub móvil con cuatro regiones](previews/atlas-mobile-hub.png)
- [Microglía y dos espinas al inicio](previews/panel-c-desktop.png)
- [C1q, C3 y señal local](previews/panel-c-signals.png)
- [Contacto y retracción](previews/panel-c-contact.png)
- [Conexión remodelada y espina conservada](previews/panel-c-result.png)

## Límites y referencia científica

La escena requiere WebGL 2. El panel A presenta relaciones conceptuales sin imponer una cadena molecular; el ensanchamiento de la cabeza no cuantifica aprendizaje ni fuerza sináptica. Los colores, proporciones, duración e intensidades son convenciones de ilustración, no medidas experimentales. C1q y C3 no se presentan como marcadores universales de daño; CASP3 no actúa como señal extracelular de atracción. El contacto microglial no implica siempre eliminación. La secuencia no establece una cadena biológica obligatoria ni una predicción clínica.

Véanse la [correspondencia del panel A](panel-a.md), la [del panel C](panel-c.md), la [del panel D](panel-d.md) y las [notas científicas](scientific-notes.md). No se ha realizado push ni desplegado en un hosting remoto.
