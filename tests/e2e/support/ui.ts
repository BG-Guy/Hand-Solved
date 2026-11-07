// ui.ts: helpers the specs share. Waits are conditions (an attribute, a position that stopped moving), never a guessed number of milliseconds.
// The one timed wait is quiet(): to prove something did NOT happen there is nothing to poll for, so it waits for the longest motion the site's own tokens allow.
import type { Locator, Page } from '@playwright/test';
import { expect } from './fixtures';

export const PAGES = [
  { path: '/', name: 'home', status: 200 },
  { path: '/gto-hand-review', name: 'gto-hand-review', status: 200 },
  { path: '/live-poker-hand-recorder', name: 'live-poker-hand-recorder', status: 200 },
  { path: '/privacy', name: 'privacy', status: 200 },
  { path: '/terms', name: 'terms', status: 200 },
  { path: '/no-such-page-e2e', name: '404', status: 404 },
] as const;

/** Opens a path and waits until it is usable: loaded, flagged as scripted (no script failed), and the first-visit veil gone. */
export async function visit(page: Page, path = '/') {
  const response = await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-js', '');
  await expect(page.locator('.veil')).toBeHidden();
  return response;
}

/** Waits for the longest motion the site can still be playing (--dur-5 plus five staggers, read from its tokens) so an absence can be asserted. */
export async function quiet(page: Page): Promise<void> {
  const ms = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string) => parseFloat(style.getPropertyValue(name)) || 0;
    return token('--dur-5') + 5 * token('--stagger');
  });
  await page.evaluate((wait) => new Promise<void>((resolve) => setTimeout(resolve, wait)), ms + 150);
}

export const sampleDialog = (page: Page) => page.locator('#dlg-sample');
export const earlyDialog = (page: Page) => page.locator('#dlg-early');

/** The pop-up is open, fully in place and its module has mounted. */
export async function expectOpen(dialog: Locator) {
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-state', 'open');
  await expect(dialog).toHaveAttribute('data-module', 'ready');
}

export async function expectClosed(dialog: Locator) {
  await expect(dialog).toBeHidden();
  await expect(dialog).not.toHaveAttribute('open', /.*/);
}

/**
 * Waits until the page has stopped scrolling: the same position on three reads in a row. The reads come from Node, not from a timer in the page, so it also works
 * with JavaScript switched off (page timers and animation frames do not run then).
 */
export async function settled(page: Page) {
  let last = Number.NaN;
  let stable = 0;
  await expect
    .poll(
      async () => {
        const y = await page.evaluate(() => scrollY);
        stable = Math.abs(y - last) < 0.5 ? stable + 1 : 0;
        last = y;
        return stable >= 3;
      },
      { intervals: [40], timeout: 15_000, message: 'the page kept scrolling' },
    )
    .toBe(true);
}

/** Jumps to the very end of the page (no smooth scroll) and waits for it to stop. The reveal footer only uncovers itself there. */
export async function scrollToEnd(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await settled(page);
}

const keyboardScrollers = new WeakSet<Page>();

/** How this page is being scrolled by the suite: real wheel events, or real key presses where the engine cannot do a wheel (mobile WebKit). */
export const scrollInput = (page: Page): 'wheel' | 'keys and scrollBy' => (keyboardScrollers.has(page) ? 'keys and scrollBy' : 'wheel');

/**
 * A real wheel event over the middle of the window. Playwright cannot send a wheel to mobile WebKit ("Mouse wheel is not supported in mobile WebKit"), so there the same
 * distance is scrolled with real Page Up / Page Down key presses for long moves and the browser's own smooth scroll (window.scrollBy) for short ones. Both go through
 * the browser's scroller, which is what the scroll timelines and observers react to, but neither is a wheel or touch inertia: see scrollInput() and the report.
 */
export async function wheel(page: Page, deltaY: number) {
  const size = page.viewportSize();
  if (!keyboardScrollers.has(page)) {
    try {
      if (size) await page.mouse.move(size.width / 2, size.height / 2);
      await page.mouse.wheel(0, deltaY);
      return;
    } catch (error) {
      if (!/not supported/i.test(String(error))) throw error;
      keyboardScrollers.add(page);
    }
  }
  const height = size?.height ?? 700;
  if (Math.abs(deltaY) >= height * 0.8) {
    const key = deltaY > 0 ? 'PageDown' : 'PageUp';
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
    for (let i = 0; i < Math.max(1, Math.round(Math.abs(deltaY) / (height * 0.875))); i++) await page.keyboard.press(key);
  } else {
    // Arrow keys do not scroll mobile WebKit under Playwright, so a short move is the browser's own smooth scroll, started from script.
    await page.evaluate((dy) => window.scrollBy({ top: dy, behavior: 'smooth' }), deltaY);
  }
}

/**
 * Presses Tab. macOS WebKit does not Tab to links unless "Press Tab to highlight each item" is on (Option+Tab does the opposite), so for WebKit this presses
 * Option+Tab, which walks the same links and controls the other engines' Tab does. A Safari user with the default setting has to do the same to reach any link.
 */
export async function tab(page: Page, { shift = false } = {}) {
  const webkit = page.context().browser()?.browserType().name() === 'webkit';
  await page.keyboard.press(`${webkit ? 'Alt+' : ''}${shift ? 'Shift+' : ''}Tab`);
}

/**
 * One real wheel turn, then wait until the scroll it caused has finished. The browser starts the smooth scroll a frame or two after the input, so "has not moved yet"
 * is not "has stopped": wait for the first movement (or for the page to be at an end already), then for the stop.
 */
export async function wheelStep(page: Page, deltaY: number) {
  const from = await page.evaluate(() => scrollY);
  await wheel(page, deltaY);
  await expect
    .poll(() => page.evaluate((y) => Math.abs(scrollY - y) > 0.5 || scrollY + innerHeight >= document.documentElement.scrollHeight - 2 || scrollY <= 0, from), { intervals: [30], timeout: 3000 })
    .toBe(true)
    .catch(() => undefined); // a wheel that moved nothing is reported by the caller, which knows where it expected to end up
  await settled(page);
}

/** Scrolls to the end of the page with real wheel events, a screenful at a time. */
export async function wheelToEnd(page: Page, step = 900) {
  for (let turn = 0; turn < 120 && !(await atBottom(page)); turn++) await wheelStep(page, step);
  expect(await atBottom(page), 'wheel scrolling reached the end of the page').toBe(true);
}

export const atBottom = (page: Page) => page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2);

/**
 * Whether the element can be used where it stands: all of it inside the window and inside its scrolling box, and the point at its centre really reaches it
 * (nothing sticky or floating on top). Returns what is wrong, or an empty string.
 */
export async function whyNotReachable(el: Locator, boxSelector?: string): Promise<string> {
  return el.evaluate((node, selector) => {
    const rect = node.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const height = innerHeight;
    const box = selector ? node.closest(selector)?.getBoundingClientRect() : undefined;
    const limits = {
      top: Math.max(0, box?.top ?? 0),
      bottom: Math.min(height, box?.bottom ?? height),
      left: Math.max(0, box?.left ?? 0),
      right: Math.min(width, box?.right ?? width),
    };
    if (rect.width === 0 || rect.height === 0) return 'no box';
    const problems: string[] = [];
    if (rect.top < limits.top - 0.5) problems.push(`starts ${Math.round(limits.top - rect.top)}px above the visible area`);
    if (rect.bottom > limits.bottom + 0.5) problems.push(`ends ${Math.round(rect.bottom - limits.bottom)}px below the visible area (visible area ends at ${Math.round(limits.bottom)})`);
    if (rect.left < limits.left - 0.5 || rect.right > limits.right + 0.5) problems.push('sticks out sideways');
    const hit = document.elementFromPoint(rect.left + rect.width / 2, Math.min(Math.max(rect.top + rect.height / 2, 0), height - 1));
    if (!hit || !(node === hit || node.contains(hit))) problems.push(`covered by <${hit?.tagName.toLowerCase()} class="${hit?.className}"> at its centre`);
    return problems.join('; ');
  }, boxSelector);
}

/** Reads storage and cookies in one comparable object. */
export async function storageSnapshot(page: Page) {
  return page.evaluate(async () => {
    const dump = (store: Storage) => Object.fromEntries(Array.from({ length: store.length }, (_, i) => [store.key(i) ?? '', store.getItem(store.key(i) ?? '')]));
    const databases = 'databases' in indexedDB ? (await indexedDB.databases()).map((d) => d.name ?? '') : [];
    const caches_ = 'caches' in window ? await caches.keys() : [];
    return { local: dump(localStorage), session: dump(sessionStorage), cookie: document.cookie, indexedDB: databases, caches: caches_ };
  });
}

export interface TextScan {
  checked: number;
  offenders: { tag: string; className: string; text: string; opacity: number; top: number }[];
}

/**
 * Runs inside the page. Looks at every heading, paragraph and [data-reveal] block that is on screen with its top edge in the upper `topLimit` share of the window
 * (the bottom of the window is where reveals are still arriving, so a block there may legitimately still be fading in) and reports the ones whose real
 * opacity (its own times every ancestor's) is at or below 0.5. Blocks that are not meant to be seen are left out: hidden, inert, aria-hidden, visually hidden,
 * inside a closed dialog or a closed disclosure, and the bankroll plot (drawn by scroll position). With `wholePage` the whole document is checked instead of the window.
 */
export function scanText({ topLimit, wholePage = false }: { topLimit: number; wholePage?: boolean }): TextScan {
  const offenders: TextScan['offenders'] = [];
  let checked = 0;
  const height = window.innerHeight;
  for (const el of document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6,p,[data-reveal]')) {
    if (el.closest('[hidden],[aria-hidden="true"],[inert],dialog:not([open]),.visually-hidden,noscript,template')) continue;
    if (el.closest('details:not([open])') && !el.closest('summary')) continue;
    // The bankroll plot is drawn by the scroll position on purpose: its end label appears when the line has finished drawing. It has its own test.
    if (el.closest('[data-draw]')) continue;
    // A section that loads its own stylesheets when the visitor nears it (data-sheets, the Showdown table) shows nothing until they are in. Checked once loaded instead.
    if (el.closest('[data-sheets]:not([data-ready],[data-static])')) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (!wholePage && (rect.bottom <= 0 || rect.top >= height || rect.top > height * topLimit)) continue;
    checked += 1;
    let opacity = 1;
    for (let node: Element | null = el; node; node = node.parentElement) opacity *= parseFloat(getComputedStyle(node).opacity);
    if (opacity <= 0.5) {
      offenders.push({ tag: el.tagName.toLowerCase(), className: el.className.toString().slice(0, 60), text: (el.textContent ?? '').trim().slice(0, 50), opacity: Math.round(opacity * 100) / 100, top: Math.round(rect.top) });
    }
  }
  return { checked, offenders };
}

/** Which reveal mechanism this engine is running: the CSS scroll timeline, or the one-shot observer fallback. Both are only live under no-preference motion. */
export async function revealMechanism(page: Page): Promise<'scroll-timeline' | 'observer-fallback' | 'none (reduced motion)'> {
  return page.evaluate(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none (reduced motion)' as const;
    return CSS.supports('animation-timeline', 'view()') ? ('scroll-timeline' as const) : ('observer-fallback' as const);
  });
}

/**
 * A double-click the way a hand makes it: press and release, about a tenth of a second, press and release again with the click count at 2.
 * Playwright's own dblclick sends both within a millisecond, before the first click's effects (a pop-up mounting, a view painting) have happened; this one does not.
 * The pause is the input being simulated, not a wait for the page.
 */
export async function humanDoubleClick(page: Page, target: Locator, gapMs = 150) {
  await target.scrollIntoViewIfNeeded();
  // Raw coordinates, so wait the way a click would: until the target has stopped moving (a sheet sliding in, a view fading up).
  let last = '';
  let same = 0;
  await expect
    .poll(
      async () => {
        const box = await target.boundingBox();
        const now = box ? `${box.x.toFixed(1)},${box.y.toFixed(1)},${box.width.toFixed(1)},${box.height.toFixed(1)}` : 'none';
        same = now === last && now !== 'none' ? same + 1 : 0;
        last = now;
        return same >= 3;
      },
      { intervals: [60], timeout: 8000, message: 'the double-click target never stopped moving' },
    )
    .toBe(true);
  const box = (await target.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down({ clickCount: 1 });
  await page.mouse.up({ clickCount: 1 });
  await page.waitForTimeout(gapMs);
  // One press and release that carries click count 2, as the second half of a real double-click does. (mouse.click with clickCount 2 would send a click 1 first.)
  await page.mouse.down({ clickCount: 2 });
  await page.mouse.up({ clickCount: 2 });
}

/**
 * Brings the closing band's button into use the way a visitor meets it. On a wide window the band is the top of the reveal footer, uncovered only at the very end of
 * the page. On a phone the footer is in the flow and taller than the window, so the band is above the end and is scrolled to.
 */
export async function reachClosing(page: Page, button: Locator) {
  await scrollToEnd(page);
  await button.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await settled(page);
  await expect.poll(() => whyNotReachable(button), { message: 'the closing button is not reachable', timeout: 6000 }).toBe('');
}
