import * as THREE from '../vendor/three.module.js';
import { OrbitControls } from '../vendor/OrbitControls.js';

export function createScene() {
  const host = document.getElementById('world');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  host.replaceChildren(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
  camera.position.set(9.5, 7, 15.5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 12;
  controls.maxDistance = 29;
  controls.minPolarAngle = 0.45;
  controls.maxPolarAngle = 1.65;
  controls.autoRotateSpeed = 0.55;
  controls.update();
  const ambient = new THREE.HemisphereLight(0xc3d8ff, 0x392439, 2.4);
  const key = new THREE.DirectionalLight(0xffd1a0, 3.8);
  key.position.set(-4, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -6,
    right: 6,
    top: 9,
    bottom: -5,
    near: 0.1,
    far: 30,
  });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = 0.045;
  const fill = new THREE.DirectionalLight(0x8dafff, 2.2);
  fill.position.set(6, 4, -4);
  const crystalLight = new THREE.PointLight(0x64edff, 0, 5);
  crystalLight.position.set(2.05, 1, 1.15);
  scene.add(ambient, key, fill, crystalLight);

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    camera.aspect = width / height;
    camera.fov = width < 621 ? 62 : 42;
    camera.setViewOffset(
      width,
      height,
      width < 621 ? 0 : -width * 0.14,
      width < 621 ? height * 0.025 : 0,
      width,
      height,
    );
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', resize);
  resize();
  controls.saveState();
  let previous = 0;
  let elapsed = 0;
  function start(update) {
    renderer.setAnimationLoop((now) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      elapsed += dt;
      update(dt, elapsed);
      controls.update(dt);
      renderer.render(scene, camera);
    });
  }
  return {
    scene,
    camera,
    controls,
    renderer,
    key,
    fill,
    crystalLight,
    start,
  };
}