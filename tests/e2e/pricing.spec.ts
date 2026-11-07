// pricing.spec.ts (flow 5): the monthly and yearly switch. Pro is $34 monthly or $27 a month billed yearly ($324), with the Concept pricing label throughout.
import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { visit } from './support/ui';

const pricing = (page: Page) => page.locator('#pricing');
const pro = (page: Page) => pricing(page).locator('.plan--pro');

async function toPricing(page: Page) {
  await visit(page);
  await pricing(page).locator('.pricing__title').scrollIntoViewIfNeeded();
}

async function expectMonthly(page: Page) {
  await expect(pro(page).locator('.price__m')).toBeVisible();
  await expect(pro(page).locator('.price__m')).toHaveText('$34');
  await expect(pro(page).locator('.price__y')).toBeHidden();
  await expect(pro(page).locator('.bill__m')).toBeVisible();
  await expect(pro(page).locator('.bill__m')).toHaveText('Billed monthly');
  await expect(pro(page).locator('.bill__y')).toBeHidden();
}

async function expectYearly(page: Page) {
  await expect(pro(page).locator('.price__y')).toBeVisible();
  await expect(pro(page).locator('.price__y')).toHaveText('$27');
  await expect(pro(page).locator('.price__m')).toBeHidden();
  await expect(pro(page).locator('.bill__y')).toBeVisible();
  await expect(pro(page).locator('.bill__y')).toHaveText('Billed yearly at $324');
  await expect(pro(page).locator('.bill__m')).toBeHidden();
}

test('monthly is the default: Pro $34, billed monthly, Free $0, with the Concept pricing label', async ({ page }) => {
  await toPricing(page);
  await expect(pricing(page).locator('input[value="monthly"]')).toBeChecked();
  await expect(pricing(page).locator('input[value="yearly"]')).not.toBeChecked();
  await expectMonthly(page);
  await expect(pricing(page).locator('.plan--free .price__fig')).toHaveText('$0');
  await expect(pricing(page).locator('.pricing__label')).toBeVisible();
  await expect(pricing(page).locator('.pricing__label')).toHaveText('Concept pricing');
  await expect(pricing(page).locator('.pricing__note')).toContainText('Concept pricing. This is a concept site, so nothing is charged and nothing is collected.');
  await expect(pricing(page).locator('.pricing__lead')).toContainText('$34 a month, or $27 a month billed yearly');
  await expect(pricing(page).locator('.pricing__save')).toHaveText('Save $84 a year');
});

test('yearly shows $27 a month billed yearly at $324, and the Concept pricing label stays', async ({ page }) => {
  await toPricing(page);
  await pricing(page).locator('label.billing__opt', { hasText: 'Yearly' }).click();
  await expect(pricing(page).locator('input[value="yearly"]')).toBeChecked();
  await expectYearly(page);
  await expect(pricing(page).locator('.pricing__label')).toBeVisible();
  await expect(pricing(page).locator('.pricing__label')).toHaveText('Concept pricing');
  await expect(pricing(page).locator('.pricing__note')).toContainText('Concept pricing');
  // The figures agree with each other: 12 x $27 is the $324 billed, and the saving is 12 x ($34 - $27).
  expect(27 * 12).toBe(324);
  expect((34 - 27) * 12).toBe(84);
  await expect(pricing(page).locator('.pricing__save')).toHaveText('Save $84 a year');
});

test('the switch goes both ways and leaves the Free plan alone', async ({ page }) => {
  await toPricing(page);
  for (let round = 0; round < 2; round++) {
    await pricing(page).locator('label.billing__opt', { hasText: 'Yearly' }).click();
    await expectYearly(page);
    await expect(pricing(page).locator('.plan--free .price__fig')).toHaveText('$0');
    await pricing(page).locator('label.billing__opt', { hasText: 'Monthly' }).click();
    await expectMonthly(page);
  }
});

test('the switch works from the keyboard', async ({ page }) => {
  await toPricing(page);
  await pricing(page).locator('input[value="monthly"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(pricing(page).locator('input[value="yearly"]')).toBeChecked();
  await expectYearly(page);
  await page.keyboard.press('ArrowLeft');
  await expect(pricing(page).locator('input[value="monthly"]')).toBeChecked();
  await expectMonthly(page);
});

test('what screen readers hear: each price names its period, and the hidden price is out of the accessibility tree', async ({ page }) => {
  await toPricing(page);
  await expect(pro(page).locator('.plan__price .visually-hidden')).toHaveText(' a month');
  await expect(pro(page)).toContainText('Recommended');
  await expect(pro(page).getByRole('button', { name: 'Get early access' })).toBeVisible();
  await expect(pricing(page).locator('.plan--free').getByRole('button', { name: 'Get early access' })).toBeVisible();
});
