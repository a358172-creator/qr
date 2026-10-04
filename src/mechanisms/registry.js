// Modules supply biology and geometry; the atlas owns all shared controllers.
const loaders = {
  glutamate: () => import('./glutamate.js'),
  mitochondrial: () => import('./mitochondrial-dysfunction.js'),
  microglia: () => import('./microglia.js'),
  signaling: () => import('./synaptic-plasticity.js'),
};

export async function loadMechanism(id) {
  if (!loaders[id]) throw new RangeError(`Unknown mechanism: ${id}`);
  return (await loaders[id]()).default;
}
