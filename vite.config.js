import { defineConfig } from 'vite';

export default defineConfig({
  // Uses relative asset paths, so the built folder works at any GitHub Pages project URL.
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Separate stable math/geometry code from the WebGL renderer; the UI
        // loads independently and no arbitrary size-warning override is needed.
        manualChunks(id) {
          if (id.includes('/node_modules/three/build/three.core.js')) return 'three-core';
          if (id.includes('/node_modules/three/')) return 'three-webgl';
        },
      },
    },
  },
});
