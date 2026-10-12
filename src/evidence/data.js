import { figureSource } from './figure-source.js';

// No bar heights are digitised. Figure coordinates below are only hit/selection
// regions; exact experimental means, SEM and p-values remain unavailable.
const base = import.meta.env?.BASE_URL ?? './';
export const AGES = [3, 5, 9, 12, 30].map(day => ({ id: `PN${day}`, day }));
export const EXPOSURES = [
  { id: 'control', label: 'Control', concentration: '', mechanismKey: 'e-control', atlasTarget: 'mitochondrial', mechanism: 'La bicapa y la mitocondria ofrecen una referencia anatómica para explorar los mecanismos celulares.' },
  { id: 'feso4', label: 'FeSO₄', concentration: '1 mM', mechanismKey: 'e-feso4', atlasTarget: 'mitochondrial', mechanism: 'El hierro redox-activo puede participar en la reacción de Fenton y favorecer oxidación lipídica localizada.' },
  { id: 'quin', label: 'QUIN', concentration: '100 µM', mechanismKey: 'e-quin', atlasTarget: 'glutamate', mechanism: 'QUIN puede activar NMDAR y favorecer desregulación de Ca²⁺. Coagonistas, voltaje y duración de la estimulación condicionan la respuesta.' },
  { id: '3np', label: '3-NP', concentration: '3 mM', mechanismKey: 'e-3np', atlasTarget: 'mitochondrial', mechanism: '3-NP puede inactivar SDH/complejo II y reducir la transferencia de electrones hacia ubiquinona, un mecanismo descrito en la literatura.' },
];
// Internal source interpretation: retain the approved clarification and literal
// figure legend for traceability. Neither note is part of the public presentation.
export const MTT_NOTE = 'Nota editorial: el pie original indica «a p<0.05 vs. PN3», pero PN3 no está representado y aparecen asteriscos, no letras a. Según la aclaración del autor, probablemente señalan p<0.05 frente al control de cada edad. Es una interpretación propuesta del pie, no verificada independientemente; se conservan exactamente los símbolos y no se recalculan pruebas ni valores.';
export const TBARS_NOTE = 'Aclaración del investigador: QUIN no mostró un patrón consistente de incremento de peroxidación lipídica entre las edades evaluadas. La figura conserva diferencias significativas respecto al control en condiciones tempranas, indicadas por asteriscos en PN3 y PN5. No se generaliza el efecto a todas las edades ni se recalculan resultados.';
const methods = {
  dcfda: { label: 'DCFDA', title: 'Señal oxidativa · DCFDA', unit: 'oxidacion de DCFA (μM/ug proteina)', displayUnit: 'µM/µg proteína',
    caption: 'Señal oxidativa durante el desarrollo posnatal tras la exposición a diferentes toxinas.',
    method: 'Evaluación indirecta de procesos oxidativos mediante una señal fluorescente generada a partir de la sonda.',
    limitation: 'La señal integra la química de la sonda y las condiciones del ensayo; no identifica una especie reactiva ni una fuente celular específica.',
    statisticalNotes: 'El pie define a p<0.05 frente a PN5. Esa comparación entre edades no equivale a una comparación de cada exposición frente a su control.' },
  tbars: { label: 'TBARS', title: 'Peroxidación lipídica · TBARS', unit: 'µM MDA/mg proteina', displayUnit: 'µM MDA/mg proteína',
    caption: 'Peroxidación lipídica durante el desarrollo posnatal tras la exposición a diferentes toxinas.',
    method: 'Evaluación de sustancias reactivas al ácido tiobarbitúrico relacionadas con productos de oxidación lipídica, expresadas en términos de MDA.',
    limitation: 'La reacción integra diversos productos de oxidación lipídica; su señal no corresponde exclusivamente a una molécula.',
    statisticalNotes: 'El pie define a p<0.05 frente a PN3 y * p<0.05 frente al control de cada edad posnatal. Los símbolos originales se conservan sin desplazamientos.' },
  mtt: { label: 'MTT', title: 'Capacidad reductora · MTT', unit: 'MTT reduction (%)', displayUnit: 'Reducción de MTT (%)',
    caption: 'Capacidad reductora durante el desarrollo posnatal tras la exposición a diferentes toxinas.',
    method: 'Evaluación de capacidad reductora mediante la conversión de MTT a formazán, expresada en porcentaje.',
    limitation: 'La señal reúne la contribución de distintos sistemas reductores y se interpreta como capacidad reductora, no como una medida directa de viabilidad neuronal, SDH, ATP o respiración.', statisticalNotes: MTT_NOTE },
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
  if (status === 'not-evaluated') return { status, mean: null, sem: null, summary: 'No evaluado: MTT se presenta para PN5, PN9, PN12 y PN30.', comparison: '', statisticalCaution: MTT_NOTE, provenance };
  let summary;
  if (exposure === 'control') summary = `Control de ${age}: referencia experimental para las exposiciones de la misma edad posnatal.`;
  else if (exposure === 'quin') summary = assayId === 'tbars'
    ? (['PN3', 'PN5'].includes(age) ? `QUIN en ${age}: diferencia significativa respecto al control de la misma edad (* p<0.05). En conjunto, QUIN no mostró un patrón consistente de incremento de TBARS entre las edades evaluadas.` : 'QUIN no mostró un patrón consistente de incremento de TBARS entre las edades evaluadas; las diferencias significativas se observaron en condiciones tempranas.')
    : 'No se detectaron diferencias estadísticamente significativas tras la exposición aguda a QUIN en este ensayo.';
  else if (assayId === 'dcfda') summary = exposure === 'feso4'
    ? 'No se detectó un incremento significativo de DCFDA con FeSO₄. TBARS y MTT describen otras dimensiones de la respuesta.'
    : 'La señal DCFDA describe procesos oxidativos y complementa los resultados de TBARS y MTT.';
  else if (assayId === 'tbars' && exposure === 'feso4') summary = 'El estudio documenta aumento de TBARS con FeSO₄. La figura presenta la respuesta correspondiente a cada edad posnatal.';
  else if (assayId === 'mtt' && exposure === '3np') summary = 'El estudio documenta disminución de la señal MTT con 3-NP, indicativa de cambios en la capacidad reductora.';
  else if (assayId === 'mtt') summary = 'El estudio documenta cambios de la señal MTT con FeSO₄. La figura presenta la respuesta de cada edad posnatal.';
  else summary = 'La figura presenta la señal TBARS tras la exposición a 3-NP junto al control correspondiente a la misma edad posnatal.';
  return {
    status, mean: null, sem: null, summary,
    comparison: 'Referencia: control correspondiente a la misma edad posnatal.',
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
    unit: `Unidad: ${assay.displayUnit}.`,
    sample: result.status === 'available' ? 'Media ± SEM, n = 5–6.' : '',
    statistics: result.status === 'available' ? 'Comparaciones estadísticas según la figura original.' : '',
    caption: assay.caption,
    source: 'Figura original del análisis experimental.',
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
  { title: 'Lloyd, Hanna y Mason (1997) · Reacción de Fenton', url: 'https://pubmed.ncbi.nlm.nih.gov/9119257/', note: 'Química de formación del radical hidroxilo.' },
  { title: 'Heyes et al. (1993) · Vía de las quinureninas', url: 'https://pubmed.ncbi.nlm.nih.gov/8293279/', note: 'Contexto metabólico de QUIN en otras preparaciones.' },
  { title: 'Knight et al. (1988) · Especificidad de TBARS', url: 'https://pubmed.ncbi.nlm.nih.gov/3197281/', note: 'La reacción no identifica exclusivamente MDA.' },
  { title: 'PubChem · Ácido quinolínico, CID 1066', url: 'https://pubchem.ncbi.nlm.nih.gov/compound/1066', note: 'Estructura química del ácido quinolínico.' },
  { title: 'Huang et al. (2006) · 3-NP y complejo II', url: 'https://pubmed.ncbi.nlm.nih.gov/16371358/', note: 'Estudio estructural del mecanismo de inactivación de SDH.' },
  { title: 'Perkins y Stone (1983) · QUIN y receptores excitadores', url: 'https://pubmed.ncbi.nlm.nih.gov/6308211/', note: 'Farmacología primaria del potencial excitador de QUIN.' },
  { title: 'LeBel, Ischiropoulos y Bondy (1992) · Sonda DCFH', url: 'https://doi.org/10.1021/tx00026a012', note: 'Dependencia química y límites de interpretación de la señal fluorescente.' },
  { title: 'Ohkawa, Ohishi y Yagi (1979) · Reacción de ácido tiobarbitúrico', url: 'https://pubmed.ncbi.nlm.nih.gov/36810/', note: 'Método de referencia para productos de peroxidación lipídica.' },
  { title: 'Berridge y Tan (1993) · Reducción celular de MTT', url: 'https://pubmed.ncbi.nlm.nih.gov/8390225/', note: 'Contribuciones reductoras que impiden equiparar MTT con actividad específica de complejo II.' },
  { title: 'Bates et al. (1994) · Desarrollo y metabolismo mitocondrial cerebral', url: 'https://pubmed.ncbi.nlm.nih.gov/7768212/', note: 'Contexto del desarrollo posnatal y metabolismo energético cerebral.' },
];
