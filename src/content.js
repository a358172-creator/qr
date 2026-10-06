// These explanations also remain accessible when WebGL is unavailable.
export const structures = {
  glutamate: {
    category: 'NEUROTRANSMISOR', title: 'Glutamato',
    text: 'Las vesículas presinápticas liberan glutamato hacia la hendidura, donde alcanza los receptores de la espina. Esta señal sostiene la comunicación excitadora; una activación excesiva o prolongada puede favorecer excitotoxicidad.',
    detail: 'La hendidura separa las membranas de ambas neuronas: el neurotransmisor comunica estos dos compartimentos sin fusionarlos. La respuesta depende de los receptores que activa y de cuánto se prolonga la señal. En este recorrido, el foco pasa de la liberación al control del calcio para mostrar cómo una función necesaria puede convertirse en una carga para la célula.',
    observe: 'Sigue las partículas desde la terminal hasta los receptores situados frente a ella, al otro lado de la hendidura.',
    note: 'La recaptación y la participación de los astrocitos no se representan.',
  },
  ampa: {
    category: 'RECEPTOR IONOTRÓPICO', title: 'Receptor AMPA',
    text: 'AMPA participa en la transmisión excitadora rápida mediante el flujo de cationes, principalmente Na⁺ y K⁺. La despolarización resultante puede favorecer el alivio del bloqueo por Mg²⁺ de NMDA.',
    detail: 'Despolarizar significa cambiar el voltaje de la membrana hacia valores menos negativos. AMPA ayuda a crear ese contexto eléctrico, mientras NMDA mantiene sus propias condiciones de apertura, incluida la presencia de un coagonista. La permeabilidad de AMPA al calcio depende de su composición; la escena centra la entrada de Ca²⁺ en NMDA para seguir el recorrido elegido.',
    observe: 'Distingue los complejos verde azulado de AMPA y los receptores NMDA violáceos, ambos integrados en la membrana postsináptica.',
    note: 'Las subunidades se estilizan; no es una reconstrucción molecular.',
  },
  nmda: {
    category: 'RECEPTOR IONOTRÓPICO', title: 'Receptor NMDA',
    text: 'Su apertura requiere glutamato, un coagonista y condiciones de voltaje que alivien el bloqueo por Mg²⁺. Permite el paso de Ca²⁺ y otros cationes, conectando la actividad sináptica con respuestas intracelulares.',
    detail: 'NMDA combina condiciones químicas y eléctricas: la presencia de glutamato por sí sola no describe toda su activación. En un contexto regulado, el calcio que atraviesa el canal participa en plasticidad sináptica. Si la actividad es excesiva o sostenida, esa misma entrada puede contribuir a la sobrecarga; su efecto también depende de la localización del receptor y del estado celular.',
    observe: 'Localiza el poro central y observa cómo las partículas de calcio cruzan la membrana a través del canal.',
    note: 'Mg²⁺ y coagonistas se explican, pero no se dibujan en la escena.',
  },
  calcium: {
    category: 'SEÑAL INTRACELULAR', title: 'Entrada de Ca²⁺',
    text: 'El calcio que entra por NMDA participa en señales necesarias para la función sináptica. Una entrada excesiva o sostenida puede superar la capacidad de regulación y alterar procesos celulares.',
    detail: 'La diferencia entre señal y sobrecarga depende de la cantidad, la duración y el contexto, no de la mera presencia de calcio. La mitocondria participa en su manejo, pero también puede verse afectada cuando la carga es excesiva. Por eso el recorrido conecta la entrada por el receptor con cambios energéticos y redox, sin establecer un umbral universal de lesión.',
    observe: 'Compara la entrada inicial moderada con las etapas posteriores y sigue su dispersión dentro de la cabeza de la espina.',
    note: 'El tamaño, el número y la velocidad de los iones son ilustrativos.',
  },
  mitochondria: {
    category: 'ORGÁNULO · VISTA EN CORTE', title: 'Mitocondria',
    text: 'Los pliegues de la membrana interna, llamados crestas, alojan parte de la maquinaria que produce ATP. La mitocondria también participa en el manejo del calcio y en el equilibrio redox.',
    detail: 'La producción de energía y la regulación del calcio están relacionadas dentro del orgánulo. Una sobrecarga puede comprometer la función mitocondrial y acompañarse de cambios en la producción de especies reactivas. El corte permite relacionar esas funciones con una arquitectura de membranas y crestas, mientras la secuencia muestra una vulnerabilidad progresiva que depende del contexto celular.',
    observe: 'Reconoce el contorno externo y los pliegues internos; después compara su aspecto antes y durante la sobrecarga.',
    note: 'Se sitúa en la espina por claridad didáctica; no es una localización universal.',
  },
  ros: {
    category: 'EQUILIBRIO REDOX', title: 'Estrés oxidativo',
    text: 'Las especies reactivas de oxígeno participan en procesos fisiológicos. Cuando su producción supera las defensas antioxidantes, pueden contribuir al daño de lípidos, proteínas y ácidos nucleicos.',
    detail: 'El término ROS reúne varias especies con propiedades diferentes. En esta escena, la señal próxima a la mitocondria destaca una relación posible entre alteración energética y estrés oxidativo. Ambos procesos pueden reforzarse, aunque la mitocondria no es la única fuente celular de oxidantes; el recorrido del panel D permite explorar otras relaciones sin convertirlas en una secuencia obligatoria.',
    observe: 'Observa la señal magenta próxima a la mitocondria y compárala con la discreta actividad de las primeras etapas.',
    note: 'Los puntos magenta indican actividad conceptual, no moléculas a escala.',
  },
  caspases: { category: 'VÍAS DE DAÑO', title: 'Señalización de daño', text: 'Las caspasas son proteasas que participan en algunas rutas de muerte celular. Aquí se representan como complejos conceptuales para explorar la señalización asociada al daño. La excitotoxicidad puede involucrar varias vías, incluidas vías independientes de caspasas; la muerte neuronal no es un desenlace inevitable.', note: 'No se representa una secuencia única, exclusiva ni predictiva.' },
};
export const steps = [
  { key: 'glutamate', caption: '01 — Las vesículas liberan glutamato hacia la hendidura sináptica. La señal alcanza los receptores de la espina.' },
  { key: 'nmda', caption: '02 — AMPA contribuye a la despolarización; NMDA integra la unión de agonistas y las condiciones de voltaje.' },
  { key: 'calcium', caption: '03 — El Ca²⁺ entra por NMDA. Una entrada sostenida puede superar la capacidad de regulación intracelular.' },
  { key: 'ros', caption: '04 — La sobrecarga puede alterar la función mitocondrial y el equilibrio redox; estos procesos se retroalimentan.' },
  { key: 'caspases', caption: '05 — Pueden activarse vías de daño, algunas asociadas a caspasas. La progresión no es única ni inevitable.' },
];
export const modeCaptions = {
  physiological: 'Una señal esencial para comunicar neuronas. Explora qué ocurre cuando se pierde su regulación.',
  overload: 'Una activación excesiva o sostenida puede asociarse con sobrecarga de Ca²⁺, alteración mitocondrial y vías de daño.',
};
