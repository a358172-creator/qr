import './styles.css';
import { bindInteractions } from './interactions.js';

const ui = bindInteractions();
let atlas;
const showUnavailable = (lost = false) => {
  document.querySelector('#scene-loading').hidden = true;
  if (lost) document.querySelector('#scene-error-text').textContent = 'La conexión gráfica se ha interrumpido. La escena se recuperará cuando vuelva la conexión.';
  document.querySelector('#scene-error').hidden = false;
  ui.unavailable();
};
try {
  const { createAtlas } = await import('./scene.js');
  atlas = await createAtlas(document.querySelector('#synapse-canvas'), {
    hotspotLayer: document.querySelector('#hotspots-layer'),
    labelLayer: document.querySelector('#labels-layer'),
    onView: ui.updateView,
    onSelect: ui.select,
    onTimeline: ui.updateTimeline,
    onProgress: ui.setProgress,
    onRegion: ui.showRegion,
    onContextLost: lost => { if (lost) showUnavailable(true); else { document.querySelector('#scene-error').hidden = true; ui.available(); } },
  });
  ui.attachScene(atlas);
  document.querySelector('#scene-loading').hidden = true;
  document.querySelector('#detail-text').setAttribute('aria-live', 'polite');
  if (import.meta.env.DEV) window.__atlas = { getState: () => atlas.getState() };
} catch (error) {
  console.error('No se pudo iniciar el atlas WebGL:', error);
  showUnavailable();
}
if (import.meta.hot) import.meta.hot.dispose(() => { ui.dispose(); atlas?.dispose(); });
window.addEventListener('pagehide', event => { if (!event.persisted) { ui.dispose(); atlas?.dispose(); } }, { once: true });
