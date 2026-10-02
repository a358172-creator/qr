import { createTimeline } from './timeline.js';

/** One independent, resumable narrative state, driven by the shared renderer. */
export function createMechanismSession(definition, model, onChange) {
  const initial = { ...(model.initialState || definition.initialState || definition.steps[0].state) };
  const state = { ...initial };
  let time = 0;
  const timeline = createTimeline({ steps: definition.steps, onChange });
  return {
    definition, model, timeline, state,
    get time() { return time; },
    advance(dt) {
      if (!timeline.getState().playing || !Number.isFinite(dt) || dt <= 0) return;
      const before = timeline.getState();
      timeline.update(dt);
      const after = timeline.getState();
      const total = definition.steps.reduce((sum, step) => sum + step.duration, 0);
      const consumed = Math.max(0, (after.progress - before.progress) * total);
      time += consumed;
      for (const key of Object.keys(state)) {
        const rate = definition.responseRates?.[key] ?? 3;
        const mix = 1 - Math.exp(-rate * consumed);
        state[key] += (after.step.state[key] - state[key]) * mix;
      }
    },
    seek(index) {
      if (!Number.isInteger(index) || index < 0 || index >= definition.steps.length) {
        throw new RangeError('Timeline step index is outside the sequence.');
      }
      // Assign before notifying: camera, captions and scene observe one state.
      Object.assign(state, definition.steps[index].state);
      time = definition.steps.slice(0, index).reduce((sum, step) => sum + step.duration, 0);
      timeline.seek(index);
    },
    reset() { time = 0; Object.assign(state, initial); timeline.reset(); },
    leave() {
      timeline.pause();
      if (definition.resetOnExit) { time = 0; Object.assign(state, initial); timeline.reset(); }
    },
    render({ selected = null, detail = true } = {}) {
      const frame = timeline.getState();
      model.update({ time, state, stepIndex: frame.index, elapsed: frame.elapsed, selected, detail });
    },
  };
}
