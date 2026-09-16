import './styles.css';
import { createSynapse } from './scene.js';
import { bindInteractions } from './interactions.js';

const details = {
  physiological: ['Estado fisiológico', 'Señalización regulada', 'La liberación moderada de glutamato y la activación regulada de receptores contribuyen a la comunicación sináptica.', 'Representación conceptual de un equilibrio dinámico.'],
  overload: ['Sobrecarga excitotóxica', 'Exceso de señal excitadora', 'Una activación sostenida puede relacionarse con sobrecarga de Ca²⁺, alteración mitocondrial, aumento de ROS y vías de daño celular.', 'La secuencia ilustra mecanismos relacionados, no una relación causal cuantificada.'],
};
const labelsLayer = document.querySelector('#labels-layer');
const setPanel = (entry) => {
  document.querySelector('#panel-index').textContent = entry[0];
  document.querySelector('#detail-title').textContent = entry[1];
  document.querySelector('#detail-text').textContent = entry[2];
  document.querySelector('#detail-note').textContent = entry[3];
};
const scene = createSynapse(document.querySelector('#synapse-canvas'), (_key, entry) => setPanel(entry));

function renderLabels() {
  if (!labelsLayer.classList.contains('hidden')) {
    labelsLayer.replaceChildren(...scene.getLabels().map(({ name, position }) => {
      const p = scene.project(position); const el = document.createElement('span'); el.className = 'scene-label'; el.textContent = name;
      el.style.left = `${(p.x * .5 + .5) * 100}%`; el.style.top = `${(-p.y * .5 + .5) * 100}%`; el.style.opacity = p.z > 1 ? '0' : '1'; return el;
    }));
  }
  requestAnimationFrame(renderLabels);
}
renderLabels();
bindInteractions(scene, { setPanel, details, labelsLayer });
