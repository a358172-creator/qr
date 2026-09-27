# Validación del atlas neuronal

Fecha: 27 de septiembre de 2026.

## Alcance

Esta revisión corresponde al atlas con una neurona, una dendrita navegable y una sinapsis glutamatérgica. Los otros cuatro mecanismos son únicamente marcadores; no se han desarrollado sus escenas.

## Entorno y compilación

Node.js 24.20.0, Vite 7.3.6 y Three.js 0.180.0. Chromium 153 mediante Playwright instalado en una carpeta ignorada, sin añadir dependencias al proyecto. El navegador utiliza SwiftShader, sin GPU física.

- `npm run build`: correcto, sin advertencias.
- `npm test`: correctos los tres archivos de pruebas.
- Ejecutados individualmente: **17 pruebas aprobadas** — 6 de cámara, 7 del reloj narrativo y 4 de geometría.
- `git diff --check`: correcto.

## Geometría

Se comprueban normales y caras exteriores de espinas mushroom, finas y cortas en distintas orientaciones; posiciones, colores e índices finitos; unión del soma con ramificaciones en una sola superficie conectada; continuidad de ramas terminales con radios inferiores al tamaño de vóxel. Se corrigieron discontinuidades en ramas finas y la orientación de las caras de las espinas.

La imagen se construye con geometría 3D procedural: no es un render prerregistrado ni una imagen de fondo. El soma, la dendrita y sus bifurcaciones usan una unión de campos de distancia. La sinapsis tiene ventanas geométricas de corte, membranas con relieve, receptores separados por color y una mitocondria con crestas tridimensionales.

## Interacciones verificadas en Chromium

- Selección del punto disponible y entrada en la misma sinapsis del mundo compartido.
- Selección de AMPA, apertura de su explicación y cierre con Escape, restaurando el foco al canvas.
- Reproducción, pausa y modo Explorar: tiempo narrativo, tiempo biológico e intensidades permanecen exactamente constantes durante la pausa.
- Órbita por teclado durante la exploración sin avanzar el mecanismo.
- Continuar desde el instante conservado; estado de Explorar correcto después de abrir Referencias.
- Selección de las seis etapas, aparición de estrés oxidativo, reinicio y limpieza del estado.
- Mostrar/ocultar anotaciones y volver a la dendrita con indicador de visita.
- Cambio de escritorio a 390 px: punto interactivo visible y funcional. Revisión de ancho de 320 px sin desbordamiento horizontal.
- Ayuda y referencias en diálogos nativos.
- Transición macro→micro después de más de cuatro segundos de inactividad: conserva la posición inicial y termina en la escala sináptica sin salto inicial.
- Sin errores de JavaScript ni errores de shaders en la ejecución funcional.

## Compilación de producción

La compilación se sirvió con un servidor estático sin fallback de rutas bajo `/qr/`. Se verificaron recursos locales, selección de estructuras, la última etapa, el hotspot móvil y la apertura directa de `/qr/#references`. No aparecieron errores de consola, shaders ni respuestas HTTP fallidas. Los diagnósticos de desarrollo no están expuestos en producción.

También se comprobó la alternativa sin WebGL: muestra el aviso y permite abrir las referencias. Con JavaScript desactivado, el aviso y el enlace bibliográfico siguen disponibles.

## Rendimiento y límites

La vista sináptica verificada a 960 × 720 registró **38 llamadas de dibujo** y **463.320 triángulos procesados**. Las partículas y vesículas están instanciadas. La aplicación utiliza un único bucle; una escena pausada y sin interacción deja de solicitar fotogramas.

No se ha medido fluidez en una GPU física ni se afirma mantener 60 FPS en todos los dispositivos. El modelo requiere WebGL 2. Proporciones, colores, duraciones y partículas son ilustrativos; no representa concentraciones reales ni una reconstrucción molecular. La distribución de mitocondrias se simplifica para la lectura educativa.

## Capturas

Las capturas estables utilizan movimiento reducido.

- [Neurona](previews/atlas-neuron.png)
- [Dendrita](previews/atlas-hub.png)
- [Sinapsis](previews/atlas-synapse.png)
- [Mitocondria y actividad redox](previews/atlas-detail.png)
- [Dendrita móvil](previews/atlas-mobile-hub.png)
- [Sinapsis móvil](previews/atlas-mobile-synapse.png)

## Publicación

La compilación mantiene rutas relativas para GitHub Pages. No se han realizado push, despliegues ni cambios de configuración remota.

## Paquetes de transferencia

`npm run package` genera una web estática y un proyecto editable en ZIP, con instrucciones y sumas SHA-256. La compilación verifica ocho archivos y nueve referencias locales, incluidos imports diferidos. El workflow de GitHub Pages ejecuta las pruebas antes de compilar.

Se comprobaron los CRC de ambos ZIP con un lector independiente, su extracción y las sumas SHA-256. Los archivos del ZIP web son idénticos a `dist/`. El proyecto editable extraído compila correctamente; esta comprobación reutilizó las dependencias locales instaladas, sin efectuar una nueva descarga con `npm ci`.

El ZIP web extraído se sirvió con un servidor estático desde `/` y `/atlas/`. En ambos casos, Chromium cargó WebGL, abrió la sinapsis y mostró las referencias sin errores de consola, shaders ni recursos HTTP ausentes. La prueba corresponde a archivos locales servidos por HTTP; no constituye un despliegue en un hosting remoto.
