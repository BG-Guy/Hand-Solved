// sample-hand.spec.ts (flow 3): the first answer is on screen for all three hands, every option shows the right grade, frequency and worth in BB and in dollars
// (expected text is worked out from src/data/demo-spots.json in support/sample.ts), Deal next, a double-click on it, Start over, and the BB/$ switch.
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/fixtures';
import { amount, escapeRegExp, expected, sentence, spots, type ExpectedHand, type Unit } from './support/sample';
import { expectClosed, expectOpen, humanDoubleClick, quiet, reachClosing, sampleDialog, visit, whyNotReachable } from './support/ui';

const dialogOf = (page: Page) => sampleDialog(page);

/** Opens the pop-up from the hero button and waits for hand content, not the loading skeleton. */
async function open(page: Page) {
  await page.locator('button[data-cta="hero"]').click();
  await expectOpen(dialogOf(page));
  await expect(dialogOf(page).locator('.hs-choice').first()).toBeVisible();
}

async function close(page: Page) {
  await page.keyboard.press('Escape');
  await expectClosed(dialogOf(page));
}

async function setUnit(page: Page, unit: Unit) {
  await dialogOf(page).locator(`[data-set-unit="${unit}"]`).click();
  await expect(dialogOf(page).locator(`[data-set-unit="${unit}"]`)).toHaveAttribute('aria-pressed', 'true');
}

/** The choose view of hand `h` shows every option's label and line, the pot and the call in the unit. */
async function expectChooseView(page: Page, h: number, unit: Unit) {
  const dialog = dialogOf(page);
  const hand = expected(spots[h], unit);
  await expect(dialog.locator('.hs-count')).toHaveText(`Hand ${h + 1} of 3`);
  await expect(dialog).toHaveAttribute('data-view', 'choose');
  const choices = dialog.locator('.hs-choice');
  await expect(choices).toHaveCount(hand.options.length);
  for (const [k, option] of hand.options.entries()) {
    await expect(choices.nth(k).locator('.hs-choice__l'), `hand ${h + 1} option ${k + 1} label in ${unit}`).toHaveText(option.label);
    await expect(choices.nth(k).locator('.hs-choice__s'), `hand ${h + 1} option ${k + 1} line in ${unit}`).toHaveText(option.sub);
  }
  await expect(dialog.locator('.hs-setup')).toContainText(`Pot ${hand.pot}`);
  await expect(dialog.locator('.hs-setup')).toContainText(hand.call ? `${hand.call} to call` : 'nothing to call');
  await expect(dialog.locator('[data-unit-name]')).toHaveText(unit === 'bb' ? 'big blinds' : 'dollars');
}

/** The verdict for option k: grade and score in the heading, the sentence, the stamp, and every row of the options table. */
async function expectVerdict(page: Page, hand: ExpectedHand, k: number, where: string) {
  const dialog = dialogOf(page);
  const option = hand.options[k];
  await expect(dialog.locator('#hs-vh'), `${where}: heading`).toHaveText(option.heading);
  await expect(dialog.locator('#hs-vs'), `${where}: sentence`).toHaveText(sentence(hand, option));
  await expect(dialog.locator('.stamp__n'), `${where}: stamp grade`).toHaveText(option.grade);
  await expect(dialog.locator('.stamp__s'), `${where}: stamp score`).toHaveText(String(option.score));
  const rows = dialog.locator('.hs-opt');
  await expect(rows, `${where}: rows`).toHaveCount(hand.options.length);
  for (const [j, row] of hand.options.entries()) {
    await expect(rows.nth(j).locator('.hs-opt__n'), `${where}: row ${j + 1} label`).toContainText(row.label);
    await expect(rows.nth(j).locator('.hs-opt__p'), `${where}: row ${j + 1} frequency`).toHaveText(new RegExp(`^(GTO plays it )?${escapeRegExp(row.freq)}$`));
    await expect(rows.nth(j).locator('.hs-opt__w'), `${where}: row ${j + 1} worth`).toHaveText(new RegExp(`^(Worth )?${escapeRegExp(row.worth)}$`));
    await expect(rows.nth(j), `${where}: row ${j + 1} pressed`).toHaveAttribute('aria-pressed', String(j === k));
  }
  // Frequencies are shares of one whole: the rows add up to 100 percent, give or take the rounding the page itself explains.
  const total = hand.options.reduce((sum, row) => sum + Number.parseInt(row.freq, 10), 0);
  expect(Math.abs(total - 100), `${where}: frequencies add to ${total}`).toBeLessThanOrEqual(2);
}

/** Plays hand 1 and 2 through (first answer each) so the dialog stands on hand `h` in its choose view. */
async function advanceTo(page: Page, h: number) {
  for (let at = 0; at < h; at++) {
    await dialogOf(page).locator('.hs-choice').first().click();
    await expect(dialogOf(page).locator('#hs-vh')).toBeVisible();
    await dialogOf(page).locator('[data-act="next"]').click();
    await expect(dialogOf(page).locator('.hs-count')).toHaveText(`Hand ${at + 2} of 3`);
    await expect(dialogOf(page).locator('.hs-choice').first()).toBeVisible();
  }
}

test.describe('first answer on screen', () => {
  for (const size of [{ width: 375, height: 667 }, { width: 1280, height: 800 }]) {
    test(`all three hands show the first answer button without scrolling at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await visit(page);
      await open(page);
      for (const h of [0, 1, 2]) {
        const first = dialogOf(page).locator('.hs-choice').first();
        // The sheet slides in and the table settles: poll until the button is where it will stay, then it must be wholly reachable.
        await expect.poll(() => whyNotReachable(first, '.dialog__body'), { message: `hand ${h + 1} on open at ${size.width}x${size.height}: first answer`, timeout: 6000 }).toBe('');
        await expect(dialogOf(page).locator('[data-cue]'), 'the "Pick your move" cue is only for a first answer that is out of sight').toBeHidden();
        if (h < 2) {
          // Reach the next hand the way a visitor would, then close and reopen so the check also covers a fresh open at that hand.
          await first.click();
          await expect(dialogOf(page).locator('#hs-vh')).toBeVisible();
          await dialogOf(page).locator('[data-act="next"]').click();
          await expect(dialogOf(page).locator('.hs-count')).toHaveText(`Hand ${h + 2} of 3`);
          const next = dialogOf(page).locator('.hs-choice').first();
          await expect.poll(() => whyNotReachable(next, '.dialog__body'), { message: `hand ${h + 2} after Deal next: first answer`, timeout: 6000 }).toBe('');
          await close(page);
          await open(page);
        }
      }
    });
  }
});

test.describe('first answer on screen at real phone sizes', () => {
  test("at this project's own window size", async ({ page }) => {
    // The two sizes above are the brief's. Each project also has its own (Pixel 5 is 393x727, iPhone 14 is 390x664), and the answer must be on screen there too.
    await visit(page);
    await open(page);
    const { width, height } = page.viewportSize()!;
    const first = dialogOf(page).locator('.hs-choice').first();
    await expect.poll(() => whyNotReachable(first, '.dialog__body'), { message: `hand 1, first answer, on open at ${width}x${height}`, timeout: 6000 }).toBe('');
  });

  test('across common phone windows (run once, in Chrome: the layout does not depend on the engine)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'the same CSS runs in every engine; one project is enough for the sweep');
    await visit(page);
    // Window sizes of real phones in a browser: with and without the address bar and tool bar, 360 to 412 wide.
    const sizes = [[360, 640], [375, 667], [390, 664], [393, 727], [360, 740], [412, 780], [390, 844], [412, 915]];
    const failures: string[] = [];
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      await open(page);
      const first = dialogOf(page).locator('.hs-choice').first();
      let why = '';
      await expect
        .poll(async () => (why = await whyNotReachable(first, '.dialog__body')), { timeout: 4000 })
        .toBe('')
        .catch(() => undefined);
      if (why) {
        const cue = await dialogOf(page).locator('[data-cue]').isVisible();
        failures.push(`${width}x${height}: ${why}${cue ? ' [the "Pick your move" cue is showing]' : ' [no cue showing]'}`);
      }
      await close(page);
    }
    expect(failures, 'phone window sizes where the first answer is not fully on screen when the sample hand opens').toEqual([]);
  });
});

test.describe('every option, both units', () => {
  for (const unit of ['bb', 'usd'] as const) {
    for (const h of [0, 1, 2]) {
      test(`hand ${h + 1} in ${unit === 'bb' ? 'big blinds' : 'dollars'}: each answer shows its grade, frequency and worth`, async ({ page }) => {
        await visit(page);
        await open(page);
        await advanceTo(page, h);
        if (unit === 'usd') await setUnit(page, 'usd');
        const hand = expected(spots[h], unit);
        await expectChooseView(page, h, unit);

        for (const k of hand.options.keys()) {
          // Answer k from the choose view: close and reopen puts the pop-up back on this hand with nothing picked.
          // Hand 3 is the exception by design: answering it finishes the set, and a finished set starts again at hand 1 when reopened.
          if (k > 0) {
            await close(page);
            await open(page);
            if (h === 2) await advanceTo(page, 2);
            await expectChooseView(page, h, unit);
          }
          await dialogOf(page).locator('.hs-choice').nth(k).click();
          await expectVerdict(page, hand, k, `hand ${h + 1} answer ${k + 1} (${hand.options[k].label}) in ${unit}`);
          // What-if: every other row, one click each, shows that option's verdict without leaving the view.
          for (const j of hand.options.keys()) {
            if (j === k) continue;
            await dialogOf(page).locator('.hs-opt').nth(j).click();
            await expectVerdict(page, hand, j, `hand ${h + 1} what-if ${j + 1} (${hand.options[j].label}) in ${unit}`);
          }
        }
      });
    }
  }
});

test.describe('dealing', () => {
  for (const kind of ['instant', 'slow'] as const) {
    test(`Deal next moves one hand on, the dots and count follow, and a ${kind} double-click does not answer the next hand`, async ({ page }) => {
      await visit(page);
      await open(page);
      const dialog = dialogOf(page);
      await expect(dialog.locator('[data-dot]').nth(0)).toHaveAttribute('aria-current', 'step');
      await dialog.locator('.hs-choice').first().click();
      await expect(dialog.locator('#hs-vh')).toBeVisible();
      const next = dialog.locator('[data-act="next"]');
      await expect(next).toBeVisible();

      if (kind === 'instant') await next.dblclick();
      else await humanDoubleClick(page, next);
      await expect(dialog.locator('.hs-count')).toHaveText('Hand 2 of 3');
      await expect(dialog.locator('.hs-choice').first()).toBeVisible();
      // The second click of the double-click lands on whatever Deal next just painted. Wait out every animation, then look again.
      await quiet(page);
      await expect(dialog.locator('.hs-count'), 'the double-click dealt two hands').toHaveText('Hand 2 of 3');
      await expect(dialog, 'the double-click answered hand 2').toHaveAttribute('data-view', 'choose');
      await expect(dialog.locator('.hs-choice.is-picked')).toHaveCount(0);
      await expect(dialog.locator('#hs-vh')).toHaveCount(0);
      await expect(dialog.locator('[data-dot]').nth(1)).toHaveAttribute('aria-current', 'step');
      await expect(dialog.locator('[data-dot]').nth(0)).not.toHaveAttribute('aria-current', /.*/);
      await expectChooseView(page, 1, 'bb');
    });
  }

  for (const kind of ['instant', 'slow'] as const) {
    test(`a ${kind} double-click on an answer picks it once and keeps that verdict`, async ({ page }) => {
      await visit(page);
      await open(page);
      await advanceTo(page, 1);
      const hand = expected(spots[1], 'bb');
      const answer = dialogOf(page).locator('.hs-choice').nth(2);
      if (kind === 'instant') await answer.dblclick();
      else await humanDoubleClick(page, answer);
      await expectVerdict(page, hand, 2, 'hand 2 double-clicked answer 3');
      await quiet(page);
      await expectVerdict(page, hand, 2, 'hand 2 double-clicked answer 3, after the animations');
    });
  }

  test('after hand 3: the end buttons show, Start over returns to hand 1, and a closed finished set starts again too', async ({ page }) => {
    await visit(page);
    await open(page);
    await advanceTo(page, 2);
    const dialog = dialogOf(page);
    await dialog.locator('.hs-choice').first().click();
    await expect(dialog.locator('#hs-vh')).toBeVisible();
    await expect(dialog.locator('[data-nav="end"]')).toBeVisible();
    await expect(dialog.locator('[data-act="next"]')).toBeHidden();
    await expect(dialog.locator('[data-nav="end"] .hs-done')).toContainText('all three hands');
    await expect(dialog.locator('[data-nav="end"]').getByRole('button', { name: 'Get early access' })).toBeVisible();

    await dialog.locator('[data-act="again"]').click();
    await expectChooseView(page, 0, 'bb');
    await expect(dialog.locator('[data-dot]').nth(0)).toHaveAttribute('aria-current', 'step');
    await expect(dialog.locator('[data-nav="end"]')).toBeHidden();

    // A finished set that is closed starts again at hand 1; an unfinished one resumes where it stopped.
    await advanceTo(page, 2);
    await dialog.locator('.hs-choice').first().click();
    await expect(dialog.locator('[data-nav="end"]')).toBeVisible();
    await close(page);
    await open(page);
    await expectChooseView(page, 0, 'bb');
    await advanceTo(page, 1);
    await close(page);
    await open(page);
    await expectChooseView(page, 1, 'bb');
  });
});

test.describe('BB / $ switch', () => {
  test('inside the pop-up it changes every amount on the choose view and the verdict, and back', async ({ page }) => {
    await visit(page);
    await open(page);
    await expectChooseView(page, 0, 'bb');
    await setUnit(page, 'usd');
    await expectChooseView(page, 0, 'usd');
    await dialogOf(page).locator('.hs-choice').nth(1).click();
    const dollars = expected(spots[0], 'usd');
    await expectVerdict(page, dollars, 1, 'hand 1 verdict after switching to dollars first');
    // Switching with the verdict showing repaints the verdict in place, still on the same option.
    await setUnit(page, 'bb');
    await expectVerdict(page, expected(spots[0], 'bb'), 1, 'hand 1 verdict after switching back to big blinds');
    await setUnit(page, 'usd');
    await expectVerdict(page, dollars, 1, 'hand 1 verdict after switching to dollars again');
    // The scene's table alt text and the pot chip follow the unit too.
    await expect(dialogOf(page).locator('.tb')).toHaveAttribute('aria-label', new RegExp(`Pot ${escapeRegExp(dollars.pot)}`));
  });

  test('the choice made on the page is the one the pop-up opens in, and it is remembered after a reload', async ({ page }) => {
    await visit(page);
    const pageSwitch = page.locator('#highlights .unit-switch');
    await pageSwitch.scrollIntoViewIfNeeded();
    await pageSwitch.locator('[data-set-unit="usd"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-unit', 'usd');
    await expect(page.locator('[data-set-unit="usd"]').first()).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => localStorage.getItem('hs-unit'))).toBe('usd');

    await page.locator('button[data-cta="hero"]').scrollIntoViewIfNeeded();
    await open(page);
    await expectChooseView(page, 0, 'usd');
    await close(page);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-unit', 'usd');
    await expect(page.locator('.hero__pen .num__v').first()).toHaveText(amount(spots[0].toCallDollars, spots[0].bigBlindDollars, 'usd'));
  });

  test('on the page it rewrites every live amount, agrees with the sample data, and restores the original text', async ({ page }) => {
    await visit(page);
    const numbers = page.locator('.num__v');
    const before = await numbers.allTextContents();
    expect(before.length, 'live amounts on the home page').toBeGreaterThan(30);
    expect(before.filter((text) => /\$/.test(text)), 'big blinds is the default').toEqual([]);

    // The hero chip is hand 1 of the sample set: calling 65 bb, worth the call option's value.
    const call = spots[0].options.find((o) => o.type === 'call')!;
    const hero = page.locator('.hero__slip .num__v');
    await expect(hero.nth(0)).toHaveText(amount(spots[0].toCallDollars, spots[0].bigBlindDollars, 'bb'));
    await expect(hero.nth(1)).toHaveText(amount(call.ev, spots[0].bigBlindDollars, 'bb', { signed: true }));

    await page.locator('#numbers .unit-switch [data-set-unit="usd"]').scrollIntoViewIfNeeded();
    await page.locator('#numbers .unit-switch [data-set-unit="usd"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-unit', 'usd');
    await expect(hero.nth(0)).toHaveText(amount(spots[0].toCallDollars, spots[0].bigBlindDollars, 'usd'));
    await expect(hero.nth(1)).toHaveText(amount(call.ev, spots[0].bigBlindDollars, 'usd', { signed: true }));

    const after = await numbers.allTextContents();
    expect(after.length).toBe(before.length);
    const stillBb = after.map((text, i) => ({ text, was: before[i] })).filter(({ text }) => / bb/.test(text));
    expect(stillBb, 'amounts still in big blinds after switching to dollars').toEqual([]);
    expect(after.filter((text, i) => text !== before[i]).length, 'amounts that changed').toBeGreaterThan(30);
    for (const button of await page.locator('[data-set-unit="usd"]').all()) await expect(button).toHaveAttribute('aria-pressed', 'true');
    for (const button of await page.locator('[data-set-unit="bb"]').all()) await expect(button).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#numbers .unit-switch [data-set-unit="bb"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-unit', 'bb');
    await expect.poll(() => numbers.allTextContents(), { message: 'amounts after switching back' }).toEqual(before);
  });
});

test('the pop-up reaches its last hand and its footer at the end of the page too (closing button)', async ({ page }) => {
  await visit(page);
  const button = page.locator('button[data-cta="closing"]');
  await reachClosing(page, button);
  await button.click();
  await expectOpen(dialogOf(page));
  await expectChooseView(page, 0, 'bb');
  const first: Locator = dialogOf(page).locator('.hs-choice').first();
  await expect.poll(() => whyNotReachable(first, '.dialog__body')).toBe('');
});
