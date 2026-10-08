import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createAnatomy } from './anatomy.js';
import { createParticles } from './particles.js';
import { createActinNetwork } from './actin-network.js';
import { createMolecularPool, molecularGlyph } from './molecular-particles.js';
import { physical, organicLobe, v3 } from './geometry.js';

const BASE = { glut:.12, activation:.04, ca:0, stress:0, damage:0, local:0, intrinsic:0 };
const coreKeys = ['terminal','vesicles','glutamate','ampa','nmda','spine','dendrite','mitochondria'];
const keysFor = stage => [...coreKeys, ...(stage>=2?['calcium']:[]), ...(stage>=3?['ros']:[]),
  ...(stage===6?['caspases','actin']:[]), ...(stage===7?['cytochrome','apaf1','caspase9','executioners']:[])];
const clamp = n => THREE.MathUtils.clamp(Number.isFinite(n)?n:0,0,1);
// Local retraction is a separate possibility, never the first obligatory step
// of the neuronal intrinsic pathway. The neck/shaft remain fixed in both.
function retract(point, amount) {
  if (point.y >= 0) return point;
  const w=THREE.MathUtils.smoothstep(point.y,-2.25,-1.35)*amount;
  point.x*=1-.22*w;point.z*=1-.20*w;point.y-=.27*w;
  return point;
}

export function createGlutamateEnvironment({ texture } = {}) {
  const anatomy=createAnatomy({includeDendrite:true,proximalMito:true,texture});
  const {root}=anatomy; root.name='Glutamatergic proximal dendritic microdomain';
  const particles=createParticles(root,anatomy.nmdaChannels,anatomy.receptors,{rosOrigin:anatomy.mito.group.position,proximal:true});
  const transform=new THREE.Object3D(),cargoTransform=new THREE.Object3D();
  const actin=createActinNetwork({texture:anatomy.texture});root.add(actin.root);
  const selectable=[...anatomy.selectable,...particles.selectable,...actin.selectable];
  const labelAnchors=anatomy.labelAnchors;
  const anchor=(key,name,position,side='right')=>labelAnchors.push({key,name,position:v3(...position),side,priority:3});
  anchor('dendrite','Dendrita proximal',[3.45,-3.78,.25]);anchor('actin','F-actina',[-.7,-1.30,.25],'left');
  anchor('cytochrome','Citocromo c',[2.32,-3.45,.30]);anchor('apaf1','Apaf-1',[2.93,-3.60,.24]);
  anchor('caspase9','Caspasa-9',[3.27,-3.61,.23]);anchor('executioners','Caspasas ejecutoras',[3.63,-3.76,.23]);
  const anchorBases=labelAnchors.map(a=>a.position.clone());
  const actinGeometry=actin.selectable[0].geometry;
  const surfaces=[...new Set(anatomy.spineSurfaces),actinGeometry].map(geometry=>({geometry,base:geometry.attributes.position.array.slice()}));
  const postZoneBase=anatomy.postZone.position.clone(), postZoneScale=anatomy.postZone.scale.clone();
  const receptorBases=anatomy.receptors.map(r=>r.group.position.clone());
  const caspaseBases=anatomy.caspases.children.map(child=>child.position.clone());
  const cytochrome=createMolecularPool(root,{key:'cytochrome',capacity:6,geometry:molecularGlyph('single',.030),material:physical(0xd1ad85,{roughness:.76})});
  selectable.push(cytochrome.mesh);
  function complex(key,position,ring=false){
    const parts=[];
    for(let i=0;i<(ring?7:4);i++){
      const g=organicLobe(70+i),a=i/7*Math.PI*2;
      g.scale(ring?.068:.06,ring?.05:.036,.042);
      g.rotateZ(ring?a:i*.8);
      g.translate(ring?Math.cos(a)*.118:(i%2-.5)*.084,ring?Math.sin(a)*.118:(Math.floor(i/2)-.5)*.054,Math.sin(i)*.012);parts.push(g);
    }
    const geometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());
    const material=physical(ring?0x9eb0ad:0xb787a2,{roughness:.78,emissive:0x654452,emissiveIntensity:.025});
    const mesh=new THREE.Mesh(geometry,material);mesh.position.copy(position);mesh.userData.key=key;mesh.name=key;root.add(mesh);selectable.push(mesh);return mesh;
  }
  const apaf=complex('apaf1',v3(2.93,-3.60,.23),true);
  const casp9=complex('caspase9',v3(3.26,-3.61,.22));
  const executioners=complex('executioners',v3(3.62,-3.76,.23));
  anatomy.mito.group.updateMatrix();
  // Cyt c begins between the outer and inner membrane, not in the matrix.
  const cytoStart=anatomy.mito.surface(.70,.025,.035).applyMatrix4(anatomy.mito.group.matrix);
  let currentStage=0,lastRetraction=NaN,localAmount=0,intrinsicAmount=0;
  function update({time=0,state=BASE,stepIndex=0,elapsed=0,selected=null,detail=true}={}) {
    currentStage=THREE.MathUtils.clamp(stepIndex,0,7);
    localAmount=currentStage===6?clamp(state.local):0;
    intrinsicAmount=currentStage===7?clamp(state.intrinsic):0;
    // The session's state interpolation also handles the handoff to the other
    // illustrative possibility. The head must not pop back at the boundary.
    // Seeking stage 7 still restores its own basal reference immediately.
    const amount=clamp(state.local)*clamp(state.damage);
    if(amount!==lastRetraction){
      const point=new THREE.Vector3();
      for(const {geometry,base} of surfaces){const p=geometry.attributes.position;for(let i=0;i<p.count;i++){retract(point.fromArray(base,i*3),amount);p.setXYZ(i,point.x,point.y,point.z);}p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();}
      anatomy.postZone.position.copy(retract(postZoneBase.clone(),amount));
      anatomy.postZone.scale.copy(postZoneScale).multiply(v3(1-.22*amount,1,1-.20*amount));
      anatomy.receptors.forEach((r,i)=>r.group.position.copy(retract(receptorBases[i].clone(),amount)));
      anatomy.nmdaChannels.forEach((c,i)=>c.copy(anatomy.receptors.filter(r=>r.kind==='nmda')[i].group.position));
      anatomy.caspases.children.forEach((child,i)=>child.position.copy(retract(caspaseBases[i].clone(),amount)));
      labelAnchors.forEach((a,i)=>a.position.copy(['spine','actin','caspases','ampa','nmda','calcium'].includes(a.key)?retract(anchorBases[i].clone(),amount):anchorBases[i]));
      lastRetraction=amount;
    }
    particles.update(time,state,selected);
    // The ROS pool follows the shaft organelle; head ions stay near their pore.
    particles.glutamate.visible=detail&&currentStage<6;particles.ros.visible=detail&&state.stress>.015;
    particles.calcium.visible=detail&&currentStage>=2&&currentStage<6;
    particles.sodium.visible=detail&&currentStage>=1&&currentStage<6;
    actin.root.visible=detail&&currentStage===6;
    anatomy.vesicleSeeds.forEach((seed,i)=>{
      transform.position.copy(seed.position);transform.position.y+=Math.sin(time*.55+seed.phase)*.008;
      if(i<5)transform.position.y-=.04*(.5+.5*Math.sin(time*1.2+seed.phase))*state.glut;
      transform.scale.setScalar(seed.radius);transform.updateMatrix();anatomy.vesicles.setMatrixAt(i,transform.matrix);
      for(let j=0;j<4;j++){cargoTransform.position.copy(transform.position).add(v3(Math.sin(j*2.4)*.05,Math.cos(j*1.5)*.04,Math.cos(j*2.4)*.05));cargoTransform.updateMatrix();anatomy.cargo.setMatrixAt(i*4+j,cargoTransform.matrix);}
    });
    anatomy.vesicles.instanceMatrix.needsUpdate=true;anatomy.vesicles.computeBoundingSphere();anatomy.cargo.instanceMatrix.needsUpdate=true;
    for(const r of anatomy.receptors){const active=r.kind==='ampa'?currentStage>=1:currentStage>=2;r.material.emissiveIntensity=.025+(active?state.activation*.08:0)+(selected===r.kind?.12:0);}
    anatomy.mito.update(state.stress||0,selected==='mitochondria');
    anatomy.caspases.visible=detail&&localAmount>.01;anatomy.casMat.opacity=.86;anatomy.casMat.roughness=.76;anatomy.casMat.emissiveIntensity=selected==='caspases'?.18:.06;
    // Three short, staged cytosolic relationships. The educational section stays
    // open throughout; release indicates possible outer-membrane permeabilisation.
    const release=currentStage===7?THREE.MathUtils.smoothstep(elapsed,0,4):0;
    cytochrome.update(intrinsicAmount>.01?6:0,(i,obj)=>{
      const t=release*(.25+(i+1)/8);
      obj.position.copy(cytoStart).lerp(v3(2.72,-3.57+(i%2)*.055,.24),t);
      obj.position.y+=Math.sin(t*Math.PI)*.09;
    });
    for(const [mesh,threshold] of [[apaf,2],[casp9,4],[executioners,6]]){
      mesh.visible=detail&&intrinsicAmount>.01;
      mesh.material.emissiveIntensity=.015+THREE.MathUtils.smoothstep(elapsed,threshold,threshold+2)*.11+(selected===mesh.userData.key?.12:0);
    }
    root.updateMatrixWorld(true);
  }
  update();
  return {root,selectable,labelAnchors,initialState:{...BASE},update,visibleKeys:keysFor,
    diagnostics:()=>({stage:currentStage,local:localAmount,intrinsic:intrinsicAmount,headRadialScale:1-.22*lastRetraction,
      mitochondria:anatomy.mito.group.position.toArray(),mitochondrialScale:anatomy.mito.group.scale.x,
      cytochromeOrigin:cytoStart.toArray(),caspasesVisible:anatomy.caspases.visible,cytochromeCount:cytochrome.mesh.count,
      intrinsicVisible:[apaf,casp9,executioners].every(m=>m.visible),channel:anatomy.nmdaChannels[0].toArray()})};
}
