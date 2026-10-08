import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { gridGeometry, createSpineShaftJunction, organicLobe, physical, surfaceTexture, tissueMaterial, v3 } from './geometry.js';
import { createMolecularPool, molecularGlyph } from './molecular-particles.js';
import { createMicrogliaCell } from './microglia-cell.js';

const TAU = Math.PI * 2;
const bounded = value => THREE.MathUtils.clamp(value || 0, 0, 1);
const fract = value => value - Math.floor(value);
const HEALTHY_X = -2.2, DAMAGED_X = 1.2;
const BASE_Y = -2.23;
const ROOT_WIDTH = .37, ROOT_DEPTH = .26;
const shaftY = x => -2.22 - .0053 * x * x;
const shaftZ = x => -.03 - .0075 * x * x - .004 * x;
const shaftRadius = x => .438 - .0038 * x;
const junctions = [HEALTHY_X, DAMAGED_X].map(centerX => createSpineShaftJunction({
  centerX, halfWidth: ROOT_WIDTH, halfDepth: ROOT_DEPTH, shaftY, shaftZ, shaftRadius,
}));
const STAGE_KEYS = [
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite'],
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite', 'nmda', 'glutamate', 'calcium', 'ros'],
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite', 'nmda', 'c1q', 'c3', 'caspase3', 'ros'],
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite', 'c1q', 'c3', 'caspase3', 'ros'],
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite', 'c1q', 'c3', 'caspase3'],
  ['microglia', 'process', 'healthySpine', 'damagedSpine', 'terminal', 'dendrite'],
];

function merge(parts) {
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return geometry;
}

function colouredMembrane(geometry, low, high) {
  const position = geometry.attributes.position, colours = [], color = new THREE.Color();
  const shadow = new THREE.Color(low), pigment = new THREE.Color(high);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const tone = .5 + .14 * Math.sin(x * 3.6 + y * 2.9) * Math.cos(z * 4.5 - y * 1.8)
      + .025 * Math.sin(x * 19 + y * 15) * Math.cos(z * 17);
    color.copy(shadow).lerp(pigment, tone);
    colours.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3));
  return geometry;
}

// The neck, flared attachment and flattened mushroom head are one continuous
// membrane. There is no sphere-to-cylinder junction, even at close range.
function spineGeometry(centerX) {
  const profile = [[.46, BASE_Y], [.36, -1.94], [.23, -1.60], [.19, -1.16],
    [.25, -.78], [.46, -.52], [.72, -.27], [.81, -.02], [.73, .22], [.46, .40], [0, .47]];
  const curve = new THREE.CatmullRomCurve3(profile.map(([r, y]) => v3(r, y)), false, 'centripetal');
  const junction = junctions[centerX === HEALTHY_X ? 0 : 1];
  const geometry = gridGeometry(84, 64, (u, v) => {
    const point = curve.getPoint(u), angle = v * TAU;
    const radius = Math.max(0, point.x) * (1 + .035 * Math.sin(angle * 3 + point.y * 2.7) + .016 * Math.cos(angle * 5 - point.y * 4));
    const bend = .075 * Math.sin((point.y - BASE_Y) * 1.25);
    const p = v3(bend + Math.cos(angle) * radius, point.y + radius * .024 * Math.sin(angle * 2), Math.sin(angle) * radius * .77);
    const weight = THREE.MathUtils.smoothstep(-point.y, 1.45, -BASE_Y);
    if (weight > 0) {
      const attachment = junction.point(angle);
      attachment.x -= centerX;
      attachment.y += (point.y - BASE_Y) * .75;
      p.lerp(attachment, weight);
    }
    return p;
  });
  return colouredMembrane(geometry, 0x98798f, 0xc5a0b5);
}

function dendriteGeometry() {
  // Two true openings share the necks' basal curves. Segment boundaries land
  // on each oval end, avoiding a closed shaft roof inside either spine.
  const boundaries = [-6, HEALTHY_X - ROOT_WIDTH, HEALTHY_X + ROOT_WIDTH,
    DAMAGED_X - ROOT_WIDTH, DAMAGED_X + ROOT_WIDTH, 5.9];
  const geometry = merge(boundaries.slice(0, -1).map((start, index) => {
    const end = boundaries[index + 1], opening = index === 1 || index === 3;
    return gridGeometry(opening ? 32 : 24, 40, (u, v) => {
      const x = THREE.MathUtils.lerp(start, end, u);
      const half = Math.max(...junctions.map(junction => junction.roofHalf(x)));
      const angle = half + v * (TAU - 2 * half), radius = shaftRadius(x);
      return v3(x, shaftY(x) + Math.cos(angle) * radius, shaftZ(x) + Math.sin(angle) * radius);
    });
  }));
  const indices = geometry.index.array;
  for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  geometry.computeVertexNormals();
  return colouredMembrane(geometry, 0x8c7597, 0xb893aa);
}

function addLobe(parts, seed, scale, position, angle = 0) {
  const geometry = organicLobe(seed);
  geometry.scale(...scale);
  geometry.rotateZ(angle);
  geometry.translate(...position);
  parts.push(geometry);
}

function createNmda(texture) {
  const group = new THREE.Group(), parts = [];
  // Four separated subunits preserve an actual central ion channel.
  for (let index = 0; index < 4; index++) {
    const angle = index * Math.PI / 2 + .35, dx = Math.cos(angle), dz = Math.sin(angle);
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      v3(dx * .048, -.13, dz * .048), v3(dx * .062, .015, dz * .062), v3(dx * .10, .12, dz * .10),
    ]), 12, .031, 7, false));
    addLobe(parts, index + 2, [.058, .082, .055], [dx * .09, .12, dz * .09], -dx * .24);
    addLobe(parts, index + 7, [.060, .089, .054], [dx * .102, .23, dz * .102], dx * .32);
  }
  const material = physical(0x9895c4, { roughness: .57, bumpMap: texture, bumpScale: .007, emissive: 0x51496a, emissiveIntensity: .04 });
  group.add(new THREE.Mesh(merge(parts), material));
  group.userData.key = 'nmda';
  group.name = 'NMDAR contextual channel';
  group.position.set(.08, .446, .18);
  return { group, material };
}

function createTerminal(texture, x, healthy) {
  const root = new THREE.Group();
  root.name = healthy ? 'Conserved presynaptic terminal' : 'Target presynaptic terminal';
  root.userData.key = 'terminal';
  root.position.set(x, 0, -.045);
  const profile = [[0, .90], [.47, .915], [.80, 1.03], [.91, 1.33], [.78, 1.71], [.44, 2.06], [.24, 2.38], [.19, 2.96]];
  const curve = new THREE.CatmullRomCurve3(profile.map(([r, y]) => v3(r, y)), false, 'centripetal');
  const surface = (u, v) => {
    const point = curve.getPoint(u), a = TAU * v;
    const radius = point.x * (1 + .034 * Math.sin(a * 3 + point.y * 2.3));
    return v3(Math.cos(a) * radius - .09 * Math.sin(point.y * 2), point.y, Math.sin(a) * radius * .70 - (point.y - .9) * .07);
  };
  const material = tissueMaterial(texture, {
    vertexColors: true, roughness: .70, opacity: .70, side: THREE.FrontSide, relief: .002, bumpScale: .004,
    emissive: 0x3f314f, emissiveIntensity: .015,
  });
  const geometry = colouredMembrane(gridGeometry(62, 48, surface), 0x80718f, 0xb4a0c1);
  root.add(new THREE.Mesh(geometry, material));
  const vesicles = new THREE.InstancedMesh(organicLobe(24), physical(0xb8aac8, { roughness: .61 }), 11);
  const transform = new THREE.Object3D();
  for (let index = 0; index < 11; index++) {
    const angle = index * 2.399963, radius = .30 + .10 * Math.sin(index * 1.4);
    transform.position.set(Math.cos(angle) * radius - .02, 1.15 + (index % 4) * .145, Math.sin(angle) * radius * .59);
    transform.scale.setScalar(.083 + (index % 3) * .014);
    transform.updateMatrix(); vesicles.setMatrixAt(index, transform.matrix);
  }
  root.add(vesicles);
  const zone = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 12), physical(0xaea0b4, { roughness: .71, transparent: true, opacity: .44, depthWrite: false }));
  zone.position.set(-.02, .916, 0); zone.scale.set(.58, .022, .36); root.add(zone);
  return { root, material, vesicles, zone };
}

function createComplement(key, texture) {
  const parts = [];
  if (key === 'c1q') {
    // A sparse branched bouquet and a compact folded complex give these two
    // conceptual markers distinct silhouettes, without claiming atomistic detail.
    for (let index = 0; index < 3; index++) {
      const a = index / 3 * TAU;
      const tip = v3(Math.cos(a) * .11, .11, Math.sin(a) * .10);
      parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3(0, -.13, 0), v3(Math.cos(a) * .04, -.015, Math.sin(a) * .035), tip]), 10, .019, 6, false));
      addLobe(parts, 40 + index, [.076, .06, .069], tip.toArray());
    }
  } else {
    addLobe(parts, 68, [.117, .135, .087], [-.038, 0, 0], -.38);
    addLobe(parts, 76, [.097, .084, .075], [.105, .036, .016], .44);
    addLobe(parts, 84, [.063, .069, .06], [.026, -.122, .005], -.17);
  }
  const material = physical(key === 'c1q' ? 0xb7c3cf : 0xaba997, { roughness: .63, bumpMap: texture, bumpScale: .007, emissive: key === 'c1q' ? 0x557587 : 0x625e42, emissiveIntensity: .02 });
  const mesh = new THREE.InstancedMesh(merge(parts), material, key === 'c1q' ? 3 : 2);
  mesh.userData.key = key;
  mesh.name = `${key.toUpperCase()} conceptual recognition complexes`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  return { mesh, material };
}

export function createMicrogliaEnvironment({ texture = surfaceTexture() } = {}) {
  const root = new THREE.Group(), selectable = [], labelAnchors = [];
  root.name = 'Panel C synaptic microenvironment';
  const anchor = (key, name, position, side = 'left', priority = 1) => {
    const item = { key, name, position: v3(...position), side, priority };
    labelAnchors.push(item); return item;
  };
  const dendrite = new THREE.Mesh(dendriteGeometry(), tissueMaterial(texture, { opacity: 1, transparent: false, depthWrite: true, side: THREE.FrontSide, relief: .002, bumpScale: .004 }));
  dendrite.userData.key = 'dendrite'; dendrite.name = 'Continuous dendritic shaft'; root.add(dendrite); selectable.push(dendrite);
  const healthyMaterial = tissueMaterial(texture, { opacity: .97, side: THREE.FrontSide, relief: .0018, bumpScale: .004 });
  const damagedMaterial = tissueMaterial(texture, { opacity: .92, side: THREE.FrontSide, relief: .0018, bumpScale: .004, emissive: 0x68465e, emissiveIntensity: .025 });
  const healthy = new THREE.Mesh(spineGeometry(HEALTHY_X), healthyMaterial);
  const damaged = new THREE.Mesh(spineGeometry(DAMAGED_X), damagedMaterial);
  healthy.name = 'Conserved mushroom spine'; damaged.name = 'Gradually remodelled mushroom spine';
  healthy.position.x = HEALTHY_X; damaged.position.x = DAMAGED_X;
  healthy.userData.key = 'healthySpine'; damaged.userData.key = 'damagedSpine';
  root.add(healthy, damaged); selectable.push(healthy, damaged);
  const baseline = damaged.geometry.attributes.position.array.slice();
  const healthyTerminal = createTerminal(texture, HEALTHY_X, true), damagedTerminal = createTerminal(texture, DAMAGED_X, false);
  root.add(healthyTerminal.root, damagedTerminal.root); selectable.push(healthyTerminal.root, damagedTerminal.root);
  const nmda = createNmda(texture), nmdaHealthy = createNmda(texture);
  nmdaHealthy.group.position.x += HEALTHY_X; nmda.group.position.x += DAMAGED_X;
  nmdaHealthy.group.userData.key = 'healthySpine';
  root.add(nmda.group, nmdaHealthy.group); selectable.push(nmda.group);

  const cell = createMicrogliaCell({ texture });
  cell.root.position.set(3.45, 2.85, -.85);
  root.add(cell.root); selectable.push(...cell.selectable);
  const cellAnchors = (cell.labelAnchors || []).map(item => {
    const entry = { ...item, position: item.position.clone().add(cell.root.position) };
    labelAnchors.push(entry); return { entry, source: item };
  });
  if (!cellAnchors.some(item => item.entry.key === 'microglia')) anchor('microglia', 'Microglía', [3.5, 3.7, -.70], 'right', 5);
  const c1q = createComplement('c1q', texture), c3 = createComplement('c3', texture);
  root.add(c1q.mesh, c3.mesh); selectable.push(c1q.mesh, c3.mesh);
  // Tie contact and extracellular markers to vertices of the actual membrane.
  // The offset is in the current outward normal, so it survives retraction and
  // stays anatomically correct from every camera angle.
  const nearestSite = seed => {
    const point = v3(), wanted = v3(...seed);
    let site = 0, distance = Infinity;
    for (let index = 0; index < baseline.length / 3; index++) {
      point.fromArray(baseline, index * 3);
      const candidate = point.distanceToSquared(wanted);
      if (candidate < distance) { distance = candidate; site = index; }
    }
    return site;
  };
  const contactSite = nearestSite([.60, .20, .35]);
  const complementSites = {
    c1q: [[-.31, .32, .57], [.32, .18, .58], [.53, -.25, .38]].map(nearestSite),
    c3: [[.67, -.12, .23], [-.03, -.50, .55]].map(nearestSite),
  };
  const membraneNormal = v3();
  const atSite = (site, clearance = 0, result = v3()) => {
    membraneNormal.fromBufferAttribute(damaged.geometry.attributes.normal, site).normalize();
    return result.fromBufferAttribute(damaged.geometry.attributes.position, site)
      .addScaledVector(membraneNormal, clearance).add(v3(DAMAGED_X, 0, 0));
  };
  const markerRadii = {};
  for (const [key, item] of [['c1q', c1q], ['c3', c3]]) {
    const positions = item.mesh.geometry.attributes.position;
    let radius = 0;
    for (let index = 0; index < positions.count; index++) radius = Math.max(radius, v3().fromBufferAttribute(positions, index).length());
    markerRadii[key] = radius;
  }
  const caspaseParts = [];
  for (const [index, x] of [-.10, .09].entries()) {
    addLobe(caspaseParts, 113 + index, [.12, .081, .09], [x, 0, 0], x * 1.7);
    addLobe(caspaseParts, 133 + index, [.063, .052, .056], [x * 1.2, -.066, .033]);
  }
  const caspase = new THREE.Mesh(merge(caspaseParts), physical(0xb68da5, { roughness: .60, bumpMap: texture, bumpScale: .008, emissive: 0x64314f, emissiveIntensity: .10 }));
  caspase.userData.key = 'caspase3'; caspase.name = 'Intracellular conceptual caspase-3 signal'; root.add(caspase); selectable.push(caspase);

  const pools = new Map();
  const pool = (key, capacity, color, shape, radius) => {
    const item = createMolecularPool(root, { key, capacity, geometry: molecularGlyph(shape, radius), material: physical(color, { roughness: .59, emissive: color, emissiveIntensity: .045 }) });
    pools.set(key, item); selectable.push(item.mesh); return item;
  };
  const glutamate = pool('glutamate', 9, 0xc6ae8e, 'single', .025);
  const calcium = pool('calcium', 13, 0xe1a088, 'single', .030);
  const ros = pool('ros', 9, 0xd6a0b4, 'cluster', .033);
  anchor('healthySpine', 'Espina conservada', [HEALTHY_X - .54, -.12, .46], 'left', 5);
  const damagedAnchor = anchor('damagedSpine', 'Espina en estudio', [DAMAGED_X - .40, -.08, .49], 'left', 5);
  anchor('dendrite', 'Dendrita', [-.73, -2.21, .36], 'left', 1);
  anchor('terminal', 'Terminal presináptica', [.80, 1.65, .30], 'left', 2);
  const nmdaAnchor = anchor('nmda', 'NMDAR', [1.28, .68, .26], 'left', 4);
  anchor('glutamate', 'Glutamato', [1.19, .81, .30], 'left', 2);
  anchor('calcium', 'Ca²⁺', [1.34, .07, .38], 'left', 4);
  const rosAnchor = anchor('ros', 'ROS', [1.65, -.42, .55], 'right', 3);
  const c1qAnchor = anchor('c1q', 'C1q', [1.50, .12, .76], 'left', 6);
  const c3Anchor = anchor('c3', 'C3', [1.88, -.28, .34], 'right', 6);
  const caspaseAnchor = anchor('caspase3', 'Caspasa-3 · señal', [1.13, -.27, .33], 'left', 3);

  let lastStage = 0, headScale = 1, pruningAmount = 0;
  let lastDamage = NaN, lastPruning = NaN;
  const transform = new THREE.Object3D(), contactTarget = v3();
  const channel = v3();
  function deform(point, damage, pruning) {
    const height = point.y, head = THREE.MathUtils.smoothstep(height, -1.25, -.47);
    const radius = 1 - head * (damage * .20 + pruning * .45);
    point.x *= radius; point.z *= radius;
    // The attachment stays on the shaft; the mushroom head retracts through a
    // smooth neck deformation instead of vanishing or scaling the whole scene.
    point.y -= (height - BASE_Y) * pruning * .42 * THREE.MathUtils.smoothstep(height, -1.55, -.70);
    point.y -= damage * head * .065;
    return point;
  }
  const atSurface = (point, damage, pruning) => deform(point, damage, pruning).add(v3(DAMAGED_X, 0, 0));

  function update({ time = 0, state = {}, stepIndex = 0, selected = null } = {}) {
    lastStage = THREE.MathUtils.clamp(stepIndex, 0, 5);
    const stageKeys = new Set(STAGE_KEYS[lastStage]);
    // Stage gating makes direct seeks and restarts safe even with a partially
    // interpolated incoming state. Stage one is an entirely unaltered control.
    const damage = lastStage > 0 ? bounded(state.damage) : 0;
    const signals = lastStage >= 2 ? bounded(state.signals) : 0;
    const ca = lastStage === 1 ? bounded(state.ca) : 0;
    const oxidative = lastStage > 0 && lastStage < 4 ? bounded(state.ros) : 0;
    const approach = lastStage >= 3 ? bounded(state.approach) : 0;
    // Entering the contact stage does not instantly bring a still-advancing
    // process onto the spine. Local remodelling follows effective contact;
    // direct stage seeks (approach=contact=1) retain their complete target state.
    const contact = lastStage >= 4
      ? bounded(state.contact) * THREE.MathUtils.smoothstep(approach, .96, 1)
      : 0;
    const pruning = lastStage >= 4 ? bounded(state.pruning) * contact : 0;
    pruningAmount = pruning; headScale = 1 - damage * .20 - pruning * .45;
    if (damage !== lastDamage || pruning !== lastPruning) {
      const position = damaged.geometry.attributes.position, point = v3();
      for (let index = 0; index < position.count; index++) {
        point.fromArray(baseline, index * 3);
        deform(point, damage, pruning);
        position.setXYZ(index, point.x, point.y, point.z);
      }
      position.needsUpdate = true;
      damaged.geometry.computeVertexNormals(); damaged.geometry.computeBoundingSphere();
      lastDamage = damage; lastPruning = pruning;
    }
    // The conserved spine, terminal, receptor and their material state are never
    // modified. Morphology, markers and contact all identify the affected site.
    damagedMaterial.color.set(0xffffff).lerp(new THREE.Color(0xc3b4c2), damage * .28);
    damagedMaterial.opacity = .92 - signals * .22;
    damagedMaterial.emissiveIntensity = .025 + (selected === 'damagedSpine' ? .13 : 0);
    nmda.group.position.copy(atSurface(v3(.08, .446, .18), damage, pruning));
    nmda.group.scale.setScalar(Math.max(.16, headScale));
    nmda.material.emissiveIntensity = .04 + ca * .08 + (selected === 'nmda' ? .15 : 0);
    nmda.group.visible = pruning < .78;
    nmdaAnchor.position.copy(nmda.group.position).add(v3(0, .23 * headScale, .05));
    channel.copy(nmda.group.position);
    damagedTerminal.root.position.y = pruning * .52;
    damagedTerminal.root.position.z = -.045 - pruning * .26;
    damagedTerminal.root.scale.setScalar(1 - pruning * .09);
    damagedTerminal.material.opacity = .70 - pruning * .47;
    damagedTerminal.vesicles.visible = pruning < .55;
    damagedTerminal.zone.material.opacity = .44 * (1 - pruning * .85);

    atSite(contactSite, 0, contactTarget);
    const cellLocalTarget = contactTarget.clone().sub(cell.root.position);
    cell.update({ time, approach, contact, pruning, selected, target: cellLocalTarget });
    for (const item of cellAnchors) item.entry.position.copy(item.source.position).add(cell.root.position);

    for (const [item, key] of [[c1q, 'c1q'], [c3, 'c3']]) {
      item.mesh.visible = stageKeys.has(key) && signals > .025;
      const sites = complementSites[key];
      for (let index = 0; index < sites.length; index++) {
        const scale = (.72 + signals * .28) * Math.max(.42, 1 - pruning * .66);
        atSite(sites[index], markerRadii[key] * scale + .022, transform.position);
        transform.rotation.set(.4 + index * .7, index * 1.2, -.4 + index * .7);
        transform.scale.setScalar(scale);
        if ((key === 'c1q' && index === 1) || (key === 'c3' && index === 0)) {
          (key === 'c1q' ? c1qAnchor : c3Anchor).position.copy(transform.position);
        }
        transform.updateMatrix(); item.mesh.setMatrixAt(index, transform.matrix);
      }
      item.mesh.instanceMatrix.needsUpdate = true; item.mesh.computeBoundingSphere();
      item.material.emissiveIntensity = .02 + (selected === key ? .19 : 0);
    }
    caspase.visible = stageKeys.has('caspase3') && signals > .025;
    caspase.position.copy(atSurface(v3(-.07, -.23, .23), damage, pruning));
    caspase.scale.setScalar(Math.max(.25, headScale));
    caspase.material.emissiveIntensity = .10 + (selected === 'caspase3' ? .16 : 0);
    caspaseAnchor.position.copy(caspase.position);
    damagedAnchor.position.copy(atSurface(v3(-.4, -.08, .49), damage, pruning));
    rosAnchor.position.copy(atSurface(v3(.45, -.42, .55), damage, pruning));

    glutamate.update(stageKeys.has('glutamate') && ca > .03 ? 3 + ca * 6 : 0, (index, object) => {
      const phase = fract(time * .17 + index * .618034);
      object.position.set(DAMAGED_X + .08 + Math.sin(index * 2.399) * .20 * (1 - phase), .915 - phase * .24, .18 + Math.cos(index * 2.399) * .18 * (1 - phase));
      object.scale.setScalar(.75 + Math.sin(index) ** 2 * .22);
    });
    calcium.update(ca > .03 ? 4 + ca * 9 : 0, (index, object) => {
      const phase = fract(time * .12 + index * .618034);
      if (phase < .48) {
        // The entire transmembrane section stays inside the receptor's central
        // pore. Cytoplasmic spreading begins strictly below that section.
        object.position.set(channel.x + Math.sin(index * 2.4) * .016, channel.y + .31 - phase / .48 * .48, channel.z + Math.cos(index * 2.4) * .016);
      } else {
        const t = (phase - .48) / .52;
        object.position.set(channel.x + Math.sin(index * 2.4) * t * .28, channel.y - .17 - t * .60, channel.z + Math.cos(index * 2.4) * t * .15);
      }
      object.scale.setScalar(.73 + index % 3 * .11);
    });
    ros.update(oxidative > .025 ? 2 + oxidative * 7 : 0, (index, object) => {
      const phase = fract(time * .075 + index * .618034), a = index * 2.399963;
      object.position.copy(atSurface(v3(Math.sin(a) * (.40 + phase * .31), -.17 + Math.cos(a) * .27 - phase * .18, .29 + Math.cos(a) * .19 + phase * .21), damage, pruning));
      object.rotation.set(phase * 1.5, a, time * .17);
      object.scale.setScalar(.56 + Math.sin(phase * Math.PI) * .41);
    });
    for (const [key, item] of pools) item.mesh.material.emissiveIntensity = .045 + (selected === key ? .18 : 0);
    root.updateMatrixWorld(true);
  }
  update();
  return {
    root, selectable, labelAnchors, update,
    visibleKeys: (stageIndex = lastStage) => [...STAGE_KEYS[THREE.MathUtils.clamp(stageIndex, 0, 5)]],
    diagnostics: () => ({
      stage: lastStage, headScale, pruning: pruningAmount,
      contactTarget: contactTarget.toArray(), channel: channel.toArray(),
      cellPosition: cell.root.position.toArray(), contactVertex: contactSite,
      healthyPosition: healthy.position.toArray(), healthyScale: healthy.scale.toArray(),
      cell: cell.diagnostics(),
      particles: Object.fromEntries([...pools].map(([key, item]) => [key, item.mesh.count])),
      markers: { c1q: c1q.mesh.visible, c3: c3.mesh.visible, caspase3: caspase.visible },
    }),
  };
}
