import { Raycaster, Vector2 } from '../vendor/three.module.js';

export function connectShrine(view, model, onSelect) {
  const canvas = view.renderer.domElement;
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let down = null;
  function isShrine(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, view.camera);
    const hits = raycaster.intersectObject(model.root, true);
    const hit = hits.find(({ object }) => {
      for (let parent = object; parent; parent = parent.parent) {
        if (!parent.visible) return false;
      }
      return true;
    });
    let object = hit?.object;
    while (object) {
      if (object.name === 'Shrine' || object.name === 'Crystals')
        return true;
      object = object.parent;
    }
    return false;
  }
  canvas.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    down = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!down || down.id !== event.pointerId) return;
    const distance = Math.hypot(
      event.clientX - down.x,
      event.clientY - down.y,
    );
    down = null;
    if (distance < 6 && isShrine(event)) onSelect();
  });
  canvas.addEventListener('pointercancel', () => {
    down = null;
  });
  canvas.addEventListener('pointermove', (event) => {
    if (event.buttons) return;
    canvas.style.cursor = isShrine(event) ? 'pointer' : 'grab';
  });
}