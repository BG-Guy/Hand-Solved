// showdown.spec.ts: the flop, turn and river section (#showdown). It loads its look as the visitor nears it, deals three streets from the keyboard,
// shows each card's reason, ends on the royal flush with the keyboard on the main button, and deals again. Without script it is a plain list.
// Reduced motion keeps each deal under half a second; the full choreography is the same state machine with longer CSS timings.
import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';

const why = (page: Page) => page.locator('#showdown .sd-why.is-on .sd-why__title');

test.describe('with script', () => {
  test.use({ reducedMotion: 'reduce' });

  test('deals the flop, turn and river, opens any dealt card, and deals again', async ({ page }) => {
    await page.goto('/');
    const table = page.locator('#showdown');
    await table.scrollIntoViewIfNeeded();
    await expect(table).toHaveAttribute('data-ready', '');
    const puck = table.locator('[data-deal]');
    const settled = () => expect(table).not.toHaveAttribute('data-busy', /.*/, { timeout: 15000 });

    // Before the flop no board card can be reached: its name would give it away.
    await expect(table.getByRole('button', { name: /flop:/ })).toHaveCount(0);

    await puck.focus();
    await page.keyboard.press('Enter');
    await expect(table).toHaveAttribute('data-street', 'flop');
    await settled();
    await expect(table.getByRole('button', { name: /flop:/ })).toHaveCount(3);
    // The street opens on its first card, so the flop reads left to right, in the order it was dealt.
    await expect(why(page)).toContainText('A fair price');
    await expect(table.getByRole('button', { name: /Ace of hearts, flop/ })).toHaveAttribute('aria-pressed', 'true');

    await table.getByRole('button', { name: /Queen of diamonds, flop/ }).click();
    await expect(table.getByRole('button', { name: /Queen of diamonds, flop/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(why(page)).toContainText('It reads your bankroll');

    await puck.focus();
    await page.keyboard.press('Enter');
    await settled();
    await expect(why(page)).toContainText('Practice that plays back');

    await puck.focus();
    await page.keyboard.press('Enter');
    await expect(table).toHaveAttribute('data-street', 'river');
    await settled();
    await expect(table.getByRole('heading', { name: 'HandSolved wins.' })).toBeVisible();
    await expect(why(page)).toContainText('A coach for your real hands');
    await expect(table.getByRole('button', { name: 'Grade a sample hand' })).toBeFocused();

    // The finale's menu: all five reasons by name, and any of them opens from it.
    const menu = table.getByRole('group', { name: 'Reasons' });
    await expect(menu.getByRole('button', { name: /^\d/ })).toHaveCount(5);
    await expect(menu.getByRole('button', { name: /A fair price$/ })).toBeVisible();
    await menu.getByRole('button', { name: /Table or desk$/ }).click();
    await expect(why(page)).toContainText('Table or desk');

    await table.getByRole('button', { name: 'Deal it again' }).click();
    await expect(table).toHaveAttribute('data-street', 'preflop');
    await expect(puck).toBeFocused();
    await expect(table.getByRole('button', { name: /flop:/ })).toHaveCount(0);
  });
});

test.describe('carousel', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the dealt reasons take turns every 3 seconds until the visitor picks one, and Pause stops them', async ({ page }) => {
    await page.goto('/');
    const table = page.locator('#showdown');
    await table.scrollIntoViewIfNeeded();
    await expect(table).toHaveAttribute('data-ready', '');
    await table.locator('[data-deal]').click();
    await expect(table).not.toHaveAttribute('data-busy', /.*/, { timeout: 15000 });
    await page.mouse.move(1, 1); // Away from the reasons: a pointer on them holds the timer.

    const menu = table.getByRole('group', { name: 'Reasons' });
    await expect(menu.getByRole('button', { pressed: true })).toContainText('1');
    await expect(menu.getByRole('button', { pressed: true })).toContainText('2', { timeout: 5000 });

    await menu.getByRole('button', { name: /^3/ }).click();
    await expect(why(page)).toContainText('It reads your bankroll');
    await expect(table).not.toHaveAttribute('data-auto', /.*/);
    await page.waitForTimeout(3500);
    await expect(why(page)).toContainText('It reads your bankroll');

    await menu.getByRole('button', { name: 'Play' }).click();
    await expect(table).toHaveAttribute('data-auto', '');
    await menu.getByRole('button', { name: 'Pause' }).click();
    await expect(table).not.toHaveAttribute('data-auto', /.*/);
  });
});

test.describe('without script', () => {
  test.use({ javaScriptEnabled: false });

  test('reads as a plain list: every reason and the result, nothing to press', async ({ page }) => {
    await page.goto('/');
    const table = page.locator('#showdown');
    await table.scrollIntoViewIfNeeded();
    for (const title of ['A fair price', 'Table or desk', 'It reads your bankroll', 'Practice that plays back', 'A coach for your real hands']) {
      await expect(table.getByRole('heading', { name: new RegExp(title) })).toBeVisible();
    }
    await expect(table.getByRole('heading', { name: 'HandSolved wins.' })).toBeVisible();
    await expect(table.locator('[data-deal]')).toBeHidden();
  });
});
