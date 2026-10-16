import { figureSource } from './figure-source.js';

// No bar heights are digitised. Figure coordinates below are only hit/selection
// regions; exact experimental means, SEM and p-values remain unavailable.
const base = import.meta.env?.BASE_URL ?? './';
export const AGES = [3, 5, 9, 12, 30].map(day => ({ id: `PN${day}`, day }));
export const EXPOSURES = [
  { id: 'control', label: 'Control', concentration: '', mechanismKey: 'e-control', atlasTarget: 'mitochondrial', mechanism: 'The bilayer and mitochondrion provide an anatomical reference for exploring cellular mechanisms.' },
  { id: 'feso4', label: 'FeSO₄', concentration: '1 mM', mechanismKey: 'e-feso4', atlasTarget: 'mitochondrial', mechanism: 'Redox-active iron can participate in the Fenton reaction and promote localized lipid oxidation.' },
  { id: 'quin', label: 'QUIN', concentration: '100 µM', mechanismKey: 'e-quin', atlasTarget: 'glutamate', mechanism: 'QUIN can activate NMDAR and promote Ca²⁺ dysregulation. Coagonists, voltage and stimulation duration condition the response.' },
  { id: '3np', label: '3-NP', concentration: '3 mM', mechanismKey: 'e-3np', atlasTarget: 'mitochondrial', mechanism: '3-NP can inactivate SDH/complex II and reduce electron transfer to ubiquinone, a mechanism described in the literature.' },
];
// Internal source interpretation: retain the approved clarification and literal
// figure legend for traceability. Neither note is part of the public presentation.
export const MTT_NOTE = 'Nota editorial: el pie original indica «a p<0.05 vs. PN3», pero PN3 no está representado y aparecen asteriscos, no letras a. Según la aclaración del autor, probablemente señalan p<0.05 frente al control de cada edad. Es una interpretación propuesta del pie, no verificada independientemente; se conservan exactamente los símbolos y no se recalculan pruebas ni valores.';
export const TBARS_NOTE = 'Aclaración del investigador: QUIN no mostró un patrón consistente de incremento de peroxidación lipídica entre las edades evaluadas. La figura conserva diferencias significativas respecto al control en condiciones tempranas, indicadas por asteriscos en PN3 y PN5. No se generaliza el efecto a todas las edades ni se recalculan resultados.';
const methods = {
  dcfda: { label: 'DCFDA', title: 'Oxidative signal · DCFDA', unit: 'oxidacion de DCFA (μM/ug proteina)', displayUnit: 'µM/µg protein',
    caption: 'Oxidative signaling during postnatal development following exposure to different toxins.',
    method: 'Indirect assessment of oxidative processes through a fluorescent signal generated from the probe.',
    limitation: 'The signal integrates probe chemistry and assay conditions; it does not identify a specific reactive species or cellular source.',
    statisticalNotes: 'The legend defines a p<0.05 versus PN5. This comparison between ages is not equivalent to comparing each exposure with its control.' },
  tbars: { label: 'TBARS', title: 'Lipid peroxidation · TBARS', unit: 'µM MDA/mg proteina', displayUnit: 'µM MDA/mg protein',
    caption: 'Lipid peroxidation during postnatal development following exposure to different toxins.',
    method: 'Assessment of thiobarbituric acid-reactive substances related to lipid oxidation products, expressed in terms of MDA.',
    limitation: 'The reaction integrates various lipid oxidation products; its signal does not correspond exclusively to one molecule.',
    statisticalNotes: 'The legend defines a p<0.05 versus PN3 and * p<0.05 versus the control at each postnatal age. Original symbols retain their positions.' },
  mtt: { label: 'MTT', title: 'Reducing capacity · MTT', unit: 'MTT reduction (%)', displayUnit: 'MTT reduction (%)',
    caption: 'Reducing capacity during postnatal development following exposure to different toxins.',
    method: 'Assessment of reducing capacity through conversion of MTT to formazan, expressed as a percentage.',
    limitation: 'The signal combines contributions from different reducing systems and is interpreted as reducing capacity, rather than a direct measure of neuronal viability, SDH, ATP or respiration.', statisticalNotes: MTT_NOTE },
};
export const ASSAYS = figureSource.figures.map(source => ({
  id: source.assay, ...methods[source.assay], ages: [...source.ages],
  imagePath: `${base}evidence/${source.svgFile}`, originalPath: `${base}evidence/${source.originalFile}`,
  originalCaption: source.caption, sourceSha256: source.sha256,
}));

export function getEvidence(age, exposure, assayId) {
  if (!AGES.some(item => item.id === age) || !EXPOSURES.some(item => item.id === exposure) || !methods[assayId]) throw new RangeError('Unknown experimental selection');
  const assay = ASSAYS.find(item => item.id === assayId);
  const status = assay.ages.includes(age) ? 'available' : 'not-evaluated';
  const provenance = `Figura ${figureSource.figures.find(item => item.assay === assayId).figure} de graficas.docx. Vector EMF original conservado; SVG para visualización. No se aportó Excel ni tabla de medias y SEM. El resaltado usa coordenadas gráficas, sin convertirlas a valores experimentales.`;
  if (status === 'not-evaluated') return { status, mean: null, sem: null, summary: 'Not evaluated: MTT is presented for PN5, PN9, PN12 and PN30.', comparison: '', statisticalCaution: MTT_NOTE, provenance };
  let summary;
  if (exposure === 'control') summary = `Control at ${age}: experimental reference for exposures at the same postnatal age.`;
  else if (exposure === 'quin') summary = assayId === 'tbars'
    ? (['PN3', 'PN5'].includes(age) ? `QUIN at ${age}: significant difference versus the control at the same age (* p<0.05). Overall, QUIN did not show a consistent pattern of increased TBARS across the ages evaluated.` : 'QUIN did not show a consistent pattern of increased TBARS across the ages evaluated; significant differences were observed in early conditions.')
    : 'No statistically significant differences were detected following acute QUIN exposure in this assay.';
  else if (assayId === 'dcfda') summary = exposure === 'feso4'
    ? 'No significant increase in DCFDA was detected with FeSO₄. TBARS and MTT describe other dimensions of the response.'
    : 'The DCFDA signal describes oxidative processes and complements the TBARS and MTT results.';
  else if (assayId === 'tbars' && exposure === 'feso4') summary = 'The study documents increased TBARS with FeSO₄. The figure presents the response at each postnatal age.';
  else if (assayId === 'mtt' && exposure === '3np') summary = 'The study documents a decreased MTT signal with 3-NP, indicating changes in reducing capacity.';
  else if (assayId === 'mtt') summary = 'The study documents changes in the MTT signal with FeSO₄. The figure presents the response at each postnatal age.';
  else summary = 'The figure presents the TBARS signal following 3-NP exposure alongside the control at the same postnatal age.';
  return {
    status, mean: null, sem: null, summary,
    comparison: 'Reference: control at the same postnatal age.',
    statisticalCaution: assayId === 'mtt' ? MTT_NOTE : assayId === 'tbars' && exposure === 'quin' ? TBARS_NOTE : assay.statisticalNotes,
    provenance,
  };
}

// The interface receives a public projection, without import-pipeline notes or
// unresolved source-caption wording. Original captions and approved source notes
// remain accessible in ASSAYS/getEvidence for internal documentation and tests.
export function getEvidencePresentation(age, exposure, assayId) {
  const result = getEvidence(age, exposure, assayId);
  const assay = ASSAYS.find(item => item.id === assayId);
  return {
    status: result.status, summary: result.summary, comparison: result.comparison,
    unit: `Unit: ${assay.displayUnit}.`,
    sample: result.status === 'available' ? 'Mean ± SEM, n = 5–6.' : '',
    statistics: result.status === 'available' ? 'Statistical comparisons follow the original figure.' : '',
    caption: assay.caption,
    source: 'Original figure from the experimental analysis.',
  };
}

export function visualSelection(assayId, age, exposure) {
  const source = figureSource.figures.find(item => item.assay === assayId);
  const box = source?.regions[age]?.[exposure];
  if (!box) return null;
  // EMF inclusive bounds contain one extra unit compared with the converter's
  // SVG viewport. Expand only the annotation outline, never the original art.
  const x = source.width / (source.width - 1), y = source.height / (source.height - 1);
  return { left: box.x * x * 100, top: box.y * y * 100, width: box.width * x * 100, height: box.height * y * 100 };
}

export const REFERENCES = [
  { title: 'Lloyd, Hanna and Mason (1997) · Fenton reaction', url: 'https://pubmed.ncbi.nlm.nih.gov/9119257/', note: 'Chemistry of hydroxyl radical formation.' },
  { title: 'Heyes et al. (1993) · Kynurenine pathway', url: 'https://pubmed.ncbi.nlm.nih.gov/8293279/', note: 'Metabolic context of QUIN in other preparations.' },
  { title: 'Knight et al. (1988) · TBARS specificity', url: 'https://pubmed.ncbi.nlm.nih.gov/3197281/', note: 'The reaction does not exclusively identify MDA.' },
  { title: 'PubChem · Quinolinic acid, CID 1066', url: 'https://pubchem.ncbi.nlm.nih.gov/compound/1066', note: 'Chemical structure of quinolinic acid.' },
  { title: 'Huang et al. (2006) · 3-NP and complex II', url: 'https://pubmed.ncbi.nlm.nih.gov/16371358/', note: 'Structural study of the SDH inactivation mechanism.' },
  { title: 'Perkins and Stone (1983) · QUIN and excitatory receptors', url: 'https://pubmed.ncbi.nlm.nih.gov/6308211/', note: 'Primary pharmacology of the excitatory potential of QUIN.' },
  { title: 'LeBel, Ischiropoulos and Bondy (1992) · DCFH probe', url: 'https://doi.org/10.1021/tx00026a012', note: 'Chemical dependence and limits of fluorescent signal interpretation.' },
  { title: 'Ohkawa, Ohishi and Yagi (1979) · Thiobarbituric acid reaction', url: 'https://pubmed.ncbi.nlm.nih.gov/36810/', note: 'Reference method for lipid peroxidation products.' },
  { title: 'Berridge and Tan (1993) · Cellular MTT reduction', url: 'https://pubmed.ncbi.nlm.nih.gov/8390225/', note: 'Reducing contributions that prevent equating MTT with specific complex II activity.' },
  { title: 'Bates et al. (1994) · Development and brain mitochondrial metabolism', url: 'https://pubmed.ncbi.nlm.nih.gov/7768212/', note: 'Context of postnatal development and brain energy metabolism.' },
];
