/** Park live mechanism sessions when changing experiences. Unlike leaving an
 * atlas mechanism, this action never applies a model's resetOnExit policy. */
export function createExperienceBookmarks() {
  const experiences = new Map(), evidence = new Map();
  const copy = bookmark => bookmark && ({ ...bookmark, camera: [...bookmark.camera], target: [...bookmark.target] });
  return {
    save(experience, bookmark) {
      if (!['atlas', 'evidence'].includes(experience)) return;
      bookmark.session.timeline.pause();
      const saved = copy(bookmark);
      experiences.set(experience, saved);
      if (experience === 'evidence') evidence.set(bookmark.session.definition.id, saved);
    },
    get(experience, mechanismId) {
      const saved = experience === 'evidence' && mechanismId ? evidence.get(mechanismId) : experiences.get(experience);
      return copy(saved);
    },
  };
}
