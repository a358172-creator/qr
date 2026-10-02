# Validación del atlas neuronal

Fecha de cierre de la revisión: 2 de octubre de 2026.

## Alcance

Tres mecanismos disponibles en la dendrita: excitotoxicidad glutamatérgica, disfunción mitocondrial (panel D) y remodelado microglial (panel C). Esta ampliación desarrolla exclusivamente C y conserva las escenas anteriores. El panel A y el módulo general de apoptosis siguen sin implementar.

## Entorno y comprobaciones automatizadas

Node.js 24.20.0, Vite 7.3.6 y Three.js 0.180.0. Chromium mediante Playwright instalado en una carpeta ignorada, sin añadir dependencias al proyecto. Se utiliza SwiftShader para el render de comprobación; no equivale a una medición de rendimiento en una GPU física.

`npm test` pasa. Las pruebas cubren **46 casos** en siete archivos: 6 de cámara, 7 del reloj narrativo, 4 de geometría neuronal, 14 de sesiones y contratos, 5 del microambiente mitocondrial, 4 de la célula microglial y 6 del entorno de C. El ejecutor de este entorno agrupa su resumen por archivo.

`npm run build` pasa sin advertencias y comprueba **15 archivos y 31 referencias locales**, incluidos los módulos diferidos. `git diff --check` pasa. No se generan paquetes ZIP ni archivos de entrega.

## Geometría y estados del panel C

- Una membrana microglial conectada, con 47 ramificaciones y profundidad real. Las pruebas comprueban continuidad de sus índices, valores finitos y volumen tridimensional.
- El soma y las uniones proximales permanecen fijos. La superficie distal cambia gradualmente y alcanza físicamente el objetivo; la comprobación utiliza vértices de la membrana, además del diagnóstico de la punta.
- La espina conservada mantiene posiciones, normales y transformaciones. Sólo la espina en estudio se retrae; el proceso sigue su superficie.
- La retracción requiere aproximación y contacto efectivos. No empieza sólo por entrar en la etapa narrativa.
- Ca²⁺ atraviesa el canal contextual NMDAR; se comprueban numerosos cruces. Hay tres complejos C1q y dos C3, con morfologías distintas, y CASP3 permanece intracelular.
- Repetir un mismo tiempo y estado conserva exactamente geometrías, normales y matrices moleculares. La selección y el giro en pausa no reconstruyen innecesariamente la membrana microglial.

La microglía utiliza dos mallas y 64.296 triángulos. En la revisión de escritorio, la escena C registra 128.128 triángulos y 13 llamadas de dibujo al inicio; con señales, 141.608 y 17; al final, 117.576 y 11. Estos recuentos no son una garantía de velocidad para todos los dispositivos.

## Navegador

Se ha comprobado selección sobre la geometría microglial mediante raycast, selección de estructuras y moléculas desde el control nativo, giro y zoom por teclado durante Explorar, y conservación exacta del tiempo y del modelo pausados. La reproducción muestra aproximación gradual y contacto seguido de retracción, alcanza los 60 segundos narrativos y conserva la espina vecina. C1q, C3 y CASP3 abren sus explicaciones.

La revisión visual corrigió bandas de transparencia en terminales y espinas y separó el modelo del texto narrativo. Los encuadres mantienen la comparación entre espinas. El hotspot microglial se sitúa en una rama visible del hub móvil.

A **390 × 844 y 320 × 740**, los tres hotspots permiten entrar, seleccionar estructuras y regresar. No hay desbordamiento horizontal ni errores de consola, JavaScript o shaders en esos recorridos. La comprobación de 320 px detectó una colisión del hotspot superior con el título; el hub compensa ahora su encuadre en pantallas bajas.

Las entradas consecutivas C → B → D → C → B → D verifican que los estados de B y D se conservan por separado y que C vuelve al estado funcional inicial. Las partículas del módulo glutamatérgico se ocultan fuera de su vista detallada, también cuando se revela el contexto neuronal al alejarse de C o D; se restauran al reentrar en B. El cambio conserva seis controles narrativos y el juego de anotaciones propio, sin duplicarlos.

La entrada con movimiento normal conserva la posición al pulsar el hotspot y mantiene OrbitControls bloqueado durante el recorrido. El muestreo registra 53 posiciones intermedias; la cámara llega primero al encuadre próximo a la espina y retrocede para revelar la microglía. El regreso registra 51 posiciones intermedias, restablece el módulo y vuelve a habilitar los tres hotspots. No se detectaron errores de consola o WebGL. El modelo permanece congelado al pasar a Explorar y girar la cámara. Los materiales se preparan antes del viaje y el avance por fotograma se limita para evitar saltos tras un render lento.

Para esta comprobación de trayectoria se mantuvo una interfaz de 800 × 720 con densidad de render 0,5: SwiftShader no permitió completar la prueba a densidad 1 dentro de su tiempo límite. La composición visual se revisó por separado a densidad 1. Estos resultados verifican estados y recorrido; no afirman fluidez o rendimiento de hardware real.

## Compilación estática bajo `/qr/`

La compilación se sirvió desde un servidor estático local sin fallback de rutas, bajo `/qr/`. Chromium abrió los tres módulos, seleccionó estructuras, recorrió sus etapas y comprobó el reinicio de C. Los módulos diferidos y los recursos locales cargaron sin errores HTTP, JavaScript o shaders. Los diagnósticos de desarrollo no están expuestos en producción.

La misma compilación conserva los tres hotspots a 390 y 320 px, permite seleccionar C3 y abre directamente `#references`, con las dieciséis referencias disponibles. Se verificó el resultado compilado; no se ha publicado en un servidor remoto.

## Capturas de revisión

Las capturas muestran el canvas 3D real en la compilación estática.

- [Microglía y dos espinas al inicio](previews/panel-c-desktop.png)
- [C1q, C3 y señal local](previews/panel-c-signals.png)
- [Contacto y retracción](previews/panel-c-contact.png)
- [Conexión remodelada y espina conservada](previews/panel-c-result.png)
- [Vista móvil del panel C](previews/panel-c-mobile.png)
- [Hub móvil con tres regiones](previews/atlas-mobile-hub.png)

## Límites y referencia científica

La escena requiere WebGL 2. Los colores, proporciones, duración e intensidades son convenciones de ilustración, no medidas experimentales. C1q y C3 no se presentan como marcadores universales de daño; CASP3 no actúa como señal extracelular de atracción. El contacto microglial no implica siempre eliminación. La secuencia no establece una cadena biológica obligatoria ni una predicción clínica.

Véanse la [correspondencia del panel C](panel-c.md), la [del panel D](panel-d.md) y las [notas científicas](scientific-notes.md). No se ha realizado push ni desplegado en un hosting remoto.
