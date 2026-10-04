import * as THREE from 'three';
import { organicMaterial, point, seededRandom } from '../atlas/organic.js';

const RADIAL_SEGMENTS = 8;
const clamp01 = value => THREE.MathUtils.clamp(Number.isFinite(value) ? value : 0, 0, 1);
const smooth = THREE.MathUtils.smoothstep;

// The paths represent a mesoscopic cytoskeleton, not atomic F-actin or a
// prescribed biochemical pathway. Three slender bundles continue into the
// neck; the remaining curved paths intersect the head at unequal depths.
const PRIMARY_PATHS = [
  [[-.10,-3.23,-.04],[-.14,-2.66,-.07],[-.06,-2.04,-.09],[-.32,-1.67,-.17],[-.80,-1.34,-.30],[-1.23,-1.19,-.27]],
  [[.05,-3.14,.07],[.09,-2.64,.08],[.04,-2.12,.07],[.30,-1.74,.13],[.68,-1.40,.05],[1.17,-1.08,-.18]],
  [[.13,-3.07,-.09],[.08,-2.61,-.12],[.16,-2.11,-.14],[.05,-1.62,-.28],[-.20,-1.27,-.42],[.01,-.97,-.47]],
  [[-1.18,-1.19,-.19],[-.70,-1.05,-.43],[-.15,-1.13,-.59],[.45,-1.25,-.47],[1.12,-1.17,-.31]],
  [[-.99,-1.45,.14],[-.55,-1.38,.29],[.02,-1.22,.13],[.59,-1.14,-.10],[1.18,-1.26,-.15]],
  [[-.95,-1.14,-.47],[-.61,-1.42,-.28],[-.05,-1.55,-.07],[.55,-1.45,-.15],[.98,-1.16,-.37]],
  [[-.96,-1.41,-.29],[-.57,-1.58,-.33],[.02,-1.51,-.46],[.56,-1.33,-.49],[.78,-.97,-.36]],
  [[-.58,-.93,-.38],[-.79,-1.22,-.15],[-.64,-1.48,.13],[-.25,-1.56,.38],[.27,-1.41,.37]],
  [[-.16,-1.03,-.55],[.05,-1.14,-.21],[.33,-1.39,.12],[.40,-1.57,.31],[.66,-1.50,.35]],
  [[.63,-.94,-.32],[.94,-1.21,-.21],[.84,-1.45,.08],[.41,-1.53,.26],[-.02,-1.52,.37]],
  [[-1.05,-1.27,.04],[-.48,-1.13,-.07],[.02,-1.31,-.15],[.27,-1.54,-.05],[.03,-1.71,.03]],
  [[-.30,-1.59,.35],[-.47,-1.37,.08],[-.36,-1.06,-.17],[.05,-.92,-.34],[.48,-1.02,-.45]],
];

function containHead(p) {
  p.y = THREE.MathUtils.clamp(p.y, -1.71, -.88);
  // The narrower lower head and the protein complexes retain clear space.
  const width = THREE.MathUtils.lerp(.84, 1.31, smooth(p.y, -1.72, -1.18));
  const ellipse = Math.hypot(p.x / width, (p.z + .10) / .64);
  if (ellipse > 1) { p.x /= ellipse; p.z = (p.z + .10) / ellipse - .10; }
  if (p.x > .27 && p.y > -1.47) p.z = Math.min(p.z, .12);
  if (p.x < -.29 && p.y > -1.18) p.z = Math.min(p.z, .04);
  return p;
}

function makeSkeleton() {
  const rng = seededRandom(10731), paths = [];
  function add(points, parent = null, parentT = 0, growing = false) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const length = curve.getLength();
    const item = {
      id: paths.length, curve, parent, parentT, growing, length,
      radius: parent === null ? .015 + rng() * .003 : .0105 + rng() * .0028,
      phase: rng() * Math.PI * 2,
      growthStart: .08 + rng() * .20,
      rows: Math.max(12, Math.min(68, Math.ceil(length / .042))),
    };
    paths.push(item);
    return item;
  }
  PRIMARY_PATHS.forEach(points => add(points.map(p => {
    const position = point(...p), weight = 1 - smooth(position.y, -2.2, -1.8);
    // Follow the bend of the shared postsynaptic membrane. A straight bundle
    // around x=0 would leave its narrow, laterally displaced neck.
    position.x += (.10 + .16 * Math.sin(position.y * 1.45)) * weight;
    position.z += .045 * Math.sin(position.y * 1.8) * weight;
    return position;
  })));
  for (let primary = 0; primary < PRIMARY_PATHS.length; primary++) {
    const parent = paths[primary], count = primary < 3 ? 2 : 3;
    for (let branch = 0; branch < count; branch++) {
      const parentT = primary < 3 ? .77 + branch * .12 : .19 + branch * .26 + rng() * .07;
      const origin = parent.curve.getPoint(parentT);
      const tangent = parent.curve.getTangent(parentT).normalize();
      const side = point(-tangent.y + (rng() - .5) * .6, tangent.x * .6, (rng() - .5) * 1.8).normalize();
      if ((primary + branch) % 2) side.multiplyScalar(-1);
      const length = .23 + rng() * .30;
      const end = containHead(origin.clone().addScaledVector(tangent, length * .27).addScaledVector(side, length));
      const middle = containHead(origin.clone().lerp(end, .53).addScaledVector(tangent, length * .15));
      const child = add([origin, middle, end], primary, parentT, (primary + branch) % 3 !== 0);
      // A few second-order branches make growth local to the head. They remain
      // rooted in their parent even when that parent itself elongates.
      if (primary >= 3 && branch === 1 && primary % 2) {
        const at = .58, start = child.curve.getPoint(at);
        const tip = containHead(start.clone().addScaledVector(tangent, -.12).addScaledVector(side, .17).add(point(.02,-.035,-.08)));
        add([start, containHead(start.clone().lerp(tip, .52).add(point(.02,.035,0))), tip], child.id, at, true);
      }
    }
  }
  return paths;
}

export function createActinNetwork({ texture } = {}) {
  const root = new THREE.Group();
  root.name = 'Three-dimensional postsynaptic actin network';
  const paths = makeSkeleton(), indices = [], colors = [], uvs = [];
  const dark = new THREE.Color(0x79435f), light = new THREE.Color(0xc37b9e), color = new THREE.Color();
  let vertexCount = 0;
  for (const path of paths) {
    path.offset = vertexCount;
    for (let row = 0; row <= path.rows; row++) {
      const u = row / path.rows;
      // A restrained pigment gradient separates overlapping anterior and
      // posterior filaments in the frontal teaching view, including on mobile.
      // It stays attached to each filament when the specimen is orbited.
      const anterior = smooth(path.curve.getPoint(u).z, -.67, .44);
      color.copy(dark).lerp(light, .14 + anterior * .68 + Math.sin(path.phase + u * 4) * .035);
      for (let column = 0; column <= RADIAL_SEGMENTS; column++) {
        const v = column / RADIAL_SEGMENTS;
        colors.push(color.r, color.g, color.b);
        uvs.push(u * path.length * 3, v);
        vertexCount++;
        if (row === path.rows || column === RADIAL_SEGMENTS) continue;
        const a = path.offset + row * (RADIAL_SEGMENTS + 1) + column, b = a + RADIAL_SEGMENTS + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    // Each filament has its own closed ends. Branch origins overlap their
    // parent's surface; they are not unattached little strokes in space.
    path.startCap = vertexCount++;
    path.endCap = vertexCount++;
    for (let end = 0; end < 2; end++) {
      colors.push(color.r, color.g, color.b); uvs.push(end, .5);
      const row = path.offset + (end ? path.rows : 0) * (RADIAL_SEGMENTS + 1), cap = end ? path.endCap : path.startCap;
      for (let column = 0; column < RADIAL_SEGMENTS; column++) {
        if (end) indices.push(cap, row + column, row + column + 1);
        else indices.push(cap, row + column + 1, row + column);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  const positions = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positions);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  const material = organicMaterial({
    roughness: .64, clearcoat: .025, sheen: .17, sheenColor: new THREE.Color(0xb58ba8),
    bumpMap: texture ?? null, bumpScale: .003, emissive: 0x793754, emissiveIntensity: .018,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'Curved and branched F-actin filaments';
  mesh.userData.key = 'actin';
  root.add(mesh);
  const labelPosition = point(-.55, -1.39, .41);
  const labelAnchors = [{ key: 'actin', name: 'Actina', position: labelPosition, side: 'left', priority: 5 }];
  const head = p => smooth(p.y, -2.1, -1.2);
  const rotationAxis = point(.2,.85,.35).normalize();
  const frame = { time: 0, remodeling: 0 };
  let lastFrame = null, headLength = 0, totalLength = 0, branchFrames = [];

  function deform(p) {
    const weight = head(p), r = frame.remodeling;
    const angle = r * .041 * weight * Math.sin(p.y * 1.7 + p.z * 1.2);
    const cosine = Math.cos(angle), sine = Math.sin(angle), x = p.x, z = p.z;
    const radius = 1 + .10 * r * weight;
    p.x = (x * cosine - z * sine) * radius;
    p.z = (x * sine + z * cosine) * radius;
    p.y += .04 * r * weight;
    // Tiny reversible excursions never integrate simulation time. The neck is
    // entirely fixed and all movement stops at the same biological frame.
    const phase = x * 2.1 + z * 1.4;
    p.y += (Math.sin(frame.time * .16 + phase) - Math.sin(phase)) * .0014 * weight;
    return p;
  }

  function sample(path, t, out = new THREE.Vector3()) {
    const growth = path.growing ? .18 + .82 * smooth(frame.remodeling, path.growthStart, .98) : 1;
    path.curve.getPoint(t * growth, out);
    if (path.parent === null) return deform(out);
    const origin = path.curve.points[0];
    // Branch orientation and elongation are local changes around a real
    // bifurcation, in addition to the small expansion of the whole head.
    out.sub(origin).applyAxisAngle(rotationAxis, frame.remodeling * .095 * Math.sin(path.phase)).add(origin);
    deform(out);
    const staticOrigin = deform(origin.clone());
    const attachedOrigin = sample(paths[path.parent], path.parentT);
    return out.sub(staticOrigin).add(attachedOrigin);
  }

  const center = new THREE.Vector3(), previous = new THREE.Vector3(), next = new THREE.Vector3();
  const tangent = new THREE.Vector3(), normal = new THREE.Vector3(), binormal = new THREE.Vector3(), radial = new THREE.Vector3();
  const reference = new THREE.Vector3();

  function update({ time = 0, remodeling = 0, selected = null } = {}) {
    const t = Number.isFinite(time) ? time : 0, r = clamp01(remodeling);
    if (!lastFrame || lastFrame[0] !== t || lastFrame[1] !== r) {
      frame.time = t; frame.remodeling = r;
      headLength = 0; totalLength = 0; branchFrames = [];
      for (const path of paths) {
        let pathLength = 0;
        const growth = path.growing ? .18 + .82 * smooth(r, path.growthStart, .98) : 1;
        for (let row = 0; row <= path.rows; row++) {
          const u = row / path.rows;
          sample(path, u, center);
          sample(path, Math.max(0, u - .001), previous);
          sample(path, Math.min(1, u + .001), next);
          tangent.copy(next).sub(previous).normalize();
          if (row === 0) {
            reference.set(Math.abs(tangent.y) > .9 ? 1 : 0, Math.abs(tangent.y) > .9 ? 0 : 1, 0);
            normal.crossVectors(tangent, reference).normalize();
            positions.setXYZ(path.startCap, center.x, center.y, center.z);
          } else {
            // Parallel transport avoids twisted frame seams on curved paths.
            normal.addScaledVector(tangent, -normal.dot(tangent)).normalize();
            const distance = center.distanceTo(path.previousCenter);
            pathLength += distance;
            if ((center.y + path.previousCenter.y) * .5 > -1.83) headLength += distance;
          }
          binormal.crossVectors(tangent, normal).normalize();
          path.previousCenter ??= new THREE.Vector3();
          path.previousCenter.copy(center);
          const taper = 1 - .63 * smooth(u, .80, 1);
          for (let column = 0; column <= RADIAL_SEGMENTS; column++) {
            const angle = column / RADIAL_SEGMENTS * Math.PI * 2;
            // Shallow paired helical ridges read as F-actin at close range
            // without becoming bright oversized cables or bead decorations.
            const ridge = 1 + .12 * Math.cos(angle * 2 - u * growth * path.length * 46 + path.phase);
            const radius = path.radius * taper * ridge;
            radial.copy(normal).multiplyScalar(Math.cos(angle)).addScaledVector(binormal, Math.sin(angle)).multiplyScalar(radius).add(center);
            positions.setXYZ(path.offset + row * (RADIAL_SEGMENTS + 1) + column, radial.x, radial.y, radial.z);
          }
          if (row === path.rows) positions.setXYZ(path.endCap, center.x, center.y, center.z);
        }
        totalLength += pathLength;
        if (path.parent !== null) branchFrames.push({
          id: path.id, parent: path.parent, growing: path.growing, growth, length: pathLength,
          origin: sample(path, 0).toArray(), attachment: sample(paths[path.parent], path.parentT).toArray(),
          tip: sample(path, 1).toArray(),
        });
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      labelPosition.copy(deform(point(-.55, -1.39, .41)));
      lastFrame = [t, r];
    }
    material.emissiveIntensity = selected === 'actin' ? .17 : .018;
  }
  update();
  return {
    root, selectable: [mesh], labelAnchors, update,
    diagnostics: () => ({
      time: frame.time, remodeling: frame.remodeling,
      filamentCount: paths.length, primaryCount: PRIMARY_PATHS.length,
      growingBranches: paths.filter(path => path.growing).length,
      triangles: geometry.index.count / 3, totalLength, headFraction: headLength / totalLength,
      branches: branchFrames.map(branch => ({ ...branch, origin: [...branch.origin], attachment: [...branch.attachment], tip: [...branch.tip] })),
      ranges: paths.map(path => ({ id: path.id, parent: path.parent, offset: path.offset, rows: path.rows, columns: RADIAL_SEGMENTS, startCap: path.startCap, endCap: path.endCap })),
    }),
  };
}
