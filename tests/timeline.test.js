import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimeline } from '../src/core/timeline.js';
import { glutamateMechanism } from '../src/mechanisms/glutamate.js';

const steps = [
  { key: 'first', duration: 2 },
  { key: 'second', duration: 3 },
  { key: 'third', duration: 5 },
];

test('exploring can pause indefinitely and resume at the exact narrative time', () => {
  const timeline = createTimeline({ steps });
  timeline.play();
  timeline.update(1.25);
  timeline.pause();
  const paused = timeline.getState();
  timeline.update(900);
  assert.deepEqual(timeline.getState(), paused);
  timeline.play();
  timeline.update(.25);
  assert.equal(timeline.getState().elapsed, 1.5);
  assert.equal(timeline.getState().progress, .15);
});

test('variable frame duration preserves overflow and reports every crossed step', () => {
  const entered = [];
  const timeline = createTimeline({ steps, onChange: state => entered.push(state.index) });
  timeline.play();
  timeline.update(6.25);
  assert.equal(timeline.getState().index, 2);
  assert.equal(timeline.getState().elapsed, 1.25);
  assert.equal(timeline.getState().progress, .625);
  assert.deepEqual(entered, [0, 1, 2]);
});

test('a boundary callback may pause before the next step consumes time', () => {
  const timeline = createTimeline({ steps, onChange: state => {
    if (state.index === 1 && state.playing) timeline.pause();
  } });
  timeline.play();
  timeline.update(6);
  assert.equal(timeline.getState().index, 1);
  assert.equal(timeline.getState().elapsed, 0);
  assert.equal(timeline.getState().playing, false);
});

test('completion stops on the final step and fires exactly once', () => {
  const completed = [];
  const timeline = createTimeline({ steps, onComplete: state => completed.push(state) });
  timeline.play();
  timeline.update(100);
  timeline.update(100);
  assert.equal(completed.length, 1);
  assert.equal(completed[0].step.key, 'third');
  assert.equal(completed[0].elapsed, 5);
  assert.equal(completed[0].progress, 1);
  assert.equal(completed[0].complete, true);
  assert.equal(completed[0].playing, false);
  timeline.play();
  assert.equal(timeline.getState().index, 0);
  assert.equal(timeline.getState().complete, false);
});

test('manual step navigation preserves play or pause and clears completion', () => {
  const timeline = createTimeline({ steps });
  timeline.seek(1);
  assert.equal(timeline.getState().playing, false);
  timeline.play();
  timeline.update(.75);
  timeline.seek(2);
  assert.equal(timeline.getState().playing, true);
  assert.equal(timeline.getState().elapsed, 0);
  timeline.update(5);
  timeline.seek(0);
  assert.equal(timeline.getState().complete, false);
  assert.equal(timeline.getState().playing, false);
});

test('reset restores the start and invalid input cannot corrupt the clock', () => {
  const timeline = createTimeline({ steps });
  timeline.play();
  for (const dt of [-1, Infinity, NaN, undefined, 0]) timeline.update(dt);
  assert.equal(timeline.getState().elapsed, 0);
  for (const index of [-1, 3, 1.5, NaN]) assert.throws(() => timeline.seek(index), RangeError);
  timeline.update(7);
  timeline.reset();
  assert.deepEqual(timeline.getState(), {
    index: 0, elapsed: 0, playing: false, complete: false, progress: 0, step: steps[0],
  });
  assert.throws(() => createTimeline({ steps: [] }), TypeError);
  assert.throws(() => createTimeline({ steps: [{ duration: 0 }] }), TypeError);
});

test('the first mechanism completes without entering additional mechanisms', () => {
  const timeline = createTimeline({ steps: glutamateMechanism.steps });
  timeline.play();
  timeline.update(1000);
  const state = timeline.getState();
  assert.equal(state.step.key, 'ros');
  assert.equal(state.complete, true);
  assert.ok(glutamateMechanism.steps.every(step => step.state.damage === 0));
});
