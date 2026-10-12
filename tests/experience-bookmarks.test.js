import test from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceBookmarks } from '../src/core/experience-bookmarks.js';
import { createMechanismSession } from '../src/core/mechanism-session.js';
import { plasticityMechanism } from '../src/mechanisms/synaptic-plasticity.js';
import { microgliaMechanism } from '../src/mechanisms/microglia.js';

const bookmark = session => ({ session, view: 'synapse', camera: [2, 3, 9], target: [.5, -.2, 0], selected: 'spine', exploring: true, width: 1280, height: 900 });
const state = session => ({ time: session.time, index: session.timeline.getState().index, elapsed: session.timeline.getState().elapsed, state: { ...session.state } });

for (const definition of [plasticityMechanism, microgliaMechanism]) {
  test(`${definition.id}: changing experience parks the exact state despite resetOnExit`, () => {
    assert.equal(definition.resetOnExit, true);
    const saved = createExperienceBookmarks();
    const atlas = createMechanismSession(definition, { update() {} });
    atlas.seek(4); atlas.timeline.play(); atlas.advance(.375);
    const before = state(atlas), pose = bookmark(atlas);
    saved.save('atlas', pose);
    atlas.advance(100);
    const evidence = createMechanismSession({ ...definition, id: 'e-test' }, { update() {} });
    evidence.seek(2); evidence.timeline.play(); evidence.advance(.75);
    saved.save('evidence', bookmark(evidence));
    const restored = saved.get('atlas');
    assert.equal(restored.session, atlas);
    assert.equal(atlas.timeline.getState().playing, false);
    assert.deepEqual(state(atlas), before);
    assert.deepEqual(restored.camera, pose.camera);
    assert.deepEqual(restored.target, pose.target);
    assert.equal(restored.selected, 'spine');
    assert.equal(restored.exploring, true);
    restored.session.timeline.play(); restored.session.advance(.125);
    assert.ok(Math.abs(atlas.time - before.time - .125) < 1e-9);
  });
}

test('exposure sessions retain independent bookmarks without sharing mutable camera arrays', () => {
  const saved = createExperienceBookmarks();
  const first = createMechanismSession({ ...plasticityMechanism, id: 'e-feso4' }, { update() {} });
  const second = createMechanismSession({ ...plasticityMechanism, id: 'e-quin' }, { update() {} });
  first.seek(3); second.seek(1);
  const pose = bookmark(first);
  saved.save('evidence', pose);
  pose.camera[0] = 999;
  saved.save('evidence', { ...bookmark(second), camera: [7, 4, 10], selected: 'nmda' });
  const restored = saved.get('evidence', 'e-feso4');
  assert.equal(restored.session, first);
  assert.equal(restored.session.timeline.getState().index, 3);
  assert.deepEqual(restored.camera, [2, 3, 9]);
  restored.camera[1] = 900;
  assert.deepEqual(saved.get('evidence', 'e-feso4').camera, [2, 3, 9]);
  assert.equal(saved.get('evidence').session, second);
  assert.equal(saved.get('evidence', 'e-quin').selected, 'nmda');
  assert.equal(saved.get('evidence', 'missing'), undefined);
  saved.save('menu', bookmark(first));
  assert.equal(saved.get('evidence').session, second);
});
