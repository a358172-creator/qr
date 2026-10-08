import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMitochondrialEnvironment } from '../src/scene/mitochondrial-environment.js';

const texture = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
const specimen = createMitochondrialEnvironment({ texture });
const stressState = { ca: .9, redox: .9, lipid: .85, stress: .9, activation: .95, aif: .8, damage: .7 };

function findPool(key) {
  return specimen.root.getObjectByName(`particles:${key}`);
}

function frameSnapshot() {
  const result = [];
  specimen.root.traverse(object => {
    if (!object.isMesh) return;
    result.push(object.visible, ...object.matrixWorld.elements);
    if (object.isInstancedMesh) result.push(object.count, ...object.instanceMatrix.array, ...(object.instanceColor?.array || []));
    const material = object.material;
    if (material.color) result.push(...material.color.toArray(), material.emissiveIntensity);
  });
  return result;
}

test('the mitochondrial specimen has finite indexed geometry and actual separate inner and outer membranes', () => {
  const organelle = specimen.root.getObjectByName('Mitochondrial cutaway');
  const outer = specimen.root.getObjectByName('Outer mitochondrial membrane');
  const inner = specimen.root.getObjectByName('Inner mitochondrial membrane');
  const folds = specimen.root.getObjectByName('Invaginated cristae membranes');
  assert.ok(organelle && outer && inner && folds);
  assert.notEqual(outer.geometry, inner.geometry);
  outer.geometry.computeBoundingBox();
  inner.geometry.computeBoundingBox();
  assert.ok(outer.geometry.boundingBox.max.z > inner.geometry.boundingBox.max.z, 'there must be physical spacing between the two membranes');
  assert.ok(folds.geometry.attributes.position.count > 1000, 'cristae must contain real folded surfaces');
  specimen.root.traverse(object => {
    if (!object.isMesh) return;
    for (const [name, attribute] of Object.entries(object.geometry.attributes)) {
      assert.ok(attribute.array.every(Number.isFinite), `${object.name}: invalid ${name}`);
    }
    if (object.geometry.index) {
      assert.ok(object.geometry.index.array.every(index => index < object.geometry.attributes.position.count));
    }
  });
});

test('all entering calcium passes through the NMDA opening instead of the intact lipid membrane', () => {
  const calcium = findPool('calcium'), matrix = new THREE.Matrix4(), point = new THREE.Vector3();
  let crossings = 0;
  for (let frame = 0; frame < 32; frame++) {
    specimen.update({ time: frame * .23, state: stressState, stepIndex: 0 });
    for (let index = 0; index < calcium.count; index++) {
      calcium.getMatrixAt(index, matrix);
      point.setFromMatrixPosition(matrix);
      if (point.y < 2.45 && point.y > 1.95) {
        assert.ok(Math.hypot(point.x + .65, point.z - .10) < .07, 'an ion traverses a lipid region outside the pore');
        crossings++;
      }
    }
  }
  assert.ok(crossings > 40, 'sample many independent channel-crossing frames');
  assert.ok(calcium.count <= 24, 'ion population remains visually bounded');
});

test('lipid peroxidation locally changes real head and tail geometry while preserving most of the membrane', () => {
  specimen.update({ time: 4, state: { ...stressState, lipid: 0 }, stepIndex: 2 });
  const heads = specimen.root.getObjectByName('Lipid headgroups');
  const tails = specimen.root.getObjectByName('Lipid acyl tails');
  const healthyHeads = heads.instanceMatrix.array.slice(), healthyTails = tails.instanceMatrix.array.slice();
  const healthyColors = heads.instanceColor.array.slice();
  specimen.update({ time: 4, state: { ...stressState, lipid: 1 }, stepIndex: 2 });
  const changed = specimen.diagnostics().membrane;
  assert.ok(changed.changedLipids > 15, 'a local patch must visibly change');
  assert.ok(changed.changedLipids < changed.totalLipids * .22, 'the entire bilayer must not disintegrate');
  assert.ok(changed.maximumDisplacement > .06 && changed.maximumDisplacement < .18);
  assert.notDeepEqual(heads.instanceMatrix.array, healthyHeads);
  assert.notDeepEqual(tails.instanceMatrix.array, healthyTails);
  assert.notDeepEqual(heads.instanceColor.array, healthyColors);
});

test('an unchanged biochemical frame is deterministic, including lipid damage, particles and AIF transport', () => {
  const frame = { time: 33.75, state: stressState, stepIndex: 4, elapsed: 3.25, selected: 'aif' };
  specimen.update(frame);
  const first = frameSnapshot(), firstDiagnostics = specimen.diagnostics();
  // An intervening stage must not leave accumulated transforms or colours.
  specimen.update({ time: 71, state: { ca: .1 }, stepIndex: 0, elapsed: 0 });
  specimen.update(frame);
  assert.deepEqual(frameSnapshot(), first);
  assert.deepEqual(specimen.diagnostics(), firstDiagnostics);
});

test('stages expose only their own protein routes and AIF moves towards the separate nuclear context', () => {
  const initial = specimen.visibleKeys(0), redox = specimen.visibleKeys(1), lipids = specimen.visibleKeys(2);
  assert.ok(!initial.includes('nnos') && !initial.includes('aif'));
  assert.ok(redox.includes('nnos') && redox.includes('nox2') && !redox.includes('cpla2'));
  assert.ok(lipids.includes('cpla2') && lipids.includes('nnos'), 'oxidant sources remain as subdued context during lipid oxidation');
  specimen.update({ time: 20, state: stressState, stepIndex: 4, elapsed: 0 });
  const start = new THREE.Vector3(...specimen.diagnostics().aifPosition);
  specimen.update({ time: 28, state: stressState, stepIndex: 4, elapsed: 8 });
  const finish = new THREE.Vector3(...specimen.diagnostics().aifPosition);
  const nucleus = new THREE.Vector3(2.65, -2.3, -.12);
  assert.ok(finish.distanceTo(nucleus) < start.distanceTo(nucleus) * .25);
  assert.ok(start.distanceTo(finish) > 1.6, 'AIF must change spatial compartment');
  assert.ok(specimen.visibleKeys().includes('dna'));
  assert.equal(specimen.diagnostics().aifProgress, 1);
});

test('cristae and inner boundary partition one connected membrane with identical junction vertices and normals',()=>{
  const inner=specimen.root.getObjectByName('Inner mitochondrial membrane').geometry;
  const folds=specimen.root.getObjectByName('Invaginated cristae membranes').geometry;
  assert.equal(inner.attributes.position,folds.attributes.position);
  assert.equal(inner.attributes.normal,folds.attributes.normal);
  const ids=new Set(inner.index.array);let shared=0;
  for(const id of new Set(folds.index.array))if(ids.has(id))shared++;
  assert.ok(shared>100,'folds must meet the inner boundary along extended junctions');
  const parent=Array.from({length:inner.attributes.position.count},(_,i)=>i);
  const find=i=>parent[i]===i?i:(parent[i]=find(parent[i]));
  const active=new Set();
  for(const geometry of [inner,folds])for(let i=0;i<geometry.index.count;i+=3){
    const a=geometry.index.getX(i),b=geometry.index.getX(i+1),c=geometry.index.getX(i+2);
    parent[find(b)]=find(a);parent[find(c)]=find(a);active.add(a);active.add(b);active.add(c);
  }
  assert.equal(new Set([...active].map(find)).size,1,'no disconnected crista sheets');
  assert.equal(specimen.diagnostics().organelle.cristae,13);
});

test('NOX2 produces extracellular superoxide and paired NO/O2 encounters precede peroxynitrite',()=>{
  const no=findPool('no'),superoxide=findPool('superoxide'),product=findPool('peroxynitrite');
  const matrix=new THREE.Matrix4(),p=new THREE.Vector3(),size=new THREE.Vector3();
  const sample=(mesh,i)=>{mesh.getMatrixAt(i,matrix);p.setFromMatrixPosition(matrix);size.setFromMatrixScale(matrix);return {p:p.clone(),size:size.x};};
  let seenReactants=0,seenProducts=0;
  for(let time=0;time<10;time+=.13){
    specimen.update({time,state:stressState,stepIndex:1});
    for(let i=0;i<superoxide.count;i++){
      const o=sample(superoxide,i),n=sample(no,i),onoo=sample(product,i);
      if(o.size>.001){assert.ok(o.p.y>2.6,'superoxide must stay outside the plasma membrane');assert.ok(n.size>.001);assert.ok(onoo.size<.001);seenReactants++;}
      if(onoo.size>.001){assert.ok(o.size<.001&&n.size<.001,'both reactants cease at the illustrated encounter');seenProducts++;}
    }
  }
  assert.ok(seenReactants>100&&seenProducts>100);
  assert.ok(specimen.diagnostics().reactionSite[1]>2.8);
});

test('AIF release originates apart from PTP and its path never passes through that marker',()=>{
  const ptp=new THREE.Vector3(...specimen.diagnostics().ptp);
  const origin=new THREE.Vector3(...specimen.diagnostics().aifOrigin);
  assert.ok(origin.distanceTo(ptp)>2);
  for(let elapsed=0;elapsed<=10;elapsed+=.5){
    specimen.update({time:40+elapsed,state:stressState,stepIndex:4,elapsed});
    assert.ok(new THREE.Vector3(...specimen.diagnostics().aifPosition).distanceTo(ptp)>2);
  }
});
