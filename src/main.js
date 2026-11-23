import { createScene } from './scene.js';
import { loadModel } from './model.js';
import { createSeasons } from './seasons.js';
import { createEffects } from './effects.js';
import { connectShrine } from './interaction.js';
import { connectInterface } from './interface.js';

const view = createScene();
const model = await loadModel(view.scene);
const seasons = createSeasons(model, view);
const effects = createEffects(model, view, seasons);
const ui = connectInterface(view, seasons, effects);
connectShrine(view, model, ui.toggleAwake);
view.start((dt, elapsed) => {
  seasons.update(dt);
  effects.update(dt, elapsed);
});
document.getElementById('status').hidden = true;
document.querySelectorAll('button').forEach((button) => {
  button.disabled = false;
});