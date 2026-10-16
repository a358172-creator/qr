import { AGES, EXPOSURES, ASSAYS, getEvidence, getEvidencePresentation, visualSelection, REFERENCES } from './data.js';
import './styles.css';

const quinInterpretation = 'For results without significant differences following acute QUIN exposure, treatment duration and preparation characteristics are possible factors for interpretation. Some excitotoxic mechanisms may require sustained stimulation and functional cellular organization.';

// DOM, results and interpretation live separately from biological scene state.
// Age and assay never enter the renderer or the mechanism factories.
export function createEvidenceInterface() {
  const root = document.querySelector('#atlas');
  const abort = new AbortController();
  let scene, busy = false, visitedEvidence = false, experience = 'menu';
  const state = { age: 'PN3', exposure: 'control', assay: 'tbars' };
  const $ = selector => document.querySelector(selector);
  const on = (element, event, fn) => element.addEventListener(event, fn, { signal: abort.signal });
  root.insertAdjacentHTML('beforeend', `
    <section id="experience-menu" class="experience-menu" aria-labelledby="experience-title">
      <div class="menu-intro"><p class="eyebrow">NEUROSCIENCE / TWO PERSPECTIVES</p><h1 id="experience-title">From connection<br>to <em>mechanism.</em></h1><p>Explore cellular organization and examine the evidence that helps shape new questions.</p></div>
      <div class="experience-options">
        <button type="button" data-experience="atlas" disabled>
          <svg class="menu-specimen" viewBox="0 0 300 125" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="12" opacity=".25" d="M10 89 Q100 49 288 82"/><path stroke-width="3" d="M10 85 Q100 51 288 77"/><path stroke-width="7" opacity=".5" d="M75 67 Q88 51 79 32 M155 66 Q152 48 166 28 M223 68 Q235 59 235 48"/><path stroke-width="2" d="M70 26 Q68 13 82 14 Q99 14 92 29 Q85 36 77 30 M151 23 Q150 8 168 8 Q184 11 178 24 Q168 34 156 29 M226 46 Q218 32 233 30 Q248 29 247 42 Q244 51 231 49"/></g><g fill="currentColor"><circle cx="82" cy="23" r="3"/><circle cx="166" cy="20" r="3"/><circle cx="234" cy="41" r="3"/></g></svg>
          <span class="eyebrow">01 / INTERACTIVE ATLAS</span><h2>Pathophysiological<br><em>mechanisms</em></h2><p>Three-dimensional exploration of cellular and molecular processes associated with neurotoxicity and synaptic plasticity.</p><span class="menu-enter">Explore the atlas <b aria-hidden="true">↗</b></span>
        </button>
        <button type="button" data-experience="evidence" disabled>
          <svg class="menu-specimen" viewBox="0 0 300 125" aria-hidden="true"><g fill="none" stroke="currentColor"><path stroke-width="3" d="M31 57 C44 13 192 1 257 32 C321 66 243 118 149 108 C67 100 15 96 31 57Z"/><path stroke-width="2" opacity=".7" d="M43 59 C46 37 66 33 77 29 Q88 27 84 45 L71 72 Q69 83 83 85 Q97 87 104 68 L120 27 Q126 16 135 24 Q143 29 132 61 Q117 87 132 92 Q149 96 159 67 L174 25 Q182 20 190 28 Q196 32 183 63 Q169 92 185 94 Q198 94 211 65 L226 36 Q235 31 243 40 Q253 62 229 79"/></g><g fill="currentColor" opacity=".7"><circle cx="115" cy="55" r="4"/><circle cx="173" cy="52" r="4"/><circle cx="207" cy="47" r="4"/></g></svg>
          <span class="eyebrow">02 / EXPERIMENTAL STUDY</span><h2>Experimental<br><em>evidence</em></h2><p>Cerebral redox vulnerability during postnatal development.</p><span class="menu-enter">Explore the study <b aria-hidden="true">↗</b></span>
        </button>
      </div><p class="menu-footnote">Conceptual anatomy · Original graphs · Critical reading of the evidence</p><p id="evidence-availability" role="status" hidden>The 3D model is unavailable. You can view the figures and methodology in Experimental evidence.</p>
    </section>
    <section id="evidence-controls" class="evidence-controls" aria-label="Select an experimental result" hidden>
      <label>Postnatal age<select id="evidence-age"></select></label>
      <label>Exposure · 2 hours<select id="evidence-exposure"></select></label>
      <label>Assay<select id="evidence-assay"></select></label>
      <p><button type="button" id="jump-to-results">View results ↓</button></p>
    </section>
    <div id="evidence-model-heading" class="evidence-model-heading" hidden><p class="eyebrow">MOLECULAR MECHANISM / LITERATURE</p><h2 id="evidence-model-title"></h2></div>
    <aside id="evidence-panel" class="evidence-panel" aria-labelledby="evidence-title" hidden>
      <header><p class="eyebrow">EXPERIMENTAL EVIDENCE</p><h2 id="evidence-title">Redox <em>vulnerability.</em></h2><p class="study-line">Wistar rat brain · Homogenate · 2 h</p><button type="button" id="jump-to-model">Back to model ↑</button></header>
      <section class="evidence-results" aria-labelledby="evidence-assay-title">
        <div class="result-heading"><h3 id="evidence-assay-title"></h3><span id="evidence-selection"></span></div>
        <p id="evidence-status" role="status"></p>
        <button type="button" class="chart-open" id="open-evidence-chart" aria-label="Enlarge original graph">
          <span class="evidence-chart"><img alt=""/><span class="chart-selection" aria-hidden="true"></span></span>
          <span class="chart-action">Original figure · Enlarge ↗</span>
        </button>
        <p class="chart-key"><i aria-hidden="true"></i> Current selection</p>
        <p id="evidence-units"></p><p id="evidence-numbers"></p>
        <p id="evidence-summary"></p><p id="evidence-comparison"></p><p id="evidence-statistics"></p>
        <details><summary>Figure legend</summary><p id="evidence-caption"></p><p id="evidence-provenance"></p><a id="evidence-original" download>Download original figure ↗</a></details>
      </section>
      <section class="evidence-relationship"><p class="eyebrow">MECHANISM DESCRIBED IN THE LITERATURE</p><p id="evidence-mechanism"></p><button id="evidence-context-link" type="button" data-atlas-target="mitochondrial">Explore the mechanism in the atlas ↗</button></section>
      <section id="quin-context" class="quin-context" hidden><p class="eyebrow">INTERPRETATION / ACUTE EXPOSURE</p><p>${quinInterpretation}</p><p>Exposure lasted <strong>2 hours</strong>. Possible time dependence requires specific studies.</p><details><summary>Context: kynurenine pathway</summary><ol class="kynurenine-path"><li>Tryptophan</li><li>Kynurenine <small>↳ Branch toward kynurenic acid (KYNA)</small></li><li>3-Hydroxykynurenine</li><li>3-Hydroxyanthranilic acid</li><li>Intermediates</li><li>Quinolinic acid (QUIN)</li></ol><p>QUIN can activate NMDA receptors; KYNA modulates glutamatergic receptors depending on concentration and context.</p></details></section>
      <div class="evidence-reading"><button type="button" id="evidence-info">Methodology and references ↗</button><details><summary>Postnatal development and cellular context</summary><p>Energy metabolism, redox regulation, cellular maturation and connection organization change during development. These relationships, described in the literature, guide exploration of the atlas.</p><button type="button" data-atlas-target="signaling">A · Synaptic plasticity ↗</button><button type="button" data-atlas-target="microglia">C · Microglial remodeling ↗</button></details></div>
    </aside>`);
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="evidence-methods" aria-labelledby="evidence-methods-title"><button type="button" class="close" data-close-dialog="evidence-methods" aria-label="Close methodology">×</button><p class="eyebrow">EXPERIMENTAL METHODOLOGY</p><h2 id="evidence-methods-title">Three perspectives on the brain response</h2><p>Age-Dependent Cerebral Redox Vulnerability to Excitotoxic, Oxidative, and Mitochondrial Challenges.</p><p>Wistar rat brains: PN3, PN5, PN9, PN12 and PN30. Independent 2-hour exposures: control, FeSO₄ 1 mM, QUIN 100 µM and 3-NP 3 mM. Mean ± SEM, n = 5–6. Kruskal–Wallis analysis followed by Dunn; statistical comparisons follow each figure. MTT is presented for PN5, PN9, PN12 and PN30.</p><div id="assay-methods"></div><p>DCFDA, TBARS and MTT describe complementary dimensions of the response: oxidative processes, lipid oxidation products and reducing capacity.</p><h3>Scope of the preparation</h3><p>Assays were performed in brain homogenates, which can retain molecular components and enzymatic activity with limited cellular and synaptic organization. The 3D models contextualize mechanisms described in the literature; the figures present the experimental results.</p><h3>Study figures</h3><p>Original figures from the experimental analysis. Mean ± SEM, n = 5–6; statistical comparisons follow the original figure.</p><h3>Literature and methods</h3><ul class="evidence-references" id="evidence-references"></ul></dialog>
    <dialog id="evidence-chart-dialog" class="chart-dialog" aria-labelledby="chart-dialog-title"><button type="button" class="close" data-close-dialog="evidence-chart-dialog" aria-label="Close graph">×</button><p class="eyebrow">EXPERIMENTAL FIGURE</p><h2 id="chart-dialog-title"></h2><div class="chart-scroll"><img id="large-evidence-chart" alt=""/></div><p id="large-chart-caption"></p><a id="large-chart-source" target="_blank" rel="noopener">Open full-size figure ↗</a></dialog>`);
  for (const age of AGES) $('#evidence-age').add(new Option(age.id, age.id));
  for (const exposure of EXPOSURES) $('#evidence-exposure').add(new Option(`${exposure.label}${exposure.concentration ? ` — ${exposure.concentration}` : ''}`, exposure.id));
  for (const assay of ASSAYS) $('#evidence-assay').add(new Option(assay.label, assay.id));
  $('#evidence-assay').value = state.assay;
  for (const assay of ASSAYS) {
    const section = document.createElement('section');
    const heading = document.createElement('h3'); heading.textContent = assay.label;
    const method = document.createElement('p'); method.textContent = assay.method;
    const limitation = document.createElement('p'); limitation.textContent = assay.limitation;
    section.append(heading, method, limitation); $('#assay-methods').append(section);
  }
  for (const ref of REFERENCES) {
    const li = document.createElement('li'), link = document.createElement('a'), note = document.createElement('p');
    link.href = ref.url; link.textContent = ref.title; link.target = '_blank'; link.rel = 'noopener';
    note.textContent = ref.note || ''; li.append(link, note); $('#evidence-references').append(li);
  }
  function render() {
    const assay = ASSAYS.find(item => item.id === state.assay);
    const exposure = EXPOSURES.find(item => item.id === state.exposure);
    const result = getEvidencePresentation(state.age, state.exposure, state.assay);
    $('#evidence-assay-title').textContent = assay.title;
    $('#evidence-selection').textContent = `${state.age} · ${exposure.label}`;
    $('#evidence-model-title').textContent = exposure.label === 'Control' ? 'Reference preparation' : `${exposure.label} · potential mechanism`;
    $('#evidence-status').textContent = result.status === 'not-evaluated' ? 'Not evaluated · MTT at PN3.' : 'Experimental result';
    $('#evidence-status').dataset.status = result.status;
    const img = $('.evidence-chart img'); img.src = assay.imagePath;
    img.alt = `${assay.title}. Complete groups and original annotations; selection: ${state.age}, ${exposure.label}. ${assay.displayUnit}.`;
    const box = visualSelection(state.assay, state.age, state.exposure);
    const highlight = $('.chart-selection'); highlight.hidden = !box;
    if (box) Object.assign(highlight.style, { left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` });
    $('.chart-key').hidden = !box;
    $('#evidence-units').textContent = result.unit;
    $('#evidence-numbers').textContent = result.sample;
    $('#evidence-numbers').hidden = !result.sample;
    $('#evidence-summary').textContent = result.summary;
    $('#evidence-comparison').textContent = result.comparison;
    $('#evidence-statistics').textContent = result.statistics;
    $('#evidence-statistics').hidden = !result.statistics;
    $('#evidence-caption').textContent = result.caption;
    $('#evidence-provenance').textContent = result.source;
    $('#evidence-original').href = assay.originalPath;
    $('#evidence-mechanism').textContent = exposure.mechanism;
    $('#evidence-context-link').dataset.atlasTarget = exposure.atlasTarget || 'mitochondrial';
    $('#evidence-context-link').textContent = exposure.atlasTarget === 'glutamate' ? 'B · Explore excitotoxicity ↗' : 'D · Explore redox mechanisms ↗';
    $('#quin-context').hidden = state.exposure !== 'quin';
    $('#chart-dialog-title').textContent = assay.title;
    $('#large-evidence-chart').src = assay.imagePath; $('#large-evidence-chart').alt = img.alt;
    $('#large-chart-caption').textContent = `${result.caption} Mean ± SEM, n = 5–6. Statistical comparisons follow the original figure.`;
    $('#large-chart-source').href = assay.imagePath;
  }
  function updateView(next) {
    if (!next.experience) return;
    experience = next.experience;
    root.dataset.experience = experience;
    $('#experience-menu').hidden = experience !== 'menu';
    for (const selector of ['#evidence-controls', '#evidence-panel', '#evidence-model-heading']) $(selector).hidden = experience !== 'evidence';
    $('#main-menu').hidden = experience === 'menu';
    $('#back-to-evidence').hidden = experience !== 'atlas' || !visitedEvidence;
    // Hidden scenes retain their canvas size; keyboard focus cannot enter their UI.
    for (const selector of ['#synapse-canvas', '#hotspots-layer', '#labels-layer', '#narrative', '.scene-footer', '.scale-navigation', '#context-panel']) $(selector).inert = experience === 'menu';
    $('#brand-home').setAttribute('aria-label', experience === 'atlas' ? 'Neuro Vista, return to the neuron' : 'Neuro Vista, main menu');
  }
  async function enter(next, mechanismId) {
    if (busy) return;
    if (!scene) {
      if (next === 'atlas') return;
      updateView({ experience: next });
      root.scrollTop = 0;
      return;
    }
    busy = true; $('#evidence-exposure').disabled = true;
    try {
      if (next === 'evidence') visitedEvidence = true;
      await scene.switchExperience(next, mechanismId || (next === 'evidence' ? EXPOSURES.find(item => item.id === state.exposure).mechanismKey : undefined));
      root.scrollTop = 0;
      if (next === 'menu') $('#experience-menu [data-experience="atlas"]').focus({ preventScroll: true });
    } catch (error) {
      console.error('Unable to switch experience:', error);
      $('#evidence-status').textContent = 'Unable to prepare the model. Results remain available.';
    } finally { busy = false; $('#evidence-exposure').disabled = false; }
  }
  for (const button of document.querySelectorAll('[data-experience] button[data-experience], #experience-menu [data-experience]')) on(button, 'click', () => enter(button.dataset.experience));
  on($('#main-menu'), 'click', () => enter('menu'));
  on($('#back-to-evidence'), 'click', () => enter('evidence'));
  on($('#evidence-age'), 'change', event => { state.age = event.target.value; render(); });
  on($('#evidence-assay'), 'change', event => { state.assay = event.target.value; render(); });
  on($('#jump-to-results'), 'click', () => { scene?.suspend(); $('#evidence-panel').scrollIntoView({ block: 'start' }); });
  on($('#jump-to-model'), 'click', () => { root.scrollTop = 0; $('#evidence-age').focus({ preventScroll: true }); });
  on($('#evidence-exposure'), 'change', async event => { state.exposure = event.target.value; render(); await enter('evidence'); });
  for (const button of document.querySelectorAll('[data-atlas-target]')) on(button, 'click', () => enter('atlas', button.dataset.atlasTarget));
  const openDialog = id => { scene?.suspend(); $(id).showModal(); };
  on($('#evidence-info'), 'click', () => openDialog('#evidence-methods'));
  on($('#open-evidence-chart'), 'click', () => openDialog('#evidence-chart-dialog'));
  for (const button of document.querySelectorAll('[data-close-dialog]')) on(button, 'click', () => $(`#${button.dataset.closeDialog}`).close());
  render(); updateView({ experience: 'menu' });
  return {
    attachScene(value) { scene = value; for (const button of document.querySelectorAll('#experience-menu [data-experience]')) button.disabled = false; },
    unavailable() {
      root.dataset.webgl = 'unavailable';
      $('#evidence-availability').hidden = false;
      $('#experience-menu [data-experience="evidence"]').disabled = false;
    },
    available() { delete root.dataset.webgl; $('#evidence-availability').hidden = true; },
    updateView,
    getState() { return { ...state, experience, busy, result: getEvidence(state.age, state.exposure, state.assay) }; },
    dispose() { abort.abort(); },
  };
}
