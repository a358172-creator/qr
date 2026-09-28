import * as THREE from 'three';

// Adapt the existing synapse to the shared mechanism runtime without rebuilding
// the specimen: the hub and its detailed view keep the same meshes and scale.
export function createGlutamateEnvironment({ anatomy, particles }) {
  const transform = new THREE.Object3D(), cargoTransform = new THREE.Object3D();
  return {
    root: anatomy.root,
    selectable: [...anatomy.selectable, ...particles.selectable],
    labelAnchors: anatomy.labelAnchors,
    initialState: { glut: .12, activation: .04, ca: 0, stress: 0, damage: 0 },
    update({ time, state, stepIndex, selected, detail }) {
      particles.update(time, state, selected);
      particles.calcium.visible = detail && stepIndex >= 2;
      particles.sodium.visible = detail && stepIndex >= 1;
      anatomy.vesicleSeeds.forEach((seed, i) => {
        transform.position.copy(seed.position);
        transform.position.y += Math.sin(time * .55 + seed.phase) * .012;
        if (i < 5) transform.position.y -= .06 * (.5 + .5 * Math.sin(time * 1.2 + seed.phase)) * state.glut;
        transform.scale.setScalar(seed.radius); transform.updateMatrix();
        anatomy.vesicles.setMatrixAt(i, transform.matrix);
        for (let j = 0; j < 4; j++) {
          cargoTransform.position.set(
            transform.position.x + Math.sin(j * 2.4) * .05,
            transform.position.y + Math.cos(j * 1.5) * .04,
            transform.position.z + Math.cos(j * 2.4) * .05,
          );
          cargoTransform.updateMatrix(); anatomy.cargo.setMatrixAt(i * 4 + j, cargoTransform.matrix);
        }
      });
      anatomy.vesicles.instanceMatrix.needsUpdate = true;
      anatomy.cargo.instanceMatrix.needsUpdate = true;
      for (const receptor of anatomy.receptors) {
        const active = receptor.kind === 'ampa' ? stepIndex >= 1 : stepIndex >= 2;
        receptor.material.emissiveIntensity = .06 + (active ? state.activation * .15 : 0) + (selected === receptor.kind ? .13 : 0);
      }
      anatomy.mito.outerMat.emissiveIntensity = .05 + state.stress * .18;
      anatomy.mito.foldMat.emissiveIntensity = .07 + state.stress * .12;
      anatomy.caspases.visible = false;
    },
  };
}
