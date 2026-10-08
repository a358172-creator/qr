import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createNeuron } from './atlas/neuron.js';
import { mechanisms } from './atlas/config.js';
import { createAfferentAxon } from './atlas/axon.js';
import { createAnatomy } from './scene/anatomy.js';
import { createCameraController } from './core/camera.js';
import { createInteractionManager } from './core/interaction.js';
import { createAnnotations } from './core/annotations.js';
import { createMechanismSession } from './core/mechanism-session.js';
import { loadMechanism } from './mechanisms/registry.js';

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
  const cellularContext = new THREE.Group();
  cellularContext.add(neuron.root, anatomy.root, createAfferentAxon(anatomy.texture));
  scene.add(cellularContext);
  const contextMaterials = new Map();
  cellularContext.traverse(object => {
    if (!object.material) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!contextMaterials.has(material)) contextMaterials.set(material, {
        opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite,
      });
    }
  });
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
  const annotations = createAnnotations({ hotspotLayer, labelLayer, camera, canvas, hotspots: hotspotConfigs, onHotspot: openHotspot, onSelect: select });
  let view = 'neuron', selected = null, hovered = null, exploring = false, width = 0, height = 0;
  let frame = 0, lastTime = 0, disposed = false, contextLost = false, introTimer = null;
  let transitioning = false, dirty = true, navigationId = 0, active;
  const sessions = new Map(), pending = new Map();
  const abort = new AbortController(), listen = (element, name, callback) => element.addEventListener(name, callback, { signal: abort.signal });
  function emitView(loading = false) {
    onView?.({ view, transitioning, exploring, loading, mechanism: active?.definition });
    annotations.resize(width, height);
  }
  function availableKeys() {
    const index = active.timeline.getState().index;
    return active.model.visibleKeys?.(index) || active.anchors.map(anchor => anchor.key).filter(key =>
      key !== 'caspases' && (key !== 'calcium' || index >= 2) && (key !== 'ros' || index >= 3));
  }
  function emitTimeline() {
    if (active) onTimeline?.({ ...active.timeline.getState(), exploring, transitioning, mechanism: active.definition, availableKeys: availableKeys() });
    annotations.resize(width, height);
  }
  async function getSession(id) {
    if (sessions.has(id)) return sessions.get(id);
    if (pending.has(id)) return pending.get(id);
    const promise = (async () => {
      const definition = await loadMechanism(id);
      if (disposed) throw new Error('Atlas disposed during module loading');
      const model = await definition.createScene({ texture: anatomy.texture, anatomy });
      if (disposed) { disposeObjects(model.root); throw new Error('Atlas disposed during scene creation'); }
      if (model.root !== anatomy.root) {
        // Prepare new materials while the loading state is visible, before the
        // camera starts its journey through this specimen.
        try { await renderer.compileAsync(model.root, camera, scene); }
        catch (error) { disposeObjects(model.root); throw error; }
        if (disposed) { disposeObjects(model.root); throw new Error('Atlas disposed during shader preparation'); }
        const site = hotspotConfigs.find(item => item.id === id);
        // A magnified open section sits at its dendritic site, in front of the
        // intact tissue. The camera visits that site before entering the section.
        model.root.position.copy(site.position).add(vector(0, .25, 1.1));
        model.root.scale.setScalar(.35); model.root.visible = false;
        scene.add(model.root);
      }
      const session = createMechanismSession(definition, model, state => {
        if (session !== active) return;
        if (selected && !availableKeys().includes(selected)) { selected = null; onSelect?.(null); }
        emitTimeline();
        if (view === 'synapse' && !exploring && !transitioning) {
          if (state.playing) focusStep(state.step);
          controls.enabled = !state.playing && !cameraController.active;
        }
        invalidate();
      });
      session.anchors = model.labelAnchors.map(item => ({ ...item, position: item.position.clone() }));
      sessions.set(id, session); pending.delete(id); return session;
    })();
    pending.set(id, promise);
    try { return await promise; } catch (error) { pending.delete(id); throw error; }
  }
  active = await getSession('glutamate');
  function syncAnchors() {
    active.model.root.updateMatrixWorld(true);
    active.anchors.forEach((anchor, i) => anchor.position.copy(active.model.labelAnchors[i].position).applyMatrix4(active.model.root.matrixWorld));
  }
  function reconcileVisibility() {
    for (const [id, session] of sessions) {
      session.model.root.visible = view === 'synapse' && session === active;
      if (view !== 'synapse' || session !== active) session.leave();
    }
  }
  function updateCellularContext() {
    // Keep the spatial landmark during the approach, then reveal the cutaway
    // without an opaque macro-scale branch behind the intracellular specimen.
    const section = active.definition.isolatedContext && active.model.root.visible;
    const shortViewport = THREE.MathUtils.clamp((900 - height) / 180, 0, 1);
    const portraitFit = active.definition.portraitFit ?? .69;
    const distance = camera.position.distanceTo(active.model.root.position) / Math.max(1 + shortViewport * .18, portraitFit / camera.aspect);
    const overview = active.definition.cameraPoses[active.definition.overviewCamera];
    const detailDistance = vector(...overview.position).distanceTo(vector(...overview.target)) * active.model.root.scale.x;
    const inner = Math.max(5.8, detailDistance * 1.14), outer = Math.max(10.5, inner * 1.8);
    const opacity = section ? THREE.MathUtils.smoothstep(distance, inner, outer) : 1;
    cellularContext.visible = opacity > .002;
    for (const [material, baseline] of contextMaterials) {
      const transparent = opacity < .999 ? true : baseline.transparent;
      if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
      material.opacity = baseline.opacity * opacity;
      material.depthWrite = opacity < .999 ? false : baseline.depthWrite;
    }
  }
  syncAnchors(); annotations.setAnchors(active.anchors);
  function invalidate() {
    dirty = true;
    if (!frame && !disposed && !contextLost && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function clearIntro() { if (introTimer) clearTimeout(introTimer); introTimer = null; }
  function poseFor(nextView, cameraName) {
    if (nextView === 'synapse') {
      const definition = active.definition;
      const local = definition.cameraPoses[cameraName || definition.overviewCamera];
      const localTarget = vector(...local.target);
      const shortViewport = definition.isolatedContext ? THREE.MathUtils.clamp((900 - height) / 180, 0, 1) : 0;
      localTarget.y -= shortViewport * .70;
      const target = localTarget.applyMatrix4(active.model.root.matrixWorld);
      // On portrait displays preserve receptor readability while leaving room for the narrative.
      const factor = Math.max(1 + shortViewport * .18, (definition.portraitFit ?? .69) / camera.aspect);
      const offset = vector(...local.position).sub(vector(...local.target)).multiplyScalar(active.model.root.scale.x * factor);
      return { target, position: target.clone().add(offset) };
    }
    const pose = neuron.cameraPoses[nextView === 'neuron' ? 'overview' : 'hub'];
    const target = pose.target.clone(), offset = pose.position.clone().sub(pose.target);
    if (width < 640) {
      if (nextView === 'neuron') { target.copy(vector(-7, -.4, -1)); offset.multiplyScalar(1.33); }
      else {
        const available = hotspotConfigs.filter(item => item.available);
        target.set(0, 0, 0);
        available.forEach(item => target.add(item.position));
        target.multiplyScalar(1 / available.length);
        // Keep the upper hotspot below the editorial heading on short phones.
        target.y += .9 * THREE.MathUtils.clamp((820 - height) / 80, 0, 1);
        offset.multiplyScalar(1.22);
      }
    } else if (nextView === 'hub' && width < 1000) {
      // Leave space for the editorial heading beside all four dendritic regions.
      target.x -= 2 * (1 - THREE.MathUtils.smoothstep(width, 640, 1000));
    }
    return { target, position: target.clone().add(offset) };
  }
  function limits(pose, isDetail) {
    const distance = pose.position.distanceTo(pose.target);
    controls.minDistance = isDetail ? distance * .47 : distance * .36;
    controls.maxDistance = isDetail ? distance * 1.6 : distance * 1.75;
  }
  function travel(poses, duration, token, complete) {
    let index = 0;
    function next() {
      if (token !== navigationId || disposed) return;
      const pose = poses[index++];
      cameraController.move(pose.position, pose.target, { duration: duration / poses.length, onComplete() {
        if (token !== navigationId) return;
        if (index < poses.length) next();
        else complete(pose);
      } });
    }
    next();
  }
  async function navigate(nextView, { duration = 3.4, intro = false, mechanismId } = {}) {
    clearIntro();
    if (!['hub', 'neuron', 'synapse'].includes(nextView)) return;
    const token = ++navigationId, previousView = view;
    cameraController.cancel();
    // Time spent inspecting a still frame is not part of the next camera trip.
    lastTime = 0;
    active.timeline.pause(); exploring = false; selected = null; hovered = null;
    onSelect?.(null);
    transitioning = true; controls.enabled = false;
    const outgoing = previousView === 'synapse' && active.definition.entryCamera ? active : null;
    const exitPose = outgoing ? poseFor('synapse', outgoing.definition.entryCamera) : null;
    if (nextView === 'synapse') {
      const id = mechanismId || (previousView === 'synapse' ? active.definition.id : 'glutamate');
      if (!sessions.has(id)) emitView(true);
      try {
        const nextSession = await getSession(id);
        if (token !== navigationId || disposed) return;
        const previousSession = active;
        active = nextSession;
        if (previousSession !== active) {
          previousSession.model.root.visible = false;
          previousSession.leave();
        }
        active.model.root.visible = true;
        syncAnchors(); annotations.setAnchors(active.anchors);
      } catch (error) {
        if (token !== navigationId || disposed) return;
        console.error('No se pudo cargar el mecanismo:', error);
        transitioning = false; controls.enabled = true; emitView();
        onRegion?.({ title: 'No se pudo preparar el mecanismo. Inténtalo de nuevo.', error: true }); return;
      }
    }
    view = nextView;
    const pose = poseFor(view);
    const poses = [];
    if (nextView !== 'synapse' && exitPose) poses.push(exitPose);
    if (nextView === 'synapse' && previousView !== 'synapse' && active.definition.entryCamera) {
      const membrane = poseFor('synapse', active.definition.entryCamera);
      const overview = active.definition.cameraPoses[active.definition.overviewCamera];
      const regionDistance = Math.max(10, vector(...overview.position).distanceTo(vector(...overview.target)) * active.model.root.scale.x * 2);
      const region = { target: membrane.target.clone(), position: membrane.target.clone().add(vector(1, 2.5, regionDistance)) };
      poses.push(region, membrane);
    }
    poses.push(pose);
    lastTime = 0; emitView(); emitTimeline();
    travel(poses, poses.length > 1 ? duration * 1.55 : duration, token, finalPose => {
      transitioning = false;
      limits(finalPose, view === 'synapse');
      controls.enabled = true;
      if (view === 'synapse') {
        annotations.setVisited(active.definition.id);
        emitTimeline();
      } else reconcileVisibility();
      emitView();
      invalidate();
    });
    if (!intro) canvas.focus({ preventScroll: true });
    invalidate();
  }
  function openHotspot(id) {
    const entry = mechanisms.find(item => item.id === id);
    if (!entry) return;
    if (entry.available) navigate('synapse', { mechanismId: entry.id });
    else onRegion?.(entry);
  }
  function select(key) {
    if (view !== 'synapse' || transitioning || contextLost) return;
    if (key && !availableKeys().includes(key)) return;
    selected = key; onSelect?.(key); invalidate();
  }
  function pauseForInspection() {
    if (transitioning || contextLost || view !== 'synapse') return false;
    exploring = true;
    active.timeline.pause(); cameraController.cancel(); controls.enabled = true;
    emitTimeline(); invalidate();
    return true;
  }
  function focusSelected() {
    if (!selected || transitioning || contextLost || view !== 'synapse') return false;
    const objects = active.model.selectable.filter(object => object.userData.key === selected && object.visible);
    const bounds = new THREE.Box3();
    active.model.root.updateMatrixWorld(true);
    for (const object of objects) {
      // Particle instances move even when their underlying geometry is reused.
      if (object.isInstancedMesh) object.computeBoundingBox();
      bounds.expandByObject(object, true);
    }
    const anchor = active.anchors.find(item => item.key === selected);
    if (bounds.isEmpty() && !anchor) return false;
    const target = bounds.isEmpty() ? anchor.position.clone() : bounds.getCenter(new THREE.Vector3());
    const overview = poseFor('synapse');
    const overviewDistance = overview.position.distanceTo(overview.target);
    const radius = bounds.isEmpty() ? 0 : bounds.getSize(new THREE.Vector3()).length() / 2;
    const halfField = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(1, camera.aspect));
    // Keep cellular context around even very small proteins; repeated inspection
    // uses the same limits instead of zooming progressively through the membrane.
    const distance = THREE.MathUtils.clamp(radius / Math.sin(halfField) * 1.25, overviewDistance * .52, overviewDistance);
    const position = camera.position.clone().sub(controls.target).normalize().multiplyScalar(distance).add(target);
    pauseForInspection();
    controls.enabled = false;
    cameraController.move(position, target, { duration: 1.25, onComplete() {
      limits(overview, true); controls.enabled = true; invalidate();
    } });
    invalidate();
    return true;
  }
  function focusStep(step) {
    const pose = poseFor('synapse', step.camera);
    if (step.focus) {
      const focus = vector(...step.focus).applyMatrix4(active.model.root.matrixWorld);
      const offset = pose.position.clone().sub(pose.target).multiplyScalar(.97);
      pose.target.lerp(focus, .23); pose.position.copy(pose.target).add(offset);
    }
    cameraController.move(pose.position, pose.target, { duration: 1.6, onComplete() {
      limits(pose, true); controls.enabled = !active.timeline.getState().playing; invalidate();
    } });
  }
  const interactive = createInteractionManager(canvas, camera, {
    objects: () => view === 'synapse' ? active.model.selectable : hotspotMeshes,
    enabled: () => !transitioning && !cameraController.active,
    onSelect: key => view === 'synapse' ? select(key) : key && openHotspot(key),
    onHover: key => { if (hovered !== key) { hovered = key; invalidate(); } },
  });
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    const pose = poseFor(view);
    const wasPlaying = active.timeline.getState().playing;
    navigationId++; cameraController.cancel(); transitioning = false;
    reconcileVisibility();
    limits(pose, view === 'synapse');
    camera.position.copy(pose.position); controls.target.copy(pose.target);
    controls.enabled = !wasPlaying;
    emitView();
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
  listen(motion, 'change', () => { controls.enableDamping = !motion.matches; if (motion.matches) { clearIntro(); active.timeline.pause(); navigate(view, { duration: 0 }); } invalidate(); });
  listen(canvas, 'webglcontextlost', event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; clearIntro(); active.timeline.pause(); onContextLost?.(true); });
  listen(canvas, 'webglcontextrestored', () => { buildEnvironment(); contextLost = false; lastTime = 0; onContextLost?.(false); invalidate(); });

  function tick(now) {
    frame = 0; if (disposed || contextLost || document.hidden) return;
    const dt = lastTime ? (now - lastTime) / 1000 : 0; lastTime = now;
    const running = view === 'synapse' && active.timeline.getState().playing && !exploring && !transitioning;
    if (running) active.advance(dt);
    // A slow render must not consume an entire cinematic leg in one frame.
    // Biological time keeps its own clock and is unaffected by this limit.
    const moving = cameraController.update(Math.min(dt, .1));
    // Disabled OrbitControls still clamp the camera on update; skip them while
    // crossing scales so destination zoom limits cannot truncate the journey.
    if (cameraController.active) camera.lookAt(controls.target);
    else controls.update();
    const state = active.timeline.getState();
    if (dirty || moving || running) {
      const shortViewport = active.definition.isolatedContext ? THREE.MathUtils.clamp((900 - height) / 180, 0, 1) : 0;
      const fit = Math.max(1 + shortViewport * .18, (active.definition.portraitFit ?? .69) / camera.aspect);
      const viewDistance = camera.position.distanceTo(controls.target) / (active.model.root.scale.x * fit);
      active.render({ selected, detail: view === 'synapse', viewDistance });
      syncAnchors();
      updateCellularContext();
      scene.updateMatrixWorld(); camera.updateMatrixWorld();
      let visibleLabels = state.step.labels;
      for (const phase of state.step.labelPhases || []) {
        if (state.elapsed >= phase.after) visibleLabels = phase.labels;
      }
      annotations.update({ view, transitioning, selected, hovered, stress: active.state.stress ?? active.state.ros, calcium: active.state.ca, visibleKeys: visibleLabels, availableKeys: availableKeys() });
      renderer.render(scene, camera); onProgress?.(state.progress); dirty = false;
    }
    if ((running || cameraController.active) && !frame) frame = requestAnimationFrame(tick);
  }
  resize(); controls.update();
  await renderer.compileAsync(scene, camera);
  if (motion.matches) { view = 'hub'; const pose = poseFor(view); limits(pose, false); camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update(); }
  else introTimer = setTimeout(() => navigate('hub', { duration: 4.2, intro: true }), 1900);
  emitView(); emitTimeline(); invalidate();
  return {
    navigate, select, pauseForInspection, focusSelected,
    setLabels(value) { annotations.setEnabled(value); invalidate(); },
    resetView() { navigate(view, { duration: 1.5 }); },
    playPause() {
      if (transitioning || view !== 'synapse') return;
      if (active.timeline.getState().playing) { active.timeline.pause(); cameraController.cancel(); controls.enabled = true; }
      else {
        exploring = false; lastTime = 0;
        if (active.timeline.getState().complete) active.reset();
        active.timeline.play();
      }
      emitTimeline(); invalidate();
    },
    explore() {
      if (transitioning || view !== 'synapse') return;
      if (!exploring) { exploring = true; active.timeline.pause(); cameraController.cancel(); controls.enabled = true; }
      else {
        exploring = false; lastTime = 0;
        if (active.timeline.getState().complete) active.reset();
        active.timeline.play();
      }
      emitTimeline(); invalidate();
    },
    seek(index) {
      if (transitioning || view !== 'synapse') return;
      selected = null; hovered = null; onSelect?.(null);
      cameraController.cancel();
      active.seek(THREE.MathUtils.clamp(index, 0, active.definition.steps.length - 1));
      if (!exploring && !active.timeline.getState().playing) focusStep(active.timeline.getState().step);
      emitTimeline(); invalidate();
    },
    restart() {
      if (transitioning || view !== 'synapse') return;
      exploring = false; active.reset(); navigate('synapse', { duration: 1.2 });
    },
    suspend() {
      clearIntro(); active.timeline.pause(); navigationId++; cameraController.cancel(); transitioning = false;
      reconcileVisibility();
      limits({ position: camera.position, target: controls.target }, view === 'synapse');
      controls.enabled = true; emitView(); invalidate();
    },
    getState() {
      return {
        view, mechanism: active.definition.id, transitioning, cameraMoving: cameraController.active, exploring, selected, time: active.time, availableKeys: availableKeys(),
        timeline: { ...active.timeline.getState(), step: active.timeline.getState().step.key },
        particles: { ...active.state }, camera: camera.position.toArray(), target: controls.target.toArray(),
        controlsEnabled: controls.enabled, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
        contextParticlesVisible: false, // Molecular pools belong only to isolated specimens.
        resources: {...renderer.info.memory, sessions:sessions.size},
        model: active.model.diagnostics?.(),
      };
    },
    dispose() {
      disposed = true; clearIntro(); cancelAnimationFrame(frame); observer.disconnect(); abort.abort();
      controls.removeEventListener('change', controlsChange); controls.removeEventListener('start', controlsStart); controls.dispose();
      annotations.dispose(); interactive.dispose();
      disposeObjects(scene); environmentTarget.dispose(); renderer.dispose();
    },
  };
}

function disposeObjects(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    if (object.isInstancedMesh) object.dispose();
  });
  materials.forEach(material => { Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); }); material.dispose(); });
  geometries.forEach(geometry => geometry.dispose()); textures.forEach(texture => texture.dispose());
}
