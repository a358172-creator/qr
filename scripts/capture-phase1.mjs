// Reproducible browser validation. Uses the existing optional local browser cache;
// it does not add a runtime or development dependency to the application.
// Run: node scripts/capture-phase1.mjs --modules B,A,C,D --tag after
// Quick correction pass: --modules B --stages 1,5,7,8 --skip-interactions
// Mobile regression pass: --width 390 --height 844 --dpr 1 --quick --tag mobile390
// Resource stability after loading all requested models: --cycles 4
// Also exercise smooth camera transitions: --motion normal
// Continue other modules after an interrupted run without discarding its report: --resume
// Stage numbers are one-based, matching the screenshot filenames.
// Optional: NEUROVISTA_PLAYWRIGHT=/absolute/path/index.mjs,
// NEUROVISTA_CHROMIUM=/absolute/path/chrome, NEUROVISTA_URL=http://127.0.0.1:5173/
import { createServer } from 'vite';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const modules = option('--modules', 'B,A,C,D').split(',');
const tag = option('--tag', 'after');
const requestedStages = option('--stages', 'all');
const stageNumbers = requestedStages === 'all' ? null : requestedStages.split(',').map(Number);
if (stageNumbers?.some(index => !Number.isInteger(index) || index < 1)) throw new Error('Stages must be positive whole numbers.');
const quick = process.argv.includes('--quick');
const skipInteractions = quick || process.argv.includes('--skip-interactions');
const width = Number(option('--width', '1280')), height = Number(option('--height', '900'));
const deviceScaleFactor = Number(option('--dpr', '1')), cycles = Number(option('--cycles', '0'));
const motion = option('--motion', 'reduce');
if (!['reduce', 'normal'].includes(motion)) throw new Error('Motion must be reduce or normal.');
if (![width, height].every(value => Number.isInteger(value) && value >= 240) || !Number.isFinite(deviceScaleFactor) || deviceScaleFactor <= 0 || !Number.isInteger(cycles) || cycles < 0) throw new Error('Invalid viewport, DPR or cycle count.');
if (!/^[a-z0-9-]+$/i.test(tag)) throw new Error('Use a simple alphanumeric capture tag.');
const out = resolve('docs/previews');
await mkdir(out, { recursive: true });
const cache = resolve('node_modules/.cache');
const playwrightPath = process.env.NEUROVISTA_PLAYWRIGHT || `${cache}/neurovista-browser/node_modules/playwright/index.mjs`;
const executablePath = process.env.NEUROVISTA_CHROMIUM || `${cache}/neurovista-browsers/chromium-1243/chrome-linux64/chrome`;
await access(playwrightPath);
await access(executablePath);
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const definitions = { A: 'signaling', B: 'glutamate', C: 'microglia', D: 'mitochondrial' };
const report = { viewport: { width, height }, deviceScaleFactor, motion, quick, modules: {}, consoleErrors: [], consoleDetails: [], httpErrors: [], pageErrors: [], failedRequests: [] };
const reportPath = `${out}/phase1-${tag}-validation.json`;
if (process.argv.includes('--resume')) {
  try {
    const previous = JSON.parse(await readFile(reportPath, 'utf8'));
    if (previous.viewport?.width !== width || previous.viewport?.height !== height || previous.deviceScaleFactor !== deviceScaleFactor || (previous.motion || 'reduce') !== motion) throw new Error('Resume requires the same viewport, DPR and motion setting.');
    Object.assign(report, previous);
    if (report.error) {
      report.previousFailures = [...(report.previousFailures || []), report.error];
      delete report.error;
    }
    for (const key of ['consoleErrors', 'consoleDetails', 'httpErrors', 'pageErrors', 'failedRequests']) report[key] ||= [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const run = { modules, startedAt: new Date().toISOString(), status: 'running', quick };
(report.runs ||= []).push(run);
const saveReport = () => writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
await saveReport();
let server, browser, page;
try {
  let url = process.env.NEUROVISTA_URL;
  if (!url) {
    server = await createServer({ server: { host: '127.0.0.1', port: 5184, strictPort: true } });
    await server.listen();
    url = 'http://127.0.0.1:5184/';
  }
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-dev-shm-usage'] });
  // Start at the stable hub, then enable normal camera travel. This pass tests
  // the mechanism transitions, independently of the automatic opening intro.
  page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor, reducedMotion: 'reduce' });
  page.on('console', message => { if (message.type() === 'error') { report.consoleErrors.push(message.text()); report.consoleDetails.push({ text: message.text(), location: message.location() }); } });
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ status: response.status(), url: response.url() }); });
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__atlas && document.querySelector('#scene-error').hidden, null, { timeout: 90000 });
  if (motion === 'normal') {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    report.motionWarmup = 'Stable hub with reduced motion; normal movement enabled for mechanism entry and stage transitions. Opening intro is not tested.';
  }
  if (motion === 'normal') await page.evaluate(() => {
    window.__phase1CameraPhase = 'initial';
    window.__phase1CameraSamples = {};
    window.__phase1CameraTimer = setInterval(() => {
      const state = window.__atlas.getState();
      const phase = window.__phase1CameraPhase;
      const bucket = window.__phase1CameraSamples[phase] ||= { samples: 0, finite: true, positions: new Set(), first: null, last: null };
      const values = [...state.camera, ...state.target];
      bucket.samples++;
      bucket.finite &&= values.every(Number.isFinite);
      bucket.positions.add(values.map(value => value.toFixed(5)).join(','));
      bucket.first ||= values;
      bucket.last = values;
    }, 50);
  });
  report.webgl = await page.evaluate(() => {
    const gl = document.querySelector('#synapse-canvas').getContext('webgl2');
    if (!gl) throw new Error('No WebGL2 context');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { version: gl.getParameter(gl.VERSION), renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) };
  });
  const state = async () => {
    const snapshot = await page.evaluate(() => window.__atlas.getState());
    if (snapshot.model?.actin) {
      // Preserve summary geometry metrics, not the same per-filament vertex
      // ranges and branch descriptions repeated in every view and pause check.
      const { branches, ranges, ...summary } = snapshot.model.actin;
      snapshot.model.actin = { ...summary, branchRecords: branches?.length, vertexRanges: ranges?.length };
    }
    return snapshot;
  };
  const settled = () => page.waitForFunction(() => !window.__atlas.getState().transitioning);
  // Software WebGL can make Playwright's actionability/stability waits expensive.
  // DOM clicks still invoke the real UI event handlers and avoid accidentally
  // clicking a replay button after the short educational stage has finished.
  const uiClick = selector => page.evaluate(selector => {
    const element = document.querySelector(selector);
    if (!element || element.disabled) throw new Error(`Unavailable UI control: ${selector}`);
    if (window.__phase1CameraSamples && element.dataset.step !== undefined) window.__phase1CameraPhase = `seek:${window.__atlas.getState().mechanism}:${element.dataset.step}`;
    element.click();
  }, selector);
  const pause = () => page.evaluate(() => {
    if (window.__atlas.getState().timeline.playing) document.querySelector('#play-btn').click();
  });
  const entered = new Set();
  async function enter(id) {
    if (motion === 'normal') await page.evaluate(id => { window.__phase1CameraPhase = `enter:${id}`; }, id);
    if ((await state()).view !== 'hub') {
      await uiClick('.scale-navigation [data-view="hub"]');
    }
    await settled();
    const selector = `#hotspots-layer [data-id="${id}"]`;
    if (!entered.has(id)) await page.locator(selector).click();
    else await uiClick(selector);
    await page.waitForFunction(id => window.__atlas.getState().view === 'synapse' && window.__atlas.getState().mechanism === id && !window.__atlas.getState().transitioning, id, { timeout: Number(option('--transition-timeout', '90000')) });
    entered.add(id);
  }
  async function capture(letter, suffix) {
    await page.waitForTimeout(motion === 'normal' ? 3000 : 150);
    const path = `${out}/phase1-${tag}-${letter.toLowerCase()}-${suffix}.png`;
    await page.screenshot({ path });
    console.log(path);
    return { screenshot: path, ...(await state()) };
  }
  async function captureAtElapsed(letter, index, seconds, suffix) {
    await uiClick(`#timeline-track [data-step="${index}"]`);
    await page.evaluate(({ index, seconds }) => {
      window.__phase1CaptureStopped = null;
      const timer = window.setInterval(() => {
        const current = window.__atlas.getState();
        if (current.timeline.index !== index || current.timeline.elapsed >= seconds) {
          if (current.timeline.playing) document.querySelector('#play-btn').click();
          window.__phase1CaptureStopped = window.__atlas.getState();
          window.clearInterval(timer);
        }
      }, 25);
      document.querySelector('#play-btn').click();
    }, { index, seconds });
    await page.waitForFunction(() => window.__phase1CaptureStopped, null, { timeout: 120000 });
    await pause();
    const snapshot = await capture(letter, suffix);
    if (snapshot.timeline.index !== index || snapshot.timeline.playing || snapshot.timeline.elapsed < seconds) throw new Error(`${letter}: animated capture is not paused in the requested stage.`);
    return snapshot;
  }
  async function checkSelection(entry, id, key) {
    await page.evaluate(key => {
      const select = document.querySelector('#structure-select');
      select.value = key;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, key);
  const selected = await state();
    const selection = { key, stage: selected.timeline.index + 1, selected: selected.selected, panelVisible: await page.locator('#context-panel').isVisible() };
    if (key === 'caspases' && width >= 1000) {
      selection.labelVisible = await page.locator('#labels-layer [data-key="caspases"]').isVisible();
      if (!selection.labelVisible) throw new Error('The local caspase label must be available when selected in its damage stage.');
    }
    entry.selections.push(selection);
    if (selected.selected !== key) throw new Error(`${id}: selection failed for ${key}`);
    await uiClick('#panel-close');
  }
  for (const letter of modules) {
    const id = definitions[letter];
    if (!id) throw new Error(`Unknown module ${letter}`);
    await enter(id);
    await pause();
    const count = await page.locator('#timeline-track button').count();
    const entry = report.modules[letter] = { id, stages: [], selections: [], navigation: [] };
    for (let index = 0; index < count; index++) {
      if (stageNumbers ? !stageNumbers.includes(index + 1) : quick && index !== 0 && index !== count - 1) continue;
      await uiClick(`#timeline-track [data-step="${index}"]`);
      await page.waitForFunction(index => window.__atlas.getState().timeline.index === index, index);
      const snapshot = await capture(letter, `stage-${index + 1}`);
      if (snapshot.mechanism !== id || snapshot.timeline.index !== index) throw new Error(`${id}: stage changed while capturing ${index + 1}`);
      entry.stages.push(snapshot);
      if (!skipInteractions && letter === 'B' && index === 6) {
        for (const key of ['caspases', 'actin']) await checkSelection(entry, id, key);
      }
      await saveReport();
    }
    if (!quick && letter === 'B' && (!stageNumbers || stageNumbers.includes(8))) {
      entry.intrinsicProgress = await captureAtElapsed(letter, 7, 8, 'stage-8-release');
      await saveReport();
    }
    if (!quick && letter === 'D' && (!stageNumbers || stageNumbers.includes(2))) {
      const restoreIndex = (await state()).timeline.index;
      entry.reactionProgress = await captureAtElapsed(letter, 1, 6, 'stage-2-reaction');
      await uiClick(`#timeline-track [data-step="${restoreIndex}"]`);
      await saveReport();
    }
    if (skipInteractions) continue;
    // Exercise every currently available individual selection without changing the camera.
    for (const key of (await state()).availableKeys) {
      await checkSelection(entry, id, key);
    }
    // Pause, continue and explore use the same UI the reader uses.
    await uiClick('#timeline-track [data-step="0"]');
    await uiClick('#play-btn');
    await page.waitForFunction(() => window.__atlas.getState().timeline.elapsed > .15);
    await pause();
    const paused = await state();
    await page.waitForTimeout(300);
    const stillPaused = await state();
    entry.pause = { stable: paused.time === stillPaused.time, playing: stillPaused.timeline.playing };
    if (!entry.pause.stable) throw new Error(`${id}: pause advanced simulation`);
    await uiClick('#explore-btn');
    entry.explore = await state();
    if (!entry.explore.exploring || !entry.explore.controlsEnabled) throw new Error(`${id}: exploration unavailable`);
    for (let cycle = 0; cycle < 2; cycle++) {
      await enter(id);
      entry.navigation.push(await state());
    }
    await saveReport();
  }
  if (cycles) {
    report.resourceCycles = [];
    for (let cycle = 0; cycle < cycles; cycle++) {
      const record = { cycle, modules: {} };
      for (const letter of modules) {
        await enter(definitions[letter]);
        await uiClick('#timeline-track [data-step="0"]');
        await pause();
        await page.waitForTimeout(150);
        const first = await state();
        await page.waitForTimeout(200);
        const second = await state();
        record.modules[letter] = {
          resources: second.resources || null, drawCalls: second.drawCalls, triangles: second.triangles,
          paused: !second.timeline.playing && first.time === second.time,
          index: second.timeline.index, mechanism: second.mechanism,
        };
        if (!record.modules[letter].paused || second.timeline.index !== 0 || second.mechanism !== definitions[letter]) throw new Error(`${letter}: invalid paused state during cycle ${cycle}`);
      }
      record.resources = (await state()).resources || null;
      report.resourceCycles.push(record);
      await saveReport();
    }
    if (report.resourceCycles.every(cycle => cycle.resources)) {
      const baseline = JSON.stringify(report.resourceCycles[0].resources);
      report.resourcesStable = report.resourceCycles.every(cycle => JSON.stringify(cycle.resources) === baseline);
      if (!report.resourcesStable) throw new Error('GPU resource counts changed after all models were loaded; inspect cycle diagnostics.');
    } else report.resourceValidationLimit = 'The available read-only hook does not expose GPU resource counts.';
  }
  if (report.pageErrors.length || report.consoleErrors.length) throw new Error('Browser errors occurred; inspect the capture report.');
  run.status = 'complete';
} catch (error) {
  run.status = 'failed';
  report.error = error.stack;
  if (page && !page.isClosed()) {
    report.failureState = await page.evaluate(() => {
      const state = window.__atlas?.getState();
      return state ? { view: state.view, mechanism: state.mechanism, transitioning: state.transitioning,
        cameraMoving: state.cameraMoving, controlsEnabled: state.controlsEnabled, camera: state.camera,
        target: state.target, timeline: state.timeline, hidden: document.hidden } : { initialized: false };
    }).catch(() => null);
  }
  process.exitCode = 1;
  console.error(error);
} finally {
  run.finishedAt = new Date().toISOString();
  if (motion === 'normal' && page && !page.isClosed()) {
    try {
      run.cameraSampling = await page.evaluate(() => {
        clearInterval(window.__phase1CameraTimer);
        return Object.fromEntries(Object.entries(window.__phase1CameraSamples || {}).map(([phase, sample]) => [phase, {
          samples: sample.samples, distinctPositions: sample.positions.size, finite: sample.finite, first: sample.first, last: sample.last,
        }]));
      });
      if (Object.values(run.cameraSampling).some(sample => !sample.finite)) {
        report.error = 'A camera sample was not finite.'; run.status = 'failed'; process.exitCode = 1;
      }
    } catch (error) { run.cameraSamplingError = error.message; }
  }
  await saveReport();
  console.log(reportPath);
  await browser?.close();
  await server?.close();
}
