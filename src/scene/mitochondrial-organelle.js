import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { gridGeometry, physical, random, v3 } from './geometry.js';

function merged(parts) {
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return geometry;
}

// An opened organelle, with two separately modelled membranes and invaginated
// inner-membrane sheets. The section is an illustrative removal of tissue;
// oxidative stress does not create the opening.
export function createMitochondrialOrganelle(texture) {
  const group = new THREE.Group();
  group.name = 'Mitochondrial cutaway';
  group.userData.key = 'mitochondria';
  const centre = u => v3((u * 2 - 1) * 2.27, .25 * Math.sin(u * Math.PI) + .09 * Math.sin(u * Math.PI * 2) - .15, .07 * Math.sin(u * Math.PI * 2));
  const radius = u => Math.pow(Math.max(0, Math.sin(u * Math.PI)), .56) * (.76 + .045 * Math.sin(u * Math.PI * 5));
  const surface = (u, v, inset = 0) => {
    const c = centre(u), r = Math.max(0, radius(u) - inset);
    // Slightly oblique, irregular section lips preserve depth when viewed from
    // either side instead of producing a flat, perfectly elliptical window.
    const edge = .245 * Math.PI + .06 * Math.sin(u * Math.PI * 2);
    const a = edge + v * (Math.PI * 2 - edge * 2);
    const relief = 1 + .018 * Math.sin(u * 71 + a * 3) + .009 * Math.sin(u * 133 - a * 7);
    return c.add(v3(.027 * Math.sin(a * 3) * r, Math.sin(a) * r * relief, Math.cos(a) * r * .91 * relief));
  };
  const outerMat = physical(0xb57f83, {
    side: THREE.DoubleSide, roughness: .61, bumpMap: texture, bumpScale: .027,
    sheen: .24, sheenColor: new THREE.Color(0xedb9b2), sheenRoughness: .7,
    emissive: 0x5f2635, emissiveIntensity: .025,
  });
  const innerMat = physical(0x7a536a, { side: THREE.DoubleSide, roughness: .77, bumpMap: texture, bumpScale: .016 });
  const outer = new THREE.Mesh(gridGeometry(104, 66, (u, v) => surface(u, v)), outerMat);
  const inner = new THREE.Mesh(gridGeometry(104, 66, (u, v) => surface(u, v, .075)), innerMat);
  outer.name = 'Outer mitochondrial membrane';
  inner.name = 'Inner mitochondrial membrane';
  group.add(outer, inner);

  const cutMat = physical(0xdbb1a7, { roughness: .62, bumpMap: texture, bumpScale: .012 });
  const outerEdges = [], innerEdges = [];
  for (const side of [0, 1]) {
    group.add(new THREE.Mesh(gridGeometry(100, 4, (u, v) => surface(u, side, v * .075)), cutMat));
    const outerPoints = [], innerPoints = [];
    for (let i = 0; i <= 100; i++) {
      outerPoints.push(surface(i / 100, side));
      innerPoints.push(surface(i / 100, side, .075));
    }
    outerEdges.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outerPoints), 100, .018, 7, false));
    innerEdges.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(innerPoints), 100, .012, 7, false));
  }
  group.add(new THREE.Mesh(merged(outerEdges), cutMat));
  group.add(new THREE.Mesh(merged(innerEdges), physical(0x80516a, { roughness: .7 })));

  const foldMat = physical(0xc99192, {
    side: THREE.DoubleSide, roughness: .64, bumpMap: texture, bumpScale: .015,
    sheen: .19, sheenColor: new THREE.Color(0xf0c8b9),
    emissive: 0x6a3040, emissiveIntensity: .035,
  });
  const ridgeMat = physical(0xe1b5a7, { roughness: .57, bumpMap: texture, bumpScale: .009 });
  const foldParts = [], crestParts = [], junctionParts = [];
  for (let index = 0; index < 15; index++) {
    const u = .075 + index * .0602, c = centre(u), r = radius(u) - .095;
    const flip = index % 2 ? -1 : 1;
    const sway = .04 * Math.sin(index * 2.7);
    const curve = new THREE.CatmullRomCurve3([
      v3(c.x - .07, c.y + flip * r * .84, -.09),
      v3(c.x + .045 + sway, c.y + flip * r * .61, .26 * r + .08),
      v3(c.x - .075, c.y + flip * r * .07, .49 * r + .085),
      v3(c.x + .035 + sway, c.y - flip * r * .51, .40 * r + .065),
      v3(c.x + .155, c.y - flip * r * .57, .04),
    ]);
    // Each fold is a membrane sheet with a rounded exposed crest. Its recessed
    // edge reaches the back of the inner membrane, rather than floating free.
    foldParts.push(gridGeometry(36, 11, (s, t) => {
      const p = curve.getPoint(s);
      const recessedZ = -.45 * r * Math.sin(s * Math.PI) - .05;
      return v3(p.x + .024 * Math.sin(t * Math.PI) * Math.sin(s * 15 + index), p.y + .027 * Math.sin(t * Math.PI) * Math.sin(s * 8 + index), THREE.MathUtils.lerp(p.z, recessedZ, t));
    }));
    crestParts.push(new THREE.TubeGeometry(curve, 42, .020, 7, false));
    const junction = new THREE.CatmullRomCurve3([
      v3(c.x - .07, c.y + flip * r * .84, -.09),
      v3(c.x - .04, c.y + flip * r * .89, -.23 * r),
      v3(c.x + .015, c.y + flip * r * .67, -.52 * r),
    ]);
    junctionParts.push(new THREE.TubeGeometry(junction, 14, .024, 7, false));
  }
  const folds = new THREE.Mesh(merged(foldParts), foldMat);
  folds.name = 'Invaginated cristae membranes';
  group.add(folds, new THREE.Mesh(merged(crestParts), ridgeMat), new THREE.Mesh(merged(junctionParts), foldMat));

  const granules = new THREE.InstancedMesh(new THREE.SphereGeometry(.026, 7, 5), physical(0xb79a9f, { roughness: .92 }), 76);
  const rng = random(847), transform = new THREE.Object3D();
  for (let index = 0; index < granules.count; index++) {
    const u = .07 + rng() * .86, c = centre(u), r = radius(u) - .16;
    transform.position.set(c.x, c.y + (rng() - .5) * r * 1.05, -.20 - rng() * r * .33);
    transform.scale.setScalar(.48 + rng() * .62);
    transform.updateMatrix();
    granules.setMatrixAt(index, transform.matrix);
  }
  group.add(granules);

  // Fine, discontinuous surface relief remains attached to the back membrane.
  // It is structural texture, never a luminous outline or oxidative lightning.
  const reliefParts = [];
  for (let lane = 0; lane < 13; lane++) {
    const points = [];
    for (let sample = 0; sample <= 22; sample++) {
      const u = .11 + sample / 22 * .77;
      points.push(surface(u, .13 + lane * .057 + Math.sin(u * 11 + lane) * .008, -.004));
    }
    reliefParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 28, .007, 5, false));
  }
  group.add(new THREE.Mesh(merged(reliefParts), physical(0xc49797, { roughness: .83 })));

  const healthy = new THREE.Color(0xb57f83), stressed = new THREE.Color(0x9e6b80);
  const healthyFold = new THREE.Color(0xc99192), stressedFold = new THREE.Color(0xb48194);
  return {
    group, outer, inner, folds, surface,
    update(stress, selected) {
      outerMat.color.copy(healthy).lerp(stressed, stress * .68);
      foldMat.color.copy(healthyFold).lerp(stressedFold, stress * .55);
      outerMat.emissiveIntensity = .025 + stress * .065 + (selected ? .13 : 0);
      foldMat.emissiveIntensity = .035 + stress * .055 + (selected ? .08 : 0);
    },
  };
}
