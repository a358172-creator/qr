# Leyendas de la escena

## Presentación

**De la neurona a la sinapsis**

La dendrita conecta las escalas del atlas. Una de sus espinas conduce al primer módulo disponible: excitotoxicidad glutamatérgica. Neurona, dendrita y sinapsis pertenecen al mismo entorno tridimensional.

El segundo punto disponible abre **Disfunción mitocondrial**, el tercero **Remodelado microglial** y el cuarto **Plasticidad sináptica**, conservando el alcance de los paneles D, C y A descrito en la documentación heredada. La Figura 1 original no está accesible en esta fase. B incluye una alternativa intrínseca contextual; no se añade un módulo independiente de apoptosis.

## Primer mecanismo · sinapsis glutamatérgica

1. **Una señal entre neuronas.** Las vesículas liberan glutamato. La señal cruza la hendidura y alcanza la membrana de la espina.
2. **AMPA · despolarización.** AMPA permite el flujo de cationes, incluido Na⁺. La despolarización favorece el alivio del bloqueo por Mg²⁺ de NMDA.
3. **NMDA · una apertura condicionada.** NMDA requiere glutamato, un coagonista y un voltaje que alivie el bloqueo por Mg²⁺. Así permite el paso de Ca²⁺.
4. **Ca²⁺ · cuando se pierde el equilibrio.** El calcio es una señal esencial. Una entrada excesiva o sostenida puede superar la capacidad de regulación de la neurona.
5. **La respuesta mitocondrial.** La mitocondria participa en la regulación del Ca²⁺. Una carga excesiva puede comprometer su función energética.
6. **ROS · un equilibrio vulnerable.** La disfunción mitocondrial y el estrés oxidativo pueden reforzarse. Esta secuencia es conceptual: el daño no es inevitable.
7. **Posibilidad local · caspasa-3 y remodelado.** Una señal intracelular local coincide con cambios del citoesqueleto y reducción de la cabeza. No demuestra apoptosis de toda la neurona ni exige representar liberación de citocromo c.
8. **Alternativa intrínseca · señalización apoptótica.** En otro contexto, el citocromo c puede salir del espacio intermembranal al citosol y favorecer Apaf-1/caspasa-9 y caspasas ejecutoras. No es la continuación obligatoria de la etapa anterior. El retorno gradual de la cabeza a una referencia basal distingue esta alternativa; no significa recuperación biológica de una lesión.

Pausar o elegir **Explorar** conserva el instante de la secuencia y permite estudiar el volumen. **Continuar** reanuda el recorrido; **Volver a la dendrita** recupera su contexto espacial.

## Convenciones visuales

- Ámbar: glutamato.
- Turquesa: AMPA y representación del flujo de Na⁺.
- Índigo: NMDA.
- Coral: Ca²⁺.
- Granate: mitocondria; corte de la doble membrana y sus crestas.
- Magenta: actividad conceptual de ROS.

## Alcance

Representación conceptual con fines educativos. Las escalas, concentraciones y dinámicas se encuentran simplificadas.

La mitocondria ocupa la dendrita proximal conectada con el cuello. No se presupone una mitocondria en cada cabeza. Se omiten visualmente recaptación, astrocitos, Mg²⁺, coagonistas y numerosas vías reguladoras. Las etapas pueden coexistir y retroalimentarse; las dos últimas presentan posibilidades diferentes. La escena no estima susceptibilidad por edad ni riesgo individual, tampoco representa resultados experimentales propios.

Las ocho etapas (73 segundos didácticos) se mantienen en `src/mechanisms/glutamate.js`; las explicaciones de estructuras, en `src/content.js`. La permeabilización externa relacionada con citocromo c se distingue de la transición de permeabilidad interna de D. La correspondencia y sus límites se documentan en [panel B](../docs/panel-b.md).


## Segundo mecanismo · panel D

1. **Entrada de Ca²⁺.** NMDAR conserva visible el origen extracelular de la señal.
2. **Señales que se ramifican.** nNOS produce NO; PKC y NOX2 participan en la formación de superóxido. NO puede activar sGC–cGMP–PKG o reaccionar con superóxido para formar peroxinitrito.
3. **Lípidos bajo estrés.** cPLA₂ libera AA, precursor de eicosanoides. La peroxidación cambia localmente el orden y la pigmentación de los lípidos.
4. **Un equilibrio mitocondrial vulnerable.** El corte revela las membranas y crestas; ROS y el marcador conceptual PTP destacan la alteración funcional.
5. **AIF · una señal hacia el núcleo.** AIF se desplaza hacia un contexto nuclear cuya distancia está comprimida. Puede participar en daño independiente de caspasas; su liberación no se representa como paso a través de PTP.
6. **Señalización asociada con daño celular.** Una vista integrada muestra procesos paralelos e interdependientes. No predice apoptosis ni convierte la participación de AIF en apoptosis clásica.

NO se reconoce por puntos azul grisáceos; O₂•⁻ por pares coral; ONOO⁻ por tríos magenta; ROS mitocondrial por pequeños grupos rosados. Las etiquetas y el selector **Estructuras** complementan el color. PTP no representa una estructura molecular determinada ni un canal de paso para AIF.

Las etapas, cámaras, etiquetas y explicaciones del segundo mecanismo se mantienen en `src/mechanisms/mitochondrial-dysfunction.js`. La correspondencia científica se documenta en [panel D](../docs/panel-d.md).

## Tercer mecanismo · panel C

1. **Sinapsis dendrítica.** Dos espinas conservan su forma y sus contactos. Cerca de ellas, la microglía explora el entorno con movimientos discretos de sus procesos.
2. **Una conexión cambia de estado.** En una de las espinas aumenta la entrada de Ca²⁺ por NMDAR y la señal de ROS. La espina vecina conserva su morfología.
3. **Señales en la sinapsis alterada.** La cabeza cambia ligeramente. C1q, C3 y una señal local de caspasa-3 sitúan los componentes del panel C alrededor de esta conexión.
4. **Un proceso se aproxima.** Un proceso microglial se extiende hacia la conexión alterada. El soma permanece próximo y la espina conservada queda al margen del contacto.
5. **Contacto y remodelado.** El extremo curvo alcanza la superficie real de la cabeza y sigue su retracción localizada. No se visualiza fagocitosis completa.
6. **Remodelado de la conectividad sináptica.** Persiste un remanente de la cabeza conectado con la dendrita, mientras la vecina conserva su estructura. El contacto o el complemento no obligan a eliminar una conexión.

La microglía se reconoce por su silueta ramificada y sus procesos de distintas longitudes y profundidades. C1q adopta una forma de ramillete y C3 una forma compacta; las etiquetas y el selector **Estructuras** permiten distinguirlos sin depender sólo del color. CASP3 es una señal intracelular local, no un marcador de apoptosis global ni una señal que atraiga directamente a la microglía.

**Explorar** conserva el tiempo, las señales y la forma de la espina y los procesos. **Continuar** retoma ese mismo instante. Al **volver a la dendrita**, este módulo se restablece: una nueva entrada comienza con las dos espinas conservadas. Los recorridos glutamatérgico y mitocondrial mantienen sus propios estados pausados; plasticidad también se restablece al salir.

Las etapas, cámaras, etiquetas y explicaciones del tercer mecanismo se mantienen en `src/mechanisms/microglia.js`. La correspondencia científica y los límites de la secuencia se documentan en [panel C](../docs/panel-c.md).

## Cuarto mecanismo · panel A

1. **Arquitectura postsináptica.** Una cabeza amplia y un cuello estrecho continúan hacia la dendrita. Bajo la membrana, la densidad postsináptica y la red tridimensional de actina organizan la espina.
2. **Activación de NMDAR.** El glutamato contextualiza la apertura del receptor. Una entrada moderada de Ca²⁺ atraviesa su canal y se dispersa dentro del microdominio postsináptico.
3. **Organización postsináptica.** PSD-95 destaca junto a la membrana y el receptor; después, el foco incluye DISC1 a mayor profundidad. Ambos complejos están presentes desde el comienzo.
4. **Kalirin-7 y el entorno de actina.** Un complejo próximo a los filamentos sitúa la relación funcional de Kalirin-7 con el remodelado de la espina.
5. **Remodelado de actina.** Los filamentos cambian lentamente de orientación y ramificación. La cabeza ajusta de forma sutil su volumen, conservando la continuidad con el cuello y la dendrita.
6. **Plasticidad estructural de la espina dendrítica.** La organización postsináptica y el citoesqueleto contribuyen a mantener y remodelar la estructura de la conexión.

La membrana utiliza tonos lavanda y rosados; NMDAR, índigo; Ca²⁺, coral; PSD-95, verde azulado discreto; DISC1, azul grisáceo; Kalirin-7, verde menta; y actina, magenta profundo. Las formas, posiciones, etiquetas y explicaciones complementan el color. La densidad postsináptica es un entramado volumétrico; PSD-95 es una de las proteínas representadas en esa región.

El recorrido conserva un entorno fisiológico, sin ROS, lesiones de membrana, microglía ni apoptosis. El orden de presentación distribuye la atención entre componentes coexistentes: no afirma una cadena molecular obligatoria. La entrada de calcio, las ramificaciones y el cambio de forma son ilustrativos, sin concentraciones ni escalas temporales biológicas.

Seleccionar **Actina** destaca los filamentos y atenúa discretamente la membrana, los complejos y la terminal. **Explorar** conserva las posiciones y la geometría biológica mientras permite orbitar, acercarse y seleccionar. La transparencia responde a la distancia de observación para mostrar el interior. **Continuar** retoma el instante conservado; **Volver a la dendrita** restablece este módulo a su arquitectura basal.

Las etapas, cámaras, etiquetas y explicaciones se mantienen en `src/mechanisms/synaptic-plasticity.js`. La correspondencia científica y las fuentes se documentan en [panel A](../docs/panel-a.md).
