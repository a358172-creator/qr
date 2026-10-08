import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { gridGeometry, organicLobe, physical, random, surfaceTexture, v3 } from './geometry.js';
import { createMitochondrialOrganelle } from './mitochondrial-organelle.js';
import { createMolecularPool, molecularGlyph } from './molecular-particles.js';

const TAU = Math.PI * 2;
const fract = value => value - Math.floor(value);
const bounded = value => THREE.MathUtils.clamp(value || 0, 0, 1);
const CHANNEL = v3(-.65, 2.2, .10);
const NOX_SITE=v3(2.39,membraneHeight(2.39,-.06),-.06);
const REACTION=v3(.52,2.98,.28);
const NUCLEAR = v3(2.65, -2.30, -.12);

function merge(parts) {
  const result = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return result;
}

function lobe(parts, seed, scale, position, rotation = 0) {
  const geometry = organicLobe(seed);
  geometry.scale(...scale);
  geometry.rotateZ(rotation);
  geometry.translate(...position);
  parts.push(geometry);
}

function membraneHeight(x, z) {
  return 2.20 + .024 * Math.sin(x * 1.6) + .026 * Math.cos(z * 3.4) + .021 * x * x;
}

// A true bilayer specimen: local oxidation displaces both heads and tails.
// The NMDAR opening is removed from each sheet and lipid lattice geometrically.
function createBilayer(texture) {
  const group = new THREE.Group();
  group.name = 'Postsynaptic lipid bilayer';
  group.userData.key = 'membrane';
  const coreMaterial = physical(0x8f7f96, { roughness: .8, side: THREE.DoubleSide, bumpMap: texture, bumpScale: .009 });
  const plane = offset => {
    const geometry = gridGeometry(92, 22, (u, v) => {
      const x = (u * 2 - 1) * 3.55, z = (v * 2 - 1) * .93;
      return v3(x, membraneHeight(x, z) + offset, z);
    });
    const position = geometry.attributes.position, indices = [];
    for (let index = 0; index < geometry.index.count; index += 3) {
      const face = [0, 1, 2].map(n => geometry.index.getX(index + n));
      if (face.some(vertex => [CHANNEL,NOX_SITE].some(site=>Math.hypot(position.getX(vertex)-site.x,position.getZ(vertex)-site.z)<.25))) continue;
      indices.push(...face);
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };
  group.add(new THREE.Mesh(plane(.055), coreMaterial), new THREE.Mesh(plane(-.055), coreMaterial));

  const seeds = [], rng = random(603);
  for (let row = 0; row < 11; row++) {
    for (let column = 0; column < 51; column++) {
      const x = -3.50 + column * .14 + (row % 2) * .052;
      const z = -.85 + row * .17;
      if ([CHANNEL,NOX_SITE].some(site=>Math.hypot(x-site.x,z-site.z)<.285)) continue;
      const susceptibility = Math.exp(-((x + 2.48) ** 2 / .36 + (z - .29) ** 2 / .30));
      for (const side of [-1, 1]) seeds.push({ x, z, side, phase: rng() * TAU, susceptibility });
    }
  }
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(.061, 7, 5), physical(0xffffff, { roughness: .63, bumpMap: texture, bumpScale: .006 }), seeds.length);
  const tailParts = [];
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([v3(side * .022, 0, 0), v3(side * .022, .055, .012), v3(side * .029, .125, -.011)]);
    tailParts.push(new THREE.TubeGeometry(curve, 4, .012, 4, false));
  }
  const tails = new THREE.InstancedMesh(merge(tailParts), physical(0xb69daf, { roughness: .78 }), seeds.length);
  heads.name = 'Lipid headgroups';
  tails.name = 'Lipid acyl tails';
  for (const mesh of [heads, tails]) {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    group.add(mesh);
  }
  const transform = new THREE.Object3D(), baseline = new THREE.Color(), color = new THREE.Color(), oxidised = new THREE.Color(0xbb738a);
  let changedLipids = 0, maximumDisplacement = 0;
  return {
    group, heads, tails,
    update(lipid, selected) {
      changedLipids = 0;
      maximumDisplacement = 0;
      for (let index = 0; index < seeds.length; index++) {
        const seed = seeds[index], amount = seed.susceptibility * lipid;
        const dx = .085 * Math.sin(seed.phase) * amount;
        const dz = .073 * Math.cos(seed.phase * 1.3) * amount;
        const dy = .088 * Math.sin(seed.phase * 2.1) * amount;
        const y = membraneHeight(seed.x, seed.z);
        transform.position.set(seed.x + dx, y + seed.side * (.118 + dy), seed.z + dz);
        transform.rotation.set(seed.side < 0 ? 0 : Math.PI, 0, .38 * Math.sin(seed.phase) * amount);
        transform.scale.set(1 + amount * .12, .86 + amount * .10, 1);
        transform.updateMatrix();
        heads.setMatrixAt(index, transform.matrix);
        baseline.set(seed.side > 0 ? 0xcab0be : 0xb59bad);
        color.copy(baseline).lerp(oxidised, amount * .90);
        heads.setColorAt(index, color);
        transform.scale.set(1, 1, 1);
        transform.position.y -= seed.side * .033;
        transform.updateMatrix();
        tails.setMatrixAt(index, transform.matrix);
        if (amount > .10) changedLipids++;
        maximumDisplacement = Math.max(maximumDisplacement, Math.hypot(dx, dy, dz));
      }
      heads.instanceMatrix.needsUpdate = true;
      tails.instanceMatrix.needsUpdate = true;
      heads.instanceColor.needsUpdate = true;
      heads.material.emissive.set(0x6b485b);
      heads.material.emissiveIntensity = selected ? .17 : .025;
      heads.computeBoundingSphere();
      tails.computeBoundingSphere();
    },
    diagnostics: () => ({ changedLipids, maximumDisplacement, totalLipids: seeds.length }),
  };
}

function createNmda(texture) {
  const group = new THREE.Group(), parts = [];
  group.userData.key = 'nmda';
  group.name = 'NMDAR with open central pore';
  for (let index = 0; index < 4; index++) {
    const angle = index * Math.PI / 2 + .30, dx = Math.cos(angle), dz = Math.sin(angle);
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      v3(dx * .12, -.30, dz * .12), v3(dx * .15, -.02, dz * .15), v3(dx * .20, .22, dz * .20),
    ]), 16, .071, 9, false));
    lobe(parts, index + 3, [.15, .22, .14], [dx * .22, .28, dz * .22], -dx * .21);
    lobe(parts, index + 12, [.165, .20, .14], [dx * .25, .57, dz * .235], dx * .35);
    lobe(parts, index + 23, [.080, .105, .083], [dx * .34, .48, dz * .30], -dx * .40);
    lobe(parts, index + 35, [.075, .13, .085], [dx * .19, -.35, dz * .17], dx * .21);
  }
  const material = physical(0x9191c3, { roughness: .56, bumpMap: texture, bumpScale: .018, emissive: 0x4f406e, emissiveIntensity: .05 });
  group.add(new THREE.Mesh(merge(parts), material));
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.116, .022, 8, 28), physical(0xc3b7d3, { roughness: .62 }));
  mouth.rotation.x = Math.PI / 2;
  mouth.position.y = .01;
  group.add(mouth);
  group.position.copy(CHANNEL);
  return { group, material };
}

function protein(key, position, scale, color, domains, seed, texture) {
  const parts = [], group = new THREE.Group();
  domains.forEach(([x, y, z, sx, sy, sz], index) => lobe(parts, seed + index * 7, [sx, sy, sz], [x, y, z], Math.sin(index + seed) * .32));
  const material = physical(color, { roughness: .64, bumpMap: texture, bumpScale: .016, emissive: color, emissiveIntensity: .015 });
  group.add(new THREE.Mesh(merge(parts), material));
  group.position.copy(position);
  group.scale.setScalar(scale);
  group.name = key;
  group.userData.key = key;
  return { group, material, scale };
}

function createNuclearContext() {
  const group = new THREE.Group();
  group.name = 'Discreet nuclear context';
  group.position.copy(NUCLEAR);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(.74, 30, 20, Math.PI * .19, Math.PI * 1.62), physical(0x71899a, {
    roughness: .82, side: THREE.DoubleSide, transparent: true, opacity: .15, depthWrite: false,
  }));
  shell.scale.set(.78, 1, .60);
  shell.rotation.set(.07, -.4, -.25);
  group.add(shell);
  const helix = new THREE.Group(), backbones = [[], []], rungs = [];
  for (let index = 0; index <= 54; index++) {
    const t = index / 54, angle = t * Math.PI * 5;
    for (let side = 0; side < 2; side++) {
      const a = angle + side * Math.PI;
      backbones[side].push(v3(Math.cos(a) * .19, (t - .5) * 1.03, Math.sin(a) * .14));
    }
    if (index % 5 === 0 && index > 0 && index < 54) {
      rungs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([backbones[0][index], v3(0, (t - .5) * 1.03, 0), backbones[1][index]]), 4, .012, 5, false));
    }
  }
  const strands = [0x9bb4be, 0xc19ba9].map(color => physical(color, { roughness: .72 }));
  backbones.forEach((points, index) => helix.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 70, .025, 7, false), strands[index])));
  helix.add(new THREE.Mesh(merge(rungs), physical(0xc3b8b9, { roughness: .78 })));
  helix.rotation.z = -.27;
  helix.userData.key = 'dna';
  group.add(helix);
  return { group, helix };
}

const STAGE_KEYS = [
  ['nmda', 'calcium', 'membrane', 'mitochondria'],
  ['nmda', 'calcium', 'nnos', 'no', 'sgc', 'pkc', 'nox2', 'superoxide', 'peroxynitrite', 'membrane', 'mitochondria'],
  ['nmda','calcium','cpla2','aa','eicosanoids','nnos','no','nox2','superoxide','peroxynitrite','membrane','mitochondria'],
  ['nmda', 'calcium', 'membrane', 'mitochondria', 'ptp', 'ros'],
  ['nmda', 'calcium', 'membrane', 'mitochondria', 'ptp', 'aif', 'ros', 'dna'],
  ['nmda','calcium','nnos','no','nox2','superoxide','peroxynitrite','membrane','mitochondria','ptp','aif','ros','dna'],
];

export function createMitochondrialEnvironment({ texture = surfaceTexture() } = {}) {
  const root = new THREE.Group(), selectable = [], labelAnchors = [], proteins = new Map(), pools = new Map();
  root.name = 'Panel D intracellular microenvironment';
  let lastStage = 0;
  const anchor = (key, name, position, side = 'left', priority = 1) => {
    const entry = { key, name, position: v3(...position), side, priority };
    labelAnchors.push(entry);
    return entry;
  };
  const addProtein = (key, position, scale, color, domains, seed) => {
    const item = protein(key, v3(...position), scale, color, domains, seed, texture);
    proteins.set(key, item);
    root.add(item.group);
    selectable.push(item.group);
    return item;
  };
  const pool = (key, capacity, color, kind = 'single', radius = .038) => {
    const item = createMolecularPool(root, { key, capacity, geometry: molecularGlyph(kind, radius), material: physical(color, { roughness: .56, emissive: color, emissiveIntensity: .055 }) });
    pools.set(key, item);
    selectable.push(item.mesh);
    return item;
  };

  const membrane = createBilayer(texture);
  root.add(membrane.group);
  selectable.push(membrane.group);
  const nmda = createNmda(texture);
  root.add(nmda.group);
  selectable.push(nmda.group);
  const mito = createMitochondrialOrganelle(texture);
  mito.group.position.set(0, -.92, 0);
  mito.group.rotation.set(-.035, -.055, -.045);
  root.add(mito.group);
  selectable.push(mito.group);

  const pairedDomains = [[-.17, .07, 0, .24, .20, .21], [.17, -.03, .02, .23, .25, .20], [-.29, -.17, .025, .14, .13, .12], [.29, .20, -.03, .13, .15, .13]];
  addProtein('nnos', [-2.02, .83, .20], 1.05, 0x86a6b0, pairedDomains, 23);
  addProtein('sgc', [-2.94, -.02, .34], .72, 0x9bb2b8, [[-.20, 0, 0, .20, .24, .18], [.18, 0, 0, .21, .24, .19], [0, -.20, 0, .18, .12, .14]], 49);
  addProtein('pkc', [1.44, 1.13, .27], 1.02, 0xc9ad97, [[-.15, .08, 0, .22, .21, .18], [.18, -.10, .04, .26, .17, .19], [.18, .20, -.025, .125, .17, .14]], 55);
  addProtein('nox2', NOX_SITE.toArray(), .96, 0x8299b2, [[-.13, .03, 0, .16, .33, .19], [.16, -.03, 0, .17, .28, .18], [0, -.34, .05, .27, .18, .21], [.23, -.35, .035, .15, .15, .15]], 67);
  addProtein('cpla2', [-2.87, 1.96, .57], .90, 0xa0b5a4, [[-.18, .06, 0, .23, .16, .20], [.15, .0, .05, .26, .20, .19], [.03, -.22, .01, .16, .14, .14]], 89);

  const sgc=proteins.get('sgc');
  const pkg=protein('sgc',v3(.13,-.86,.02),.70,0x93aaab,[[0,0,0,.19,.25,.14],[.18,-.13,.03,.17,.12,.13],[-.14,.16,0,.10,.12,.09]],167,texture);
  pkg.group.name='PKG within the NO signalling route';sgc.group.add(pkg.group);

  const porePoint = mito.innerSurface(.24,.006);
  mito.group.updateMatrix();
  porePoint.applyMatrix4(mito.group.matrix);
  const ptpDomains = Array.from({ length: 5 }, (_, index) => {
    const a = index / 5 * TAU;
    return [Math.cos(a) * .115, Math.sin(a) * .105, 0, .062, .060, .045];
  });
  const ptp = addProtein('ptp', porePoint.toArray(), 1.05, 0xd4b59d, ptpDomains, 112);
  ptp.group.rotation.set(-.4, .20, -.05);
  const aif = addProtein('aif', [1.63, -.55, .52], .58, 0xc2aea1, [[-.12, .0, 0, .24, .19, .18], [.15, .07, .025, .16, .22, .15], [.15, -.15, -.025, .16, .11, .13]], 143);
  const nuclear = createNuclearContext();
  root.add(nuclear.group);
  selectable.push(nuclear.helix);

  const calcium = pool('calcium', 24, 0xe1a088, 'single', .044);
  const no = pool('no', 13, 0x99bac5, 'single', .037);
  const superoxide = pool('superoxide', 11, 0xd9928d, 'double', .039);
  const peroxynitrite = pool('peroxynitrite', 8, 0xaa7093, 'triple', .040);
  const ros = pool('ros', 16, 0xd6a0b4, 'cluster', .039);
  const aa = pool('aa', 6, 0xc5c7a5, 'filament', .043);
  const eicosanoids = pool('eicosanoids', 5, 0xb3bda2, 'cluster', .044);
  const cgmp=pool('sgc',4,0x91b9b0,'single',.028);
  const oxidants = createMolecularPool(root, { key: 'membrane', capacity: 6, geometry: molecularGlyph('double', .029), material: physical(0xcc97ac, { roughness: .7, emissive: 0x6b354e, emissiveIntensity: .12 }) });
  selectable.push(oxidants.mesh);

  anchor('nmda', 'NMDAR', [-.60, 2.72, .39], 'left', 5);
  anchor('calcium', 'Ca²⁺', [-.48, 1.47, .47], 'left', 4);
  anchor('nnos', 'nNOS', [-2.08, 1.02, .42], 'left', 4);
  anchor('no', 'NO', [-1.52, .40, .62], 'left', 3);
  anchor('sgc', 'sGC · cGMP · PKG', [-3.0, -.04, .48], 'left', 2);
  anchor('pkc', 'PKC', [1.55, 1.03, .46], 'right', 4);
  anchor('nox2', 'NOX2', [2.50, 2.40, .35], 'right', 3);
  anchor('superoxide', 'O₂•⁻ · extracelular', [1.58,2.89,.34], 'right', 3);
  anchor('peroxynitrite', 'NO + O₂•⁻ → ONOO⁻', REACTION.toArray(), 'right', 2);
  anchor('cpla2', 'cPLA₂', [-2.92, 1.93, .77], 'left', 4);
  anchor('aa', 'Ácido araquidónico', [-3.14, 1.00, .63], 'left', 2);
  anchor('eicosanoids', 'Eicosanoides', [-3.28, .18, .59], 'left', 2);
  anchor('membrane', 'Lípidos de membrana', [-2.45, 2.44, .84], 'right', 4);
  anchor('mitochondria', 'Mitocondria', [.69, -1.60, .49], 'left', 5);
  anchor('ptp', 'PTP · conceptual', porePoint.toArray(), 'right', 4);
  const aifAnchor = anchor('aif', 'AIF', [1.64, -.49, .63], 'right', 4);
  anchor('ros', 'ERO mitocondriales', [.0, -2.03, .47], 'left', 3);
  anchor('dna', 'Contexto nuclear · ADN', [2.75, -2.35, .17], 'right', 3);

  const aifOrigin=mito.surface(.83,.035,.037).applyMatrix4(mito.group.matrix);
  const controls = [aifOrigin, v3(2.28, -.64, .73), v3(2.64, -1.35, .55), v3(2.59, -2.12, .15)];
  const aifPath = new THREE.CatmullRomCurve3(controls);
  const particleCounts = {};
  const secondary=new THREE.Color(0x88949e);
  for(const item of proteins.values())item.baseColor=item.material.color.clone();
  const emphasis=[['nmda','calcium'],['nnos','no','sgc','pkc','nox2','superoxide','peroxynitrite'],['cpla2','aa','eicosanoids','membrane'],['mitochondria','ptp','ros'],['aif','dna'],['mitochondria','ros','membrane','dna']];
  let currentAifProgress = 0;

  function update({ time = 0, state = {}, stepIndex = 0, elapsed = 0, selected = null } = {}) {
    lastStage = THREE.MathUtils.clamp(stepIndex, 0, 5);
    const keys = new Set(STAGE_KEYS[lastStage]);
    const ca = bounded(state.ca), redox = bounded(state.redox), lipid = bounded(state.lipid), stress = bounded(state.stress);
    membrane.update(lipid, selected === 'membrane');
    mito.update(stress,selected==='mitochondria');
    mito.outerMat.color.lerp(secondary,lastStage<3?.20:0);
    mito.foldMat.color.lerp(secondary,lastStage<3?.16:0);
    nmda.material.emissiveIntensity = .045 + bounded(state.activation) * .08 + (selected === 'nmda' ? .16 : 0);
    for (const [key, item] of proteins) {
      item.group.visible = keys.has(key);
      const primary=emphasis[lastStage].includes(key)||selected===key;
      item.material.color.copy(item.baseColor).lerp(secondary,primary?0:.30);
      item.material.emissiveIntensity=.012+(selected===key?.16:primary?.075:.005);
    }
    nuclear.group.visible = keys.has('dna');
    // AIF is shown leaving a neighbouring mitochondrial region. The image does
    // not assert that the protein physically transits through the PTP marker.
    currentAifProgress = lastStage > 4 ? 1 : lastStage === 4 ? THREE.MathUtils.smoothstep(elapsed, .3, 7.5) : 0;
    aifPath.getPoint(currentAifProgress, aif.group.position);
    aif.group.rotation.set(.18, currentAifProgress * .85, -.3 + currentAifProgress * .7);
    aifAnchor.position.copy(aif.group.position).add(v3(.04, .12, .1));
    ptp.group.scale.setScalar(1.02 + stress * .12);

    calcium.update(7 + ca * 17, (index, transform) => {
      const phase = fract(time * (.115 + index % 3 * .013) + index * .618034);
      if (phase < .42) {
        // All extracellular ions stay on the channel axis until below the
        // bilayer. No calcium trajectory crosses an intact membrane patch.
        transform.position.set(CHANNEL.x + Math.sin(index * 2.4) * .038, 3.31 - phase / .42 * 1.52, CHANNEL.z + Math.cos(index * 2.4) * .038);
      } else {
        const t = (phase - .42) / .58;
        const side = index % 3 - 1;
        transform.position.set(CHANNEL.x + side * t * 1.48 + Math.sin(t * Math.PI) * .13, 1.79 - t * (1.51 + index % 4 * .12), CHANNEL.z + t * (.18 + .17 * Math.sin(index * 1.8)));
      }
      transform.scale.setScalar(.72 + .18 * Math.sin(index * 2.3) ** 2);
    });

    // Paired reactants converge on the extracellular side of this plasma-
    // membrane NOX2. Products appear only after the shared encounter phase.
    // NO diffusion across the bilayer is possible; superoxide is never drawn
    // traversing intact lipid as if it were freely membrane-permeant.
    const pairs=keys.has('no')&&keys.has('superoxide')?Math.round(2+redox*3):0;
    const reactionPhase=i=>fract(time*.12+i*.193);
    no.update(keys.has('no')?pairs+(keys.has('sgc')?3:0):0,(i,object)=>{
      const toSgc=keys.has('sgc')&&i>=pairs;
      if(toSgc){const t=fract(time*.14+i*.193);object.position.set(THREE.MathUtils.lerp(-2,-2.94,t),THREE.MathUtils.lerp(.77,-.01,t),.40);object.scale.setScalar(.8);return;}
      const phase=reactionPhase(i),t=Math.min(1,phase/.55);
      object.position.copy(v3(-2,.83,.3)).lerp(REACTION,t);
      object.position.z+=Math.sin(t*Math.PI)*.12;
      object.scale.setScalar(phase<.55?.85*Math.min(1,phase*15):.00001);
    });
    superoxide.update(pairs,(i,object)=>{
      const phase=reactionPhase(i),t=Math.min(1,phase/.55);
      object.position.copy(NOX_SITE).add(v3(0,.34,.10)).lerp(REACTION,t);
      object.position.y+=Math.sin(t*Math.PI)*.12;
      object.rotation.set(t*2,i+time*.3,t*3);
      object.scale.setScalar(phase<.55?Math.min(1,phase*15):.00001);
    });
    peroxynitrite.update(keys.has('peroxynitrite')?pairs:0,(i,object)=>{
      const phase=reactionPhase(i),t=Math.max(0,(phase-.55)/.45);
      const destination=lastStage===2||i%2===0?v3(-2.40,membraneHeight(-2.4,.35)+.19,.35):v3(-.1,3.28,.42);
      object.position.copy(REACTION).lerp(destination,t);
      object.position.z+=Math.sin(t*Math.PI)*.10;
      object.rotation.set(time*.17,i+t,t*2.4);
      object.scale.setScalar(phase>=.55?Math.min(1,t*7,(1-t)*7):.00001);
    });
    cgmp.update(keys.has('sgc')?4:0,(i,object)=>{
      const t=fract(time*.16+i*.25);object.position.set(-2.94+.095*t,-.15-.38*t,.36);object.scale.setScalar(.7+Math.sin(t*Math.PI)*.2);
    });
    ros.update(keys.has('ros') ? 3 + stress * 13 : 0, (index, transform) => {
      const t = fract(time * .09 + index * .618034), a = index * 2.399963;
      const startX = Math.sin(a) * 1.6;
      transform.position.set(startX + Math.sin(a) * t * .40, -1.13 + Math.cos(a) * .46 - t * .53, .46 + t * .42 + Math.sin(a) * .1);
      transform.rotation.set(t * 1.8, a, time * .22 + index);
      transform.scale.setScalar(.56 + Math.sin(t * Math.PI) * .56);
    });
    aa.update(keys.has('aa') ? 2 + lipid * 4 : 0, (index, transform) => {
      const t = fract(time * .125 + index * .618034);
      transform.position.set(-2.91 - .25 * t + Math.sin(t * Math.PI) * .1, 1.78 - t * .91, .57 + Math.sin(index) * .06);
      transform.rotation.z = .6 + t * 1.2;
      transform.scale.set(1.35, .66, .66);
    });
    eicosanoids.update(keys.has('eicosanoids') ? 2 + lipid * 3 : 0, (index, transform) => {
      const t = fract(time * .10 + index * .618034);
      transform.position.set(-3.15 - .23 * Math.sin(t * Math.PI), .83 - t * .85, .54 + t * .10);
      transform.rotation.set(t * 3, index, time * .15);
    });
    oxidants.update(lipid > .1 ? 2 + lipid * 4 : 0, (index, transform) => {
      const phase = fract(time * .07 + index * .618034);
      transform.position.set(-2.46 + Math.sin(index * 2.399) * .48, 2.49 + Math.sin(phase * TAU) * .095, .28 + Math.cos(index * 2.399) * .30);
      transform.scale.setScalar(.65 + Math.sin(phase * Math.PI) * .35);
    });
    for (const [key, item] of pools) {
      item.mesh.material.emissiveIntensity = .055 + (selected === key ? .20 : 0);
      particleCounts[key] = item.mesh.count;
    }
    root.updateMatrixWorld(true);
  }

  update({ state: { ca: .15, activation: .12 } });
  return {
    root, selectable, labelAnchors, update,
    visibleKeys: (stepIndex = lastStage) => [...STAGE_KEYS[THREE.MathUtils.clamp(stepIndex, 0, 5)]],
    diagnostics: () => ({ organelle:mito.diagnostics(),reactionSite:REACTION.toArray(),nox2:NOX_SITE.toArray(),aifOrigin:aifOrigin.toArray(),ptp:porePoint.toArray(),particles: { ...particleCounts }, membrane: membrane.diagnostics(), aifProgress: currentAifProgress, aifPosition: aif.group.position.toArray(), channel: CHANNEL.toArray(), stage: lastStage }),
  };
}
