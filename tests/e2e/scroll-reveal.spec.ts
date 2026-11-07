// scroll-reveal.spec.ts (flow 10): scroll through / and /gto-hand-review with real wheel events and check that nothing readable stays hidden.
// Chrome and new Safari reveal with a CSS scroll timeline; Firefox and older Safari use the one-shot observer in src/scripts/reveal-fallback.ts. Each run records
// which of the two this engine took (see the test annotations), because the fallback has never been seen in a real engine before this suite.
//
// What "in the viewport" means here: a block whose top edge is in the upper 60 percent of the window. The bottom of the window is where reveals are still arriving
// (the observer fires at 90 percent, the scroll timeline finishes a fixed distance in), so a block there may legitimately still be fading in. Anything above that
// line has had its chance, and must be opaque once the scroll has stopped. Polling gives the fade its time; there is no fixed sleep.
import { expect, test } from './support/fixtures';
import { atBottom, revealMechanism, scanText, scrollInput, visit, wheelStep } from './support/ui';

for (const path of ['/', '/gto-hand-review']) {
  test(`scrolling ${path} down with the wheel never leaves a heading or paragraph hidden`, async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    await visit(page, path);
    const mechanism = await revealMechanism(page);
    testInfo.annotations.push({ type: 'reveal mechanism', description: mechanism });
    const height = page.viewportSize()!.height;
    const step = Math.round(height * 0.45); // small enough that every block spends time in the upper 60 percent
    let checked = 0;
    let turns = 0;

    for (; turns < 160; turns++) {
      const where = await page.evaluate(() => Math.round(scrollY));
      let seen = 0;
      await expect
        .poll(async () => {
          const scan = await page.evaluate(scanText, { topLimit: 0.6 });
          seen = scan.checked;
          return scan.offenders;
        }, { message: `${path} at scroll ${where}px (${mechanism}): blocks still at opacity 0 after the scroll stopped`, timeout: 6000 })
        .toEqual([]);
      checked += seen;
      if (await atBottom(page)) break;
      await wheelStep(page, step);
    }
    testInfo.annotations.push({ type: 'scroll input', description: scrollInput(page) === 'wheel' ? 'real wheel events' : 'Page Up / Page Down keys and window.scrollBy (Playwright has no wheel in mobile WebKit)' });
    expect(await atBottom(page), `scrolling reached the end of the page after ${turns} turns`).toBe(true);
    expect(checked, 'text blocks checked on the way down').toBeGreaterThan(40);

    // Having been all the way down, nothing above the window may have been left hidden, wherever it is on the page.
    await expect
      .poll(async () => (await page.evaluate(scanText, { topLimit: 1, wholePage: true })).offenders.filter((block) => block.top < height), { message: 'blocks left hidden after the whole page was scrolled', timeout: 6000 })
      .toEqual([]);
  });

  test(`scrolling ${path} back up with the wheel shows the same blocks again`, async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    await visit(page, path);
    testInfo.annotations.push({ type: 'reveal mechanism', description: await revealMechanism(page) });
    const height = page.viewportSize()!.height;
    // Down in big jumps (not the thing under test), then up in small wheel steps, checking at every stop.
    for (let turn = 0; turn < 120 && !(await atBottom(page)); turn++) await wheelStep(page, height);
    expect(await atBottom(page), 'reached the end').toBe(true);
    let checked = 0;
    for (let turn = 0; turn < 160; turn++) {
      let seen = 0;
      await expect
        .poll(async () => {
          const scan = await page.evaluate(scanText, { topLimit: 0.6 });
          seen = scan.checked;
          return scan.offenders;
        }, { message: `${path} on the way up at scroll ${Math.round(await page.evaluate(() => scrollY))}px: blocks at opacity 0`, timeout: 6000 })
        .toEqual([]);
      checked += seen;
      if ((await page.evaluate(() => scrollY)) <= 0) break;
      await wheelStep(page, -Math.round(height * 0.45));
    }
    expect(await page.evaluate(() => scrollY), 'wheel scrolling reached the top').toBe(0);
    expect(checked, 'text blocks checked on the way up').toBeGreaterThan(40);
  });
}

test('the reveal mechanism of this engine is the one its scroll-timeline support says it should be', async ({ page }, testInfo) => {
  await visit(page);
  const facts = await page.evaluate(() => ({
    timeline: CSS.supports('animation-timeline', 'view()'),
    fallbackArmed: document.documentElement.classList.contains('reveal-io'),
    revealCount: document.querySelectorAll('[data-reveal]').length,
    animations: document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.target?.matches?.('[data-reveal]')).length,
  }));
  testInfo.annotations.push({ type: 'engine', description: `${testInfo.project.name}: animation-timeline view() supported = ${facts.timeline}` });
  expect(facts.revealCount, '[data-reveal] blocks on the home page').toBeGreaterThan(10);
  if (facts.timeline) {
    expect(facts.fallbackArmed, 'an engine with scroll timelines must not also arm the observer fallback').toBe(false);
    expect(facts.animations, 'scroll-timeline animations on [data-reveal] blocks').toBeGreaterThan(10);
  } else {
    // The fallback imports after load and arms itself last: poll for it.
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('reveal-io')), { message: 'the observer fallback never armed itself' }).toBe(true);
    expect(facts.animations, 'no scroll-timeline animation can exist here').toBe(0);
  }
});

test('the bankroll line finishes drawing, and its end label shows, once the plot is well on screen', async ({ page }, testInfo) => {
  // The line and its "+733 bb" label are drawn by scroll position on purpose (MOTION.md E24), so the text scan leaves them out; this is their own check.
  await visit(page);
  const plot = page.locator('[data-bankroll-plot]');
  await plot.scrollIntoViewIfNeeded();
  const height = page.viewportSize()!.height;
  // Nudge by real scrolling until the plot's top is in the upper 20 percent of the window. MOTION.md E24 says the draw is complete at 40 percent, but on a phone the
  // mobile bar's scroll-padding shifts every scroll timeline's end edge up by the bar's height (about 85 px), so it finishes at about 23 percent there.
  const trail: number[] = [];
  for (let turn = 0; turn < 40; turn++) {
    const top = Math.round((await plot.boundingBox())!.y);
    trail.push(top);
    if (top < height * 0.2) break;
    await wheelStep(page, Math.min(240, Math.max(60, Math.round(top - height * 0.15))));
  }
  testInfo.annotations.push({ type: 'scroll input', description: scrollInput(page) });
  expect(trail.at(-1)!, `the plot's top edge per scroll turn (px from the window top): ${trail.join(', ')}`).toBeLessThan(height * 0.2);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          // The plot holds a wide and a narrow drawing; only the one on screen counts.
          const plotEl = document.querySelector('[data-bankroll-plot]')!;
          const shown = (el: Element) => el.getClientRects().length > 0;
          const line = [...plotEl.querySelectorAll('.chart__line')].find(shown);
          const last = [...plotEl.querySelectorAll('.chart__last')].find(shown);
          const dots = [...plotEl.querySelectorAll('.dot')].filter(shown);
          const opacity = (el: Element | undefined) => (el ? parseFloat(getComputedStyle(el).opacity) : -1);
          return {
            // pathLength is 1, and a finished draw reads 0 (Firefox) or a hair above it (Chromium, 0.16 of a pixel).
            lineDrawn: line ? parseFloat(getComputedStyle(line).strokeDashoffset) < 0.2 : false,
            labelOpacity: opacity(last),
            dotsShown: dots.length >= 18 && dots.every((dot) => opacity(dot) > 0.99),
          };
        }),
      { message: 'bankroll line, dots and end label once the plot is well on screen', timeout: 8000 },
    )
    .toEqual({ lineDrawn: true, labelOpacity: 1, dotsShown: true });
});
