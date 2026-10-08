import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createActinNetwork } from '../src/scene/actin-network.js';

const network = createActinNetwork({ texture: new THREE.Texture() });
const mesh = network.selectable[0], geometry = mesh.geometry, position = geometry.attributes.position;
const vector = array => new THREE.Vector3(...array);

function ringCenter(range, row) {
  const center = new THREE.Vector3();
  for (let column = 0; column < range.columns; column++) {
    center.add(new THREE.Vector3().fromBufferAttribute(position, range.offset + row * (range.columns + 1) + column));
  }
  return center.divideScalar(range.columns);
}

function snapshot() {
  return {
    position: position.array.slice(), normal: geometry.attributes.normal.array.slice(),
    anchor: network.labelAnchors[0].position.toArray(), state: network.diagnostics(),
  };
}

test('actin forms a finite branched volume concentrated in the head with a sparse neck continuation', () => {
  network.update();
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    assert.ok(attribute.array.every(Number.isFinite), `invalid ${name}`);
  }
  const diagnostic = network.diagnostics();
  const box = new THREE.Box3().setFromBufferAttribute(position), size = box.getSize(new THREE.Vector3());
  assert.ok(size.x > 2.3 && size.z > 1, 'the head network must occupy a volume, not a plane');
  assert.ok(box.min.y < -3.1 && box.max.y > -1, 'filaments must continue from the neck into the head');
  assert.ok(diagnostic.filamentCount >= 40 && diagnostic.branches.length >= 25);
  assert.ok(diagnostic.headFraction > .80, 'most filament length must support the broad head');
  assert.ok(diagnostic.triangles < 30000, 'fine detail must retain a mobile geometry budget');
  assert.equal(network.root.children.length, 1, 'filaments must share a mesh rather than hundreds of objects');
  assert.equal(network.selectable.length, 1);
  assert.equal(mesh.userData.key, 'actin');
  assert.ok(geometry.index.array.every(index => index < position.count));
  // Each extensive head path now has a genuine parent leading to the neck;
  // branch continuity must hold for the supporting network, not just twigs.
  const {ranges}=diagnostic;
  assert.equal(ranges.filter(range=>range.parent===null).length,3);
  for(const range of ranges.slice(3)) {
    let ancestor=range,depth=0;
    while(ancestor.parent!==null) {ancestor=ranges[ancestor.parent];assert.ok(++depth<ranges.length,'the network cannot contain cycles');}
    assert.ok(ancestor.id<3,'every head filament reaches one of the neck paths');
  }
});

test('visible branches stay attached to their parent filaments throughout local growth', () => {
  for (const remodeling of [0, .27, .58, 1]) {
    network.update({ time: 21, remodeling });
    const { branches, ranges } = network.diagnostics();
    for (const branch of branches) {
      const origin = vector(branch.origin), attachment = vector(branch.attachment);
      assert.ok(origin.distanceTo(attachment) < 1e-12, `branch ${branch.id} detached from its conceptual junction`);
      const range = ranges[branch.id], parent = ranges[branch.parent];
      const rootCenter = ringCenter(range, 0);
      assert.ok(rootCenter.distanceTo(origin) < 1e-7, 'the actual membrane must follow the junction');
      assert.ok(new THREE.Vector3().fromBufferAttribute(position, range.startCap).distanceTo(origin) < 1e-7);
      let closestParent = Infinity;
      for (let row = 0; row <= parent.rows; row++) closestParent = Math.min(closestParent, rootCenter.distanceTo(ringCenter(parent, row)));
      assert.ok(closestParent < .039, `branch ${branch.id} must originate on its visible curved parent`);
    }
  }
});

test('remodeling elongates local head branches while the neck remains fixed and the network stays bounded', () => {
  network.update();
  const baseline = snapshot(), basalLengths = new Map(baseline.state.branches.map(branch => [branch.id, branch.length]));
  let previousLength = baseline.state.totalLength;
  for (const remodeling of [.25, .5, .75, 1]) {
    network.update({ time: 0, remodeling });
    const state = network.diagnostics();
    assert.ok(state.totalLength > previousLength, 'growth should be progressive instead of a one-frame pop');
    previousLength = state.totalLength;
    const box = new THREE.Box3().setFromBufferAttribute(position);
    assert.ok(box.min.x > -1.55 && box.max.x < 1.55 && box.min.z > -.94 && box.max.z < .72);
    assert.ok(box.max.y < -.75 && box.min.y > -3.3, 'the network must stay inside the spine and clear of the PSD');
    for (let index = 0; index < position.count; index++) {
      if (baseline.position[index * 3 + 1] >= -2.18) continue;
      for (let axis = 0; axis < 3; axis++) assert.equal(position.array[index * 3 + axis], baseline.position[index * 3 + axis], 'the neck must not expand with the head');
    }
  }
  const final = network.diagnostics();
  const growing = final.branches.filter(branch => branch.growing);
  assert.ok(growing.length >= 12);
  assert.ok(growing.every(branch => branch.length > basalLengths.get(branch.id) * 3), 'local filament elongation must exceed the modest overall head expansion');
  assert.ok(final.branches.filter(branch => !branch.growing).every(branch => branch.length < basalLengths.get(branch.id) * 1.18), 'established branches must retain their structure');
  assert.ok(final.totalLength < baseline.state.totalLength * 1.40, 'growth should not explode across the entire network');
  assert.deepEqual(network.root.scale.toArray(), [1, 1, 1], 'remodeling must change filament geometry rather than scaling the group');
});

test('pause and timeline revisits reconstruct exactly the same actin surface and normals', () => {
  const frame = { time: 39.275, remodeling: .623, selected: 'actin' };
  network.update(frame);
  const expected = snapshot();
  network.update({ time: 63, remodeling: 1, selected: 'psd95' });
  network.update(frame);
  assert.deepEqual(snapshot(), expected, 'the model must not accumulate prior growth or orientation changes');
  const version = position.version;
  network.update(frame);
  assert.deepEqual(snapshot(), expected, 'exploring a frozen specimen must not advance the biology');
  assert.equal(position.version, version, 'a paused frame must not repeatedly rebuild unchanged geometry');
  network.update();
  const initial = snapshot();
  network.update({ time: 56, remodeling: 1 });
  network.update();
  assert.deepEqual(snapshot(), initial, 'exit and reset must restore the exact initial network');
});

test('actin selection highlights only its material without altering the frozen geometry', () => {
  network.update({ time: 41, remodeling: .7 });
  const expected = snapshot(), baselineIntensity = mesh.material.emissiveIntensity, version = position.version;
  network.update({ time: 41, remodeling: .7, selected: 'actin' });
  assert.ok(mesh.material.emissiveIntensity > baselineIntensity);
  assert.deepEqual(snapshot(), expected);
  network.update({ time: 41, remodeling: .7, selected: 'kalirin7' });
  assert.equal(mesh.material.emissiveIntensity, baselineIntensity);
  assert.equal(position.version, version);
  assert.equal(mesh.material.transparent, false, 'filaments should remain physical surfaces, not glow ribbons');
  assert.ok(mesh.material.roughness > .5 && mesh.material.metalness === 0);
});

test('extreme or invalid frame inputs remain finite and bounded', () => {
  for (const frame of [{ time: Infinity, remodeling: NaN }, { time: 1e9, remodeling: 4 }, { time: -10, remodeling: -4 }]) {
    network.update(frame);
    assert.ok(position.array.every(Number.isFinite));
    assert.ok(geometry.attributes.normal.array.every(Number.isFinite));
    assert.ok(network.diagnostics().remodeling >= 0 && network.diagnostics().remodeling <= 1);
  }
});
