// Reproducible Phase 2 browser checks using the optional local Chromium cache.
// node scripts/capture-phase2.mjs --tag desktop --matrix --bookmarks --reactions --dialogs --cycles 4
// A shorter visual pass: --quick --exposures feso4,3np --width 390 --height 844
// Continue separate exposure passes in one report with --resume and the same tag.
// NEUROVISTA_URL can target an already running Vite server; otherwise port 5186.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
};
const tag = option('--tag', 'desktop');
const exposures = option('--exposures', 'control,feso4,3np,quin').split(',');
const viewport = { width: Number(option('--width', 1280)), height: Number(option('--height', 900)) };
const deviceScaleFactor = Number(option('--dpr', 1));
const quick = process.argv.includes('--quick'), cycles = Number(option('--cycles', 0));
if (!/^[a-z\d-]+$/i.test(tag) || exposures.some(value => !['control', 'feso4', '3np', 'quin'].includes(value))) throw new Error('Invalid tag or exposures.');
if (!Object.values(viewport).every(value => Number.isInteger(value) && value >= 240) || !(deviceScaleFactor > 0) || !Number.isInteger(cycles) || cycles < 0) throw new Error('Invalid viewport or cycles.');
const out = resolve('docs/previews');
await mkdir(out, { recursive: true });
const cache = resolve('node_modules/.cache');
const playwrightPath = process.env.NEUROVISTA_PLAYWRIGHT || `${cache}/neurovista-browser/node_modules/playwright/index.mjs`;
const executablePath = process.env.NEUROVISTA_CHROMIUM || `${cache}/neurovista-browsers/chromium-1243/chrome-linux64/chrome`;
await access(playwrightPath); await access(executablePath);
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const reportPath = `${out}/phase2-${tag}-validation.json`;
const report = { viewport, deviceScaleFactor, exposures: {}, consoleErrors: [], httpErrors: [], pageErrors: [], failedRequests: [] };
if (process.argv.includes('--resume')) {
  try {
    const previous = JSON.parse(await readFile(reportPath, 'utf8'));
    assert.deepEqual(previous.viewport, viewport, 'Resume viewport must match');
    assert.equal(previous.deviceScaleFactor, deviceScaleFactor, 'Resume DPR must match');
    Object.assign(report, previous);
    if (report.error) { (report.previousFailures ||= []).push(report.error); delete report.error; }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const run = { exposures, quick, startedAt: new Date().toISOString(), status: 'running' };
(report.runs ||= []).push(run);
const save = () => writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
let server, browser, page;
try {
  await save();
  let url = process.env.NEUROVISTA_URL;
  if (!url) {
    server = await createServer({ server: { host: '127.0.0.1', port: 5186, strictPort: true } });
    await server.listen(); url = 'http://127.0.0.1:5186/';
  }
  browser = await chromium.launch({ executablePath, headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-dev-shm-usage'] });
  page = await browser.newPage({ viewport, deviceScaleFactor, reducedMotion: 'reduce' });
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ text: message.text(), location: message.location() }); });
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__atlas && window.__evidence && document.querySelector('#scene-error').hidden, null, { timeout: 90000 });
  report.webgl = await page.evaluate(() => {
    const gl = document.querySelector('#synapse-canvas').getContext('webgl2');
    if (!gl) throw new Error('No WebGL2 context');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { version: gl.getParameter(gl.VERSION), renderer: gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) };
  });
  const state = () => page.evaluate(() => {
    const s = window.__atlas.getState();
    if (s.model?.actin) {
      const { branches, ranges, ...summary } = s.model.actin;
      s.model.actin = { ...summary, branchRecords: branches?.length, vertexRanges: ranges?.length };
    }
    return s;
  });
  const uiClick = selector => page.evaluate(selector => {
    const element = document.querySelector(selector);
    if (!element || element.disabled) throw new Error(`Unavailable control: ${selector}`);
    element.click();
  }, selector);
  const choose = (selector, value) => page.evaluate(({ selector, value }) => {
    const element = document.querySelector(selector);
    if (!element || element.disabled) throw new Error(`Unavailable select: ${selector}`);
    element.value = value;
    if (element.value !== value) throw new Error(`Missing option: ${selector}=${value}`);
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, { selector, value });
  const settled = (experience, id) => page.waitForFunction(({ experience, id }) => {
    const s = window.__atlas.getState();
    return s.experience === experience && (!id || s.mechanism === id) && !s.transitioning && !s.cameraMoving && !window.__evidence.getState().busy;
  }, { experience, id }, { timeout: 90000 });
  const pause = () => page.evaluate(() => { if (window.__atlas.getState().timeline.playing) document.querySelector('#play-btn').click(); });
  async function menu() { await uiClick('#main-menu'); await settled('menu'); }
  async function evidence(exposure) {
    const current = await state();
    if (current.experience !== 'evidence') {
      if (current.experience !== 'menu') await menu();
      await uiClick('#experience-menu [data-experience="evidence"]'); await settled('evidence');
    }
    await choose('#evidence-exposure', exposure); await settled('evidence', `e-${exposure}`);
    await pause();
  }
  async function stage(index) {
    await pause();
    await uiClick(`#timeline-track [data-step="${index}"]`);
    await page.waitForFunction(index => {
      const s = window.__atlas.getState(); return s.timeline.index === index && !s.cameraMoving;
    }, index);
  }
  async function capture(name) {
    await page.waitForTimeout(150);
    const screenshot = `${out}/phase2-${tag}-${name}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log(screenshot);
    const layout = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const main = document.querySelector('#atlas');
      const dialog = document.querySelector('dialog[open]');
      const rect = dialog?.getBoundingClientRect();
      return { document: { clientWidth: width, scrollWidth: document.documentElement.scrollWidth },
        main: { clientWidth: main.clientWidth, scrollWidth: main.scrollWidth, scrollTop: main.scrollTop },
        dialog: rect && { id: dialog.id, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
          clientWidth: dialog.clientWidth, scrollWidth: dialog.scrollWidth, focusInside: dialog.contains(document.activeElement) } };
    });
    (report.layouts ||= []).push({ name, ...layout });
    await save();
    assert.ok(layout.document.scrollWidth <= layout.document.clientWidth + 1, `${name}: horizontal document overflow`);
    assert.ok(layout.main.scrollWidth <= layout.main.clientWidth + 1, `${name}: horizontal main overflow`);
    if (layout.dialog) {
      assert.ok(layout.dialog.left >= -1 && layout.dialog.right <= viewport.width + 1, `${name}: dialog extends beyond viewport`);
      assert.ok(layout.dialog.scrollWidth <= layout.dialog.clientWidth + 1, `${name}: dialog horizontal overflow outside chart scroll area`);
      assert.ok(layout.dialog.focusInside, `${name}: focus escaped the modal dialog`);
    }
    return { screenshot, layout, scene: await state(), evidence: await page.evaluate(() => window.__evidence.getState()) };
  }
  assert.equal((await state()).experience, 'menu');
  report.menu = await capture('menu');
  report.menu.keyboardControls = await page.locator('#experience-menu [data-experience]').evaluateAll(elements => elements.map(element => ({ disabled: element.disabled, label: element.innerText })));
  for (const exposure of exposures) {
    await evidence(exposure);
    const entry = report.exposures[exposure] = { stages: [], selections: [] };
    const count = await page.locator('#timeline-track button').count();
    for (let index = 0; index < count; index++) {
      if (quick && index !== 0 && index !== count - 1) continue;
      await stage(index);
      entry.stages.push(await capture(`${exposure}-stage-${index + 1}`));
      await save();
    }
    if (process.argv.includes('--reactions') && ['feso4', '3np'].includes(exposure)) {
      await stage(2);
      const seconds = exposure === 'feso4' ? 4.5 : 6;
      await page.evaluate(seconds => {
        window.__phase2ReactionStopped = false;
        const timer = setInterval(() => {
          const current = window.__atlas.getState();
          if (current.timeline.index !== 2 || current.timeline.elapsed >= seconds) {
            if (current.timeline.playing) document.querySelector('#play-btn').click();
            window.__phase2ReactionStopped = true; clearInterval(timer);
          }
        }, 25);
        document.querySelector('#play-btn').click();
      }, seconds);
      await page.waitForFunction(() => window.__phase2ReactionStopped, null, { timeout: 90000 });
      const current = await state();
      assert.equal(current.timeline.index, 2, 'Reaction capture left the requested stage');
      assert.equal(current.timeline.playing, false);
      assert.ok(current.timeline.elapsed >= seconds);
      entry.reaction = await capture(`${exposure}-stage-3-reaction`);
      await stage(count - 1); await save();
    }
    if (!quick) {
      for (const key of (await state()).availableKeys) {
        await choose('#structure-select', key);
        const current = await state();
        assert.equal(current.selected, key, `Selection ${exposure}/${key}`);
        entry.selections.push({ key, panelVisible: await page.locator('#context-panel').isVisible() });
        await uiClick('#panel-close');
      }
    }
    // Results are outside the mobile model viewport; retain a second readable
    // capture of that scroll position, without pretending fullPage traverses it.
    if (viewport.width <= 900) {
      await uiClick('#jump-to-results');
      entry.results = await capture(`${exposure}-results`);
      await uiClick('#jump-to-model');
    }
    await page.evaluate(() => document.querySelector('#evidence-panel').scrollTop = 0);
    await save();
  }
  if (process.argv.includes('--dialogs')) {
    await evidence('quin');
    report.dialogs = [];
    const filters = await page.evaluate(() => window.__evidence.getState());
    for (const assay of ['dcfda', 'tbars', 'mtt']) {
      await choose('#evidence-age', 'PN3'); await choose('#evidence-assay', assay);
      await page.waitForFunction(() => {
        const img = document.querySelector('.evidence-chart img'); return img.complete && img.naturalWidth > 0;
      });
      await page.locator('#open-evidence-chart').focus();
      await uiClick('#open-evidence-chart');
      await page.waitForFunction(() => document.querySelector('#evidence-chart-dialog').open);
      await page.waitForFunction(() => {
        const img = document.querySelector('#large-evidence-chart'); return img.complete && img.naturalWidth > 0;
      });
      const record = await capture(`dialog-${assay}`);
      record.chartScroll = await page.evaluate(() => {
        const area = document.querySelector('.chart-scroll');
        area.scrollLeft = area.scrollWidth;
        const result = { clientWidth: area.clientWidth, scrollWidth: area.scrollWidth, scrollLeft: area.scrollLeft };
        area.scrollLeft = 0; return result;
      });
      if (record.chartScroll.scrollWidth > record.chartScroll.clientWidth + 1) assert.ok(record.chartScroll.scrollLeft > 0, 'Wide chart is not scrollable');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('#evidence-chart-dialog').open);
      record.focusRestored = await page.evaluate(() => document.activeElement.id === 'open-evidence-chart');
      assert.ok(record.focusRestored, 'Chart dialog did not restore focus to its opener');
      report.dialogs.push(record); await save();
    }
    await page.locator('#evidence-info').focus();
    await uiClick('#evidence-info');
    await page.waitForFunction(() => document.querySelector('#evidence-methods').open);
    const methods = await capture('dialog-methods');
    await uiClick('[data-close-dialog="evidence-methods"]');
    methods.focusRestored = await page.evaluate(() => document.activeElement.id === 'evidence-info');
    assert.ok(methods.focusRestored, 'Methods dialog did not restore focus to its opener');
    report.dialogs.push(methods);
    await choose('#evidence-age', filters.age); await choose('#evidence-assay', filters.assay);
    await page.evaluate(() => { document.querySelector('#atlas').scrollTop = 0; document.querySelector('#evidence-panel').scrollTop = 0; });
    await save();
  }
  if (process.argv.includes('--matrix')) {
    report.matrix = [];
    const allExposures = await page.locator('#evidence-exposure option').evaluateAll(items => items.map(item => item.value));
    for (const exposure of allExposures) {
      await evidence(exposure);
      const rows = await page.evaluate(() => {
        const age = document.querySelector('#evidence-age'), assay = document.querySelector('#evidence-assay');
        const baseline = window.__atlas.getState(), rows = [];
        const signature = state => JSON.stringify({ mechanism: state.mechanism, time: state.time, particles: state.particles, camera: state.camera, target: state.target, index: state.timeline.index });
        const expected = signature(baseline);
        for (const ageValue of Array.from(age.options, option => option.value)) {
          for (const assayValue of Array.from(assay.options, option => option.value)) {
            age.value = ageValue; age.dispatchEvent(new Event('change', { bubbles: true }));
            assay.value = assayValue; assay.dispatchEvent(new Event('change', { bubbles: true }));
            const selected = window.__evidence.getState();
            rows.push({ age: ageValue, exposure: selected.exposure, assay: assayValue, status: selected.result.status,
              statusText: document.querySelector('#evidence-status').textContent,
              chart: document.querySelector('.evidence-chart img').getAttribute('src'),
              modelUnchanged: signature(window.__atlas.getState()) === expected });
          }
        }
        return rows;
      });
      assert.ok(rows.every(row => row.modelUnchanged), 'Age and assay altered the conceptual scene');
      for (const row of rows) {
        if (row.age === 'PN3' && row.assay === 'mtt') {
          assert.equal(row.status, 'not-evaluated'); assert.match(row.statusText, /No evaluado/);
        }
      }
      report.matrix.push(...rows); await save();
    }
    assert.equal(report.matrix.length, 60);
  }
  if (process.argv.includes('--bookmarks')) {
    report.bookmarks = [];
    const compare = (before, after) => {
      for (const key of ['experience', 'view', 'mechanism', 'time', 'selected', 'exploring', 'particles']) assert.deepEqual(after[key], before[key], `Bookmark ${key}`);
      for (const key of ['index', 'elapsed', 'playing']) assert.deepEqual(after.timeline[key], before.timeline[key], `Bookmark timeline.${key}`);
      for (const key of ['camera', 'target']) for (let i = 0; i < 3; i++) assert.ok(Math.abs(before[key][i] - after[key][i]) < 1e-8, `Bookmark ${key}[${i}]`);
    };
    for (const id of ['signaling', 'microglia']) {
      await evidence('quin');
      await choose('#evidence-age', 'PN12'); await choose('#evidence-assay', 'tbars');
      await stage(2);
      const evidenceBefore = await state(), filtersBefore = await page.evaluate(() => window.__evidence.getState());
      await uiClick(`[data-atlas-target="${id}"]`); await settled('atlas', id);
      await stage(3);
      await page.evaluate(() => {
        const timer = setInterval(() => {
          if (window.__atlas.getState().timeline.elapsed > .2) {
            document.querySelector('#play-btn').click(); clearInterval(timer);
          }
        }, 25);
        document.querySelector('#play-btn').click();
      });
      await page.waitForFunction(() => {
        const s = window.__atlas.getState(); return s.timeline.elapsed > .2 && !s.timeline.playing;
      });
      if (!(await state()).exploring) await uiClick('#explore-btn');
      await choose('#structure-select', (await state()).availableKeys[0]);
      await page.evaluate(() => document.querySelector('#synapse-canvas').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
      const before = await state();
      const beforeCapture = await capture(`atlas-${id === 'signaling' ? 'a' : 'c'}-before-return`);
      await uiClick('#back-to-evidence'); await settled('evidence', 'e-quin');
      compare(evidenceBefore, await state());
      const filtersAfter = await page.evaluate(() => window.__evidence.getState());
      for (const key of ['age', 'exposure', 'assay']) assert.equal(filtersAfter[key], filtersBefore[key]);
      await menu();
      assert.equal((await state()).timeline.playing, false);
      await uiClick('#experience-menu [data-experience="atlas"]'); await settled('atlas', id);
      const after = await state(); compare(before, after);
      const afterCapture = await capture(`atlas-${id === 'signaling' ? 'a' : 'c'}-restored`);
      report.bookmarks.push({ id, before, after, beforeCapture, afterCapture, evidencePreserved: true }); await save();
    }
    report.contextLinks = [];
    for (const [exposure, id] of [['feso4', 'mitochondrial'], ['quin', 'glutamate']]) {
      await evidence(exposure); const before = await state();
      await uiClick('#evidence-context-link'); await settled('atlas', id);
      await uiClick('#back-to-evidence'); await settled('evidence', `e-${exposure}`);
      compare(before, await state()); report.contextLinks.push({ exposure, id, restored: true });
      await save();
    }
  }
  if (cycles) {
    // Warm every conceptual model before comparing resource counts.
    for (const exposure of ['control', 'feso4', '3np', 'quin']) await evidence(exposure);
    report.resourceCycles = [];
    for (let cycle = 0; cycle < cycles; cycle++) {
      for (const exposure of ['control', 'feso4', '3np', 'quin']) await evidence(exposure);
      await menu(); await uiClick('#experience-menu [data-experience="atlas"]'); await settled('atlas');
      await evidence('quin');
      const first = await state(); await page.waitForTimeout(200); const second = await state();
      assert.equal(first.time, second.time); assert.equal(second.timeline.playing, false);
      report.resourceCycles.push({ cycle, resources: second.resources, paused: true }); await save();
    }
    const baseline = report.resourceCycles[0].resources;
    for (const record of report.resourceCycles) assert.deepEqual(record.resources, baseline, 'Resource count changed after warming all scenes');
    report.resourcesStable = true;
  }
  if (report.consoleErrors.length || report.pageErrors.length || report.httpErrors.length || report.failedRequests.length) throw new Error('Browser errors occurred; inspect the report.');
  run.status = 'complete';
} catch (error) {
  run.status = 'failed'; report.error = error.stack; process.exitCode = 1; console.error(error);
  if (page && !page.isClosed()) report.failureState = await page.evaluate(() => {
    const s = window.__atlas?.getState();
    return { scene: s && { experience: s.experience, view: s.view, mechanism: s.mechanism, transitioning: s.transitioning, cameraMoving: s.cameraMoving, timeline: s.timeline }, evidence: window.__evidence?.getState() };
  }).catch(() => null);
} finally {
  run.finishedAt = new Date().toISOString(); await save(); console.log(reportPath);
  await browser?.close(); await server?.close();
}
