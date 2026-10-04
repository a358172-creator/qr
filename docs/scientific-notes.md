# Alcance científico del atlas

El atlas contiene cuatro recorridos: **excitotoxicidad glutamatérgica**, **disfunción mitocondrial, especies reactivas y daño de membranas**, **remodelado microglial** y **plasticidad sináptica**. La dendrita permite acceder a los cuatro como regiones de una misma ilustración. El módulo independiente de apoptosis permanece sin implementar.

## Convenciones compartidas

La escena reúne estructuras a escalas distintas en una ilustración conceptual. El tamaño de receptores e iones, su número, los tiempos y las intensidades no representan medidas. La mitocondria se muestra próxima a la espina para facilitar la explicación; esa localización no es universal. La recaptación, los astrocitos, el coagonista de NMDA y el bloqueo por Mg²⁺ se explican sin reconstruir todos sus componentes.

La narrativa distingue transmisión excitadora y activación excesiva o sostenida. La entrada de Ca²⁺ no equivale automáticamente a daño. Los efectos dependen de la carga, la duración y el contexto celular. La relación entre mitocondria y ROS no implica una única fuente de ROS ni una secuencia obligatoria. Los cortes de membrana y mitocondria permiten ver el interior; no indican una rotura provocada por la secuencia.

## Módulo glutamatérgico

El primer recorrido conserva su secuencia: glutamato, AMPA, condiciones de apertura de NMDA, sobrecarga de Ca²⁺, respuesta mitocondrial y equilibrio redox. Termina en ROS y no desarrolla apoptosis ni vías de caspasas.

Referencias primarias verificadas para la narrativa:

- [Nowak et al., Nature (1984)](https://pubmed.ncbi.nlm.nih.gov/6320006/): el bloqueo por Mg²⁺ contribuye a la dependencia de voltaje de la conductancia NMDA.
- [Johnson y Ascher, Nature (1987)](https://www.nature.com/articles/325529a0): la glicina potencia la respuesta NMDA; sustenta incluir un coagonista en la explicación.
- [Stout et al., Nature Neuroscience (1998)](https://www.nature.com/articles/nn0998_366): en neuronas de prosencéfalo de rata cultivadas, modificar la captación mitocondrial de Ca²⁺ cambia la susceptibilidad a excitotoxicidad. Los resultados no se extrapolan aquí a todos los tipos neuronales.
- [Duan et al., The Journal of Physiology (2007)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2375529/): en neuronas estriatales cultivadas, la captación mitocondrial de Ca²⁺ contribuyó a la producción temprana de ROS inducida por NMDA. La ilustración selecciona este vínculo sin representar la vía PARP-1 estudiada en el artículo.

## Módulo mitocondrial · panel D

El segundo recorrido se basa exclusivamente en el panel D de la imagen científica aportada por el usuario. No se ha atribuido una procedencia bibliográfica a esa imagen porque no se proporcionó. Este módulo no incorpora relaciones de los otros paneles; C y A tienen recorridos propios, descritos más abajo. La correspondencia entre cada relación de D, su representación y las fuentes de apoyo se detalla en [panel-d.md](panel-d.md).

La entrada por NMDAR conduce a ramas de señalización representadas espacialmente: nNOS–NO y sGC–cGMP–PKG; PKC–NOX2–O₂•⁻; cPLA₂–AA–eicosanoides; peroxidación local de lípidos; disfunción mitocondrial y ROS; PTP y traslado conceptual de AIF hacia un contexto nuclear. Las seis etapas ordenan la lectura, sin establecer una sucesión biológica obligatoria.

NO y ONOO⁻ pertenecen a la química reactiva del nitrógeno; O₂•⁻ es una especie reactiva de oxígeno. La formación de peroxinitrito se explica como la reacción entre **NO y O₂•⁻**, no como una transformación de NO aislado. Las partículas marcadas «ROS» junto a la mitocondria son un indicador colectivo. NOX2 aporta otra fuente representada, sin asignar porcentajes relativos a ambas. [Brennan et al. (2009)](https://www.nature.com/articles/nn.2334) y [Girouard et al. (2009)](https://pubmed.ncbi.nlm.nih.gov/19244529/) fundamentan esas conexiones neuronales; [Radi et al. (1991)](https://pubmed.ncbi.nlm.nih.gov/1654835/) estudian la química del peroxinitrito y su capacidad de inducir peroxidación lipídica.

La hidrólisis de fosfolípidos por cPLA₂ y la peroxidación lipídica se distinguen: no son el mismo proceso. La primera puede liberar AA, precursor de eicosanoides; la segunda corresponde a oxidación de lípidos. Sus consecuencias dependen del contexto, como ilustra el estudio de [Taylor et al. (2008)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2582587/).

PTP es un marcador funcional de transición de permeabilidad de la membrana mitocondrial interna, sin una composición molecular afirmada. La relación PTP–AIF de D se interpreta como asociación conceptual con alteraciones de permeabilidad y liberación mitocondrial. **AIF no se dibuja atravesando el PTP**. Su desplazamiento puede relacionarse con alteraciones nucleares, pero no implica una apoptosis inevitable. [Wang et al. (2004)](https://pubmed.ncbi.nlm.nih.gov/15574746/) estudian el traslado de AIF en daño excitotóxico; [Nakagawa et al. (2005)](https://pubmed.ncbi.nlm.nih.gov/15800626/) muestran que transición de permeabilidad y apoptosis no equivalen en todos los contextos.

El pequeño contexto de ADN representa un destino nuclear a distancia comprimida, no un núcleo situado dentro de la dendrita. La última etapa integra señales asociadas con daño celular y menciona apoptosis únicamente como posible consecuencia conceptual. Este recorrido no implementa otras rutas de muerte celular, una cascada de caspasas ni mecanismos de los paneles restantes.

## Módulo microglial · panel C

El tercer recorrido representa exclusivamente las relaciones del panel C. Dos espinas parten de una morfología conservada; una presenta cambios locales de Ca²⁺ y ROS, señales de complemento y caspasa-3, aproximación microglial, contacto y reducción gradual. La vecina permanece conservada como referencia. El soma microglial no migra durante la secuencia: son sus procesos distales los que exploran y se extienden. Esta disposición y su movimiento son una interpretación morfológica, no una reconstrucción experimental ni una simulación de quimiotaxis.

La vigilancia mediante procesos móviles se apoya en [Nimmerjahn et al. (2005)](https://pubmed.ncbi.nlm.nih.gov/15831717/). Los trabajos de [Stevens et al. (2007)](https://pubmed.ncbi.nlm.nih.gov/18083105/) y [Schafer et al. (2012)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3528177/) relacionan complemento y microglía con el refinamiento de conexiones en circuitos visuales de ratón en desarrollo. No establecen que toda sinapsis con C1q o C3 esté dañada o vaya a desaparecer. La escena sigue el contacto con una espina indicado en C; no reproduce literalmente la incorporación de elementos presinápticos estudiada por Schafer y colaboradores.

C1q y C3 se representan con formas estilizadas distintas y pocos elementos. C3 resume su participación sin distinguir fragmentos de activación. No se añaden receptores, una cascada completa del complemento ni otras rutas inmunitarias. ROS aporta contexto local sin atribuir una fuente molecular única ni repetir las vías del módulo D.

CASP3 permanece dentro de la región alterada. [Ertürk et al. (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827581/) describen cambios locales de espinas y dendritas dependientes de caspasa-3 sin muerte de toda la neurona en condiciones experimentales. La escena distingue esa participación local de apoptosis global y no presenta caspasa-3 como señal extracelular de reclutamiento microglial. Su coexistencia con complemento no afirma una cadena directa entre ambos.

El contacto microglial no implica siempre eliminación. Las seis etapas ordenan la lectura de una posibilidad de remodelado; sus procesos pueden coexistir y no constituyen una secuencia obligatoria. La advertencia final sobre eliminación excesiva durante el desarrollo procede del texto de la figura, sin extrapolar edades, frecuencias ni riesgo clínico individual. Los 60 segundos, las proporciones y la intensidad de las señales son recursos didácticos. La correspondencia detallada y las fuentes se encuentran en [panel-c.md](panel-c.md).

## Módulo de plasticidad sináptica · panel A

El cuarto recorrido representa las relaciones del panel A en una conexión fisiológica. Una espina con cabeza amplia y cuello estrecho mantiene su continuidad con la dendrita. NMDAR permite una entrada moderada de Ca²⁺; PSD-95, DISC1 y Kalirin-7 aportan contexto para la organización postsináptica y el remodelado de una red tridimensional de actina. No se incorporan ROS, microglía, lesión de membrana, disfunción mitocondrial ni apoptosis a esta escena.

[Niethammer et al. (1996)](https://pubmed.ncbi.nlm.nih.gov/8601796/) identificaron interacciones entre subunidades de NMDAR y miembros de la familia PSD-95. El modelo sitúa PSD-95 junto al receptor y bajo la membrana para facilitar su lectura, sin reconstruir dominios de unión ni estequiometría. La densidad postsináptica representa una región rica en proteínas, distinta de la proteína PSD-95 seleccionable dentro de ella.

[Hayashi-Takagi et al. (2010)](https://www.nature.com/articles/nn.2487) estudiaron la regulación de la morfología y función de espinas mediante DISC1 y su relación con Kalirin-7. [Xie et al. (2007)](https://pubmed.ncbi.nlm.nih.gov/18031682/) relacionaron Kalirin-7 con plasticidad estructural y funcional dependiente de actividad. Sus resultados apoyan la inclusión de esos componentes; los intermediarios adicionales estudiados en esas publicaciones quedan fuera del alcance del panel A. Los cambios sucesivos de foco no afirman una cadena obligatoria NMDAR–PSD-95–DISC1–Kalirin-7–actina ni indican que las proteínas aparezcan o se activen de forma idéntica.

[Matsuzaki et al. (2004)](https://pmc.ncbi.nlm.nih.gov/articles/4158816/) observaron cambios de tamaño de espinas tras estimulación local por glutamato, con dependencia de NMDAR y polimerización de actina en su preparación experimental. En el atlas, la red se reorienta y añade ramificación localizada mientras la cabeza cambia ligeramente de forma. Estas deformaciones no cuantifican fuerza sináptica, aprendizaje ni potenciación duradera, y no representan una respuesta universal.

Las formas de los complejos, la distribución de filamentos y las trayectorias del calcio son convenciones de una ilustración biomédica, sin resolución molecular ni concentraciones calibradas. La dispersión intracelular del Ca²⁺ no modela transporte dirigido hacia una proteína específica. La transparencia de la membrana y el énfasis al seleccionar actina facilitan observar el interior; no describen pérdida de integridad celular. Las seis etapas duran 60 segundos de presentación y pueden recorrerse en ambos sentidos. La correspondencia detallada y los límites se documentan en [panel-a.md](panel-a.md).
