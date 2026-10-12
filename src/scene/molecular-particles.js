import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Small instanced glyphs distinguish conceptual species by silhouette as well
// as colour. They are not atomistic molecular structures.
export function molecularGlyph(kind = 'single', radius = .038) {
  if (kind === 'quinolinate') {
    // Connectivity-inspired silhouette: a six-membered ring with two adjacent
    // carboxyl branches (PubChem CID 1066). No atom positions, bond orders or
    // protonation states are claimed by this compact educational glyph.
    const ring = Array.from({ length: 6 }, (_, i) => new THREE.Vector3(
      Math.cos(i * Math.PI / 3) * radius, Math.sin(i * Math.PI / 3) * radius, 0,
    ));
    const parts = [new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring, true), 30, radius * .16, 6, true)];
    for (const index of [1, 2]) {
      const start = ring[index], end = start.clone().multiplyScalar(1.8);
      parts.push(new THREE.TubeGeometry(new THREE.LineCurve3(start, end), 3, radius * .16, 6, false));
      for (const side of [-1, 1]) {
        const tip = end.clone().add(new THREE.Vector3(side * radius * .32, radius * .35, 0));
        parts.push(new THREE.TubeGeometry(new THREE.LineCurve3(end, tip), 3, radius * .14, 6, false));
      }
    }
    const geometry = mergeGeometries(parts); parts.forEach(part => part.dispose()); return geometry;
  }
  if (kind === 'filament') {
    const points = Array.from({ length: 6 }, (_, index) => new THREE.Vector3(
      (index - 2.5) * radius * .9,
      (index % 2 ? .35 : -.35) * radius,
      Math.sin(index * 1.7) * radius * .18,
    ));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, radius * .32, 5, false);
  }
  const centres = kind === 'double' ? [[-.65, 0, 0], [.65, 0, 0]]
    : kind === 'triple' ? [[-.75, 0, 0], [0, .58, 0], [.75, 0, 0]]
      : kind === 'cluster' ? [[-.48, -.3, 0], [.48, -.3, 0], [0, .5, 0], [0, 0, .58]]
        : [[0, 0, 0]];
  const parts = centres.map(([x, y, z]) => {
    const geometry = new THREE.SphereGeometry(radius * (kind === 'single' ? 1 : .72), 9, 6);
    geometry.translate(x * radius, y * radius, z * radius);
    return geometry;
  });
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return geometry;
}

export function createMolecularPool(root, { key, capacity, geometry, material }) {
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `particles:${key}`;
  mesh.userData.key = key;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  // Pools travel throughout their compartment. A static bounding sphere from
  // their first frame would incorrectly cull later positions and raycasts.
  mesh.frustumCulled = false;
  mesh.count = 0;
  root.add(mesh);
  const transform = new THREE.Object3D();
  return {
    mesh,
    update(count, sample) {
      mesh.count = THREE.MathUtils.clamp(Math.round(count), 0, capacity);
      mesh.visible = mesh.count > 0;
      for (let index = 0; index < mesh.count; index++) {
        transform.position.set(0, 0, 0);
        transform.rotation.set(0, 0, 0);
        transform.scale.setScalar(1);
        sample(index, transform);
        transform.updateMatrix();
        mesh.setMatrixAt(index, transform.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      // Recompute for raycasting; frustumCulled alone does not bypass the
      // InstancedMesh raycast bounding-sphere test.
      if (mesh.count) mesh.computeBoundingSphere();
    },
  };
}
