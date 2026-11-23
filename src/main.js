import { createScene } from './scene.js';
import { loadModel } from './model.js';
import { createSeasons } from './seasons.js';
import { createEffects } from './effects.js';
import { connectShrine } from './interaction.js';

const view = createScene();
const model = await loadModel(view.scene);
const seasons = createSeasons(model, view);
const effects = createEffects(model, view, seasons);
view.start((dt, elapsed) => {
  seasons.update(dt);
  effects.update(dt, elapsed);
});
document.getElementById('status').hidden = true;
for (const button of document.querySelectorAll('.seasons button')) {
  button.disabled = false;
  button.addEventListener('click', () => {
    const name = button.dataset.season;
    seasons.change(name);
    document.body.dataset.season = name;
    document.querySelectorAll('.seasons button').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
}
const wakeButton = document.getElementById('wake');
wakeButton.disabled = false;
let awake = false;
function toggleAwake() {
  awake = !awake;
  effects.setAwake(awake);
  wakeButton.setAttribute('aria-pressed', String(awake));
  wakeButton.textContent = awake ? 'Endormir l’arbre' : 'Éveiller l’arbre';
  document.getElementById('story').hidden = !awake;
}
wakeButton.addEventListener('click', toggleAwake);
connectShrine(view, model, toggleAwake);