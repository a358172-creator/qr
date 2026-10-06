import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createParticles } from '../src/scene/particles.js';

const baseline = { glut: .3, ca: .2, stress: .4, activation: .5 };
const matrix = new THREE.Matrix4();
const near = (actual, expected, tolerance = 1e-6) => {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);
};

function specimen() {
  const root = new THREE.Group();
  const channels = [new THREE.Vector3(.6, -.18, .2), new THREE.Vector3(-.5, -.23, .4)];
  const receptors = [
    { kind: 'ampa', group: { position: new THREE.Vector3(-.8, -.2, .1) } },
    ...channels.map(position => ({ kind: 'nmda', group: { position } })),
  ];
  return { root, channels, particles: createParticles(root, channels, receptors) };
}

function instance(mesh, index) {
  mesh.getMatrixAt(index, matrix);
  return {
    position: new THREE.Vector3().setFromMatrixPosition(matrix),
    radius: new THREE.Vector3().setFromMatrixScale(matrix).x,
  };
}

function positions(mesh) {
  return Array.from({ length: mesh.count }, (_, index) => instance(mesh, index).position.toArray());
}

test('changing calcium concentration changes density without teleporting ions in flight', () => {
  const { particles } = specimen();
  const time = 47.31;
  particles.update(time, { ...baseline, ca: .05 });
  const before = positions(particles.calcium);
  const countVisible = () => Array.from({ length: particles.calcium.count }, (_, index) =>
    instance(particles.calcium, index).radius).filter(radius => radius > .00002).length;
  const few = countVisible();
  particles.update(time, { ...baseline, ca: .95 });
  assert.deepEqual(positions(particles.calcium), before);
  assert.ok(countVisible() > few);
  particles.update(time + .001, { ...baseline, ca: .94 });
  const after = positions(particles.calcium);
  for (let index = 0; index < before.length; index++) {
    const distance = new THREE.Vector3(...before[index]).distanceTo(new THREE.Vector3(...after[index]));
    assert.ok(distance < .005, `Ion ${index} should move continuously, moved ${distance}`);
  }
});

test('calcium traverses each NMDA pore before dispersing into the postsynaptic interior', () => {
  const { particles, channels } = specimen();
  for (let index = 0; index < particles.calcium.count; index++) {
    const channel = channels[index % channels.length];
    const phase = (index * .618033) % 1;
    const at = q => {
      const time = (q - phase + (q < phase ? 1 : 0)) / .21;
      particles.update(time, { ...baseline, ca: 1 });
      return instance(particles.calcium, index).position;
    };
    for (const q of [.05, .15, .3]) {
      const position = at(q);
      near(position.x, channel.x);
      near(position.z, channel.z);
      near(position.y, channel.y + .49 - q / .35 * .69);
    }
    const beforeExit = at(.35 - .000001);
    const afterExit = at(.35 + .000001);
    assert.ok(beforeExit.distanceTo(afterExit) < .00001, `Pore exit ${index} must be continuous`);
    const inside = at(.65);
    assert.ok(inside.y < channel.y - .2);
    assert.ok(Math.hypot(inside.x - channel.x, inside.z - channel.z) > .01);
  }
});

test('moving molecular clouds keep raycast bounds around every rendered sphere', () => {
  const { root, particles } = specimen();
  root.updateMatrixWorld(true);
  for (const time of [0, .43, 2.9, 14.2, 53.8]) {
    particles.update(time, { glut: 1, ca: 1, stress: 1, activation: 1 });
    for (const mesh of particles.selectable) {
      assert.ok(mesh.boundingSphere && !mesh.boundingSphere.isEmpty());
      for (let index = 0; index < mesh.count; index++) {
        const { position, radius } = instance(mesh, index);
        if (radius < .00002) continue;
        const edgeDistance = mesh.boundingSphere.center.distanceTo(position) + radius;
        assert.ok(edgeDistance <= mesh.boundingSphere.radius + 1e-6, `${mesh.userData.key} ${index} escaped its raycast bounds`);
        const raycaster = new THREE.Raycaster(position.clone().add(new THREE.Vector3(0, 0, 3)), new THREE.Vector3(0, 0, -1));
        assert.ok(raycaster.intersectObject(mesh).some(hit => hit.instanceId === index), `${mesh.userData.key} ${index} remains selectable after moving`);
      }
    }
  }
});

test('paused renders, selection and reverse seeking preserve deterministic particle positions', () => {
  const { particles } = specimen();
  const snapshot = () => particles.selectable.map(mesh => Array.from(mesh.instanceMatrix.array));
  particles.update(18.37, baseline);
  const paused = snapshot();
  for (const selected of ['calcium', 'glutamate', 'ros', null]) {
    particles.update(18.37, baseline, selected);
    assert.deepEqual(snapshot(), paused);
  }
  particles.update(57.2, { ...baseline, ca: .9, stress: .8 });
  particles.update(18.37, baseline);
  assert.deepEqual(snapshot(), paused);
});
