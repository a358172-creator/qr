// These explanations also remain accessible when WebGL is unavailable.
export const structures = {
  glutamate: {
    category: 'NEUROTRANSMITTER', title: 'Glutamate',
    text: 'Presynaptic vesicles release glutamate into the cleft, where it reaches receptors on the spine. This signal supports excitatory communication; excessive or prolonged activation can promote excitotoxicity.',
    detail: 'The cleft separates the membranes of the two neurons: the neurotransmitter connects these compartments without merging them. The response depends on the receptors it activates and how long the signal lasts. This tour moves from release to calcium regulation to show how an essential function can become a burden for the cell.',
    observe: 'Follow the particles from the terminal to the receptors facing it, across the cleft.',
    note: 'Reuptake and astrocyte involvement are not shown.',
  },
  ampa: {
    category: 'IONOTROPIC RECEPTOR', title: 'AMPA receptor',
    text: 'AMPA contributes to fast excitatory transmission through cation flow, mainly Na⁺ and K⁺. The resulting depolarization can help relieve the Mg²⁺ block of NMDA receptors.',
    detail: 'Depolarization means shifting the membrane voltage toward less negative values. AMPA helps create this electrical context, while NMDA retains its own opening requirements, including the presence of a coagonist. AMPA calcium permeability depends on its composition; this scene focuses on Ca²⁺ entry through NMDA to follow the selected pathway.',
    observe: 'Distinguish the blue AMPA complexes from the orange NMDA receptors, both embedded in the postsynaptic membrane.',
    note: 'The subunits are stylized; this is not a molecular reconstruction.',
  },
  nmda: {
    category: 'IONOTROPIC RECEPTOR', title: 'NMDA receptor',
    text: 'Opening requires glutamate, a coagonist and voltage conditions that relieve the Mg²⁺ block. It allows Ca²⁺ and other cations to pass, linking synaptic activity to intracellular responses.',
    detail: 'NMDA combines chemical and electrical requirements: glutamate alone does not fully describe its activation. Under regulated conditions, calcium passing through the channel contributes to synaptic plasticity. With excessive or sustained activity, the same influx can contribute to overload; its effects also depend on receptor location and cellular state.',
    observe: 'Locate the central pore and watch calcium particles cross the membrane through the channel.',
    note: 'Mg²⁺ and coagonists are explained but are not drawn in the scene.',
  },
  calcium: {
    category: 'INTRACELLULAR SIGNAL', title: 'Ca²⁺ entry',
    text: 'Calcium entering through NMDA participates in signals essential for synaptic function. Excessive or sustained entry can exceed regulatory capacity and disrupt cellular processes.',
    detail: 'The difference between signaling and overload depends on amount, duration and context, rather than the mere presence of calcium. Mitochondria help handle calcium but can also be affected by an excessive load. The tour therefore connects receptor-mediated entry with energetic and redox changes without establishing a universal injury threshold.',
    observe: 'Compare the initial moderate influx with later stages and follow its dispersal within the spine head.',
    note: 'Ion size, number and speed are illustrative.',
  },
  mitochondria: {
    category: 'ORGANELLE · CUTAWAY VIEW', title: 'Mitochondrion',
    text: 'Folds of the inner membrane, called cristae, contain part of the machinery that produces ATP. Mitochondria also contribute to calcium handling and redox balance.',
    detail: 'Energy production and calcium regulation are connected within the organelle. Overload can compromise mitochondrial function and coincide with changes in reactive species production. The cutaway links these functions to the architecture of membranes and cristae, while the sequence shows progressive vulnerability that depends on cellular context.',
    observe: 'Identify the outer contour and inner folds, then compare their appearance before and during overload.',
    note: 'Shown in the proximal dendritic shaft. The cutaway does not indicate membrane rupture or a mitochondrion inside every spine.',
  },
  ros: {
    category: 'REDOX BALANCE', title: 'ROS · reactive oxygen species',
    text: 'Reactive oxygen species participate in physiological processes. When their production exceeds antioxidant defenses, they can contribute to damage to lipids, proteins and nucleic acids.',
    detail: 'ROS encompasses several species with different properties. In this scene, the signal near the mitochondrion highlights a possible relationship between energy disruption and oxidative stress. These processes can reinforce each other, although mitochondria are not the only cellular source of oxidants; the panel D tour explores other relationships without presenting an obligatory sequence.',
    observe: 'Watch the orange signal near the mitochondrion and compare it with the subtle activity in the early stages.',
    note: 'The orange dots indicate conceptual activity, not molecules drawn to scale.',
  },
  caspases: { category:'LOCAL INTRACELLULAR PROTEOLYSIS',title:'Caspase-3 · local signal',text:'Localized caspase-3 activity can participate in spine remodeling and retraction without the death of the entire neuron. Here it accompanies local changes in F-actin.',detail:'The magnitude, duration and compartmentalization of activity matter. A limited signal in one spine is not equivalent to widespread executioner caspase activation during neuronal apoptosis. The tour separately shows a possible intrinsic mitochondrial pathway; it does not claim that all retraction requires cytochrome c release.',observe:'Locate the complexes inside the retracting spine and compare them with the cytosolic machinery of the possible intrinsic pathway.',note:'Caspases have lethal and nonlethal functions. This sequence is conceptual and context dependent.' },
};
export const steps = [
  { key: 'glutamate', caption: '01 — Vesicles release glutamate into the synaptic cleft. The signal reaches receptors on the spine.' },
  { key: 'nmda', caption: '02 — AMPA contributes to depolarization; NMDA integrates agonist binding and voltage conditions.' },
  { key: 'calcium', caption: '03 — Ca²⁺ enters through NMDA. Sustained entry can exceed intracellular regulatory capacity.' },
  { key: 'ros', caption: '04 — Overload can disrupt mitochondrial function and redox balance; these processes can reinforce each other.' },
  { key: 'caspases', caption: '05 — Injury pathways may activate, including some associated with caspases. Progression is neither uniform nor inevitable.' },
];
export const modeCaptions = {
  physiological: 'An essential signal for communication between neurons. Explore what happens when its regulation is lost.',
  overload: 'Excessive or sustained activation can be associated with Ca²⁺ overload, mitochondrial disruption and injury pathways.',
};
