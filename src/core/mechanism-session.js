import { createTimeline } from './timeline.js';

/** One independent, resumable narrative state, driven by the shared renderer. */
export function createMechanismSession(definition, model, onChange) {
  const initial = { ...(model.initialState || definition.initialState || definition.steps[0].state) };
  const state = { ...initial };
  let time = 0;
  const timeline = createTimeline({
    steps: definition.steps,
    onChange,
    onAdvance(consumed, frame) {
      time = frame.time;
      // Each stage has its own response target. Integrating its exact share of
      // a frame preserves the same trajectory at high and low frame rates.
      for (const key of Object.keys(state)) {
        const rate = definition.responseRates?.[key] ?? 3;
        const mix = -Math.expm1(-rate * consumed);
        state[key] += (frame.step.state[key] - state[key]) * mix;
      }
    },
  });
  return {
    definition, model, timeline, state,
    get time() { return time; },
    advance(dt) { timeline.update(dt); },
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
    render({ selected = null, detail = true, viewDistance } = {}) {
      const frame = timeline.getState();
      model.update({ time, state, stepIndex: frame.index, elapsed: frame.elapsed, selected, detail, viewDistance });
    },
  };
}
