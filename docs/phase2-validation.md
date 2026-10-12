# NEURO·VISTA — Informe técnico de Fase 2

**Estado del registro: 11 de octubre de 2026.** La implementación integra evidencia experimental y mecanismos moleculares en la aplicación existente. Están ejecutadas las verificaciones de escritorio, navegación, 60 selecciones, tres ciclos de recursos y compilación descritas abajo. También se completaron las pasadas móviles de 390 y 320 px, los diálogos y la recaptura de QUIN tras ajustar su distancia de cámara. La versión compilada también se verificó bajo `/qr/`, con WebGL y con su inicialización denegada. Los límites de esta validación se indican al final.

## Cambios implementados

La entrada ofrece dos experiencias dentro de la misma aplicación Vite/Three.js: el atlas de mecanismos A–D y la evidencia experimental. El nuevo apartado permite seleccionar cinco edades posnatales, cuatro exposiciones independientes y tres ensayos. Conserva el control de reproducción, la exploración, las anotaciones y la selección de estructuras. Los accesos contextuales relacionan FeSO₄/3-NP con D, QUIN con B y el desarrollo/remodelado con A/C. Las sesiones disponen de almacenamiento separado de su estado.

La información experimental se presenta junto al modelo conceptual, con figuras ampliables, leyendas originales, descarga del vector fuente, metodología, referencias y una advertencia visible sobre los homogeneizados. Cambiar edad o ensayo consulta resultados; no asigna automáticamente anatomía, deterioro ni intensidad de animación a esas variables.

| Exposición | Representación implementada | Relación y límite científico |
| --- | --- | --- |
| Control | Bicapa y mitocondria de referencia; 2 etapas | Contexto anatómico, sin afirmar que el homogeneizado conserve tejido intacto. |
| FeSO₄ · 1 mM | Bicapa, cadenas susceptibles, Fe²⁺/Fe³⁺, H₂O₂, OH⁻ y •OH local; 4 etapas | Fenton y oxidación lipídica como mecanismos de literatura; los ensayos no identifican directamente •OH ni cada producto dibujado. |
| 3-NP · 3 mM | Mitocondria reutilizada, SDH/complejo II, succinato/fumarato y transferencia hacia Q; 4 etapas | Inhibición farmacológica contextual. Complejo II no bombea protones; MTT no mide específicamente SDH, ATP o respiración. |
| QUIN · 100 µM | Sinapsis reutilizada, ligando extracelular, NMDAR condicionado, Ca²⁺ y respuestas secundarias posibles; 5 etapas | Potencial excitotóxico dependiente del contexto. La escena no demuestra activación de NMDAR, ROS específica o apoptosis en estas muestras. |

QUIN tiene una silueta anular con dos ramas carboxilo adyacentes, diferenciada del símbolo de 3-NP. Son representaciones esquemáticas de conectividad, sin pretender una conformación atómica determinada experimentalmente. La vía de las quinureninas y la rama KYNA se incluyen como contexto secundario de literatura.

## Trazabilidad e interpretación de los resultados

La fuente es [`assets/graficas.docx`](../assets/graficas.docx), con huella SHA-256 `743355d9f45e3c50523d68c2b6dc9088eb8fb17ff1f818ece7c6cf8f7b50dd86`. Sus tres EMF se conservan sin cambios de bytes en [`public/evidence/`](../public/evidence/). Se incluyen versiones SVG para navegador, pies literales y un [registro de procedencia](../public/evidence/provenance.json). Las regiones de selección proceden de coordenadas del dibujo y no se usan para calcular valores experimentales.

**No se aportó Excel ni una tabla de medias, SEM o datos individuales.** Todas las consultas conservan `mean: null` y `sem: null`. No se reconstruyeron barras, errores ni valores p aproximando alturas. Las figuras mantienen sus unidades impresas, incluidos «DCFA» en DCFDA y `µM MDA/mg proteina` en TBARS. MTT en PN3 se muestra como **No evaluado**.

Las aclaraciones del investigador quedan diferenciadas de la fuente original:

- **QUIN/TBARS:** la figura señala diferencias significativas frente al control en PN3 y PN5, conservadas con sus asteriscos. QUIN no mostró un patrón consistente de incremento entre edades; no se generaliza el efecto ni se describe una ausencia universal. El umbral p < 0.05 del pie no se convierte en un valor p exacto.
- **MTT:** se conserva el pie que menciona `a` frente a PN3, aunque la figura contiene asteriscos y no PN3. La lectura propuesta por el investigador —probablemente frente al control de cada edad— se identifica como interpretación editorial no verificada independientemente. No se recalculan resultados ni se modifica la figura.
- **Tiempo de QUIN:** la exposición fue de dos horas, sin comparación temporal. La interpretación sobre posibles limitaciones de duración/preparación se aplica a resultados sin significancia, contextualizados en DCFDA/MTT; no elimina las diferencias tempranas de TBARS ni demuestra efectos tardíos.

La documentación científica desarrolla las diferencias entre DCFDA, TBARS y MTT, los límites del homogeneizado y 16 referencias primarias verificables en [`phase2-experimental-evidence.md`](phase2-experimental-evidence.md). No se atribuyen a estos ensayos radicales concretos, SDH, ATP, muerte neuronal, NMDAR, microglía o apoptosis medidos directamente.

## Verificaciones ejecutadas

### Pruebas automatizadas

`npm test` pasó con **14 archivos de pruebas** con 14 aprobados y 0 fallos. Las comprobaciones de datos incluyen:

- Integridad de Word y EMF mediante huellas, concordancia del manifiesto y leyendas literales.
- Las 60 combinaciones de edad/exposición/ensayo: 56 disponibles en las figuras y cuatro selecciones PN3/MTT no evaluadas; medias y SEM desconocidas siempre nulas.
- Regiones de resaltado finitas dentro del viewport de cada figura; conservación de asteriscos, letras `a` y edades en SVG.
- Aclaración de QUIN/TBARS sin incremento generalizado y nota editorial MTT sin matriz de significancia inventada.
- Estados de escenas y separación de sesiones, junto con las pruebas existentes del atlas. La prueba automatizada de un estado no sustituye su comprobación visual en el navegador.

`npm run build` pasó: **46 módulos**, con comprobación del resultado de producción de **29 archivos y 62 referencias**. La compilación y su verificación de rutas no equivalen a una publicación en GitHub Pages.

### Renderizado de escritorio

Se generaron capturas reales con Chromium, WebGL 2, ANGLE/SwiftShader, viewport **1280 × 900**, DPR **1** y preferencia `reducedMotion: reduce`. El [reporte de escritorio](previews/phase2-desktop-validation.json) registra las **15 etapas** de las cuatro exposiciones, más capturas durante las reacciones de FeSO₄ y 3-NP.

| Escena | Etapas capturadas | Selecciones con panel visible registradas |
| --- | ---: | ---: |
| Control | 2 | 2 |
| FeSO₄ | 4 | 8 |
| 3-NP | 4 | 6 |
| QUIN | 5 | 10 |

Las listas `consoleErrors`, `pageErrors`, `httpErrors` y `failedRequests` del reporte de escritorio están vacías. Las capturas muestran la escena 3D, controles, panel de evidencia y figura original, con distinción entre el mecanismo y el resultado.

Capturas representativas:

- [Menú de experiencias](previews/phase2-desktop-menu.png).
- [Control, compartimentos](previews/phase2-desktop-control-stage-2.png).
- [FeSO₄, reacción local](previews/phase2-desktop-feso4-stage-3-reaction.png).
- [3-NP, inhibición ilustrativa](previews/phase2-desktop-3np-stage-3-reaction.png).
- [QUIN, posibles respuestas secundarias](previews/phase2-desktop-quin-stage-4.png).
- Figuras convertidas: [DCFDA](previews/phase2-source-1-dcfda.png), [TBARS](previews/phase2-source-2-tbars.png) y [MTT](previews/phase2-source-3-mtt.png).

El reporte conserva el historial de una primera ejecución interrumpida, identificada como `interrupted` (código 143), y una segunda ejecución completada para 3-NP/QUIN. No se interpreta aquel estado como una ejecución completa: la evidencia son los registros y capturas guardados por escena y la finalización de la continuación. Esta observación evita confundir un proceso interrumpido con una validación inexistente.

Después de la primera pasada se alejaron las cámaras general y mitocondrial de QUIN para despejar los textos. La recaptura de sus cinco etapas terminó correctamente y se revisaron las vistas general, mitocondrial y final: la mitocondria y su etiqueta quedan por encima del texto de etapa. El reporte conserva ambas ejecuciones completadas.

### Navegación, matriz de resultados y recursos

El [reporte de navegación](previews/phase2-navigation-validation.json) terminó con estado `complete`, código de salida 0 y sin errores de consola, página, HTTP o peticiones fallidas. Registra:

- **60 selecciones en la interfaz:** todas conservan la escena conceptual al cambiar edad o ensayo; PN3/MTT permanece no evaluado.
- **Retorno a A y C:** se restauran etapa, tiempo transcurrido, selección, modo de exploración, cámara y objetivo; el regreso a evidencia conserva sus filtros y estado.
- **Enlaces FeSO₄ → D y QUIN → B:** entrada y regreso a evidencia con restauración comprobada.
- **Tres ciclos completos**, después de cargar las escenas: los contadores permanecen en **215 geometrías, 2 texturas y 8 sesiones**; la escena pausada mantiene su tiempo.

La estabilidad de esos contadores no demuestra ausencia absoluta de fugas: no se ha medido heap, memoria GPU ni FPS.

Las comprobaciones pueden repetirse con `node scripts/capture-phase2.mjs --tag desktop --matrix --bookmarks --reactions --dialogs --cycles 3` y una pasada móvil con `--width 320 --height 740 --quick`. El script utiliza Playwright/Chromium de una caché opcional, sin añadir dependencias al sitio publicado; admite `NEUROVISTA_PLAYWRIGHT` y `NEUROVISTA_CHROMIUM` para otras instalaciones locales. Los informes conservan los estados y errores reales de cada ejecución.

### Renderizado móvil

El [reporte de 390 × 844 px](previews/phase2-mobile390-validation.json) terminó con estado `complete` y sin errores de consola, página, HTTP o peticiones. Incluye primera y última etapa de Control, FeSO₄, 3-NP y QUIN y una captura de resultados para cada exposición. También pasaron los retornos A/C y los enlaces B/D con restauración de filtros y estados. Se revisaron el [menú](previews/phase2-mobile390-menu.png), [QUIN final](previews/phase2-mobile390-quin-stage-5.png), [resultados TBARS](previews/phase2-mobile390-quin-results.png) y [FeSO₄ final](previews/phase2-mobile390-feso4-stage-4.png). La página desplaza verticalmente el modelo y los resultados; la figura ampliada conserva desplazamiento horizontal para consultar sus ejes y leyendas sin recortarlos.

El [reporte de 320 × 740 px](previews/phase2-mobile320-validation.json) añade las cuatro exposiciones con primera/última etapa y resultados, las figuras DCFDA/TBARS/MTT ampliadas y metodología. Verifica carga, desplazamiento horizontal dentro de la figura, foco dentro del diálogo y devolución del foco al cerrarlo. Las capturas del [atlas A](previews/phase2-mobile320-atlas-a-restored.png) y [atlas C](previews/phase2-mobile320-atlas-c-restored.png) registran sus estados restaurados y paneles de selección.

La primera pasada detectó 11 px de desbordamiento del fondo de la narrativa del atlas a 320 px. Se ajustó únicamente su margen móvil de 34 a 23 px; la repetición terminó correctamente con `scrollWidth === clientWidth === 320`, tanto en el atlas como en la evidencia y los diálogos. El informe conserva el fallo anterior y la repetición superada; no se ocultó la comprobación fallida. No hubo errores de consola, página, HTTP o peticiones en ninguna de esas pasadas.

### Producción y alternativa sin WebGL

El [reporte de producción](previews/phase2-production-validation.json) terminó con estado `complete` sirviendo `dist/` exclusivamente bajo **`/qr/`**. No se publicaron archivos. La prueba usó controles del DOM y comprobó que `__atlas` y `__evidence` no existen en producción. Cargaron las cuatro exposiciones y los tres SVG dentro de `/qr/evidence/`; PN3/MTT conserva «No evaluado». Se verificaron los diálogos, referencias de evidencia, regreso desde B con filtros conservados y acceso al menú tanto por su botón como por la marca.

En una segunda página se denegó deliberadamente la creación del contexto WebGL. La [captura sin WebGL](previews/phase2-production-webgl-unavailable-evidence.png) muestra los selectores y resultados accesibles. Pasaron las cuatro exposiciones, las tres figuras, metodología y navegación de menú. Sus dos mensajes de consola corresponden al fallo WebGL provocado y están registrados como esperados; no hubo otras excepciones, errores HTTP o solicitudes fallidas. La pasada normal no registró errores.

Se corrigieron dos rutas de interfaz para este caso: «Referencias» consulta la experiencia visible aunque no exista escena 3D, y la marca utiliza la misma acción de regreso que «Menú». Para repetir esta prueba: `npm run build` y `node scripts/smoke-phase2-production.mjs --tag production`.

## Clasificación del trabajo

| Elemento | Estado | Alcance de la comprobación |
| --- | --- | --- |
| Figuras originales, procedencia, leyendas y ausencia de datos aproximados | **Completada y validada** | Huellas y pruebas de datos; figuras renderizadas en navegador. |
| Edades, concentraciones, unidades y PN3/MTT no evaluado | **Completada y validada** | Pruebas de las 60 consultas y recorrido exhaustivo en la interfaz. |
| Modelos Control, FeSO₄, 3-NP y QUIN en escritorio | **Completada y validada** | Render de las 15 etapas, dos reacciones y selección contextual registrada; el último ajuste de encuadre QUIN también está recapturado y revisado. |
| Separación resultado/literatura/hipótesis y aclaraciones estadísticas | **Completada y validada** | Revisión científica, textos, notas y pruebas de regresión. |
| Navegación de ida/vuelta y restauración de sesiones A–D | **Completada y validada** | Recorridos en navegador: estado de A/C y enlaces a B/D, con regreso y conservación de filtros. |
| Presentación móvil a 390 px | **Completada y validada** | Capturas iniciales/finales de cuatro exposiciones, resultados y restauración de estados; sin errores registrados. |
| Presentación a 320 px y diálogos | **Completada y validada** | Escenas iniciales/finales, resultados, tres figuras ampliadas, metodología, foco modal y retornos A/C. |
| Repetición de escenas sin crecimiento de contadores de recursos | **Completada y validada** | Tres ciclos con geometrías, texturas y sesiones estables; sin medición de heap/GPU/FPS. |
| Compilación y comprobación del paquete de producción | **Completada y validada** | `npm run build`: 46 módulos; 29 archivos y 62 referencias comprobados; navegador bajo `/qr/`. |
| Consulta experimental sin WebGL | **Completada y validada** | Fallo provocado: resultados, figuras, metodología, referencias y menú disponibles. |
| Transiciones con preferencia de movimiento normal | **Implementada sin validación visual exhaustiva** | Se conserva la infraestructura de cámara; las pasadas reproducibles usaron movimiento reducido. |
| Rendimiento en GPU/dispositivos físicos | **Pendiente** | No se midieron FPS, memoria GPU o heap; SwiftShader no sustituye esa comprobación. |
| Tabla exacta de medias/SEM y confirmación estadística independiente de MTT | **Pendiente de fuentes** | No se aportaron datos numéricos; las figuras originales permiten consultar los resultados sin inventar valores. |

## Próxima revisión recomendada

1. Incorporar una tabla numérica validada y el protocolo completo cuando estén disponibles, sin sustituir las figuras aprobadas por aproximaciones.
2. Confirmar documentalmente la correspondencia estadística de los asteriscos de MTT, conservando entretanto la nota editorial propuesta.
3. Medir rendimiento en GPU real y dispositivos táctiles, y revisar transiciones con movimiento normal y gestos manuales en diferentes orientaciones. Estas pruebas complementan las capturas realizadas; no se presentan como ya ejecutadas.

## Limitaciones que permanecen tras las comprobaciones técnicas

Faltan los datos numéricos y el protocolo completo del estudio; incorporar una tabla validada permitiría consultar medias/SEM y verificar comparaciones con más detalle. Hasta entonces la figura original tiene prioridad. La interpretación editorial de MTT requiere documentación estadística independiente para pasar de propuesta a confirmada.

Los EMF originales se verificaron por sus bytes y los SVG se revisaron en Chromium. No se realizó una comparación píxel a píxel con una renderización nativa de Microsoft Word; las fuentes tipográficas pueden variar entre plataformas.

Las escenas son ilustraciones estilizadas; no hay simulación molecular cuantitativa ni reconstrucción del homogeneizado. Las edades no representan cambios anatómicos medidos y no se convierten en edades humanas. Las dos horas no establecen una curva temporal de QUIN.

SwiftShader verifica que existe render WebGL y permite capturas reproducibles, pero no establece el rendimiento en GPU real ni cubre todos los dispositivos. La preferencia de movimiento reducido limita la cobertura de las transiciones con movimiento normal; las capturas de reacción aportan comprobación de animación en dos etapas, sin certificar exhaustivamente todas las trayectorias manuales de cámara.

No se ha realizado publicación ni `git push`, y esta fase no requiere modificar los workflows de despliegue.
