// Narrative controls are independent from age, assay, measured values and
// significance. These specimens illustrate literature, not homogenate images.
const state=(reaction=0,oxidation=0,inhibition=0,flux=0,activation=0,stress=0)=>({reaction,oxidation,inhibition,flux,activation,stress});
const modelNote='Ilustración científica de un mecanismo descrito en la literatura.';
const entry=(category,title,text,observe,note=modelNote)=>({category,title,text,observe,note});
const common={
  evidence:true,isolatedContext:true,resetOnExit:false,portraitFit:.90,
  initialState:state(),responseRates:{oxidation:.55,inhibition:.55,stress:.45,flux:.75},
};
const membrane=entry('ARQUITECTURA LIPÍDICA','Bicapa fosfolipídica','Las cabezas polares delimitan dos caras acuosas; sus cadenas hidrófobas ocupan el interior. Una región local puede cambiar su organización por oxidación.','Distingue ambas caras y las cadenas internas; compara la región destacada con el resto de la bicapa.','El corte anatómico permite observar las cadenas dentro de la bicapa.');
const mitochondria=entry('REFERENCIA SUBCELULAR','Mitocondria','El corte separa membrana externa, espacio intermembranal, membrana interna con crestas y matriz. Esta arquitectura sitúa las proteínas respiratorias.','Sigue la continuidad de las crestas con la membrana interna.','El corte anatómico facilita la lectura de los compartimentos y sus membranas.');

export const evidenceMechanisms={
  'e-control':{
    ...common,id:'e-control',title:'Control · referencia conceptual',navLabel:'Control',description:'Membrana y mitocondria como referencia para leer los mecanismos de exposición.',
    eyebrow:'EVIDENCIA · REFERENCIA ANATÓMICA',heading:['Una referencia','para comparar.'],scaleIndex:'E0',scaleLabel:'MODELO CONCEPTUAL',
    entryCamera:'reference',overviewCamera:'reference',
    cameraPoses:{reference:{position:[2.4,2.3,13.0],target:[0,.3,0]},organelle:{position:[2.0,1.8,11.8],target:[0,-.2,0]}},
    steps:[
      {key:'reference-membrane',title:'Organización de referencia',caption:'La bicapa muestra dos caras polares y cadenas hidrófobas internas. Esta referencia anatómica permite explorar los mecanismos de exposición.',duration:9,state:state(),camera:'reference',labels:['membrane','mitochondria']},
      {key:'reference-compartments',title:'Compartimentos e interpretación',caption:'El corte muestra membranas, crestas y matriz. Su organización sitúa los componentes que participan en el metabolismo energético.',duration:9,state:state(),camera:'organelle',labels:['mitochondria','membrane']},
    ],content:{membrane,mitochondria},
    async createScene(context){return (await import('../scene/evidence-environment.js')).createControlEnvironment(context);},
  },
  'e-feso4':{
    ...common,id:'e-feso4',title:'FeSO₄ · reactividad del hierro',navLabel:'FeSO₄',description:'Reacción local de Fenton y oxidación de cadenas lipídicas susceptibles.',
    eyebrow:'LITERATURA · FeSO₄',heading:['Hierro reactivo,','oxidación local.'],scaleIndex:'E1',scaleLabel:'INTERFAZ LIPÍDICA',portraitFit:.98,
    entryCamera:'bilayer',overviewCamera:'bilayer',
    cameraPoses:{bilayer:{position:[2.7,3.5,12.2],target:[-.4,.2,0]},reaction:{position:[-.7,2.65,7.2],target:[-2.1,.30,.32]},lipids:{position:[-.9,2.55,7.8],target:[-1.85,.13,.3]}},
    steps:[
      {key:'lipid-reference',title:'Una bicapa susceptible',caption:'Las cadenas poliinsaturadas forman parte de la bicapa. La región verde destaca un conjunto local susceptible a oxidación.',duration:8,state:state(),camera:'bilayer',labels:['membrane','pufa']},
      {key:'redox-substrates',title:'Hierro redox-activo y peróxido',caption:'Fe²⁺ y H₂O₂ se aproximan a una región lipídica. La disponibilidad del hierro y su entorno químico condicionan esta reactividad.',duration:9,state:state(.25),camera:'reaction',labels:['fe2','h2o2','pufa']},
      {key:'local-fenton',title:'Fenton · un encuentro local',caption:'Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + •OH. La elevada reactividad del radical hidroxilo favorece interacciones próximas a su lugar de formación.',duration:12,state:state(1),camera:'reaction',labels:['fe2','h2o2','hydroxyl','fe3'],labelPhases:[{after:0,labels:['fe2','h2o2']},{after:4,labels:['hydroxyl','fe3']}]},
      {key:'localized-lipid-oxidation',title:'Oxidación de una región lipídica',caption:'La iniciación local puede favorecer propagación y productos secundarios de oxidación. La región destacada cambia moderadamente; TBARS evalúa productos de oxidación lipídica.',duration:12,state:state(.6,1),camera:'lipids',labels:['pufa','lipidProducts','membrane']},
    ],
    content:{membrane,
      pufa:entry('CADENAS DE FOSFOLÍPIDOS','Ácidos grasos poliinsaturados','Las cadenas con varios dobles enlaces forman parte de fosfolípidos y pueden ser susceptibles a peroxidación. El relieve curvado diferencia un conjunto ilustrativo dentro de la bicapa.','Localiza las cadenas verdosas dentro de la región que se modifica.'),
      fe2:entry('HIERRO REDOX-ACTIVO','Fe²⁺ · hierro ferroso','El hierro ferroso disponible puede reaccionar con H₂O₂ y oxidarse a Fe³⁺. Su entorno, ligandos y disponibilidad influyen en la química resultante.','Sigue el pequeño centro azul grisáceo en el punto de encuentro.'),
      h2o2:entry('SUSTRATO REDOX','H₂O₂ · peróxido de hidrógeno','El peróxido de hidrógeno puede participar en reacciones con hierro redox-activo. Aquí se aproxima al mismo punto donde cambia el estado del hierro.','Compara su aproximación con la aparición de los productos.'),
      fe3:entry('PRODUCTO DE LA REACCIÓN','Fe³⁺ · hierro férrico','En la ecuación de Fenton, Fe²⁺ se oxida a Fe³⁺ mientras el peróxido se transforma. El cambio de color distingue estados de oxidación.','Busca el centro ocre en el mismo sitio antes ocupado por Fe²⁺.'),
      hydroxide:entry('PRODUCTO IÓNICO','OH⁻ · ion hidróxido','El ion hidróxido y el radical hidroxilo son especies diferentes en la ecuación ilustrada. El primero tiene carga negativa.','Distingue OH⁻, verde pálido, del breve marcador magenta de •OH.','OH⁻ no se presenta como un radical ni como la especie que inicia aquí la peroxidación.'),
      hydroxyl:entry('RADICAL · ENCUENTRO LOCAL','•OH · radical hidroxilo','Su elevada reactividad favorece interacciones próximas al lugar de formación. Puede iniciar oxidación en componentes susceptibles.','Observa su aparición breve junto a las cadenas, sin recorrer distancias extensas.'),
      lipidProducts:entry('PRODUCTOS CONCEPTUALES','Oxidación lipídica','La oxidación puede propagarse entre lípidos y producir diversas especies secundarias. Los marcadores ilustran ese contexto.','Compara el parche alterado con las regiones de membrana conservadas.','TBARS evalúa sustancias reactivas al ácido tiobarbitúrico asociadas con oxidación lipídica.'),
    },
    async createScene(context){return (await import('../scene/evidence-environment.js')).createIronEnvironment(context);},
  },
  'e-3np':{
    ...common,id:'e-3np',title:'3-NP · inhibición de SDH',navLabel:'3-NP',description:'Succinato deshidrogenasa, transferencia a ubiquinona e inhibición del complejo II.',
    eyebrow:'LITERATURA · 3-NP',heading:['Un punto del','metabolismo.'],scaleIndex:'E2',scaleLabel:'MEMBRANA INTERNA · MATRIZ',
    entryCamera:'mito',overviewCamera:'mito',
    cameraPoses:{mito:{position:[2.0,1.6,9.8],target:[0,-.10,0]},sdh:{position:[.6,1.4,7.2],target:[-.35,.04,.15]},inhibition:{position:[.75,1.4,7.4],target:[-.4,.03,.10]}},
    steps:[
      {key:'complex-ii-location',title:'SDH en la membrana interna',caption:'El complejo II está anclado en la membrana interna, con su dominio catalítico hacia la matriz. Otros complejos y ATP sintasa aportan contexto. El complejo II no bombea protones.',duration:9,state:state(),camera:'mito',labels:['mitochondria','sdh','atpSynthase']},
      {key:'succinate-electrons',title:'Succinato, fumarato y ubiquinona',caption:'SDH participa en la conversión de succinato a fumarato y transfiere electrones hacia ubiquinona (Q). Así conecta el ciclo de Krebs con la cadena respiratoria.',duration:11,state:state(0,0,0,1),camera:'sdh',labels:['succinate','sdh','fumarate','ubiquinone']},
      {key:'three-np-inhibition',title:'3-NP · inhibición de complejo II',caption:'El 3-NP puede inactivar SDH mediante un mecanismo dependiente de su procesamiento enzimático. La aproximación y el cambio de color ilustran esa inhibición.',duration:12,state:state(0,0,.85,1),camera:'inhibition',labels:['threeNP','sdh','electronFlow']},
      {key:'bioenergetic-context',title:'Flujo electrónico y capacidad reductora',caption:'La inhibición reduce el flujo asociado al complejo II y puede comprometer la bioenergética en determinados contextos. MTT evalúa la capacidad reductora de la preparación.',duration:11,state:state(0,0,1,1),camera:'mito',labels:['sdh','threeNP','atpSynthase']},
    ],
    content:{mitochondria,
      sdh:entry('COMPLEJO II · CICLO DE KREBS','Succinato deshidrogenasa','SDH oxida succinato a fumarato y transfiere electrones hacia ubiquinona. El dominio catalítico se orienta a la matriz y está unido a subunidades membranales.','Identifica la proteína verde unida a la membrana interna y el dominio que se proyecta hacia su interior.','El complejo II transfiere electrones a Q sin bombear protones.'),
      respiratory:entry('CONTEXTO RESPIRATORIO','Complejos I, III y IV','Otros complejos participan en la cadena respiratoria y el acoplamiento energético. Se mantienen como referencia espacial de la membrana interna.','Distingue los complejos secundarios azul grisáceos del complejo II destacado.'),
      atpSynthase:entry('CONTEXTO BIOENERGÉTICO','ATP sintasa','La ATP sintasa utiliza el gradiente electroquímico de protones para la síntesis de ATP. Su cabeza catalítica se orienta hacia la matriz.','Localiza la cabeza separada de la membrana por un tallo corto.'),
      succinate:entry('SUSTRATO EN LA MATRIZ','Succinato','El succinato es un intermediario del ciclo de Krebs y sustrato de SDH. Su oxidación se acopla a transferencia electrónica.','Sigue los pequeños marcadores desde la matriz al dominio catalítico.'),
      fumarate:entry('PRODUCTO EN LA MATRIZ','Fumarato','La oxidación de succinato produce fumarato. La escena separa sustrato y producto mediante posición y tono.','Observa la salida conceptual desde la región catalítica hacia la matriz.'),
      ubiquinone:entry('ACEPTOR EN LA MEMBRANA','Q · ubiquinona','La ubiquinona acepta electrones procedentes del complejo II dentro de la membrana interna; su forma reducida es ubiquinol.','Localiza los marcadores ocres junto al anclaje membranal.','El sistema Q/QH₂ participa en el transporte electrónico dentro de la membrana.'),
      electronFlow:entry('TRANSFERENCIA ELECTRÓNICA','Flujo electrónico asociado a SDH','Los pequeños marcadores pálidos conectan la región catalítica con Q. Disminuyen al aumentar la inhibición ilustrativa.','Compara la transferencia antes y durante la presencia de 3-NP.'),
      threeNP:entry('INHIBIDOR · MECANISMO ESTABLECIDO','Ácido 3-nitropropiónico','El 3-NP es un inhibidor dependiente de mecanismo de SDH. Estudios estructurales describen modificación de una arginina catalítica después de su procesamiento por complejo II.','Sigue su aproximación al dominio catalítico y la reducción de la transferencia ilustrada.'),
    },
    async createScene(context){return (await import('../scene/evidence-environment.js')).createThreeNPEnvironment(context);},
  },
  'e-quin':{
    ...common,id:'e-quin',title:'QUIN · potencial excitotóxico',navLabel:'QUIN',description:'Potencial de activación de NMDAR y respuestas dependientes del contexto celular.',
    eyebrow:'LITERATURA · QUIN',heading:['Potencial biológico,','contexto experimental.'],scaleIndex:'E3',scaleLabel:'SINAPSIS · MECANISMO POTENCIAL',portraitFit:.85,
    entryCamera:'synapse',overviewCamera:'synapse',
    cameraPoses:{synapse:{position:[2.3,.30,20.8],target:[.2,-1.35,0]},receptor:{position:[1.8,.8,12.8],target:[.15,-.3,.25]},mitochondria:{position:[2.3,-.10,18.7],target:[.75,-1.75,0]}},
    steps:[
      {key:'quin-extracellular',title:'QUIN en el entorno extracelular',caption:'El ácido quinolínico se sitúa fuera de la célula, próximo al dominio extracelular de NMDAR. La sinapsis ofrece una referencia anatómica para explorar este mecanismo.',duration:9,state:state(),camera:'synapse',labels:['quin','nmda','spine']},
      {key:'conditional-nmda',title:'Una activación condicionada',caption:'QUIN puede actuar como agonista de NMDAR. La apertura requiere también coagonistas y condiciones de voltaje que alivien el bloqueo por Mg²⁺. La presencia de QUIN no basta por sí sola.',duration:10,state:state(0,0,0,0,.55),camera:'receptor',labels:['quin','nmda']},
      {key:'calcium-context',title:'Ca²⁺ · señal y posible desregulación',caption:'Al cumplirse las condiciones del canal puede entrar Ca²⁺. Una señal de calcio no equivale a lesión; una activación excesiva o sostenida puede superar la regulación en un contexto celular apropiado.',duration:10,state:state(0,0,0,.38,.75),camera:'receptor',labels:['nmda','calcium','spine']},
      {key:'potential-secondary-stress',title:'Respuestas secundarias posibles',caption:'En modelos celulares, una desregulación sostenida puede asociarse con alteración mitocondrial y señales reactivas, según la intensidad, duración y capacidad reguladora.',duration:12,state:state(0,0,0,.8,.85,.60),camera:'mitochondria',labels:['mitochondria','calcium','ros']},
      {key:'quin-experimental-scope',title:'Dos horas · exposición aguda',caption:'El estudio evaluó una exposición aguda de 2 horas. La duración y la preparación son posibles factores de interpretación; su influencia temporal requiere estudios específicos.',duration:12,state:state(0,0,0,.8,.85,.60),camera:'synapse',labels:['quin','spine','mitochondria']},
    ],
    content:{mitochondria,
      quin:entry('AGONISTA EN CONTEXTO','Ácido quinolínico · QUIN','QUIN es un metabolito de la vía de las quinureninas con potencial excitotóxico asociado a NMDAR en modelos celulares y animales. Su actividad depende de las condiciones.','Localiza los marcadores magenta pálido fuera de la membrana, junto al receptor.'),
      nmda:entry('CANAL POSTSINÁPTICO','NMDAR · apertura condicionada','La activación por agonistas necesita coagonista y condiciones de voltaje que alivien el bloqueo por Mg²⁺.','Relaciona el ligando extracelular con el canal y el paso posterior de Ca²⁺.'),
      calcium:entry('SEÑAL INTRACELULAR','Ca²⁺ · contexto dependiente','El calcio que entra por NMDAR participa en señalización. La intensidad, duración y capacidad reguladora condicionan posibles respuestas de daño.','Sigue los iones a través del poro hacia el interior y la dendrita proximal.'),
      ros:entry('POSIBILIDAD SECUNDARIA','Especies reactivas · contexto potencial','La alteración mitocondrial puede relacionarse con señales reactivas en ciertos contextos. Las ROS también cumplen funciones fisiológicas.','Localiza la señal discreta alrededor de la mitocondria dendrítica.'),
      spine:entry('ANATOMÍA ILUSTRATIVA','Espina dendrítica','El cuello conecta la cabeza sináptica con la dendrita. Se conserva como contexto para explicar el potencial mecanismo de QUIN.','Sigue su continuidad hacia el segmento que contiene la mitocondria.'),
      dendrite:entry('CONTINUIDAD NEURONAL','Dendrita proximal','La mitocondria ocupa el eje dendrítico próximo a la espina.','Compara la localización mitocondrial con la cabeza y el cuello.','Las mitocondrias dendríticas se distribuyen según las necesidades y el contexto celular.'),
      terminal:entry('REFERENCIA PRESINÁPTICA','Terminal presináptica','La terminal conserva el contexto de una conexión organizada para interpretar los mecanismos de literatura.','Reconoce su separación de la espina por la hendidura.'),
      vesicles:entry('CONTEXTO ANATÓMICO','Vesículas sinápticas','Las vesículas sitúan el compartimento presináptico en esta referencia anatómica.','Localiza los pequeños compartimentos dentro de la terminal.'),
      ampa:entry('CONTEXTO DEL CONTACTO','AMPA · referencia anatómica','Los receptores AMPA forman parte de esta sinapsis de referencia. El mecanismo ilustrado de QUIN se centra en NMDAR.','Distingue AMPA, verde, de NMDAR, violeta.'),
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
