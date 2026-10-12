# Fase 2 — Evidencia experimental y mecanismos moleculares

## Objetivo y niveles de evidencia

El apartado acompaña el estudio **Age-Dependent Cerebral Redox Vulnerability to Excitotoxic, Oxidative, and Mitochondrial Challenges.** Mantiene tres niveles separados: las figuras experimentales suministradas, los mecanismos establecidos en otras preparaciones por la literatura y las interpretaciones plausibles del estudio. Las escenas 3D pertenecen al segundo nivel; no muestran acontecimientos observados en las muestras ni reconstruyen una cinética experimental.

La aplicación conserva una sola entrada y dos experiencias: «Mecanismos fisiopatológicos» y «Evidencia experimental». El atlas A–D mantiene su navegación. Desde los resultados se puede consultar B para QUIN, D para FeSO₄/3-NP y A/C como contexto de plasticidad y remodelado, y regresar a la selección experimental. La edad y el ensayo seleccionan resultados, sin graduar el tamaño, deterioro o intensidad de las escenas moleculares.

## Preparación y diseño informado

| Variable | Información suministrada |
| --- | --- |
| Preparación | Homogeneizados cerebrales de rata Wistar |
| Edades | PN3, PN5, PN9, PN12 y PN30 |
| Exposiciones independientes | Control; FeSO₄ 1 mM; QUIN 100 µM; 3-NP 3 mM |
| Duración de exposición | 2 horas |
| Ensayos | DCFDA, TBARS y MTT |
| MTT en PN3 | No evaluado: PN3 no aparece en la figura final suministrada |
| Resumen estadístico indicado en los pies | Promedio ± SEM; n = 5–6; Kruskal–Wallis seguido de Dunn |

La preparación, concentraciones y duración proceden de las instrucciones del investigador. El Word contiene tres figuras y sus pies, sin protocolo experimental detallado ni datos individuales. No permite determinar qué grupos tienen n = 5 o n = 6, la independencia biológica de cada réplica, el sexo, la región cerebral, la composición del tampón, el método de cuantificación de proteína, los controles de interferencia de los compuestos o las condiciones instrumentales. Estos detalles no se completan por inferencia. La exposición de dos horas no debe confundirse con la duración de incubación de cada ensayo, que no está documentada.

## Procedencia y conservación de las figuras

La fuente es [`assets/graficas.docx`](../assets/graficas.docx), SHA-256 `743355d9f45e3c50523d68c2b6dc9088eb8fb17ff1f818ece7c6cf8f7b50dd86`. El contenedor DOCX incluye tres metarchivos vectoriales EMF (`word/media/image1.emf` a `image3.emf`) y sus leyendas. No contiene un libro de cálculo ni tablas numéricas incrustadas. No se localizó un Excel o una tabla fuente con medias y SEM en el repositorio.

| Figura | Archivo original extraído | Edades representadas | Unidad impresa |
| --- | --- | --- | --- |
| 1 — DCFDA | [`figure-1-dcfda.emf`](../public/evidence/figure-1-dcfda.emf) | PN3, PN5, PN9, PN12, PN30 | `oxidacion de DCFA (μM/ug proteina)` |
| 2 — TBARS | [`figure-2-tbars.emf`](../public/evidence/figure-2-tbars.emf) | PN3, PN5, PN9, PN12, PN30 | `µM MDA/mg proteina` |
| 3 — MTT | [`figure-3-mtt.emf`](../public/evidence/figure-3-mtt.emf) | PN5, PN9, PN12, PN30 | `MTT reduction (%)` |

La grafía «DCFA» se conserva en la figura y en la transcripción de su unidad. El selector se denomina DCFDA siguiendo el protocolo descrito por el investigador; esta diferencia editorial no autoriza a sustituir unidades, recalibrar el eje ni corregir el gráfico. La unidad TBARS se reproduce literalmente, sin transformarla a otra unidad que parezca más habitual.

[`scripts/extract-evidence.py`](../scripts/extract-evidence.py) extrae los EMF sin modificar sus bytes, transcribe el texto del documento y registra sus huellas y coordenadas gráficas. Los pies literales están en [`original-captions.txt`](../public/evidence/original-captions.txt); la procedencia verificable está en [`provenance.json`](../public/evidence/provenance.json) y [`src/evidence/figure-source.js`](../src/evidence/figure-source.js). Las versiones SVG permiten presentar el mismo dibujo completo en el navegador; los EMF originales siguen disponibles para consulta. La conversión usa `emf2svg 1.1.0` y puede reproducirse mediante `python3 scripts/extract-evidence.py --convert` con el conversor opcional de la caché local. Se añade un `viewBox` explícito y se convierte el carácter privado U+F06D de la fuente Symbol a μ Unicode en su misma posición: esto conserva la unidad visible en sistemas sin esa fuente y no cambia datos, símbolos estadísticos o coordenadas del dibujo.

Las coordenadas del dibujo solo sirven para situar un resaltado de selección sobre la figura. **No son una digitalización de datos.** No se convierten alturas de barras o bigotes en medias, SEM, tamaños de efecto, concentraciones o valores p. Cada selección devuelve `mean: null` y `sem: null`; se muestra la figura original en vez de reconstruirla. El resaltado no desplaza ni reemplaza marcas estadísticas.

### Anotaciones estadísticas y aclaraciones del investigador

- **DCFDA:** el pie define `a` como p < 0.05 frente a PN5. Es una comparación entre edades, no automáticamente una comparación de exposición frente al control. La ausencia de un símbolo no permite calcular un valor p ni demostrar equivalencia.
- **TBARS:** el pie define `a` como p < 0.05 frente a PN3 y `*` como p < 0.05 frente al control de cada edad. El investigador aclaró que QUIN **no mostró un patrón consistente de incremento de peroxidación lipídica entre edades**, pero que la figura sí presenta diferencias significativas respecto al control en condiciones tempranas: PN3 y PN5. Se conservan los asteriscos y su comparación tal como figuran en el original, sin generalizar el efecto a todas las edades ni recalcular la estadística. El umbral del pie no constituye un valor p exacto.
- **MTT:** el pie literal menciona `a` frente a PN3, aunque PN3 no figura en el gráfico y las marcas visibles son asteriscos. El investigador indicó que probablemente se trata de un error editorial y que los asteriscos probablemente significan p < 0.05 frente al control de cada edad. Se conserva el pie literal y todos los asteriscos, con una nota que identifica esa lectura como **interpretación editorial propuesta, no verificada independientemente**. No se transforma en valores p exactos ni en una tabla de significancia confirmada.

La aclaración de TBARS sustituye la formulación inicial demasiado general de QUIN «sin modificaciones significativas». La conclusión se especifica ahora por ensayo y edad: no se presenta una ausencia universal ni un incremento generalizado. La nota MTT sigue siendo una interpretación editorial propuesta; la aclaración de TBARS no modifica las otras figuras.

## Tres perspectivas de la respuesta cerebral

| Ensayo | Qué aporta | Qué no demuestra por sí solo |
| --- | --- | --- |
| DCFDA | Señal fluorescente relacionada con la oxidación de una sonda; el producto DCF informa indirectamente sobre determinados procesos oxidativos. | Identidad de una especie reactiva, flujo absoluto de ROS, origen mitocondrial o activación directa de NMDAR. |
| TBARS | Sustancias reactivas al ácido tiobarbitúrico, relacionadas con productos de oxidación lipídica y expresadas como indica la figura. | Identidad exclusiva de MDA, radical iniciador, lípido concreto oxidado o destrucción completa de una membrana. |
| MTT | Capacidad reductora de la preparación mediante formación de formazán. | Actividad específica de SDH/complejo II, concentración de ATP, respiración mitocondrial, viabilidad de neuronas intactas o apoptosis. |

La química de la sonda DCF puede introducir dependencia de catalizadores e intermediarios de oxidación; no es un detector universal o específico de ROS. Bonini y colaboradores demostraron limitaciones de este tipo en un sistema químico definido. No se atribuye ese artefacto concreto a las muestras presentes sin controles [1]. TBARS incluye reacciones con compuestos distintos del MDA; sin separación y validación analítica documentadas no debe interpretarse como una identificación molecular exclusiva [2]. La reducción de MTT puede incluir varias actividades y compartimentos: el hecho de que 3-NP inhiba SDH no convierte MTT en un ensayo específico de SDH [3].

Un aumento de TBARS puede coexistir con ausencia de incremento significativo de DCFDA porque los ensayos detectan fenómenos y productos distintos, con sensibilidades e interferencias propias. Este razonamiento permite interpretar su complementariedad; no identifica por sí mismo la causa de esa combinación en el estudio. Tampoco un resultado no significativo prueba ausencia de efecto biológico.

## Representaciones moleculares y relación con los resultados

### FeSO₄ — química redox y lípidos

La bicapa ilustra cabezas polares, cadenas hidrocarbonadas y regiones susceptibles a oxidación. Se representa la reacción conceptual `Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + •OH`, con el radical hidroxilo actuando localmente cerca del sitio de formación. La literatura respalda la química de Fenton y la relevancia del entorno de coordinación del hierro [4, 5]. La fórmula es un esquema educativo, no una afirmación de que toda especie de hierro produzca idénticos oxidantes en cualquier medio.

La alteración limitada de cadenas lipídicas y la propagación conceptual sirven para explicar la relación potencial con TBARS. Los ensayos no identificaron directamente •OH ni productos lipídicos concretos. Tampoco se representa lisis como un hallazgo. Los cambios de MTT se describen como cambios de capacidad reductora; la animación no mide su origen.

### 3-NP — succinato deshidrogenasa/complejo II

La mitocondria en corte reutiliza la anatomía refinada en fase 1. La SDH conecta la conversión de succinato en fumarato con la transferencia electrónica hacia ubiquinona; la ATP sintasa y los demás complejos aportan contexto, sin representar que el complejo II bombea protones. El corte permite observar membranas y crestas y no significa rotura experimental de la mitocondria.

La inhibición por 3-NP es un mecanismo establecido [6]. La evidencia estructural y química posterior sitúa una modificación covalente en una arginina catalítica del sitio activo [7]; no se presenta el antiguo modelo de una modificación obligatoria del FAD ni una unión directa de 3-NP a ATP sintasa. La escena no pretende reconstruir el aducto atómico exacto. El posible compromiso bioenergético se etiqueta como mecanismo descrito en la literatura. La disminución de MTT no demuestra por sí sola inhibición de SDH, caída de ATP, pérdida de respiración o muerte neuronal en estas muestras.

### QUIN — potencial excitotóxico y límites de la preparación

QUIN se sitúa extracelularmente en una ilustración de NMDAR. Estudios electrofisiológicos apoyan la actividad excitadora de QUIN y su sensibilidad a antagonistas de NMDA [8, 9]. La entrada de Ca²⁺ se condiciona al coagonista y al estado de voltaje que modifica el bloqueo por Mg²⁺ [10, 11]. Una entrada de calcio no implica excitotoxicidad por sí sola. La prolongación de la señal, la alteración mitocondrial y el desequilibrio redox son posibilidades dependientes del contexto, no una secuencia universal ni hallazgos en los homogeneizados.

Interpretación solicitada por el investigador para los resultados sin cambios significativos, contextualizada aquí en DCFDA/MTT y no como descripción universal de TBARS:

> La ausencia de modificaciones estadísticamente significativas tras la exposición aguda a QUIN podría estar relacionada con la duración del tratamiento y con las características de la preparación experimental. Algunos mecanismos excitotóxicos pueden requerir condiciones de estimulación sostenida o una organización celular funcional que no se conserva íntegramente en el homogeneizado.

La exposición fue de **2 horas**. No se aportó una comparación temporal, por lo que no se puede demostrar un efecto tardío ni atribuir definitivamente un resultado no significativo al tiempo. La hipótesis temporal no elimina las diferencias tempranas de QUIN en TBARS ni explica por sí sola su patrón entre edades. Se mantienen las conclusiones específicas por ensayo y las anotaciones originales; no se crea una cronología experimental adicional.

La vía secundaria `triptófano → quinurenina → 3-hidroxiquinurenina → ácido 3-hidroxiantranílico → intermediarios → QUIN`, con rama hacia KYNA, proporciona contexto metabólico. Estudios con trazadores y preparaciones celulares apoyan esa ruta y su dependencia celular/contextual [12, 13]. KYNA puede antagonizar respuestas NMDAR mediante el sitio modulador de glicina en determinadas condiciones [14]; esto no equivale a un antagonismo absoluto QUIN/KYNA ni a mediciones de esa ruta en el estudio. No se muestran transformaciones metabólicas como resultados propios.

QUIN utiliza una silueta anular con dos ramas carboxilo adyacentes, distinta del glifo alargado de 3-NP. Se inspira en la conectividad de las fichas PubChem de [QUIN, CID 1066](https://pubchem.ncbi.nlm.nih.gov/compound/Quinolinic-Acid) y [3-NP, CID 1678](https://pubchem.ncbi.nlm.nih.gov/compound/3-Nitropropionic-acid). Su disposición gráfica es esquemática, no una conformación obtenida de las muestras o una estructura cristalográfica nueva.

## Desarrollo posnatal y homogeneizado

El desarrollo implica cambios en la actividad de complejos respiratorios y de enzimas antioxidantes, documentados en otras series de cerebro de rata [15, 16]. Sus trayectorias no son todas paralelas; no permiten asignar una intensidad anatómica universal a PN3–PN30. Las diferencias del estudio deben leerse en sus propias figuras, sin equivalencias lineales con edades humanas ni inferencias sobre densidad sináptica, microglía o morfología no medidas.

Nota científica de referencia interna:

> Representación conceptual: los ensayos fueron realizados en homogeneizados cerebrales de ratas Wistar. Los modelos tridimensionales ilustran mecanismos celulares y moleculares descritos en la literatura, pero no representan observaciones directas de dichos procesos en las muestras experimentales.

Tras la [ronda editorial puntual](visual-editorial-polish.md), la interfaz presenta este alcance de forma compacta en Metodología. Las notas técnicas de importación, los pies literales y las aclaraciones editoriales se conservan en las fuentes internas; el panel público utiliza leyendas breves y comparaciones según la figura original.

La homogeneización limita la polarización normal de membranas, la integridad de circuitos, la transmisión organizada, el contacto intercelular y las relaciones neuronales/gliales. Puede conservar componentes moleculares y actividades enzimáticas, sin reproducir tejido intacto. No se atribuyen a estos ensayos activación directa de NMDAR, microglía, caspasas, apoptosis o pérdida de neuronas.

## Componentes y validación

- `src/evidence/data.js`: edades, exposiciones, ensayos, textos de interpretación y consulta de resultados sin valores reconstruidos.
- `src/evidence/figure-source.js` y `public/evidence/provenance.json`: trazabilidad de dibujos, pies y coordenadas, generada desde el DOCX.
- `public/evidence/`: originales EMF, conversiones para navegador y leyendas literales.
- `src/evidence/interface.js` y `styles.css`: navegación entre experiencias, selectores, figuras ampliables, contexto y metodología.
- Los mecanismos `e-control`, `e-feso4`, `e-3np` y `e-quin` usan la infraestructura común de cámara, reproducción y selección. La escena de evidencia no recibe la edad ni el ensayo como parámetros para su anatomía.
- `tests/evidence-data.test.js`: comprobaciones de procedencia, selecciones, ausencia de datos inventados y regiones del resaltado; las pruebas visuales de integración deben verificar también los símbolos, patrones, rótulos y ejes del SVG convertido.

Esta documentación describe las decisiones y límites científicos. El [informe técnico de validación](phase2-validation.md) registra las pruebas, compilación, capturas de las cuatro exposiciones, retorno al atlas, revisión móvil a 390/320 px y prueba de producción con y sin WebGL. También distingue las limitaciones y comprobaciones pendientes.

## Referencias primarias verificables

1. Bonini MG, Rota C, Tomasi A, Mason RP (2006). Oxidación de DCFH y limitaciones de la sonda. *Free Radical Biology and Medicine* 40:968–975. [PubMed](https://pubmed.ncbi.nlm.nih.gov/16540392/), [DOI](https://doi.org/10.1016/j.freeradbiomed.2005.10.042).
2. Knight JA, Pieper RK, McClellan L (1988). Especificidad de la reacción con ácido tiobarbitúrico. *Clinical Chemistry* 34:2433–2438. [PubMed](https://pubmed.ncbi.nlm.nih.gov/3197281/).
3. Berridge MV, Tan AS (1993). Localización subcelular y dependencia de sustratos de la reducción de MTT. *Archives of Biochemistry and Biophysics* 303:474–482. [PubMed](https://pubmed.ncbi.nlm.nih.gov/8390225/), [DOI](https://doi.org/10.1006/abbi.1993.1311).
4. Lloyd RV, Hanna PM, Mason RP (1997). Origen del oxígeno del radical hidroxilo en la reacción de Fenton. *Free Radical Biology and Medicine* 22:885–888. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9119257/), [DOI](https://doi.org/10.1016/S0891-5849(96)00432-7).
5. Yamazaki I, Piette LH (1990). Estudios de atrapamiento de espín de la reacción Fe²⁺/H₂O₂. *Journal of Biological Chemistry* 265:13589–13594. [PubMed](https://pubmed.ncbi.nlm.nih.gov/2166035/).
6. Alston TA, Mela L, Bright HJ (1977). Inactivación de succinato deshidrogenasa por 3-nitropropionato. *PNAS* 74:3767–3771. [PubMed](https://pubmed.ncbi.nlm.nih.gov/269430/), [DOI](https://doi.org/10.1073/pnas.74.9.3767).
7. Huang LS et al. (2006). Modificación covalente de una arginina catalítica de complejo II por 3-NP. *Journal of Biological Chemistry* 281:5965–5972. [Texto completo](https://pmc.ncbi.nlm.nih.gov/articles/PMC1482830/), [DOI](https://doi.org/10.1074/jbc.M511270200).
8. Stone TW, Perkins MN (1981). Actividad excitadora de QUIN en el sistema nervioso central. *European Journal of Pharmacology* 72:411–412. [PubMed](https://pubmed.ncbi.nlm.nih.gov/6268428/), [DOI](https://doi.org/10.1016/0014-2999(81)90587-2).
9. Perkins MN, Stone TW (1983). Farmacología y variación regional de las respuestas excitadoras a QUIN. *Journal of Pharmacology and Experimental Therapeutics* 226:551–557. [PubMed](https://pubmed.ncbi.nlm.nih.gov/6308211/).
10. Nowak L et al. (1984). Bloqueo dependiente de Mg²⁺ de canales activados por NMDA. *Nature* 307:462–465. [PubMed](https://pubmed.ncbi.nlm.nih.gov/6320006/).
11. Johnson JW, Ascher P (1987). Potenciación por glicina de la respuesta NMDA. *Nature* 325:529–531. [Artículo](https://www.nature.com/articles/325529a0).
12. Heyes MP et al. (1993). Formación de QUIN desde triptófano en contextos neuroinflamatorios. *Brain* 116:1425–1450. [PubMed](https://pubmed.ncbi.nlm.nih.gov/8293279/), [DOI](https://doi.org/10.1093/brain/116.6.1425).
13. Naritsin DB et al. (1995). Metabolismo de triptófano hacia quinurenato y quinolinato en SNC. *Journal of Neurochemistry* 65:2217–2226. [PubMed](https://pubmed.ncbi.nlm.nih.gov/7595510/), [DOI](https://doi.org/10.1046/j.1471-4159.1995.65052217.x).
14. Birch PJ, Grossman CJ, Hayes AG (1988). Acción de KYNA sobre respuestas NMDA mediada por el sitio de glicina. *European Journal of Pharmacology* 154:85–87. [PubMed](https://pubmed.ncbi.nlm.nih.gov/2846328/), [DOI](https://doi.org/10.1016/0014-2999(88)90367-6).
15. Bates TE, Almeida A, Heales SJ, Clark JB (1994). Desarrollo posnatal de complejos respiratorios en mitocondrias de cerebro de rata. *Developmental Neuroscience* 16:321–327. [PubMed](https://pubmed.ncbi.nlm.nih.gov/7768212/), [DOI](https://doi.org/10.1159/000112126).
16. Mavelli I, Rigo A, Federico R, Ciriolo MR, Rotilio G (1982). Trayectorias posnatales de superóxido dismutasa, glutatión peroxidasa y catalasa en cerebro de rata. *Biochemical Journal* 204:535–540. [Texto completo](https://pmc.ncbi.nlm.nih.gov/articles/PMC1158382/), [DOI](https://doi.org/10.1042/bj2040535).

Las referencias describen sus respectivas preparaciones y condiciones; ninguna sustituye la fuente experimental del estudio ni demuestra los mecanismos en sus homogeneizados.
