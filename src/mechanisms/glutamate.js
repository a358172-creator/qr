import { structures } from '../content.js';

// Narrative intensities and durations are artistic controls, not concentrations,
// measured kinetics, or a prediction of neuronal injury. Positions are local to
// the synapse model; the scene manager places that model within the dendrite.
export const glutamateMechanism = {
  id: 'glutamate',
  title: 'Glutamatergic excitotoxicity',
  description: 'From synaptic communication to the loss of calcium regulation.',
  eyebrow: '02 / SYNAPTIC MICROENVIRONMENT',
  heading: ['The intimacy', 'of a connection.'],
  navLabel: 'Synapse',
  scaleIndex: '02',
  scaleLabel: 'SYNAPTIC SCALE',
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
    dendrite: {category:'POSTSYNAPTIC CONTINUITY',title:'Proximal dendrite',text:'The neck connects the spine to this dendritic segment. The mitochondrion lies within the shaft, close to the synapse.',observe:'Follow the neck to the dendritic cutaway and compare the size of the mitochondrion with the head.',note:'Location and distance are illustrative; not every spine contains a mitochondrion.'},
    actin: {category:'INTRACELLULAR CYTOSKELETON',title:'F-actin · local remodeling',text:'Actin filaments support the shape of the head and extend into the neck. Sustained disruption can coincide with local reorganization and retraction.',observe:'Compare the head with its initial state and observe the filaments shown during local remodeling.',note:'Retraction illustrates one possibility; it does not demonstrate apoptosis of the entire neuron.'},
    cytochrome: {category:'INTRINSIC PATHWAY · CONTEXTUAL POSSIBILITY',title:'Cytochrome c',text:'Following permeabilization of the outer mitochondrial membrane, cytochrome c can move from the intermembrane space into the cytosol and promote apoptosome assembly with Apaf-1.',observe:'Follow the small sand-colored complexes from the space between the two membranes toward Apaf-1.',note:'The anatomical cutaway is not a rupture. This release is not required for all local remodeling or all excitotoxicity.'},
    apaf1: {category:'APOPTOSOME · SCHEMATIC',title:'Apaf-1',text:'Under appropriate conditions, Apaf-1, cytochrome c and nucleotides enable apoptosome assembly, recruiting and activating caspase-9.',observe:'Identify the ring-shaped assembly near the released cytochrome c, within the illustrated dendritic cytosol.',note:'Domains and cofactors are simplified; their proximity illustrates the pathway rather than an atomic reconstruction.'},
    caspase9: {category:'INITIATOR CASPASE',title:'Caspase-9',text:'Caspase-9 activation in the apoptosome can initiate an executioner caspase cascade in the intrinsic pathway.',observe:'Compare the emphasis on Apaf-1, caspase-9 and executioner caspases during this stage.',note:'This pathway is a contextual possibility, distinct from the local caspase-3 signal in the previous stage.'},
    executioners: {category:'POSSIBLE NEURONAL PROGRESSION',title:'Executioner caspases',text:'Widespread, persistent activation of executioner caspases, such as caspase-3, can contribute to neuronal apoptosis. The image shows signaling; it does not simulate the death of an entire neuron.',observe:'Locate the group downstream of caspase-9 in the dendritic segment.',note:'Limited caspase activity also has nonlethal functions; excitotoxicity can involve caspase-independent pathways.'},
    terminal: { category: 'PRESYNAPTIC COMPARTMENT', title: 'Presynaptic terminal', text: 'The end of the axon contacts the dendritic spine. Vesicles store the neurotransmitter and release it into the synaptic cleft.', observe: 'Identify the vesicles inside the terminal and the space separating its membrane from the spine.', note: 'The membrane cutaway is an illustrative device for viewing the interior.' },
    vesicles: { category: 'STORAGE AND RELEASE', title: 'Synaptic vesicles', text: 'Small membrane-bound compartments that store glutamate. Fusion with the presynaptic membrane allows neurotransmitter release.', observe: 'Locate the rounded compartments inside the terminal, close to the glutamate release region.', note: 'The particles and their movement are conceptual.' },
    spine: { category: 'POSTSYNAPTIC COMPARTMENT', title: 'Dendritic spine', text: 'The expanded head receives the synaptic contact. A narrow neck connects it to the dendrite and helps organize local signaling.', observe: 'Follow the expanded head toward the neck and trace its continuity with the dendrite.', note: 'The shape represents a mushroom spine, one of several possible morphologies.' },
  },
  async createScene(context) {
    const { createGlutamateEnvironment } = await import('../scene/glutamate-environment.js');
    return createGlutamateEnvironment(context);
  },
  steps: [
    {
      key: 'glutamate',
      title: 'A signal between neurons',
      caption: 'Vesicles release glutamate. The signal crosses the cleft and reaches the spine membrane.',
      duration: 7,
      state: { glut: .6, activation: .04, ca: 0, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [0, .85, .25],
      labels:['terminal','glutamate','spine'],
    },
    {
      key: 'ampa',
      title: 'AMPA · depolarization',
      caption: 'AMPA allows cation flow, including Na⁺. Depolarization helps relieve the Mg²⁺ block of NMDA receptors.',
      duration: 8,
      state: { glut: .7, activation: .75, ca: 0, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [-.65, .08, .45],
      labels:['ampa','nmda','glutamate'],
    },
    {
      key: 'nmda',
      title: 'NMDA · conditional opening',
      caption: 'NMDA requires glutamate, a coagonist and a voltage that relieves the Mg²⁺ block, allowing Ca²⁺ to pass.',
      duration: 8,
      state: { glut: .8, activation: .9, ca: .3, stress: 0, damage: 0, local:0, intrinsic:0 },
      focus: [.45, .1, .5],
      labels:['nmda','calcium','spine'],
    },
    {
      key: 'calcium',
      title: 'Ca²⁺ · when balance is lost',
      caption: 'Calcium is an essential signal. Excessive or sustained influx can exceed the regulatory capacity of the neuron.',
      duration: 8,
      state: { glut: .9, activation: .9, ca: .95, stress: .12, damage: 0, local:0, intrinsic:0 },
      focus: [.25, -.65, .5],
      labels:['nmda','calcium','dendrite'],
    },
    {
      key: 'mitochondria',
      title: 'The mitochondrial response',
      caption: 'Within the dendritic shaft, the mitochondrion contributes to Ca²⁺ regulation. An excessive load can compromise its energetic function.',
      duration: 8,
      state: { glut: .8, activation: .8, ca: .95, stress: .6, damage: 0, local:0, intrinsic:0 },
      camera: 'proximalMito',
      labels:['spine','dendrite','mitochondria','calcium'],
    },
    {
      key: 'ros',
      title: 'ROS · a vulnerable balance',
      caption: 'ROS also participate in physiology. An imbalance between their production and antioxidant defenses can reinforce mitochondrial dysfunction.',
      duration: 9,
      state: { glut: .65, activation: .7, ca: .85, stress: .95, damage: 0, local:0, intrinsic:0 },
      camera: 'proximalMito',
      labels:['mitochondria','ros','dendrite'],
    },
    {
      key:'local-remodeling', title:'Possibility A · local remodeling',
      caption:'Within the spine, localized caspase-3 activity can accompany cytoskeletal changes and retraction. This possibility does not demonstrate neuronal apoptosis or require the pathway in the next stage.',
      duration:11,state:{glut:.35,activation:.40,ca:.45,stress:.60,damage:1,local:1,intrinsic:0},
      camera:'localRemodeling',labels:['caspases','actin','spine','dendrite'],
    },
    {
      key:'intrinsic-possibility',title:'Possibility B · intrinsic pathway',
      caption:'Another possibility: outer membrane permeabilization and cytochrome c can promote Apaf-1, caspase-9 and executioner caspases, potentially leading to neuronal apoptosis. This is not an obligatory continuation of local remodeling.',
      duration:14,state:{glut:.35,activation:.40,ca:.55,stress:.75,damage:0,local:0,intrinsic:1},
      camera:'intrinsicPathway',labels:['mitochondria','cytochrome','apaf1','caspase9','executioners'],
      labelPhases:[{after:0,labels:['mitochondria','cytochrome']},{after:4,labels:['cytochrome','apaf1','caspase9']},{after:8,labels:['apaf1','caspase9','executioners']}],
    },
  ],
};

export default glutamateMechanism;
