import * as THREE from 'three';

export const v3 = (x, y, z = 0) => new THREE.Vector3(x, y, z);
export function random(seed = 731) {
  return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
}
export function gridGeometry(rows, columns, sample) {
  const positions = [], uvs = [], indices = [];
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= columns; j++) {
      const p = sample(i / rows, j / columns);
      positions.push(p.x, p.y, p.z); uvs.push(j / columns, i / rows);
      if (i < rows && j < columns) {
        const a = i * (columns + 1) + j, b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices); g.computeVertexNormals(); return g;
}

// The opened sector is geometry, not a glass shader: rotating the specimen
// exposes the continuous outer membrane and the real, recessed organelles.
export function membraneSurface(profile, kind) {
  const curve = new THREE.CatmullRomCurve3(profile.map(([r, y]) => v3(r, y)), false, 'centripetal');
  const windowStart = kind === 'pre' ? 1.035 : -2.12;
  const windowEnd = kind === 'pre' ? 2.77 : -.31;
  const opening = u => {
    const y = curve.getPoint(u).y;
    const t = THREE.MathUtils.clamp((y - windowStart) / (windowEnd - windowStart), 0, 1);
    return Math.pow(Math.max(0, Math.sin(t * Math.PI)), .56) * 1.10;
  };
  const surface = (u, angle, inset = 0) => {
    const p = curve.getPoint(u), a = angle;
    const ripple = .031 * Math.sin(a * 3 + p.y * 1.7) + .018 * Math.cos(a * 5 - p.y * 2.1);
    const granular = .006 * Math.sin(a * 23 + p.y * 13) * Math.cos(a * 11 - p.y * 17);
    const radius = Math.max(0, p.x - inset) * (1 + ripple + granular);
    const bend = kind === 'pre'
      ? -.09 + .19 * Math.sin(p.y * 1.16) - .19 * Math.max(0, p.y - 2.15)
      : .10 + .16 * Math.sin(p.y * 1.45);
    const contact = kind === 'pre'
      ? THREE.MathUtils.smoothstep(p.y, .94, 1.44)
      : THREE.MathUtils.smoothstep(-p.y, .25, .76);
    return v3(
      Math.cos(a) * radius + bend,
      p.y + Math.sin(a * 2 + .6) * .06 * contact * radius + .012 * Math.sin(a * 7 + p.y * 6) * contact * radius,
      Math.sin(a) * radius * (kind === 'pre' ? .77 : .72) + .045 * Math.sin(p.y * 1.8),
    );
  };
  const sample = (u, v, inset = 0) => {
    const half = opening(u);
    return surface(u, 1.28 + half + v * (Math.PI * 2 - half * 2), inset);
  };
  const geometry = gridGeometry(112, 100, sample);
  const position = geometry.attributes.position, colors = [], color = new THREE.Color();
  const pale = new THREE.Color(kind === 'pre' ? 0xb2a2cf : 0xc3a1b5);
  const deep = new THREE.Color(kind === 'pre' ? 0x73639b : 0x967693);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const n = .45 + .20 * Math.sin(x * 3.8 + y * 5.7) * Math.sin(z * 4.1 - y * 2.7)
      + .12 * Math.cos(x * 9 - y * 7 + z * 4);
    color.copy(deep).lerp(pale, n);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const findHeight = target => {
    let lo = 0, hi = 1;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (curve.getPoint(mid).y < target) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  return { geometry, sample, surface, opening, curve, windowRange: [findHeight(windowStart), findHeight(windowEnd)] };
}
export function membraneGeometry(profile, kind) { return membraneSurface(profile, kind).geometry; }

export function organicLobe(seed = 1) {
  const g = new THREE.SphereGeometry(1, 20, 14), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const r = 1 + .068 * Math.sin(x * 3 + seed) * Math.sin(y * 3 - seed) * Math.cos(z * 3)
      + .025 * Math.sin(y * 7 + x * 5 + seed) * Math.cos(z * 6 - seed);
    p.setXYZ(i, x * r, y * r, z * r);
  }
  g.computeVertexNormals(); return g;
}

export function surfaceTexture() {
  const size = 512, canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d'), data = ctx.createImageData(size, size), rng = random(12);
  // Periodic, multi-scale membrane relief. Broad fibrous folds keep the specimen
  // legible at atlas scale; fine grain resolves progressively during the zoom.
  const tau = Math.PI * 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * tau, v = y / size * tau, i = (y * size + x) * 4;
    const fibres = Math.sin(u * 21 + Math.sin(v * 3) * 2.8 + Math.sin(v * 11) * .6);
    const folds = Math.sin(v * 9 + Math.sin(u * 6) * 1.8) * Math.cos(u * 13 + v * 3);
    const pores = Math.sin(u * 67 + Math.sin(v * 19)) * Math.cos(v * 73 + Math.sin(u * 17));
    const n = 128 + fibres * 23 + folds * 24 + pores * 13 + (rng() - .5) * 20;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = n; data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2); texture.anisotropy = 4; return texture;
}

export function tissueMaterial(texture, options = {}) {
  const { fadeBase = false, relief = .008, ...materialOptions } = options;
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xf7efff, vertexColors: true, roughness: .64, metalness: 0,
    transparent: true, opacity: .90, depthWrite: false, side: THREE.DoubleSide,
    forceSinglePass: true, bumpMap: texture, bumpScale: .024,
    sheen: .28, sheenColor: new THREE.Color(0xd6c8ef), sheenRoughness: .69,
    clearcoat: .04, clearcoatRoughness: .48,
    ...materialOptions,
  });
  mat.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vOrganicPosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvOrganicPosition = position;');
    shader.fragmentShader = `
      varying vec3 vOrganicPosition;
      float tissueHash(vec3 p) { p = fract(p * .3183099 + vec3(.11,.37,.71)); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float tissueNoise(vec3 p) {
        vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(mix(tissueHash(i),tissueHash(i+vec3(1,0,0)),f.x),mix(tissueHash(i+vec3(0,1,0)),tissueHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(tissueHash(i+vec3(0,0,1)),tissueHash(i+vec3(1,0,1)),f.x),mix(tissueHash(i+vec3(0,1,1)),tissueHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      float tissueHeight = tissueNoise(vOrganicPosition * 13.) * ${relief.toFixed(5)} + tissueNoise(vOrganicPosition * 39.) * ${(relief * .18).toFixed(5)};
      vec3 tx=dFdx(-vViewPosition), ty=dFdy(-vViewPosition);
      vec3 rx=cross(ty,normal), ry=cross(normal,tx);
      float det=dot(tx,rx);
      vec3 gradient=sign(det)*(dFdx(tissueHeight)*rx+dFdy(tissueHeight)*ry);
      normal=normalize(abs(det)*normal-gradient);
      diffuseColor.rgb *= .94 + tissueNoise(vOrganicPosition * 3.8) * .10;
      ${fadeBase ? 'diffuseColor.a *= smoothstep(-3.65, -3.28, vOrganicPosition.y);' : ''}
    `);
  };
  mat.customProgramCacheKey = () => `sectioned-biomembrane-v6-${fadeBase}-${relief}`; return mat;
}

export const physical = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: .48, metalness: 0, clearcoat: .12, clearcoatRoughness: .5, ...extra });
export function tube(points, radius, mat, segments = 48) {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 8, false), mat);
}
