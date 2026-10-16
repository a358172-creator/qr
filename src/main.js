import './styles.css';
import { bindInteractions } from './interactions.js';
import { createEvidenceInterface } from './evidence/interface.js';

const ui = bindInteractions();
const evidence = createEvidenceInterface();
let atlas;
const showUnavailable = (lost = false) => {
  document.querySelector('#scene-loading').hidden = true;
  if (lost) document.querySelector('#scene-error-text').textContent = 'The graphics connection was interrupted. The scene will recover when the connection is restored.';
  document.querySelector('#scene-error').hidden = false;
  ui.unavailable();
  evidence.unavailable();
};
try {
  const { createAtlas } = await import('./scene.js');
  atlas = await createAtlas(document.querySelector('#synapse-canvas'), {
    hotspotLayer: document.querySelector('#hotspots-layer'),
    labelLayer: document.querySelector('#labels-layer'),
    onView: state => { ui.updateView(state); evidence.updateView(state); },
    onSelect: ui.select,
    onTimeline: ui.updateTimeline,
    onProgress: ui.setProgress,
    onRegion: ui.showRegion,
    onContextLost: lost => { if (lost) showUnavailable(true); else { document.querySelector('#scene-error').hidden = true; ui.available(); evidence.available(); } },
  });
  ui.attachScene(atlas);
  evidence.attachScene(atlas);
  await atlas.switchExperience('menu');
  document.querySelector('#scene-loading').hidden = true;
  document.querySelector('#detail-text').setAttribute('aria-live', 'polite');
  if (import.meta.env.DEV) {
    window.__atlas = { getState: () => atlas.getState() };
    window.__evidence = { getState: () => evidence.getState() };
  }
} catch (error) {
  console.error('Unable to initialize the WebGL atlas:', error);
  showUnavailable();
}
if (import.meta.hot) import.meta.hot.dispose(() => { ui.dispose(); evidence.dispose(); atlas?.dispose(); });
window.addEventListener('pagehide', event => { if (!event.persisted) { ui.dispose(); evidence.dispose(); atlas?.dispose(); } }, { once: true });
