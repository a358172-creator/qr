# Panel B · excitotoxicidad y desenlaces diferenciados

B conserva la transmisión glutamatérgica inicial y presenta después dos posibilidades dependientes del contexto: remodelado o degeneración local de la espina y señalización mitocondrial intrínseca que puede contribuir a apoptosis neuronal. **La segunda posibilidad no es la continuación obligatoria de la primera.** Caspasa-3 local no equivale a muerte de toda la neurona.

Los paneles originales de la Figura 1 no están accesibles en esta fase. Los archivos de referencia científica del repositorio están vacíos y `assets/image.png` es un mockup de interfaz. Esta ampliación sigue la documentación existente, las instrucciones de la fase y las fuentes primarias verificables siguientes; no atribuye a la figura ausente estructuras o resultados no comprobables.

## Correspondencia con las ocho etapas

| Etapa | Estructura y fenómeno representados | Límite de interpretación |
| --- | --- | --- |
| 1. Liberación de glutamato | Vesículas, terminal y hendidura: el transmisor llega a la membrana postsináptica. | La liberación inicial es una función fisiológica. Recaptación y astrocitos no se modelan. |
| 2. AMPA y despolarización | AMPA atraviesa la membrana y permite corriente catiónica que favorece la despolarización. | No se calcula voltaje ni se atribuye la misma permeabilidad al Ca²⁺ a todas las variantes AMPA. |
| 3. Apertura condicionada de NMDA | Entrada de Ca²⁺ desde la hendidura a través del canal. | Requiere glutamato, coagonista y alivio del bloqueo por Mg²⁺. Estos dos últimos se explican sin dibujarlos. |
| 4. Sobrecarga sostenida | Mayor entrada y dispersión de Ca²⁺ hacia el interior de la espina y la dendrita proximal. | El calcio es esencial; la lesión depende de intensidad, duración y contexto. |
| 5. Respuesta mitocondrial | Mitocondria en la dendrita proximal continua con el cuello; corte de membranas y crestas. | La distribución dendrítica es ilustrativa. No afirma que cada espina contenga una mitocondria. |
| 6. Desequilibrio redox | Indicador de ROS próximo a la mitocondria. | ROS también participa en fisiología; la mitocondria no es la única fuente y ROS no significa daño por sí mismo. |
| 7. Posibilidad local | Caspasa-3 intracelular, modificación del entramado de actina y reducción moderada de la cabeza. | No representa muerte neuronal completa ni requiere mostrar citocromo c. El cambio no demuestra una interacción molecular directa con cada filamento dibujado. |
| 8. Alternativa intrínseca | Citocromo c del espacio intermembranal al citosol; Apaf-1, caspasa-9 y ejecutoras en la región dendrítica. | El retorno ilustrativo gradual a la referencia basal de la cabeza presenta otra posibilidad. No es recuperación biológica de la etapa 7 ni progresión inevitable hacia apoptosis. |

## Anatomía y convenciones visuales

La espina y su cuello continúan con un segmento dendrítico propio de B. El orgánulo se aloja en ese segmento, con menor predominio frente a la sinapsis. Esta anatomía local evita cambiar la dendrita del hub. Los receptores transmembrana, los puntos de origen del calcio y los anclajes se corresponden con la anatomía corregida.

El corte es un recurso de ilustración, no una rotura causada por el daño. Citocromo c se representa inicialmente en el espacio entre membranas: su liberación contextual exige atravesar la membrana externa, no el poro de transición de permeabilidad interna de D. Las formas de Apaf-1 y caspasas son símbolos proteicos estilizados, sin estructura atómica ni estequiometría resuelta. No se representa toda la regulación de la permeabilización ni del apoptosoma.

La región local y la vía intrínseca se distinguen por lugar, estructuras visibles, estado de la espina y texto. Las caspasas de daño y la liberación de citocromo c no aparecen en la transmisión fisiológica inicial. La última vista ilustra señalización, sin mostrar una neurona completa que muere. La excitotoxicidad también puede reclutar rutas independientes de caspasas; D ofrece el contexto de AIF sin convertir ambas escenas en una vía universal.

## Evidencia primaria y alcance

- **NMDA condicionado.** [Nowak et al. (1984)](https://pubmed.ncbi.nlm.nih.gov/6320006/) y [Johnson y Ascher (1987)](https://www.nature.com/articles/325529a0) fundamentan bloqueo por Mg²⁺ y participación de glicina. La escena no reproduce todas las condiciones de activación.
- **Distribución mitocondrial.** [Li et al. (2004)](https://pubmed.ncbi.nlm.nih.gov/15607982/) relacionaron mitocondrias dendríticas con mantenimiento y plasticidad de espinas. Apoya el contexto dendrítico, no una ubicación universal por espina.
- **Caspasa-3 sin muerte global.** [Li et al. (2010)](https://pubmed.ncbi.nlm.nih.gov/20510932/) identificaron caspasa-3 dendrítica transitoria durante LTD y retirada de AMPA sin muerte celular. [Ertürk et al. (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827581/) estudiaron remodelado local limitado por mecanismos celulares. No prueba que todo remodelado o toda lesión use esta vía.
- **Vía intrínseca.** [Li et al. (1997)](https://pubmed.ncbi.nlm.nih.gov/9390557/) establecieron la relación bioquímica citocromo c/Apaf-1/caspasa-9 y activación de caspasa-3. No se extrapola su preparación bioquímica como demostración de apoptosis en toda neurona excitotóxica.
- **Permeabilidad y muerte son distintas.** [Nakagawa et al. (2005)](https://pubmed.ncbi.nlm.nih.gov/15800626/) distinguieron transición de permeabilidad dependiente de ciclofilina D y respuesta a estímulos apoptóticos. El poro interno no se dibuja como conducto de salida de proteínas intermembranales.
- **Contexto independiente de caspasas.** [Wang et al. (2004)](https://pubmed.ncbi.nlm.nih.gov/15574746/) vincularon AIF con daño excitotóxico por NMDA que no fue evitado por inhibición de caspasas en su preparación. La vía intrínseca de B no agota los desenlaces posibles.

## Contrato y validación

`src/mechanisms/glutamate.js` define ocho etapas de 7, 8, 8, 8, 8, 9, 11 y 14 segundos (73 segundos de presentación). Las últimas claves son `local-remodeling` e `intrinsic-possibility`. `src/scene/glutamate-environment.js` organiza la escena; `src/content.js` mantiene las explicaciones seleccionables. La retracción aproximada del 22 % es un parámetro gráfico, no un valor experimental.

La timeline conserva pausa, exploración y selección. Volver a etapas anteriores debe restituir anatomía y ocultar componentes no pertinentes. Las pruebas de estados y geometría, la compilación y la inspección WebGL se registran aparte: este documento delimita el modelo, no certifica por sí mismo la validación visual.

## Referencias añadidas en esta fase

1. Li P et al. (1997). *Cytochrome c and dATP-dependent formation of Apaf-1/caspase-9 complex initiates an apoptotic protease cascade*. Cell, 91, 479–489. [DOI](https://doi.org/10.1016/S0092-8674(00)80434-1).
2. Li Z et al. (2010). *Caspase-3 activation via mitochondria is required for long-term depression and AMPA receptor internalization*. Cell, 141, 859–871. [DOI](https://doi.org/10.1016/j.cell.2010.03.053).

Todas las escalas, tiempos, cantidades y trayectorias son didácticos. No se añaden resultados propios ni comparaciones por edad.
