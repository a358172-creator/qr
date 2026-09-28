import test from 'node:test';
import assert from 'node:assert/strict';
import { createMechanismSession } from '../src/core/mechanism-session.js';
import { glutamateMechanism } from '../src/mechanisms/glutamate.js';
import { mitochondrialMechanism } from '../src/mechanisms/mitochondrial-dysfunction.js';

const definition = {
  id: 'test',
  steps: [
    { key: 'entry', duration: 2, state: { calcium: .5, stress: 0 } },
    { key: 'response', duration: 3, state: { calcium: .8, stress: .3 } },
    { key: 'integration', duration: 5, state: { calcium: .7, stress: .9 } },
  ],
};

function specimen(initialState = { calcium: 0, stress: 0 }) {
  const frames = [];
  return {
    frames,
    initialState,
    update(frame) { frames.push(structuredClone(frame)); },
  };
}

function snapshot(session) {
  return { time: session.time, state: { ...session.state }, timeline: session.timeline.getState() };
}

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} ≈ ${expected}`);

test('switching mechanisms preserves independent clocks and biochemical histories', () => {
  const glutamate = createMechanismSession(glutamateMechanism, specimen(glutamateMechanism.steps[0].state));
  const mitochondrial = createMechanismSession(mitochondrialMechanism, specimen(mitochondrialMechanism.initialState));
  glutamate.timeline.play();
  glutamate.advance(16.25);
  glutamate.timeline.pause();
  const parkedGlutamate = snapshot(glutamate);

  mitochondrial.timeline.play();
  mitochondrial.advance(9.5);
  mitochondrial.timeline.pause();
  const parkedMitochondrial = snapshot(mitochondrial);
  assert.deepEqual(snapshot(glutamate), parkedGlutamate);
  assert.equal(glutamate.timeline.getState().step.key, 'nmda');
  assert.equal(mitochondrial.timeline.getState().step.key, 'reactive-species');
  assert.equal('redox' in glutamate.state, false);
  assert.equal('glut' in mitochondrial.state, false);

  glutamate.timeline.play();
  glutamate.advance(.25);
  near(glutamate.time, 16.5);
  assert.deepEqual(snapshot(mitochondrial), parkedMitochondrial);
});

test('paused exploration freezes every biological value across renders and resumes exactly', () => {
  const model = specimen();
  const session = createMechanismSession(definition, model);
  session.timeline.play();
  session.advance(2.75);
  session.timeline.pause();
  const paused = snapshot(session);
  session.render({ selected: 'mitochondria' });

  for (const dt of [.016, 30, 900]) {
    session.advance(dt);
    session.render({ selected: 'ptp' });
    assert.deepEqual(snapshot(session), paused);
  }
  assert.equal(model.frames[0].selected, 'mitochondria');
  assert.equal(model.frames.at(-1).selected, 'ptp');
  for (const frame of model.frames) {
    assert.equal(frame.time, paused.time);
    assert.deepEqual(frame.state, paused.state);
    assert.equal(frame.elapsed, paused.timeline.elapsed);
    assert.equal(frame.stepIndex, paused.timeline.index);
  }

  session.timeline.play();
  session.advance(.25);
  near(session.time, 3);
  near(session.timeline.getState().elapsed, 1);
  assert.notDeepEqual(session.state, paused.state);
});

test('seek publishes a coherent stage, clock and biochemical state to observers', () => {
  let session;
  const notifications = [];
  session = createMechanismSession(definition, specimen(), () => notifications.push(snapshot(session)));
  session.timeline.play();
  session.advance(.75);
  session.seek(2);
  const sought = notifications.at(-1);
  assert.equal(sought.time, 5);
  assert.equal(sought.timeline.index, 2);
  assert.equal(sought.timeline.elapsed, 0);
  assert.equal(sought.timeline.playing, true);
  assert.deepEqual(sought.state, definition.steps[2].state);
  session.render();
  assert.deepEqual(session.model.frames.at(-1).state, definition.steps[2].state);

  session.timeline.pause();
  session.seek(1);
  assert.equal(session.time, 2);
  assert.equal(session.timeline.getState().playing, false);
  assert.deepEqual(session.state, definition.steps[1].state);
});

test('invalid seeks leave the existing narrative and model state intact', () => {
  const session = createMechanismSession(definition, specimen());
  session.timeline.play();
  session.advance(3.25);
  const before = snapshot(session);
  for (const index of [-1, 3, 1.5, NaN]) {
    assert.throws(() => session.seek(index), RangeError);
    assert.deepEqual(snapshot(session), before);
  }
});

test('reset restores the model baseline without modifying the reusable initial data', () => {
  const model = specimen();
  const initial = { ...model.initialState };
  const notifications = [];
  let session;
  session = createMechanismSession(definition, model, () => notifications.push(snapshot(session)));
  session.timeline.play();
  session.advance(7.25);
  session.reset();
  assert.deepEqual(session.state, initial);
  assert.deepEqual(model.initialState, initial);
  assert.notEqual(session.state, model.initialState);
  assert.deepEqual(notifications.at(-1), {
    time: 0,
    state: initial,
    timeline: {
      index: 0, elapsed: 0, playing: false, complete: false, progress: 0,
      step: definition.steps[0],
    },
  });
});

test('a mechanism-owned baseline is used when the model has no initial state', () => {
  const model = { update() {} };
  const session = createMechanismSession(mitochondrialMechanism, model);
  assert.deepEqual(session.state, mitochondrialMechanism.initialState);
  assert.ok(session.state.ca < mitochondrialMechanism.steps[0].state.ca);
  session.timeline.play();
  session.advance(.5);
  assert.ok(session.state.ca > mitochondrialMechanism.initialState.ca);
  assert.ok(session.state.ca < mitochondrialMechanism.steps[0].state.ca);
  session.reset();
  assert.deepEqual(session.state, mitochondrialMechanism.initialState);
});

test('completion consumes only the remaining narrative duration and then stays frozen', () => {
  const session = createMechanismSession(definition, specimen());
  session.timeline.play();
  session.advance(1.25);
  session.advance(1000);
  assert.equal(session.time, 10);
  assert.equal(session.timeline.getState().progress, 1);
  assert.equal(session.timeline.getState().complete, true);
  const completed = snapshot(session);
  session.advance(1000);
  session.render();
  assert.deepEqual(snapshot(session), completed);
  assert.equal(session.model.frames.at(-1).time, 10);
});

test('a pause at a stage boundary prevents unused frame time reaching the model', () => {
  let session;
  session = createMechanismSession(definition, specimen(), frame => {
    if (frame.index === 1 && frame.playing) session.timeline.pause();
  });
  session.timeline.play();
  session.advance(100);
  assert.equal(session.time, 2);
  assert.equal(session.timeline.getState().index, 1);
  assert.equal(session.timeline.getState().elapsed, 0);
  assert.equal(session.timeline.getState().playing, false);
});

test('invalid frame durations cannot corrupt a playing mechanism', () => {
  const session = createMechanismSession(definition, specimen());
  session.timeline.play();
  session.advance(.5);
  const before = snapshot(session);
  for (const dt of [0, -1, NaN, Infinity, undefined]) {
    session.advance(dt);
    assert.deepEqual(snapshot(session), before);
  }
});

test('panel D defines resolvable cameras, labels and complete finite states for every stage', () => {
  const mechanism = mitochondrialMechanism;
  assert.equal(mechanism.steps.length, 6);
  assert.equal(new Set(mechanism.steps.map(step => step.key)).size, 6);
  const stateKeys = Object.keys(mechanism.initialState).sort();
  for (const step of mechanism.steps) {
    assert.ok(Number.isFinite(step.duration) && step.duration > 0);
    assert.ok(mechanism.cameraPoses[step.camera], `Missing camera for ${step.key}`);
    assert.deepEqual(Object.keys(step.state).sort(), stateKeys);
    assert.ok(Object.values(step.state).every(value => Number.isFinite(value) && value >= 0 && value <= 1));
    for (const key of step.labels) {
      assert.ok(mechanism.content[key]?.title, `Missing title for ${key}`);
      assert.ok(mechanism.content[key]?.text, `Missing explanation for ${key}`);
    }
  }
  assert.ok(mechanism.cameraPoses[mechanism.entryCamera]);
  assert.ok(mechanism.cameraPoses[mechanism.overviewCamera]);
  for (const pose of Object.values(mechanism.cameraPoses)) {
    for (const vector of [pose.position, pose.target]) {
      assert.equal(vector.length, 3);
      assert.ok(vector.every(Number.isFinite));
    }
    assert.notDeepEqual(pose.position, pose.target);
  }
  for (const key of ['nmda', 'calcium', 'nnos', 'no', 'sgc', 'pkc', 'nox2', 'superoxide', 'peroxynitrite', 'cpla2', 'aa', 'eicosanoids', 'membrane', 'mitochondria', 'ptp', 'aif', 'ros', 'dna']) {
    assert.ok(mechanism.content[key]?.text, `Missing panel D structure ${key}`);
  }
});
