import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { createSeasons, palettes } from '../src/seasons.js';

async function readModel(name) {
  const path = new URL('../assets/' + name, import.meta.url);
  const bytes = await readFile(path);
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
  return (await new GLTFLoader().parseAsync(buffer, '')).scene;
}

test('Les groupes et les matériaux attendus sont exportés', async () => {
  const root = await readModel('gardien.glb');
  for (const name of ['Island', 'Tree', 'Shrine', 'Crystals', 'Snow']) {
    assert.ok(root.getObjectByName(name), name);
  }
  const materials = new Map();
  root.traverse((object) => {
    if (object.isMesh) materials.set(object.material.name, object.material);
  });
  for (const name of ['Ground', 'Grass', 'Crystal', 'Leaf_0', 'Leaf_4']) {
    assert.ok(materials.has(name), name);
  }
  const model = { materials, snow: root.getObjectByName('Snow') };
  const view = {
    key: { color: new THREE.Color() },
    fill: { color: new THREE.Color() },
  };
  const seasons = createSeasons(model, view);
  for (const name of Object.keys(palettes)) {
    seasons.change(name);
    for (let i = 0; i < 180; i++) seasons.update(1 / 60);
    assert.equal(seasons.current, name);
    assert.equal(model.snow.visible, name === 'hiver');
    const expected = new THREE.Color(palettes[name].ground);
    const actual = model.materials.get('Ground').color;
    for (const component of ['r', 'g', 'b']) {
      assert.ok(Math.abs(actual[component] - expected[component]) < 0.001);
    }
  }
});

test('Les cinq éléments GLB séparés peuvent être chargés', async () => {
  for (const name of [
    'ile.glb',
    'arbre.glb',
    'sanctuaire.glb',
    'decors.glb',
    'feuille.glb',
  ]) {
    const root = await readModel(name);
    let meshes = 0;
    root.traverse((object) => {
      if (object.isMesh) meshes++;
    });
    assert.ok(meshes > 0, name);
  }
});