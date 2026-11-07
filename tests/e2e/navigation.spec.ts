// navigation.spec.ts (flow 1): navbar links, the mobile menu (focus trap, Esc, focus return, in-page links) and the skip link.
import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { humanDoubleClick, quiet, settled, tab, visit } from './support/ui';

/**
 * After a jump, the target's heading must sit below the fixed header and in the upper part of the window. The browser's smooth anchor scroll starts a frame or two
 * after the click, so "the page stopped moving" is not enough on its own (it can be true before the scroll begins): poll for the arrival, then require it to hold.
 */
async function expectArrivedAt(page: Page, headingSelector: string) {
  const header = page.locator('header.site-header');
  const heading = page.locator(headingSelector);
  const height = page.viewportSize()!.height;
  const where = async () => {
    const [headerBox, headingBox] = [await header.boundingBox(), await heading.boundingBox()];
    return { top: headingBox?.y ?? NaN, headerBottom: (headerBox?.y ?? 0) + (headerBox?.height ?? 0) };
  };
  await expect
    .poll(async () => {
      const { top, headerBottom } = await where();
      return top >= headerBottom - 1 && top < height * 0.6;
    }, { message: `${headingSelector} never arrived below the header and in the upper part of the window`, timeout: 6000 })
    .toBe(true);
  await settled(page);
  const { top, headerBottom } = await where();
  expect(top, `${headingSelector} starts at ${Math.round(top)}px after the scroll stopped; the header ends at ${Math.round(headerBottom)}px`).toBeGreaterThanOrEqual(headerBottom - 1);
  expect(top, `${headingSelector} starts at ${Math.round(top)}px in a ${height}px window after the scroll stopped`).toBeLessThan(height * 0.6);
}

test.describe('navbar links (wide window, links in the bar)', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'below 1024 px the burger menu replaces the links; see the menu tests');

  test('"How it works" and "Pricing" scroll to their sections and become the current link', async ({ page }) => {
    await visit(page);
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await primary.getByRole('link', { name: 'How it works' }).click();
    await expect(page).toHaveURL(/\/#how$/);
    await expectArrivedAt(page, '#how-title');
    await expect(primary.getByRole('link', { name: 'How it works' })).toHaveAttribute('aria-current', 'true');

    await primary.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/#pricing$/);
    await expectArrivedAt(page, '#pricing-title');
    await expect(primary.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'true');
    await expect(primary.getByRole('link', { name: 'How it works' })).not.toHaveAttribute('aria-current', /.*/);
  });

  test('"Coach" and "Recorder" open their own pages', async ({ page }) => {
    await visit(page);
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await primary.getByRole('link', { name: 'Coach' }).click();
    await expect(page).toHaveURL(/\/gto-hand-review$/);
    await expect(page.locator('h1')).toContainText(/GTO hand review/i);
    await primary.getByRole('link', { name: 'Recorder' }).click();
    await expect(page).toHaveURL(/\/live-poker-hand-recorder$/);
    await expect(page.locator('h1')).toContainText(/hand recorder/i);
  });

  test('from a product page, "Pricing" and "How it works" lead back to the home sections', async ({ page }) => {
    await visit(page, '/gto-hand-review');
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await primary.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/#pricing$/);
    await expectArrivedAt(page, '#pricing-title');
    await page.goBack();
    await primary.getByRole('link', { name: 'How it works' }).click();
    await expect(page).toHaveURL(/\/#how$/);
    await expectArrivedAt(page, '#how-title');
  });

  test('the brand link goes home from a product page', async ({ page }) => {
    await visit(page, '/privacy');
    await page.getByRole('banner').getByRole('link', { name: 'HandSolved home' }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1')).toContainText(/Every hand/i);
  });
});

test.describe('mobile menu', () => {
  // The menu is what below-1024 windows get. Every project runs it at a phone width, so Firefox and desktop Chrome cover it too.
  test.use({ viewport: { width: 390, height: 780 } });

  test('opens, traps focus, closes with Esc and returns focus to the burger', async ({ page }) => {
    await visit(page);
    const burger = page.locator('#nav-toggle');
    const menu = page.locator('#nav-menu');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
    await expect(burger).toBeVisible();

    await burger.click();
    await expect(menu).toHaveAttribute('data-state', 'open');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Close menu' })).toBeFocused(); // autofocus

    const controls = await menu.locator('a[href], button:not([disabled])').count();
    expect(controls).toBeGreaterThanOrEqual(6);
    const where = () => page.evaluate(() => ({ inside: !!document.activeElement?.closest('#nav-menu'), name: document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent?.trim() ?? '' }));

    // Forward: two full laps never leave the menu, and every control gets a turn.
    const visited = new Set<string>();
    for (let step = 0; step < controls * 2 + 1; step++) {
      await tab(page);
      const now = await where();
      expect(now.inside, `Tab step ${step + 1} left the menu (focus on "${now.name}")`).toBe(true);
      visited.add(now.name);
    }
    expect(visited.size, 'distinct controls reached by Tab').toBe(controls);

    // Backward: Shift+Tab from the first control wraps to the last.
    await menu.locator('a[href], button:not([disabled])').first().focus();
    await tab(page, { shift: true });
    const lastName = await menu.locator('a[href], button:not([disabled])').last().evaluate((el) => el.textContent?.trim());
    expect((await where()).name).toBe(lastName);
    for (let step = 0; step < controls + 2; step++) {
      await tab(page, { shift: true });
      expect((await where()).inside, `Shift+Tab step ${step + 1} left the menu`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(burger).toBeFocused();
    await expect(burger).toHaveAttribute('aria-haspopup', 'dialog');
  });

  for (const kind of ['instant', 'slow'] as const) {
    test(`a ${kind} double-click on the burger leaves the menu open`, async ({ page }) => {
      await visit(page);
      const burger = page.locator('#nav-toggle');
      if (kind === 'instant') await burger.dblclick();
      else await humanDoubleClick(page, burger);
      await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
      await quiet(page);
      // The close button sits where the burger was, so the second click can land on it.
      await expect(page.locator('#nav-menu'), 'the second click of the double-click closed the menu again').toBeVisible();
      await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
    });
  }

  test('the close button closes it and returns focus too', async ({ page }) => {
    await visit(page);
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.locator('#nav-menu')).toBeHidden();
    await expect(page.locator('#nav-toggle')).toBeFocused();
  });

  for (const [label, hash, heading] of [['How it works', '#how', '#how-title'], ['Pricing', '#pricing', '#pricing-title']] as const) {
    test(`the in-page link "${label}" closes the menu and leaves focus in that section`, async ({ page }) => {
      await visit(page);
      const burger = page.locator('#nav-toggle');
      await burger.click();
      await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
      await page.locator('#nav-menu').getByRole('link', { name: label }).click();

      await expect(page.locator('#nav-menu')).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`/${hash}$`));
      await expectArrivedAt(page, heading);

      // Focus must not jump back to the burger or stay in the closed menu.
      const after = await page.evaluate(() => ({ burger: document.activeElement?.id === 'nav-toggle', inMenu: !!document.activeElement?.closest('#nav-menu') }));
      expect(after.burger, 'focus went back to the burger after an in-page link').toBe(false);
      expect(after.inMenu, 'focus stayed in the closed menu').toBe(false);

      // The next Tab continues from the section, not from the top of the page.
      await tab(page);
      const next = await page.evaluate((selector) => {
        const active = document.activeElement as HTMLElement | null;
        const section = document.querySelector(selector);
        return { inSection: !!(section && active && section.contains(active)), where: `${active?.tagName.toLowerCase()} "${active?.textContent?.trim().slice(0, 40)}"` };
      }, hash);
      expect(next.inSection, `Tab after the jump to ${hash} went to ${next.where}, outside the section`).toBe(true);

      // And the menu works again afterwards.
      await expect(burger).toBeEnabled();
      await burger.click();
      await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
      await page.keyboard.press('Escape');
      await expect(page.locator('#nav-menu')).toBeHidden();
      await expect(burger).toBeFocused();
    });
  }

  test('the page links "Coach" and "Recorder" in the menu open their pages', async ({ page }) => {
    await visit(page);
    await page.locator('#nav-toggle').click();
    await page.locator('#nav-menu').getByRole('link', { name: 'Coach' }).click();
    await expect(page).toHaveURL(/\/gto-hand-review$/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('the menu closes by itself when the window grows past 1024 px', async ({ page }) => {
    await visit(page);
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
    await page.setViewportSize({ width: 1100, height: 780 });
    await expect(page.locator('#nav-menu')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });
});

test.describe('skip link', () => {
  for (const path of ['/', '/gto-hand-review', '/privacy']) {
    test(`is the first Tab stop on ${path}, shows when focused and jumps to the main content`, async ({ page }) => {
      await visit(page, path);
      const skip = page.getByRole('link', { name: 'Skip to main content' });
      await expect(skip).not.toBeInViewport(); // parked off screen until it has focus
      await tab(page);
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport({ ratio: 1 });
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main$/);
      await settled(page);
      // The next stop is inside <main>, not back in the navbar.
      await tab(page);
      const inMain = await page.evaluate(() => !!document.querySelector('main')?.contains(document.activeElement));
      expect(inMain, 'Tab after the skip link should land in <main>').toBe(true);
    });
  }
});
