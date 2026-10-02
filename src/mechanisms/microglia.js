// Panel C supplies the biological relationships. Intensities, durations and
// spatial distances below are illustration controls, not measured kinetics.
const state = (ca, ros, damage, signals, approach, contact, pruning, activation = .05) => ({
  ca, ros, damage, signals, approach, contact, pruning, activation,
});

export const microgliaMechanism = {
  id: 'microglia',
  title: 'Remodelado microglial',
  subtitle: 'Participación de la microglía en la eliminación de sinapsis dañadas',
  description: 'Una conexión alterada, señales locales y el acercamiento de la microglía.',
  navLabel: 'Microglía',
  eyebrow: '04 / MICROGLÍA · PANEL C',
  heading: ['Conexiones bajo', 'vigilancia.'],
  scaleIndex: '04',
  scaleLabel: 'MICROAMBIENTE SINÁPTICO',
  isolatedContext: true,
  resetOnExit: true,
  // Visual response rates keep extension and retraction legible across a stage.
  // They are not biological rate constants; existing modules retain their pace.
  responseRates: { approach: .4, contact: .65, pruning: .28, damage: .7, signals: .8 },
  portraitFit: .93,
  entryCamera: 'damagedSpine',
  overviewCamera: 'microgliaOverview',
  initialState: state(0, 0, 0, 0, 0, 0, 0),
  cameraPoses: {
    microgliaOverview: { position: [5, 3.5, 24.5], target: [.2, .6, 0] },
    healthySynapse: { position: [3.4, 2.9, 23], target: [.3, .25, 0] },
    damagedSpine: { position: [3.2, 1.7, 18.5], target: [.65, -.75, .1] },
    complementSignals: { position: [3.5, 1.5, 18.5], target: [1.0, -.6, .1] },
    microgliaApproach: { position: [5.5, 4.2, 23], target: [1.3, .9, -.1] },
    microgliaContact: { position: [4.8, 2.4, 21], target: [1.35, -.15, .1] },
    postPruningOverview: { position: [5.1, 3.5, 24.5], target: [.2, .45, 0] },
  },
  steps: [
    {
      key: 'functional-synapse',
      title: 'Sinapsis dendrítica',
      caption: 'Dos espinas conservan su forma y sus contactos. Cerca de ellas, la microglía explora el entorno con movimientos discretos de sus procesos.',
      duration: 8,
      state: state(0, 0, 0, 0, 0, 0, 0),
      camera: 'healthySynapse',
      labels: ['healthySpine', 'terminal', 'microglia'],
    },
    {
      key: 'synaptic-alteration',
      title: 'Una conexión cambia de estado',
      caption: 'En una de las espinas aumenta la entrada de Ca²⁺ por NMDAR y la señal de ROS. La espina vecina conserva su morfología.',
      duration: 9,
      state: state(.78, .6, .12, 0, 0, 0, 0, .8),
      camera: 'damagedSpine',
      labels: ['nmda', 'calcium', 'ros'],
    },
    {
      key: 'damage-associated-signals',
      title: 'Señales en la sinapsis alterada',
      caption: 'La cabeza cambia ligeramente. C1q, C3 y una señal local de caspasa-3 sitúan los componentes del panel C alrededor de esta conexión.',
      duration: 10,
      state: state(.7, .68, .28, .9, 0, 0, 0, .7),
      camera: 'complementSignals',
      labels: ['damagedSpine', 'c1q', 'c3', 'caspase3'],
    },
    {
      key: 'microglial-recognition',
      title: 'Un proceso se aproxima',
      caption: 'Un proceso microglial se extiende hacia la conexión alterada. El soma permanece próximo y la espina conservada queda al margen del contacto.',
      duration: 11,
      state: state(.58, .6, .32, 1, .9, 0, 0, .62),
      camera: 'microgliaApproach',
      labels: ['microglia', 'process', 'damagedSpine'],
    },
    {
      key: 'contact-remodeling',
      title: 'Contacto y remodelado',
      caption: 'El proceso alcanza la región sináptica. La cabeza de la espina se reduce y retrae gradualmente: una representación conceptual del remodelado local.',
      duration: 12,
      state: state(.42, .48, .45, .9, 1, 1, .7, .48),
      camera: 'microgliaContact',
      labels: ['process', 'damagedSpine', 'healthySpine'],
    },
    {
      key: 'connectivity-remodeling',
      title: 'Remodelado de la conectividad sináptica',
      caption: 'Una eliminación excesiva de conexiones durante el desarrollo puede alterar la organización de los circuitos neuronales.',
      duration: 10,
      state: state(.18, .28, .58, .5, 1, 1, .93, .26),
      camera: 'postPruningOverview',
      labels: ['microglia', 'healthySpine', 'dendrite'],
    },
  ],
  content: {
    microglia: {
      category: 'VIGILANCIA DEL ENTORNO NEURONAL',
      title: 'Microglía',
      text: 'Célula inmunitaria residente del sistema nervioso central. Sus procesos exploran el entorno y pueden participar en el remodelado de conexiones sinápticas.',
      note: 'El contacto microglial no implica siempre eliminación ni daño neuronal.',
    },
    process: {
      category: 'CONTACTO ENTRE CÉLULAS',
      title: 'Proceso microglial',
      text: 'Una prolongación fina y ramificada que puede extenderse o retraerse. Aquí se aproxima gradualmente a la sinapsis alterada sin desplazar todo el soma.',
      note: 'La trayectoria y su duración son recursos de ilustración.',
    },
    healthySpine: {
      category: 'REFERENCIA MORFOLÓGICA',
      title: 'Espina conservada',
      text: 'Esta espina mantiene su cabeza, cuello y contacto sináptico durante el recorrido. Permite comparar los cambios de la conexión vecina.',
      note: 'Su conservación visual no representa una medición de función sináptica.',
    },
    damagedSpine: {
      category: 'CONEXIÓN EN REMODELADO',
      title: 'Espina en estudio',
      text: 'Comienza con una morfología conservada. En las etapas siguientes presenta señales asociadas con daño, contacto microglial y reducción gradual de su cabeza.',
      note: 'El recorrido ilustra una posibilidad del panel C, no el destino de toda espina alterada.',
    },
    c1q: {
      category: 'COMPONENTE DEL COMPLEMENTO',
      title: 'C1q',
      text: 'Componente del complemento representado junto a la sinapsis alterada. Puede participar en mecanismos de identificación y eliminación de conexiones.',
      note: 'La forma es estilizada; su presencia no diagnostica por sí sola daño sináptico.',
    },
    c3: {
      category: 'COMPONENTE DEL COMPLEMENTO',
      title: 'C3',
      text: 'Componente del complemento que participa en procesos de remodelado sináptico. El panel C lo sitúa entre las señales asociadas con la conexión alterada.',
      note: 'El marcador resume C3 y su participación funcional, sin representar sus fragmentos ni receptores.',
    },
    caspase3: {
      category: 'SEÑAL LOCAL ASOCIADA CON DAÑO',
      title: 'Caspasa-3 · CASP3',
      text: 'La caspasa-3 puede participar localmente en cambios de espinas y dendritas. Aquí acompaña el estado alterado de la conexión indicado en el panel C.',
      note: 'No se presenta como señal extracelular que atraiga microglía ni como apoptosis de toda la neurona.',
    },
    nmda: {
      category: 'CONTEXTO POSTSINÁPTICO',
      title: 'NMDAR',
      text: 'Receptor que permite entrada de Ca²⁺ cuando se cumplen sus condiciones de activación. Su actividad aporta aquí el contexto inicial de la alteración sináptica.',
      note: 'Este recorrido se centra en la interacción con la microglía.',
    },
    calcium: {
      category: 'SEÑAL INTRACELULAR',
      title: 'Ca²⁺ · calcio',
      text: 'La entrada aumentada de Ca²⁺ acompaña el cambio de estado de la espina en el panel C. Las partículas atraviesan el canal NMDAR hacia el interior.',
      note: 'Su cantidad no representa una concentración ni un umbral de daño.',
    },
    ros: {
      category: 'ESTRÉS OXIDATIVO LOCAL',
      title: 'ROS · especies reactivas de oxígeno',
      text: 'Esta señal reúne conceptualmente especies reactivas de oxígeno asociadas con el entorno de la sinapsis alterada.',
      note: 'El módulo no atribuye una fuente molecular única ni añade rutas de producción.',
    },
    glutamate: {
      category: 'CONTEXTO SINÁPTICO',
      title: 'Glutamato',
      text: 'Neurotransmisor excitador liberado hacia la hendidura sináptica. Su presencia contextualiza la activación del receptor y la entrada de calcio.',
      note: 'La liberación se simplifica para mantener el foco en la relación microglía–sinapsis.',
    },
    terminal: {
      category: 'COMPARTIMENTO PRESINÁPTICO',
      title: 'Terminal presináptica',
      text: 'El extremo de un axón establece contacto con la cabeza de la espina a través de la hendidura sináptica.',
      note: 'Su menor protagonismo durante el remodelado es una convención de lectura.',
    },
    dendrite: {
      category: 'CONTINUIDAD NEURONAL',
      title: 'Dendrita',
      text: 'La rama neuronal sostiene las espinas mostradas. El cambio local de una conexión no implica la desaparición de toda la dendrita o de la neurona.',
      note: 'Las proporciones y distancias facilitan la lectura del microambiente.',
    },
  },
  async createScene(context) {
    const { createMicrogliaEnvironment } = await import('../scene/microglia-environment.js');
    return createMicrogliaEnvironment(context);
  },
};

export default microgliaMechanism;
