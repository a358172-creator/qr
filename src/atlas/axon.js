import * as THREE from 'three';
import { gridGeometry, tissueMaterial } from '../scene/geometry.js';

// A neighbouring neuron's axon continues behind the specimen. Its first ring
// matches the presynaptic membrane, avoiding a severed stalk at atlas scale.
export function createAfferentAxon(texture) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.753, 2.959, -.01),
    new THREE.Vector3(.73, 3.75, -.03),
    new THREE.Vector3(1.0, 5.15, -.35),
    new THREE.Vector3(2.8, 7.4, -1.7),
    new THREE.Vector3(4.5, 10.8, -4.2),
    new THREE.Vector3(8.8, 16, -8.7),
    new THREE.Vector3(14, 25, -13),
  ]);
  const lateral = new THREE.Vector3(), normal = new THREE.Vector3(), reference = new THREE.Vector3(0, 0, 1);
  const geometry = gridGeometry(100, 24, (u, v) => {
    const center = curve.getPoint(u), tangent = curve.getTangent(u).normalize();
    lateral.crossVectors(tangent, reference).normalize(); normal.crossVectors(lateral, tangent).normalize();
    const a = v * Math.PI * 2;
    const radius = (.168 - u * .045) * (1 + Math.sin(u * Math.PI) * (.035 * Math.sin(u * 51) + .018 * Math.cos(a * 3 + u * 10)));
    return center.addScaledVector(lateral, Math.cos(a) * radius).addScaledVector(normal, Math.sin(a) * radius * .77);
  });
  geometry.translate(-1, -1, 0); geometry.scale(1 / .35, 1 / .35, 1 / .35);
  const p = geometry.attributes.position, colors = [], color = new THREE.Color();
  const deep = new THREE.Color(0x73639b), pale = new THREE.Color(0xb2a2cf);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = .45 + .20 * Math.sin(x * 3.8 + y * 5.7) * Math.sin(z * 4.1 - y * 2.7) + .12 * Math.cos(x * 9 - y * 7 + z * 4);
    color.copy(deep).lerp(pale, n); colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geometry, tissueMaterial(texture, { side: THREE.FrontSide }));
  mesh.position.set(1, 1, 0); mesh.scale.setScalar(.35);
  mesh.name = 'Axón aferente'; return mesh;
}
