// Narrative controls are independent from age, assay, measured values and
// significance. These specimens illustrate literature, not homogenate images.
const state=(reaction=0,oxidation=0,inhibition=0,flux=0,activation=0,stress=0)=>({reaction,oxidation,inhibition,flux,activation,stress});
const modelNote='Scientific illustration of a mechanism described in the literature.';
const entry=(category,title,text,observe,note=modelNote)=>({category,title,text,observe,note});
const common={
  evidence:true,isolatedContext:true,resetOnExit:false,portraitFit:.90,
  initialState:state(),responseRates:{oxidation:.55,inhibition:.55,stress:.45,flux:.75},
};
const membrane=entry('LIPID ARCHITECTURE','Phospholipid bilayer','Polar heads define two aqueous faces; their hydrophobic chains occupy the interior. Oxidation can change the organization of a local region.','Distinguish the two faces and internal chains; compare the highlighted region with the rest of the bilayer.','The anatomical cutaway reveals the chains within the bilayer.');
const mitochondria=entry('SUBCELLULAR REFERENCE','Mitochondrion','The cutaway separates the outer membrane, intermembrane space, inner membrane with cristae and matrix. This architecture locates the respiratory proteins.','Trace the continuity of the cristae with the inner membrane.','The anatomical cutaway makes the compartments and their membranes easier to identify.');

export const evidenceMechanisms={
  'e-control':{
    ...common,id:'e-control',title:'Control · conceptual reference',navLabel:'Control',description:'Membrane and mitochondrion as references for understanding exposure mechanisms.',
    eyebrow:'EVIDENCE · ANATOMICAL REFERENCE',heading:['A reference','for comparison.'],scaleIndex:'E0',scaleLabel:'CONCEPTUAL MODEL',
    entryCamera:'reference',overviewCamera:'reference',
    cameraPoses:{reference:{position:[2.4,2.3,13.0],target:[0,.3,0]},organelle:{position:[2.0,1.8,11.8],target:[0,-.2,0]}},
    steps:[
      {key:'reference-membrane',title:'Reference organization',caption:'The bilayer shows two polar faces and internal hydrophobic chains. This anatomical reference supports exploration of exposure mechanisms.',duration:9,state:state(),camera:'reference',labels:['membrane','mitochondria']},
      {key:'reference-compartments',title:'Compartments and interpretation',caption:'The cutaway shows membranes, cristae and matrix. Their organization locates components involved in energy metabolism.',duration:9,state:state(),camera:'organelle',labels:['mitochondria','membrane']},
    ],content:{membrane,mitochondria},
    async createScene(context){return (await import('../scene/evidence-environment.js')).createControlEnvironment(context);},
  },
  'e-feso4':{
    ...common,id:'e-feso4',title:'FeSO₄ · iron reactivity',navLabel:'FeSO₄',description:'Local Fenton reaction and oxidation of susceptible lipid chains.',
    eyebrow:'LITERATURE · FeSO₄',heading:['Reactive iron,','local oxidation.'],scaleIndex:'E1',scaleLabel:'LIPID INTERFACE',portraitFit:.98,
    entryCamera:'bilayer',overviewCamera:'bilayer',
    cameraPoses:{bilayer:{position:[2.7,3.5,12.2],target:[-.4,.2,0]},reaction:{position:[-.7,2.65,7.2],target:[-2.1,.30,.32]},lipids:{position:[-.9,2.55,7.8],target:[-1.85,.13,.3]}},
    steps:[
      {key:'lipid-reference',title:'A susceptible bilayer',caption:'Polyunsaturated chains form part of the bilayer. The blue region highlights a local group susceptible to oxidation.',duration:8,state:state(),camera:'bilayer',labels:['membrane','pufa']},
      {key:'redox-substrates',title:'Redox-active iron and peroxide',caption:'Fe²⁺ and H₂O₂ approach a lipid region. Iron availability and its chemical environment condition this reactivity.',duration:9,state:state(.25),camera:'reaction',labels:['fe2','h2o2','pufa']},
      {key:'local-fenton',title:'Fenton · a local encounter',caption:'Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + •OH. The high reactivity of the hydroxyl radical favors interactions close to its site of formation.',duration:12,state:state(1),camera:'reaction',labels:['fe2','h2o2','hydroxyl','fe3'],labelPhases:[{after:0,labels:['fe2','h2o2']},{after:4,labels:['hydroxyl','fe3']}]},
      {key:'localized-lipid-oxidation',title:'Oxidation of a lipid region',caption:'Local initiation can promote propagation and secondary oxidation products. The highlighted region changes moderately; TBARS assesses lipid oxidation products.',duration:12,state:state(.6,1),camera:'lipids',labels:['pufa','lipidProducts','membrane']},
    ],
    content:{membrane,
      pufa:entry('PHOSPHOLIPID CHAINS','Polyunsaturated fatty acids','Chains with several double bonds form part of phospholipids and can be susceptible to peroxidation. Curved contours distinguish an illustrative group within the bilayer.','Locate the blue chains within the region undergoing change.'),
      fe2:entry('REDOX-ACTIVE IRON','Fe²⁺ · ferrous iron','Available ferrous iron can react with H₂O₂ and oxidize to Fe³⁺. Its environment, ligands and availability influence the resulting chemistry.','Follow the small blue center at the point of encounter.'),
      h2o2:entry('REDOX SUBSTRATE','H₂O₂ · hydrogen peroxide','Hydrogen peroxide can participate in reactions with redox-active iron. Here it approaches the same point where the iron oxidation state changes.','Compare its approach with the appearance of products.'),
      fe3:entry('REACTION PRODUCT','Fe³⁺ · ferric iron','In the Fenton equation, Fe²⁺ oxidizes to Fe³⁺ as peroxide is transformed. Color changes distinguish oxidation states.','Find the sand-colored center at the site previously occupied by Fe²⁺.'),
      hydroxide:entry('IONIC PRODUCT','OH⁻ · hydroxide ion','The hydroxide ion and hydroxyl radical are different species in the illustrated equation. The former has a negative charge.','Distinguish the pale blue OH⁻ from the brief orange •OH marker.','OH⁻ is not presented as a radical or as the species initiating peroxidation here.'),
      hydroxyl:entry('RADICAL · LOCAL ENCOUNTER','•OH · hydroxyl radical','Its high reactivity favors interactions close to the site of formation. It can initiate oxidation in susceptible components.','Watch its brief appearance beside the chains, without traveling long distances.'),
      lipidProducts:entry('CONCEPTUAL PRODUCTS','Lipid oxidation','Oxidation can propagate among lipids and produce various secondary species. The markers illustrate that context.','Compare the altered patch with preserved membrane regions.','TBARS assesses thiobarbituric acid-reactive substances associated with lipid oxidation.'),
    },
    async createScene(context){return (await import('../scene/evidence-environment.js')).createIronEnvironment(context);},
  },
  'e-3np':{
    ...common,id:'e-3np',title:'3-NP · SDH inhibition',navLabel:'3-NP',description:'Succinate dehydrogenase, transfer to ubiquinone and complex II inhibition.',
    eyebrow:'LITERATURE · 3-NP',heading:['A point in','metabolism.'],scaleIndex:'E2',scaleLabel:'INNER MEMBRANE · MATRIX',
    entryCamera:'mito',overviewCamera:'mito',
    cameraPoses:{mito:{position:[2.0,1.6,9.8],target:[0,-.10,0]},sdh:{position:[.6,1.4,7.2],target:[-.35,.04,.15]},inhibition:{position:[.75,1.4,7.4],target:[-.4,.03,.10]}},
    steps:[
      {key:'complex-ii-location',title:'SDH in the inner membrane',caption:'Complex II is anchored in the inner membrane, with its catalytic domain facing the matrix. Other complexes and ATP synthase provide context. Complex II does not pump protons.',duration:9,state:state(),camera:'mito',labels:['mitochondria','sdh','atpSynthase']},
      {key:'succinate-electrons',title:'Succinate, fumarate and ubiquinone',caption:'SDH participates in converting succinate to fumarate and transfers electrons to ubiquinone (Q), connecting the Krebs cycle with the respiratory chain.',duration:11,state:state(0,0,0,1),camera:'sdh',labels:['succinate','sdh','fumarate','ubiquinone']},
      {key:'three-np-inhibition',title:'3-NP · complex II inhibition',caption:'3-NP can inactivate SDH through a mechanism dependent on its enzymatic processing. The approach and color change illustrate that inhibition.',duration:12,state:state(0,0,.85,1),camera:'inhibition',labels:['threeNP','sdh','electronFlow']},
      {key:'bioenergetic-context',title:'Electron flow and reducing capacity',caption:'Inhibition reduces complex II-associated flow and can compromise bioenergetics in certain contexts. MTT assesses the reducing capacity of the preparation.',duration:11,state:state(0,0,1,1),camera:'mito',labels:['sdh','threeNP','atpSynthase']},
    ],
    content:{mitochondria,
      sdh:entry('COMPLEX II · KREBS CYCLE','Succinate dehydrogenase','SDH oxidizes succinate to fumarate and transfers electrons to ubiquinone. The catalytic domain faces the matrix and is attached to membrane subunits.','Identify the blue protein attached to the inner membrane and the domain projecting toward its interior.','Complex II transfers electrons to Q without pumping protons.'),
      respiratory:entry('RESPIRATORY CONTEXT','Complexes I, III and IV','Other complexes participate in the respiratory chain and energy coupling. They remain as spatial references in the inner membrane.','Distinguish the secondary slate-gray complexes from the highlighted complex II.'),
      atpSynthase:entry('BIOENERGETIC CONTEXT','ATP synthase','ATP synthase uses the electrochemical proton gradient to synthesize ATP. Its catalytic head faces the matrix.','Locate the head separated from the membrane by a short stalk.'),
      succinate:entry('MATRIX SUBSTRATE','Succinate','Succinate is a Krebs cycle intermediate and an SDH substrate. Its oxidation is coupled to electron transfer.','Follow the small markers from the matrix to the catalytic domain.'),
      fumarate:entry('MATRIX PRODUCT','Fumarate','Succinate oxidation produces fumarate. The scene separates substrate and product by position and tone.','Watch the conceptual exit from the catalytic region into the matrix.'),
      ubiquinone:entry('MEMBRANE ACCEPTOR','Q · ubiquinone','Ubiquinone accepts electrons from complex II within the inner membrane; its reduced form is ubiquinol.','Locate the sand-colored markers beside the membrane anchor.','The Q/QH₂ system participates in electron transport within the membrane.'),
      electronFlow:entry('ELECTRON TRANSFER','SDH-associated electron flow','Small pale markers connect the catalytic region with Q. They decrease as illustrative inhibition increases.','Compare transfer before and during the presence of 3-NP.'),
      threeNP:entry('INHIBITOR · ESTABLISHED MECHANISM','3-Nitropropionic acid','3-NP is a mechanism-based inhibitor of SDH. Structural studies describe modification of a catalytic arginine after processing by complex II.','Follow its approach to the catalytic domain and the reduction in illustrated transfer.'),
    },
    async createScene(context){return (await import('../scene/evidence-environment.js')).createThreeNPEnvironment(context);},
  },
  'e-quin':{
    ...common,id:'e-quin',title:'QUIN · excitotoxic potential',navLabel:'QUIN',description:'Potential NMDAR activation and responses dependent on cellular context.',
    eyebrow:'LITERATURE · QUIN',heading:['Biological potential,','experimental context.'],scaleIndex:'E3',scaleLabel:'SYNAPSE · POTENTIAL MECHANISM',portraitFit:.85,
    entryCamera:'synapse',overviewCamera:'synapse',
    cameraPoses:{synapse:{position:[2.3,.30,20.8],target:[.2,-1.35,0]},receptor:{position:[1.8,.8,12.8],target:[.15,-.3,.25]},mitochondria:{position:[2.3,-.10,18.7],target:[.75,-1.75,0]}},
    steps:[
      {key:'quin-extracellular',title:'QUIN in the extracellular environment',caption:'Quinolinic acid lies outside the cell, near the extracellular NMDAR domain. The synapse offers an anatomical reference for exploring this mechanism.',duration:9,state:state(),camera:'synapse',labels:['quin','nmda','spine']},
      {key:'conditional-nmda',title:'Conditional activation',caption:'QUIN can act as an NMDAR agonist. Opening also requires coagonists and voltage conditions that relieve the Mg²⁺ block. QUIN alone is insufficient.',duration:10,state:state(0,0,0,0,.55),camera:'receptor',labels:['quin','nmda']},
      {key:'calcium-context',title:'Ca²⁺ · signaling and possible dysregulation',caption:'When channel requirements are met, Ca²⁺ can enter. Calcium signaling is not equivalent to injury; excessive or sustained activation can overwhelm regulation in an appropriate cellular context.',duration:10,state:state(0,0,0,.38,.75),camera:'receptor',labels:['nmda','calcium','spine']},
      {key:'potential-secondary-stress',title:'Possible secondary responses',caption:'In cellular models, sustained dysregulation can be associated with mitochondrial disruption and reactive signals, depending on intensity, duration and regulatory capacity.',duration:12,state:state(0,0,0,.8,.85,.60),camera:'mitochondria',labels:['mitochondria','calcium','ros']},
      {key:'quin-experimental-scope',title:'Two hours · acute exposure',caption:'The study assessed an acute 2-hour exposure. Duration and preparation are possible factors for interpretation; their temporal influence requires specific studies.',duration:12,state:state(0,0,0,.8,.85,.60),camera:'synapse',labels:['quin','spine','mitochondria']},
    ],
    content:{mitochondria,
      quin:entry('AGONIST IN CONTEXT','Quinolinic acid · QUIN','QUIN is a kynurenine pathway metabolite with NMDAR-associated excitotoxic potential in cellular and animal models. Its activity depends on conditions.','Locate the pale orange markers outside the membrane, beside the receptor.'),
      nmda:entry('POSTSYNAPTIC CHANNEL','NMDAR · conditional opening','Agonist activation requires a coagonist and voltage conditions that relieve the Mg²⁺ block.','Relate the extracellular ligand to the channel and subsequent Ca²⁺ passage.'),
      calcium:entry('INTRACELLULAR SIGNAL','Ca²⁺ · context dependent','Calcium entering through NMDAR participates in signaling. Intensity, duration and regulatory capacity condition possible injury responses.','Follow ions through the pore into the interior and proximal dendrite.'),
      ros:entry('SECONDARY POSSIBILITY','Reactive species · potential context','Mitochondrial disruption can relate to reactive signals in certain contexts. ROS also have physiological functions.','Locate the subtle signal around the dendritic mitochondrion.'),
      spine:entry('ILLUSTRATIVE ANATOMY','Dendritic spine','The neck connects the synaptic head to the dendrite. It remains as context for explaining the potential QUIN mechanism.','Trace its continuity into the segment containing the mitochondrion.'),
      dendrite:entry('NEURONAL CONTINUITY','Proximal dendrite','The mitochondrion occupies the dendritic shaft near the spine.','Compare mitochondrial location with the head and neck.','Dendritic mitochondria are distributed according to cellular needs and context.'),
      terminal:entry('PRESYNAPTIC REFERENCE','Presynaptic terminal','The terminal preserves the context of an organized connection for interpreting mechanisms described in the literature.','Identify its separation from the spine by the cleft.'),
      vesicles:entry('ANATOMICAL CONTEXT','Synaptic vesicles','Vesicles locate the presynaptic compartment in this anatomical reference.','Locate the small compartments inside the terminal.'),
      ampa:entry('CONTACT CONTEXT','AMPA · anatomical reference','AMPA receptors are part of this reference synapse. The illustrated QUIN mechanism focuses on NMDAR.','Distinguish blue AMPA from orange NMDAR.'),
    },
    async createScene(context){return (await import('../scene/evidence-environment.js')).createQuinEnvironment(context);},
  },
};

export function getEvidenceMechanism(id) {
  const definition=evidenceMechanisms[id];
  if(!definition)throw new RangeError(`Unknown evidence mechanism: ${id}`);
  return definition;
}
export default evidenceMechanisms;
