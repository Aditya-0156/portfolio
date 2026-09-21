import { test, expect } from '@playwright/test';

async function station(page, progress) {
  await page.evaluate((t) => {
    const ids = [
      'top',
      'now',
      'work',
      'projects',
      'research',
      'stack',
      'education',
      'contact',
    ];
    const max = document.documentElement.scrollHeight - innerHeight;
    const anchors = ids.map((id, i) =>
      i
        ? Math.min(
            max,
            document.getElementById(id).getBoundingClientRect().top +
              scrollY -
              72,
          )
        : 0,
    );
    const leg = Math.min(6, Math.floor(t * 7));
    scrollTo({
      top: anchors[leg] + (anchors[leg + 1] - anchors[leg]) * (t * 7 - leg),
      behavior: 'instant',
    });
  }, progress);
}

test('each supernova entry makes one smooth entrance and stays settled on return', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  const entries = page.locator('#work .entry');
  await expect(entries).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const samples = await entries.nth(i).evaluate(el => new Promise(resolve => {
      scrollTo({top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.6, behavior: 'instant'});
      const values = [];
      const start = performance.now();
      function frame() {
        values.push(Number(getComputedStyle(el).opacity));
        if (performance.now() - start < 1500) requestAnimationFrame(frame);
        else resolve(values);
      }
      frame();
    }));
    expect(samples[0]).toBe(0);
    expect(samples.some(value => value > 0 && value < 1)).toBeTruthy();
    expect(samples.at(-1)).toBe(1);
    for (let j = 1; j < samples.length; j++) expect(samples[j]).toBeGreaterThanOrEqual(samples[j - 1] - 0.001);
    await expect(entries.nth(i)).not.toHaveAttribute('data-nova-pending');
  }
  await station(page, 0);
  await station(page, 0.315);
  await page.waitForTimeout(300);
  await expect(page.locator('#work [data-nova-surface], #work [data-nova-pending]')).toHaveCount(0);
  for (const entry of await entries.all()) await expect(entry).toHaveCSS('opacity', '1');
});

test('gravity moves research blocks and pause restores their normal layout', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await station(page, 0.605);
  const text = page.locator('#research .research__p').first();
  await expect(text).toHaveAttribute('data-ripple', '');
  const first = await text.evaluate((el) => getComputedStyle(el).translate);
  await expect
    .poll(() => text.evaluate((el) => getComputedStyle(el).translate))
    .not.toBe(first);
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(
    page.locator('[data-ripple],[data-nova-surface],.is-forging'),
  ).toHaveCount(0);
  await expect(text).toHaveCSS('translate', 'none');
  await page
    .getByRole('button', { name: 'Resume motion', exact: true })
    .click();
  await expect(text).toHaveAttribute('data-ripple', '');
  await station(page, 1);
  await expect(page.locator('[data-ripple]')).toHaveCount(0);
});

test('light request suspends GPU work as well as hiding every luminous layer', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__draws = 0;
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      window.__draws++;
      return original.apply(this, args);
    };
  });
  await page.goto('./');
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(0);
  await station(page, 0.315);
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('.voyage-effects')).toHaveCSS(
    'visibility',
    'hidden',
  );
  await expect(
    page.locator('[data-nova-surface],.is-forging,[data-ripple]'),
  ).toHaveCount(0);
  const before = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.__draws)).toBe(before);
  await page.getByRole('button', { name: 'Keep it cosmic' }).click();
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(before);
});

test('mobile matter effects keep work readable and within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await station(page, 0.315);
  await expect(page.locator('#work .is-forging').first()).toBeAttached();
  await page.waitForTimeout(1700);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect(page.locator('#work [data-nova-surface]')).toHaveCount(0);
  await station(page, 0.61);
  await expect(page.locator('#research [data-ripple]').first()).toBeAttached();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test('a lost graphics context clears active content and foreground effects', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.voyage[data-ready]')).toBeVisible();
  await station(page, 0.315);
  await expect(
    page.locator('#work [data-nova-surface]').first(),
  ).toBeAttached();
  await page.evaluate(() =>
    document
      .querySelector('.voyage')
      .getContext('webgl2')
      .getExtension('WEBGL_lose_context')
      .loseContext(),
  );
  await expect(
    page.getByRole('status').filter({ hasText: 'The voyage is unavailable' }),
  ).toContainText('All portfolio content is available');
  await expect(
    page.locator('[data-nova-surface],.is-forging,[data-ripple]'),
  ).toHaveCount(0);
  await expect(page.locator('.voyage-front')).toHaveCSS('opacity', '0');
  expect(
    await page
      .locator('.voyage-ejecta')
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).opacity === '0'),
      ),
  ).toBeTruthy();
});
