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

test('both spine lumens open into the dendrite and their basal rings stay fixed during remodelling', () => {
  stage(0);
  const shaft = named('Continuous dendritic shaft');
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const proxy = new THREE.Mesh(shaft.geometry, material);
  const ray = new THREE.Raycaster();
  const uv = damaged.geometry.attributes.uv;
  const ring = Array.from({ length: uv.count }, (_, index) => index).filter(index => uv.getY(index) === 0);
  const basal = ring.map(index => new THREE.Vector3().fromBufferAttribute(damaged.geometry.attributes.position, index).toArray());
  for (const index of [0, 4, 5]) {
    stage(index);
    for (const x of [-2.2, 1.2]) {
      const z = -.03 - .0075 * x * x - .004 * x;
      for (const offset of [-.08, 0, .08]) {
        ray.set(new THREE.Vector3(x + offset, -1.5, z), new THREE.Vector3(0, -1, 0));
        const hits = ray.intersectObject(proxy);
        assert.ok(hits.length > 0, 'the floor of the shaft must remain present');
        assert.ok(hits[0].point.y < -2.4, 'no shaft roof can seal the neck lumen');
      }
    }
    assert.deepEqual(ring.map(vertex => new THREE.Vector3().fromBufferAttribute(damaged.geometry.attributes.position, vertex).toArray()), basal,
      'local retraction must preserve the neck/shaft attachment');
  }
  material.dispose();
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
      const tip = new THREE.Vector3(...state.cell.contactTip).add(new THREE.Vector3(...state.cellPosition));
      assert.ok(tip.distanceTo(new THREE.Vector3(...state.contactTarget)) < 1e-12, 'the contacting tip cannot float above the retracting head');
      assert.ok(tip.x > .9, 'contact remains at the affected spine, never the conserved spine at x−2.2');
    }
  }
  const lastTop = Math.max(...Array.from(damaged.geometry.attributes.position.array).filter((_, index) => index % 3 === 1));
  assert.ok(lastTop < originalTop - .9, 'the head retracts visibly toward the dendritic shaft');
  assert.ok(previousScale < .55 && previousScale > .4, 'localized remodelling retains a recognizable head, without implying complete engulfment');
  stage(0);
  assert.equal(specimen.diagnostics().headScale, 1);
  assert.ok(Math.abs(Math.max(...Array.from(damaged.geometry.attributes.position.array).filter((_, index) => index % 3 === 1)) - originalTop) < 1e-6);
});

test('contact reaches actual spine membrane in three dimensions throughout local retraction', () => {
  const point = new THREE.Vector3(), tip = new THREE.Vector3();
  const process = named('Extending microglial process');
  for (const pruning of [0, .25, .5, .75, .93]) {
    specimen.update({ time: 48, stepIndex: 4, state: { ...microgliaMechanism.steps[4].state, approach: 1, contact: 1, pruning } });
    const data = specimen.diagnostics();
    tip.fromArray(data.cell.contactTip).add(new THREE.Vector3(...data.cellPosition));
    let distanceToSpine = Infinity, distanceToProcess = Infinity;
    for (let index = 0; index < damaged.geometry.attributes.position.count; index++) {
      point.fromBufferAttribute(damaged.geometry.attributes.position, index).add(damaged.position);
      distanceToSpine = Math.min(distanceToSpine, point.distanceTo(tip));
    }
    for (const index of process.geometry.index.array) {
      point.fromBufferAttribute(process.geometry.attributes.position, index).add(process.parent.position);
      distanceToProcess = Math.min(distanceToProcess, point.distanceTo(tip));
    }
    assert.ok(distanceToSpine < 1e-6, 'contact must be on the visible spine, rather than at a nearby arbitrary point');
    assert.ok(distanceToProcess < .04, 'the process membrane must physically reach the spine in 3D');
  }
});

test('complement glyphs remain extracellular while caspase-3 remains intracellular', () => {
  const matrix = new THREE.Matrix4(), centre = new THREE.Vector3(), point = new THREE.Vector3(), normal = new THREE.Vector3();
  // Sign of the nearest membrane's outward normal distinguishes compartments;
  // check the full glyph envelope, not only the position of its annotation.
  const compartment = centre => {
    let nearest = Infinity, signed = 0;
    const positions = damaged.geometry.attributes.position, normals = damaged.geometry.attributes.normal;
    for (let index = 0; index < positions.count; index++) {
      point.fromBufferAttribute(positions, index).add(damaged.position);
      const distance = point.distanceToSquared(centre);
      if (distance < nearest) {
        nearest = distance;
        normal.fromBufferAttribute(normals, index);
        signed = point.sub(centre).negate().dot(normal);
      }
    }
    return signed;
  };
  for (const index of [2, 3, 4]) {
    stage(index, 42);
    for (const name of ['C1Q conceptual recognition complexes', 'C3 conceptual recognition complexes']) {
      const marker = named(name), positions = marker.geometry.attributes.position;
      for (let instance = 0; instance < marker.count; instance++) {
        marker.getMatrixAt(instance, matrix);
        centre.setFromMatrixPosition(matrix);
        assert.ok(compartment(centre) > .06, `${name} centre must be extracellular`);
        // Extremal vertices include the furthest lobe and the bouquet stalk.
        for (let vertex = 0; vertex < positions.count; vertex += 83) {
          centre.fromBufferAttribute(positions, vertex).applyMatrix4(matrix);
          assert.ok(compartment(centre) > .004, `${name} cannot intersect the postsynaptic membrane`);
        }
      }
    }
    const caspase = named('Intracellular conceptual caspase-3 signal');
    assert.ok(compartment(caspase.position) < -.1, 'CASP3 must remain inside the head');
  }
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
