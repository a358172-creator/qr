# Panel A · plasticidad estructural de la espina

La referencia principal de este módulo es **el panel A de la Figura 1 proporcionada por el usuario en la conversación**. Muestra glutamato, NMDAR, Ca²⁺, DISC1, PSD-95, Kalirin-7, actina y una espina dendrítica. No se atribuye la figura a un artículo porque no se dispone de su procedencia bibliográfica original.

El recorrido interpreta su relación conceptual con la organización y el mantenimiento de la espina. La cámara y la iluminación reparten la atención entre estructuras coexistentes. El orden de las seis etapas no establece una cadena molecular obligatoria ni indica que las proteínas aparezcan desde cero, se activen todas del mismo modo o se desplacen de una a otra. La escena conserva una conexión fisiológica, con entrada moderada de calcio y remodelado sutil.

## Correspondencia con las seis etapas

| Etapa | Representación del panel A | Límite de interpretación |
| --- | --- | --- |
| 1. Arquitectura postsináptica | Espina mushroom continua con la dendrita, terminal, hendidura, densidad postsináptica y red interna de actina. | La morfología es una ilustración tridimensional, no una reconstrucción de una espina observada. |
| 2. Activación de NMDAR | Glutamato, apertura conceptual del canal y pocas partículas de Ca²⁺ entrando al microdominio. | No se representa la totalidad de las condiciones de apertura ni se cuantifican concentraciones. |
| 3. Organización postsináptica | Énfasis en PSD-95 próxima a la membrana; DISC1 ligeramente más profunda. | La proximidad y el foco indican contexto funcional, no una reacción directa ni un ensamblaje atomístico. |
| 4. Kalirin-7 | Complejo próximo al entramado de actina, destacado por un cambio de foco. | Su relación con el remodelado se ilustra sin incorporar intermediarios ausentes en la figura. |
| 5. Remodelado de actina | Reorientación gradual, ramificación localizada y ajuste leve de la cabeza de la misma espina. | El morph es una posibilidad ilustrativa; no mide fuerza sináptica, aprendizaje o una respuesta universal. |
| 6. Plasticidad estructural | Vista conjunta del receptor, la región postsináptica, los complejos y la arquitectura de actina. | La organización interna contribuye al mantenimiento y remodelado; el recorrido no demuestra una secuencia causal completa. |

## Evidencia primaria y alcance

- **PSD-95 y NMDAR.** Niethammer, Kim y Sheng identificaron interacciones entre subunidades de NMDAR y miembros de la familia PSD-95, compatibles con su papel en la organización postsináptica. El módulo mantiene PSD-95 cerca del receptor, sin dibujar dominios de unión ni estequiometría. [Estudio original, 1996](https://pubmed.ncbi.nlm.nih.gov/8601796/).
- **DISC1 y organización de la espina.** Hayashi-Takagi y colaboradores estudiaron la regulación de la morfología y función de las espinas mediante DISC1 y su relación con Kalirin-7 en modelos neuronales. Es apoyo para su inclusión funcional en el panel A; no justifica convertir el esquema en una cadena universal. Los intermediarios analizados por el estudio no se incorporan a esta escena. [Estudio original, 2010](https://www.nature.com/articles/nn.2487).
- **Kalirin-7 y plasticidad estructural.** Xie y colaboradores relacionaron Kalirin-7 con cambios estructurales y funcionales dependientes de actividad en espinas. Aquí se representa únicamente su asociación conceptual con remodelado, manteniendo el alcance de la figura. [Estudio original, 2007](https://pubmed.ncbi.nlm.nih.gov/18031682/).
- **Forma de la espina, NMDAR y actina.** Matsuzaki y colaboradores observaron cambios de tamaño de espinas tras estimulación local por glutamato, con dependencia de NMDAR y polimerización de actina en su preparación experimental. Las respuestas variaban con el tamaño inicial de la espina: el leve ensanchamiento mushroom del atlas no se presenta como potenciación duradera inevitable. [Estudio original, 2004](https://pmc.ncbi.nlm.nih.gov/articles/4158816/).

## Convenciones visuales

- PSD-95, DISC1 y Kalirin-7 son complejos orgánicos estilizados. Su tamaño, separación y profundidad favorecen la lectura; no representan una arquitectura molecular resuelta.
- La densidad postsináptica es una región de entramado proteico bajo la membrana. Se distingue de PSD-95, una proteína de esa organización, tanto en la selección como en los textos.
- La red de actina es tridimensional y más densa en la cabeza, con continuidad hacia el cuello. Las ramificaciones adicionales y el morph facilitan ver plasticidad; no simulan cinética de polimerización ni identifican proteínas ramificadoras adicionales.
- Los recorridos del calcio quedan ligados al canal y su dispersión intracelular es conceptual. No describen transporte dirigido de iones hacia una proteína específica.
- La transparencia temporal ayuda a observar el interior conservando la membrana como referencia espacial. Seleccionar actina debe destacar los filamentos y reducir discretamente el protagonismo del contexto.
- No forman parte de esta escena ROS, caspasas, microglía, lesiones de membrana ni alteración mitocondrial. Los otros tres módulos conservan sus propias narrativas; el hotspot independiente de apoptosis sigue fuera de alcance.
- Los campos `glut`, `activation`, `ca`, `scaffold`, `disc1`, `kalirin` y `remodeling` controlan énfasis visual y deformación sin unidades. Los 60 segundos del recorrido y las tasas de transición son decisiones de presentación, no escalas temporales ni constantes biológicas.

## Contrato del módulo

`src/mechanisms/synaptic-plasticity.js` define el identificador `signaling`, seis etapas de 8, 9, 10, 10, 13 y 10 segundos, siete poses de cámara, once contenidos seleccionables y la fábrica diferida `createPlasticityEnvironment` de `src/scene/plasticity-environment.js`.

La definición utiliza la sesión, timeline, cámara, controles y anotaciones compartidos del atlas. `resetOnExit: true` devuelve la experiencia a su estado basal al salir. La reversibilidad del morph, el congelado al explorar, la selección y las transiciones se comprueban junto con el entorno 3D y la integración; este documento describe su alcance y no sustituye el registro de validación.

## Referencias

1. Niethammer M, Kim E, Sheng M. (1996). *Interaction between the C terminus of NMDA receptor subunits and multiple members of the PSD-95 family of membrane-associated guanylate kinases*. The Journal of Neuroscience, 16, 2157–2163. [DOI](https://doi.org/10.1523/JNEUROSCI.16-07-02157.1996).
2. Hayashi-Takagi A et al. (2010). *Disrupted-in-Schizophrenia 1 (DISC1) regulates spines of the glutamate synapse via Rac1*. Nature Neuroscience, 13, 327–332. [DOI](https://doi.org/10.1038/nn.2487).
3. Xie Z et al. (2007). *Kalirin-7 Controls Activity-Dependent Structural and Functional Plasticity of Dendritic Spines*. Neuron, 56, 640–656. [DOI](https://doi.org/10.1016/j.neuron.2007.10.005).
4. Matsuzaki M, Honkura N, Ellis-Davies GCR, Kasai H. (2004). *Structural basis of long-term potentiation in single dendritic spines*. Nature, 429, 761–766. [DOI](https://doi.org/10.1038/nature02617).
