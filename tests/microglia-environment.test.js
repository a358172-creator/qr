import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMicrogliaEnvironment } from '../src/scene/microglia-environment.js';
import { microgliaMechanism } from '../src/mechanisms/microglia.js';

const specimen = createMicrogliaEnvironment({ texture: new THREE.Texture() });
const named = name => specimen.root.getObjectByName(name);
const healthy = named('Conserved mushroom spine');
const damaged = named('Gradually remodelled mushroom spine');

function stage(index, time = 0) {
  specimen.update({ time, stepIndex: index, state: microgliaMechanism.steps[index].state });
  return specimen.diagnostics();
}

function snapshot() {
  const data = [];
  specimen.root.traverse(object => {
    data.push(object.name, object.visible, object.position.toArray(), object.rotation.toArray(), object.scale.toArray());
    if (object.geometry) data.push(Array.from(object.geometry.attributes.position.array));
    if (object.isInstancedMesh) data.push(object.count, Array.from(object.instanceMatrix.array));
  });
  return data;
}

test('microglial microenvironment has finite indexed surfaces and bounded object count', () => {
  for (const index of [0, 2, 4, 5]) {
    stage(index, 17);
    let meshCount = 0;
    specimen.root.traverse(object => {
      if (!object.geometry) return;
      meshCount++;
      for (const [name, attribute] of Object.entries(object.geometry.attributes)) {
        assert.ok(attribute.array.every(Number.isFinite), `${object.name}: invalid ${name}`);
      }
      for (const vertex of object.geometry.index?.array ?? []) {
        assert.ok(vertex >= 0 && vertex < object.geometry.attributes.position.count);
      }
    });
    assert.ok(meshCount < 28, 'ramified processes must share a small number of meshes');
  }
  const positions = healthy.geometry.attributes.position;
  const neck = [], head = [];
  for (let index = 0; index < positions.count; index++) {
    const y = positions.getY(index), radius = Math.hypot(positions.getX(index), positions.getZ(index));
    if (y > -1.30 && y < -1.10) neck.push(radius);
    if (y > -.12 && y < .12) head.push(radius);
  }
  assert.ok(Math.max(...head) > Math.max(...neck) * 2.8, 'a narrow neck and broad mushroom head remain anatomically readable');
});

test('functional baseline has no damage signals even when a stale incoming state is supplied', () => {
  specimen.update({ time: 12, stepIndex: 0, state: Object.fromEntries(Object.keys(microgliaMechanism.initialState).map(key => [key, 1])) });
  const state = specimen.diagnostics();
  assert.equal(state.headScale, 1);
  assert.equal(state.pruning, 0);
  assert.deepEqual(state.particles, { glutamate: 0, calcium: 0, ros: 0 });
  assert.deepEqual(state.markers, { c1q: false, c3: false, caspase3: false });
  assert.equal(state.cell.approach, 0);
  assert.equal(state.cell.contact, 0);
  for (const key of ['calcium', 'ros', 'c1q', 'c3', 'caspase3']) assert.ok(!specimen.visibleKeys(0).includes(key));
  const signals = stage(2);
  assert.deepEqual(signals.markers, { c1q: true, c3: true, caspase3: true });
  assert.equal(named('C1Q conceptual recognition complexes').count, 3);
  assert.equal(named('C3 conceptual recognition complexes').count, 2);
  assert.deepEqual(stage(5).markers, { c1q: false, c3: false, caspase3: false });
});

test('only the affected spine remodels, and microglial contact follows its retracting surface', () => {
  stage(0);
  const controlPositions = healthy.geometry.attributes.position.array.slice();
  const controlNormals = healthy.geometry.attributes.normal.array.slice();
  const healthyTerminal = named('Conserved presynaptic terminal');
  const controlTransform = healthyTerminal.matrix.toArray();
  const controlColour = healthy.material.color.toArray();
  const originalTop = Math.max(...Array.from(damaged.geometry.attributes.position.array).filter((_, index) => index % 3 === 1));
  const controlOpacity = healthy.material.opacity;
  let previousScale = 1;
  for (let index = 0; index < 6; index++) {
    const state = stage(index, 8 + index * 9);
    assert.ok(state.headScale <= previousScale);
    previousScale = state.headScale;
    assert.deepEqual(healthy.geometry.attributes.position.array, controlPositions);
    assert.deepEqual(healthy.geometry.attributes.normal.array, controlNormals);
    assert.deepEqual(healthyTerminal.matrix.toArray(), controlTransform);
    assert.deepEqual(healthy.material.color.toArray(), controlColour);
    assert.equal(healthy.material.opacity, controlOpacity);
    if (index >= 4) {
      const tip = new THREE.Vector3(...state.cell.contactTip).add(new THREE.Vector3(3.5, 3.3, -1));
      assert.ok(tip.distanceTo(new THREE.Vector3(...state.contactTarget)) < 1e-12, 'the contacting tip cannot float above the retracting head');
      assert.ok(tip.x > .9, 'contact remains at the affected spine, never the conserved spine at x−2.2');
    }
  }
  const lastTop = Math.max(...Array.from(damaged.geometry.attributes.position.array).filter((_, index) => index % 3 === 1));
  assert.ok(lastTop < originalTop - 1.5, 'the head retracts visibly toward the dendritic shaft');
  assert.ok(previousScale < .3 && previousScale > .1, 'remodelling leaves a small, finite remnant');
  stage(0);
  assert.equal(specimen.diagnostics().headScale, 1);
  assert.ok(Math.abs(Math.max(...Array.from(damaged.geometry.attributes.position.array).filter((_, index) => index % 3 === 1)) - originalTop) < 1e-6);
});

test('pause or explore repeats preserve geometry, process positions and molecular matrices exactly', () => {
  for (const index of [1, 3, 4]) {
    stage(index, 24.125);
    const frozen = snapshot();
    for (let repeat = 0; repeat < 3; repeat++) stage(index, 24.125);
    assert.deepEqual(snapshot(), frozen);
  }
});

test('spine remodelling waits for effective process contact and develops continuously', () => {
  const state = { ...microgliaMechanism.steps[4].state };
  let previousPruning = 0;
  for (const approach of [.90, .94, .96, .97, .98, .99, 1]) {
    specimen.update({ time: 40, stepIndex: 4, state: { ...state, approach } });
    const actual = specimen.diagnostics();
    if (approach <= .96) {
      assert.equal(actual.pruning, 0, 'a process that has not arrived cannot retract the spine');
      assert.equal(actual.cell.contact, 0, 'no contact morphology before arrival');
    } else {
      assert.ok(actual.pruning > previousPruning, 'the contact gate must not snap or reverse');
    }
    previousPruning = actual.pruning;
  }
  assert.equal(previousPruning, state.pruning, 'seeking a complete contact stage preserves its intended morphology');
  specimen.update({ time: 40, stepIndex: 4, state: { ...state, contact: 0 } });
  assert.equal(specimen.diagnostics().pruning, 0, 'proximity without contact is insufficient for remodelling');
});

test('all calcium crossings use the contextual NMDAR channel instead of intact spine membrane', () => {
  const matrix = new THREE.Matrix4(), ion = new THREE.Vector3();
  let crossings = 0;
  const pool = named('particles:calcium');
  for (let time = 0; time < 12; time += .5) {
    const data = stage(1, time), channel = new THREE.Vector3(...data.channel);
    assert.ok(pool.count > 0);
    for (let index = 0; index < pool.count; index++) {
      pool.getMatrixAt(index, matrix); ion.setFromMatrixPosition(matrix);
      if (Math.abs(ion.y - channel.y) < .13) {
        assert.ok(Math.hypot(ion.x - channel.x, ion.z - channel.z) < .022);
        crossings++;
      }
    }
  }
  assert.ok(crossings > 45, 'sample numerous independent channel crossings');
});
