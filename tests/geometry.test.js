import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { point, branch, fusedNeuronGeometry, mushroomSpine } from '../src/atlas/organic.js';

function assertFiniteGeometry(geometry) {
  assert.ok(geometry.attributes.position.count > 0, 'the surface must contain vertices');
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    assert.ok(attribute.array.every(Number.isFinite), `${name} contains a nonfinite value`);
  }
  assert.ok(geometry.index.count > 0, 'the surface must contain faces');
  for (const index of geometry.index.array) {
    assert.ok(index >= 0 && index < geometry.attributes.position.count, 'a face references a missing vertex');
  }
}

function connectedComponents(geometry) {
  const parents = Int32Array.from({ length: geometry.attributes.position.count }, (_, i) => i);
  function find(vertex) {
    while (parents[vertex] !== vertex) {
      parents[vertex] = parents[parents[vertex]];
      vertex = parents[vertex];
    }
    return vertex;
  }
  const indices = geometry.index.array;
  for (let i = 0; i < indices.length; i += 3) {
    parents[find(indices[i + 1])] = find(indices[i]);
    parents[find(indices[i + 2])] = find(indices[i]);
  }
  return new Set(Array.from(parents, (_, i) => find(i))).size;
}

test('spine faces and vertex normals point outwards in every morphology and orientation', () => {
  const base = point(1, 2, -3);
  for (const axis of [point(0, 1, 0), point(.3, .8, -.5).normalize()]) {
    for (const morphology of ['mushroom', 'thin', 'stubby']) {
      // Zero phase gives a straight axis. Its radial direction independently
      // establishes which side is outside, without duplicating index ordering.
      const geometry = mushroomSpine(base, axis, point(1, 0, 0), .8, .22, 0, morphology);
      assertFiniteGeometry(geometry);
      const position = geometry.attributes.position, normals = geometry.attributes.normal;
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      let testedFaces = 0;
      for (let i = 0; i < geometry.index.count; i += 3) {
        a.fromBufferAttribute(position, geometry.index.getX(i));
        b.fromBufferAttribute(position, geometry.index.getX(i + 1));
        c.fromBufferAttribute(position, geometry.index.getX(i + 2));
        const faceNormal = b.clone().sub(a).cross(c.clone().sub(a));
        // The common tip intentionally collapses the final ring into a pole.
        if (faceNormal.lengthSq() < 1e-18) continue;
        const radial = a.clone().add(b).add(c).multiplyScalar(1 / 3).sub(base);
        radial.addScaledVector(axis, -radial.dot(axis));
        assert.ok(faceNormal.dot(radial) > 0, `${morphology}: an inward face would make the head appear hollow`);
        testedFaces++;
      }
      assert.ok(testedFaces > 100, 'test the full surface, including the neck and head');
      for (let i = 0; i < position.count; i++) {
        const radial = a.fromBufferAttribute(position, i).sub(base);
        radial.addScaledVector(axis, -radial.dot(axis));
        if (radial.lengthSq() < 1e-12) continue;
        assert.ok(b.fromBufferAttribute(normals, i).dot(radial) > 0, `${morphology}: inward vertex normal`);
      }
      geometry.dispose();
    }
  }
});

test('bent spines retain finite positions, normals, colors and valid face indices', () => {
  for (const morphology of ['mushroom', 'thin', 'stubby']) {
    for (const phase of [Math.PI / 2, Math.PI, Math.PI * 1.7]) {
      const geometry = mushroomSpine(point(-2, .4, 1), point(.2, 1, -.3), point(1, .1, 0), .65, .16, phase, morphology);
      assertFiniteGeometry(geometry);
      geometry.dispose();
    }
  }
});

test('the soma, trunk and bifurcations form one connected finite membrane', () => {
  const soma = point(0, 0, 0);
  const branches = [
    branch([[0, 0, 0], [2.1, .1, 0], [4, .5, .2], [5.7, 1.6, .3]], [.85, .5, .23, .09]),
    branch([[2.1, .1, 0], [2.8, 1.8, -.2], [3.3, 3.3, -.5]], [.43, .24, .08]),
    branch([[0, 0, 0], [-1.5, -1.4, .1], [-3.1, -2.3, .6]], [.8, .42, .085]),
  ];
  const geometry = fusedNeuronGeometry(branches, soma);
  assertFiniteGeometry(geometry);
  assert.equal(connectedComponents(geometry), 1, 'bifurcations must join the soma without disconnected fragments');
  geometry.dispose();
});

test('subvoxel terminal radii remain continuous and reach the entire distal skeleton', () => {
  const soma = point(0, 0, 0);
  const dendrite = branch([[0, 0, 0], [2.5, 1.25, .37], [4.5, .72, .92], [6, 2.35, 1.5]], [.35, .018, .013, .007]);
  for (const spacing of [.1, .135]) {
    const geometry = fusedNeuronGeometry([dendrite], soma, spacing);
    assertFiniteGeometry(geometry);
    assert.equal(connectedComponents(geometry), 1, `terminal fragments at voxel spacing ${spacing}`);
    const vertex = new THREE.Vector3(), position = geometry.attributes.position;
    // Connectivity alone could pass if the entire thin branch disappeared.
    // Require membrane near every distal sample, including its final tip.
    for (let step = 9; step <= 20; step++) {
      const sample = dendrite.curve.getPoint(step / 20);
      let nearestSquared = Infinity;
      for (let i = 0; i < position.count; i++) {
        nearestSquared = Math.min(nearestSquared, vertex.fromBufferAttribute(position, i).distanceToSquared(sample));
      }
      assert.ok(nearestSquared < (spacing * 1.8) ** 2, `membrane missing at t=${step / 20}, spacing=${spacing}`);
    }
    geometry.dispose();
  }
});
