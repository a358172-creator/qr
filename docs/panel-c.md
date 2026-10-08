# Panel C · microglía y remodelado de conexiones

El módulo conserva las relaciones atribuidas al **panel C** en la documentación heredada. La Figura 1 original no está accesible en esta fase: `reference/mechanisms-reference.png` no existe; `assets/reference-synapse.png` y `assets/poster-reference.png` están vacíos. `assets/image.png` es un mockup de interfaz. Se contrastan las relaciones documentadas con fuentes primarias, sin atribuir procedencia a la imagen ausente ni afirmar una comparación directa con sus paneles.

El alcance documentado reúne una espina alterada, glutamato, Ca²⁺, ROS, C1q, C3, caspasa-3 y microglía. Una conexión cambia de estado, presenta componentes asociados con reconocimiento y remodelado, recibe el contacto de un proceso microglial y reduce su volumen. Otra espina permanece conservada como referencia morfológica. La cabeza remodelada mantiene un remanente reconocible conectado con el cuello; no se representa fagocitosis completa. Los otros módulos conservan sus propias escenas y narrativas.

## Correspondencia con las seis etapas

| Etapa | Contenido del panel y representación | Límite de interpretación |
| --- | --- | --- |
| 1. Sinapsis dendrítica | Dos espinas con cabeza y cuello conservados, terminales próximas y microglía ramificada a distancia. Movimientos basales pequeños de los procesos. | El inicio no presenta daño. La vigilancia microglial no equivale a inflamación o eliminación. |
| 2. Alteración sináptica | Glutamato, entrada de Ca²⁺ a través de NMDAR y aumento de una señal local de ROS en una conexión. | Se aporta el contexto de C; no se repiten la narrativa sináptica ni las rutas mitocondriales de otros módulos. |
| 3. Señales asociadas con daño | C1q y C3 sobre el exterior de la membrana; caspasa-3 dentro de la cabeza. | Su coexistencia no establece una cadena caspasa-3 → complemento; estos componentes no son exclusivos de sinapsis dañadas. |
| 4. Reconocimiento microglial | Un proceso se extiende mediante un arco tridimensional; el soma permanece fijo en una posición inicial próxima. | No modela un gradiente químico ni añade receptores de reconocimiento. |
| 5. Contacto y remodelado | La membrana del proceso alcanza un punto de la superficie real de la cabeza y sigue su retracción. | Representa una posibilidad localizada, sin ingestión, digestión ni fagocitosis completa. |
| 6. Conectividad resultante | Remanente de la espina, microglía en contacto y vecina conservada. | El contacto o el complemento no obligan a eliminar la conexión. No se estima edad de riesgo, frecuencia ni consecuencia clínica. |

## Evidencia primaria y matices

- **Vigilancia y procesos móviles.** [Nimmerjahn, Kirchhoff y Helmchen (2005)](https://pubmed.ncbi.nlm.nih.gov/15831717/) observaron mediante imágenes in vivo que los procesos microgliales exploran activamente el entorno. La animación ralentiza y reduce esos movimientos por claridad; no pretende reproducir sus velocidades.
- **Complemento y refinamiento de conexiones.** [Stevens et al. (2007)](https://pubmed.ncbi.nlm.nih.gov/18083105/) relacionaron C1q y C3 con la eliminación y el refinamiento de sinapsis en el sistema visual posnatal de ratón. Es evidencia de una participación contextual, no de una señal universal de lesión ni de un destino inevitable para cada sinapsis marcada.
- **Microglía y remodelado sináptico.** [Schafer et al. (2012)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3528177/) estudiaron la incorporación microglial de elementos presinápticos y su relación con actividad y complemento en un circuito visual en desarrollo. El contacto con una espina completa de esta ilustración sigue el alcance conceptual documentado para C; no se presenta como reproducción literal de ese experimento ni como cotejo con la figura original ausente. Los receptores y rutas adicionales analizados en el estudio no se añaden al módulo.
- **Caspasa-3 local.** [Ertürk, Wang y Sheng (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827581/) mostraron cambios locales de espinas y dendritas dependientes de caspasa-3 sin muerte de toda la neurona en condiciones experimentales. Esto sustenta distinguir señal local de apoptosis global; no demuestra que caspasa-3 sea una señal extracelular que reclute microglía. Aquí CASP3 permanece como componente conceptual del estado alterado mostrado en C.

## Convenciones de la ilustración

- La microglía conserva una membrana fusionada entre soma irregular y procesos de diámetro decreciente. Las ramas primarias, secundarias y finas son una interpretación morfológica, no una reconstrucción experimental. La asimetría somática y el relieve suave no representan ultraestructura molecular.
- El proceso principal se curva en tres dimensiones; el soma y las raíces proximales permanecen fijos. La aproximación se inicia más cerca de la conexión y las ramas terminales evitan la silueta de una pinza rígida.
- El punto de contacto está ligado a un vértice de la membrana real de la espina y se actualiza con su deformación. C1q/C3 se proyectan por la normal externa con margen para todo su volumen; los anclajes de etiquetas siguen esas posiciones. CASP3 permanece dentro de la cabeza.
- Las espinas se distinguen por forma, señales, etiquetas y contacto microglial, además del color. «Conservada» describe su estado visual en el recorrido, no un ensayo funcional.
- Las dos inserciones comparten curvas de unión con aberturas reales del eje: no hay una superficie dendrítica cerrada atravesando el lumen de los cuellos. Las bases quedan fijas durante el remodelado de la cabeza.
- C1q y C3 son complejos estilizados. El marcador C3 resume su participación y no distingue fragmentos de activación. No se dibujan receptores, una cascada completa del complemento ni otras rutas inmunitarias.
- ROS es una señal colectiva del entorno de la sinapsis; no se atribuye una única fuente ni se añaden especies del módulo D.
- La reducción moderada de la espina conserva cabeza, cuello y unión dendrítica. El contacto microglial no implica necesariamente eliminación; los procesos mostrados pueden coexistir y no forman una secuencia obligatoria. No se afirma fagocitosis completa con una referencia original que no puede revisarse.
- Los ocho valores `ca`, `ros`, `damage`, `signals`, `approach`, `contact`, `pruning` y `activation` son parámetros sin unidades de la ilustración. Los 60 segundos del recorrido no representan una escala temporal biológica.

## Contrato del módulo

`src/mechanisms/microglia.js` aporta metadatos, contenido seleccionable, seis etapas, siete poses de cámara y una fábrica diferida para `src/scene/microglia-environment.js`. Reutiliza renderer, cámara, controles, selección, anotaciones y timeline del atlas. `resetOnExit: true` solicita volver al estado funcional inicial al salir, como requiere esta experiencia.

Las pruebas de C comprueban membrana conectada y finita, presupuesto de geometría, soma inmóvil, curvatura volumétrica, contacto sobre la membrana real durante la retracción, complemento extracelular, CASP3 intracelular, conservación exacta de la espina vecina y reversibilidad al cambiar de etapa. Un raycast desde ambos cuellos alcanza el suelo del eje sin interceptar un techo interno; las inserciones conservan sus coordenadas durante la retracción. Las capturas y la validación de consola se registran aparte; pasar estas pruebas no equivale por sí solo a validar el resultado visual.

## Referencias

1. Nimmerjahn A, Kirchhoff F, Helmchen F. (2005). *Resting microglial cells are highly dynamic surveillants of brain parenchyma in vivo*. Science, 308, 1314–1318. [DOI](https://doi.org/10.1126/science.1110647).
2. Stevens B et al. (2007). *The classical complement cascade mediates CNS synapse elimination*. Cell, 131, 1164–1178. [DOI](https://doi.org/10.1016/j.cell.2007.10.036).
3. Schafer DP et al. (2012). *Microglia sculpt postnatal neural circuits in an activity and complement-dependent manner*. Neuron, 74, 691–705. [DOI](https://doi.org/10.1016/j.neuron.2012.03.026).
4. Ertürk A, Wang Y, Sheng M. (2014). *Local pruning of dendrites and spines by caspase-3-dependent and proteasome-limited mechanisms*. The Journal of Neuroscience, 34, 1672–1688. [DOI](https://doi.org/10.1523/JNEUROSCI.3121-13.2014).
