import { test, expect } from '@playwright/test';

// Count actual WebGL draws, so pause/reduced-motion tests exercise the renderer,
// not just the state of a button. Nothing is added to the production application.
async function instrument(page) {
  await page.addInitScript(() => {
    window.__draws = 0;
    for (const Context of [
      window.WebGLRenderingContext,
      window.WebGL2RenderingContext,
    ]) {
      if (!Context) continue;
      for (const method of ['drawElements', 'drawArrays']) {
        const original = Context.prototype[method];
        Context.prototype[method] = function (...args) {
          window.__draws++;
          return original.apply(this, args);
        };
      }
    }
  });
}

const sections = [
  'top',
  'now',
  'work',
  'projects',
  'research',
  'stack',
  'education',
  'contact',
];
async function jump(page, id) {
  await page.evaluate((id) => {
    const top =
      id === 'top'
        ? 0
        : document.getElementById(id).getBoundingClientRect().top +
          scrollY -
          72;
    window.scrollTo({ top, behavior: 'instant' });
  }, id);
}

test('all eight chapters render without shader errors and preserve portfolio links', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await expect(page.locator('.voyage-hud, .voyage-caption')).toHaveCount(0);
  for (const id of sections) {
    await jump(page, id);
    await page.waitForTimeout(200);
    await expect(page.locator('main')).not.toHaveAttribute('inert');
  }
  await expect(page.locator('.footer__space-note')).toContainText('Subtle, I know.');
  await jump(page, 'top');
  const resume = page.locator('a[href$="Aditya_Yadav_Resume.pdf"]').first();
  expect(
    (await page.request.get(await resume.getAttribute('href'))).ok(),
  ).toBeTruthy();
  await expect(
    page.getByRole('heading', { name: 'Aditya Yadav', exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('pause stops GPU draws, scroll remains usable, and resume restarts rendering', async ({
  page,
}) => {
  await instrument(page);
  await page.goto('./');
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await page.waitForTimeout(700);
  const paused = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__draws)).toBe(paused);
  await jump(page, 'research');
  await expect(page.locator('#research')).toBeInViewport();
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(paused);
  await page
    .getByRole('button', { name: 'Resume motion', exact: true })
    .click();
  const resumed = await page.evaluate(() => window.__draws);
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(resumed);
});

test('reduced motion produces a still scene and no forge or ripple transforms', async ({
  page,
}) => {
  await instrument(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await page.waitForTimeout(1200);
  const frames = await page.evaluate(() => window.__draws);
  expect(frames).toBeGreaterThan(0);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__draws)).toBe(frames);
  await expect(
    page.getByRole('button', { name: 'Pause motion', exact: true }),
  ).toHaveCount(0);
  await jump(page, 'work');
  await expect(page.locator('#work')).toBeInViewport();
  await expect(page.locator('[data-forge], [data-ripple]')).toHaveCount(0);
});

test('mobile keeps the portfolio accessible throughout the journey without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  for (const id of sections) {
    await jump(page, id);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(page.locator('main')).not.toHaveAttribute('inert');
  }
  await expect(page.locator('.voyage-hud, .voyage-caption')).toHaveCount(0);
});

test('without WebGL the full portfolio remains accessible', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type.startsWith('webgl')) return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto('./');
  await expect(
    page.getByRole('status').filter({ hasText: 'The voyage is unavailable' }),
  ).toContainText('All portfolio content is available');
  await expect(
    page.getByRole('heading', { name: 'Aditya Yadav', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Pause motion', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('link', { name: 'See projects' }).click();
  await expect(
    page.getByRole('heading', { name: 'Projects', exact: true }),
  ).toBeVisible();
});

test('losing the GPU context leaves the portfolio readable', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await page.evaluate(() => {
    document
      .querySelector('.voyage')
      .getContext('webgl2')
      .getExtension('WEBGL_lose_context')
      .loseContext();
  });
  await expect(
    page.getByRole('status').filter({ hasText: 'The voyage is unavailable' }),
  ).toContainText('All portfolio content is available');
  await expect(page.locator('main')).not.toHaveAttribute('inert');
  await expect(
    page.getByRole('heading', { name: 'Aditya Yadav', exact: true }),
  ).toBeVisible();
});
