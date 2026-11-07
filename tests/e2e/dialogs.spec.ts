// dialogs.spec.ts (flow 2): every main button opens its pop-up, a double-click leaves the pop-up open (a fixed bug), Esc and the backdrop close, focus goes back.
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { earlyDialog, expectClosed, expectOpen, humanDoubleClick, quiet, reachClosing, sampleDialog, tab, visit } from './support/ui';

interface SampleButton {
  cta: string;
  /** Shown from this window width (px). */
  minWidth?: number;
  /** Shown up to this window width (px). */
  maxWidth?: number;
}

// The six buttons the brief names, plus the one inside the burger menu. Each is only drawn at the widths where the design shows it.
const SAMPLE_BUTTONS: SampleButton[] = [
  { cta: 'hero' },
  { cta: 'header', minWidth: 768 },
  { cta: 'story' },
  { cta: 'numbers' },
  { cta: 'closing' },
  { cta: 'mobile-bar', maxWidth: 767 },
  { cta: 'menu', maxWidth: 1023 },
];

/** Gets the button on screen and usable: the menu is opened for its own button, the mobile bar is waited for, the rest are scrolled to. */
async function reach(page: Page, cta: string): Promise<Locator> {
  if (cta === 'menu') {
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#nav-menu')).toHaveAttribute('data-state', 'open');
    return page.locator('#nav-menu button[data-cta="menu"]');
  }
  if (cta === 'mobile-bar') {
    // The bar waits until the hero button has left the screen. The section after the story is a place where it shows.
    await page.evaluate(() => document.querySelector('#highlights')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await expect(page.locator('[data-mobile-bar]')).toHaveAttribute('data-visible', '');
    return page.locator('[data-mobile-bar] button');
  }
  const button = page.locator(`button[data-cta="${cta}"]`).first();
  if (cta === 'closing') {
    await reachClosing(page, button);
  } else {
    await button.scrollIntoViewIfNeeded();
  }
  return button;
}

/** Counts close events of one dialog from now on, so a pop-up that closed and opened again cannot pass as "stayed open". */
async function countCloses(page: Page, id: string) {
  await page.evaluate((dialogId) => {
    const w = window as unknown as { __closes: Record<string, number> };
    w.__closes = w.__closes ?? {};
    document.addEventListener('close', (event) => {
      const target = event.target as HTMLElement;
      if (target.id === dialogId) w.__closes[dialogId] = (w.__closes[dialogId] ?? 0) + 1;
    }, true);
  }, id);
  return () => page.evaluate((dialogId) => (window as unknown as { __closes: Record<string, number> }).__closes[dialogId] ?? 0, id);
}

const MODES = ['click', 'double-click', 'slow double-click'] as const;

for (const mode of MODES) {
  for (const spec of SAMPLE_BUTTONS) {
    test(`${spec.cta} button: a ${mode} opens the sample hand${mode !== 'click' ? ' and leaves it open' : ''}`, async ({ page }) => {
      const width = page.viewportSize()!.width;
      test.skip(spec.minWidth !== undefined && width < spec.minWidth, `the ${spec.cta} button is not drawn below ${spec.minWidth}px`);
      test.skip(spec.maxWidth !== undefined && width > spec.maxWidth, `the ${spec.cta} button is not drawn above ${spec.maxWidth}px`);
      await visit(page);
      const dialog = sampleDialog(page);
      const closes = await countCloses(page, 'dlg-sample');
      const button = await reach(page, spec.cta);
      await expect(button).toBeVisible();

      if (mode === 'click') await button.click();
      else if (mode === 'double-click') await button.dblclick();
      else await humanDoubleClick(page, button);

      await expectOpen(dialog);
      await expect(dialog.getByRole('heading', { name: 'Grade a sample hand' })).toBeVisible();
      await expect(dialog.locator('.hs-choice').first()).toBeVisible();
      await expect(dialog).toHaveAttribute('data-view', 'choose');

      if (mode !== 'click') {
        // Nothing to poll for an absence: wait out the longest motion the site can play, then look again.
        await quiet(page);
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute('data-state', 'open');
        await expect(dialog).toHaveAttribute('data-view', 'choose'); // the second click did not answer anything
        await expect(dialog.locator('.hs-choice.is-picked')).toHaveCount(0);
        expect(await closes(), 'the pop-up closed after the double-click').toBe(0);
      }

      await page.keyboard.press('Escape');
      await expectClosed(dialog);
      // Focus goes back to what opened it. The mobile bar may have slid away; the hero button takes focus then (Dialog.ts).
      const opener = spec.cta === 'menu' ? page.locator('#nav-toggle') : button;
      const fallback = page.locator('button[data-cta="hero"]');
      await expect(async () => {
        const onOpener = await opener.evaluate((el) => el === document.activeElement).catch(() => false);
        const onHero = await fallback.evaluate((el) => el === document.activeElement);
        expect(onOpener || (spec.cta === 'mobile-bar' && onHero), 'focus did not return to the button that opened the pop-up').toBe(true);
      }).toPass();
    });
  }
}

for (const mode of MODES) {
  for (const cta of ['pricing-free', 'pricing-pro'] as const) {
    test(`${cta} button: a ${mode} opens early access${mode !== 'click' ? ' and leaves it open' : ''}`, async ({ page }) => {
      await visit(page);
      const dialog = earlyDialog(page);
      const closes = await countCloses(page, 'dlg-early');
      const button = page.locator(`button[data-cta="${cta}"]`);
      await button.scrollIntoViewIfNeeded();
      if (mode === 'click') await button.click();
      else if (mode === 'double-click') await button.dblclick();
      else await humanDoubleClick(page, button);
      await expectOpen(dialog);
      await expect(dialog.getByRole('heading', { name: 'Get early access' }).first()).toBeVisible();
      await expect(dialog.locator('[data-view="form"]')).toBeVisible();
      if (mode !== 'click') {
        await quiet(page);
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute('data-state', 'open');
        await expect(dialog.locator('[data-view="form"]')).toBeVisible();
        expect(await closes(), 'the pop-up closed after the double-click').toBe(0);
      }
      await page.keyboard.press('Escape');
      await expectClosed(dialog);
      await expect(button).toBeFocused();
    });
  }
}

test('the product pages open the sample hand from their hero and closing buttons', async ({ page }) => {
  for (const path of ['/gto-hand-review', '/live-poker-hand-recorder']) {
    await visit(page, path);
    for (const cta of ['hero', 'closing']) {
      const button = await reach(page, cta);
      await button.dblclick();
      await expectOpen(sampleDialog(page));
      await quiet(page);
      await expect(sampleDialog(page), `${path} ${cta} double-click`).toBeVisible();
      await page.keyboard.press('Escape');
      await expectClosed(sampleDialog(page));
    }
  }
});

test.describe('closing', () => {
  test('the X button closes the sample hand and focus returns', async ({ page }) => {
    await visit(page);
    const hero = page.locator('button[data-cta="hero"]');
    await hero.click();
    await expectOpen(sampleDialog(page));
    await sampleDialog(page).getByRole('button', { name: 'Close' }).first().click();
    await expectClosed(sampleDialog(page));
    await expect(hero).toBeFocused();
  });

  test('Tab never reaches the page behind an open pop-up', async ({ page }) => {
    // A native modal hands Tab to the browser's own controls after its last button (document.body here), then comes back to its first. What must never
    // happen is focus landing on the page behind, which is inert.
    await visit(page);
    await page.locator('button[data-cta="hero"]').click();
    await expectOpen(sampleDialog(page));
    for (let step = 0; step < 24; step++) {
      await tab(page);
      const spot = await page.evaluate(() => {
        const active = document.activeElement;
        return { inside: !!active?.closest('#dlg-sample'), outside: active === document.body || active === document.documentElement, name: `${active?.tagName.toLowerCase()}.${active?.className}` };
      });
      expect(spot.inside || spot.outside, `Tab step ${step + 1} put focus on the page behind the pop-up (${spot.name})`).toBe(true);
    }
  });

  test('a click on the backdrop closes it on a wide window; a tap above the sheet does not close it on a phone', async ({ page }) => {
    await visit(page);
    await page.locator('button[data-cta="hero"]').click();
    await expectOpen(sampleDialog(page));
    const { width, height } = page.viewportSize()!;
    if (width >= 768) {
      await page.mouse.click(8, 8);
      await expectClosed(sampleDialog(page));
    } else {
      await page.mouse.click(width / 2, 4);
      await quiet(page);
      await expect(sampleDialog(page)).toBeVisible();
      expect(height, 'viewport height is known').toBeGreaterThan(0);
    }
  });
});
