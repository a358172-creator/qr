# Fase 1 · informe técnico

Fecha: 8 de octubre de 2026. Refinamiento directo del proyecto NEURO·VISTA, conservando los cuatro mecanismos, navegación, controles, paleta y composición editorial. No se modificaron los workflows de despliegue ni se añadieron dependencias.

## Resultado por modelo

| Modelo | Cambios implementados | Estado y evidencia |
| --- | --- | --- |
| **B · excitotoxicidad** | Anatomía local independiente del hub, lumen continuo espina–dendrita, mitocondria menor en el eje proximal y crestas compartidas con D. Ocho etapas: transmisión inicial, sobrecarga sostenida, respuesta mitocondrial/redox y dos posibilidades diferenciadas. Caspasa-3 y actina intracelulares acompañan retracción local; citocromo c parte del espacio intermembranal hacia Apaf-1, caspasa-9 y ejecutoras en la alternativa intrínseca. | **Completada y validada** mediante pruebas geométricas/de estado y capturas WebGL de las ocho etapas y la liberación avanzada. [Mitocondria proximal](previews/phase1-final-b-stage-5.png), [remodelado local](previews/phase1-final-b-stage-7.png), [alternativa intrínseca](previews/phase1-final-b-stage-8-release.png). |
| **A · plasticidad** | Unión abierta entre cuello y eje, cabeza mushroom con deformación moderada, PSD heterogénea en varias profundidades y siluetas distintas de PSD-95, DISC1 y Kalirin-7. Red de actina conectada a raíces del cuello, con ramificación y cambios locales. Cámara equivalente en los estados basal y final. | **Completada y validada**: seis etapas, geometría, reversibilidad y selección. [Estado basal](previews/phase1-final-a-stage-1.png), [organización postsináptica](previews/phase1-final-a-stage-3.png), [estado remodelado](previews/phase1-final-a-stage-6.png). |
| **C · microglía** | Célula de superficie continua, procesos con calibre variable y extensión curva, soma fijo. Contacto ligado a un vértice real de la espina y seguido durante la retracción; complemento extracelular y caspasa-3 intracelular. La vecina permanece estable y el resultado conserva un remanente. Se abrieron los lúmenes de ambas inserciones dendríticas. | **Completada y validada**: seis etapas, selección, pruebas del lumen y contacto. Las capturas posteriores a la corrección confirman uniones sin separación; persiste un reborde de sombreado leve que admite refinamiento artístico. [Contacto](previews/phase1-final-c-stage-5.png), [resultado](previews/phase1-final-c-stage-6.png). |
| **D · mitocondria** | Membrana interna continua con invaginaciones, membrana externa y labios de sección separados. NOX2 insertado en la bicapa y superóxido extracelular; encuentro espacial de NO y O₂•⁻ antes de ONOO⁻. Separación de sGC/cGMP/PKG, mediadores lipídicos, ROS mitocondrial, PTP y trayecto contextual AIF–núcleo. Atenuación de elementos secundarios y cámaras ajustadas. | **Completada y validada** en geometría, estados, seis capturas WebGL y reacción avanzada. [NO + O₂•⁻ → ONOO⁻](previews/phase1-final-d-stage-2-reaction.png), [mitocondria y PTP](previews/phase1-final-d-stage-4.png), [contexto nuclear](previews/phase1-final-d-stage-6.png). |

Las formas de proteínas son ilustraciones multidominio, no reconstrucciones atómicas. El corte anatómico permanece abierto por convención gráfica; no representa rotura de membranas por lesión.

## Correspondencia científica

Se actualizaron títulos, etapas, fichas, observaciones y notas en los cuatro mecanismos, junto con [notas científicas](scientific-notes.md) y documentos de [A](panel-a.md), [B](panel-b.md), [C](panel-c.md) y [D](panel-d.md). B incorpora documentación propia y referencias primarias comprobables.

- La entrada de Ca²⁺, ROS, NO y caspasas tienen funciones dependientes del contexto; su presencia aislada no demuestra enfermedad ni muerte neuronal.
- El remodelado local de B y la alternativa intrínseca son posibilidades distintas. La recuperación de la referencia gráfica al pasar a la última etapa no significa recuperación biológica ni una secuencia obligatoria.
- El complemento y el contacto microglial no identifican exclusivamente sinapsis patológicas ni garantizan eliminación. No se representa fagocitosis completa.
- D diferencia ROS/RNS, NOX2/mitocondria, metabolismo del ácido araquidónico/peroxidación, PTP/permeabilización externa y AIF/ejecución dependiente de caspasas. AIF no sale por el PTP dibujado.
- Proximidad, tamaños, concentraciones, tiempos y velocidades son convenciones educativas. No se añaden resultados propios, homogeneizados cerebrales ni comparaciones de edades.

## Validación técnica

**Completada y validada:** `npm test`, 85 casos en 11 archivos; `npm run build`, 39 módulos y comprobación de 19 archivos/48 referencias locales; `git diff --check`. El resumen de Node agrupa las pruebas por archivo.

Las pruebas añadidas o ampliadas verifican aperturas luminales, fijación de inserciones, continuidad de ramas de actina, independencia de la espina conservada, contacto tridimensional, localización extracelular del complemento, gating de caspasas, origen intermembranal del citocromo c, reversibilidad, topología de crestas y separación entre reacción extracelular, PTP y AIF. Comprueban también conservación de estados y recursos al repetir actualizaciones.

La validación visual utiliza Chromium con WebGL 2 y ANGLE/SwiftShader, no imágenes generadas. Las capturas de composición usan 1280 × 900, DPR 1, con movimiento de cámara reducido. Se inspeccionan las 26 etapas y estados avanzados pertinentes; el script activa los controles reales de la interfaz. Pausa, exploración, regreso al hub y selección se registran en JSON. La selección mediante el desplegable no equivale a probar cada píxel seleccionable desde todos los ángulos.

El [registro final de escritorio](previews/phase1-final-validation.json) contiene 28 capturas, 44 selecciones correctas, pausa estable y exploración disponible en A–D, dos regresos por módulo y cero errores de consola, página, HTTP o solicitudes fallidas. Las selecciones corresponden a 16 estructuras de B (incluidas actina/caspasa local y los componentes intrínsecos), 9 de A, 6 de C y 13 de D. No todas las estructuras transitorias se seleccionaron en todas las etapas.

Las pasadas de [390 × 844](previews/phase1-mobile390-validation.json) y [320 × 740](previews/phase1-mobile320-validation.json) incluyen las vistas inicial y final de los cuatro modelos: 16 capturas adicionales, sin errores del navegador ni regresiones de lectura apreciadas. En cuatro ciclos completos a 390 px permanecieron **149 geometrías, 2 texturas y 4 sesiones**. Es estabilidad del recuento de recursos cargados, no una medición de memoria total o de rendimiento físico.

**Implementada sin validación visual:** el recorrido completo de las cámaras con movimiento normal. Sus encuadres sí se renderizaron y las pruebas del interpolador pasan, pero las pasadas animadas por software no terminaron dentro de sus plazos. Esta clasificación afecta a la verificación temporal completa, no a las vistas anatómicas ya inspeccionadas.

El [muestreo de movimiento](previews/phase1-motion-validation.json) registró 39 posiciones distintas y finitas durante la entrada de B, sin completar la transición en 90 segundos. Una [pasada de diagnóstico](previews/phase1-motion-debug-validation.json) confirmó cámara activa, documento visible y ocho posiciones distintas en 20 segundos. El límite existente de 0,1 segundos de avance por fotograma requiere al menos 53 fotogramas para esa entrada; SwiftShader no los entregó a tiempo. B además comparte pose de entrada y vista general, por lo que su último tramo no cambia de posición. No se cambió el reloj de cámara para hacer pasar esta prueba ni se declaró una transición completa verificada. La introducción automática tampoco queda certificada por estas pasadas.

La primera ronda detectó y permitió corregir un artefacto de transparencia/normales del eje de B, encuadres de D y un 404 del favicon. Las capturas históricas del repositorio se mantienen como comparación; la familia `phase1-final-*` corresponde a esta fase. [Registro reproducible](../scripts/capture-phase1.mjs) y [validación detallada](validation.md).

## Limitaciones y pendientes

| Clasificación | Alcance real |
| --- | --- |
| **Pendiente** | Comparación científica directa con los paneles originales de la Figura 1: `assets/reference-synapse.png` y `assets/poster-reference.png` están vacíos. `assets/image.png` es un mockup de interfaz. La documentación registra esta limitación y utiliza fuentes primarias, sin atribuir contenido a la figura ausente. |
| **Pendiente** | Mediciones de FPS, consumo y calidad en GPU física, Safari/iOS, Android y distintos drivers. SwiftShader confirma renderizado e interacciones, pero no el rendimiento de esos dispositivos. |
| **Pendiente** | Completar la revisión temporal de cámaras en un renderizador con rendimiento suficiente, además de la auditoría de selección directa y oclusiones desde todos los ángulos. Las pruebas automáticas de cámara y encuadres inspeccionados no garantizan ausencia de toda oclusión durante una órbita libre. |
| **Pendiente** | Verificación del sitio publicado en GitHub Pages. La compilación estática y las rutas locales pasan; no se realizó un despliegue. |

No se declara validación visual de escenarios que no se hayan renderizado. Los límites de plataforma y de referencia original se separan de las mejoras comprobadas en el entorno disponible.

## Elementos útiles para la segunda fase

1. Contrastar las ilustraciones con los paneles originales cuando estén accesibles y someter localizaciones, nomenclatura y alcances a revisión experta independiente.
2. Medir el rendimiento real en dispositivos representativos antes de aumentar densidad geométrica; ajustar el detalle de B/D si esas mediciones lo justifican.
3. Ampliar la revisión de órbitas, selección por raycast y lectura de etiquetas en vistas oblicuas y pantallas estrechas, conservando los controles actuales.
4. Afinar la lectura de subcompartimentos pequeños —espacio intermembranal, crestas y proteínas de la vía intrínseca— según la revisión científica, sin sugerir escalas o estequiometría experimentales.
5. Suavizar aún más la transición de normales y pigmento en las inserciones de C: el lumen está abierto y el contacto es correcto, pero un reborde sombreado permite reconocer la unión entre las superficies del cuello y del eje.
6. Revisar la duración de la entrada de B y su tramo final entre poses idénticas junto con la validación temporal pendiente, conservando el recorrido anatómico y los controles.
