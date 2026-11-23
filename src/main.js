import { createScene } from './scene.js';
import { loadModel } from './model.js';

const view = createScene();
const model = await loadModel(view.scene);
view.start((dt, elapsed) => {
});
document.getElementById('status').hidden = true;