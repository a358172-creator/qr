// Available regions resolve through the mechanism registry. Other regions remain bookmarks.
export const mechanisms = [
  { id: 'glutamate', title: 'Excitotoxicidad glutamatérgica', scene: 'glutamate', available: true,
    description: 'De la comunicación sináptica a la sobrecarga de calcio.' },
  { id: 'mitochondrial', title: 'Disfunción mitocondrial', scene: 'mitochondrial', available: true,
    description: 'Panel D · especies reactivas y daño de membranas.' },
  { id: 'signaling', title: 'Señalización celular', scene: null, available: false },
  { id: 'microglia', title: 'Activación microglial', scene: null, available: false },
  { id: 'apoptosis', title: 'Apoptosis', scene: null, available: false },
];
