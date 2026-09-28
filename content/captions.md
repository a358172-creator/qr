# Leyendas de la escena

## Presentación

**De la neurona a la sinapsis**

La dendrita conecta las escalas del atlas. Una de sus espinas conduce al primer módulo disponible: excitotoxicidad glutamatérgica. Neurona, dendrita y sinapsis pertenecen al mismo entorno tridimensional.

El segundo punto disponible abre **Disfunción mitocondrial**, basado exclusivamente en el panel D de la referencia. Señalización celular, microglía y apoptosis general permanecen como marcadores.

## Primer mecanismo · sinapsis glutamatérgica

1. **Una señal entre neuronas.** Las vesículas liberan glutamato. La señal cruza la hendidura y alcanza la membrana de la espina.
2. **AMPA · despolarización.** AMPA permite el flujo de cationes, incluido Na⁺. La despolarización favorece el alivio del bloqueo por Mg²⁺ de NMDA.
3. **NMDA · una apertura condicionada.** NMDA requiere glutamato, un coagonista y un voltaje que alivie el bloqueo por Mg²⁺. Así permite el paso de Ca²⁺.
4. **Ca²⁺ · cuando se pierde el equilibrio.** El calcio es una señal esencial. Una entrada excesiva o sostenida puede superar la capacidad de regulación de la neurona.
5. **La respuesta mitocondrial.** La mitocondria participa en la regulación del Ca²⁺. Una carga excesiva puede comprometer su función energética.
6. **ROS · un equilibrio vulnerable.** La disfunción mitocondrial y el estrés oxidativo pueden reforzarse. Esta secuencia es conceptual: el daño no es inevitable.

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

La ubicación de la mitocondria en la espina facilita la explicación y no representa todas las sinapsis. Se omiten visualmente la recaptación, los astrocitos, Mg²⁺, coagonistas y numerosas vías reguladoras. Las etapas pueden coexistir y retroalimentarse. La escena no estima susceptibilidad según la edad ni riesgo individual.

Las seis etapas se mantienen en `src/mechanisms/glutamate.js`; las explicaciones de estructuras, en `src/content.js`. Estas leyendas documentan su lectura editorial.


## Segundo mecanismo · panel D

1. **Entrada de Ca²⁺.** NMDAR conserva visible el origen extracelular de la señal.
2. **Señales que se ramifican.** nNOS produce NO; PKC y NOX2 participan en la formación de superóxido. NO puede activar sGC–cGMP–PKG o reaccionar con superóxido para formar peroxinitrito.
3. **Lípidos bajo estrés.** cPLA₂ libera AA, precursor de eicosanoides. La peroxidación cambia localmente el orden y la pigmentación de los lípidos.
4. **Un equilibrio mitocondrial vulnerable.** El corte revela las membranas y crestas; ROS y el marcador conceptual PTP destacan la alteración funcional.
5. **AIF · una señal hacia el núcleo.** AIF se desplaza hacia un contexto nuclear cuya distancia está comprimida para facilitar la lectura.
6. **Señalización asociada con daño celular.** Una vista integrada muestra relaciones posibles; no predice apoptosis ni implementa su módulo independiente.

NO se reconoce por puntos azul grisáceos; O₂•⁻ por pares coral; ONOO⁻ por tríos magenta; ROS mitocondrial por pequeños grupos rosados. Las etiquetas y el selector **Estructuras** complementan el color. PTP no representa una estructura molecular determinada ni un canal de paso para AIF.

Las etapas, cámaras, etiquetas y explicaciones del segundo mecanismo se mantienen en `src/mechanisms/mitochondrial-dysfunction.js`. La correspondencia científica se documenta en [panel D](../docs/panel-d.md).
