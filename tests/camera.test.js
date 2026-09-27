import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCameraController } from '../src/core/camera.js';

const vector = (x, y, z) => new THREE.Vector3(x, y, z);
const near = (actual, expected, message) => assert.ok(
  actual.distanceTo(expected) < 1e-9,
  `${message}: expected ${expected.toArray()}, received ${actual.toArray()}`,
);

function setup(position = vector(1, 7, 22), target = vector(-.5, .2, 0), reducedMotion = false) {
  const camera = new THREE.PerspectiveCamera(35, 1, .025, 180);
  camera.position.copy(position);
  // OrbitControls accepts no DOM element. Its actual camera math still runs,
  // including distance clamping and damping, without browser dependencies.
  const controls = new OrbitControls(camera);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.update();
  const controller = createCameraController(camera, controls, () => reducedMotion);
  return { camera, controls, controller };
}

test('crossing scales preserves the starting pose despite destination distance limits', () => {
  for (const [fromDistance, toDistance] of [[24, 4], [4, 24]]) {
    const startTarget = vector(-.5, .2, 0);
    const startPosition = startTarget.clone().add(vector(0, 0, fromDistance));
    const { camera, controls, controller } = setup(startPosition, startTarget);
    const target = vector(1, 1.1, 0);
    const position = target.clone().add(vector(0, 0, toDistance));
    controls.minDistance = toDistance * .47;
    controls.maxDistance = toDistance * 1.6;

    controller.move(position, target, { duration: 2 });
    near(camera.position, startPosition, 'move must not jump before its first frame');
    near(controls.target, startTarget, 'move must preserve the current look-at point');
    assert.equal(controls.minDistance, toDistance * .47);
    assert.equal(controls.maxDistance, toDistance * 1.6);
    assert.equal(controls.enableDamping, true);
    assert.equal(controls.enabled, false);
    assert.equal(controller.active, true);

    controller.update(0);
    near(camera.position, startPosition, 'a zero-time frame must retain the source pose');
    controller.update(1);
    const middleDistance = camera.position.distanceTo(controls.target);
    assert.ok(middleDistance > Math.min(fromDistance, toDistance));
    assert.ok(middleDistance < Math.max(fromDistance, toDistance));
    controller.update(1);
    near(camera.position, position, 'the transition must reach its destination');
    near(controls.target, target, 'the transition must reach its destination target');
    assert.equal(controller.active, false);
    assert.equal(controls.enabled, true);
  }
});

test('starting or interrupting travel clears orbit momentum without changing the visible pose', () => {
  const { camera, controls, controller } = setup();
  // Seed genuine damping through the public OrbitControls API.
  controls.autoRotate = true;
  controls.update(.25);
  controls.autoRotate = false;
  const initialPosition = camera.position.clone(), initialTarget = controls.target.clone();
  let replacedCompletion = 0, replacementCompletion = 0;
  controller.move(vector(2, 2, 5), vector(1, 1, 0), {
    duration: 3, onComplete: () => replacedCompletion++,
  });
  near(camera.position, initialPosition, 'clearing damping must preserve the visible camera');
  near(controls.target, initialTarget, 'clearing damping must preserve the target');
  controller.update(.8);
  const interruptedPosition = camera.position.clone(), interruptedTarget = controls.target.clone();
  const destination = vector(-3, 8, 35), target = vector(-5, -.4, -1);
  controller.move(destination, target, {
    duration: 2, onComplete: () => replacementCompletion++,
  });
  near(camera.position, interruptedPosition, 'replacement must begin at the interrupted pose');
  near(controls.target, interruptedTarget, 'replacement must begin at the interrupted target');
  controller.update(0);
  near(camera.position, interruptedPosition, 'replacement first frame must remain continuous');
  controller.update(2);
  assert.equal(replacedCompletion, 0);
  assert.equal(replacementCompletion, 1);
  near(camera.position, destination, 'replacement must arrive at its own destination');
  near(controls.target, target, 'replacement must arrive at its own target');
  controls.update();
  near(camera.position, destination, 'resuming OrbitControls must not release stale momentum');
});

test('cancel preserves the interrupted pose and restores manual control without completing travel', () => {
  const { camera, controls, controller } = setup();
  let completed = 0;
  controller.move(vector(2, 2, 5), vector(1, 1, 0), {
    duration: 3, onComplete: () => completed++,
  });
  controller.update(.7);
  const position = camera.position.clone(), target = controls.target.clone();
  controller.cancel();
  assert.equal(controller.active, false);
  assert.equal(controls.enabled, true);
  assert.equal(controller.update(100), false);
  near(camera.position, position, 'cancelled camera must remain where the user interrupted');
  near(controls.target, target, 'cancelled target must remain where the user interrupted');
  assert.equal(completed, 0);
});

for (const [name, reducedMotion, duration] of [
  ['reduced motion', true, 3],
  ['an explicit zero duration', false, 0],
]) {
  test(`${name} arrives synchronously and leaves callback control decisions intact`, () => {
    const { camera, controls, controller } = setup(undefined, undefined, reducedMotion);
    const position = vector(2, 2, 5), target = vector(1, 1, 0);
    let completed = 0;
    controller.move(position, target, { duration, onComplete() {
      completed++;
      assert.equal(controller.active, false);
      assert.equal(controls.enabled, true);
      near(camera.position, position, 'completion must observe the final camera pose');
      near(controls.target, target, 'completion must observe the final target');
      // Guided playback keeps orbit disabled after the camera arrives.
      controls.enabled = false;
    } });
    assert.equal(completed, 1);
    assert.equal(controller.active, false);
    assert.equal(controls.enabled, false);
    assert.equal(controller.update(100), false);
    assert.equal(completed, 1);
    assert.equal(controls.enabled, false);
  });
}

test('an animated completion callback can start another move without losing its control state', () => {
  const { camera, controls, controller } = setup();
  const secondPosition = vector(-3, 8, 35), secondTarget = vector(-5, -.4, -1);
  let completed = 0;
  controller.move(vector(2, 2, 5), vector(1, 1, 0), { duration: 1, onComplete() {
    completed++;
    assert.equal(controller.active, false);
    assert.equal(controls.enabled, true);
    controller.move(secondPosition, secondTarget, { duration: 2, onComplete: () => completed++ });
  } });
  controller.update(1);
  assert.equal(completed, 1);
  assert.equal(controller.active, true);
  assert.equal(controls.enabled, false);
  controller.update(2);
  near(camera.position, secondPosition, 'chained transition must reach the second destination');
  near(controls.target, secondTarget, 'chained transition must reach the second target');
  assert.equal(completed, 2);
  assert.equal(controller.active, false);
  assert.equal(controls.enabled, true);
  controller.update(100);
  assert.equal(completed, 2);
});
