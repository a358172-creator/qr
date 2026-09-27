/** Project accessible DOM controls onto world-space biological anchors. */
export function createAnnotations({
  hotspotLayer, labelLayer, camera, canvas, hotspots = [], anchors = [], onHotspot, onSelect,
}) {
  const abort = new AbortController();
  const visited = new Set();
  let width = 0, height = 0, enabled = true, disposed = false, lastState = null;
  const priorities = { nmda: 50, ampa: 49, mitochondria: 48, terminal: 47, spine: 46 };
  const listen = (el, event, callback) => el.addEventListener(event, callback, { signal: abort.signal });

  function button(layer, className, label) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.setAttribute('aria-label', label);
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.tabIndex = -1;
    layer.append(el);
    return el;
  }

  const hotspotNodes = hotspots.map((hotspot, index) => {
    const el = button(hotspotLayer, 'hotspot', `${hotspot.title}${hotspot.available ? '' : ' · Próximamente'}`);
    el.dataset.id = hotspot.id;
    el.dataset.available = String(Boolean(hotspot.available));
    el.classList.toggle('available', Boolean(hotspot.available));
    const dot = document.createElement('span');
    dot.className = 'hotspot-dot';
    dot.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span');
    title.className = 'hotspot-title';
    title.textContent = hotspot.title;
    const number = document.createElement('span');
    number.className = 'hotspot-index';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    el.append(dot, title, number);
    listen(el, 'click', () => onHotspot?.(hotspot.id));
    return { ...hotspot, el, dot, title, screen: hotspot.position.clone(), width: 0, height: 0, visible: false };
  });

  const labelNodes = anchors.map(anchor => {
    const el = button(labelLayer, 'anatomy-label', anchor.name);
    el.dataset.key = anchor.key;
    el.dataset.side = anchor.side || 'right';
    const text = document.createElement('span');
    text.textContent = anchor.name;
    el.append(text, document.createElement('i'));
    listen(el, 'click', () => onSelect?.(anchor.key));
    return { ...anchor, el, screen: anchor.position.clone(), width: 0, height: 0, visible: false };
  });
  const allNodes = [...hotspotNodes, ...labelNodes];

  function show(node, visible, x, y) {
    if (visible) node.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    if (visible === node.visible) return;
    node.visible = visible;
    node.el.style.visibility = visible ? 'visible' : 'hidden';
    node.el.style.opacity = visible ? '1' : '0';
    node.el.style.pointerEvents = visible ? 'auto' : 'none';
    node.el.tabIndex = visible ? 0 : -1;
    node.el.setAttribute('aria-hidden', String(!visible));
    if (!visible && document.activeElement === node.el) canvas.focus({ preventScroll: true });
  }

  // Called only on viewport or font changes, never from the animation frame.
  // Invisible elements retain layout boxes, avoiding display:none measurements.
  function resize(w, h) {
    if (disposed) return;
    width = Math.max(0, w);
    height = Math.max(0, h);
    for (const node of allNodes) {
      // Cache the canonical dot offset. A previous mirrored layout must not be
      // measured and then mirrored again after a viewport change.
      if (node.dot) node.el.classList.remove('flipped');
      node.width = node.el.offsetWidth || Math.max(54, (node.name || node.title?.textContent || '').length * 7 + 24);
      node.height = node.el.offsetHeight || 32;
      if (node.dot) {
        node.dotX = node.dot.offsetLeft + (node.dot.offsetWidth || 20) / 2;
        node.dotY = node.dot.offsetTop + (node.dot.offsetHeight || 20) / 2;
        node.el.classList.add('flipped');
        node.flippedDotX = node.dot.offsetLeft + (node.dot.offsetWidth || 20) / 2;
        node.el.classList.remove('flipped');
      }
    }
    if (lastState) update(lastState);
  }

  function projection(node) {
    node.screen.copy(node.position).project(camera);
    if (![node.screen.x, node.screen.y, node.screen.z].every(Number.isFinite)) return null;
    if (node.screen.z < -1 || node.screen.z > 1 || Math.abs(node.screen.x) > 1 || Math.abs(node.screen.y) > 1) return null;
    return { x: (node.screen.x + 1) * width / 2, y: (1 - node.screen.y) * height / 2 };
  }

  const overlaps = (a, b) => a.x < b.x + b.w + 10 && a.x + a.w + 10 > b.x && a.y < b.y + b.h + 8 && a.y + a.h + 8 > b.y;
  function fits(box, detail, occupied) {
    const mobile = width < 760;
    const bottom = detail ? 180 : 140;
    if (box.x < 12 || box.x + box.w > width - 12 || box.y < 100 || box.y + box.h > height - bottom) return false;
    if (!mobile && box.x < 260 && box.y < 350) return false;
    return !occupied.some(other => overlaps(box, other));
  }

  function update(state) {
    if (disposed) return;
    lastState = state;
    const { view, transitioning = false, selected = null, hovered = null, stress = 0, calcium = 0 } = state;
    const mobile = width < 760;
    const occupied = [];
    const ready = enabled && !transitioning && width > 0 && height > 0;
    const score = node => (document.activeElement === node.el ? 300 : 0)
      + (node.key === selected ? 200 : node.key === hovered ? 100 : 0)
      + (priorities[node.key] || node.priority || 0);

    for (const node of [...hotspotNodes].sort((a, b) => Number(b.available) - Number(a.available))) {
      const point = ready && view === 'hub' && (!mobile || node.available) ? projection(node) : null;
      if (!point) { show(node, false); continue; }
      const flipped = point.x + node.width - node.dotX > width - 18;
      node.el.classList.toggle('flipped', flipped);
      const box = { x: point.x - (flipped ? node.flippedDotX : node.dotX), y: point.y - node.dotY, w: node.width, h: node.height };
      const visible = fits(box, false, occupied);
      if (visible) occupied.push(box);
      show(node, visible, box.x, box.y);
    }

    let labelCount = 0;
    for (const node of [...labelNodes].sort((a, b) => score(b) - score(a))) {
      const emphasized = selected === node.key || hovered === node.key || document.activeElement === node.el;
      node.el.classList.toggle('selected', selected === node.key);
      node.el.classList.toggle('hovered', hovered === node.key);
      const relevant = node.key !== 'caspases' && (node.key !== 'ros' || stress >= .15 || emphasized)
        && (node.key !== 'calcium' || calcium >= .05 || emphasized);
      const point = ready && view === 'synapse' && relevant && (!mobile || labelCount < 3) ? projection(node) : null;
      if (!point) { show(node, false); continue; }
      const side = node.side || 'right';
      const box = {
        x: point.x + (side === 'left' ? -node.width - 20 : 20),
        y: point.y - node.height / 2,
        w: node.width,
        h: node.height,
      };
      const visible = fits(box, true, occupied);
      if (visible) { occupied.push(box); labelCount += 1; }
      show(node, visible, box.x, box.y);
    }
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    if (lastState) update(lastState);
  }

  function setVisited(id) {
    visited.add(id);
    for (const node of hotspotNodes) {
      node.el.classList.toggle('visited', visited.has(node.id));
      node.el.dataset.visited = String(visited.has(node.id));
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    abort.abort();
    allNodes.forEach(node => node.el.remove());
  }

  return { update, resize, setEnabled, setVisited, dispose };
}
