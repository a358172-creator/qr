import { AGES, EXPOSURES, ASSAYS, getEvidence, visualSelection, REFERENCES } from './data.js';
import './styles.css';

const conceptualWarning = 'Representación conceptual: los ensayos fueron realizados en homogeneizados cerebrales de ratas Wistar. Los modelos tridimensionales ilustran mecanismos celulares y moleculares descritos en la literatura, pero no representan observaciones directas de dichos procesos en las muestras experimentales.';
const quinInterpretation = 'La ausencia de modificaciones estadísticamente significativas tras la exposición aguda a QUIN podría estar relacionada con la duración del tratamiento y con las características de la preparación experimental. Algunos mecanismos excitotóxicos pueden requerir condiciones de estimulación sostenida o una organización celular funcional que no se conserva íntegramente en el homogeneizado.';

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
      <div class="menu-intro"><p class="eyebrow">NEUROCIENCIA / DOS PERSPECTIVAS</p><h1 id="experience-title">De la conexión<br>al <em>mecanismo.</em></h1><p>Explora la organización celular y consulta la evidencia que ayuda a formular nuevas preguntas.</p></div>
      <div class="experience-options">
        <button type="button" data-experience="atlas" disabled>
          <svg class="menu-specimen" viewBox="0 0 300 125" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="12" opacity=".25" d="M10 89 Q100 49 288 82"/><path stroke-width="3" d="M10 85 Q100 51 288 77"/><path stroke-width="7" opacity=".5" d="M75 67 Q88 51 79 32 M155 66 Q152 48 166 28 M223 68 Q235 59 235 48"/><path stroke-width="2" d="M70 26 Q68 13 82 14 Q99 14 92 29 Q85 36 77 30 M151 23 Q150 8 168 8 Q184 11 178 24 Q168 34 156 29 M226 46 Q218 32 233 30 Q248 29 247 42 Q244 51 231 49"/></g><g fill="currentColor"><circle cx="82" cy="23" r="3"/><circle cx="166" cy="20" r="3"/><circle cx="234" cy="41" r="3"/></g></svg>
          <span class="eyebrow">01 / ATLAS INTERACTIVO</span><h2>Mecanismos<br><em>fisiopatológicos</em></h2><p>Exploración tridimensional de los procesos celulares y moleculares asociados con neurotoxicidad y plasticidad sináptica.</p><span class="menu-enter">Explorar el atlas <b aria-hidden="true">↗</b></span>
        </button>
        <button type="button" data-experience="evidence" disabled>
          <svg class="menu-specimen" viewBox="0 0 300 125" aria-hidden="true"><g fill="none" stroke="currentColor"><path stroke-width="3" d="M31 57 C44 13 192 1 257 32 C321 66 243 118 149 108 C67 100 15 96 31 57Z"/><path stroke-width="2" opacity=".7" d="M43 59 C46 37 66 33 77 29 Q88 27 84 45 L71 72 Q69 83 83 85 Q97 87 104 68 L120 27 Q126 16 135 24 Q143 29 132 61 Q117 87 132 92 Q149 96 159 67 L174 25 Q182 20 190 28 Q196 32 183 63 Q169 92 185 94 Q198 94 211 65 L226 36 Q235 31 243 40 Q253 62 229 79"/></g><g fill="currentColor" opacity=".7"><circle cx="115" cy="55" r="4"/><circle cx="173" cy="52" r="4"/><circle cx="207" cy="47" r="4"/></g></svg>
          <span class="eyebrow">02 / ESTUDIO EXPERIMENTAL</span><h2>Evidencia<br><em>experimental</em></h2><p>Vulnerabilidad redox cerebral durante el desarrollo posnatal.</p><span class="menu-enter">Consultar el estudio <b aria-hidden="true">↗</b></span>
        </button>
      </div><p class="menu-footnote">Anatomía conceptual · Gráficas originales · Lectura crítica de la evidencia</p><p id="evidence-availability" role="status" hidden>El modelo 3D no está disponible. Puedes consultar las figuras y la metodología en Evidencia experimental.</p>
    </section>
    <section id="evidence-controls" class="evidence-controls" aria-label="Seleccionar resultado experimental" hidden>
      <label>Edad posnatal<select id="evidence-age"></select></label>
      <label>Exposición · 2 horas<select id="evidence-exposure"></select></label>
      <label>Ensayo<select id="evidence-assay"></select></label>
      <p>La edad selecciona resultados; el modelo 3D conserva su escala e intensidad. <button type="button" id="jump-to-results">Ver resultados ↓</button></p>
    </section>
    <div id="evidence-model-heading" class="evidence-model-heading" hidden><p class="eyebrow">MECANISMO MOLECULAR / LITERATURA</p><h2 id="evidence-model-title"></h2></div>
    <aside id="evidence-panel" class="evidence-panel" aria-labelledby="evidence-title" hidden>
      <header><p class="eyebrow">EVIDENCIA EXPERIMENTAL</p><h2 id="evidence-title">Vulnerabilidad <em>redox.</em></h2><p class="study-line">Cerebro de rata Wistar · Homogeneizado · 2 h</p><button type="button" id="jump-to-model">Volver al modelo ↑</button></header>
      <p class="conceptual-warning">${conceptualWarning}</p>
      <section class="evidence-results" aria-labelledby="evidence-assay-title">
        <div class="result-heading"><h3 id="evidence-assay-title"></h3><span id="evidence-selection"></span></div>
        <p id="evidence-status" role="status"></p>
        <button type="button" class="chart-open" id="open-evidence-chart" aria-label="Ampliar gráfica original">
          <span class="evidence-chart"><img alt=""/><span class="chart-selection" aria-hidden="true"></span></span>
          <span class="chart-action">Figura original · Ampliar ↗</span>
        </button>
        <p class="chart-key"><i aria-hidden="true"></i> Resaltado de consulta; no modifica barras ni significancia.</p>
        <p id="evidence-units"></p><p id="evidence-numbers"></p>
        <p id="evidence-summary"></p><p id="evidence-comparison"></p><p id="evidence-statistics" class="evidence-caution"></p>
        <details><summary>Leyenda y procedencia de la figura</summary><p id="evidence-caption"></p><p id="evidence-provenance"></p><a id="evidence-original" download>Descargar vector original (EMF) ↗</a></details>
      </section>
      <section class="evidence-relationship"><p class="eyebrow">MECANISMO DESCRITO EN LITERATURA</p><p id="evidence-mechanism"></p><button id="evidence-context-link" type="button" data-atlas-target="mitochondrial">Explorar el mecanismo en el atlas ↗</button></section>
      <section id="quin-context" class="quin-context" hidden><p class="eyebrow">INTERPRETACIÓN / HIPÓTESIS</p><p>Esta hipótesis se refiere a los resultados sin significancia detectada; no invalida las diferencias tempranas de TBARS indicadas en la figura.</p><p>${quinInterpretation}</p><p>La exposición fue de <strong>2 horas</strong>. No hubo comparación temporal: el resultado no puede atribuirse definitivamente al tiempo ni demuestra ausencia de efecto.</p><details><summary>Contexto: vía de las quinureninas</summary><ol class="kynurenine-path"><li>Triptófano</li><li>Quinurenina <small>↳ Rama hacia ácido quinurénico (KYNA)</small></li><li>3-hidroxiquinurenina</li><li>Ácido 3-hidroxiantranílico</li><li>Intermediarios</li><li>Ácido quinolínico (QUIN)</li></ol><p>QUIN puede activar receptores NMDA; KYNA modula receptores glutamatérgicos según concentración y contexto. Esta simplificación no implica un antagonismo absoluto ni actividad metabólica medida en el estudio.</p></details></section>
      <div class="evidence-reading"><button type="button" id="evidence-info">Tres perspectivas, metodología y referencias ↗</button><details><summary>Desarrollo posnatal y contexto celular</summary><p>Durante el desarrollo cambian el metabolismo energético, la regulación redox, la maduración celular y la organización de conexiones. Estas relaciones de la literatura orientan preguntas; el estudio no midió anatomía sináptica ni establece equivalencias entre edades de rata y humanas.</p><button type="button" data-atlas-target="signaling">A · Plasticidad sináptica ↗</button><button type="button" data-atlas-target="microglia">C · Remodelado microglial ↗</button><p>Las interacciones microgliales no fueron evaluadas en estos homogeneizados.</p></details></div>
    </aside>`);
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="evidence-methods" aria-labelledby="evidence-methods-title"><button type="button" class="close" data-close-dialog="evidence-methods" aria-label="Cerrar metodología">×</button><p class="eyebrow">ALCANCE DE LA EVIDENCIA</p><h2 id="evidence-methods-title">Tres perspectivas de la respuesta cerebral</h2><p>Age-Dependent Cerebral Redox Vulnerability to Excitotoxic, Oxidative, and Mitochondrial Challenges.</p><p>Homogeneizados cerebrales de ratas Wistar: PN3, PN5, PN9, PN12 y PN30. Exposiciones independientes durante 2 horas: control, FeSO₄ 1 mM, QUIN 100 µM y 3-NP 3 mM. Las leyendas reportan promedio ± SEM, n = 5–6 y Kruskal–Wallis seguido de Dunn. MTT no está representado en PN3.</p><div id="assay-methods"></div><p><strong>Son variables diferentes.</strong> TBARS puede aumentar sin un incremento significativo de DCFDA: las reacciones detectadas, sensibilidad e interferencias de cada ensayo son distintas. Ninguno identifica por sí solo una fuente celular específica.</p><p>No se midieron directamente radicales hidroxilo, ROS mitocondrial específica, actividad del complejo II, ATP, muerte neuronal, activación de NMDAR, microglía ni apoptosis.</p><h3>Qué permite el homogeneizado</h3><p>La preparación puede conservar componentes moleculares y actividades enzimáticas, pero limita la polarización normal de membranas, la integridad de circuitos, la transmisión sináptica organizada, el contacto intercelular y las relaciones funcionales entre neuronas y glía. No reproduce un tejido intacto.</p><h3>Fuente de las figuras</h3><p>Figuras vectoriales extraídas de graficas.docx. Se conserva su contenido gráfico y sus leyendas, incluidas las discrepancias documentadas. No se aportó el Excel ni una tabla con medias y SEM: no se estiman valores por la altura de las barras. Las unidades impresas se transcriben sin corregirlas por inferencia.</p><h3>Literatura y métodos</h3><ul class="evidence-references" id="evidence-references"></ul></dialog>
    <dialog id="evidence-chart-dialog" class="chart-dialog" aria-labelledby="chart-dialog-title"><button type="button" class="close" data-close-dialog="evidence-chart-dialog" aria-label="Cerrar gráfica">×</button><p class="eyebrow">FIGURA ORIGINAL / SIN RECONSTRUIR VALORES</p><h2 id="chart-dialog-title"></h2><div class="chart-scroll"><img id="large-evidence-chart" alt=""/></div><p id="large-chart-caption"></p><a id="large-chart-source" target="_blank" rel="noopener">Abrir vector SVG en tamaño completo ↗</a></dialog>`);
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
    const result = getEvidence(state.age, state.exposure, state.assay);
    $('#evidence-assay-title').textContent = assay.title;
    $('#evidence-selection').textContent = `${state.age} · ${exposure.label}`;
    $('#evidence-model-title').textContent = exposure.label === 'Control' ? 'Preparación de referencia' : `${exposure.label} · mecanismo potencial`;
    $('#evidence-status').textContent = result.status === 'not-evaluated' ? 'No evaluado · MTT no incluye PN3 en la figura proporcionada.' : 'Resultado en la figura original';
    $('#evidence-status').dataset.status = result.status;
    const img = $('.evidence-chart img'); img.src = assay.imagePath;
    img.alt = `${assay.title}. Grupos completos y anotaciones originales; selección: ${state.age}, ${exposure.label}. ${assay.unit}.`;
    const box = visualSelection(state.assay, state.age, state.exposure);
    const highlight = $('.chart-selection'); highlight.hidden = !box;
    if (box) Object.assign(highlight.style, { left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` });
    $('.chart-key').hidden = !box;
    $('#evidence-units').textContent = `Unidad impresa: ${assay.unit}`;
    $('#evidence-numbers').textContent = result.status === 'not-evaluated' ? 'Sin media ni SEM para esta selección.' : 'Media ± SEM · n = 5–6. Valores numéricos exactos no disponibles en una tabla fuente.';
    $('#evidence-summary').textContent = result.summary;
    $('#evidence-comparison').textContent = result.comparison;
    $('#evidence-statistics').textContent = result.statisticalCaution;
    $('#evidence-statistics').hidden = !result.statisticalCaution;
    $('#evidence-caption').textContent = assay.originalCaption;
    $('#evidence-provenance').textContent = result.provenance;
    $('#evidence-original').href = assay.originalPath;
    $('#evidence-mechanism').textContent = exposure.mechanism;
    $('#evidence-context-link').dataset.atlasTarget = exposure.atlasTarget || 'mitochondrial';
    $('#evidence-context-link').textContent = exposure.atlasTarget === 'glutamate' ? 'B · Explorar excitotoxicidad ↗' : 'D · Explorar mecanismos redox ↗';
    $('#quin-context').hidden = state.exposure !== 'quin';
    $('#chart-dialog-title').textContent = assay.title;
    $('#large-evidence-chart').src = assay.imagePath; $('#large-evidence-chart').alt = img.alt;
    $('#large-chart-caption').textContent = assay.originalCaption;
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
    $('#brand-home').setAttribute('aria-label', experience === 'atlas' ? 'Neuro Vista, volver a la neurona' : 'Neuro Vista, menú principal');
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
      console.error('No se pudo cambiar la experiencia:', error);
      $('#evidence-status').textContent = 'No se pudo preparar el modelo. Los resultados permanecen disponibles.';
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
