import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createPlasticityEnvironment } from '../src/scene/plasticity-environment.js';

const specimen=createPlasticityEnvironment({texture:new THREE.Texture()});
const named=name=>specimen.root.getObjectByName(name);
const membrane=named('Continuous mushroom membrane');
const complete={glut:.8,activation:.7,ca:.7,scaffold:1,disc1:1,kalirin:1,remodeling:1};
function frame(stage=0,remodeling=0,time=0,extra={}) {
  specimen.update({stepIndex:stage,time,state:{...complete,remodeling},elapsed:6,...extra});
  return specimen.diagnostics();
}
function snapshot() {
  const values=[];
  specimen.root.traverse(object=>{
    values.push(object.name,object.visible,object.position.toArray(),object.scale.toArray(),object.rotation.toArray());
    if(object.geometry) values.push(Array.from(object.geometry.attributes.position.array));
    if(object.isInstancedMesh) values.push(object.count,Array.from(object.instanceMatrix.array));
  });
  return values;
}

test('plasticity microdomain uses finite indexed geometry with a bounded rendering budget',()=>{
  // Include fully occupied particle pools, not just an empty final overview.
  frame(1,0,12,{state:{...complete,glut:1,ca:1}});
  let meshCount=0,triangles=0;
  specimen.root.traverse(object=>{
    if(!object.geometry) return;
    meshCount++;
    for(const [name,attribute] of Object.entries(object.geometry.attributes)) assert.ok(attribute.array.every(Number.isFinite),`${object.name}: ${name}`);
    for(const vertex of object.geometry.index?.array??[]) assert.ok(vertex>=0&&vertex<object.geometry.attributes.position.count);
    triangles+=(object.geometry.index?.count??object.geometry.attributes.position.count)/3*(object.isInstancedMesh?object.count:1);
  });
  assert.ok(meshCount<25,`only ${meshCount} meshes, with filaments merged and particles instanced`);
  assert.ok(triangles<120000,`${triangles} rendered triangles`);
  const keys=specimen.selectable.map(object=>object.userData.key);
  for(const key of ['nmda','calcium','psd95','disc1','kalirin7','actin','spine','psd']) assert.ok(keys.includes(key),key);
  for(const key of ['ros','caspases','mitochondria','microglia']) assert.ok(!keys.includes(key),`${key} does not belong to physiological plasticity`);
});

test('presynaptic cutaway exposes a selectable tissue wall behind its vesicles, not an empty outline',()=>{
  frame();
  const ray=new THREE.Raycaster(new THREE.Vector3(0,1.7,4),new THREE.Vector3(0,0,-1));
  const outer=named('Contextual presynaptic terminal');
  assert.equal(ray.intersectObject(outer).length,0,'the anterior inspection opening remains genuinely cut away');
  const hits=ray.intersectObjects(specimen.selectable).filter(hit=>hit.object.userData.key==='terminal');
  assert.ok(hits.length>0,'the exposed terminal interior supports direct structure selection');
  assert.ok(hits.every(hit=>hit.point.z<-.8),'its far wall sits behind the vesicle compartment');
  const inner=named('Inner presynaptic membrane'),normalOpacity=inner.material.opacity;
  frame(0,0,0,{selected:'actin'});
  assert.ok(inner.material.opacity<normalOpacity,'actin focus dims the complete presynaptic compartment');
  frame();assert.equal(inner.material.opacity,normalOpacity);
});

test('closed dendritic shaft uses outward normals and a single translucent surface',()=>{
  const shaft=named('Supporting dendritic shaft'),positions=shaft.geometry.attributes.position,normals=shaft.geometry.attributes.normal,uv=shaft.geometry.attributes.uv;
  assert.equal(shaft.material.side,THREE.FrontSide,'opposing transparent faces must not form striping');
  const rings=new Map();
  for(let i=0;i<positions.count;i++) {
    const u=uv.getY(i);
    if(!rings.has(u)) rings.set(u,{sum:new THREE.Vector3(),count:0});
    // The repeated seam vertex is excluded from the ring centre.
    if(uv.getX(i)<1) { rings.get(u).sum.add(new THREE.Vector3().fromBufferAttribute(positions,i));rings.get(u).count++; }
  }
  for(const ring of rings.values()) ring.sum.divideScalar(ring.count);
  for(let i=0;i<positions.count;i++) {
    const radial=new THREE.Vector3().fromBufferAttribute(positions,i).sub(rings.get(uv.getY(i)).sum).normalize();
    const normal=new THREE.Vector3().fromBufferAttribute(normals,i);
    assert.ok(radial.dot(normal)>.90,'the visible side of a closed organic shaft faces outward');
  }
});

test('mushroom membrane has a continuous broad head and narrow immobile neck with small reversible growth',()=>{
  frame();
  const original=membrane.geometry.attributes.position.array.slice();
  const neck=[],head=[];
  for(let i=0;i<original.length;i+=3) {
    if(original[i+1]>-2.8&&original[i+1]<-2.5) neck.push(original[i]);
    if(original[i+1]>-1.1&&original[i+1]<-.7) head.push(original[i]);
  }
  assert.ok(Math.max(...head)-Math.min(...head)>(Math.max(...neck)-Math.min(...neck))*4,'organic mushroom proportion');
  let previous=1;
  for(const amount of [.2,.4,.6,.8,1]) {
    const data=frame(4,amount,40);
    assert.ok(data.headRadialScale>previous&&data.headRadialScale<=1.1);previous=data.headRadialScale;
    const positions=membrane.geometry.attributes.position.array;
    for(let i=0;i<original.length;i+=3) {
      if(original[i+1]<=-2.1) assert.deepEqual(Array.from(positions.slice(i,i+3)),Array.from(original.slice(i,i+3)),'neck and attachment never scale');
      else {
        assert.ok(Math.abs(positions[i]-original[i])<.20);
        assert.ok(Math.abs(positions[i+1]-original[i+1])<.041);
        assert.ok(Math.abs(positions[i+2]-original[i+2])<.16);
      }
    }
  }
  frame();assert.deepEqual(membrane.geometry.attributes.position.array,original,'seeking the first stage exactly restores the basal surface');
});

test('protein proximity forms an intracellular architecture without moving them along a molecular chain',()=>{
  const baseline=frame(2),[px,py,pz]=baseline.proteins.psd95;
  assert.ok(Math.hypot(px-baseline.channel[0],py-baseline.channel[1],pz-baseline.channel[2])<.6,'PSD-95 resides near the channel');
  assert.ok(py<baseline.channel[1]&&py>-.65,'PSD-95 lies just beneath the membrane');
  assert.ok(baseline.proteins.disc1[1]<py-.3,'DISC1 is deeper in the head');
  assert.ok(baseline.proteins.kalirin7[1]<baseline.proteins.disc1[1],'Kalirin-7 is near the actin-rich region');
  for(const index of [0,1,2,3]) assert.deepEqual(frame(index).proteins,baseline.proteins,'stage emphasis does not transport proteins');
  const psd=named('Porous postsynaptic protein scaffold');psd.geometry.computeBoundingBox();
  assert.ok(psd.geometry.boundingBox.max.y-psd.geometry.boundingBox.min.y>.20,'density is a mesh with depth, never a planar plate');
  frame(2,0,22,{elapsed:1});const early=named('DISC1 structural complex').material.emissiveIntensity;
  frame(2,0,26,{elapsed:6});assert.ok(named('DISC1 structural complex').material.emissiveIntensity>early,'DISC1 emphasis follows the initial PSD-95 focus');
});

test('controlled calcium crosses only the NMDAR pore and stays within a small physiological pool',()=>{
  const pool=named('particles:calcium'),matrix=new THREE.Matrix4(),ion=new THREE.Vector3();let crossings=0;
  for(let time=0;time<20;time+=.25) {
    const data=frame(1,0,time),channel=new THREE.Vector3(...data.channel);
    assert.ok(pool.count>0&&pool.count<=8);
    for(let i=0;i<pool.count;i++) {
      pool.getMatrixAt(i,matrix);ion.setFromMatrixPosition(matrix);
      if(Math.abs(ion.y-channel.y)<.15) {
        assert.ok(Math.hypot(ion.x-channel.x,ion.z-channel.z)<1e-6,'every membrane crossing remains on the channel axis');crossings++;
      }
    }
  }
  assert.ok(crossings>50,'many independent ion passages are checked');
  frame(0,1,14);assert.equal(pool.count,0,'stale activation cannot contaminate the reset state');
  assert.equal(specimen.diagnostics().remodeling,0);
  frame(5,1,58);assert.equal(pool.count,0,'structural overview does not retain a flowing ion pool');
});

test('pause keeps biology exact while camera transparency and actin selection only change appearance',()=>{
  frame(4,.57,40.125);
  const frozen=snapshot(),baseline=specimen.diagnostics(),terminal=named('Contextual presynaptic terminal');
  const terminalOpacity=terminal.material.opacity,proteinOpacity=named('PSD-95 scaffold complex').material.opacity;
  for(let i=0;i<3;i++) {frame(4,.57,40.125);assert.deepEqual(snapshot(),frozen);}
  const focused=frame(4,.57,40.125,{selected:'actin',viewDistance:9});
  assert.deepEqual(snapshot(),frozen,'selection and camera distance cannot advance geometry or particle transforms');
  assert.ok(focused.appearance.membraneOpacity<baseline.appearance.membraneOpacity&&focused.appearance.membraneOpacity>.30);
  assert.ok(terminal.material.opacity<terminalOpacity);
  assert.ok(named('PSD-95 scaffold complex').material.opacity<proteinOpacity);
  assert.deepEqual(focused.proteins,baseline.proteins);
  frame(4,.57,40.125);assert.equal(terminal.material.opacity,terminalOpacity,'leaving focus restores the appearance');
});
