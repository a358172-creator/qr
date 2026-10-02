import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { point, branch, seededRandom, fusedNeuronGeometry, membraneColor, mushroomSpine, organicMaterial } from './organic.js';

/** Anatomical overview. Units are illustrative, rather than a measured scale. */
export function createNeuron() {
  const root = new THREE.Group();
  root.name = 'Neurona · membrana continua';
  const soma = point(-9,-3,-1), synapseOrigin = point(1,1,0), synapseScale = .35;
  const branches = [
    branch([[-9,-3,-1],[-7,-2.3,-.75],[-4.2,-1.6,-.3],[-1,-.73,-.12],[1,-.54,0],[3.7,.35,-.35],[6,2,-1],[8,4,-2],[10,7,-2.7],[11,10,-3]], [1.13,.83,.62,.44,.37,.29,.23,.2,.15,.09], 'dendrita principal'),
    branch([[-9,-3,-1],[-9,0,-1.2],[-9.6,3,-1.3],[-9,6,-1.7],[-10.2,10,-2.6],[-9.5,14,-3.7]], [1.13,.81,.57,.42,.27,.095], 'dendrita apical'),
    branch([[-9,-3,-1],[-12,-3.2,-.8],[-15,-2.6,-.1],[-18,-3.6,.4],[-21,-2.7,.9]], [1.12,.85,.5,.31,.12], 'dendrita basal izquierda'),
    branch([[-9,-3,-1],[-10,-5.5,-.5],[-8.9,-8.2,-.2],[-7.6,-11,.6],[-6.9,-14.5,.7]], [1,.69,.42,.24,.1], 'dendrita basal inferior'),
    branch([[-9,-3,-1],[-11.6,-5.9,-1.6],[-14.5,-7.4,-1.8],[-17,-9.9,-2],[-20,-10.7,-2.9]], [1,.6,.4,.22,.09]),
    branch([[-9,-3,-1],[-7,-4.6,-2.3],[-4.4,-7,-3.1],[-.8,-8.7,-4.1],[1,-12,-4.7]], [.95,.6,.36,.21,.08]),
    branch([[-4.2,-1.6,-.3],[-2.9,1,-.8],[-2.5,3.5,-1.6],[-.8,6.1,-2.5],[1.8,7.8,-2.9]], [.49,.35,.23,.15,.085]),
    branch([[6,2,-1],[8.8,1.6,-1.4],[11.5,2.7,-1.6],[14.3,3,-1.8]], [.22,.18,.12,.075]),
    branch([[8,4,-2],[6.8,6.1,-2.5],[7.7,9,-3.2],[7,12,-3.5]], [.18,.15,.12,.075]),
    branch([[-9.6,3,-1.3],[-12,4.5,-1.3],[-13.8,7.3,-1.7],[-16.5,8.8,-2.5]], [.45,.31,.19,.085]),
    branch([[-9,6,-1.7],[-6.8,8.2,-2],[-6.1,11,-1.8],[-3.9,13.5,-2.8]], [.32,.25,.16,.085]),
    branch([[-10.2,10,-2.6],[-12.1,12,-3],[-12.7,15.7,-3.6]], [.21,.15,.075]),
    branch([[-13.8,7.3,-1.7],[-13.1,10,-2],[-14.4,12.5,-1.5]], [.16,.11,.075]),
    branch([[-15,-2.6,-.1],[-16.5,-.1,.1],[-19,1.2,.6],[-20.7,3.5,1]], [.36,.27,.18,.085]),
    branch([[-18,-3.6,.4],[-18.8,-5.7,.2],[-21.2,-7.3,.7]], [.23,.16,.085]),
    branch([[-10,-5.5,-.5],[-12.2,-8.6,.4],[-11.8,-11.3,1],[-13.1,-14,1.4]], [.44,.28,.16,.085]),
    branch([[-8.9,-8.2,-.2],[-6.1,-8.6,.5],[-3.7,-10.8,1.1],[-1.8,-11.8,1.2]], [.32,.23,.15,.08]),
    branch([[-14.5,-7.4,-1.8],[-15.6,-5.5,-2.7],[-17.9,-5.8,-3.5]], [.27,.18,.08]),
    branch([[-4.4,-7,-3.1],[-3.4,-4.8,-3.9],[-1.2,-4.1,-4.5],[.8,-4.8,-5.2]], [.29,.19,.13,.075]),
    branch([[-2.5,3.5,-1.6],[.1,4.5,-2.1],[2.6,4.2,-3.1],[4.5,5.4,-3.6]], [.18,.15,.11,.07]),
  ];
  const body = membraneColor(fusedNeuronGeometry(branches, soma));
  const geometries = [body], rng = seededRandom(3731);
  const spineAnchors = [];
  branches.forEach((b, branchIndex) => {
    const count = Math.max(5, Math.round(b.length / (branchIndex < 6 ? 1.2 : 1.42)));
    for (let i = 0; i < count; i++) {
      const start = branchIndex < 6 ? .20 : .17;
      const t = start + (i + .2 + rng() * .5) / count * (.96 - start);
      const center = b.curve.getPoint(t), tangent = b.curve.getTangent(t).normalize();
      if (center.distanceTo(soma) < 2.8 || (Math.abs(center.x - 1) < 1.05 && center.y > -1.4 && center.y < 1.5)) continue;
      const reference = Math.abs(tangent.z) < .85 ? point(0,0,1) : point(0,1,0);
      const right = new THREE.Vector3().crossVectors(tangent, reference).normalize();
      const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
      // Most silhouettes read in the illustration plane, with some near-facing
      // spines establishing that the arbor is a volume rather than a flat diagram.
      const angle = (i % 2 ? Math.PI : 0) + (rng() - .5) * 1.7;
      const direction = right.multiplyScalar(Math.cos(angle)).addScaledVector(up, Math.sin(angle)).addScaledVector(tangent, (rng() - .5) * .35).normalize();
      const radius = b.radius(t), base = center.clone().addScaledVector(direction, radius * .75);
      const shape = rng(), morphology = shape < .22 ? 'stubby' : shape < .53 ? 'thin' : 'mushroom';
      const length = (.48 + rng() * .51) * (branchIndex > 8 ? .81 : 1) * (morphology === 'stubby' ? .51 : morphology === 'thin' ? 1.13 : 1);
      const width = (.145 + rng() * .105) * (branchIndex > 8 ? .83 : 1) * (morphology === 'thin' ? .83 : 1);
      geometries.push(mushroomSpine(base, direction, tangent, length, width, rng() * Math.PI * 2, morphology));
      spineAnchors.push(base.clone().addScaledVector(direction, length * .83));
    }
  });
  const tissueGeometry = mergeGeometries(geometries);
  geometries.forEach(g => g.dispose());
  const tissueMaterial = organicMaterial({ window: true, opacity: .99 });
  const tissue = new THREE.Mesh(tissueGeometry, tissueMaterial);
  tissue.name = 'Soma, bifurcaciones y espinas'; tissue.renderOrder = 3;
  root.add(tissue);

  // A small translucent somatic window reveals a lobulated nucleus. All of it
  // is real nested geometry, so the volume holds together during orbiting.
  const nuclearGeometry = new THREE.SphereGeometry(1,64,44), p = nuclearGeometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const r = 1 + .045 * Math.sin(x * 5 + y * 4) * Math.cos(z * 5 - y * 2) + .018 * Math.sin(y * 12 + x * 3);
    p.setXYZ(i,x*r,y*r,z*r);
  }
  nuclearGeometry.computeVertexNormals();
  const nuclearMaterial = organicMaterial({ nucleus: true, color: 0x795776, roughness: .52, clearcoat: .08, transparent: true, opacity: .79, depthWrite: false });
  const nucleus = new THREE.Mesh(nuclearGeometry, nuclearMaterial);
  nucleus.position.set(-9.05,-3.1,-1.02); nucleus.scale.set(1.21,1.34,1.13); nucleus.rotation.set(.17,-.24,.13); nucleus.renderOrder = 1;
  root.add(nucleus);
  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(.41,32,24), organicMaterial({ nucleus: true, color: 0x695173, roughness: .58 }));
  nucleolus.position.set(-8.77,-3.27,-.24); nucleolus.scale.set(1,.87,.52); nucleolus.renderOrder = 2; root.add(nucleolus);
  const chromatin = new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,10), organicMaterial({ nucleus: true, color: 0x997797, roughness: .64 }), 46);
  const matrix = new THREE.Object3D();
  for (let i = 0; i < chromatin.count; i++) {
    const angle = i * 2.399963, y = 1 - (i / (chromatin.count - 1)) * 2, r = Math.sqrt(1 - y * y);
    const depth = .74 + rng() * .16;
    matrix.position.set(-9.05 + Math.cos(angle) * r * 1.14 * depth,-3.1 + y * 1.24 * depth,-1.02 + Math.sin(angle) * r * 1.05 * depth);
    matrix.scale.setScalar(.06 + rng() * .065); matrix.scale.y *= .66; matrix.scale.z *= .81; matrix.updateMatrix(); chromatin.setMatrixAt(i,matrix.matrix);
  }
  chromatin.renderOrder = 2; root.add(chromatin);

  const hotspots = [
    { id:'synapse', position:synapseOrigin.clone(), normal:point(0,1,.15).normalize() },
    { id:'mitochondria', position:point(-4.3,-1.12,.1), normal:point(0,1,.2).normalize() },
    { id:'signaling', position:point(-7.4,-2.0,.2), normal:point(0,.6,1).normalize() },
    { id:'microglia', position:point(-2.5,3.7,-.8), normal:point(-.2,0,1).normalize() },
    { id:'apoptosis', position:point(-8.9,-3.0,1), normal:point(0,0,1) },
  ];
  root.updateMatrixWorld(true);
  return {
    root, tissue, nucleus, soma, focus:point(-.2,.3,0), synapseOrigin, synapseScale,
    hotspots, spineAnchors, branches, materials:[tissueMaterial,nuclearMaterial,nucleolus.material,chromatin.material],
    bounds:new THREE.Box3().setFromObject(root),
    cameraPoses:{ overview:{position:point(-3,8,55),target:point(-5,0,-1)}, hub:{position:point(1,7,22),target:point(-.5,.2,0)} },
  };
}
