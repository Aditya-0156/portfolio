import { test, expect } from '@playwright/test';

test('anchor navigation lands below the header with text already readable', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'See projects', exact: true }).click();
  await expect(page.locator('#projects')).toBeFocused();
  await expect
    .poll(() =>
      page
        .locator('#projects')
        .evaluate((section) => Math.round(section.getBoundingClientRect().top)),
    )
    .toBe(72);
  const hidden = await page.locator('#projects [data-reveal=""]').evaluateAll(
    (elements) =>
      elements.filter((element) => {
        const style = getComputedStyle(element);
        return style.visibility === 'hidden' || Number(style.opacity) < 0.99;
      }).length,
  );
  expect(hidden).toBe(0);
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
});

test('opening the light gate cancels scroll momentum and closing it restores scrolling', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(60);
  await page
    .getByRole('button', { name: 'Switch to light theme' })
    .dispatchEvent('click');
  await expect(page.getByRole('dialog')).toBeVisible();
  const stopped = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(stopped);
  await page.keyboard.press('Escape');
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(stopped + 100);
});

test('reduced-motion anchor navigation is immediate and uses the same header spacing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('link', { name: 'See projects', exact: true }).click();
  expect(
    await page
      .locator('#projects')
      .evaluate((section) => Math.round(section.getBoundingClientRect().top)),
  ).toBe(72);
  await expect(page.locator('#projects')).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
});
