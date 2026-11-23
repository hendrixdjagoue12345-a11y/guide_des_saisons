import { createScene } from './scene.js';
import { loadModel } from './model.js';
import { createSeasons } from './seasons.js';
import { createEffects } from './effects.js';
import { connectShrine } from './interaction.js';
import { connectInterface } from './interface.js';

const status = document.getElementById('status');
try {
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
  document.querySelectorAll('button').forEach((button) => {
    button.disabled = false;
  });
  status.hidden = true;
  document.body.dataset.state = 'ready';
  view.renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    status.hidden = false;
    status.textContent = 'La 3D a été interrompue. Rechargez la page.';
    document.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
    });
  });
} catch (error) {
  document.body.dataset.state = 'error';
  status.textContent =
    'La scène 3D ne peut pas démarrer. Vérifiez WebGL ' +
    'et les fichiers du projet, puis rechargez la page.';
  console.error(error);
}