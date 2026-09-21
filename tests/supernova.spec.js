import { test, expect } from '@playwright/test';
import { PerspectiveCamera } from 'three';
import { createSupernova } from '../src/lib/voyage/supernova.js';

test('the star holds its size through heating and expands continuously into the blast', () => {
  const nova = createSupernova(true);
  const camera = new PerspectiveCamera();
  const [star, corona] = nova.group.children;
  const startPosition = nova.group.position.clone();
  let previousRadius = 0;
  let previousGlow = 0;
  for (let i = 0; i <= 376; i++) {
    nova.update(i / 1000, i / 60, camera);
    const radius = star.material.uniforms.uRadius.value;
    expect(radius).toBeGreaterThanOrEqual(previousRadius);
    expect(corona.scale.x).toBeGreaterThanOrEqual(previousGlow);
    expect(nova.group.position.equals(startPosition)).toBeTruthy();
    previousRadius = radius;
    previousGlow = corona.scale.x;
  }
  nova.update(0.36 - 0.000001, 10, camera);
  const before = star.material.uniforms.uRadius.value;
  nova.update(0.36 + 0.000001, 10, camera);
  expect(Math.abs(star.material.uniforms.uRadius.value - before)).toBeLessThan(0.1);
  nova.update(0.5, 10, camera);
  expect(star.visible).toBe(false);
  expect(nova.screenRadius(0.5)).toBeGreaterThan(nova.screenRadius(0.36));
  nova.update(0.2, 10, camera);
  expect(star.visible).toBe(true);
  expect(star.material.uniforms.uOpacity.value).toBe(1);
  const geometries = new Set();
  nova.group.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    object.material?.dispose();
  });
  geometries.forEach(geometry => geometry.dispose());
});
