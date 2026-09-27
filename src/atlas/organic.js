import * as THREE from 'three';
import { edgeTable, triTable } from 'three/addons/objects/MarchingCubes.js';

const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
export const point = (x, y, z = 0) => new THREE.Vector3(x, y, z);

export function seededRandom(seed = 1931) {
  return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
}

export function branch(points, radii, name = '') {
  const curve = new THREE.CatmullRomCurve3(points.map(p => point(...p)), false, 'centripetal');
  const radius = t => {
    const s = clamp(t, 0, 1) * (radii.length - 1), i = Math.min(radii.length - 2, Math.floor(s));
    return mix(radii[i], radii[i + 1], s - i);
  };
  return { curve, radius, name, length: curve.getLength() };
}

// A sampled signed-distance union gives every dendritic bifurcation a continuous
// membrane, including its saddle and the broad root where it leaves the soma.
// Each branch uses a small temporary volume; the expensive distance evaluations
// only touch the narrow band around its curved skeleton.
export function fusedNeuronGeometry(branches, soma, spacing = .1) {
  const box = new THREE.Box3();
  branches.forEach(b => b.curve.points.forEach(p => box.expandByPoint(p)));
  box.expandByScalar(3.3);
  const origin = box.min.clone();
  const size = box.getSize(new THREE.Vector3());
  const nx = Math.ceil(size.x / spacing) + 1, ny = Math.ceil(size.y / spacing) + 1, nz = Math.ceil(size.z / spacing) + 1;
  const stride = nx * ny, field = new Float32Array(stride * nz);
  field.fill(8);
  const index = (x, y, z) => x + y * nx + z * stride;
  const grid = p => [Math.round((p.x - origin.x) / spacing), Math.round((p.y - origin.y) / spacing), Math.round((p.z - origin.z) / spacing)];
  const smoothMin = (a, b, k) => {
    const h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * .25;
  };
  const [sx, sy, sz] = grid(soma);
  const somaticExtent = [2.04,2.26,1.68].map(radius => Math.ceil((radius + .65) / spacing));
  for (let z = sz - somaticExtent[2]; z <= sz + somaticExtent[2]; z++) for (let y = sy - somaticExtent[1]; y <= sy + somaticExtent[1]; y++) for (let x = sx - somaticExtent[0]; x <= sx + somaticExtent[0]; x++) {
    const px = origin.x + x * spacing - soma.x, py = origin.y + y * spacing - soma.y, pz = origin.z + z * spacing - soma.z;
    const ex = px / 2.04, ey = py / 2.26, ez = pz / 1.68;
    const r = Math.sqrt(ex * ex + ey * ey + ez * ez);
    const wrinkle = .055 * Math.sin(px * 2.2 + py) * Math.sin(py * 1.9 - pz) + .026 * Math.sin(pz * 4.3 + px * 2.7);
    field[index(x, y, z)] = (r - 1) * 1.7 + wrinkle;
  }

  for (const b of branches) {
    const padding = Math.max(b.radius(0), .4) + .65;
    const localBox = new THREE.Box3().setFromPoints(b.curve.getPoints(40)).expandByScalar(padding);
    const lower = grid(localBox.min).map((n, i) => clamp(n, 1, [nx, ny, nz][i] - 2));
    const upper = grid(localBox.max).map((n, i) => clamp(n, 1, [nx, ny, nz][i] - 2));
    const lx = upper[0] - lower[0] + 1, ly = upper[1] - lower[1] + 1, lz = upper[2] - lower[2] + 1;
    const localStride = lx * ly, local = new Float32Array(localStride * lz);
    local.fill(8);
    const count = Math.ceil(b.length / .26), samples = [];
    for (let i = 0; i <= count; i++) samples.push(b.curve.getPoint(i / count));
    for (let i = 0; i < count; i++) {
      // A terminal thinner than the voxel diagonal can disappear between
      // samples. Preserve a continuous membrane all the way to its rounded tip.
      const a = samples[i], c = samples[i + 1];
      const ra = Math.max(b.radius(i / count), spacing * 1.12), rb = Math.max(b.radius((i + 1) / count), spacing * 1.12);
      const pad = Math.max(ra, rb) + .47;
      const lo = grid(a.clone().min(c).addScalar(-pad)), hi = grid(a.clone().max(c).addScalar(pad));
      const dx = c.x - a.x, dy = c.y - a.y, dz = c.z - a.z, length2 = dx * dx + dy * dy + dz * dz;
      for (let z = Math.max(lo[2], lower[2]); z <= Math.min(hi[2], upper[2]); z++) {
        const pz = origin.z + z * spacing - a.z;
        for (let y = Math.max(lo[1], lower[1]); y <= Math.min(hi[1], upper[1]); y++) {
          const py = origin.y + y * spacing - a.y;
          for (let x = Math.max(lo[0], lower[0]); x <= Math.min(hi[0], upper[0]); x++) {
            const px = origin.x + x * spacing - a.x, t = clamp((px * dx + py * dy + pz * dz) / length2, 0, 1);
            const ex = px - dx * t, ey = py - dy * t, ez = pz - dz * t;
            const distance = Math.sqrt(ex * ex + ey * ey + ez * ez) - mix(ra, rb, t);
            const n = (x - lower[0]) + (y - lower[1]) * lx + (z - lower[2]) * localStride;
            if (distance < local[n]) local[n] = distance;
          }
        }
      }
    }
    const blend = b.radius(0) > .65 ? .58 : .25;
    for (let z = 0; z < lz; z++) for (let y = 0; y < ly; y++) for (let x = 0; x < lx; x++) {
      const d = local[x + y * lx + z * localStride];
      if (d > .46) continue;
      const n = index(x + lower[0], y + lower[1], z + lower[2]);
      field[n] = smoothMin(field[n], d, blend);
    }
  }

  const corners = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const offsets = corners.map(c => c[0] + c[1] * nx + c[2] * stride);
  const positions = [], normals = [], indices = [], edgeVertices = new Map(), ids = new Int32Array(12);
  const values = new Float32Array(8), gradient = n => [field[n + 1] - field[n - 1], field[n + nx] - field[n - nx], field[n + stride] - field[n - stride]];
  for (let z = 1; z < nz - 2; z++) for (let y = 1; y < ny - 2; y++) for (let x = 1; x < nx - 2; x++) {
    const n = index(x, y, z);
    let cube = 0;
    for (let j = 0; j < 8; j++) { values[j] = field[n + offsets[j]]; if (values[j] < 0) cube |= 1 << j; }
    const mask = edgeTable[cube];
    if (!mask) continue;
    for (let e = 0; e < 12; e++) if (mask & (1 << e)) {
      const [a, b] = edges[e], ai = n + offsets[a], bi = n + offsets[b];
      const axis = Math.abs(ai - bi) === 1 ? 0 : Math.abs(ai - bi) === nx ? 1 : 2;
      const key = Math.min(ai, bi) * 3 + axis;
      if (edgeVertices.has(key)) { ids[e] = edgeVertices.get(key); continue; }
      const t = values[a] / (values[a] - values[b]);
      const ca = corners[a], cb = corners[b], ga = gradient(ai), gb = gradient(bi);
      const gx = mix(ga[0], gb[0], t), gy = mix(ga[1], gb[1], t), gz = mix(ga[2], gb[2], t);
      const length = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
      ids[e] = positions.length / 3;
      edgeVertices.set(key, ids[e]);
      positions.push(origin.x + (x + mix(ca[0], cb[0], t)) * spacing, origin.y + (y + mix(ca[1], cb[1], t)) * spacing, origin.z + (z + mix(ca[2], cb[2], t)) * spacing);
      normals.push(gx / length, gy / length, gz / length);
    }
    const row = cube * 16;
    // The lookup table winds toward decreasing values; the membrane faces out.
    for (let j = 0; triTable[row + j] !== -1; j += 3) indices.push(ids[triTable[row + j]], ids[triTable[row + j + 2]], ids[triTable[row + j + 1]]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

export function membraneColor(geometry, kind = 'neuron') {
  const p = geometry.attributes.position, colors = [], color = new THREE.Color();
  // THREE.Color decodes these sRGB pigments into linear light before they
  // become vertex colors; HSL values here previously washed out the tissue.
  const shadow = new THREE.Color(kind === 'neuron' ? 0x75658c : 0x74668d);
  const pigment = new THREE.Color(kind === 'neuron' ? 0xae8eb0 : 0xaa89ad);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const cloud = Math.sin(x * 1.7 + Math.sin(y * 1.1)) * Math.cos(y * 1.2 + z * 2.3);
    const grain = Math.sin(x * 7.5 + y * 3.1) * Math.sin(y * 6.8 - z * 4.3);
    color.copy(shadow).lerp(pigment, clamp(.48 + cloud * .24 + grain * .035, 0, 1));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

// Curved, flared neck and asymmetric cap form one surface. The radius profile
// deliberately has a narrow waist, an oblate head, and a broad membrane root.
export function mushroomSpine(base, direction, tangent, length, width, phase, morphology = 'mushroom') {
  const axis = direction.clone().normalize(), side = tangent.clone().normalize();
  const binormal = new THREE.Vector3().crossVectors(axis, side).normalize();
  side.crossVectors(binormal, axis).normalize();
  const profiles = {
    mushroom: [[0,.72],[.09,.40],[.22,.28],[.43,.25],[.59,.40],[.71,.80],[.80,1],[.91,.79],[.975,.37],[1,0]],
    thin: [[0,.67],[.10,.37],[.28,.26],[.53,.24],[.72,.36],[.84,.64],[.92,.63],[.98,.30],[1,0]],
    stubby: [[0,.92],[.12,.81],[.31,.78],[.53,.94],[.69,1],[.83,.84],[.95,.46],[1,0]],
  };
  const profile = profiles[morphology] ?? profiles.mushroom;
  const radiusCurve = new THREE.CatmullRomCurve3(profile.map(([y,r]) => point(r,y)), false, 'centripetal');
  const rows = 28, columns = 16, positions = [], indices = [];
  for (let i = 0; i <= rows; i++) {
    const u = i / rows, rp = radiusCurve.getPoint(u), height = rp.y * length;
    const bend = Math.sin(rp.y * Math.PI * .72) * length * (.12 + .07 * Math.cos(phase)) * Math.sin(phase);
    for (let j = 0; j <= columns; j++) {
      const angle = j / columns * Math.PI * 2;
      const radius = Math.max(0, rp.x) * width * (1 + .08 * Math.sin(angle * 2 + phase) + .035 * Math.sin(angle * 3 - rp.y * 4));
      const p = base.clone().addScaledVector(axis, height).addScaledVector(side, bend + Math.cos(angle) * radius).addScaledVector(binormal, Math.sin(angle) * radius * .86);
      positions.push(p.x, p.y, p.z);
      if (i < rows && j < columns) { const a = i * (columns + 1) + j, b = a + columns + 1; indices.push(a,a+1,b,b,a+1,b+1); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices); g.computeVertexNormals();
  return membraneColor(g);
}

export function organicMaterial({ nucleus = false, window = false, color = 0xffffff, ...options } = {}) {
  const material = new THREE.MeshPhysicalMaterial({ color, vertexColors: !nucleus, roughness: .6, metalness: 0, clearcoat: .05, clearcoatRoughness: .55, sheen: .16, sheenRoughness: .75, sheenColor: new THREE.Color(0x9a84a5), transparent: window, depthWrite: true, ...options });
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vCellPosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCellPosition = position;');
    shader.fragmentShader = `
      varying vec3 vCellPosition;
      float cellHash(vec3 p) { p = fract(p * .3183099 + vec3(.11,.37,.71)); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float cellNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        return mix(mix(mix(cellHash(i),cellHash(i+vec3(1,0,0)),f.x),mix(cellHash(i+vec3(0,1,0)),cellHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(cellHash(i+vec3(0,0,1)),cellHash(i+vec3(1,0,1)),f.x),mix(cellHash(i+vec3(0,1,1)),cellHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      vec3 cellP = vCellPosition * ${nucleus ? '8.' : '12.'};
      float cellHeight = cellNoise(cellP) * .008 + cellNoise(cellP * 2.7) * .002;
      vec3 cx = dFdx(-vViewPosition), cy = dFdy(-vViewPosition);
      vec3 crx = cross(cy, normal), cry = cross(normal, cx);
      float cd = dot(cx, crx);
      vec3 cellGradient = sign(cd) * (dFdx(cellHeight) * crx + dFdy(cellHeight) * cry);
      normal = normalize(abs(cd) * normal - cellGradient);
      float softCell = cellNoise(vCellPosition * 2.8);
      diffuseColor.rgb *= .96 + softCell * .08;
      ${window ? `float somaWindow = (1. - smoothstep(.43, .97, length((vCellPosition.xy - vec2(-9.,-3.)) / vec2(2.1,2.4)))) * smoothstep(-1.1,-.25,vCellPosition.z);
      diffuseColor.a *= 1. - somaWindow * .76;` : ''}
    `);
  };
  material.customProgramCacheKey = () => `atlas-cell-v2-${nucleus}-${window}`;
  return material;
}
