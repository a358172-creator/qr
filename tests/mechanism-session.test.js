import test from 'node:test';
import assert from 'node:assert/strict';
import { createMechanismSession } from '../src/core/mechanism-session.js';
import { glutamateMechanism } from '../src/mechanisms/glutamate.js';
import { mitochondrialMechanism } from '../src/mechanisms/mitochondrial-dysfunction.js';
import { microgliaMechanism } from '../src/mechanisms/microglia.js';
import { plasticityMechanism } from '../src/mechanisms/synaptic-plasticity.js';

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

test('biological response follows each stage equally across large and small frames', () => {
  const gradual = { ...definition, responseRates: { calcium: .17, stress: .4 } };
  const run = durations => {
    const session = createMechanismSession(gradual, specimen());
    session.timeline.play();
    for (const dt of durations) session.advance(dt);
    return snapshot(session);
  };
  const large = run([6.25]);
  const small = run(Array(625).fill(.01));
  const boundaries = run([2, 3, 1.25]);
  for (const actual of [small, boundaries]) {
    near(actual.time, large.time);
    near(actual.timeline.elapsed, large.timeline.elapsed);
    assert.equal(actual.timeline.index, large.timeline.index);
    for (const key of Object.keys(large.state)) near(actual.state[key], large.state[key]);
  }
  // Independent analytical expectation: each target acts only for its duration.
  for (const key of Object.keys(large.state)) {
    let expected = 0;
    [2, 3, 1.25].forEach((duration, index) => {
      const target = gradual.steps[index].state[key];
      expected = target + (expected - target) * Math.exp(-gradual.responseRates[key] * duration);
    });
    near(large.state[key], expected);
  }
});

test('boundary and completion observers receive the already integrated biological state', () => {
  const notifications = [];
  let session;
  session = createMechanismSession(definition, specimen(), () => notifications.push(snapshot(session)));
  session.timeline.play();
  session.advance(100);
  assert.deepEqual(notifications.map(value => value.time), [0, 2, 5, 10]);
  assert.deepEqual(notifications.map(value => value.timeline.index), [0, 1, 2, 2]);
  assert.equal(notifications.at(-1).timeline.complete, true);
  let calcium = 0, stress = 0;
  definition.steps.forEach((step, index) => {
    const decay = Math.exp(-3 * step.duration);
    calcium = step.state.calcium + (calcium - step.state.calcium) * decay;
    stress = step.state.stress + (stress - step.state.stress) * decay;
    near(notifications[index + 1].state.calcium, calcium);
    near(notifications[index + 1].state.stress, stress);
  });
});

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

test('a mechanism can reset its temporary state on exit without leaking a final-stage model', () => {
  const session = createMechanismSession({ ...definition, resetOnExit: true }, specimen());
  session.timeline.play();
  session.advance(7.5);
  session.leave();
  assert.equal(session.time, 0);
  assert.equal(session.timeline.getState().index, 0);
  assert.equal(session.timeline.getState().playing, false);
  assert.equal(session.timeline.getState().complete, false);
  assert.deepEqual(session.state, session.model.initialState);
  session.render();
  assert.deepEqual(session.model.frames.at(-1).state, session.model.initialState);
  session.timeline.play(); session.advance(.25);
  near(session.time, .25);
});

test('exit preserves the existing modules’ paused histories unless reset is requested', () => {
  const session = createMechanismSession(definition, specimen());
  session.timeline.play(); session.advance(4.5);
  const before = { time: session.time, state: { ...session.state }, index: session.timeline.getState().index };
  session.leave(); session.advance(100);
  assert.equal(session.timeline.getState().playing, false);
  assert.equal(session.time, before.time);
  assert.equal(session.timeline.getState().index, before.index);
  assert.deepEqual(session.state, before.state);
});

test('microglial extension and pruning remain gradual, freeze exactly and reset on exit', () => {
  const session = createMechanismSession(microgliaMechanism, { update() {} });
  session.seek(2);
  session.timeline.play();
  // Approach starts at the next stage; it does not snap to its final extent.
  session.advance(9.99);
  session.advance(.02);
  session.advance(.5);
  assert.ok(session.state.approach > 0 && session.state.approach < .3);
  session.advance(5);
  assert.ok(session.state.approach > .7 && session.state.approach < .9);
  session.timeline.pause();
  const paused = snapshot(session);
  session.advance(30);
  assert.deepEqual(snapshot(session), paused);
  session.leave();
  assert.deepEqual(session.state, microgliaMechanism.initialState);
  assert.equal(session.time, 0);
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
  let shouldPause = true;
  session = createMechanismSession(definition, specimen(), frame => {
    if (frame.index === 1 && frame.playing && shouldPause) {
      shouldPause = false;
      session.timeline.pause();
    }
  });
  session.timeline.play();
  session.advance(100);
  assert.equal(session.time, 2);
  assert.equal(session.timeline.getState().index, 1);
  assert.equal(session.timeline.getState().elapsed, 0);
  assert.equal(session.timeline.getState().playing, false);
  near(session.state.calcium, .5 * (1 - Math.exp(-6)));
  assert.equal(session.state.stress, 0);
  const paused = snapshot(session);
  session.advance(100);
  assert.deepEqual(snapshot(session), paused);
  session.timeline.play();
  session.advance(.5);
  near(session.time, 2.5);
  near(session.state.calcium, .8 + (paused.state.calcium - .8) * Math.exp(-1.5));
  near(session.state.stress, .3 * (1 - Math.exp(-1.5)));
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

test('plasticity remodels gradually, preserves biology while zooming and resets on exit', () => {
  const model = specimen(plasticityMechanism.initialState);
  const session = createMechanismSession(plasticityMechanism, model);
  session.seek(3);
  session.timeline.play();
  session.advance(9.99);
  session.advance(.02);
  session.advance(.5);
  assert.ok(session.state.remodeling > .12 && session.state.remodeling < .25);
  session.advance(5);
  assert.ok(session.state.remodeling > .6 && session.state.remodeling < .9);
  session.timeline.pause();
  const paused = snapshot(session);
  for (const viewDistance of [9, 12, 17]) {
    session.advance(30);
    session.render({ selected: 'actin', viewDistance });
    assert.equal(model.frames.at(-1).viewDistance, viewDistance);
    assert.deepEqual(snapshot(session), paused);
  }
  session.seek(0);
  assert.equal(session.state.remodeling, 0);
  session.seek(5);
  assert.equal(session.state.remodeling, 1);
  session.leave();
  assert.deepEqual(session.state, plasticityMechanism.initialState);
  assert.equal(session.time, 0);
  assert.equal(session.timeline.getState().playing, false);
});

for (const mechanism of [mitochondrialMechanism, microgliaMechanism, plasticityMechanism]) test(`${mechanism.id} defines resolvable cameras, labels and complete finite states for every stage`, () => {
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
    let lastPhase = -1;
    for (const phase of step.labelPhases || []) {
      assert.ok(phase.after > lastPhase && phase.after < step.duration);
      for (const key of phase.labels) assert.ok(step.labels.includes(key) && mechanism.content[key]?.text);
      lastPhase = phase.after;
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
  const keys = mechanism.id === 'mitochondrial'
    ? ['nmda', 'calcium', 'nnos', 'no', 'sgc', 'pkc', 'nox2', 'superoxide', 'peroxynitrite', 'cpla2', 'aa', 'eicosanoids', 'membrane', 'mitochondria', 'ptp', 'aif', 'ros', 'dna']
    : mechanism.id === 'microglia'
      ? ['microglia', 'process', 'healthySpine', 'damagedSpine', 'c1q', 'c3', 'caspase3', 'nmda', 'calcium', 'ros']
      : ['nmda', 'calcium', 'psd95', 'disc1', 'kalirin7', 'actin', 'spine', 'psd', 'terminal', 'dendrite', 'glutamate'];
  for (const key of keys) {
    assert.ok(mechanism.content[key]?.text, `Missing structure ${key}`);
  }
});
