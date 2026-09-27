/**
 * Narrative clock driven by the scene's animation frame, in seconds.
 * Pausing never changes elapsed time. Camera exploration can therefore pause
 * this controller, move independently, and resume at the same narrative instant.
 */
export function createTimeline({ steps, onChange, onComplete } = {}) {
  if (!Array.isArray(steps) || !steps.length) {
    throw new TypeError('A timeline requires at least one step.');
  }
  const durations = steps.map(step => {
    if (!Number.isFinite(step.duration) || step.duration <= 0) {
      throw new TypeError('Each timeline step needs a positive duration in seconds.');
    }
    return step.duration;
  });
  const starts = [];
  let total = 0;
  durations.forEach(duration => { starts.push(total); total += duration; });
  let index = 0, elapsed = 0, playing = false, complete = false;

  function getState() {
    return {
      index, elapsed, playing, complete,
      progress: (starts[index] + elapsed) / total,
      step: steps[index],
    };
  }
  const notify = () => onChange?.(getState());

  function play() {
    if (playing) return;
    if (complete) { index = 0; elapsed = 0; complete = false; }
    playing = true;
    notify();
  }

  function pause() {
    if (!playing) return;
    playing = false;
    notify();
  }

  function seek(nextIndex) {
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= steps.length) {
      throw new RangeError('Timeline step index is outside the sequence.');
    }
    index = nextIndex;
    elapsed = 0;
    complete = false;
    notify();
  }

  function reset() {
    index = 0;
    elapsed = 0;
    playing = false;
    complete = false;
    notify();
  }

  function update(dt) {
    if (!playing || !Number.isFinite(dt) || dt <= 0) return;
    let remaining = dt;
    // Preserve overflow across boundaries so the narrative does not depend on
    // frame rate. Callbacks may pause the sequence at a boundary.
    while (playing && remaining > 0) {
      const available = durations[index] - elapsed;
      if (remaining < available) { elapsed += remaining; break; }
      remaining -= available;
      if (index === steps.length - 1) {
        elapsed = durations[index];
        playing = false;
        complete = true;
        notify();
        onComplete?.(getState());
        break;
      }
      index += 1;
      elapsed = 0;
      notify();
    }
  }

  return { play, pause, seek, reset, update, getState };
}
