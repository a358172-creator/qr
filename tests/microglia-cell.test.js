import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMicrogliaCell } from '../src/scene/microglia-cell.js';

const cell = createMicrogliaCell({ texture: new THREE.Texture() });
const geometry = cell.selectable[0].geometry;
const attributes = geometry.attributes;
const target = new THREE.Vector3(-1.7, -3.1, 1.35);

function snapshot() {
  return {
    positions: attributes.position.array.slice(),
    normals: attributes.normal.array.slice(),
    tip: cell.contactTip.toArray(),
    diagnostic: cell.diagnostics(),
    emissive: cell.selectable.map(mesh => mesh.material.emissiveIntensity),
  };
}

test('microglial soma and ramified three-dimensional arbor share one finite connected membrane', () => {
  const count = attributes.position.count, parents = Int32Array.from({ length: count }, (_, index) => index);
  const find = vertex => {
    while (parents[vertex] !== vertex) {
      parents[vertex] = parents[parents[vertex]];
      vertex = parents[vertex];
    }
    return vertex;
  };
  for (const mesh of cell.selectable) {
    for (const [name, attribute] of Object.entries(mesh.geometry.attributes)) {
      assert.ok(attribute.array.every(Number.isFinite), `${mesh.name}: invalid ${name}`);
    }
    const indices = mesh.geometry.index.array;
    for (let index = 0; index < indices.length; index += 3) {
      const a = indices[index], b = indices[index + 1], c = indices[index + 2];
      assert.ok(a < count && b < count && c < count);
      parents[find(b)] = find(a);
      parents[find(c)] = find(a);
    }
  }
  const connected = new Set(Array.from(parents, (_, index) => find(index))).size;
  assert.equal(connected, 1, 'a visually contiguous arbor must not contain detached branch membranes');
  const box = new THREE.Box3().setFromBufferAttribute(attributes.position), size = box.getSize(new THREE.Vector3());
  assert.ok(size.x > 5 && size.y > 4 && size.z > 2.5, 'the arbor must branch through a volume, not lie in a plane');
  assert.ok(cell.diagnostics().branchCount >= 35, 'the cell must have multiple orders of ramification');
  assert.ok(cell.diagnostics().triangles < 140000, 'retain the agreed geometry budget');
  assert.equal(cell.selectable.length, 2, 'surface complexity must not require hundreds of separate objects');
});

test('the leading tip approaches its target progressively while the soma and proximal membrane remain fixed', () => {
  cell.update({ time: 0, approach: 0 });
  const original = attributes.position.array.slice();
  const anchors = [];
  for (let index = 0; index < attributes.position.count; index++) {
    const offset = index * 3;
    if (Math.hypot(original[offset], original[offset + 1], original[offset + 2]) < .61) anchors.push(index);
  }
  assert.ok(anchors.length > 100, 'verify a surface region, not one conveniently fixed vertex');
  let previousDistance = cell.contactTip.distanceTo(target);
  assert.ok(previousDistance > 1.3, 'the microglia must begin apart from the affected synapse');
  for (const approach of [.2, .4, .6, .8, 1]) {
    cell.update({ time: 45, approach, contact: approach === 1 ? 1 : 0, target });
    const distance = cell.contactTip.distanceTo(target);
    assert.ok(distance < previousDistance, `the process failed to advance at approach=${approach}`);
    previousDistance = distance;
    for (const vertex of anchors) {
      for (let axis = 0; axis < 3; axis++) assert.equal(attributes.position.array[vertex * 3 + axis], original[vertex * 3 + axis]);
    }
    assert.deepEqual(cell.root.position.toArray(), [0, 0, 0], 'extension must never translate the whole cell');
  }
  assert.deepEqual(cell.contactTip.toArray(), target.toArray());
  assert.notDeepEqual(attributes.position.array, original, 'the advancing membrane must change, not only a diagnostic marker');
});

test('contact follows a remodelling spine without moving the soma or leaving the process behind', () => {
  const retracted = new THREE.Vector3(-2.12, -4.21, 1.11);
  cell.update({ time: 50, approach: 1, contact: 1, pruning: .9, target: retracted });
  assert.deepEqual(cell.contactTip.toArray(), retracted.toArray());
  assert.deepEqual(cell.diagnostics().soma, [0, 0, 0]);
  assert.ok(attributes.position.array.every(Number.isFinite));
  assert.ok(attributes.normal.array.every(Number.isFinite));
  assert.deepEqual(cell.root.position.toArray(), [0, 0, 0]);
  const vertex = new THREE.Vector3();
  let membraneDistance = Infinity;
  for (const index of cell.selectable[1].geometry.index.array) {
    membraneDistance = Math.min(membraneDistance, vertex.fromBufferAttribute(attributes.position, index).distanceTo(retracted));
  }
  assert.ok(membraneDistance < .035, 'the visible process membrane must reach the target, not just the diagnostic marker');
});

test('extension bends the process through a volume instead of stretching a straight forceps-like arm', () => {
  cell.update({ time: 0, approach: 0, contact: 0 });
  const original = attributes.position.array.slice(), samples = [];
  for (let index = 0; index < attributes.position.count; index++) {
    const offset = index * 3, x = original[offset], y = original[offset + 1], z = original[offset + 2];
    if (x > -.97 && x < -.73 && y > -1.37 && y < -1.16 && z > .28 && z < .53) samples.push(index);
  }
  assert.ok(samples.length > 15, 'sample a membrane region along the leading shaft');
  const initialTip = cell.contactTip.clone();
  cell.update({ time: 0, approach: 1, contact: 0, target });
  const axis = target.clone().sub(initialTip).normalize();
  const displacement = new THREE.Vector3(), transverse = new THREE.Vector3();
  for (const index of samples) {
    const offset = index * 3;
    displacement.set(attributes.position.getX(index) - original[offset], attributes.position.getY(index) - original[offset + 1], attributes.position.getZ(index) - original[offset + 2]);
    displacement.addScaledVector(axis, -displacement.dot(axis));
    transverse.add(displacement);
  }
  transverse.divideScalar(samples.length);
  assert.ok(transverse.length() > .08, 'the shaft must develop a smooth lateral arc, not only translate along the target vector');
  assert.ok(Math.abs(transverse.z) > .025, 'the bend must have depth, rather than exist only in the camera plane');
});

test('paused frames and revisited stages restore exactly the same surface, normals and selected state', () => {
  const frame = { time: 26.71, approach: .73, contact: .12, pruning: 0, selected: 'process', target };
  cell.update(frame);
  const expected = snapshot();
  cell.update({ time: 84, approach: 1, contact: 1, pruning: .95, selected: 'microglia', target: new THREE.Vector3(-2, -4, 1) });
  cell.update(frame);
  assert.deepEqual(snapshot(), expected, 'state reconstruction must not integrate or accumulate prior process motion');
  cell.update(frame);
  assert.deepEqual(snapshot(), expected, 'repeated updates while exploring must remain identical');
});
