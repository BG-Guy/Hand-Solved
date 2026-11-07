// footer.spec.ts (flow 6): the reveal footer. At the end of the page every footer link is visible, clickable and focusable, and the concept note shows.
// The page is the sheet and the footer waits under it, so each check runs where a visitor meets it: after real scrolling to the end, and after tabbing in.
//
// Two layouts, one rule. On a wide window the footer fits the screen, so at the end of the page ALL of it is on screen at once and every link must be usable there.
// On a phone the footer is in the flow and taller than the screen (about 1170 px against 730), so at the end the top rows of links are above the window, under the
// fixed header, and a visitor reaches them by scrolling up. There the rule is: the bottom of the footer is usable at the end, and every other link is usable once
// scrolled to (or focused), with nothing fixed on top of it.
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { tab, visit, whyNotReachable, wheelToEnd } from './support/ui';

const FOOTER_PAGES = ['/', '/gto-hand-review', '/live-poker-hand-recorder', '/privacy'];

const footer = (page: Page) => page.locator('footer.site-footer');
const footerLinks = (page: Page) => footer(page).getByRole('navigation', { name: 'Footer' }).getByRole('link');

/** Visible, reachable, would take a click, takes focus, and still reachable with focus on it. */
async function expectUsable(page: Page, link: Locator, name: string) {
  await expect(link, `footer link "${name}"`).toBeVisible();
  expect(await whyNotReachable(link), `"${name}" is not usable where it stands`).toBe('');
  await link.click({ trial: true }); // Playwright's own check that a click would reach it
  await link.focus();
  await expect(link, `"${name}" takes focus`).toBeFocused();
  await expect.poll(() => whyNotReachable(link), { message: `"${name}" after taking focus` }).toBe('');
  void page;
}

for (const path of FOOTER_PAGES) {
  test(`at the end of ${path} every footer link is usable and the concept note shows`, async ({ page }, testInfo) => {
    await visit(page, path);
    await wheelToEnd(page);

    const links = footerLinks(page);
    const count = await links.count();
    expect(count, 'footer links').toBeGreaterThanOrEqual(9);

    // The footer has two modes (SiteFooter.ts): under the sheet and revealed by scrolling ("sticky"), or plain in the flow ("flow": phones, reduced motion, or a footer
    // taller than the window). In sticky mode all of it is on screen at the end. In flow mode it is as tall as it is, and is read by scrolling.
    const flow = await page.locator('[data-reveal-footer]').evaluate((el) => el.classList.contains('reveal-footer--flow'));
    const fitsOnScreen = !flow;
    const footerHeight = (await footer(page).boundingBox())!.height;
    testInfo.annotations.push({ type: 'footer', description: `${flow ? 'flow mode' : 'sticky reveal mode'}, ${Math.round(footerHeight)}px tall in a ${page.viewportSize()!.height}px window` });

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const name = ((await link.textContent()) ?? '').trim();
      if (!fitsOnScreen) {
        // Tall footer: bring this link to the middle of the window the way scrolling does, then it must be usable.
        await link.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      }
      await expectUsable(page, link, name);
    }

    // Whatever the layout, the end of the page itself shows the bottom of the footer in full.
    await wheelToEnd(page);
    const note = footer(page).locator('.concept-note');
    await expect(note).toBeVisible();
    await expect(note).toContainText('nothing is collected or sent');
    expect(await whyNotReachable(note), 'the concept note is clipped or covered at the end of the page').toBe('');
    await expect(footer(page).getByText('© 2026 HandSolved')).toBeVisible();
    const legal = footerLinks(page).filter({ hasText: /^(Privacy|Terms)$/ });
    expect(await legal.count(), 'legal links').toBe(2);
    for (let i = 0; i < 2; i++) expect(await whyNotReachable(legal.nth(i)), `legal link ${i + 1} at the end of the page`).toBe('');
    expect(await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2), 'still at the end of the page').toBe(true);
  });
}

test('the closing band (home) is usable: its button and link', async ({ page }) => {
  await visit(page);
  await wheelToEnd(page);
  const band = page.locator('#start');
  await band.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(band.getByRole('heading')).toBeVisible();
  for (const target of [band.getByRole('button', { name: 'Grade a sample hand' }), band.getByRole('link', { name: /concept pricing/i })]) {
    await expect(target).toBeVisible();
    await expect.poll(() => whyNotReachable(target), { message: 'closing band control', timeout: 6000 }).toBe('');
    await target.click({ trial: true });
  }
});

test('a footer link follows its href and lands on the right section or page', async ({ page }) => {
  await visit(page);
  await wheelToEnd(page);
  await footerLinks(page).filter({ hasText: /^Privacy$/ }).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await footerLinks(page).filter({ hasText: /^Privacy$/ }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('h1')).toHaveText('Privacy');
  await wheelToEnd(page);
  await footerLinks(page).filter({ hasText: /^FAQ$/ }).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await footerLinks(page).filter({ hasText: /^FAQ$/ }).click();
  await expect(page).toHaveURL(/\/#faq$/);
  await expect(page.locator('#faq-title')).toBeInViewport();
});

test('tabbing into the footer from the top of a tall page brings each link into view and nothing covers it', async ({ page }) => {
  await visit(page);
  const links = footerLinks(page);
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const link = links.nth(i);
    const name = ((await link.textContent()) ?? '').trim();
    // Focus from the top of the page, where the sheet still covers the footer. SiteFooter.ts must scroll it clear.
    await link.focus();
    await expect(link).toBeFocused();
    await expect.poll(() => whyNotReachable(link), { message: `focused footer link "${name}" is hidden or covered after focus from the top`, timeout: 6000 }).toBe('');
  }
});

test('the keyboard walks into the footer in order and every stop is in view', async ({ page }) => {
  await visit(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const first = footerLinks(page).first();
  await first.focus();
  const names: string[] = [];
  for (let step = 0; step < 9; step++) {
    const active = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return { inFooter: !!el?.closest('footer.site-footer nav'), name: el?.textContent?.trim() ?? '' };
    });
    expect(active.inFooter, `stop ${step + 1} ("${active.name}") is outside the footer links`).toBe(true);
    names.push(active.name);
    await expect.poll(() => whyNotReachable(page.locator(':focus')), { message: `stop ${step + 1} ("${active.name}")`, timeout: 6000 }).toBe('');
    await tab(page);
  }
  expect(new Set(names).size, `walked: ${names.join(' > ')}`).toBe(9);
});
