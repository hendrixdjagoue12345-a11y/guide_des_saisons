export function connectInterface(view, seasons, effects) {
  const getElement = (id) => document.getElementById(id);
  const buttons = [...document.querySelectorAll('.seasons button')];
  const wakeButton = getElement('wake');
  const rotateButton = getElement('rotate');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let awake = false;
  function changeSeason(name) {
    seasons.change(name);
    document.body.dataset.season = name;
    for (const button of buttons) {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.season === name),
      );
    }
  }
  function setAwake(value) {
    awake = value;
    effects.setAwake(awake);
    wakeButton.setAttribute('aria-pressed', String(awake));
    wakeButton.textContent = awake
      ? 'Endormir l’arbre'
      : 'Éveiller l’arbre';
    getElement('story').hidden = !awake;
  }
  function setRotation(value) {
    view.controls.autoRotate = value && !reducedMotion.matches;
    rotateButton.setAttribute(
      'aria-pressed',
      String(view.controls.autoRotate),
    );
  }
  for (const button of buttons) {
    button.addEventListener('click', () =>
      changeSeason(button.dataset.season),
    );
  }
  const toggleAwake = () => setAwake(!awake);
  wakeButton.addEventListener('click', toggleAwake);
  rotateButton.addEventListener('click', () =>
    setRotation(!view.controls.autoRotate),
  );
  reducedMotion.addEventListener('change', () => setRotation(false));
  getElement('reset').addEventListener('click', () => {
    changeSeason('automne');
    setAwake(false);
    setRotation(false);
    view.controls.reset();
  });
  changeSeason('automne');
  return { toggleAwake };
}