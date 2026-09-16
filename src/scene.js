import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const C = { cyan: 0x48e4f2, blue: 0x397bff, purple: 0x9e72ff, pink: 0xf068a8, orange: 0xff9e61, tissue: 0x7563bf };
const material = (color, options = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .32, metalness: .05, clearcoat: .25, ...options });
const data = {
  ampa: ['02 — RECEPTOR', 'Receptor AMPA', 'Los receptores AMPA median gran parte de la transmisión excitadora rápida. Su apertura favorece principalmente el flujo de Na⁺.', 'Canal activado de forma conceptual.'],
  nmda: ['03 — RECEPTOR', 'Receptor NMDA', 'Los receptores NMDA requieren glutamato y condiciones de voltaje adecuadas. En sobrecarga, su señal puede contribuir a una entrada elevada de Ca²⁺.', 'El Mg²⁺ y los cofactores se simplifican en este modelo.'],
  mitochondria: ['04 — ORGÁNULO', 'Mitocondria', 'Integra el estado energético y las señales de calcio. La sobrecarga puede asociarse con disfunción metabólica y estrés oxidativo.', 'Las crestas representan la arquitectura interna de forma simplificada.'],
  calcium: ['05 — IÓN SEÑAL', 'Entrada de Ca²⁺', 'El calcio participa en señalización fisiológica. Una acumulación sostenida puede alterar la homeostasis celular.', 'La densidad de partículas es ilustrativa, no cuantitativa.'],
  ros: ['06 — SEÑAL', 'Especies reactivas de oxígeno', 'Las ROS son productos y señales químicas que, cuando exceden las defensas celulares, pueden contribuir al daño oxidativo.', 'Su brillo representa una señal conceptual.'],
  caspases: ['07 — VÍA DE DAÑO', 'Caspasas', 'Se muestran como una señal conceptual de rutas proteolíticas asociadas a daño celular; no representan una estructura anatómica.', 'No se infiere destino celular a partir de este modelo.'],
};

export function createSynapse(canvas, onSelect) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x061827, .075);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, 1.3, 12.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = .06; controls.enablePan = false;
  controls.minDistance = 8.5; controls.maxDistance = 16; controls.target.set(0, 0, 0);
  controls.autoRotate = true; controls.autoRotateSpeed = .28;
  scene.add(new THREE.HemisphereLight(0x6edfff, 0x100b25, 2.1));
  const key = new THREE.PointLight(0x9edcff, 18, 24, 2); key.position.set(-4, 5, 7); scene.add(key);
  const rim = new THREE.PointLight(0xf35fab, 15, 20, 2); rim.position.set(5, -2, 4); scene.add(rim);
  const fill = new THREE.PointLight(0x4388ff, 11, 16, 2); fill.position.set(0, -5, -3); scene.add(fill);

  const root = new THREE.Group(); scene.add(root);
  const selectable = []; const labels = []; const animated = { glutamate: [], calcium: [], ros: [], vesicles: [], caspases: [], receptors: [] };
  const organicGeo = new THREE.SphereGeometry(1, 42, 30);
  const pre = new THREE.Mesh(organicGeo, material(C.tissue, { transmission: .12, thickness: 1.1, transparent: true, opacity: .88 }));
  pre.scale.set(3.25, 1.65, 1.45); pre.position.set(-.15, 2.55, 0); pre.rotation.z = -.09; root.add(pre);
  const preGlow = new THREE.Mesh(organicGeo, material(0x7455d8, { transparent: true, opacity: .13, side: THREE.BackSide })); preGlow.scale.set(3.4, 1.78, 1.58); preGlow.position.copy(pre.position); root.add(preGlow);
  const post = new THREE.Mesh(organicGeo, material(0x5640a0, { transmission: .1, thickness: .9, transparent: true, opacity: .9 }));
  post.scale.set(2.4, 1.55, 1.2); post.position.set(.45, -2.35, .05); root.add(post);
  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(.8, 3.7, 12, 28), material(0x4e3c94, { transparent: true, opacity: .9 })); neck.position.set(.38, -4.25, .05); neck.rotation.z = -.13; root.add(neck);
  // subtly irregular membrane contours
  [pre, post].forEach((body, i) => { const wire = new THREE.Mesh(body.geometry, new THREE.MeshBasicMaterial({ color: i ? 0x80bdf8 : 0xdca4ff, wireframe: true, transparent: true, opacity: .11 })); wire.position.copy(body.position); wire.rotation.copy(body.rotation); wire.scale.copy(body.scale).multiplyScalar(1.015); root.add(wire); });
  labels.push(['Terminal presináptica', pre, new THREE.Vector3(-1.9, 3.6, 0)]);
  labels.push(['Espina dendrítica', post, new THREE.Vector3(2, -2.8, 0)]);

  const vesMat = material(0xa8d5ff, { emissive: 0x243d7d, emissiveIntensity: .5, transparent: true, opacity: .92 });
  for (let i = 0; i < 26; i++) { const v = new THREE.Mesh(new THREE.SphereGeometry(.13 + (i % 4) * .018, 18, 14), vesMat); const a = i * 2.4; v.position.set(Math.sin(a) * 2.25, 2.35 + Math.cos(a * 1.7) * .75, Math.cos(a) * .7); root.add(v); animated.vesicles.push(v); }
  labels.push(['Vesículas', animated.vesicles[3], new THREE.Vector3(-2.6, 2.8, 0)]);

  function receptor(kind, x, y, color) { const g = new THREE.Group(); const m = material(color, { emissive: color, emissiveIntensity: .28 }); for (const dx of [-.17, .17]) { const l = new THREE.Mesh(new THREE.CapsuleGeometry(.11, .72, 8, 12), m); l.position.set(dx, 0, 0); g.add(l); } const cap = new THREE.Mesh(new THREE.SphereGeometry(.27, 16, 12), m); cap.scale.y = .62; cap.position.y = .42; g.add(cap); g.position.set(x, y, .1); g.rotation.z = kind === 'nmda' ? .12 : -.13; g.userData.key = kind; root.add(g); selectable.push(g); animated.receptors.push(g); labels.push([kind === 'ampa' ? 'AMPA' : 'NMDA', g, new THREE.Vector3(x, y - .55, 0)]); return g; }
  receptor('ampa', -1.2, -.7, C.cyan); receptor('ampa', -.1, -.78, C.cyan); receptor('nmda', 1.05, -.72, C.purple); receptor('nmda', 1.95, -.82, C.purple);
  const mito = new THREE.Group(); const mitoOuter = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 22), material(0xee7d8d, { emissive: 0x6d123d, emissiveIntensity: .25, transparent: true, opacity: .96 })); mitoOuter.scale.set(1.55, .6, .55); mito.add(mitoOuter); for (let i = 0; i < 5; i++) { const crest = new THREE.Mesh(new THREE.TorusGeometry(.25, .06, 8, 18, Math.PI * 1.3), material(0xffb1a0, { emissive: 0x551024, emissiveIntensity: .25 })); crest.position.set(-.85 + i * .42, 0, .52); crest.rotation.z = Math.PI / 2; mito.add(crest); } mito.position.set(.5, -2.35, .78); mito.rotation.z = -.22; mito.userData.key = 'mitochondria'; root.add(mito); selectable.push(mito); labels.push(['Mitocondria', mito, new THREE.Vector3(.7, -3.25, 0)]);
  const glutMat = material(C.orange, { emissive: 0xff4a1d, emissiveIntensity: .9 }); for (let i = 0; i < 44; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.055 + (i % 3) * .018, 12, 10), glutMat); p.userData = { phase: i * .61, lane: (i % 9) - 4 }; root.add(p); animated.glutamate.push(p); }
  labels.push(['Glutamato', animated.glutamate[15], new THREE.Vector3(-2.4, .6, 0)]);
  const caMat = material(0x53dfff, { emissive: 0x0eb7ff, emissiveIntensity: 1 }); const calciumGroup = new THREE.Group(); calciumGroup.userData.key = 'calcium'; root.add(calciumGroup); selectable.push(calciumGroup); for (let i = 0; i < 28; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 10), caMat); p.userData.phase = i * .76; calciumGroup.add(p); animated.calcium.push(p); } labels.push(['Ca²⁺', calciumGroup, new THREE.Vector3(2.7, -1.4, 0)]);
  const rosGroup = new THREE.Group(); rosGroup.userData.key = 'ros'; root.add(rosGroup); selectable.push(rosGroup); for (let i = 0; i < 14; i++) { const p = new THREE.Mesh(new THREE.OctahedronGeometry(.09, 1), material(C.pink, { emissive: 0xff216b, emissiveIntensity: 1.4 })); p.userData.phase = i * .85; rosGroup.add(p); animated.ros.push(p); } labels.push(['ROS', rosGroup, new THREE.Vector3(2.45, -2.05, 0)]);
  const casGroup = new THREE.Group(); casGroup.userData.key = 'caspases'; root.add(casGroup); selectable.push(casGroup); for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 1), material(0xf94e93, { emissive: 0x8f0c44, emissiveIntensity: .5 })); p.position.set(-.6 + i * .24, -3.25 + (i % 2) * .22, .65); casGroup.add(p); animated.caspases.push(p); } labels.push(['Caspasas', casGroup, new THREE.Vector3(-1.55, -3.6, 0)]);
  let overload = false; let playing = true; let selected = null; const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  function setMode(next) { overload = next === 'overload'; scene.fog.density = overload ? .09 : .075; rim.color.setHex(overload ? 0xff3c82 : 0xf35fab); }
  function select(key) { selected = key; onSelect?.(key, data[key]); }
  canvas.addEventListener('pointerup', (e) => { if (Math.abs(e.movementX) + Math.abs(e.movementY) > 5) return; const r = canvas.getBoundingClientRect(); pointer.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(selectable, true)[0]; if (hit) { let object = hit.object; while (object && !object.userData.key) object = object.parent; if (object?.userData.key) select(object.userData.key); } });
  function resize() { const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return; camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); renderer.setSize(r.width, r.height, false); }
  const clock = new THREE.Clock();
  function tick() { const t = clock.getElapsedTime(); const gain = overload ? 1.9 : .72; if (playing) { animated.glutamate.forEach((p, i) => { const q = (t * (.2 + gain * .19) + p.userData.phase) % 1; p.position.set(p.userData.lane * .32 + Math.sin(t + i) * .08, 1.35 - q * 1.9, .38 + Math.cos(i * 1.7 + t) * .6); p.visible = i < (overload ? 44 : 19); }); animated.calcium.forEach((p, i) => { const q = (t * (.22 + gain * .18) + p.userData.phase) % 1; p.position.set(.8 + Math.sin(i * 2.1) * .7, -.95 - q * 1.85, .3 + Math.cos(i * 1.6) * .55); p.visible = i < (overload ? 28 : 8); }); animated.ros.forEach((p, i) => { p.position.set(1.15 + Math.sin(t * 1.5+i)*(.65+i%3*.1), -2.25 + Math.cos(t*1.2+i*.7)*.55, .9); p.rotation.set(t, t*.5, 0); p.visible = overload || i < 3; }); animated.vesicles.forEach((v,i)=>v.position.y += Math.sin(t*1.2+i)*.0009); animated.receptors.forEach((r,i)=>r.scale.setScalar(1 + (overload ? .08 : .025) * Math.sin(t*2+i))); casGroup.visible = overload; mitoOuter.material.emissiveIntensity = overload ? .82 : .25; mitoOuter.material.color.setHex(overload ? 0xc74771 : 0xee7d8d); controls.update(); } renderer.render(scene, camera); requestAnimationFrame(tick); }
  resize(); new ResizeObserver(resize).observe(canvas); tick();
  return { setMode, select, setPlaying: (v) => { playing = v; controls.autoRotate = v; }, reset: () => { camera.position.set(0,1.3,12.5); controls.target.set(0,0,0); controls.update(); }, getLabels: () => labels.map(([name, object, offset]) => ({ name, position: object.getWorldPosition(new THREE.Vector3()).add(offset), key: object.userData.key })), project: (v) => v.clone().project(camera), isOverload: () => overload };
}
