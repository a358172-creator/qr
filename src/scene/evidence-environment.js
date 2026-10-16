import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createBilayer, membraneHeight } from './mitochondrial-environment.js';
import { createMitochondrialOrganelle } from './mitochondrial-organelle.js';
import { createGlutamateEnvironment } from './glutamate-environment.js';
import { createMolecularPool, molecularGlyph } from './molecular-particles.js';
import { organicLobe, physical, v3 } from './geometry.js';

const bounded=value=>THREE.MathUtils.clamp(Number.isFinite(value)?value:0,0,1);
const fract=value=>value-Math.floor(value);
const clock=value=>Number.isFinite(value)?value:0;
const stages=(index,count)=>THREE.MathUtils.clamp(index|0,0,count-1);
const merge=parts=>{const geometry=mergeGeometries(parts);parts.forEach(part=>part.dispose());return geometry;};
const label=(key,name,position,side='left')=>({key,name,position:position.clone(),side,priority:3});
function particle(root,key,color,kind='single',capacity=5,radius=.045) {
  return createMolecularPool(root,{key,capacity,geometry:molecularGlyph(kind,radius),material:physical(color,{roughness:.72,clearcoat:.02,emissive:color,emissiveIntensity:.035})});
}
function selectMaterial(material,selected){material.emissiveIntensity=selected?.16:.025;}

/** Reference anatomy, never an inferred reconstruction of homogenized tissue. */
export function createControlEnvironment({texture}={}) {
  const root=new THREE.Group();root.name='Experimental evidence anatomical reference';
  const membrane=createBilayer(texture,{holes:[]});membrane.group.scale.setScalar(.74);membrane.group.position.y=.12;root.add(membrane.group);
  const mito=createMitochondrialOrganelle(texture);mito.group.position.set(.12,-.68,0);root.add(mito.group);
  const labelAnchors=[label('membrane','Reference bilayer',v3(-1.8,1.92,.45)),label('mitochondria','Reference mitochondrion',v3(.65,-1.0,.4),'right')];
  let stage=0;
  function update({stepIndex=0,selected=null}={}) {
    stage=stages(stepIndex,2);membrane.update(0,selected==='membrane');mito.update(0,selected==='mitochondria');root.updateMatrixWorld(true);
  }
  update();
  return {root,selectable:[membrane.group,mito.group],labelAnchors,update,visibleKeys:()=>['membrane','mitochondria'],
    diagnostics:()=>({stage,oxidation:0,stress:0,membrane:membrane.diagnostics(),ageDependentGeometry:false})};
}

/** A local iron reaction uses the same bilayer as D without receptor holes. */
export function createIronEnvironment({texture}={}) {
  const root=new THREE.Group();root.name='Iron redox and local lipid oxidation';
  const membrane=createBilayer(texture,{holes:[]});membrane.group.position.y=-2.2;root.add(membrane.group);
  // Show acyl chains through the two thin section sheets. This is an optical
  // teaching section, not membrane rupture or loss of an entire bilayer.
  for(const child of membrane.group.children.slice(0,2)) {child.material.transparent=true;child.material.opacity=.38;child.material.depthWrite=false;}
  const at=(x,z,offset=0)=>v3(x,membraneHeight(x,z)-2.2+offset,z);
  const reaction=at(-2.44,.30,.19),parts=[];
  for(let index=0;index<4;index++) {
    const x=-2.72+index*.17,z=.24+(index%2)*.18;
    const points=Array.from({length:7},(_,i)=>at(x+(i%2?.018:-.018),z+Math.sin(i*1.9)*.025,.085-i*.025));
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),18,.015,6,false));
  }
  const pufa=new THREE.Mesh(merge(parts),physical(0x6D9FC3,{roughness:.78,clearcoat:.01,emissive:0x6D9FC3,emissiveIntensity:.035}));
  pufa.name='Illustrative polyunsaturated acyl chains';pufa.userData.key='pufa';root.add(pufa);
  const ferrous=particle(root,'fe2',0x6D9FC3,'single',3,.065);
  const peroxide=particle(root,'h2o2',0xE5D8BE,'double',3,.052);
  const ferric=particle(root,'fe3',0xE5D8BE,'single',3,.062);
  const hydroxide=particle(root,'hydroxide',0x6D9FC3,'double',3,.033);
  const hydroxyl=particle(root,'hydroxyl',0xE88A38,'double',3,.035);
  const products=particle(root,'lipidProducts',0xE88A38,'cluster',4,.032);
  const pools={fe2:ferrous,h2o2:peroxide,fe3:ferric,hydroxide,hydroxyl,lipidProducts:products};
  const labelAnchors=[label('membrane','Phospholipid bilayer',at(1.42,.5,.18),'right'),label('pufa','Polyunsaturated chains',at(-2.4,.42,-.04)),
    label('fe2','Fe²⁺',reaction.clone().add(v3(-.2,.24,0))),label('h2o2','H₂O₂',reaction.clone().add(v3(.46,.26,.06)),'right'),
    label('fe3','Fe³⁺',reaction.clone().add(v3(.05,.04,0))),label('hydroxide','OH⁻',reaction.clone().add(v3(.27,.10,.04)),'right'),
    label('hydroxyl','•OH · local reaction',reaction.clone().add(v3(0,-.09,.06))),label('lipidProducts','Lipid products · schematic',at(-2.1,.40,.19),'right')];
  const keys=[['membrane','pufa'],['membrane','pufa','fe2','h2o2'],['membrane','pufa','fe2','h2o2','fe3','hydroxide','hydroxyl'],['membrane','pufa','fe2','h2o2','fe3','hydroxide','hydroxyl','lipidProducts']];
  let stage=0,oxidation=0;
  const site=i=>reaction.clone().add(v3((i-1)*.14,0,(i%2)*.12));
  function update({time=0,state={},stepIndex=0,elapsed=0,selected=null}={}) {
    stage=stages(stepIndex,4);time=clock(time);elapsed=clock(elapsed);oxidation=stage===3?bounded(state.oxidation)*.72:0;
    membrane.update(oxidation,selected==='membrane');selectMaterial(pufa.material,selected==='pufa');
    pufa.material.color.set(0x6D9FC3).lerp(new THREE.Color(0xE88A38),oxidation*.85);
    const phase=i=>stage<2?.05+.42*THREE.MathUtils.smoothstep(elapsed,0,8):fract(elapsed*.14+i*.29+.59);
    ferrous.update(stage>=1?3:0,(i,o)=>{const q=phase(i);o.position.copy(site(i));o.scale.setScalar(q<.53?1:.00001);});
    peroxide.update(stage>=1?3:0,(i,o)=>{const q=phase(i);o.position.copy(site(i)).add(v3((1-Math.min(1,q/.53))*.47,.13*(1-Math.min(1,q/.53)),.03));o.scale.setScalar(q<.53?1:.00001);});
    ferric.update(stage>=2?3:0,(i,o)=>{o.position.copy(site(i));o.scale.setScalar(phase(i)>=.53?1:.00001);});
    hydroxide.update(stage>=2?3:0,(i,o)=>{const q=phase(i),t=Math.max(0,(q-.53)/.47);o.position.copy(site(i)).add(v3(t*.25,t*.10,.04));o.scale.setScalar(q>=.53?.8:.00001);});
    hydroxyl.update(stage>=2?3:0,(i,o)=>{
      const q=phase(i),t=THREE.MathUtils.clamp((q-.53)/.14,0,1);
      // A short local encounter, less than 0.2 scene units. Never a cloud of
      // long-lived hydroxyl radicals travelling throughout the specimen.
      o.position.copy(site(i)).add(v3(.025*Math.sin(t*Math.PI),-.15*t,.035*t));
      o.scale.setScalar(q>=.53&&q<.67?.85*Math.sin(t*Math.PI):.00001);
    });
    products.update(stage===3?4:0,(i,o)=>{o.position.copy(at(-2.74+i*.20,.32+(i%2)*.10,.13));o.scale.setScalar(.5+oxidation*.6);o.rotation.set(.2,i*.8,0);});
    for(const [key,pool] of Object.entries(pools))selectMaterial(pool.mesh.material,selected===key);
    root.updateMatrixWorld(true);
  }
  update();
  return {root,selectable:[membrane.group,pufa,...Object.values(pools).map(pool=>pool.mesh)],labelAnchors,update,
    visibleKeys:index=>keys[stages(index,4)],diagnostics:()=>({stage,oxidation,reaction:reaction.toArray(),reactionSites:[0,1,2].map(i=>site(i).toArray()),radicalRange:.16,membrane:membrane.diagnostics(),
      particles:Object.fromEntries(Object.entries(pools).map(([key,pool])=>[key,pool.mesh.count])),ageDependentGeometry:false})};
}

function complex(key,domains,color,seed=30) {
  const parts=domains.map(([x,y,z,sx,sy,sz],i)=>{const g=organicLobe(seed+i*5);g.scale(sx,sy,sz);g.rotateZ(Math.sin(i*1.7)*.2);g.translate(x,y,z);return g;});
  const material=physical(color,{roughness:.76,clearcoat:.015,emissive:color,emissiveIntensity:.025});
  const mesh=new THREE.Mesh(merge(parts),material);mesh.name=key;mesh.userData.key=key;return mesh;
}

export function createThreeNPEnvironment({texture}={}) {
  const root=new THREE.Group();root.name='Complex II inhibition in a mitochondrial teaching section';
  const mito=createMitochondrialOrganelle(texture);root.add(mito.group);
  // y of each protein's local frame points toward matrix, while its short
  // membrane domain remains centred on the actual continuous inner surface.
  function attach(mesh,u,v=.025) {
    const anchor=mito.innerSurface(u,v),towardMatrix=v3(0,-anchor.y+.05,-anchor.z).normalize();
    mesh.position.copy(anchor);mesh.quaternion.setFromUnitVectors(v3(0,1,0),towardMatrix);root.add(mesh);
    return {anchor,towardMatrix};
  }
  const sdh=complex('sdh',[[0,-.015,0,.13,.12,.095],[-.075,.18,0,.12,.16,.10],[.08,.34,.015,.16,.14,.12],[-.08,.43,-.015,.11,.085,.09]],0x6D9FC3);
  const {anchor:sdhAnchor,towardMatrix}=attach(sdh,.42);
  const context=[];
  for(const [u,size] of [[.16,.78],[.63,.86],[.82,.62]]) {
    const item=complex('respiratory',[[0,0,0,.13,.11,.10],[.02,.21,.01,.14,.18,.12],[-.12,.30,.01,.085,.08,.09]],0x454B50,Math.round(u*100));
    item.scale.setScalar(size);attach(item,u);context.push(item);
  }
  const synthase=complex('atpSynthase',[[0,0,0,.13,.12,.12],[0,.18,0,.037,.14,.037],[-.095,.36,0,.13,.12,.11],[.09,.36,.01,.13,.12,.11],[0,.40,.095,.10,.10,.095]],0xE5D8BE,94);
  attach(synthase,.72,.965);
  const activeSite=sdhAnchor.clone().addScaledVector(towardMatrix,.34);
  const matrixStart=activeSite.clone().add(v3(-.55,-.06,-.05));
  const qSite=mito.innerSurface(.49,.035);
  const succinate=particle(root,'succinate',0xE88A38,'double',4,.040);
  const fumarate=particle(root,'fumarate',0xE5D8BE,'double',4,.037);
  const quinone=particle(root,'ubiquinone',0xE5D8BE,'cluster',3,.035);
  const electron=particle(root,'electronFlow',0xFAF8F2,'single',4,.021);
  const inhibitor=particle(root,'threeNP',0xE88A38,'filament',3,.061);
  const pools={succinate,fumarate,ubiquinone:quinone,electronFlow:electron,threeNP:inhibitor};
  const labelAnchors=[label('mitochondria','Membranes and cristae',v3(-1.70,-.40,.35)),label('sdh','SDH · complex II',activeSite,'right'),
    label('respiratory','Complexes I, III and IV · context',mito.innerSurface(.18,.025)),label('atpSynthase','ATP synthase · context',synthase.position.clone(),'right'),
    label('succinate','Succinate · matrix',matrixStart),label('fumarate','Fumarate · matrix',activeSite.clone().add(v3(.32,-.07,-.05)),'right'),
    label('ubiquinone','Q · ubiquinone',qSite.clone(),'right'),label('electronFlow','Electron transfer',qSite.clone().lerp(activeSite,.5)),
    label('threeNP','3-NP',matrixStart.clone().add(v3(.12,-.15,.08)))];
  const common=['mitochondria','sdh','respiratory','atpSynthase'];
  const keys=[common,[...common,'succinate','fumarate','ubiquinone','electronFlow'],[...common,'succinate','fumarate','ubiquinone','electronFlow','threeNP'],[...common,'ubiquinone','threeNP']];
  const basal=sdh.material.color.clone(),inhibited=new THREE.Color(0xE88A38);
  let stage=0,inhibition=0,flux=0;
  function update({time=0,state={},stepIndex=0,selected=null}={}) {
    stage=stages(stepIndex,4);time=clock(time);inhibition=stage>=2?bounded(state.inhibition):0;
    flux=stage>=1?bounded(state.flux)*(1-inhibition):0;
    mito.update(0,selected==='mitochondria');sdh.material.color.copy(basal).lerp(inhibited,inhibition*.72);
    for(const object of [sdh,synthase,...context])selectMaterial(object.material,selected===object.userData.key);
    const count=Math.round(flux*4);
    succinate.update(count,(i,o)=>{const q=fract(time*.17+i*.25),t=Math.min(1,q/.55);o.position.copy(matrixStart).lerp(activeSite,t);o.scale.setScalar(q<.55?.8:.00001);});
    fumarate.update(count,(i,o)=>{const q=fract(time*.17+i*.25),t=Math.max(0,(q-.55)/.45);o.position.copy(activeSite).add(v3(t*.37,-t*.10,-t*.05));o.scale.setScalar(q>=.55?.8:.00001);});
    quinone.update(stage>=1?3:0,(i,o)=>{o.position.copy(qSite).add(v3(i*.08,0,-i*.015));o.scale.setScalar(.8);});
    electron.update(count,(i,o)=>{const q=fract(time*.17+i*.25),t=Math.max(0,(q-.55)/.45);o.position.copy(activeSite).lerp(qSite,t);o.scale.setScalar(q>=.55?.7:.00001);});
    inhibitor.update(stage>=2?3:0,(i,o)=>{
      const progress=bounded(state.inhibition),start=matrixStart.clone().add(v3(.12,-.13+i*.07,.08));
      o.position.copy(start).lerp(activeSite.clone().add(v3((i-1)*.025,0,.03)),progress);o.rotation.set(.2,i*.6,.3);o.scale.setScalar(.75);
    });
    for(const [key,pool] of Object.entries(pools))selectMaterial(pool.mesh.material,selected===key);
    root.updateMatrixWorld(true);
  }
  update();
  return {root,selectable:[mito.group,sdh,synthase,...context,...Object.values(pools).map(pool=>pool.mesh)],labelAnchors,update,
    visibleKeys:index=>keys[stages(index,4)],diagnostics:()=>({stage,inhibition,flux,sdhAnchor:sdhAnchor.toArray(),activeSite:activeSite.toArray(),
      matrixDirection:towardMatrix.toArray(),qSite:qSite.toArray(),protonPumpAtComplexII:false,ageDependentGeometry:false,
      particles:Object.fromEntries(Object.entries(pools).map(([key,pool])=>[key,pool.mesh.count]))})};
}

/** QUIN receives its own B specimen and clock. No original atlas session is
 * mutated, and neither caspases nor a neuronal death outcome enter this view. */
export function createQuinEnvironment({texture}={}) {
  const base=createGlutamateEnvironment({texture}),root=base.root;
  root.name='QUIN potential mechanism, independent of homogenate observations';
  const quin=particle(root,'quin',0xE88A38,'quinolinate',7,.068);
  const allowed=new Set(['terminal','vesicles','ampa','nmda','spine','dendrite','mitochondria','calcium','ros']);
  const selectable=base.selectable.filter(object=>allowed.has(object.userData.key));selectable.push(quin.mesh);
  const labelAnchors=base.labelAnchors.filter(anchor=>allowed.has(anchor.key));labelAnchors.push(label('quin','QUIN · extracellular',v3(-.25,.58,.60),'right'));
  const common=['terminal','vesicles','ampa','nmda','spine','dendrite','mitochondria','quin'];
  const keys=[common,common,[...common,'calcium'],[...common,'calcium','ros'],[...common,'calcium','ros']];
  let stage=0,calcium=0,stress=0;
  function update({time=0,state={},stepIndex=0,elapsed=0,selected=null,detail=true}={}) {
    stage=stages(stepIndex,5);time=clock(time);
    calcium=stage>=2?bounded(state.flux):0;stress=stage>=3?bounded(state.stress):0;
    base.update({time,elapsed,selected,detail,stepIndex:stage>=3?5:stage>=1?2:0,
      state:{glut:0,activation:stage>=1?bounded(state.activation):0,ca:calcium,stress,damage:0,local:0,intrinsic:0}});
    for(const object of base.selectable) {
      const key=object.userData.key;
      if(!allowed.has(key)||(key==='ampa'&&object.isInstancedMesh)||(key==='calcium'&&calcium===0))object.visible=false;
      if(key==='ampa'&&!object.isInstancedMesh)object.traverse(child=>{if(child.material)child.material.emissiveIntensity=.025;});
    }
    const channel=new THREE.Vector3(...base.diagnostics().channel);
    quin.update(detail?7:0,(i,o)=>{
      const t=fract(time*.11+i*.143),start=v3(-.75+(i%3)*.42,.68+(i%2)*.09,.30+(i%2)*.20);
      // Ligands remain extracellular, close to the receptor ectodomain; they
      // never travel through its ion pore with the calcium particles.
      o.position.copy(start).lerp(v3(channel.x+(i%2?.15:-.15),channel.y+.37,channel.z),t);
      o.rotation.set(.18,i*.8,t*.5);o.scale.setScalar(.68);
    });
    selectMaterial(quin.mesh.material,selected==='quin');root.updateMatrixWorld(true);
  }
  update();
  return {root,selectable,labelAnchors,update,visibleKeys:index=>keys[stages(index,5)],diagnostics:()=>({stage,calcium,stress,potentialOnly:true,
    ageDependentGeometry:false,apoptosis:false,quinCount:quin.mesh.count,base:base.diagnostics()})};
}
