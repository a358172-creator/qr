import * as THREE from 'three';

// One camera moves through a shared coordinate system at every scale.
export function createCameraController(camera, controls, reducedMotion) {
  let transition = null;
  const clearMomentum = () => {
    const position = camera.position.clone(), target = controls.target.clone();
    const damping = controls.enableDamping;
    const minDistance = controls.minDistance, maxDistance = controls.maxDistance;
    controls.enableDamping = false;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    controls.update();
    camera.position.copy(position);
    controls.target.copy(target);
    controls.update();
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.enableDamping = damping;
  };
  return {
    move(position, target, { duration = 2.8, onComplete } = {}) {
      clearMomentum();
      controls.enabled = false;
      transition = {
        from: camera.position.clone(), to: position.clone(),
        fromTarget: controls.target.clone(), toTarget: target.clone(),
        elapsed: 0, duration: reducedMotion() ? 0 : duration, onComplete,
      };
      if (!transition.duration) this.update(0);
    },
    update(dt) {
      if (!transition) return false;
      const current = transition;
      current.elapsed += dt;
      const fraction = current.duration ? Math.min(1, current.elapsed / current.duration) : 1;
      const t = fraction * fraction * fraction * (fraction * (fraction * 6 - 15) + 10);
      // Interpolate distance logarithmically so crossing scales feels continuous.
      const fromOffset = current.from.clone().sub(current.fromTarget);
      const toOffset = current.to.clone().sub(current.toTarget);
      const distance = Math.exp(THREE.MathUtils.lerp(Math.log(fromOffset.length()), Math.log(toOffset.length()), t));
      const direction = fromOffset.normalize().lerp(toOffset.normalize(), t).normalize();
      controls.target.lerpVectors(current.fromTarget, current.toTarget, t);
      camera.position.copy(controls.target).addScaledVector(direction, distance);
      if (fraction === 1) {
        transition = null;
        controls.enabled = true;
        current.onComplete?.();
      }
      return true;
    },
    cancel() { transition = null; controls.enabled = true; },
    get active() { return Boolean(transition); },
  };
}
