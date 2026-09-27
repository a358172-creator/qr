import { structures } from './content.js';
import { glutamateMechanism } from './mechanisms/glutamate.js';

export function bindInteractions() {
  const $ = selector => document.querySelector(selector), all = selector => document.querySelectorAll(selector);
  const abort = new AbortController();
  let scene, currentView = 'hub', currentIndex = 0, toastTimer, labels = true;
  const on = (element, event, handler) => element.addEventListener(event, handler, { signal: abort.signal });
  const extra = {
    terminal: { category: 'COMPARTIMENTO PRESINÁPTICO', title: 'Terminal presináptica', text: 'El extremo del axón establece contacto con la espina dendrítica. Las vesículas almacenan el neurotransmisor y lo liberan hacia la hendidura sináptica.', note: 'La sección de la membrana es un recurso de ilustración para ver el interior.' },
    vesicles: { category: 'ALMACENAMIENTO Y LIBERACIÓN', title: 'Vesículas sinápticas', text: 'Pequeños compartimentos delimitados por membrana que almacenan glutamato. Su fusión con la membrana presináptica permite liberar el neurotransmisor.', note: 'Las partículas y su movimiento son conceptuales.' },
    spine: { category: 'COMPARTIMENTO POSTSINÁPTICO', title: 'Espina dendrítica', text: 'La cabeza ensanchada recibe el contacto sináptico. Un cuello estrecho la conecta con la dendrita y contribuye a organizar la señalización local.', note: 'La forma corresponde a una espina tipo mushroom, una de varias morfologías posibles.' },
  };
  function closeCallout() {
    const restoreFocus = $('#context-panel').contains(document.activeElement);
    $('#context-panel').hidden = true; scene?.select(null);
    if (restoreFocus) $('#synapse-canvas').focus({ preventScroll: true });
  }
  function select(key) {
    if (!key) { $('#context-panel').hidden = true; return; }
    const entry = structures[key] || extra[key]; if (!entry) return;
    $('#panel-index').textContent = entry.category; $('#detail-title').textContent = entry.title;
    $('#detail-text').textContent = entry.text; $('#detail-note').textContent = entry.note;
    $('#context-panel').hidden = false;
  }
  function updateView({ view, transitioning }) {
    currentView = view;
    $('#atlas').dataset.view = view; $('#atlas').classList.toggle('transitioning', transitioning);
    all('.scale-navigation button').forEach(button => {
      if (button.dataset.view === view) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
    const detail = view === 'synapse';
    $('#scene-eyebrow').textContent = detail ? '02 / MICROAMBIENTE SINÁPTICO' : view === 'neuron' ? '00 / UNA NEURONA, UN UNIVERSO' : '01 / TERRITORIO NEURONAL';
    $('#scene-title').innerHTML = detail ? 'La intimidad<br><em>de una conexión.</em>' : view === 'neuron' ? 'Donde todo<br><em>se conecta.</em>' : 'El paisaje<br><em>sináptico.</em>';
    $('#scene-description').innerHTML = detail ? 'Excitotoxicidad<br>glutamatérgica.' : 'Cada conexión, una puerta<br>al universo celular.';
    $('#specimen-note').hidden = detail || view === 'neuron';
    $('#narrative').hidden = !detail;
    $('#scale-name').textContent = detail ? 'ESCALA SINÁPTICA' : 'ESCALA CELULAR';
    $('#scale-index').textContent = detail ? '02' : view === 'neuron' ? '00' : '01';
    all('.transport button, .timeline-track button').forEach(button => { button.disabled = transitioning; });
    $('#region-toast').hidden = true;
    if (detail && !transitioning) {
      const state = scene?.getState();
      updateTimeline(state ? { ...state.timeline, exploring: state.exploring } : { index: currentIndex, playing: false, exploring: false });
    }
  }
  const stepButtons = glutamateMechanism.steps.map((step, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.step = index;
    button.setAttribute('aria-label', `Etapa ${index + 1}: ${step.title}`); button.title = step.title;
    on(button, 'click', () => scene?.seek(index)); $('#timeline-track').append(button); return button;
  });
  function updateTimeline(state) {
    const { index = 0, playing = false, exploring = false, complete = false } = state;
    currentIndex = index;
    const step = glutamateMechanism.steps[index];
    $('#step-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(glutamateMechanism.steps.length).padStart(2, '0')}`;
    $('#step-title').textContent = step.title; $('#step-caption').textContent = step.caption;
    $('#play-icon').textContent = playing ? 'Ⅱ' : '▷';
    $('#play-btn').setAttribute('aria-label', playing ? 'Pausar recorrido' : complete ? 'Repetir recorrido' : 'Reproducir recorrido');
    $('#explore-btn').textContent = exploring ? 'Continuar' : 'Explorar';
    $('#explore-btn').setAttribute('aria-pressed', String(exploring));
    $('#previous-btn').disabled = index === 0; $('#next-btn').disabled = index === glutamateMechanism.steps.length - 1;
    stepButtons.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); button.classList.toggle('done', i < index); });
    $('#hint-text').innerHTML = playing ? 'Observa el recorrido <b>·</b> Pausa para explorar' : 'Arrastra para explorar <b>·</b> Rueda para acercarte';
  }
  function openDialog(id) { scene?.suspend(); $(id).showModal(); }
  all('.scale-navigation button').forEach(button => on(button, 'click', () => scene?.navigate(button.dataset.view)));
  on($('#brand-home'), 'click', event => { event.preventDefault(); scene?.navigate('neuron'); });
  on($('#play-btn'), 'click', () => scene?.playPause());
  on($('#explore-btn'), 'click', () => scene?.explore());
  on($('#previous-btn'), 'click', () => scene?.seek(currentIndex - 1));
  on($('#next-btn'), 'click', () => scene?.seek(currentIndex + 1));
  on($('#restart-btn'), 'click', () => { closeCallout(); scene?.restart(); });
  on($('#back-btn'), 'click', () => scene?.navigate('hub'));
  on($('#reset-btn'), 'click', () => scene?.resetView());
  on($('#labels-btn'), 'click', () => { labels = !labels; $('#labels-btn').setAttribute('aria-pressed', String(labels)); scene?.setLabels(labels); });
  on($('#panel-close'), 'click', () => { closeCallout(); $('#synapse-canvas').focus({ preventScroll: true }); });
  on($('#references-btn'), 'click', () => openDialog('#references'));
  on($('#error-references-btn'), 'click', () => openDialog('#references'));
  on($('#help-btn'), 'click', () => openDialog('#help'));
  on($('#close-references'), 'click', () => $('#references').close());
  on($('#close-help'), 'click', () => $('#help').close());
  for (const dialog of [$('#references'), $('#help')]) {
    on(dialog, 'click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  }
  on(document, 'keydown', event => { if (event.key === 'Escape' && !$('#context-panel').hidden) closeCallout(); });
  const hashReferences = () => { if (location.hash === '#references' && !$('#references').open) openDialog('#references'); };
  on(window, 'hashchange', hashReferences); hashReferences();
  return {
    attachScene(value) { scene = value; },
    updateView, updateTimeline, select,
    showRegion(entry) { clearTimeout(toastTimer); $('#region-toast').textContent = `${entry.title} · Próximamente`; $('#region-toast').hidden = false; toastTimer = setTimeout(() => { $('#region-toast').hidden = true; }, 3600); },
    setProgress(value) { $('#timeline-track').style.setProperty('--progress', value); },
    unavailable() { all('.scale-navigation button, .transport button, .view-tools button, .timeline-track button').forEach(button => { button.disabled = true; }); $('#narrative').hidden = true; },
    available() { all('.scale-navigation button, .transport button, .view-tools button, .timeline-track button').forEach(button => { button.disabled = false; }); updateView({ view: currentView, transitioning: false }); },
    dispose() { abort.abort(); clearTimeout(toastTimer); },
  };
}
