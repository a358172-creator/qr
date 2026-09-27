import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createNeuron } from './atlas/neuron.js';
import { mechanisms } from './atlas/config.js';
import { createAfferentAxon } from './atlas/axon.js';
import { createAnatomy } from './scene/anatomy.js';
import { createParticles } from './scene/particles.js';
import { createCameraController } from './core/camera.js';
import { createInteractionManager } from './core/interaction.js';
import { createAnnotations } from './core/annotations.js';
import { createTimeline } from './core/timeline.js';
import { glutamateMechanism } from './mechanisms/glutamate.js';

const vector = (x, y, z = 0) => new THREE.Vector3(x, y, z);
export async function createAtlas(canvas, { hotspotLayer, labelLayer, onView, onSelect, onTimeline, onProgress, onRegion, onContextLost } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .025, 180);
  const controls = new OrbitControls(camera, canvas);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  controls.enableDamping = !motion.matches; controls.dampingFactor = .065;
  controls.enablePan = false; controls.rotateSpeed = .4; controls.zoomSpeed = .6;
  // Every scale keeps generous orbit freedom without turning the specimen upside down.
  controls.minPolarAngle = .65; controls.maxPolarAngle = 2.15;
  controls.minAzimuthAngle = -.85; controls.maxAzimuthAngle = 1.0;
  controls.target.copy(vector(-5, -.4, -1)); camera.position.copy(vector(-3, 8, 35));
  const cameraController = createCameraController(camera, controls, () => motion.matches);
  const ambient = new THREE.HemisphereLight(0xd2e0ed, 0x3b294b, .6); scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffe5dc, 2.35); key.position.set(-8, 12, 11); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc0d9ea, .55); fill.position.set(8, 3, 9); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xcbbae7, 1.65); rim.position.set(-5, 7, -8); scene.add(rim);
  const bounce = new THREE.DirectionalLight(0xd19ba9, .35); bounce.position.set(0, -7, 4); scene.add(bounce);
  let environmentTarget;
  function buildEnvironment() {
    environmentTarget?.dispose();
    const pmrem = new THREE.PMREMGenerator(renderer), environment = new RoomEnvironment();
    environmentTarget = pmrem.fromScene(environment, .06);
    scene.environment = environmentTarget.texture; scene.environmentIntensity = .16;
    environment.dispose(); pmrem.dispose();
  }
  buildEnvironment();
  const neuron = createNeuron(); scene.add(neuron.root);
  const anatomy = createAnatomy({ includeDendrite: false });
  anatomy.root.position.copy(neuron.synapseOrigin); anatomy.root.scale.setScalar(neuron.synapseScale);
  scene.add(anatomy.root);
  scene.add(createAfferentAxon(anatomy.texture));
  const world = point => point.clone().multiplyScalar(neuron.synapseScale).add(neuron.synapseOrigin);
  const particles = createParticles(anatomy.root, anatomy.nmdaChannels, anatomy.receptors);
  const hotspotConfigs = neuron.hotspots.map(item => {
    const id = item.id === 'synapse' ? 'glutamate' : item.id === 'mitochondria' ? 'mitochondrial' : item.id;
    return { ...item, ...mechanisms.find(mechanism => mechanism.id === id) };
  });
  const hitGeometry = new THREE.SphereGeometry(.28, 12, 8);
  const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
  const hotspotMeshes = hotspotConfigs.map(item => {
    const mesh = new THREE.Mesh(hitGeometry, hitMaterial); mesh.position.copy(item.position);
    mesh.userData.key = item.id; scene.add(mesh); return mesh;
  });
  const anchors = anatomy.labelAnchors.map(item => ({ ...item, position: world(item.position) }));
  const annotations = createAnnotations({ hotspotLayer, labelLayer, camera, canvas, hotspots: hotspotConfigs, anchors, onHotspot: openHotspot, onSelect: select });
  let view = 'neuron', selected = null, hovered = null, exploring = false, width = 0, height = 0;
  let frame = 0, lastTime = 0, disposed = false, contextLost = false, biologicalTime = 0, introTimer = null;
  let transitioning = false, dirty = true;
  const current = { glut: .12, activation: .04, ca: 0, stress: 0, damage: 0 };
  const baseState = { ...current };
  const transform = new THREE.Object3D(), cargoTransform = new THREE.Object3D();
  const abort = new AbortController(), listen = (element, name, callback) => element.addEventListener(name, callback, { signal: abort.signal });
  const timeline = createTimeline({
    steps: glutamateMechanism.steps,
    onChange(state) {
      onTimeline?.({ ...state, exploring });
      if (view === 'synapse' && !exploring && !transitioning) {
        if (state.playing) focusStep(state.step);
        controls.enabled = !state.playing && !cameraController.active;
      }
      invalidate();
    },
  });
  function invalidate() {
    dirty = true;
    if (!frame && !disposed && !contextLost && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function clearIntro() { if (introTimer) clearTimeout(introTimer); introTimer = null; }
  function poseFor(nextView) {
    if (nextView === 'synapse') {
      const target = world(vector(0, -.25, 0));
      // On portrait displays preserve receptor readability while leaving room for the narrative.
      const factor = Math.max(1, .69 / camera.aspect);
      const offset = vector(2.15, 1.5, 14).multiplyScalar(neuron.synapseScale * factor);
      return { target, position: target.clone().add(offset) };
    }
    const pose = neuron.cameraPoses[nextView === 'neuron' ? 'overview' : 'hub'];
    const target = pose.target.clone(), offset = pose.position.clone().sub(pose.target);
    if (width < 640) {
      if (nextView === 'neuron') { target.copy(vector(-7, -.4, -1)); offset.multiplyScalar(1.33); }
      else { target.copy(vector(.7, .7, 0)); offset.multiplyScalar(1.04); }
    }
    return { target, position: target.clone().add(offset) };
  }
  function limits(pose, isDetail) {
    const distance = pose.position.distanceTo(pose.target);
    controls.minDistance = isDetail ? distance * .47 : distance * .36;
    controls.maxDistance = isDetail ? distance * 1.6 : distance * 1.75;
  }
  function navigate(nextView, { duration = 3.4, intro = false } = {}) {
    clearIntro();
    if (!['hub', 'neuron', 'synapse'].includes(nextView)) return;
    // Time spent inspecting a still frame is not part of the next camera trip.
    lastTime = 0;
    timeline.pause(); exploring = false; selected = null; hovered = null;
    onSelect?.(null);
    view = nextView; transitioning = true;
    const pose = poseFor(view);
    onView?.({ view, transitioning: true, exploring });
    cameraController.move(pose.position, pose.target, { duration, onComplete() {
      transitioning = false;
      limits(pose, view === 'synapse');
      controls.enabled = true;
      if (view === 'synapse') {
        annotations.setVisited('glutamate');
        onTimeline?.({ ...timeline.getState(), exploring });
      }
      onView?.({ view, transitioning: false, exploring });
      invalidate();
    } });
    if (!intro) canvas.focus({ preventScroll: true });
    invalidate();
  }
  function openHotspot(id) {
    const entry = mechanisms.find(item => item.id === id);
    if (!entry) return;
    if (entry.available) navigate('synapse');
    else onRegion?.(entry);
  }
  function select(key) {
    if (view !== 'synapse' || transitioning) return;
    selected = key; onSelect?.(key); invalidate();
  }
  function focusStep(step) {
    const pose = poseFor('synapse');
    const focus = world(vector(...step.focus));
    const target = pose.target.clone().lerp(focus, .23);
    const position = target.clone().add(pose.position.sub(pose.target).multiplyScalar(.97));
    cameraController.move(position, target, { duration: 1.6, onComplete() { controls.enabled = !timeline.getState().playing; invalidate(); } });
  }
  const interactive = createInteractionManager(canvas, camera, {
    objects: () => view === 'synapse' ? [...anatomy.selectable, ...particles.selectable] : hotspotMeshes,
    enabled: () => !transitioning && !cameraController.active,
    onSelect: key => view === 'synapse' ? select(key) : key && openHotspot(key),
    onHover: key => { if (hovered !== key) { hovered = key; invalidate(); } },
  });
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    const pose = poseFor(view);
    const wasPlaying = timeline.getState().playing;
    cameraController.cancel(); transitioning = false;
    limits(pose, view === 'synapse');
    camera.position.copy(pose.position); controls.target.copy(pose.target);
    controls.enabled = !wasPlaying;
    onView?.({ view, transitioning: false, exploring });
    annotations.resize(width, height); controls.update(); invalidate();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  const controlsChange = () => invalidate();
  const controlsStart = () => { clearIntro(); if (!transitioning) cameraController.cancel(); invalidate(); };
  controls.addEventListener('change', controlsChange); controls.addEventListener('start', controlsStart);
  listen(canvas, 'keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key) || !controls.enabled) return;
    event.preventDefault(); clearIntro(); cameraController.cancel();
    if (event.key === 'Home') { navigate(view, { duration: 1.2 }); return; }
    const offset = camera.position.clone().sub(controls.target), spherical = new THREE.Spherical().setFromVector3(offset);
    if (event.key === 'ArrowLeft') spherical.theta -= .09;
    if (event.key === 'ArrowRight') spherical.theta += .09;
    if (event.key === 'ArrowUp') spherical.phi -= .06;
    if (event.key === 'ArrowDown') spherical.phi += .06;
    if (event.key === '+' || event.key === '=') spherical.radius *= .92;
    if (event.key === '-') spherical.radius *= 1.08;
    spherical.theta = THREE.MathUtils.clamp(spherical.theta, controls.minAzimuthAngle, controls.maxAzimuthAngle);
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
    spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical)); controls.update(); invalidate();
  });
  listen(document, 'visibilitychange', () => { lastTime = 0; if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else invalidate(); });
  listen(motion, 'change', () => { controls.enableDamping = !motion.matches; if (motion.matches) { clearIntro(); timeline.pause(); navigate(view, { duration: 0 }); } invalidate(); });
  listen(canvas, 'webglcontextlost', event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; clearIntro(); timeline.pause(); onContextLost?.(true); });
  listen(canvas, 'webglcontextrestored', () => { buildEnvironment(); contextLost = false; lastTime = 0; onContextLost?.(false); invalidate(); });

  function updateAnatomy(dt, running, timelineState) {
    const target = view === 'synapse' ? timelineState.step.state : baseState;
    let changing = false;
    for (const name of Object.keys(current)) {
      // Explicit pause also freezes biochemical changes, not merely particle paths.
      if (running) current[name] = THREE.MathUtils.damp(current[name], target[name], 3, dt);
      if (running && Math.abs(current[name] - target[name]) > .001) changing = true;
    }
    particles.update(biologicalTime, current, selected);
    particles.calcium.visible = view === 'synapse' && timelineState.index >= 2;
    particles.sodium.visible = view === 'synapse' && timelineState.index >= 1;
    anatomy.vesicleSeeds.forEach((seed, i) => {
      transform.position.copy(seed.position); transform.position.y += Math.sin(biologicalTime * .55 + seed.phase) * .012;
      if (i < 5) transform.position.y -= .06 * (.5 + .5 * Math.sin(biologicalTime * 1.2 + seed.phase)) * current.glut;
      transform.scale.setScalar(seed.radius); transform.updateMatrix(); anatomy.vesicles.setMatrixAt(i, transform.matrix);
      for (let j = 0; j < 4; j++) {
        cargoTransform.position.set(transform.position.x + Math.sin(j * 2.4) * .05, transform.position.y + Math.cos(j * 1.5) * .04, transform.position.z + Math.cos(j * 2.4) * .05);
        cargoTransform.updateMatrix(); anatomy.cargo.setMatrixAt(i * 4 + j, cargoTransform.matrix);
      }
    });
    anatomy.vesicles.instanceMatrix.needsUpdate = true; anatomy.cargo.instanceMatrix.needsUpdate = true;
    for (const receptor of anatomy.receptors) {
      const active = receptor.kind === 'ampa' ? timelineState.index >= 1 : timelineState.index >= 2;
      receptor.material.emissiveIntensity = .06 + (active ? current.activation * .15 : 0) + (selected === receptor.kind ? .13 : 0);
    }
    anatomy.mito.outerMat.emissiveIntensity = .05 + current.stress * .18;
    anatomy.mito.foldMat.emissiveIntensity = .07 + current.stress * .12;
    anatomy.caspases.visible = false;
    return changing;
  }
  function tick(now) {
    frame = 0; if (disposed || contextLost || document.hidden) return;
    const dt = lastTime ? (now - lastTime) / 1000 : 0; lastTime = now;
    const running = view === 'synapse' && timeline.getState().playing && !exploring && !transitioning;
    if (running) { biologicalTime += dt; timeline.update(dt); }
    const moving = cameraController.update(dt);
    // Disabled OrbitControls still clamp the camera on update; skip them while
    // crossing scales so destination zoom limits cannot truncate the journey.
    if (cameraController.active) camera.lookAt(controls.target);
    else controls.update();
    const state = timeline.getState();
    if (dirty || moving || running) {
      updateAnatomy(dt, running, state);
      scene.updateMatrixWorld(); camera.updateMatrixWorld();
      annotations.update({ view, transitioning, selected, hovered, stress: current.stress, calcium: current.ca });
      renderer.render(scene, camera); onProgress?.(state.progress); dirty = false;
    }
    if ((running || cameraController.active) && !frame) frame = requestAnimationFrame(tick);
  }
  resize(); controls.update();
  await renderer.compileAsync(scene, camera);
  if (motion.matches) { view = 'hub'; const pose = poseFor(view); limits(pose, false); camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update(); }
  else introTimer = setTimeout(() => navigate('hub', { duration: 4.2, intro: true }), 1900);
  onView?.({ view, transitioning: false, exploring }); onTimeline?.({ ...timeline.getState(), exploring }); invalidate();
  return {
    navigate, select,
    setLabels(value) { annotations.setEnabled(value); invalidate(); },
    resetView() { navigate(view, { duration: 1.5 }); },
    playPause() {
      if (transitioning || view !== 'synapse') return;
      if (timeline.getState().playing) { timeline.pause(); cameraController.cancel(); }
      else { exploring = false; lastTime = 0; timeline.play(); }
      onTimeline?.({ ...timeline.getState(), exploring }); invalidate();
    },
    explore() {
      if (transitioning || view !== 'synapse') return;
      if (!exploring) { exploring = true; timeline.pause(); cameraController.cancel(); controls.enabled = true; }
      else { exploring = false; lastTime = 0; timeline.play(); }
      onTimeline?.({ ...timeline.getState(), exploring }); invalidate();
    },
    seek(index) {
      cameraController.cancel(); timeline.seek(THREE.MathUtils.clamp(index, 0, glutamateMechanism.steps.length - 1));
      Object.assign(current, timeline.getState().step.state); invalidate();
    },
    restart() { biologicalTime = 0; exploring = false; timeline.reset(); Object.assign(current, baseState); navigate('synapse', { duration: 1.2 }); },
    suspend() {
      clearIntro(); timeline.pause(); cameraController.cancel(); transitioning = false;
      // Preserve the current inspected pose, including a partially completed trip.
      limits({ position: camera.position, target: controls.target }, view === 'synapse');
      onView?.({ view, transitioning, exploring }); invalidate();
    },
    getState() { return { view, transitioning, exploring, selected, time: biologicalTime, timeline: { ...timeline.getState(), step: timeline.getState().step.key }, particles: { ...current }, camera: camera.position.toArray(), target: controls.target.toArray(), controlsEnabled: controls.enabled, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles }; },
    dispose() {
      disposed = true; clearIntro(); cancelAnimationFrame(frame); observer.disconnect(); abort.abort();
      controls.removeEventListener('change', controlsChange); controls.removeEventListener('start', controlsStart); controls.dispose();
      annotations.dispose(); interactive.dispose();
      const geometries = new Set(), materials = new Set(), textures = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); if (object.isInstancedMesh) object.dispose(); });
      materials.forEach(material => { Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); }); material.dispose(); });
      geometries.forEach(geometry => geometry.dispose()); textures.forEach(texture => texture.dispose()); environmentTarget.dispose(); renderer.dispose();
    },
  };
}
