import { test, expect } from '@playwright/test';
import { PerspectiveCamera } from 'three';
import { createQuasar } from '../src/lib/voyage/quasar.js';

test('quasar ignites once and grows its jets from the core, then rearms on a return visit', () => {
  const quasar = createQuasar(true);
  const camera = new PerspectiveCamera();
  const jets = [];
  quasar.group.traverse((object) => {
    if (object.geometry?.type === 'CylinderGeometry') jets.push(object);
  });
  expect(jets).toHaveLength(4);
  const ember = quasar.update(10, camera, 0.5);
  expect(ember.flash).toBe(0);
  expect(jets.every((jet) => !jet.visible)).toBeTruthy();
  const burst = quasar.update(12.12, camera, 0.5);
  expect(burst.flash).toBeGreaterThan(0.5);
  quasar.update(13, camera, 0.5);
  const growing = jets[0].scale.y;
  expect(growing).toBeGreaterThan(0);
  expect(growing).toBeLessThan(1);
  quasar.update(13, camera, 0.5);
  expect(jets[0].scale.y).toBe(growing);
  const running = quasar.update(15, camera, 0.5);
  expect(running.flash).toBe(0);
  expect(jets.every((jet) => jet.visible && jet.scale.y === 1)).toBeTruthy();
  quasar.update(16, camera, -1);
  const returned = quasar.update(17, camera, 0.5);
  expect(returned.ignition).toBe(0);
  expect(jets.every((jet) => !jet.visible)).toBeTruthy();
  const reduced = quasar.update(17, camera, 0.5, true);
  expect(reduced.flash).toBe(0);
  expect(jets.every((jet) => jet.visible && jet.scale.y === 1)).toBeTruthy();
});

test('the quasar finishes igniting when scrolling stops and respects pause', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await page.evaluate(() => {
    const stack =
      document.getElementById('stack').getBoundingClientRect().top +
      scrollY -
      72;
    scrollTo({ top: stack, behavior: 'instant' });
  });
  const light = () =>
    page.evaluate(
      () =>
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--quasar-light',
          ),
        ) || 0,
    );
  await expect.poll(light).toBeGreaterThan(0);
  expect(await light()).toBeLessThan(0.5);
  await page.waitForTimeout(4800);
  expect(await light()).toBeGreaterThan(0.6);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect.poll(light).toBe(0);
  await page
    .getByRole('button', { name: 'Resume motion', exact: true })
    .click();
  await expect.poll(light).toBeGreaterThan(0.6);
  expect(errors).toEqual([]);
});
