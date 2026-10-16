import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { AGES, EXPOSURES, ASSAYS, getEvidence, getEvidencePresentation, visualSelection, MTT_NOTE, TBARS_NOTE } from '../src/evidence/data.js';
import { figureSource } from '../src/evidence/figure-source.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

test('source document and unchanged EMFs match their provenance fingerprints', () => {
  assert.equal(sha256(read('assets/graficas.docx')), '743355d9f45e3c50523d68c2b6dc9088eb8fb17ff1f818ece7c6cf8f7b50dd86');
  assert.equal(sha256(read(figureSource.source)), figureSource.sourceSha256);
  assert.deepEqual(JSON.parse(read('public/evidence/provenance.json')), figureSource);
  assert.equal(figureSource.numericWorkbookPresent, false);
  assert.equal(figureSource.meansAndSemAvailable, false);
  assert.equal(figureSource.figures.length, 3);
  for (const source of figureSource.figures) {
    const original = read(`public/evidence/${source.originalFile}`);
    assert.equal(sha256(original), source.sha256);
    assert.equal(original.readUInt32LE(0), 1, 'EMR_HEADER retained');
    assert.equal(original.readUInt32LE(40), 0x464d4520, 'EMF signature retained');
  }
});

test('literal captions, units and the original four exposure groups remain accessible', () => {
  assert.deepEqual(AGES.map(age => age.id), ['PN3', 'PN5', 'PN9', 'PN12', 'PN30']);
  assert.deepEqual(EXPOSURES.map(exposure => exposure.id), ['control', 'feso4', 'quin', '3np']);
  assert.deepEqual(EXPOSURES.map(exposure => exposure.concentration), ['', '1 mM', '100 µM', '3 mM']);
  const captions = read('public/evidence/original-captions.txt').toString().trim().split('\n\n');
  assert.deepEqual(ASSAYS.map(assay => assay.originalCaption), captions);
  assert.deepEqual(ASSAYS.map(assay => assay.unit), ['oxidacion de DCFA (μM/ug proteina)', 'µM MDA/mg proteina', 'MTT reduction (%)']);
  for (const exposure of EXPOSURES) assert.equal(exposure.mechanismKey, `e-${exposure.id}`);
  for (const assay of ASSAYS) {
    assert.ok(assay.originalCaption.includes('n=5-6'));
    assert.ok(assay.originalCaption.includes('Kruskal-Wallis'));
    assert.ok(assay.originalCaption.includes('Dunn'));
    assert.ok(assay.imagePath.includes('evidence/'));
    assert.ok(assay.originalPath.endsWith('.emf'));
  }
});

test('all 60 selections keep unknown numerical results null; only the four PN3 MTT cells are unavailable', () => {
  let available = 0, unavailable = 0;
  for (const age of AGES) for (const exposure of EXPOSURES) for (const assay of ASSAYS) {
    const result = getEvidence(age.id, exposure.id, assay.id);
    assert.equal(result.mean, null);
    assert.equal(result.sem, null);
    assert.equal(Object.hasOwn(result, 'pValue'), false, 'no exact p values supplied');
    assert.equal(Object.hasOwn(result, 'significant'), false, 'no derived binary significance matrix');
    for (const field of ['summary', 'comparison', 'statisticalCaution', 'provenance']) assert.equal(typeof result[field], 'string');
    if (age.id === 'PN3' && assay.id === 'mtt') {
      assert.equal(result.status, 'not-evaluated');
      assert.match(result.summary, /Not evaluated/);
      assert.equal(visualSelection(assay.id, age.id, exposure.id), null);
      unavailable++;
    } else {
      assert.equal(result.status, 'available');
      available++;
    }
  }
  assert.equal(available, 56);
  assert.equal(unavailable, 4);
});

test('each displayed bar has a finite selection region inside the complete original SVG viewport', () => {
  for (const source of figureSource.figures) {
    const svg = read(`public/evidence/${source.svgFile}`).toString();
    const viewport = svg.match(/<svg\b[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/);
    assert.ok(viewport, 'converted source provides a full viewport');
    assert.equal(Number(viewport[1]), source.width - 1);
    assert.equal(Number(viewport[2]), source.height - 1);
    for (const age of source.ages) {
      let previous = -1;
      for (const exposure of EXPOSURES) {
        const box = visualSelection(source.assay, age, exposure.id);
        assert.ok(box);
        for (const value of Object.values(box)) assert.ok(Number.isFinite(value) && value >= 0);
        assert.ok(box.width > 0 && box.height > 0);
        assert.ok(box.left + box.width <= 100);
        assert.ok(box.top + box.height <= 100);
        assert.ok(box.left > previous, 'source exposure order is unchanged');
        previous = box.left;
      }
    }
  }
});

test('conversion keeps every statistical symbol and age label without adding PN3 to MTT', () => {
  for (const source of figureSource.figures) {
    const svg = read(`public/evidence/${source.svgFile}`).toString();
    // Translated axis lettering can contain the same "a" glyph as significance
    // annotations. Compare only text in the plotting/age-label region.
    const tokens = [...svg.matchAll(/<text\b([^>]*)><!\[CDATA\[(.*?)\]\]><\/text>/gs)]
      .filter(match => Number(match[1].match(/\bx="([\d.]+)"/)?.[1]) >= 100)
      .map(match => match[2]);
    for (const symbol of ['a', '*', ...AGES.map(age => age.id)]) {
      const originalCount = source.texts.filter(item => item.text === symbol && item.x >= 100).length;
      assert.equal(tokens.filter(token => token === symbol).length, originalCount, `${source.assay}: ${symbol}`);
    }
  }
});

test('MTT source ambiguity remains documented internally for every age and exposure', () => {
  assert.match(MTT_NOTE, /PN3/);
  assert.match(MTT_NOTE, /asteriscos/);
  assert.match(MTT_NOTE, /probablemente/);
  assert.match(MTT_NOTE, /interpretación propuesta/i);
  assert.match(ASSAYS.find(assay => assay.id === 'mtt').originalCaption, /ap<0.05 vs\. PN3/);
  for (const age of AGES) for (const exposure of EXPOSURES) {
    assert.equal(getEvidence(age.id, exposure.id, 'mtt').statisticalCaution, MTT_NOTE);
  }
});

test('QUIN TBARS preserves clarified early differences without generalizing an increase across ages', () => {
  assert.match(TBARS_NOTE, /Aclaración del investigador/);
  assert.match(TBARS_NOTE, /no mostró un patrón consistente de incremento/);
  assert.match(TBARS_NOTE, /PN3 y PN5/);
  assert.doesNotMatch(TBARS_NOTE, /requiere aclaración|discrepancia pendiente/);
  for (const age of AGES) {
    const result = getEvidence(age.id, 'quin', 'tbars');
    assert.equal(result.statisticalCaution, TBARS_NOTE);
    assert.match(result.summary, /consistent pattern of increased/);
    assert.doesNotMatch(result.summary, /no statistically significant changes were detected/i);
    if (['PN3', 'PN5'].includes(age.id)) {
      assert.match(result.summary, new RegExp(`QUIN at ${age.id}`));
      assert.match(result.summary, /significant difference versus the control at the same age/);
      assert.match(result.summary, /\* p<0\.05/);
    } else {
      assert.match(result.summary, /significant differences were observed in early conditions/);
    }
    assert.equal(Object.hasOwn(result, 'pValue'), false);
  }
});

test('public figure presentation retains scientific essentials without exposing source-audit notes', () => {
  const auditCopy = /\bEMF\b|\bSVG\b|\bExcel\b|coordinates|graficas\.docx|discrepancy|editorial note|probably|not recalculat|source table|not available|without displacement/i;
  for (const age of AGES) for (const exposure of EXPOSURES) for (const assay of ASSAYS) {
    const presentation = getEvidencePresentation(age.id, exposure.id, assay.id);
    const result = getEvidence(age.id, exposure.id, assay.id);
    assert.equal(presentation.status, result.status);
    assert.equal(presentation.summary, result.summary);
    assert.equal(presentation.comparison, result.comparison);
    assert.match(presentation.unit, /^Unit: .+\.$/);
    assert.equal(presentation.source, 'Original figure from the experimental analysis.');
    assert.doesNotMatch(Object.values(presentation).join(' '), auditCopy);
    for (const field of ['originalCaption', 'statisticalCaution', 'provenance', 'mean', 'sem']) assert.equal(Object.hasOwn(presentation, field), false);
    if (presentation.status === 'available') {
      assert.equal(presentation.sample, 'Mean ± SEM, n = 5–6.');
      assert.equal(presentation.statistics, 'Statistical comparisons follow the original figure.');
      assert.equal(presentation.comparison, 'Reference: control at the same postnatal age.');
    } else {
      assert.equal(presentation.sample, '');
      assert.equal(presentation.statistics, '');
      assert.equal(presentation.comparison, '');
    }
  }
});

test('public QUIN copy retains early TBARS differences and distinguishes detection from absence of effect', () => {
  for (const age of AGES) {
    for (const assay of ['dcfda', 'mtt']) {
      const presentation = getEvidencePresentation(age.id, 'quin', assay);
      if (presentation.status === 'available') {
        assert.match(presentation.summary, /No statistically significant differences were detected/);
        assert.doesNotMatch(presentation.summary, /did not produce|absence of effect|has no effect/i);
      }
    }
    const presentation = getEvidencePresentation(age.id, 'quin', 'tbars');
    assert.match(presentation.summary, /did not show a consistent pattern of increased/);
    if (['PN3', 'PN5'].includes(age.id)) assert.match(presentation.summary, /significant difference.*\* p<0\.05/);
  }
});

test('3-NP DCFDA copy does not infer a statistical comparison from unmarked bars', () => {
  for (const age of AGES) {
    const result = getEvidencePresentation(age.id, '3np', 'dcfda');
    assert.doesNotMatch(result.summary, /significant|increase|decrease/i);
  }
});

test('unknown experimental selections cannot silently produce a result', () => {
  assert.throws(() => getEvidence('PN1', 'control', 'mtt'), RangeError);
  assert.throws(() => getEvidence('PN3', 'combined', 'tbars'), RangeError);
  assert.throws(() => getEvidence('PN3', 'control', 'atp'), RangeError);
});
