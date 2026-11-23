import { GLTFLoader } from '../vendor/GLTFLoader.js';

export async function loadModel(scene) {
  const gltf = await new GLTFLoader().loadAsync('./assets/gardien.glb');
  const root = gltf.scene;
  const materials = new Map();
  root.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const original = object.material;
    if (!materials.has(original.name)) {
      materials.set(original.name, original.clone());
    }
    object.material = materials.get(original.name);
  });
  const snow = root.getObjectByName('Snow');
  if (!snow) throw new Error('Le groupe Snow est absent du GLB.');
  snow.visible = false;
  scene.add(root);
  return { root, snow, materials };
}