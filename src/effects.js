import * as THREE from '../vendor/three.module.js';
import { palettes } from './seasons.js';

export function createEffects(model, view, seasons) {
  const count = 140;
  const positions = new Float32Array(count * 3);
  const drift = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 1] = Math.random() * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    drift[i] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', attribute);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const context = canvas.getContext('2d');
  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, '#fff');
  glow.addColorStop(0.25, '#fffc');
  glow.addColorStop(1, '#fff0');
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  const material = new THREE.PointsMaterial({
    color: 0xffba64,
    size: 0.1,
    transparent: true,
    map: new THREE.CanvasTexture(canvas),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(geometry, material);
  particles.frustumCulled = false;
  view.scene.add(particles);
  let awake = false;
  let energy = 0;
  const crystal = model.materials.get('Crystal');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function setAwake(value) {
    awake = value;
  }
  function update(dt, elapsed) {
    const palette = palettes[seasons.current];
    material.color.set(palette.particle);
    energy += (Number(awake) - energy) * (1 - Math.exp(-dt * 3));
    crystal.emissiveIntensity = 0.65 + energy * 4;
    view.crystalLight.intensity = energy * 17;
    material.size = seasons.current === 'hiver' ? 0.13 : 0.1;
    material.opacity = 0.5 + energy * 0.45;
    model.root.position.y = reducedMotion.matches
      ? 0
      : Math.sin(elapsed * 0.7) * 0.07;
    if (reducedMotion.matches) return;
    for (let i = 0; i < count; i++) {
      const y = i * 3 + 1;
      positions[y] -= dt * palette.speed;
      if (positions[y] < -0.05) positions[y] = 7;
      positions[i * 3] += Math.sin(elapsed + drift[i]) * dt * 0.1;
    }
    attribute.needsUpdate = true;
  }
  return { update, setAwake };
}