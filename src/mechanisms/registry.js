// Modules supply biology and geometry; the atlas owns all shared controllers.
const loaders = {
  glutamate: () => import('./glutamate.js'),
  mitochondrial: () => import('./mitochondrial-dysfunction.js'),
  microglia: () => import('./microglia.js'),
  signaling: () => import('./synaptic-plasticity.js'),
};

export async function loadMechanism(id) {
  if (['e-control', 'e-feso4', 'e-quin', 'e-3np'].includes(id)) {
    return (await import('./evidence.js')).getEvidenceMechanism(id);
  }
  if (!loaders[id]) throw new RangeError(`Unknown mechanism: ${id}`);
  return (await loaders[id]()).default;
}
