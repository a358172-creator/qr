# Panel C · microglía y remodelado de conexiones

El módulo utiliza **exclusivamente el panel C de la figura científica aportada por el usuario**. La ruta mencionada en la solicitud, `reference/mechanisms-reference.png`, no estaba presente al preparar el contenido. La referencia disponible es la imagen de la conversación; su procedencia bibliográfica no se atribuye a una publicación desconocida.

La figura reúne una espina alterada, glutamato, Ca²⁺, ROS, C1q, C3, caspasa-3 y microglía. Su idea central se transforma en una interacción espacial: una conexión cambia de estado, presenta componentes asociados con reconocimiento y remodelado, recibe el contacto de un proceso microglial y reduce su volumen. Otra espina permanece conservada como referencia morfológica. No se desarrollan el panel A ni nuevas versiones de B o D.

## Correspondencia con las seis etapas

| Etapa | Contenido del panel y representación | Límite de interpretación |
| --- | --- | --- |
| 1. Sinapsis dendrítica | Dos espinas con cabeza y cuello conservados, terminales próximas y microglía ramificada a distancia. Movimientos basales pequeños de los procesos. | El inicio no presenta daño. La vigilancia microglial no equivale a inflamación o eliminación. |
| 2. Alteración sináptica | Glutamato, entrada de Ca²⁺ a través de NMDAR y aumento de una señal local de ROS en una conexión. | Se aporta el contexto de C; no se repiten la narrativa sináptica ni las rutas mitocondriales de otros módulos. |
| 3. Señales asociadas con daño | Ligero cambio de cabeza, pocos complejos C1q y C3 diferenciados y señal local de caspasa-3. | La coexistencia ilustrada no establece una cadena directa caspasa-3 → complemento ni afirma que el complemento sea exclusivo de sinapsis dañadas. |
| 4. Reconocimiento microglial | Un proceso se extiende hacia la región alterada; el soma no migra continuamente. La espina vecina queda al margen. | El movimiento representa aproximación selectiva. No modela un gradiente químico ni añade receptores de reconocimiento. |
| 5. Contacto y remodelado | El proceso alcanza la región sináptica; la cabeza se reduce y retrae gradualmente. | Es una representación conceptual de eliminación/remodelado, sin simular digestión, fragmentación violenta ni fagocitosis a escala molecular. |
| 6. Conectividad resultante | Vista de la dendrita, la región remodelada, microglía próxima y espina vecina conservada. | La advertencia sobre eliminación excesiva durante el desarrollo procede de la descripción de la figura. No estima una edad de riesgo, una frecuencia ni una consecuencia clínica individual. |

## Evidencia primaria y matices

- **Vigilancia y procesos móviles.** [Nimmerjahn, Kirchhoff y Helmchen (2005)](https://pubmed.ncbi.nlm.nih.gov/15831717/) observaron mediante imágenes in vivo que los procesos microgliales exploran activamente el entorno. La animación ralentiza y reduce esos movimientos por claridad; no pretende reproducir sus velocidades.
- **Complemento y refinamiento de conexiones.** [Stevens et al. (2007)](https://pubmed.ncbi.nlm.nih.gov/18083105/) relacionaron C1q y C3 con la eliminación y el refinamiento de sinapsis en el sistema visual posnatal de ratón. Es evidencia de una participación contextual, no de una señal universal de lesión ni de un destino inevitable para cada sinapsis marcada.
- **Microglía y remodelado sináptico.** [Schafer et al. (2012)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3528177/) estudiaron la incorporación microglial de elementos presinápticos y su relación con actividad y complemento en un circuito visual en desarrollo. El contacto con una espina completa de esta ilustración sigue el panel C; no se presenta como reproducción literal de ese experimento. Los receptores y rutas adicionales analizados en el estudio no se añaden al módulo.
- **Caspasa-3 local.** [Ertürk, Wang y Sheng (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827581/) mostraron cambios locales de espinas y dendritas dependientes de caspasa-3 sin muerte de toda la neurona en condiciones experimentales. Esto sustenta distinguir señal local de apoptosis global; no demuestra que caspasa-3 sea una señal extracelular que reclute microglía. Aquí CASP3 permanece como componente conceptual del estado alterado mostrado en C.

## Convenciones de la ilustración

- La microglía conserva una silueta tridimensional ramificada. Las longitudes, bifurcaciones y separaciones son una interpretación morfológica, no una reconstrucción de una célula observada.
- Las espinas se distinguen por forma, señales, etiquetas y contacto microglial, además del color. «Conservada» describe su estado visual en el recorrido, no un ensayo funcional.
- C1q y C3 son complejos estilizados. El marcador C3 resume su participación y no distingue fragmentos de activación. No se dibujan receptores, una cascada completa del complemento ni otras rutas inmunitarias.
- ROS es una señal colectiva del entorno de la sinapsis; no se atribuye una única fuente ni se añaden especies del módulo D.
- La reducción de la espina representa remodelado local. El contacto microglial no implica necesariamente eliminación; los procesos mostrados pueden coexistir y no forman una secuencia obligatoria.
- Los ocho valores `ca`, `ros`, `damage`, `signals`, `approach`, `contact`, `pruning` y `activation` son parámetros sin unidades de la ilustración. Los 60 segundos del recorrido no representan una escala temporal biológica.

## Contrato del módulo

`src/mechanisms/microglia.js` aporta metadatos, contenido seleccionable, seis etapas, siete poses de cámara y una fábrica diferida para `src/scene/microglia-environment.js`. Reutiliza renderer, cámara, controles, selección, anotaciones y timeline del atlas. `resetOnExit: true` solicita volver al estado funcional inicial al salir, como requiere esta experiencia.

## Referencias

1. Nimmerjahn A, Kirchhoff F, Helmchen F. (2005). *Resting microglial cells are highly dynamic surveillants of brain parenchyma in vivo*. Science, 308, 1314–1318. [DOI](https://doi.org/10.1126/science.1110647).
2. Stevens B et al. (2007). *The classical complement cascade mediates CNS synapse elimination*. Cell, 131, 1164–1178. [DOI](https://doi.org/10.1016/j.cell.2007.10.036).
3. Schafer DP et al. (2012). *Microglia sculpt postnatal neural circuits in an activity and complement-dependent manner*. Neuron, 74, 691–705. [DOI](https://doi.org/10.1016/j.neuron.2012.03.026).
4. Ertürk A, Wang Y, Sheng M. (2014). *Local pruning of dendrites and spines by caspase-3-dependent and proteasome-limited mechanisms*. The Journal of Neuroscience, 34, 1672–1688. [DOI](https://doi.org/10.1523/JNEUROSCI.3121-13.2014).
