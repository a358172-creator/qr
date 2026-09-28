import { structures } from '../content.js';

// Narrative intensities and durations are artistic controls, not concentrations,
// measured kinetics, or a prediction of neuronal injury. Positions are local to
// the synapse model; the scene manager places that model within the dendrite.
export const glutamateMechanism = {
  id: 'glutamate',
  title: 'Excitotoxicidad glutamatérgica',
  description: 'De la comunicación sináptica a la pérdida de regulación del calcio.',
  eyebrow: '02 / MICROAMBIENTE SINÁPTICO',
  heading: ['La intimidad', 'de una conexión.'],
  navLabel: 'Sinapsis',
  scaleIndex: '02',
  scaleLabel: 'ESCALA SINÁPTICA',
  overviewCamera: 'synapseOverview',
  cameraPoses: {
    synapseOverview: { position: [2.15, 1.25, 14], target: [0, -.25, 0] },
  },
  content: {
    ...structures,
    terminal: { category: 'COMPARTIMENTO PRESINÁPTICO', title: 'Terminal presináptica', text: 'El extremo del axón establece contacto con la espina dendrítica. Las vesículas almacenan el neurotransmisor y lo liberan hacia la hendidura sináptica.', note: 'La sección de la membrana es un recurso de ilustración para ver el interior.' },
    vesicles: { category: 'ALMACENAMIENTO Y LIBERACIÓN', title: 'Vesículas sinápticas', text: 'Pequeños compartimentos delimitados por membrana que almacenan glutamato. Su fusión con la membrana presináptica permite liberar el neurotransmisor.', note: 'Las partículas y su movimiento son conceptuales.' },
    spine: { category: 'COMPARTIMENTO POSTSINÁPTICO', title: 'Espina dendrítica', text: 'La cabeza ensanchada recibe el contacto sináptico. Un cuello estrecho la conecta con la dendrita y contribuye a organizar la señalización local.', note: 'La forma corresponde a una espina tipo mushroom, una de varias morfologías posibles.' },
  },
  async createScene(context) {
    const { createGlutamateEnvironment } = await import('../scene/glutamate-environment.js');
    return createGlutamateEnvironment(context);
  },
  steps: [
    {
      key: 'glutamate',
      title: 'Una señal entre neuronas',
      caption: 'Las vesículas liberan glutamato. La señal cruza la hendidura y alcanza la membrana de la espina.',
      duration: 7,
      state: { glut: .6, activation: .04, ca: 0, stress: 0, damage: 0 },
      focus: [0, .85, .25],
    },
    {
      key: 'ampa',
      title: 'AMPA · despolarización',
      caption: 'AMPA permite el flujo de cationes, incluido Na⁺. La despolarización favorece el alivio del bloqueo por Mg²⁺ de NMDA.',
      duration: 8,
      state: { glut: .7, activation: .75, ca: 0, stress: 0, damage: 0 },
      focus: [-.65, .08, .45],
    },
    {
      key: 'nmda',
      title: 'NMDA · una apertura condicionada',
      caption: 'NMDA requiere glutamato, un coagonista y un voltaje que alivie el bloqueo por Mg²⁺. Así permite el paso de Ca²⁺.',
      duration: 8,
      state: { glut: .8, activation: .9, ca: .3, stress: 0, damage: 0 },
      focus: [.45, .1, .5],
    },
    {
      key: 'calcium',
      title: 'Ca²⁺ · cuando se pierde el equilibrio',
      caption: 'El calcio es una señal esencial. Una entrada excesiva o sostenida puede superar la capacidad de regulación de la neurona.',
      duration: 8,
      state: { glut: .9, activation: .9, ca: .95, stress: .12, damage: 0 },
      focus: [.25, -.65, .5],
    },
    {
      key: 'mitochondria',
      title: 'La respuesta mitocondrial',
      caption: 'La mitocondria participa en la regulación del Ca²⁺. Una carga excesiva puede comprometer su función energética.',
      duration: 8,
      state: { glut: .8, activation: .8, ca: .95, stress: .6, damage: 0 },
      focus: [.25, -1.2, .4],
    },
    {
      key: 'ros',
      title: 'ROS · un equilibrio vulnerable',
      caption: 'La disfunción mitocondrial y el estrés oxidativo pueden reforzarse. Esta secuencia es conceptual: el daño no es inevitable.',
      duration: 9,
      state: { glut: .65, activation: .7, ca: .85, stress: .95, damage: 0 },
      focus: [.45, -1.4, .45],
    },
  ],
};

export default glutamateMechanism;
