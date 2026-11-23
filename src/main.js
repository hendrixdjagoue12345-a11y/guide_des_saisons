import { createScene } from './scene.js';
import * as THREE from '../vendor/three.module.js';

const view = createScene();
const temoin = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0xffbc71 }),
);
temoin.position.y = 1;
view.scene.add(temoin);
view.start((dt, elapsed) => {
});
document.getElementById('status').hidden = true;