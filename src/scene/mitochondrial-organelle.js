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
    side: THREE.DoubleSide, roughness: .61, bumpMap: texture, bumpScale: .010,
    sheen: .24, sheenColor: new THREE.Color(0xedb9b2), sheenRoughness: .7,
    emissive: 0x5f2635, emissiveIntensity: .025,
  });
  const innerMat = physical(0x7a536a, { side: THREE.DoubleSide, roughness: .77, bumpMap: texture, bumpScale: .006 });
  const outer = new THREE.Mesh(gridGeometry(104, 66, (u, v) => surface(u, v)), outerMat);
  // One continuous inner-membrane manifold, locally invaginated. The fold
  // material partitions this same indexed surface; no floating sheets, rods,
  // or decorative bridges are used to imply crista junctions.
  const foldSites=Array.from({length:13},(_,i)=>({
    u:.09+i*.067+.009*Math.sin(i*2.4),width:.014+.003*Math.sin(i*1.8)**2,
    depth:.57+.14*Math.sin(i*1.7+.4)**2,
  }));
  const indentation=(u,v)=>{
    let depth=0;
    for(const fold of foldSites){
      const centreU=fold.u+.006*Math.sin(v*Math.PI*2+iPhase(fold.u));
      const d=(u-centreU)/fold.width;
      depth=Math.max(depth,fold.depth*Math.exp(-d*d));
    }
    return depth*Math.pow(Math.sin(v*Math.PI),1.35);
  };
  const iPhase=u=>u*27;
  const innerSurface=(u,v)=>surface(u,v,.075).lerp(centre(u),indentation(u,v));
  const continuousInner=gridGeometry(312,64,innerSurface),innerIndices=[],foldIndices=[];
  const uv=continuousInner.attributes.uv;
  for(let i=0;i<continuousInner.index.count;i+=3){
    const face=[0,1,2].map(j=>continuousInner.index.getX(i+j));
    const u=face.reduce((sum,j)=>sum+uv.getY(j),0)/3,v=face.reduce((sum,j)=>sum+uv.getX(j),0)/3;
    (indentation(u,v)>.045?foldIndices:innerIndices).push(...face);
  }
  const partition=indices=>{
    const geometry=new THREE.BufferGeometry();
    for(const [name,attribute] of Object.entries(continuousInner.attributes))geometry.setAttribute(name,attribute);
    geometry.setIndex(indices);return geometry;
  };
  const inner=new THREE.Mesh(partition(innerIndices),innerMat);
  const foldMat=physical(0xc59194,{side:THREE.DoubleSide,roughness:.74,clearcoat:.025,bumpMap:texture,bumpScale:.006,emissive:0x6a3040,emissiveIntensity:.035});
  const folds=new THREE.Mesh(partition(foldIndices),foldMat);
  outer.name='Outer mitochondrial membrane';inner.name='Inner mitochondrial membrane';folds.name='Invaginated cristae membranes';
  group.add(outer,inner,folds);

  const cutMat = physical(0xdbb1a7, { roughness: .62, bumpMap: texture, bumpScale: .012 });
  const outerEdges = [], innerEdges = [];
  for (const side of [0, 1]) {
    // The intermembrane space stays open at the cut. Each membrane has its
    // own thin section lip instead of a solid bridge joining both membranes.
    for(const inset of [0,.075]) group.add(new THREE.Mesh(gridGeometry(100,2,(u,v)=>surface(u,side,inset+v*.012)),cutMat));
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

  const granules = new THREE.InstancedMesh(new THREE.SphereGeometry(.026, 7, 5), physical(0xb79a9f, { roughness: .92 }), 76);
  const rng = random(847), transform = new THREE.Object3D();
  for (let index = 0; index < granules.count; index++) {
    let u=.07+rng()*.86;
    // Matrix granules occupy spaces between invaginations.
    for(let retry=0;retry<40&&indentation(u,.5)>.10;retry++)u=.07+rng()*.86;
    const c=centre(u),r=radius(u)-.16;
    transform.position.set(c.x, c.y + (rng() - .5) * r * 1.05, -.20 - rng() * r * .33);
    transform.scale.setScalar(.48 + rng() * .62);
    transform.updateMatrix();
    granules.setMatrixAt(index, transform.matrix);
  }
  granules.name='Matrix granules';group.add(granules);

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
    group, outer, inner, folds, surface, innerSurface, outerMat, foldMat,
    diagnostics:()=>({cristae:foldSites.length,sharedInnerVertices:continuousInner.attributes.position.count,innerTriangles:innerIndices.length/3,foldTriangles:foldIndices.length/3}),
    update(stress, selected) {
      outerMat.color.copy(healthy).lerp(stressed, stress * .68);
      foldMat.color.copy(healthyFold).lerp(stressedFold, stress * .55);
      outerMat.emissiveIntensity = .025 + stress * .065 + (selected ? .13 : 0);
      foldMat.emissiveIntensity = .035 + stress * .055 + (selected ? .08 : 0);
    },
  };
}
