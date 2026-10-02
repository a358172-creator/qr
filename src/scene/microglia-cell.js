import * as THREE from 'three';
import { branch, fusedNeuronGeometry, organicMaterial, point, seededRandom } from '../atlas/organic.js';

const LOCAL_SCALE = .17;
const DEFAULT_TARGET = point(-1.7, -3.1, 1.35);
const LEADING_TIP = point(-1.40, -1.83, .80);
const clamp01 = value => THREE.MathUtils.clamp(Number.isFinite(value) ? value : 0, 0, 1);

// Unequal stems, off-axis forks and anterior/posterior arbors produce a
// ramified surveillance morphology. There is no radial ring of equal arms.
const STEMS = [
  [[0,0,0],[-.35,.18,.04],[-.85,.65,.13],[-1.45,.95,.10],[-2.10,1.05,-.25],[-2.73,1.38,-.30]],
  [[0,0,0],[-.12,.34,-.04],[.02,.80,-.22],[-.30,1.33,-.31],[-.16,1.83,-.60],[.15,2.23,-.48]],
  [[0,0,0],[.32,.17,.10],[.75,.42,.35],[1.16,.85,.47],[1.75,1.04,.76],[2.55,1.24,.69]],
  [[0,0,0],[.33,-.15,.04],[.88,-.35,-.06],[1.40,-.25,-.23],[1.82,-.66,-.31],[2.67,-.80,-.20]],
  [[0,0,0],[.18,-.30,-.06],[.38,-.81,-.20],[.88,-1.28,-.37],[1.23,-1.99,-.45]],
  [[0,0,0],[-.18,-.29,.14],[-.40,-.75,.20],[-.88,-1.20,.38],[-1.18,-1.51,.63],LEADING_TIP.toArray()],
  [[0,0,0],[-.28,-.10,-.18],[-.72,-.47,-.58],[-1.25,-.70,-.80],[-1.87,-1.02,-1.0],[-2.56,-1.25,-1.21]],
  [[0,0,0],[.17,.12,.27],[.42,.48,.68],[.69,.16,1.02],[1.15,.32,1.45]],
];

function skeleton() {
  const rng = seededRandom(9703), branches = [], stems = [];
  const add = (points, radii, name) => {
    const item = branch(points, radii, name);
    const baseRadius = item.radius;
    // Small varicosities remain part of the membrane surface, rather than
    // separate beads glued to cylindrical processes.
    const phase = rng() * Math.PI * 2;
    item.radius = t => baseRadius(t) * (1 + .09 * Math.sin(t * 22 + phase) * Math.sin(Math.PI * t));
    branches.push(item);
    return item;
  };
  STEMS.forEach((points, index) => {
    const stem = add(points, index === 5 ? [.145,.117,.085,.064,.042,.026] : [.125,.10,.072,.049,.032,.016], index === 5 ? 'leading' : `stem-${index}`);
    stems.push(stem);
    if (index === 5) return;
    const forks = index % 3 === 0 ? 4 : 3;
    for (let fork = 0; fork < forks; fork++) {
      const t = .35 + fork * (.43 / (forks - 1)) + (rng() - .5) * .035;
      const origin = stem.curve.getPoint(t), tangent = stem.curve.getTangent(t).normalize();
      const side = point(-tangent.y, tangent.x, (rng() - .5) * 1.1).normalize().multiplyScalar(fork % 2 ? -1 : 1);
      const length = .42 + rng() * .48;
      const middle = origin.clone().addScaledVector(tangent, length * .26).addScaledVector(side, length * .42);
      middle.z += (rng() - .5) * .30;
      const end = origin.clone().addScaledVector(tangent, length * .43).addScaledVector(side, length * .87);
      end.z += (rng() - .5) * .56;
      end.x = THREE.MathUtils.clamp(end.x, -3.04, 3.03);
      end.y = THREE.MathUtils.clamp(end.y, -2.35, 2.53);
      end.z = THREE.MathUtils.clamp(end.z, -1.55, 1.57);
      const twig = add([origin.toArray(), middle.toArray(), end.toArray()], [.050, .035, .011], `fork-${index}-${fork}`);
      if ((fork + index) % 2 === 0) {
        const start = twig.curve.getPoint(.54);
        const end2 = start.clone().addScaledVector(tangent, -.13 + rng() * .25).addScaledVector(side, .22 + rng() * .13);
        end2.z += (rng() - .5) * .30;
        add([start.toArray(), start.clone().lerp(end2, .55).addScaledVector(tangent, .06).toArray(), end2.toArray()], [.028, .023, .009], `fine-${index}-${fork}`);
      }
    }
  });
  // A restrained terminal fan lies above the altered spine initially. During
  // extension it travels with the leading process, not with the cell soma.
  const lead = stems[5];
  add([lead.curve.getPoint(.51).toArray(),[-.91,-.91,.77],[-1.42,-1.12,1.05]], [.065,.038,.013], 'leading-fork-a');
  add([lead.curve.getPoint(.69).toArray(),[-.69,-1.40,.79],[-.63,-1.73,1.08]], [.049,.033,.012], 'leading-fork-b');
  add([lead.curve.getPoint(.85).toArray(),[-1.45,-1.42,.86],[-1.83,-1.58,1.02]], [.038,.025,.009], 'leading-fork-c');
  return { branches, leading: lead };
}

function pigment(geometry) {
  const positions = geometry.attributes.position, colors = new Float32Array(positions.count * 3);
  const shade = new THREE.Color(0x7186a8), lit = new THREE.Color(0xa7aed0), color = new THREE.Color();
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index), y = positions.getY(index), z = positions.getZ(index);
    const amount = THREE.MathUtils.clamp(.52 + Math.sin(x * 2.8 + y) * Math.cos(z * 3.2 - y * 1.5) * .18, 0, 1);
    color.copy(shade).lerp(lit, amount);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

export function createMicrogliaCell({ texture, target = DEFAULT_TARGET } = {}) {
  const root = new THREE.Group();
  root.name = 'Ramified microglial cell';
  const { branches, leading } = skeleton();
  // Reuse the atlas's signed-distance union at a different physical scale.
  // Both the small irregular soma and every proximal bifurcation are one
  // continuous membrane, not intersections between spheres and tubes.
  const canonical = branches.map(item => ({
    ...item,
    curve: new THREE.CatmullRomCurve3(item.curve.points.map(p => p.clone().divideScalar(LOCAL_SCALE)), false, 'centripetal'),
    radius: t => item.radius(t) / LOCAL_SCALE,
    length: item.length / LOCAL_SCALE,
  }));
  const completeGeometry = fusedNeuronGeometry(canonical, point(0, 0, 0), .024 / LOCAL_SCALE);
  completeGeometry.scale(LOCAL_SCALE, LOCAL_SCALE, LOCAL_SCALE);
  pigment(completeGeometry);
  const positions = completeGeometry.attributes.position;
  positions.setUsage(THREE.DynamicDrawUsage);
  completeGeometry.attributes.normal.setUsage(THREE.DynamicDrawUsage);
  const baseline = positions.array.slice(), leadWeights = new Float32Array(positions.count), basalWeights = new Float32Array(positions.count);
  const leadSamples = leading.curve.getPoints(50);
  const vertex = new THREE.Vector3();
  for (let index = 0; index < positions.count; index++) {
    vertex.fromBufferAttribute(positions, index);
    const somaDistance = Math.hypot(vertex.x, vertex.y, vertex.z);
    basalWeights[index] = THREE.MathUtils.smoothstep(somaDistance, .68, 2.85);
    // The leading arbor occupies the anterior lower-left compartment. Its
    // posterior neighbour remains independently anchored and does not follow.
    if (vertex.x > .06 || vertex.y > -.59 || vertex.z < -.02) continue;
    let nearest = 0, distance = Infinity;
    for (let sample = 0; sample < leadSamples.length - 1; sample++) {
      const start = leadSamples[sample], segment = leadSamples[sample + 1].clone().sub(start);
      const along = THREE.MathUtils.clamp(vertex.clone().sub(start).dot(segment) / segment.lengthSq(), 0, 1);
      const squared = vertex.distanceToSquared(start.clone().addScaledVector(segment, along));
      if (squared < distance) { distance = squared; nearest = (sample + along) / 50; }
    }
    leadWeights[index] = THREE.MathUtils.smoothstep(nearest, .34, 1) * THREE.MathUtils.smoothstep(vertex.z, -.02, .08);
  }

  const indices = completeGeometry.index.array, bodyIndices = [], processIndices = [];
  for (let index = 0; index < indices.length; index += 3) {
    const a = indices[index], b = indices[index + 1], c = indices[index + 2];
    const destination = Math.max(leadWeights[a], leadWeights[b], leadWeights[c]) > .008 ? processIndices : bodyIndices;
    destination.push(a, b, c);
  }
  const makePartition = (indices, key, material) => {
    const geometry = new THREE.BufferGeometry();
    for (const [name, attribute] of Object.entries(completeGeometry.attributes)) geometry.setAttribute(name, attribute);
    geometry.setIndex(indices);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = key === 'microglia' ? 'Continuous microglial soma and arbor' : 'Extending microglial process';
    mesh.userData.key = key;
    mesh.frustumCulled = false;
    root.add(mesh);
    return mesh;
  };
  const materialOptions = {
    roughness: .64, clearcoat: .025, sheen: .22, sheenColor: new THREE.Color(0xa5b7d2),
    bumpMap: texture ?? null, bumpScale: .007, emissive: 0x35445f, emissiveIntensity: .03,
  };
  const bodyMaterial = organicMaterial(materialOptions), processMaterial = organicMaterial(materialOptions);
  const body = makePartition(bodyIndices, 'microglia', bodyMaterial), process = makePartition(processIndices, 'process', processMaterial);
  const defaultTarget = target.clone ? target.clone() : point(...target);
  const contactTip = LEADING_TIP.clone(), processAnchor = LEADING_TIP.clone();
  const labelAnchors = [
    { key: 'microglia', name: 'Microglía', position: point(.24, .20, .23), side: 'right', priority: 5 },
    { key: 'process', name: 'Proceso microglial', position: processAnchor, side: 'right', priority: 4 },
  ];
  let lastState = { time: 0, approach: 0, contact: 0, pruning: 0 };
  let lastSurfaceFrame = null;
  const tipNoise = new THREE.Vector3(), delta = new THREE.Vector3();

  function update({ time = 0, approach = 0, contact = 0, pruning = 0, selected = null, target: currentTarget = defaultTarget } = {}) {
    const t = Number.isFinite(time) ? time : 0, a = clamp01(approach), c = clamp01(contact), p = clamp01(pruning);
    const destination = currentTarget.isVector3 ? currentTarget : point(...currentTarget);
    // Orbiting or selecting a paused specimen should not re-upload and rebuild
    // its 64k-triangle membrane when its biological frame is unchanged.
    const frame = [t, a, c, destination.x, destination.y, destination.z];
    const surfaceChanged = !lastSurfaceFrame || frame.some((value, index) => value !== lastSurfaceFrame[index]);
    if (surfaceChanged) {
      delta.copy(destination).sub(LEADING_TIP).multiplyScalar(a);
      tipNoise.set(Math.sin(t * .17 + .4) * .008, Math.sin(t * .12 + 1.3) * .011, Math.cos(t * .14 + .7) * .008).multiplyScalar((1 - a) ** 2);
      for (let index = 0; index < positions.count; index++) {
        const offset = index * 3, x = baseline[offset], y = baseline[offset + 1], z = baseline[offset + 2];
        const w = leadWeights[index], basal = basalWeights[index];
        if (w > 0) {
          const cup = Math.sin(Math.PI * w) * w * c;
          positions.setXYZ(index,
            x + delta.x * w + tipNoise.x * w - cup * .045,
            y + delta.y * w + tipNoise.y * w + cup * .035,
            z + delta.z * w + tipNoise.z * w + cup * .075,
          );
        } else {
          // Soma and proximal roots have zero basal weight. Distal excursions are
          // smaller than the local membrane diameter and evolve very slowly.
          const phase = x * .84 + y * .43 + z * .61;
          positions.setXYZ(index,
            x + Math.sin(t * .13 + phase) * .007 * basal,
            y + Math.sin(t * .11 + phase * .8) * .010 * basal,
            z + Math.cos(t * .15 + phase) * .008 * basal,
          );
        }
      }
      positions.needsUpdate = true;
      completeGeometry.computeVertexNormals();
      body.geometry.computeBoundingSphere();
      process.geometry.computeBoundingSphere();
      if (a === 1) contactTip.copy(destination);
      else contactTip.copy(LEADING_TIP).add(delta).add(tipNoise);
      processAnchor.copy(contactTip).lerp(point(-.58, -.85, .36), .20).add(point(.04, .09, .04));
      lastSurfaceFrame = frame;
    }
    bodyMaterial.emissiveIntensity = selected === 'microglia' ? .16 : .03;
    processMaterial.emissiveIntensity = selected === 'process' ? .19 : .03 + c * .045;
    lastState = { time: t, approach: a, contact: c, pruning: p };
  }
  update();
  return {
    root, selectable: [body, process], labelAnchors, update, contactTip,
    diagnostics: () => ({
      ...lastState,
      soma: [0, 0, 0],
      contactTip: contactTip.toArray(),
      branchCount: branches.length,
      triangles: completeGeometry.index.count / 3,
      vertexCount: positions.count,
      leadingVertices: leadWeights.reduce((sum, weight) => sum + (weight > 0 ? 1 : 0), 0),
    }),
  };
}
