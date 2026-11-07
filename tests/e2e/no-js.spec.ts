// no-js.spec.ts (flow 9): with JavaScript off, all copy can be read, and every demo button gives way to a link to /gto-hand-review#worked-example.
import { expect, test } from './support/fixtures';
import { amount, expected, spots } from './support/sample';
import { atBottom, scanText, wheelStep, wheelToEnd } from './support/ui';

test.use({ javaScriptEnabled: false });

test('home: no script flag, every text block can be read as the page is scrolled, the nav links are in the bar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-js', /.*/);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toContainText('solved.');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link')).toHaveCount(4);
  await expect(page.locator('#nav-toggle')).toBeHidden(); // no script, no burger: the links wrap under the brand
  await expect(page.locator('.unit-switch').first()).toBeHidden(); // nothing for it to do
  await expect(page.locator('#dlg-sample')).toBeHidden();

  // Walk down with real wheel events and check every block as it passes the window. Entrance animations are CSS, so they still run: give them time by polling.
  let checked = 0;
  for (let turn = 0; turn < 160; turn++) {
    let seen = 0;
    await expect
      .poll(async () => {
        const scan = await page.evaluate(scanText, { topLimit: 0.6 });
        seen = scan.checked;
        return scan.offenders;
      }, { message: `text at or near opacity 0 without script (scroll turn ${turn + 1})`, timeout: 6000 })
      .toEqual([]);
    checked += seen;
    if (await atBottom(page)) break;
    await wheelStep(page, Math.round((page.viewportSize()?.height ?? 700) * 0.45));
  }
  expect(await atBottom(page), 'reached the end of the page').toBe(true);
  expect(checked, 'text blocks looked at').toBeGreaterThan(40);
});

test('home: the copy that needs script elsewhere is printed as text, and answers open natively', async ({ page }) => {
  await page.goto('/');
  const pricing = page.locator('#pricing');
  await pricing.scrollIntoViewIfNeeded();
  await expect(pricing.locator('.pricing__nojs')).toBeVisible();
  await expect(pricing.locator('.pricing__nojs')).toContainText('Pro is $34/mo, or $27/mo billed yearly. Free is $0.');
  await expect(pricing.locator('.pricing__nojs')).toContainText('collects nothing either way');
  await expect(pricing.locator('button[data-dialog-open]')).toHaveCount(2);
  for (const button of await pricing.locator('button[data-dialog-open]').all()) await expect(button).toBeHidden();
  await expect(pricing.locator('.pricing__label')).toHaveText('Concept pricing');

  // The billing switch is two radios and CSS, so it still works.
  await pricing.locator('label.billing__opt', { hasText: 'Yearly' }).click();
  await expect(pricing.locator('.price__y')).toBeVisible();
  await expect(pricing.locator('.bill__y')).toHaveText('Billed yearly at $324');

  // FAQ answers sit in <details>: closed until asked, readable after a click, no script needed.
  const first = page.locator('.faq__item').first();
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator('.faq__body')).toBeHidden();
  await first.locator('summary').click();
  await expect(first.locator('.faq__body')).toBeVisible();
  await expect(first.locator('.faq__body')).toContainText('live poker session tracker');
});

for (const path of ['/', '/gto-hand-review', '/live-poker-hand-recorder', '/privacy', '/terms', '/no-such-page-e2e']) {
  test(`${path}: each demo button is replaced by a link to the worked example`, async ({ page }) => {
    await page.goto(path);
    // Every pop-up button is out of the layout: it could not do anything.
    for (const button of await page.locator('button[data-dialog-open]').all()) await expect(button).toBeHidden();

    // Every sample-hand button in the page body (and the header's) has its fallback link right beside it, visible, with the one target.
    // The burger menu holds a button too, but the menu cannot be opened without script (no burger), so it needs no fallback.
    const demoButtons = page.locator('main button[data-dialog-open="dlg-sample"], header .nav__bar button[data-dialog-open="dlg-sample"]');
    const total = await demoButtons.count();
    expect(total, 'sample-hand buttons on the page').toBeGreaterThan(0);
    let withFallback = 0;
    for (const button of await demoButtons.all()) {
      const beside = await button.evaluate((el) => {
        const next = el.nextElementSibling;
        const link = next?.tagName === 'NOSCRIPT' ? next.querySelector('a') : null;
        return link ? { href: link.getAttribute('href'), text: link.textContent?.trim() } : null;
      });
      if (!beside) {
        // The worked example's own page needs no <noscript> link: its hero has a permanent "See a worked example" link to #worked-example, and the example's
        // own "grade this hand yourself" button sits on the very page the link points to.
        const cta = await button.getAttribute('data-cta');
        expect(path === '/gto-hand-review' && (cta === 'review-example' || cta === 'hero'), `the ${cta} button on ${path} has no fallback link beside it`).toBe(true);
        if (cta === 'hero') {
          const inPage = page.locator('main a[href="#worked-example"]').first();
          await expect(inPage).toBeVisible();
          await expect(page.locator('#worked-example')).toBeVisible();
        }
        continue;
      }
      withFallback += 1;
      expect(beside).toEqual({ href: '/gto-hand-review#worked-example', text: 'Read a worked example' });
    }
    expect(withFallback, 'buttons with a fallback link').toBeGreaterThanOrEqual(total - 2);

    const visible = [];
    for (const link of await page.locator('a[href="/gto-hand-review#worked-example"]').all()) if (await link.isVisible()) visible.push(link);
    expect(visible.length, 'worked-example links that can be seen').toBeGreaterThanOrEqual(withFallback);
  });
}

test('home: all five demo spots (header, hero, story, numbers, closing) have a visible link, and it works', async ({ page }) => {
  await page.goto('/');
  const hrefs = page.locator('a[href="/gto-hand-review#worked-example"]');
  const shown: string[] = [];
  for (const link of await hrefs.all()) {
    if (await link.isVisible()) shown.push((await link.evaluate((el) => el.closest('header') ? 'header' : (el.closest('section, footer')?.id || el.closest('section, footer')?.className || 'other'))));
  }
  expect(shown.length, `visible links: ${shown.join(', ')}`).toBeGreaterThanOrEqual(5);

  await wheelToEnd(page);
  const closing = page.locator('#start a[href="/gto-hand-review#worked-example"]');
  await expect(closing).toBeVisible();
  await closing.click();
  await expect(page).toHaveURL(/\/gto-hand-review#worked-example$/);
  await expect(page.locator('#worked-example')).toBeVisible();
});

test('the worked example is static HTML and matches demo-spots.json (hand 1, in big blinds)', async ({ page }) => {
  await page.goto('/gto-hand-review#worked-example');
  const example = page.locator('#worked-example');
  await expect(example).toBeVisible();
  const hand = expected(spots[0], 'bb');
  await expect(example).toContainText(`Pot ${hand.pot}`);
  await expect(example).toContainText(`${hand.call} to call`);
  for (const option of hand.options) {
    await expect(example, `option ${option.label}`).toContainText(option.label);
    await expect(example).toContainText(option.freq);
    await expect(example).toContainText(option.worth);
    await expect(example).toContainText(`${option.grade} ${option.score}`);
  }
  const callOption = spots[0].options.find((o) => o.type === 'call')!;
  await expect(example).toContainText(`calling gives up ${amount(callOption.givenUpDollars, spots[0].bigBlindDollars, 'bb')} against folding`);
});

test('the header link and the 404 page also have a way to the worked example', async ({ page }) => {
  await page.goto('/no-such-page-e2e');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Read a worked example' })).toHaveAttribute('href', '/gto-hand-review#worked-example');
  await expect(page.locator('header').getByRole('link', { name: 'Read a worked example' })).toBeVisible();
});
