const sequenceKeys = ['ampa', 'nmda', 'calcium', 'ros', 'caspases'];

export function bindInteractions(scene, { setPanel, details, labelsLayer }) {
  let labels = true; let paused = false; let sequence = null; let step = 0;
  const modeIndicator = document.querySelector('#mode-indicator');
  document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('active', b === button));
    const mode = button.dataset.mode; scene.setMode(mode); modeIndicator.textContent = mode === 'overload' ? 'Sobrecarga excitotóxica' : 'Estado fisiológico';
    setPanel(details[mode]);
  }));
  document.querySelectorAll('[data-select]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-select]').forEach((b) => b.classList.toggle('selected', b === button)); scene.select(button.dataset.select);
  }));
  document.querySelector('#pause-btn').addEventListener('click', (e) => { paused = !paused; scene.setPlaying(!paused); e.currentTarget.textContent = paused ? '▷' : 'Ⅱ'; e.currentTarget.setAttribute('aria-pressed', String(paused)); e.currentTarget.setAttribute('aria-label', paused ? 'Reanudar animación' : 'Pausar animación'); });
  document.querySelector('#labels-btn').addEventListener('click', (e) => { labels = !labels; labelsLayer.classList.toggle('hidden', !labels); e.currentTarget.setAttribute('aria-pressed', String(labels)); });
  document.querySelector('#reset-btn').addEventListener('click', () => scene.reset());
  const advance = () => { document.querySelectorAll('.sequence-steps li').forEach((li) => li.classList.toggle('active', Number(li.dataset.step) === step)); const key = sequenceKeys[step]; scene.select(key); step = (step + 1) % sequenceKeys.length; };
  document.querySelector('#sequence-btn').addEventListener('click', (e) => { if (sequence) { clearInterval(sequence); sequence = null; e.currentTarget.innerHTML = '<span aria-hidden="true">▷</span> Guiar secuencia'; return; } step = 0; advance(); sequence = setInterval(advance, 3500); e.currentTarget.innerHTML = '<span aria-hidden="true">■</span> Detener secuencia'; document.querySelector('#sequence').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  document.querySelector('[data-open-references]').addEventListener('click', () => { const section = document.querySelector('#references'); section.hidden = false; section.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
}
