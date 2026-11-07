// pages.spec.ts (flow 7): all six pages load clean, an unknown address gives the real 404, and nothing scrolls sideways at 320 and 375 px.
import { expect, test } from './support/fixtures';
import { PAGES } from './support/ui';

for (const { path, name, status } of PAGES) {
  test(`${name}: status ${status}, one h1, no console errors, no CSP violations, no failed requests, no broken images`, async ({ page, watch }) => {
    const response = await page.goto(path);
    expect(response?.status(), `status of ${path}`).toBe(status);
    await expect(page.locator('html')).toHaveAttribute('data-js', ''); // set by the inline guard; removed again if any script fails to load
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Walk down the page so every lazy image and chunk is requested, then let the network go quiet.
    await page.evaluate(async () => {
      const step = Math.max(200, innerHeight - 100);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    });
    await page.waitForLoadState('networkidle');

    // Only images that are drawn: a lazy image inside a hidden tab, or in the device frame the other breakpoint uses, is correctly never fetched.
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.getClientRects().length > 0 && (!img.complete || img.naturalWidth === 0)).map((img) => img.currentSrc || img.src),
    );
    expect(broken, 'images that did not load').toEqual([]);

    // The 404 page is itself a 404 response; everything else on it must load.
    const unexpected = watch.badResponses.filter((entry) => !(status === 404 && entry === `404 ${new URL(path, page.url()).href}`));
    expect(unexpected, 'responses with status 400 or more').toEqual([]);
    expect(watch.failedRequests, 'failed requests').toEqual([]);
    expect(watch.csp, 'CSP violations').toEqual([]);
    expect(watch.consoleErrors, 'console errors').toEqual([]);
    expect(watch.pageErrors, 'uncaught errors').toEqual([]);
    // Nothing leaves the site.
    const origin = new URL(page.url()).origin;
    expect(watch.requests.filter((r) => !r.split(' ')[1].startsWith(origin) && !r.split(' ')[1].startsWith('data:')), 'requests to other origins').toEqual([]);
  });
}

test('an unknown address returns the 404 page with status 404 and a way back', async ({ page }) => {
  for (const path of ['/no-such-page-e2e', '/no/such/deep/page', '/privacy.txt']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('main').getByRole('link', { name: /^Home/ })).toHaveAttribute('href', '/');
  }
});

test('a trailing slash is a 404, as it is on GitHub Pages', async ({ page }) => {
  // Only the status is asserted: astro preview answers "/x/" with its own bare 404, while Pages serves the site's 404.html. See docs/site/qa/e2e.md.
  for (const path of ['/gto-hand-review/', '/privacy/']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test('the static endpoints answer', async ({ request }) => {
  for (const path of ['/robots.txt', '/sitemap.xml', '/site.webmanifest', '/favicon.ico', '/icon.svg', '/apple-touch-icon.png', '/og/home.png']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/gto-hand-review', '/live-poker-hand-recorder', '/privacy', '/terms']) expect(sitemap, `sitemap lists ${path}`).toContain(path);
  expect(sitemap, 'the 404 page stays out of the sitemap').not.toMatch(/404/);
});

for (const width of [320, 375]) {
  for (const { path, name } of PAGES) {
    test(`no sideways scroll at ${width} px: ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-js', '');
      await page.evaluate(async () => {
        // The bottom of the page is where reveals, the footer and lazy images change the layout last.
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForLoadState('networkidle');

      const report = await page.evaluate(() => {
        const root = document.documentElement;
        const clientWidth = root.clientWidth;
        // Elements whose right edge is past the window and that no ancestor clips: the likely cause when something does overflow.
        const clipped = (el: Element) => {
          for (let node = el.parentElement; node; node = node.parentElement) {
            const { overflowX } = getComputedStyle(node);
            if (overflowX !== 'visible') return true;
          }
          return false;
        };
        const wide = [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > clientWidth + 0.5 && el.getBoundingClientRect().width > 0 && !clipped(el))
          .slice(0, 6)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(el.getBoundingClientRect().right)}`);
        const before = scrollX;
        window.scrollTo({ left: 200, behavior: 'instant' });
        const moved = scrollX - before;
        window.scrollTo({ left: 0, behavior: 'instant' });
        return { clientWidth, scrollWidth: root.scrollWidth, bodyScrollWidth: document.body.scrollWidth, moved, wide };
      });
      expect(report.scrollWidth, `document is ${report.scrollWidth}px wide in a ${report.clientWidth}px window. Overflowing: ${report.wide.join(' | ')}`).toBeLessThanOrEqual(report.clientWidth);
      expect(report.bodyScrollWidth, 'body width').toBeLessThanOrEqual(report.clientWidth);
      expect(report.moved, 'the page can be scrolled sideways').toBe(0);
    });
  }
}

test('the pop-ups do not scroll sideways at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-js', '');
  await expect(page.locator('.veil')).toBeHidden();
  for (const [trigger, id] of [['hero', 'dlg-sample'], ['pricing-pro', 'dlg-early']] as const) {
    const button = page.locator(`[data-cta="${trigger}"]`);
    await button.scrollIntoViewIfNeeded();
    await button.click();
    const dialog = page.locator(`#${id}`);
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(dialog).toHaveAttribute('data-module', 'ready');
    const widths = await dialog.evaluate((node) => {
      const parts = [node, ...node.querySelectorAll<HTMLElement>('.dialog__body, .dialog__pad, .dialog__panel')];
      return parts.map((part) => ({ name: part.className || part.tagName, scroll: part.scrollWidth, client: part.clientWidth }));
    });
    for (const part of widths) expect(part.scroll, `${id} ${part.name} is wider than its box`).toBeLessThanOrEqual(part.client);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});
