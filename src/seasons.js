import { Color } from '../vendor/three.module.js';

export const palettes = {
  printemps: {
    leaves: ['#ed9ec3', '#f5bfd2', '#ba79b2', '#e48cba', '#ffd2dd'],
    ground: '#8da953',
    grass: '#739248',
    key: '#ffe6ed',
    fill: '#a8c8ff',
    particle: '#ffd0e6',
    speed: 0.44,
  },
  ete: {
    leaves: ['#5c954c', '#88ae52', '#426c58', '#6a9c46', '#a3bd55'],
    ground: '#78a150',
    grass: '#508043',
    key: '#fff0c4',
    fill: '#8ecbdf',
    particle: '#e5fba5',
    speed: 0.16,
  },
  automne: {
    leaves: ['#f25d35', '#f6ad3c', '#853d70', '#d54639', '#efca55'],
    ground: '#a69c3d',
    grass: '#788847',
    key: '#ffd1a0',
    fill: '#9eb4ff',
    particle: '#ffba64',
    speed: 0.68,
  },
  hiver: {
    leaves: ['#9aa9bd', '#c0cddd', '#71869e', '#a2b7c9', '#d9e5ed'],
    ground: '#98a6ac',
    grass: '#6c8898',
    key: '#e0efff',
    fill: '#a3baff',
    particle: '#f1f9ff',
    speed: 0.37,
  },
};

export function createSeasons(model, view) {
  let current = 'automne';
  const targets = [];
  const bindings = [
    ...Array.from({ length: 5 }, (_, i) => ['Leaf_' + i, 'leaves', i]),
    ['Ground', 'ground'],
    ['Grass', 'grass'],
  ];
  function change(name) {
    if (!palettes[name]) return;
    current = name;
    targets.length = 0;
    const palette = palettes[name];
    for (const [material, property, index] of bindings) {
      const color =
        index === undefined ? palette[property] : palette[property][index];
      targets.push([model.materials.get(material).color, new Color(color)]);
    }
    targets.push([view.key.color, new Color(palette.key)]);
    targets.push([view.fill.color, new Color(palette.fill)]);
    model.snow.visible = name === 'hiver';
  }
  function update(dt) {
    const alpha = 1 - Math.exp(-dt * 4);
    for (const [color, target] of targets) color.lerp(target, alpha);
  }
  change(current);
  return {
    change,
    update,
    get current() {
      return current;
    },
  };
}