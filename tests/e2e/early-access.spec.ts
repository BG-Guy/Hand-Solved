// early-access.spec.ts (flow 4): plan chips from each pricing button, empty and invalid emails, the success step with the concept note, no request on submit,
// nothing typed reaching storage, the value gone after close, and the hand-off to and from the sample hand.
import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { earlyDialog, expectClosed, expectOpen, quiet, sampleDialog, storageSnapshot, visit } from './support/ui';

const CHIPS = {
  free: 'Plan: Free, $0 (concept pricing)',
  pro: 'Plan: Pro, $34 a month (concept pricing)',
  'pro-yearly': 'Plan: Pro, $27 a month, billed yearly (concept pricing)',
} as const;

type Cta = 'pricing-free' | 'pricing-pro';

async function openFrom(page: Page, cta: Cta) {
  const button = page.locator(`button[data-cta="${cta}"]`);
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expectOpen(earlyDialog(page));
  await expect(earlyDialog(page)).toHaveAttribute('data-ready', ''); // the module has mounted, so the form is live
  return button;
}

async function expectChip(page: Page, which: keyof typeof CHIPS | null) {
  const chips = earlyDialog(page).locator('[data-chip]');
  await expect(chips).toHaveCount(3);
  for (const [key, text] of Object.entries(CHIPS)) {
    const chip = earlyDialog(page).locator(`[data-chip="${key}"]`);
    if (key === which) {
      await expect(chip, `chip ${key} should show`).toBeVisible();
      await expect(chip).toHaveText(text);
    } else {
      await expect(chip, `chip ${key} should be hidden`).toBeHidden();
    }
  }
}

const field = (page: Page) => earlyDialog(page).locator('[data-input]');
const message = (page: Page) => earlyDialog(page).locator('#ea-msg');
const submitButton = (page: Page) => earlyDialog(page).locator('[data-submit]');
const doneHeading = (page: Page) => earlyDialog(page).locator('[data-done-h]');

test.describe('plan chip', () => {
  test('Free shows the Free chip', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-free');
    await expectChip(page, 'free');
  });

  test('Pro on the monthly view shows the monthly Pro chip', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await expectChip(page, 'pro');
  });

  test('Pro on the yearly view shows the yearly Pro chip, and the chip follows the button on each open', async ({ page }) => {
    await visit(page);
    await page.locator('#pricing label.billing__opt', { hasText: 'Yearly' }).scrollIntoViewIfNeeded();
    await page.locator('#pricing label.billing__opt', { hasText: 'Yearly' }).click();
    await expect(page.locator('#pricing input[value="yearly"]')).toBeChecked();
    await openFrom(page, 'pricing-pro');
    await expectChip(page, 'pro-yearly');
    await page.keyboard.press('Escape');
    await expectClosed(earlyDialog(page));
    // Free ignores the billing switch.
    await openFrom(page, 'pricing-free');
    await expectChip(page, 'free');
    await page.keyboard.press('Escape');
    await expectClosed(earlyDialog(page));
    // Back to monthly: the same Pro button now asks for the monthly chip.
    await page.locator('#pricing label.billing__opt', { hasText: 'Monthly' }).click();
    await openFrom(page, 'pricing-pro');
    await expectChip(page, 'pro');
  });
});

test.describe('checking the address', () => {
  test('the field has focus on open and an empty submit shows the error', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await expect(field(page)).toBeFocused();
    await submitButton(page).click();
    await expect(message(page)).toHaveText('Enter your email address.');
    await expect(message(page)).toHaveAttribute('role', 'alert');
    await expect(field(page)).toHaveAttribute('aria-invalid', 'true');
    await expect(field(page)).toBeFocused();
    await expect(earlyDialog(page).locator('[data-field]')).toHaveAttribute('data-state', 'error');
    await expect(earlyDialog(page).locator('[data-view="done"]')).toBeHidden();
    await expect(earlyDialog(page).locator('[data-view="form"]')).toBeVisible();
  });

  const INVALID: [string, string][] = [
    ['plainaddress', 'Add an @, like name@example.com.'],
    ['a@b@c.com', 'Use only one @, like name@example.com.'],
    ['@example.com', 'Add the part before the @, like name@example.com.'],
    ['name@', 'Add the part after the @, like example.com.'],
    ['name@example', 'Add the part after the @, like example.com.'],
    ['na me@example.com', 'Remove spaces and special characters.'],
    ['name..x@example.com', 'Check the dots. They cannot start, end or repeat.'],
    ['name@example.c', 'Finish with a real ending, at least two letters after the last dot, like .com.'],
  ];

  test('each kind of invalid address gets its own message and never reaches the success step', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    for (const [address, expectedMessage] of INVALID) {
      await field(page).fill(address);
      await submitButton(page).click();
      await expect(message(page), `message for "${address}"`).toHaveText(expectedMessage);
      await expect(field(page)).toHaveAttribute('aria-invalid', 'true');
      await expect(earlyDialog(page).locator('[data-view="done"]'), `"${address}" must not succeed`).toBeHidden();
    }
    // The error clears as soon as the address is right, before any submit.
    await field(page).fill('name@example.com');
    await expect(field(page)).not.toHaveAttribute('aria-invalid', /.*/);
    await expect(message(page)).toHaveText('');
  });

  test('a likely typo in the domain is hinted but never blocks', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await field(page).fill('sam@gmial.com');
    await field(page).blur(); // the hint shows once the field is left, or on submit
    await expect(message(page)).toContainText('Did you mean sam@gmail.com?');
    await message(page).getByRole('button', { name: 'Use sam@gmail.com' }).click();
    await expect(field(page)).toHaveValue('sam@gmail.com');
    await expect(message(page)).toHaveText('');
    await field(page).fill('sam@gmial.com');
    await field(page).press('Enter');
    await expect(doneHeading(page)).toBeVisible();
  });

  test('a valid address (typed, then Enter) shows the success step with the concept note', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await field(page).pressSequentially('ada.lovelace+e2e@example.com');
    await field(page).press('Enter');
    // The form fades first and the success step mounts after it, so wait for it rather than look at once.
    await expect(doneHeading(page)).toBeVisible();
    await expect(doneHeading(page)).toBeFocused();
    await expect(earlyDialog(page).locator('[data-view="form"]')).toBeHidden();
    const done = earlyDialog(page).locator('[data-view="done"]');
    await expect(done).toContainText('This is a concept site');
    await expect(done).toContainText('nothing is collected or sent');
    await expect(done).toContainText('cleared when you close this box');
    await expect(done.locator('[data-addr]')).toHaveText('ada.lovelace+e2e@example.com');
    await expect(done.getByRole('button', { name: 'Back to the site' })).toBeVisible();
    await expect(done.getByRole('button', { name: 'Grade another sample hand' })).toBeVisible();
  });

  test('submit with the button works the same, and the button cannot fire twice', async ({ page }) => {
    await visit(page);
    await openFrom(page, 'pricing-free');
    await field(page).fill('grace@example.org');
    await submitButton(page).dblclick();
    await expect(doneHeading(page)).toBeVisible();
    await quiet(page);
    await expect(doneHeading(page)).toBeVisible();
    await expect(earlyDialog(page).locator('[data-addr]')).toHaveText('grace@example.org');
  });
});

test.describe('nothing is sent or kept', () => {
  test('no request leaves the page on submit, from open to success (keyboard submit, pointer parked outside the pop-up)', async ({ page, watch }) => {
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await page.mouse.move(2, 2); // over the backdrop: nothing under the pointer can ask for a prefetch
    await page.waitForLoadState('networkidle'); // the dialog's own chunk and any lazy image are in; from here on nothing may be requested
    const requestsBefore = watch.requests.length;
    const scriptCallsBefore = watch.scriptNetwork.length;
    const urlBefore = page.url();

    await field(page).pressSequentially('no.requests@example.com');
    await field(page).press('Enter');
    await expect(doneHeading(page)).toBeVisible();
    await quiet(page);

    expect(watch.requests.slice(requestsBefore), 'requests issued by the browser during the sign-up').toEqual([]);
    expect(watch.scriptNetwork.slice(scriptCallsBefore), 'fetch, XHR or sendBeacon calls made by page script').toEqual([]);
    expect(watch.failedRequests, 'requests that were started and failed').toEqual([]);
    expect(page.url(), 'the address in the bar did not change (no form navigation, nothing in the query string)').toBe(urlBefore);
    expect(page.url()).not.toContain('example.com');
  });

  test('clicking Submit sends no data: at most a hover prefetch of a static code file, never a body, a query or another origin', async ({ page, watch }) => {
    // With the pointer on the submit button, the success step's own "Grade another sample hand" button appears under it, and the site warms that pop-up's code chunk on
    // pointer intent (Dialog.ts). That is a GET of /_astro/*.js, the same file any visitor gets on the first open, and it carries nothing from the form.
    await visit(page);
    await openFrom(page, 'pricing-pro');
    await page.waitForLoadState('networkidle');
    const requestsBefore = watch.requests.length;
    const posted: string[] = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET' || request.postData()) posted.push(`${request.method()} ${request.url()}`);
    });
    await field(page).pressSequentially('click.submit@example.com');
    await submitButton(page).click();
    await expect(doneHeading(page)).toBeVisible();
    await quiet(page);
    const during = watch.requests.slice(requestsBefore);
    const origin = new URL(page.url()).origin;
    for (const entry of during) {
      const [method, url] = entry.split(' ');
      expect(method, `request during submit: ${entry}`).toBe('GET');
      expect(url.startsWith(`${origin}/_astro/`) && /\.(js|css)$/.test(url), `request during submit is not a static code file: ${entry}`).toBe(true);
      expect(url, 'the address must not appear in any URL').not.toContain('click.submit');
    }
    expect(posted, 'requests with a body or a non-GET method').toEqual([]);
    expect(watch.scriptNetwork.length, 'fetch, XHR or sendBeacon calls made by page script').toBe(0);
    test.info().annotations.push({ type: 'requests during submit', description: during.length ? during.join(', ') : 'none' });
  });

  test('the browser itself refuses to send anything: fetch, XHR and beacon are blocked by the CSP', async ({ page, watch }) => {
    await visit(page);
    const answered: string[] = [];
    page.on('response', (response) => answered.push(response.url()));
    const outcome = await page.evaluate(async () => {
      const results: Record<string, string> = {};
      try {
        await fetch('/robots.txt');
        results.fetch = 'sent';
      } catch {
        results.fetch = 'blocked';
      }
      navigator.sendBeacon('/robots.txt', 'x'); // queues and returns true; the block is reported afterwards, so the evidence is the violation and the missing response
      results.xhr = await new Promise<string>((resolve) => {
        const request = new XMLHttpRequest();
        request.onerror = () => resolve('blocked');
        request.onload = () => resolve('sent');
        request.open('GET', '/robots.txt');
        request.send();
      });
      return results;
    });
    expect(outcome).toEqual({ fetch: 'blocked', xhr: 'blocked' });
    await expect.poll(() => watch.csp.length, { message: 'CSP violation reports for fetch, beacon and XHR' }).toBeGreaterThanOrEqual(3);
    expect(watch.csp.every((report) => report.startsWith('connect-src')), `violations: ${watch.csp.join(' | ')}`).toBe(true);
    await quiet(page);
    expect(answered.filter((url) => url.endsWith('/robots.txt')), 'a response came back for a request that should never have left').toEqual([]);
    watch.clear(); // these violations were provoked on purpose
  });

  test('nothing typed reaches storage, cookies, IndexedDB or the cache; storage is exactly as it was before', async ({ page }) => {
    await visit(page);
    const token = `zq7k-${Date.now()}`;
    const address = `${token}@example.com`;
    const before = await storageSnapshot(page);
    await openFrom(page, 'pricing-pro');
    await field(page).pressSequentially(address);
    expect(JSON.stringify(await storageSnapshot(page)), 'while typing').not.toContain(token);
    await field(page).press('Enter');
    await expect(doneHeading(page)).toBeVisible();
    await quiet(page);
    const during = await storageSnapshot(page);
    expect(JSON.stringify(during), 'on the success step').not.toContain(token);
    expect(during, 'storage changed during the sign-up').toEqual(before);
    await earlyDialog(page).getByRole('button', { name: 'Back to the site' }).click();
    await expectClosed(earlyDialog(page));
    await quiet(page);
    expect(await storageSnapshot(page), 'storage changed after closing').toEqual(before);
    expect(await page.evaluate(() => document.title + location.href + document.referrer), 'address in the title, URL or referrer').not.toContain(token);
  });

  test('the value is gone after close, from the success step and from half-typed input, on every way of closing', async ({ page }) => {
    await visit(page);
    // 1. Success step, closed with its own button.
    await openFrom(page, 'pricing-pro');
    await field(page).fill('first@example.com');
    await submitButton(page).click();
    await expect(doneHeading(page)).toBeVisible();
    await earlyDialog(page).getByRole('button', { name: 'Back to the site' }).click();
    await expectClosed(earlyDialog(page));
    await expect(field(page)).toHaveValue('');
    await expect(earlyDialog(page).locator('[data-addr]')).toHaveText('');
    await page.locator('button[data-cta="pricing-pro"]').click();
    await expectOpen(earlyDialog(page));
    await expect(earlyDialog(page).locator('[data-view="form"]')).toBeVisible();
    await expect(earlyDialog(page).locator('[data-view="done"]')).toBeHidden();
    await expect(field(page)).toHaveValue('');
    await expect(message(page)).toHaveText('');
    await expect(submitButton(page)).toBeEnabled();

    // 2. Half-typed with an error showing, closed with Esc.
    await field(page).fill('half@typed');
    await submitButton(page).click();
    await expect(message(page)).not.toHaveText('');
    await page.keyboard.press('Escape');
    await expectClosed(earlyDialog(page));
    await expect(field(page)).toHaveValue('');
    await page.locator('button[data-cta="pricing-pro"]').click();
    await expectOpen(earlyDialog(page));
    await expect(field(page)).toHaveValue('');
    await expect(message(page)).toHaveText('');
    await expect(field(page)).not.toHaveAttribute('aria-invalid', /.*/);

    // 3. Typed, closed with the X.
    await field(page).fill('closed@byx.com');
    await earlyDialog(page).getByRole('button', { name: 'Close' }).first().click();
    await expectClosed(earlyDialog(page));
    await expect(field(page)).toHaveValue('');
  });
});

test.describe('hand-off between the two pop-ups', () => {
  test('"Get early access" in the sample hand opens early access with no plan chip, and Esc returns focus to the page button', async ({ page }) => {
    await visit(page);
    const hero = page.locator('button[data-cta="hero"]');
    await hero.click();
    await expectOpen(sampleDialog(page));
    await sampleDialog(page).locator('.hs-choice').first().click();
    await expect(sampleDialog(page).locator('#hs-vh')).toBeVisible();
    await sampleDialog(page).locator('[data-nav="mid"] [data-cta="verdict-early"]').click();
    await expectOpen(earlyDialog(page));
    await expectClosed(sampleDialog(page));
    await expectChip(page, null);
    await page.keyboard.press('Escape');
    await expectClosed(earlyDialog(page));
    await expect(hero).toBeFocused();
  });

  test('"Grade another sample hand" on the success step opens the sample hand', async ({ page }) => {
    await visit(page);
    const button = await openFrom(page, 'pricing-pro');
    await field(page).fill('again@example.com');
    await submitButton(page).click();
    await expect(doneHeading(page)).toBeVisible();
    await earlyDialog(page).getByRole('button', { name: 'Grade another sample hand' }).click();
    await expectOpen(sampleDialog(page));
    await expectClosed(earlyDialog(page));
    await expect(field(page)).toHaveValue('');
    await page.keyboard.press('Escape');
    await expectClosed(sampleDialog(page));
    await expect(button).toBeFocused();
  });
});
