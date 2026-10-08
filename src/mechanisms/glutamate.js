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
  isolatedContext: true,
  entryCamera: 'synapseOverview',
  portraitFit: .85,
  responseRates: {damage:.35,local:.55,intrinsic:.65},
  initialState: {glut:.12,activation:.04,ca:0,stress:0,damage:0,local:0,intrinsic:0},
  overviewCamera: 'synapseOverview',
  cameraPoses: {
    synapseOverview: { position: [2.3, .30, 17.6], target: [.2, -1.35, 0] },
    proximalMito: { position: [2.3, -.10, 16.2], target: [.75,-1.75,0] },
    localRemodeling: { position: [2.1,.2,14.7], target: [.05,-1.15,0] },
    intrinsicPathway: { position: [3.1,-.5,14.7], target: [1.0,-2.15,0] },
  },
  content: {
    ...structures,
    dendrite: {category:'CONTINUIDAD POSTSINÁPTICA',title:'Dendrita proximal',text:'El cuello comunica la espina con este segmento dendrítico. La mitocondria se encuentra dentro del eje, próxima a la sinapsis.',observe:'Sigue el cuello hasta el corte dendrítico y compara el tamaño de la mitocondria con la cabeza.',note:'La localización y la distancia son ilustrativas; no todas las espinas contienen una mitocondria.'},
    actin: {category:'CITOESQUELETO INTRACELULAR',title:'F-actina · remodelado local',text:'Los filamentos de actina sostienen la forma de la cabeza y continúan hacia el cuello. Una alteración sostenida puede acompañarse de reorganización y retracción local.',observe:'Compara la cabeza con su estado inicial y observa los filamentos que se muestran durante el remodelado local.',note:'La retracción ilustra una posibilidad; no demuestra apoptosis de toda la neurona.'},
    cytochrome: {category:'VÍA INTRÍNSECA · POSIBILIDAD CONTEXTUAL',title:'Citocromo c',text:'Tras permeabilización de la membrana mitocondrial externa, el citocromo c puede pasar del espacio intermembranal al citosol y favorecer el ensamblaje del apoptosoma con Apaf-1.',observe:'Sigue los pequeños complejos ocres desde el espacio entre ambas membranas hacia Apaf-1.',note:'El corte anatómico no es una rotura. Esta liberación no se exige para todo remodelado local ni toda excitotoxicidad.'},
    apaf1: {category:'APOPTOSOMA · ESQUEMA',title:'Apaf-1',text:'En condiciones apropiadas, Apaf-1, citocromo c y nucleótidos permiten organizar el apoptosoma, que recluta y activa caspasa-9.',observe:'Reconoce el ensamblaje anular próximo al citocromo c liberado, dentro del citosol dendrítico ilustrado.',note:'Se simplifican dominios y cofactores; su proximidad muestra la vía, no una reconstrucción atómica.'},
    caspase9: {category:'CASPASA INICIADORA',title:'Caspasa-9',text:'La activación de caspasa-9 en el apoptosoma puede iniciar una cascada de caspasas ejecutoras en la vía intrínseca.',observe:'Compara el énfasis de Apaf-1, caspasa-9 y las caspasas ejecutoras durante esta etapa.',note:'Esta vía es una posibilidad contextual, distinta de la señal local de caspasa-3 en la etapa anterior.'},
    executioners: {category:'POSIBLE PROGRESIÓN NEURONAL',title:'Caspasas ejecutoras',text:'La activación extensa y persistente de caspasas ejecutoras, como caspasa-3, puede contribuir a apoptosis neuronal. La imagen muestra la señalización; no simula la muerte de una neurona completa.',observe:'Localiza el conjunto posterior a caspasa-9 en el segmento dendrítico.',note:'La actividad limitada de caspasas también tiene funciones no letales; la excitotoxicidad puede involucrar vías independientes de caspasas.'},
    terminal: { category: 'COMPARTIMENTO PRESINÁPTICO', title: 'Terminal presináptica', text: 'El extremo del axón establece contacto con la espina dendrítica. Las vesículas almacenan el neurotransmisor y lo liberan hacia la hendidura sináptica.', observe: 'Reconoce las vesículas dentro de la terminal y el espacio que separa su membrana de la espina.', note: 'La sección de la membrana es un recurso de ilustración para ver el interior.' },
    vesicles: { category: 'ALMACENAMIENTO Y LIBERACIÓN', title: 'Vesículas sinápticas', text: 'Pequeños compartimentos delimitados por membrana que almacenan glutamato. Su fusión con la membrana presináptica permite liberar el neurotransmisor.', observe: 'Localiza los compartimentos redondeados dentro de la terminal, próximos a la región de liberación del glutamato.', note: 'Las partículas y su movimiento son conceptuales.' },
    spine: { category: 'COMPARTIMENTO POSTSINÁPTICO', title: 'Espina dendrítica', text: 'La cabeza ensanchada recibe el contacto sináptico. Un cuello estrecho la conecta con la dendrita y contribuye a organizar la señalización local.', observe: 'Sigue la cabeza ensanchada hacia el cuello y comprueba su continuidad con la dendrita.', note: 'La forma corresponde a una espina tipo mushroom, una de varias morfologías posibles.' },
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
      state: { glut: .6, activation: .04, ca: 0, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [0, .85, .25],
      labels:['terminal','glutamate','spine'],
    },
    {
      key: 'ampa',
      title: 'AMPA · despolarización',
      caption: 'AMPA permite el flujo de cationes, incluido Na⁺. La despolarización favorece el alivio del bloqueo por Mg²⁺ de NMDA.',
      duration: 8,
      state: { glut: .7, activation: .75, ca: 0, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [-.65, .08, .45],
      labels:['ampa','nmda','glutamate'],
    },
    {
      key: 'nmda',
      title: 'NMDA · una apertura condicionada',
      caption: 'NMDA requiere glutamato, un coagonista y un voltaje que alivie el bloqueo por Mg²⁺. Así permite el paso de Ca²⁺.',
      duration: 8,
      state: { glut: .8, activation: .9, ca: .3, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [.45, .1, .5],
      labels:['nmda','calcium','spine'],
    },
    {
      key: 'calcium',
      title: 'Ca²⁺ · cuando se pierde el equilibrio',
      caption: 'El calcio es una señal esencial. Una entrada excesiva o sostenida puede superar la capacidad de regulación de la neurona.',
      duration: 8,
      state: { glut: .9, activation: .9, ca: .95, stress: .12, damage: 0, local:0, intrinsic:0 },
      focus: [.25, -.65, .5],
      labels:['nmda','calcium','dendrite'],
    },
    {
      key: 'mitochondria',
      title: 'La respuesta mitocondrial',
      caption: 'En el eje dendrítico, la mitocondria participa en la regulación del Ca²⁺. Una carga excesiva puede comprometer su función energética.',
      duration: 8,
      state: { glut: .8, activation: .8, ca: .95, stress: .6, damage: 0, local:0, intrinsic:0 },
      camera: 'proximalMito',
      labels:['spine','dendrite','mitochondria','calcium'],
    },
    {
      key: 'ros',
      title: 'ROS · un equilibrio vulnerable',
      caption: 'Las ROS también participan en fisiología. Un desequilibrio entre su producción y las defensas antioxidantes puede reforzar la disfunción mitocondrial.',
      duration: 9,
      state: { glut: .65, activation: .7, ca: .85, stress: .95, damage: 0, local:0, intrinsic:0 },
      camera: 'proximalMito',
      labels:['mitochondria','ros','dendrite'],
    },
    {
      key:'local-remodeling', title:'Posibilidad A · remodelado local',
      caption:'En la espina, la actividad localizada de caspasa-3 puede acompañar cambios del citoesqueleto y retracción. Esta posibilidad no demuestra apoptosis neuronal ni exige la vía de la etapa siguiente.',
      duration:11,state:{glut:.35,activation:.40,ca:.45,stress:.60,damage:1,local:1,intrinsic:0},
      camera:'localRemodeling',labels:['caspases','actin','spine','dendrite'],
    },
    {
      key:'intrinsic-possibility',title:'Posibilidad B · vía intrínseca',
      caption:'Otra posibilidad: permeabilización externa y citocromo c pueden favorecer Apaf-1, caspasa-9 y caspasas ejecutoras, con eventual apoptosis neuronal. No es la continuación obligatoria del remodelado local.',
      duration:14,state:{glut:.35,activation:.40,ca:.55,stress:.75,damage:0,local:0,intrinsic:1},
      camera:'intrinsicPathway',labels:['mitochondria','cytochrome','apaf1','caspase9','executioners'],
      labelPhases:[{after:0,labels:['mitochondria','cytochrome']},{after:4,labels:['cytochrome','apaf1','caspase9']},{after:8,labels:['apaf1','caspase9','executioners']}],
    },
  ],
};

export default glutamateMechanism;
