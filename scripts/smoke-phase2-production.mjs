// Test the already built distribution at a GitHub Pages-like /qr/ subpath.
// npm run build && node scripts/smoke-phase2-production.mjs --tag production
// Uses only public DOM controls; dev hooks must be absent. A second page denies
// WebGL context creation to exercise readable results and dialogs in fallback.
// Optional: --width 390 --height 844 --dpr 1 --fallback-only / --skip-fallback.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { access, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const option = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
};
const tag = option('--tag', 'production');
const viewport = { width: Number(option('--width', 1280)), height: Number(option('--height', 900)) };
const deviceScaleFactor = Number(option('--dpr', 1));
if (!/^[a-z\d-]+$/i.test(tag) || !Object.values(viewport).every(value => Number.isInteger(value) && value >= 240) || !(deviceScaleFactor > 0)) throw new Error('Invalid capture options');
const dist = resolve('dist'), out = resolve('docs/previews'), cache = resolve('node_modules/.cache');
await access(`${dist}/index.html`); await mkdir(out, { recursive: true });
const playwrightPath = process.env.NEUROVISTA_PLAYWRIGHT || `${cache}/neurovista-browser/node_modules/playwright/index.mjs`;
const executablePath = process.env.NEUROVISTA_CHROMIUM || `${cache}/neurovista-browsers/chromium-1243/chrome-linux64/chrome`;
await access(playwrightPath); await access(executablePath);
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const report = { basePath: '/qr/', viewport, deviceScaleFactor, startedAt: new Date().toISOString(), status: 'running', modes: {} };
const reportPath = `${out}/phase2-${tag}-validation.json`;
const save = () => writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.emf': 'image/emf' };
let server, browser;
try {
  await save();
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith('/qr/')) { response.writeHead(404); response.end('Subpath required'); return; }
      const relative = pathname.slice('/qr/'.length) || 'index.html';
      const file = resolve(dist, relative);
      if (!file.startsWith(`${dist}${sep}`) || !(await stat(file)).isFile()) throw new Error('Not a distribution file');
      response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(await readFile(file));
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((done, reject) => { server.once('error', reject); server.listen(5187, '127.0.0.1', done); });
  const url = 'http://127.0.0.1:5187/qr/';
  browser = await chromium.launch({ executablePath, headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-dev-shm-usage'] });
  const modes = process.argv.includes('--fallback-only') ? ['webgl-unavailable'] : process.argv.includes('--skip-fallback') ? ['webgl'] : ['webgl', 'webgl-unavailable'];
  for (const mode of modes) {
    const fallback = mode === 'webgl-unavailable';
    const entry = report.modes[mode] = { consoleErrors: [], pageErrors: [], httpErrors: [], failedRequests: [], captures: [], selections: [], assets: [] };
    const page = await browser.newPage({ viewport, deviceScaleFactor, reducedMotion: 'reduce' });
    try {
      page.on('console', message => { if (message.type() === 'error') entry.consoleErrors.push(message.text()); });
      page.on('pageerror', error => entry.pageErrors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) entry.httpErrors.push({ url: response.url(), status: response.status() }); });
      page.on('requestfailed', request => entry.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      if (fallback) await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          if (/^(webgl2?|experimental-webgl)$/i.test(type)) return null;
          return getContext.call(this, type, ...args);
        };
      });
      const uiClick = selector => page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element || element.disabled) throw new Error(`Unavailable production control: ${selector}`);
        element.click();
      }, selector);
      const choose = (selector, value) => page.evaluate(({ selector, value }) => {
        const element = document.querySelector(selector);
        if (!element || element.disabled) throw new Error(`Unavailable production select: ${selector}`);
        element.value = value;
        if (element.value !== value) throw new Error(`Missing selection: ${value}`);
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }, { selector, value });
      const ready = (experience, mechanism) => page.waitForFunction(({ experience, mechanism, fallback }) => {
        const root = document.querySelector('#atlas');
        return root.dataset.experience === experience && !root.classList.contains('transitioning')
          && !document.querySelector('#evidence-exposure').disabled
          && (fallback || (!mechanism || root.dataset.mechanism === mechanism) && document.querySelector('#scene-loading').hidden);
      }, { experience, mechanism, fallback }, { timeout: 90000 });
      const imageLoaded = () => page.waitForFunction(() => {
        const image = document.querySelector('.evidence-chart img'); return image.complete && image.naturalWidth > 0;
      });
      async function capture(name) {
        await page.waitForTimeout(150);
        const screenshot = `${out}/phase2-${tag}-${mode}-${name}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(screenshot);
        const layout = await page.evaluate(() => ({
          document: { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth },
          main: { clientWidth: document.querySelector('#atlas').clientWidth, scrollWidth: document.querySelector('#atlas').scrollWidth },
          experience: document.querySelector('#atlas').dataset.experience,
          mechanism: document.querySelector('#atlas').dataset.mechanism,
        }));
        entry.captures.push({ screenshot, ...layout }); await save();
        assert.ok(layout.document.scrollWidth <= layout.document.clientWidth + 1, 'Production document overflow');
        assert.ok(layout.main.scrollWidth <= layout.main.clientWidth + 1, 'Production main overflow');
      }
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(fallback => {
        const evidence = document.querySelector('#experience-menu [data-experience="evidence"]');
        return evidence && !evidence.disabled && (fallback ? document.querySelector('#atlas').dataset.webgl === 'unavailable' : document.querySelector('#scene-error').hidden);
      }, fallback, { timeout: 90000 });
      entry.devHooksAbsent = await page.evaluate(() => !('__atlas' in window) && !('__evidence' in window));
      assert.ok(entry.devHooksAbsent, 'Production unexpectedly exposes dev hooks');
      assert.equal(await page.locator('#experience-menu [data-experience="atlas"]').isDisabled(), fallback);
      await capture('menu');
      if (!fallback) entry.webgl = await page.evaluate(() => {
        const gl = document.querySelector('#synapse-canvas').getContext('webgl2'), ext = gl.getExtension('WEBGL_debug_renderer_info');
        return { version: gl.getParameter(gl.VERSION), renderer: gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) };
      });
      await uiClick('#experience-menu [data-experience="evidence"]'); await ready('evidence', 'e-control');
      await imageLoaded(); await capture('evidence');
      for (const exposure of ['control', 'feso4', '3np', 'quin']) {
        await choose('#evidence-exposure', exposure); await ready('evidence', `e-${exposure}`);
        if (!fallback) {
          const count = await page.locator('#timeline-track button').count();
          await uiClick(`#timeline-track [data-step="${count - 1}"]`);
          assert.equal(await page.locator('#timeline-track [aria-current="step"]').getAttribute('data-step'), String(count - 1));
        }
        entry.selections.push({ exposure, loaded: true });
      }
      for (const assay of ['dcfda', 'tbars', 'mtt']) {
        await choose('#evidence-age', 'PN3'); await choose('#evidence-assay', assay); await imageLoaded();
        const asset = await page.locator('.evidence-chart img').getAttribute('src');
        const absolute = new URL(asset, page.url());
        assert.ok(absolute.pathname.startsWith('/qr/evidence/'), `Image escaped the project subpath: ${absolute}`);
        entry.assets.push({ assay, url: absolute.href, loaded: true });
        if (assay === 'mtt') {
          assert.match(await page.locator('#evidence-status').innerText(), /No evaluado/);
          assert.equal(await page.locator('.chart-selection').isHidden(), true);
        }
        await uiClick('#open-evidence-chart');
        await page.waitForFunction(() => document.querySelector('#evidence-chart-dialog').open);
        await page.waitForFunction(() => {
          const image = document.querySelector('#large-evidence-chart'); return image.complete && image.naturalWidth > 0;
        });
        await uiClick('[data-close-dialog="evidence-chart-dialog"]');
      }
      await uiClick('#evidence-info');
      await page.waitForFunction(() => document.querySelector('#evidence-methods').open);
      assert.match(await page.locator('#evidence-methods').innerText(), /homogeneizado/i);
      await uiClick('[data-close-dialog="evidence-methods"]');
      if (await page.locator('#references-btn').isVisible()) {
        await uiClick('#references-btn');
        await page.waitForFunction(() => document.querySelector('#evidence-methods').open);
        assert.equal(await page.locator('#references').evaluate(dialog => dialog.open), false, 'Evidence references opened the atlas bibliography');
        entry.headerReferences = 'evidence-methods';
        await uiClick('[data-close-dialog="evidence-methods"]');
      } else entry.headerReferences = 'hidden at this viewport';
      if (viewport.width <= 900) await uiClick('#jump-to-results');
      await capture('pn3-mtt-results');
      if (!fallback) {
        await choose('#evidence-age', 'PN12'); await choose('#evidence-assay', 'tbars');
        await uiClick('#evidence-context-link'); await ready('atlas', 'glutamate');
        await capture('atlas-context');
        await uiClick('#back-to-evidence'); await ready('evidence', 'e-quin');
        for (const [selector, value] of [['#evidence-age', 'PN12'], ['#evidence-exposure', 'quin'], ['#evidence-assay', 'tbars']]) assert.equal(await page.locator(selector).inputValue(), value);
        entry.contextReturnPreserved = true;
      }
      await uiClick('#main-menu'); await ready('menu');
      entry.menuReturn = true;
      await uiClick('#experience-menu [data-experience="evidence"]'); await ready('evidence', 'e-quin');
      await uiClick('#brand-home'); await ready('menu');
      entry.brandReturn = true;
      entry.expectedContextErrors = fallback ? entry.consoleErrors.filter(message => /THREE\.WebGLRenderer: Error creating WebGL context\.|No se pudo iniciar el atlas WebGL:/.test(message)) : [];
      const unexpected = entry.consoleErrors.filter(message => !entry.expectedContextErrors.includes(message));
      if (fallback) assert.ok(entry.expectedContextErrors.length > 0, 'Fallback did not exercise WebGL initialization failure');
      assert.deepEqual(unexpected, [], 'Unexpected console error');
      assert.deepEqual(entry.pageErrors, [], 'Uncaught browser exception');
      assert.deepEqual(entry.httpErrors, [], 'Production resource failed');
      assert.deepEqual(entry.failedRequests, [], 'Production request failed');
      entry.status = 'complete'; await save();
    } finally { await page.close(); }
  }
  report.status = 'complete';
} catch (error) {
  report.status = 'failed'; report.error = error.stack; process.exitCode = 1; console.error(error);
} finally {
  report.finishedAt = new Date().toISOString(); await save(); console.log(reportPath);
  await browser?.close();
  if (server?.listening) await new Promise(done => server.close(done));
}
