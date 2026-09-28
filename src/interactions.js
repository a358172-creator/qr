export function bindInteractions() {
  const $ = selector => document.querySelector(selector), all = selector => document.querySelectorAll(selector);
  const abort = new AbortController();
  let scene, mechanism, stepButtons = [], currentView = 'hub', currentIndex = 0, toastTimer, labels = true, transitioning = false;
  const on = (element, event, handler) => element.addEventListener(event, handler, { signal: abort.signal });
  function setMechanism(next) {
    if (!next || next.id === mechanism?.id) return;
    mechanism = next;
    $('#atlas').dataset.mechanism = next.id;
    $('#timeline-track').replaceChildren();
    stepButtons = next.steps.map((step, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.step = index;
      button.setAttribute('aria-label', `Etapa ${index + 1}: ${step.title}`); button.title = step.title;
      $('#timeline-track').append(button); return button;
    });
    $('#context-panel').hidden = true;
    $('#narrative').setAttribute('aria-label', `Recorrido: ${next.title}`);
    $('#labels-layer').setAttribute('aria-label', `Estructuras: ${next.title}`);
  }
  function closeCallout() {
    const restoreFocus = $('#context-panel').contains(document.activeElement);
    $('#context-panel').hidden = true; scene?.select(null);
    if (restoreFocus) $('#synapse-canvas').focus({ preventScroll: true });
  }
  function select(key) {
    if (!key) { $('#context-panel').hidden = true; $('#structure-select').value = ''; return; }
    const entry = mechanism?.content[key]; if (!entry) return;
    $('#panel-index').textContent = entry.category; $('#detail-title').textContent = entry.title;
    $('#detail-text').textContent = entry.text; $('#detail-note').textContent = entry.note;
    $('#context-panel').hidden = false;
    $('#structure-select').value = key;
  }
  function updateView({ view, transitioning: moving = false, loading = false, mechanism: next }) {
    setMechanism(next); transitioning = moving; currentView = view;
    if (scene) {
      $('#scene-loading').hidden = !loading;
      if (loading) $('#scene-loading p').textContent = 'Preparando el microambiente celular';
    }
    $('#atlas').dataset.view = view; $('#atlas').classList.toggle('transitioning', transitioning);
    all('.scale-navigation button').forEach(button => {
      if (button.dataset.view === view) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
    const detail = view === 'synapse';
    $('#scene-eyebrow').textContent = detail ? mechanism.eyebrow : view === 'neuron' ? '00 / UNA NEURONA, UN UNIVERSO' : '01 / TERRITORIO NEURONAL';
    if (detail) {
      const emphasis = document.createElement('em'); emphasis.textContent = mechanism.heading[1];
      $('#scene-title').replaceChildren(document.createTextNode(mechanism.heading[0]), document.createElement('br'), emphasis);
    } else $('#scene-title').innerHTML = view === 'neuron' ? 'Donde todo<br><em>se conecta.</em>' : 'El paisaje<br><em>sináptico.</em>';
    $('#scene-description').textContent = detail ? mechanism.title : 'Cada conexión, una puerta al universo celular.';
    $('.scale-navigation [data-view="synapse"]').textContent = detail ? mechanism.navLabel : 'Sinapsis';
    $('#structure-picker').hidden = !detail;
    $('#specimen-note').hidden = detail || view === 'neuron';
    $('#narrative').hidden = !detail;
    $('#scale-name').textContent = detail ? mechanism.scaleLabel : 'ESCALA CELULAR';
    $('#scale-index').textContent = detail ? mechanism.scaleIndex : view === 'neuron' ? '00' : '01';
    all('.transport button, .timeline-track button').forEach(button => { button.disabled = transitioning; });
    $('#region-toast').hidden = true;
    if (detail && !transitioning) {
      const state = scene?.getState();
      updateTimeline(state ? { ...state.timeline, exploring: state.exploring } : { index: currentIndex, playing: false, exploring: false });
    }
  }
  function updateTimeline(state) {
    setMechanism(state.mechanism);
    if (!mechanism) return;
    const { index = 0, playing = false, exploring = false, complete = false } = state;
    const keys = state.availableKeys || scene?.getState().availableKeys || [];
    const picker = $('#structure-select'), previous = picker.value;
    picker.replaceChildren(new Option('Elegir estructura…', ''));
    keys.filter(key => mechanism.content[key]).forEach(key => picker.add(new Option(mechanism.content[key].title, key)));
    picker.value = keys.includes(previous) ? previous : '';
    picker.disabled = transitioning;
    currentIndex = index;
    const step = mechanism.steps[index];
    $('#step-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(mechanism.steps.length).padStart(2, '0')}`;
    $('#step-title').textContent = step.title; $('#step-caption').textContent = step.caption;
    $('#play-icon').textContent = playing ? 'Ⅱ' : '▷';
    $('#play-btn').setAttribute('aria-label', playing ? 'Pausar recorrido' : complete ? 'Repetir recorrido' : 'Reproducir recorrido');
    $('#explore-btn').textContent = exploring ? 'Continuar' : 'Explorar';
    $('#explore-btn').setAttribute('aria-pressed', String(exploring));
    $('#previous-btn').disabled = transitioning || index === 0; $('#next-btn').disabled = transitioning || index === mechanism.steps.length - 1;
    stepButtons.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); button.classList.toggle('done', i < index); });
    $('#hint-text').innerHTML = playing ? 'Observa el recorrido <b>·</b> Pausa para explorar' : 'Arrastra para explorar <b>·</b> Rueda para acercarte';
  }
  on($('#timeline-track'), 'click', event => { const step = event.target.closest('button[data-step]'); if (step && !step.disabled) scene?.seek(Number(step.dataset.step)); });
  on($('#structure-select'), 'change', event => scene?.select(event.target.value || null));
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
    showRegion(entry) { clearTimeout(toastTimer); $('#region-toast').textContent = entry.error ? entry.title : `${entry.title} · Próximamente`; $('#region-toast').hidden = false; toastTimer = setTimeout(() => { $('#region-toast').hidden = true; }, 3600); },
    setProgress(value) { $('#timeline-track').style.setProperty('--progress', value); },
    unavailable() { all('.scale-navigation button, .transport button, .view-tools button, .view-tools select, .timeline-track button').forEach(button => { button.disabled = true; }); $('#narrative').hidden = true; },
    available() { all('.scale-navigation button, .transport button, .view-tools button, .view-tools select, .timeline-track button').forEach(button => { button.disabled = false; }); updateView({ view: currentView, transitioning: false }); },
    dispose() { abort.abort(); clearTimeout(toastTimer); },
  };
}
