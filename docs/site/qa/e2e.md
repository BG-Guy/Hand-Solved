# HandSolved end-to-end tests (T31)

Run 2026-11-01 against the built site that was already serving at `http://127.0.0.1:4321` (`astro preview`: real CSP meta tag, real 404). The server was not started, stopped or restarted, and nothing in `src/` was changed. The `dist/` build did not change during the runs (the lazy chunk kept the same hash throughout).

Playwright `@playwright/test` 1.64.1 (exact, dev dependency, installed under the `.npmrc` rules; it was published 2026-10-14, 18 days old; the install adds `@playwright/test`, `playwright` and `playwright-core` to the lockfile and nothing else; `npm audit` reports one moderate issue, in `fast-uri`, which was already there and comes in through Astro's tree). Browsers from `npx playwright install chromium webkit firefox`. Machine: macOS 26.6.2, Apple M5, Node 24.14.1. The whole suite takes about 7.5 minutes with 4 workers.

## Result at a glance

141 tests per project, 564 runs in all. **528 passed, 7 failed, 29 skipped on purpose.** The 7 failures are 2 real site bugs, listed below. No assertion was loosened to get a pass; where a test was wrong, the test was corrected (see "Corrections to the tests themselves").

| Project | Engine | Window | Passed | Failed | Skipped | Failures are |
| --- | --- | --- | --- | --- | --- | --- |
| desktop-chrome | Chromium 156.0.8078.4 | 1280 x 800 | 133 | 1 | 7 | E2E-01 |
| mobile-chrome | Chromium 156 (Pixel 5: touch, 2.75 ratio) | 393 x 727 | 130 | 4 | 7 | E2E-01, E2E-02 (3 tests) |
| mobile-safari | WebKit 27.2 (iPhone 14 metrics, touch) | 390 x 664 | 132 | 1 | 8 | E2E-01 |
| desktop-firefox | Firefox 157.0 | 1280 x 800 | 133 | 1 | 7 | E2E-01 |

Skips are by design: the header button and the wide-window nav links are not drawn on phones, the mobile bar and the burger menu button are not drawn on desktop, and the phone-size sweep runs once (Chrome).

**Stability**: two complete runs of the final suite (7 min 30 s each) gave identical outcomes for all 564 tests, none flaky, and the run before them differed only in tests that were then corrected. Nothing is quarantined or marked `fixme`.

| Severity | Count | Findings |
| --- | --- | --- |
| CRITICAL | 0 | None |
| HIGH | 0 | None |
| MEDIUM | 2 | E2E-01 double-click on the burger closes the menu again, E2E-02 first answer is below the fold on phone windows 700 to 810 px tall |
| LOW | 0 | See "Observations" |

---

## E2E-01 MEDIUM: a double-click or double-tap on the burger opens the menu and closes it again

- **Where**: `src/components/Navbar/Navbar.ts:133-138`. The menu's click handler closes the panel on any click on `[data-nav-close]` and has no `event.detail` check. The early return at `Navbar.ts:116` (`!menu.dataset.state`) swallows only a click that arrives in the first two frames, which is why Playwright's instant `dblclick()` passes and a hand-paced one does not.
- **Problem**: the Close button (`Navbar.astro:54`, 44 x 44, x 333 to 377, y 26 to 70 at 393 wide) is drawn on the right half of the burger's footprint (x 297 to 376, same y). In the open menu, the second click of an ordinary double-click lands on it. The visitor sees the menu flash open and shut. This is the same mistake the pop-ups had (their `detail < 2` guard at `Dialog.ts:211` and `SampleHandDialog.ts:192` holds, see the passing list).
- **Verified**: all four projects fail it (the test runs at 390 px wide in each, so Firefox and desktop Chrome count too). Event log from a Pixel 5 emulation, second click 150 ms after the first:

  ```
  66ms  click detail=1  target=span.nav__toggle-text        (the burger's "Menu" word)
  94ms  nav-menu open, data-state=open
  226ms click detail=2  target=button.nav__toggle.nav__menu-close "Close menu"
  816ms nav-menu close event                                (menu is closed, nothing else is open)
  ```

- **Reproduce**: `npx playwright test tests/e2e/navigation.spec.ts -g "slow double-click on the burger"`. By hand: below 1024 px wide, double-click "Menu" (the text, not the three-line icon).
- **Screenshots**: `docs/site/qa/e2e-screens/menu-closed-burger.png` and `docs/site/qa/e2e-screens/menu-open-x-at-burger.png` (the X where the burger was).
- **Fix** (not applied): in that handler, `if (e.detail > 1) return;` before the `closest` lookup, as `Dialog.ts` does. `event.detail` on touch taps varies by browser, so also ignore clicks for about 400 ms after `data-state` becomes `open`, or move the Close button out of the burger's footprint. Re-run the command above.

## E2E-02 MEDIUM: the first answer button is below the visible area when the sample hand opens, on phone windows 700 to 810 px tall

- **Where**: `src/components/SampleHandDialog/SampleHandDialog.css:1033` and `:1041-1066` switch to the compact phone layout (table 207 px instead of 253, footnote strip hidden in the choose view, tighter gaps) only at `max-height: 43.75rem` (700 px). `SampleHandDialog.ts:21` uses the same 700 px for the intro disclosure.
- **Problem**: from 701 px of window height up, a phone gets the full layout, in which the first answer ends at about 728 px and the 83 px footnote strip is kept. The answers only clear the strip from about 812 px. Between those heights the buttons sit under the strip or past it, and the "Pick your move" cue appears over the question text instead. The cue is a fallback (one tap scrolls the answers in), so the sample hand is not blocked, but the brief's rule "the first answer is visible on open" does not hold for common windows such as a Pixel 5 (393 x 727) or an Android with its toolbar showing (360 x 740, 412 x 780).
- **Verified** (Chromium 156, touch emulation; "hidden" is how far the first answer extends below the dialog body's visible area):

  | Window | First answer |
  | --- | --- |
  | 360 x 568 and 393 x 568 | 89 to 90 px hidden |
  | 360 x 640 | 17 px hidden |
  | **375 x 667 (brief)** | on screen |
  | 390 x 664 (iPhone 14 as Playwright sizes it, run in WebKit) | on screen |
  | 360 x 700 and 393 x 700 | on screen |
  | **393 x 727 (Pixel 5)** | **85 px hidden: the whole button is out of sight** |
  | 360 x 740 | 70 px hidden |
  | 412 x 780 | 15 px hidden |
  | 390 x 844, 412 x 915 | on screen |

  The "Pick your move" cue is showing at every failing size in the sweep.   The two sizes in the brief, 375 x 667 and 1280 x 800, pass for all three hands in all four engines.
- **Reproduce**: `npx playwright test tests/e2e/sample-hand.spec.ts -g "first answer on screen at real phone sizes" --project=mobile-chrome`. Failing tests: "at this project's own window size", "across common phone windows", and "the pop-up reaches its last hand ... (closing button)" (the same defect, reached from the closing band).
- **Screenshots**: `docs/site/qa/e2e-screens/sample-hand-open-393x727.png` (fails) and `docs/site/qa/e2e-screens/sample-hand-open-375x667.png` (passes).
- **Fix** (not applied): raise the compact breakpoint from 700 px to about 52rem (832 px) in `SampleHandDialog.css:1033`, `:1041` and `SampleHandDialog.ts:21`, or size the table from `svh`. Re-run the sweep.

---

## Observations (no failing test, worth knowing)

- **The reveal fallback was exercised in a real engine, and it works.** Firefox 157 has no `animation-timeline: view()`, so it ran `reveal-fallback.ts`: `html.reveal-io` armed itself, no scroll-timeline animation existed, and scrolling `/` and `/gto-hand-review` down and back up with real wheel events never left a heading, paragraph or reveal block at opacity 0. All content showed with JavaScript off and with reduced motion. WebKit 27.2 supports scroll timelines, so it took the CSS path (the "Safari below 26" case cannot be reproduced here, see "Could not be tested").
- **The bankroll draw finishes later on phones than MOTION.md E24 says.** While the mobile bar shows, `MobileCtaBar.css` sets `scroll-padding-bottom` (89 px), and a view timeline's automatic inset follows scroll padding, so every scroll-linked range starts about 85 px late. Measured on a 393 x 727 window: the "+733 bb" label is complete when the plot's top edge reaches about 22 to 25 percent of the window height; with `scroll-padding-bottom` forced to 0 in the page it completes at 37 percent, as designed. Nothing is lost (the figure is also in the KPI tile and the chart summary), but a visitor who stops with the plot lower sees a half-drawn chart and no label. The text scan leaves the plot out for this reason, and a separate test checks that the draw completes.
- **A request does fire near submit, but it carries nothing.** With the pointer on the Submit button, the success step's "Grade another sample hand" button appears under it and `Dialog.ts` warms that pop-up's chunk on pointer intent: `GET /_astro/SampleHandDialog.*.js` (and `format-amount.*.js` in WebKit). It is the same static file any visitor fetches on first open. Submitting by keyboard with the pointer parked outside the pop-up fires no request at all (all four engines), and in every case there is no POST, no query string, no other origin and no `fetch`, XHR or beacon call. The browser also refuses all three outright under `connect-src 'none'` (verified, with the violation reports).
- **The second click of a double-click can still toggle a native disclosure.** The `detail > 1` guard stops the site's own handlers, but a `<summary>` under the pointer (for example "What am I looking at?" in the sample hand) toggles natively. Seen once, from the mobile menu's button. Cosmetic.
- **The preview server is not GitHub Pages.** `/gto-hand-review/` and `/privacy/` return Astro's bare 404 page ("trailingSlash is set to never") where Pages serves `404.html`, and on this case-insensitive macOS disk `/PRIVACY` returns 200. The trailing-slash test therefore asserts the status only.
- **Playwright's WebKit does not Tab to links** (Safari's default: "Press Tab to highlight each item" is off). The suite presses Option+Tab there. A keyboard user on a default Safari can reach links only the same way, so the skip link and the footer links are an Option+Tab affair in Safari, which is the platform's choice, not the site's.

---

## What was covered, by flow

Specs are in `tests/e2e/`, helpers in `tests/e2e/support/`. Counts are for one project (desktop-chrome, 141 tests); the other projects run the same set.

| Flow (TASKS.md T31, brief) | Spec | Result |
| --- | --- | --- |
| 1 Navigation: navbar links to the right sections and pages (heading below the fixed header, `aria-current` follows); mobile menu opens, Tab and Shift+Tab never leave it, Esc and the X close it and return focus to the burger; an in-page menu link closes it, focus is not on the burger and the next Tab lands inside the target section, the menu works again afterwards; closes by itself past 1024 px; skip link is the first Tab stop, shows on focus, jumps to `<main>` | `navigation.spec.ts` | pass, except E2E-01 |
| 2 Every main button opens its pop-up: hero, header, story, numbers, closing band, mobile bar (and the menu's button, and the two pricing buttons). Each as a click, a Playwright double-click and a hand-paced double-click. Dialog stays open, no `close` event, nothing answered. Esc and the X close, focus returns (hero if the bar slid away), backdrop closes on wide windows and not on a phone sheet, Tab never reaches the inert page | `dialogs.spec.ts` | pass |
| 3 Sample hand: first answer fully on screen for all 3 hands at 375 x 667 and 1280 x 800 (open, Deal next, reopen); every option of every hand, clicked as an answer, shows the right grade and score, sentence, frequency, worth and given-up in BB and in $ (expected text worked out from `src/data/demo-spots.json`, never typed in); every other row as a what-if; Deal next once and under a double-click; answer under a double-click; Start over; finished set restarts at hand 1; BB/$ switch in the pop-up and on the page, remembered after reload | `sample-hand.spec.ts` | pass, except E2E-02 |
| 4 Early access: plan chip from Free, Pro monthly, Pro yearly; empty and 8 kinds of invalid address each get their own message; typo hint never blocks; success step (waited for, it mounts after the fade) with the concept note and the address; no request on submit; fetch, XHR, beacon refused by the CSP; storage, cookies, IndexedDB and caches byte-identical before and after; value cleared after success, Esc and the X; hand-off to and from the sample hand with focus returned | `early-access.spec.ts` | pass |
| 5 Pricing: monthly $34, yearly $27 with "Billed yearly at $324", Free $0, "Concept pricing" label and note at all times, saving $84, keyboard operable | `pricing.spec.ts` | pass |
| 6 Reveal footer: at the end of the page (real scrolling), every footer link visible, would take a click, takes focus; concept note and the legal links visible; closing band usable; tabbing in from the top brings each link into view; wide windows show the whole footer at once, phones read it by scrolling | `footer.spec.ts` | pass |
| 7 Six pages: status, one H1, title, no console errors, no CSP violations, no failed or 4xx requests, no broken drawn images, nothing off-origin; unknown URL returns the 404 page with status 404, `noindex` and a way home; no sideways scroll at 320 and 375 on all six (also with both pop-ups open at 320); sitemap, robots, manifest, icons answer | `pages.spec.ts` | pass |
| 8 Reduced motion: whole document opaque on arrival, veil absent, no reveal start poses or animations, instant anchor scrolling, no digit wheels; sample hand, early access, menu and double-click work; footer in flow | `reduced-motion.spec.ts` | pass |
| 9 JavaScript off: no script flag, text readable all the way down, pricing text and switch, FAQ opens natively, every sample-hand button hidden with a visible "Read a worked example" link to `/gto-hand-review#worked-example` on all six pages, the link works, and the worked example's numbers match `demo-spots.json` | `no-js.spec.ts` | pass |
| 10 Scroll reveal: `/` and `/gto-hand-review`, down and back up with real wheel events, polling after each stop; no heading, paragraph or reveal block in the top 60 percent of the window stays at or below opacity 0.5; whole page checked at the end; the bankroll draw finishes; which mechanism ran is recorded in the test annotations | `scroll-reveal.spec.ts` | pass |

Every test also runs with an automatic watcher that fails it on any uncaught page error, CSP violation or console error, whatever the test was checking.

## How the tests are built

- **Waits are conditions** (an attribute, a position that stopped moving, text that appeared). Two timed waits exist, both documented in `support/ui.ts`: `quiet()`, used only to prove something did not happen, which waits `--dur-5` plus five `--stagger` from the site's own tokens (about 1.2 s), and the 150 ms gap inside `humanDoubleClick`, which is the input being simulated.
- **Two kinds of double-click.** Playwright's `dblclick()` sends both clicks within a millisecond, before the first click's effects exist. `humanDoubleClick` presses, waits 150 ms, then sends one press with click count 2, after the target has stopped moving. E2E-01 is only visible to the second kind.
- **Expected sample-hand text** comes from `support/sample.ts`, an independent formatter (whole cents, half up, real minus sign, cents only when the figure has them), not an import of the site's formatter.
- **Scroll input**: real wheel events in Chromium and Firefox. Playwright refuses wheel events in mobile WebKit, so there the same distances use Page Up and Page Down keys and the browser's own smooth `window.scrollBy` (arrow keys do not scroll that WebKit). Each scroll test records which was used.
- **Config**: `playwright.config.ts` (four projects, no `webServer`, `E2E_BASE_URL` overrides the address); reports go to `playwright-report/`, `test-results/junit.xml` and `test-results/results.json` (all git-ignored).

## Corrections to the tests themselves

Failures that were the test's fault, found and fixed along the way, so nobody re-learns them: a hand-paced click built with `mouse.click({ clickCount: 2 })` sends a click 1 and a click 2, which closed pop-ups that were fine; clicking a menu item before `data-state="open"` lands (two frames) is ignored by the menu; anchor smooth-scroll starts a frame or two after the click, so "stopped moving" must follow "has moved"; the closing band and a tall footer need scrolling to, and re-centring a link in sticky mode scrolls the footer back under the page; page timers and frames do not run with JavaScript off, so scroll waits poll from Node; the plot holds a wide and a narrow drawing, only one of which is drawn; the 404 document logs its own "Failed to load resource" line in Chromium; native modal dialogs hand Tab to the browser's controls after their last button.

## Could not be tested

- **Real iOS and iPadOS Safari.** "mobile-safari" is desktop WebKit 27.2 on macOS with iPhone 14 metrics, touch and a phone user agent. Not covered: touch scrolling and momentum, the dynamic toolbar (`svh` and `dvh`), safe-area insets, double-tap zoom, the on-screen keyboard resizing the early-access sheet (`visualViewport`, `--kb-inset`), Home Screen mode, and how `event.detail` behaves on taps, which E2E-01's fix depends on.
- **Safari older than 26** (no scroll timelines). The WebKit here supports them. The fallback script ran in Firefox only.
- **Real screen readers** (VoiceOver, NVDA, JAWS, TalkBack). The suite checks roles, names, `aria-current`, `aria-pressed`, focus order and that the live-region text is set, not that anything is spoken or how.
- **Real touch gestures**: the sheet drag-to-close (`Dialog.ts:229-262`) and taps. "Touch" projects still send mouse events.
- **Real phones and other browsers**: Android Chrome, Samsung Internet, Edge, older or ESR Firefox, Firefox for Android.
- **The page-to-page view transition** (`@view-transition`): CDP automation makes it fail (MOTION.md 0.1).
- **What GitHub Pages does**: its custom 404 for `/x/`, case-sensitive URLs, cache and HTTPS headers.
- **The pop-up's chunk-load failure state** (`data-module="error"`), print styles, pixel-level visual comparison, performance numbers (T32), and the correctness of the engine's numbers (only that the page shows `demo-spots.json` faithfully).

## Run it

```bash
npm run build && npm run preview     # the site on 4321 with the real CSP (already running when this was written)
npm run test:e2e                     # all four projects
npx playwright test --project=desktop-firefox
npx playwright test tests/e2e/footer.spec.ts
npx tsc -p tests/e2e --noEmit        # type-check the tests (the root tsconfig covers src/ only)
npx playwright show-report
npx astro preview stop               # when finished
```

## Files added or changed

`package.json` (the dev dependency and `"test:e2e": "playwright test"`), `package-lock.json`, `playwright.config.ts`, `tests/e2e/*.spec.ts` (10 specs), `tests/e2e/support/` (`fixtures.ts`, `ui.ts`, `sample.ts`, `env.d.ts`), `tests/e2e/tsconfig.json`, this file and `docs/site/qa/e2e-screens/` (4 screenshots). Nothing under `src/`, `dist/` or the server was touched. No commit, no deploy.
