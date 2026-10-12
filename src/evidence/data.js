import { figureSource } from './figure-source.js';

// No bar heights are digitised. Figure coordinates below are only hit/selection
// regions; exact experimental means, SEM and p-values remain unavailable.
const base = import.meta.env?.BASE_URL ?? './';
export const AGES = [3, 5, 9, 12, 30].map(day => ({ id: `PN${day}`, day }));
export const EXPOSURES = [
  { id: 'control', label: 'Control', concentration: '', mechanismKey: 'e-control', atlasTarget: 'mitochondrial', mechanism: 'La bicapa y la mitocondria aportan una referencia anatómica para interpretar mecanismos. No reconstruyen el homogeneizado ni demuestran que las células del control conservaran una organización intacta.' },
  { id: 'feso4', label: 'FeSO₄', concentration: '1 mM', mechanismKey: 'e-feso4', atlasTarget: 'mitochondrial', mechanism: 'El hierro redox-activo puede participar en la reacción de Fenton y favorecer oxidación lipídica localizada. La escena ilustra esta química; TBARS, DCFDA y MTT no identificaron directamente •OH ni productos lipídicos individuales.' },
  { id: 'quin', label: 'QUIN', concentration: '100 µM', mechanismKey: 'e-quin', atlasTarget: 'glutamate', mechanism: 'QUIN puede activar NMDAR y favorecer desregulación de Ca²⁺ en condiciones apropiadas. Coagonistas, voltaje y duración condicionan la respuesta. La animación representa mecanismos descritos en otros modelos, no activación de NMDAR demostrada en estas muestras.' },
  { id: '3np', label: '3-NP', concentration: '3 mM', mechanismKey: 'e-3np', atlasTarget: 'mitochondrial', mechanism: '3-NP puede inactivar SDH/complejo II y reducir su transferencia de electrones hacia ubiquinona. Esa acción farmacológica está descrita en literatura. Una disminución de MTT no constituye una medida directa de SDH, ATP ni respiración mitocondrial.' },
];
export const MTT_NOTE = 'Nota editorial: el pie original indica «a p<0.05 vs. PN3», pero PN3 no está representado y aparecen asteriscos, no letras a. Según la aclaración del autor, probablemente señalan p<0.05 frente al control de cada edad. Es una interpretación propuesta del pie, no verificada independientemente; se conservan exactamente los símbolos y no se recalculan pruebas ni valores.';
export const TBARS_NOTE = 'Aclaración del investigador: QUIN no mostró un patrón consistente de incremento de peroxidación lipídica entre las edades evaluadas. La figura conserva diferencias significativas respecto al control en condiciones tempranas, indicadas por asteriscos en PN3 y PN5. No se generaliza el efecto a todas las edades ni se recalculan resultados.';
const methods = {
  dcfda: { label: 'DCFDA', title: 'Señal oxidativa · DCFDA', unit: 'oxidacion de DCFA (μM/ug proteina)',
    method: 'Evaluación indirecta de procesos oxidativos mediante formación de una señal fluorescente a partir de la sonda. La figura conserva la denominación impresa «DCFA».',
    limitation: 'La señal depende de la química de la sonda, catalizadores y condiciones del ensayo; no identifica por sí sola una ROS específica ni su origen mitocondrial. La unidad impresa se conserva sin reinterpretar su calibración.',
    statisticalNotes: 'El pie define a p<0.05 frente a PN5. Esa comparación entre edades no equivale a una comparación de cada exposición frente a su control.' },
  tbars: { label: 'TBARS', title: 'Peroxidación lipídica · TBARS', unit: 'µM MDA/mg proteina',
    method: 'Evaluación de sustancias reactivas al ácido tiobarbitúrico relacionadas con productos de oxidación lipídica. Se conserva la unidad expresada en términos de MDA de la figura.',
    limitation: 'La reacción no es específica de una única molécula. TBARS no identifica directamente •OH, cada especie lipídica oxidada ni lisis celular.',
    statisticalNotes: 'El pie define a p<0.05 frente a PN3 y * p<0.05 frente al control de cada edad posnatal. Los símbolos originales se conservan sin desplazamientos.' },
  mtt: { label: 'MTT', title: 'Capacidad reductora · MTT', unit: 'MTT reduction (%)',
    method: 'Evaluación de capacidad reductora mediante conversión de MTT a formazán. La figura presenta el resultado en porcentaje, en PN5, PN9, PN12 y PN30.',
    limitation: 'Distintos sistemas reductores pueden contribuir a la señal. En un homogeneizado, MTT no mide directamente viabilidad neuronal, complejo II, ATP ni respiración.', statisticalNotes: MTT_NOTE },
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
  if (status === 'not-evaluated') return { status, mean: null, sem: null, summary: 'No evaluado: la figura de MTT no incluye PN3.', comparison: 'No se genera una barra, valor ni comparación para esta edad.', statisticalCaution: MTT_NOTE, provenance };
  let summary;
  if (exposure === 'control') summary = `Control de ${age}: referencia experimental para las exposiciones de esa edad. La barra seleccionada y su error se mantienen en la figura original.`;
  else if (exposure === 'quin') summary = assayId === 'tbars'
    ? (['PN3', 'PN5'].includes(age) ? `QUIN en ${age}: la figura original señala una diferencia significativa respecto al control de la misma edad (* p<0.05, según su pie). No se observa un patrón consistente de incremento de TBARS entre todas las edades evaluadas.` : 'QUIN no mostró un patrón consistente de incremento de TBARS entre edades. Las diferencias significativas indicadas en condiciones tempranas no justifican atribuir un efecto generalizado de peroxidación lipídica.')
    : 'Según la conclusión del estudio proporcionada, en la exposición aguda a QUIN no se detectaron modificaciones estadísticamente significativas. Esto no demuestra ausencia de efecto biológico.';
  else if (assayId === 'dcfda') summary = 'La señal DCFDA aporta una perspectiva indirecta. La ausencia de un incremento significativo detectado no excluye cambios en TBARS o MTT; los ensayos evalúan variables distintas.';
  else if (assayId === 'tbars' && exposure === 'feso4') summary = 'El estudio documenta aumento de TBARS con FeSO₄. Consulta la barra de la edad seleccionada y las comparaciones indicadas en la figura; no se presupone la misma respuesta en todas las edades.';
  else if (assayId === 'mtt' && exposure === '3np') summary = 'El estudio documenta disminución de la señal MTT con 3-NP. La barra resaltada permite consultar la edad seleccionada sin inferir una medida directa de complejo II o ATP.';
  else if (assayId === 'mtt') summary = 'El estudio documenta cambios de MTT con FeSO₄. Su dirección y magnitud visual deben leerse por edad en la figura; no se impone una disminución uniforme.';
  else summary = 'Consulta la señal TBARS de 3-NP y el control de la misma edad en la figura original. No se deduce significancia por la altura de las barras ni un aumento de ROS mitocondrial específico.';
  return {
    status, mean: null, sem: null, summary,
    comparison: exposure === 'control' ? 'Referencia: control correspondiente a la misma edad posnatal.' : `Comparación de consulta: ${EXPOSURES.find(item => item.id === exposure).label} y control de ${age}. La significancia se interpreta con el pie original, no con la altura de la barra.`,
    statisticalCaution: assayId === 'mtt' ? MTT_NOTE : assayId === 'tbars' && exposure === 'quin' ? TBARS_NOTE : assay.statisticalNotes,
    provenance,
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
  { title: 'Lloyd, Hanna y Mason (1997) · Reacción de Fenton', url: 'https://pubmed.ncbi.nlm.nih.gov/9119257/', note: 'Evidencia química del origen de •OH; no demuestra su producción en las muestras del estudio.' },
  { title: 'Heyes et al. (1993) · Vía de las quinureninas', url: 'https://pubmed.ncbi.nlm.nih.gov/8293279/', note: 'Contexto metabólico de QUIN en otras preparaciones.' },
  { title: 'Knight et al. (1988) · Especificidad de TBARS', url: 'https://pubmed.ncbi.nlm.nih.gov/3197281/', note: 'La reacción no identifica exclusivamente MDA.' },
  { title: 'PubChem · Ácido quinolínico, CID 1066', url: 'https://pubchem.ncbi.nlm.nih.gov/compound/1066', note: 'Conectividad utilizada para el símbolo estilizado de QUIN; no es una reconstrucción atomística.' },
  { title: 'Huang et al. (2006) · 3-NP y complejo II', url: 'https://pubmed.ncbi.nlm.nih.gov/16371358/', note: 'Estudio estructural del mecanismo de inactivación de SDH; no es una medición del estudio mostrado.' },
  { title: 'Perkins y Stone (1983) · QUIN y receptores excitadores', url: 'https://pubmed.ncbi.nlm.nih.gov/6308211/', note: 'Farmacología primaria del potencial excitador de QUIN.' },
  { title: 'LeBel, Ischiropoulos y Bondy (1992) · Sonda DCFH', url: 'https://doi.org/10.1021/tx00026a012', note: 'Dependencia química y límites de interpretación de la señal fluorescente.' },
  { title: 'Ohkawa, Ohishi y Yagi (1979) · Reacción de ácido tiobarbitúrico', url: 'https://pubmed.ncbi.nlm.nih.gov/36810/', note: 'Método de referencia; no se presume que todos sus detalles se usaran en el estudio sin un protocolo completo.' },
  { title: 'Berridge y Tan (1993) · Reducción celular de MTT', url: 'https://pubmed.ncbi.nlm.nih.gov/8390225/', note: 'Contribuciones reductoras que impiden equiparar MTT con actividad específica de complejo II.' },
  { title: 'Bates et al. (1994) · Desarrollo y metabolismo mitocondrial cerebral', url: 'https://pubmed.ncbi.nlm.nih.gov/7768212/', note: 'Contexto del desarrollo; no proporciona equivalencias lineales entre rata y humano.' },
];
