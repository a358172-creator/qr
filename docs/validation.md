# Validación del atlas neuronal

Revisión del panel A: 3 de octubre de 2026. Las comprobaciones previas de C se conservan como antecedentes.

## Alcance

Cuatro mecanismos disponibles en la dendrita: excitotoxicidad glutamatérgica, disfunción mitocondrial (panel D), remodelado microglial (panel C) y plasticidad sináptica (panel A). Esta ampliación incorpora A mediante el registro dinámico y conserva los tres módulos existentes. El hotspot general de apoptosis permanece sin disponibilidad.

## Entorno y comprobaciones automatizadas

Node.js 24.20.0, Vite 7.3.6 y Three.js 0.180.0. Chromium mediante Playwright instalado en una carpeta ignorada, sin añadir dependencias al proyecto. Se utiliza SwiftShader para el render de comprobación; no equivale a una medición de rendimiento en una GPU física.

`npm test` pasa. Las pruebas cubren **60 casos** en nueve archivos: 6 de cámara, 7 del reloj narrativo, 4 de geometría neuronal, 16 de sesiones y contratos, 5 del microambiente mitocondrial, 4 de la célula microglial, 6 del entorno de C, 6 de actina y 6 del entorno de A. El ejecutor de este entorno agrupa su resumen por archivo.

`npm run build` pasa sin advertencias y comprueba **17 archivos y 39 referencias locales**, incluidos los módulos diferidos. `git diff --check` pasa. No se generan paquetes ZIP ni archivos de entrega.

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

La compilación se sirvió desde un servidor estático local sin fallback de rutas, bajo `/qr/`. Chromium abrió los cuatro módulos, seleccionó sus estructuras y comprobó el reinicio de A. Los recursos diferidos cargaron correctamente. Los diagnósticos de desarrollo no están expuestos en producción.

La compilación final conserva los cuatro hotspots a 800, 641, 390 y 320 px: se verificaron entrada por clic real, selección de actina y regreso. La comprobación móvil también permite seleccionar Kalirin-7. La entrada directa por `#references` muestra las veinte referencias. Se comprobaron las alternativas sin WebGL y sin JavaScript, así como el acceso a las notas desde el aviso gráfico. No se detectaron errores HTTP, JavaScript ni shaders en la comprobación final.

La primera sesión extensa de capturas se cerró al redimensionar el navegador de software después de comprobar los cuatro módulos. La repetición final completó ambas anchuras móviles y las alternativas sin gráficos. Esto no constituye una prueba de rendimiento en dispositivos físicos.

Se verificó el resultado compilado; no se ha publicado en un servidor remoto.

## Capturas de revisión

Las capturas muestran el canvas 3D real en la compilación estática.

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
