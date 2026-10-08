import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createGlutamateEnvironment } from '../src/scene/glutamate-environment.js';
import { glutamateMechanism as definition } from '../src/mechanisms/glutamate.js';
import { createMechanismSession } from '../src/core/mechanism-session.js';
const texture=new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);
const model=createGlutamateEnvironment({texture});
const session=createMechanismSession(definition,model);
function frame(stage){session.seek(stage);session.render();return model.diagnostics();}
function geometrySnapshot(){const result=[];model.root.traverse(o=>{if(o.geometry)result.push(...o.geometry.attributes.position.array);});return result;}

test('B has a proximal shaft mitochondrion and separate continuous head/neck profile',()=>{
  const d=frame(0);assert.ok(d.mitochondria[1]<-3.5);assert.ok(d.mitochondrialScale<.45);
  assert.ok(model.root.getObjectByName('Proximal dendritic section'));
  const mito=model.root.getObjectByName('Mitochondrial cutaway');
  const bounds=new THREE.Box3().setFromObject(mito);assert.ok(bounds.max.y<-3.2);
  model.root.traverse(o=>{if(o.geometry)for(const a of Object.values(o.geometry.attributes))assert.ok(a.array.every(Number.isFinite));});
});
test('the proximal shaft leaves a genuine continuous lumen beneath the spine neck',()=>{
  frame(0);
  const shaft=model.root.getObjectByName('Proximal dendritic section');
  const ray=new THREE.Raycaster(new THREE.Vector3(.20,-2.95,0),new THREE.Vector3(0,-1,0));
  const hits=ray.intersectObject(shaft);
  assert.ok(hits.length>0&&hits.every(hit=>hit.point.y<-4),'no closed shaft roof may intersect the neck');
  const spine=model.selectable.find(o=>o.userData.key==='spine'),positions=spine.geometry.attributes.position;
  for(let i=0;i<=100;i++) {
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    const cy=-3.72-.012*x*x,r=.49+.025*Math.sin(x*1.8);
    assert.ok(Math.abs(Math.hypot(y-cy,z)-r)<1e-6,'the basal neck ring meets the shaft');
    assert.ok(Math.abs(((x-.20)/.43)**2+(z/.31)**2-1)<1e-6,'its footprint matches the oval opening');
  }
});
test('vesicle geometry selects vesicle content independently from free glutamate',()=>{
  const vesicles=model.selectable.find(o=>o.userData.key==='vesicles');
  assert.ok(vesicles?.isInstancedMesh&&vesicles.count===32);
  assert.ok(definition.content.vesicles&&model.visibleKeys(0).includes('vesicles'));
  assert.notEqual(vesicles,model.selectable.find(o=>o.userData.key==='glutamate'));
});
test('physiological transmission never exposes caspases or intrinsic pathway machinery',()=>{
  for(let i=0;i<6;i++){const d=frame(i);assert.equal(d.caspasesVisible,false);assert.equal(d.cytochromeCount,0);assert.equal(d.intrinsicVisible,false);assert.ok(!model.visibleKeys(i).includes('caspases'));}
  assert.ok(definition.steps[2].state.ca<definition.steps[3].state.ca);
});
test('local retraction and the intrinsic possibility remain distinct and reversible',()=>{
  frame(0);const initial=geometrySnapshot();const local=frame(6);
  assert.equal(local.caspasesVisible,true);assert.equal(local.intrinsicVisible,false);assert.equal(local.cytochromeCount,0);
  assert.ok(local.headRadialScale<.85);assert.notDeepEqual(geometrySnapshot(),initial);
  const intrinsic=frame(7);assert.equal(intrinsic.caspasesVisible,false);assert.equal(intrinsic.intrinsicVisible,true);assert.ok(intrinsic.cytochromeCount>0);assert.equal(intrinsic.headRadialScale,1);
  frame(0);assert.deepEqual(geometrySnapshot(),initial);
});
test('playing across the two possibilities restores the anatomical reference progressively',()=>{
  frame(6);const before=model.diagnostics().headRadialScale;
  session.timeline.play();session.advance(definition.steps[6].duration);session.render();
  assert.equal(session.timeline.getState().index,7);
  assert.equal(model.diagnostics().headRadialScale,before,'a narrative boundary cannot snap the membrane or its anchors');
  assert.equal(model.diagnostics().caspasesVisible,false,'the local signal is gated to its own possibility');
  let previous=before;
  for(let i=0;i<8;i++) {
    session.advance(.25);session.render();const scale=model.diagnostics().headRadialScale;
    assert.ok(scale>previous&&scale<1,'returning to the comparison reference remains gradual');previous=scale;
  }
  frame(7);assert.equal(model.diagnostics().headRadialScale,1,'seeking the independent alternative restores its own reference');
  session.timeline.pause();
});
test('intrinsic release moves from intermembrane space toward cytosolic Apaf-1 without a matrix origin',()=>{
  const d=frame(7);assert.ok(d.cytochromeOrigin[0]>1.6&&d.cytochromeOrigin[1]<-3.3);
  const pool=model.root.getObjectByName('particles:cytochrome');
  const before=pool.instanceMatrix.array.slice();
  model.update({time:72,elapsed:10,stepIndex:7,state:definition.steps[7].state});
  assert.notDeepEqual(pool.instanceMatrix.array,before);
  const apaf=model.root.getObjectByName('apaf1').position;
  const m=new THREE.Matrix4(),p=new THREE.Vector3();pool.getMatrixAt(5,m);p.setFromMatrixPosition(m);
  assert.ok(p.distanceTo(apaf)<new THREE.Vector3(...d.cytochromeOrigin).distanceTo(apaf));
});
test('repeated paused states preserve geometry and object/material counts across the eight-stage sequence',()=>{
  const counts=()=>{let objects=0;const materials=new Set();model.root.traverse(o=>{objects++;if(o.material)materials.add(o.material);});return [objects,materials.size];};
  const initialCounts=counts();frame(6);const paused=geometrySnapshot();
  session.render({selected:'caspases'});session.render({selected:'actin'});assert.deepEqual(geometrySnapshot(),paused);
  for(let cycle=0;cycle<3;cycle++)for(let i=0;i<8;i++)frame(i);
  assert.deepEqual(counts(),initialCounts);
  for(const step of definition.steps){assert.deepEqual(Object.keys(step.state).sort(),Object.keys(model.initialState).sort());assert.ok(Object.values(step.state).every(Number.isFinite));}
});
