import { test, expect } from '@playwright/test';

const toggle = (page) =>
  page.getByRole('button', { name: 'Switch to light theme' });

test('light requests escalate through questions and search in the same tab without an arrow', async ({
  page,
}) => {
  const externalRequests = [];
  await page.route('https://www.google.com/search?*', async (route) => {
    externalRequests.push(route.request().url());
    await route.fulfill({
      contentType: 'text/html',
      body: '<title>Search intercepted</title>',
    });
  });
  await page.goto('./');
  await toggle(page).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(
    'Who is turning on the universe?',
  );
  await page
    .getByRole('button', { name: 'Yes. More light.', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(
    'Did you pack an atmosphere?',
  );
  await page
    .getByRole('button', { name: 'I still want a bright sky', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(
    'Want to take this up with physics?',
  );
  const finalButton = page.getByRole('button', {
    name: /^I want a second opinion/,
  });
  await expect(finalButton.locator('.glyph, svg')).toHaveCount(0);
  await expect(finalButton).not.toContainText('↗');
  await finalButton.click();
  await expect(page).toHaveTitle('Search intercepted');
  expect(externalRequests).toHaveLength(1);
  expect(new URL(externalRequests[0]).searchParams.get('q')).toBe(
    'why is space dark if the sun is so bright',
  );
  expect(page.context().pages()).toHaveLength(1);
});

test('gate fully covers the voyage, traps focus, cancels cleanly and resets its questions', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__gateStates = [];
    window.addEventListener('lightgate:change', (event) =>
      window.__gateStates.push(event.detail.open),
    );
  });
  await page.goto('./');
  await toggle(page).click();
  await expect(page.locator('html')).toHaveClass(/light-gate-open/);
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  await expect(page.locator('.gate')).toHaveCSS(
    'background-color',
    'rgb(5, 6, 10)',
  );
  await expect(page.locator('.gate')).toHaveCSS('opacity', '1');
  await expect(page.locator('.voyage')).toHaveCSS('visibility', 'hidden');
  await expect(
    page.getByRole('button', { name: 'Keep it cosmic' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('button', { name: 'Yes. More light.', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Keep it cosmic' }),
  ).toBeFocused();
  await page
    .getByRole('button', { name: 'Yes. More light.', exact: true })
    .click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(toggle(page)).toBeFocused();
  await expect(page.locator('#root')).not.toHaveAttribute('inert');
  await expect(page.locator('html')).not.toHaveClass(/light-gate-open/);
  await expect(page.locator('.voyage')).toHaveCSS('visibility', 'visible');
  expect(await page.evaluate(() => window.__gateStates)).toEqual([true, false]);
  await toggle(page).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName(
    'Who is turning on the universe?',
  );
  await page.getByRole('button', { name: 'Keep it cosmic' }).click();
  await expect(toggle(page)).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the light gate stays within a phone viewport and closes from its backdrop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await toggle(page).click();
  const panel = await page.getByRole('dialog').boundingBox();
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(390);
  expect(panel.y).toBeGreaterThanOrEqual(0);
  expect(panel.y + panel.height).toBeLessThanOrEqual(844);
  await page.locator('.gate').click({ position: { x: 4, y: 4 } });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(toggle(page)).toBeFocused();
});
