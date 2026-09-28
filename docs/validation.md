# Validación del atlas neuronal

Fecha: 28 de septiembre de 2026.

## Alcance

Dos mecanismos disponibles en la dendrita: excitotoxicidad glutamatérgica y disfunción mitocondrial. El segundo corresponde exclusivamente al panel D de la referencia aportada. Señalización celular, microglía y apoptosis general siguen sin escena propia. No se implementan los paneles A, B ni C en esta ampliación.

## Entorno y pruebas

Node.js 24.20.0, Vite 7.3.6 y Three.js 0.180.0. Chromium mediante Playwright instalado en una carpeta ignorada, sin añadir dependencias al proyecto. Render por software con SwiftShader; no se ha medido rendimiento de una GPU física.

`npm test` pasa en los cinco archivos de pruebas: **32 casos** — 6 de cámara, 7 del reloj narrativo, 4 de geometría neuronal, 10 de sesiones y contratos de mecanismos, y 5 del microambiente mitocondrial. En este entorno, el resumen del ejecutor agrupa el resultado por archivo.

`npm run build` compila sin advertencias y valida **12 archivos y 20 referencias locales**, incluidos los módulos diferidos. `git diff --check` no encuentra errores de espacio.

## Geometría y estados

Se mantienen las pruebas de continuidad del soma y las ramas y de orientación de las espinas. El segundo módulo añade comprobaciones de geometría finita, membranas mitocondriales separadas y crestas con volumen. Se verifican múltiples cruces de Ca²⁺ por el canal, límites de partículas, desplazamiento y pigmentación local de lípidos y el trayecto conceptual de AIF.

Las pruebas comparan matrices, colores, posiciones y cantidades tras restaurar el mismo tiempo y estado. Explorar conserva el reloj, las intensidades y el estado del modelo exactamente. Cada sesión mantiene una historia independiente; cambiar de mecanismo no mezcla sus variables. Reiniciar recupera el estado basal, y continuar tras completar vuelve al principio.

La bicapa utiliza 1.098 instancias por capa de cabezas/colas y dos llamadas de dibujo para estos elementos. La reducción de segmentos conserva todos los lípidos y elimina un 40 % de sus triángulos: 131.760 frente a 219.600. La vista mitocondrial inicial registra aproximadamente 216.528 triángulos y 18 llamadas de dibujo; varía según etapa y encuadre. El contexto neuronal se atenúa durante la entrada y se oculta en la vista interior.

## Interacciones comprobadas en Chromium

- Hotspot mitocondrial, carga diferida y entrada al nuevo microambiente.
- Las seis etapas: Ca²⁺, especies reactivas, lípidos, mitocondria, AIF e integración.
- Play, pausa, Explorar, giro por teclado y Continuar. Tiempo, intensidades, partículas y diagnósticos conservados durante la pausa.
- Selección real mediante raycast sobre la mitocondria y selección mediante etiquetas/selector nativo. PTP muestra su descripción conceptual completa.
- AIF avanza hacia el contexto nuclear; al explorar se congela exactamente en su posición.
- Finalización hasta los 60 segundos narrativos y repetición desde el estado basal.
- Entrada con movimiento normal: posición inicial conservada, controles bloqueados durante el viaje y habilitados al finalizar. Regreso continuo a la dendrita.
- Entrada posterior al módulo glutamatérgico: selección de AMPA, sus seis etapas y su estado de ROS siguen funcionando.
- A 390 × 844 y 320 × 740, los dos hotspots son visibles y permiten entrar y regresar. Ambos módulos admiten selección sin desbordamiento horizontal.
- Sin errores de JavaScript o shaders en estos recorridos.

La primera revisión detectó tres problemas corregidos: el fondo dendrítico competía con el corte intracelular, algunos encuadres interferían con los textos y el segundo hotspot quedaba fuera del hub móvil. La cámara y las anotaciones reservan espacio para la interfaz; el hub móvil se centra entre las regiones disponibles.

## Producción y transferencia

La compilación se sirvió mediante un servidor estático sin fallback bajo `/qr/`. Chromium abrió ambos mecanismos, seleccionó estructuras, recorrió etapas, cargó los módulos diferidos y abrió directamente `#references`. La vista móvil conserva los dos hotspots. No se detectaron errores de JavaScript, shaders, recursos HTTP ni rutas ausentes. Los diagnósticos de desarrollo no se exponen en producción.

También se comprobó la alternativa sin WebGL: el aviso permite abrir las doce referencias. Sin JavaScript permanece disponible el aviso y su enlace bibliográfico.

`npm run package` genera la web compilada y el proyecto editable. Los ZIP incluyen las nuevas escenas, contenidos, pruebas y documentación; su extracción conserva los recursos relativos.

## Capturas

Las capturas utilizan movimiento reducido y muestran geometría 3D real, no imágenes insertadas en el canvas.

- [Microambiente del panel D](previews/panel-d-desktop.png)
- [Mitocondria, crestas y PTP](previews/panel-d-hero.png)
- [Lípidos y peroxidación](previews/panel-d-membrane.png)
- [Microambiente móvil](previews/panel-d-mobile.png)
- [Hub móvil con dos regiones](previews/atlas-mobile-hub.png)

## Límites

La escena necesita WebGL 2. No se garantiza una tasa de fotogramas en todos los dispositivos. El render por software valida funcionamiento, no rendimiento de una GPU física.

Las dimensiones, colores, tiempos e intensidades son convenciones de ilustración. Las proteínas no son modelos atomísticos. PTP no afirma una composición molecular ni un canal de paso para AIF; el contexto nuclear comprime distancias y no coloca un núcleo en la dendrita. Las etapas no establecen una cadena inevitable ni una predicción de lesión. Véanse la [correspondencia del panel D](panel-d.md) y las [notas científicas](scientific-notes.md).

No se ha realizado push ni desplegado en un hosting remoto.
