import * as THREE from 'three';

export function createInteractionManager(canvas, camera, { objects, enabled, onSelect, onHover }) {
  const ray = new THREE.Raycaster(), pointer = new THREE.Vector2(), abort = new AbortController();
  let down = null, moved = false, lastHover = 0;
  const on = (name, callback) => canvas.addEventListener(name, callback, { signal: abort.signal });
  const hit = event => {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    ray.setFromCamera(pointer, camera);
    for (const item of ray.intersectObjects(objects(), true)) {
      let object = item.object, key = null, visible = true;
      while (object) { if (!object.visible) visible = false; key ||= object.userData.key; object = object.parent; }
      if (visible && key) return key;
    }
    return null;
  };
  on('pointerdown', event => { down = { x: event.clientX, y: event.clientY }; moved = false; });
  on('pointermove', event => {
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) moved = true;
    if (!enabled() || event.buttons || event.timeStamp - lastHover < 70) return;
    lastHover = event.timeStamp;
    const key = hit(event); canvas.style.cursor = key ? 'pointer' : 'grab'; onHover?.(key);
  });
  on('pointerup', event => {
    if (enabled() && down && !moved) onSelect(hit(event));
    down = null;
  });
  on('pointercancel', () => { down = null; });
  on('pointerleave', () => onHover?.(null));
  return { dispose() { abort.abort(); } };
}
