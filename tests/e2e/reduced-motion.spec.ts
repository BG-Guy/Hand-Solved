// reduced-motion.spec.ts (flow 8): with prefers-reduced-motion emulated, all content shows, the load veil is absent, and the dialogs still work.
import { expect, test } from './support/fixtures';
import { earlyDialog, expectClosed, expectOpen, sampleDialog, scanText, visit, whyNotReachable, wheelToEnd } from './support/ui';

test.use({ reducedMotion: 'reduce' });

for (const path of ['/', '/gto-hand-review', '/live-poker-hand-recorder']) {
  test(`${path}: every heading and paragraph is opaque on arrival, no reveal start poses, no veil, instant anchor scrolling`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-js', '');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'the emulation took effect').toBe(true);

    // The whole document, without scrolling: nothing waits for the visitor to arrive.
    const scan = await page.evaluate(scanText, { topLimit: 1, wholePage: true });
    expect(scan.checked, 'text blocks checked').toBeGreaterThan(30);
    expect(scan.offenders, 'blocks at or near opacity 0').toEqual([]);

    // The Showdown table loads its look as the visitor nears it, so it is checked on arrival: once loaded, every line of it is opaque at once.
    const table = page.locator('#showdown');
    if (await table.count()) {
      await table.scrollIntoViewIfNeeded();
      await expect(table).toHaveAttribute('data-ready', '');
      const arrived = await page.evaluate(scanText, { topLimit: 1, wholePage: true });
      expect(arrived.offenders, 'Showdown blocks at or near opacity 0 once loaded').toEqual([]);
    }

    const state = await page.evaluate(() => {
      const veil = document.querySelector('.veil');
      const animated = (selector: string) => document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.target?.matches?.(selector)).length;
      return {
        veilDisplay: veil ? getComputedStyle(veil).display : 'no veil on this page',
        veilAnimations: animated('.veil, .veil *'),
        revealIo: document.documentElement.classList.contains('reveal-io'),
        revealAnimations: animated('[data-reveal]'),
        smooth: getComputedStyle(document.documentElement).scrollBehavior,
        counterWheels: document.querySelectorAll('.count').length,
        hiddenByReveal: [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1' || getComputedStyle(el).transform !== 'none').length,
      };
    });
    expect(state.veilDisplay === 'none' || state.veilDisplay === 'no veil on this page', `veil display: ${state.veilDisplay}`).toBe(true);
    expect(state.veilAnimations, 'animations on the veil').toBe(0);
    expect(state.revealIo, 'the one-shot reveal fallback must not arm itself').toBe(false);
    expect(state.revealAnimations, 'scroll reveal animations running').toBe(0);
    expect(state.hiddenByReveal, '[data-reveal] blocks that are faded or moved').toBe(0);
    expect(state.smooth, 'anchor scrolling should be instant').toBe('auto');
    expect(state.counterWheels, 'rolling digit wheels').toBe(0);
  });
}

test('the load veil never shows on first visit to the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.veil')).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem('hs-veil')), 'the first visit is still remembered').toBe('1');
  // The hero is usable at once: nothing to wait out.
  await page.locator('button[data-cta="hero"]').click({ timeout: 2000 });
  await expectOpen(sampleDialog(page));
});

test('the sample hand works: open, answer, verdict, Deal next, close, focus back', async ({ page }) => {
  await visit(page);
  const hero = page.locator('button[data-cta="hero"]');
  await hero.click();
  await expectOpen(sampleDialog(page));
  await sampleDialog(page).locator('.hs-choice').first().click();
  await expect(sampleDialog(page).locator('#hs-vh')).toBeVisible();
  await expect(sampleDialog(page).locator('#hs-vh')).toBeFocused();
  await sampleDialog(page).locator('[data-act="next"]').click();
  await expect(sampleDialog(page).locator('.hs-count')).toHaveText('Hand 2 of 3');
  await page.keyboard.press('Escape');
  await expectClosed(sampleDialog(page));
  await expect(hero).toBeFocused();
});

test('early access works: error, then success with the concept note, and the value is cleared on close', async ({ page }) => {
  await visit(page);
  const button = page.locator('button[data-cta="pricing-pro"]');
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expectOpen(earlyDialog(page));
  await earlyDialog(page).locator('[data-submit]').click();
  await expect(earlyDialog(page).locator('#ea-msg')).toHaveText('Enter your email address.');
  await earlyDialog(page).locator('[data-input]').fill('calm@example.com');
  await earlyDialog(page).locator('[data-submit]').click();
  await expect(earlyDialog(page).locator('[data-done-h]')).toBeVisible();
  await expect(earlyDialog(page).locator('[data-view="done"]')).toContainText('nothing is collected or sent');
  await earlyDialog(page).getByRole('button', { name: 'Back to the site' }).click();
  await expectClosed(earlyDialog(page));
  await expect(earlyDialog(page).locator('[data-input]')).toHaveValue('');
  await expect(button).toBeFocused();
});

test('a double-click still leaves the pop-up open', async ({ page }) => {
  await visit(page);
  await page.locator('button[data-cta="hero"]').dblclick();
  await expectOpen(sampleDialog(page));
  await expect(sampleDialog(page)).toHaveAttribute('data-view', 'choose');
  await expect(sampleDialog(page)).toBeVisible();
});

test('the mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await visit(page);
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
  await page.locator('#nav-menu').getByRole('link', { name: 'Pricing' }).click();
  await expect(page.locator('#nav-menu')).toBeHidden();
  await expect(page).toHaveURL(/#pricing$/);
  await expect(page.locator('#pricing-title')).toBeInViewport();
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
  await page.keyboard.press('Escape');
  await expect(page.locator('#nav-menu')).toBeHidden();
  await expect(page.locator('#nav-toggle')).toBeFocused();
});

test('the footer is in flow, so every link is usable once scrolled to', async ({ page }) => {
  await visit(page);
  await wheelToEnd(page);
  await expect(page.locator('[data-reveal-footer]')).toHaveClass(/reveal-footer--flow/);
  const links = page.locator('footer.site-footer').getByRole('navigation', { name: 'Footer' }).getByRole('link');
  for (let i = 0; i < (await links.count()); i++) {
    // In flow mode the footer can be taller than the window, so a link is reached by scrolling to it, as a visitor does.
    await links.nth(i).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    expect(await whyNotReachable(links.nth(i)), `footer link ${i + 1}`).toBe('');
  }
});
