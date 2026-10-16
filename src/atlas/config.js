// Available regions resolve through the mechanism registry. Other regions remain bookmarks.
export const mechanisms = [
  { id: 'glutamate', title: 'Glutamatergic excitotoxicity', scene: 'glutamate', available: true,
    description: 'From synaptic communication to calcium overload.' },
  { id: 'mitochondrial', title: 'Mitochondrial dysfunction', scene: 'mitochondrial', available: true,
    description: 'Panel D · reactive species and membrane damage.' },
  { id: 'signaling', title: 'Synaptic plasticity', scene: 'signaling', available: true,
    description: 'Panel A · spine organization and structural remodeling.' },
  { id: 'microglia', title: 'Microglia', scene: 'microglia', available: true,
    description: 'Panel C · recognition and remodeling of an altered connection.' },
  { id: 'apoptosis', title: 'Apoptosis', scene: null, available: false },
];
