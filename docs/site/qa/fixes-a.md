# Fixes A: interactions (pop-ups, mobile bar, unit switch, menu)

Role: frontend-builder. Written 2026-11-01. Scope: `docs/site/qa/conversion.md`, `typescript-review.md` and `a11y.md`, the findings on pop-ups, the mobile bar, the BB/$ switch and the menu. Another builder owned content, sections, pages and shared CSS at the same time, so nothing outside the files named below was edited.

Checked on a private build (`astro build --outDir scratchpad/fixa-dist`, served on 127.0.0.1:4361 with the real CSP meta tag; no style attributes, no CSP errors in any run). `astro check`: 0 errors, 0 warnings, 0 hints. The server on 4321 was not touched.

## Result

| Source | Findings | Fixed | Not fully fixed |
|---|---|---|---|
| conversion.md | H1, M1, M3, L1 (success step), L2, L3 | 6 of 6 | none |
| typescript-review.md | H1, H2, M1, M2, L1, L2 | 5 of 6 | M2: the story callout in `HowItWorks.astro` is still static text (needs `Story.astro`, see below) |
| a11y.md | A11Y-01, 02, 03, 05, 06 | 5 of 5 | none |

Measured, first answer button when a hand opens (button top and bottom in px; the visible area ends at the bottom number of "body"):

| Viewport | Hand | Before (conversion.md) | After | Fully on screen |
|---|---|---|---|---|
| 375x667 | 1 (2 options) | top 971 | 591 to 658, body ends 667 | yes |
| 375x667 | 2 (4 options) | top 827 | 591 to 658, body ends 667 | yes |
| 375x667 | 3 (5 options) | top 851 | 591 to 658, body ends 667 | yes |
| 1280x800 | 1 | top 728, 18 px under | 520 to 590, body ends 710 | yes |
| 390x844 | 1, 2, 3 | 972 / 827 / 852 | 661 to 728, body ends 761 | yes |
| 768x1024, 1024x768 | 1 | not measured | 776 to 844 / 511 to 581 | yes |
| 360x640, 320x568 | 1, 2, 3 | not measured | 590 to 657 / 589 to 656, body ends 640 / 568 | no, the cue shows (below) |

Screenshots (viewport, in `scratchpad/checks/`): `fa-open-375x667-hand1.png`, `-hand2.png`, `-hand3.png`, `fa-verdict-375x667.png`, `fa-success-375x667.png`, `fa-open-1280x800-hand1.png`, `fa-open-390x844-hand1.png` (and 2, 3), `fa-open-360x640-hand3.png` (the cue), `fa-hero-chip-bb.png`, `fa-hero-chip-usd.png`. Each was opened and judged by eye.

Budgets (ARCHITECTURE section 4 and `scripts/check-dist.mjs` logic, run on the private build): home JS on load 10.29 KB gz of 11 (was 9.63), JS total 19.49 of 25 (was 18.37), CSS 25.05 of 30, HTML 24.99 of 30. Per file: `MobileCtaBar.ts` is 0.54 KB against the 0.4 in the table, and the Dialog script plus Vite's helper is 2.71 against 2.3 (it was 2.43 before); both rows are over their estimate, the section totals are inside their limits. One formatter now ships as its own shared chunk (0.37 KB), which the pop-up chunk no longer carries a copy of.

## conversion.md

### H1 (HIGH): pop-up opens with nothing to press on phones. Fixed

What changed
1. Decision first. `views.ts` `choose()` now emits heading, setup line, question, hint, buttons, then `<details class="hs-disc hs-how">` "How the hand got here" holding the hand strength and the story. `SampleHandDialog.ts` sets it closed under 768 wide and open from 1024 (matchMedia at paint; a unit change keeps the visitor's own open or closed state).
2. Footnote strip: `SampleHandDialog.css` hides `.dialog__foot` in the choose view on screens under 700 px tall (`#dlg-sample:not([data-view='verdict'])`) and keeps it in the verdict view.
3. Intro: hand 1's "What am I looking at?" starts closed on phone widths and on screens under 700 px tall, open elsewhere. This goes one step past the finding, which said under 700 px tall: at 390x844 (a common phone) the open intro still pushed hand 1's button under the footnote strip (first button 757 to 823, body ends 761), so phone widths close it too. It stays one tap away.
4. Table scene: capped at 190 px on phones under 700 px tall, with 8 px of padding instead of 16 and 8 px less above the text. A first try that also scaled the width (249 px wide) crowded the pot text over the board cards, so the cap keeps the 288 px width, and the pot text is set at `--leading-tight` and moved from 55% to 57% so the board, the pot and your cards clear each other. Looked at on all three hands. The cards keep their size (their rank is already at the 12 px floor).
5. The cue: a real `<button class="hs-cue">` "Pick your move" with the arrow icon, sticky 44 px at the bottom of the scrolling body. `SampleHandDialog.ts` watches the first answer with an IntersectionObserver rooted at the body and hides the cue once that answer is at least 95% in view; pressed, it scrolls the answers into view and puts focus on the first one. Rules it meets: no style attribute and no motion of its own (CSP and reduced motion); under reduced motion the scroll is `behavior: auto`; it is `aria-hidden` and `tabindex="-1"`, because it only repeats what the answers already offer in the Tab order and the reading order (and the regression script pins that Tab order); it only exists in the choose view.
6. The chunk-error state now hides the skeleton table too (`data-module="error"`), see TS H2.

Verified: `scratchpad/fixa/measure.mjs` (table above), the three phone screenshots, `fa-open-360x640-hand3.png` for the cue, Tab order unchanged in `dialogs-4361.mjs 375` (BB, $, intro, glossary, answers, then "How the hand got here", then Close) and in `popup-check.mjs`.

Not met: 360x640 and 320x568. At 640 the first button ends 17 px below the visible body, and at 568 it starts 21 px below it, so the cue shows there, as the finding intended for short screens. Saving more would take the header or the two disclosure rows, which this pass did not touch.

### M1 (MEDIUM): no sticky button through the pinned story. Fixed

`MobileCtaBar.ts`: `show = heroGone && !footerNear && !pricingNear && no story button on screen`; `data-slim` is set while a story crosses the middle band. `MobileCtaBar.css`: slim is a 44 px button between 6 px of padding (57 px with the hairline, 81 px full), padded by the safe-area inset, with a short transition on the padding and the button height. The bar leaves only while `[data-cta="story"]` (the red band's button) is on screen.

Verified with real scrolling at 375x667, every 150 px (`scratchpad/fixa/bar.mjs`):

| Scroll (px) | Bar |
|---|---|
| 0 to 450 | hidden (hero button) |
| 600 to 750 | full, 81 px |
| 900 to 3150 | slim, 57 px (the pinned story; was hidden 900 to 4200) |
| 3300 to 3900 | hidden, the story's own button is on screen |
| 4050 to 4200 | slim |
| 4350 to 12900 | full |
| 13050 to 14850 | hidden, pricing at least 40% in view (L2) |
| 15000 to 15450 | full |
| 15600 to end | hidden (footer, unchanged) |

No row had the bar visible while the story button was on screen or pricing was 45% or more in view. `data-hides-mobile-bar` keeps its name and now means "slim over this story".

### M3 (MEDIUM): opponent cards and dealer chip over your cards. Fixed

`SampleHandDialog.css`, phone widths only: `.tb__hole--opp:is(.a1, .a7)` at 0.98 of the seat radius horizontally and 0.42 vertically (outside your cards' span), and `.tb__dealer:is(.a0, .a1, .a7)` at 0.95 radius. a0 is included because in hand 3 you hold the button and the chip sat on your left card's corner. Checked by eye at 375 on all three hands (`fa-open-375x667-hand1.png` to `hand3.png`): your cards are clear in each. Desktop is unchanged (the rule is under `max-width: 47.99rem`).

### L1 (LOW, success step only): Fixed

`EarlyAccessDialog.astro`: heading "Address checked. Nothing was sent.", the body sentence kept, the grey `ConceptNote` line deleted (and its import). Pricing was not touched (other builder). Verified in `fa-success-375x667.png` and by the updated regression assertions. Open for the copywriter: the heading and the address line below it now both start with "Address checked.".

### L2 (LOW): bar over the pricing buttons. Fixed

`MobileCtaBar.ts` observes `#pricing` and hides the bar while at least 40% of the screen, or of the section if it is shorter, is covered (101 thresholds; a plain ratio can never reach 40% on a phone because the section is taller than the screen). See the scroll table, 13050 to 14850.

### L3 (LOW): "Get early access" wrapped. Fixed

`.hs-btn { padding-inline: var(--space-md) }` under 480 px. Label unchanged. Verified with a text-range line count at 375x667: both pinned buttons are one line (`fa-verdict-375x667.png`).

## typescript-review.md

### H1: double-click on a CTA closes the pop-up. Fixed
`Dialog.ts`: the backdrop-close branch adds `event.detail < 2`. Verified at 1280x800: after a real double-click the pop-up is still open 2.2 s later, and a single click on the backdrop still closes it.

### H2: one failed chunk disables a pop-up. Fixed, with one change to the proposed fix
Applied as written: `warm()` clears `slot.module` on failure, `mountModule()` marks every attempt `loading` and shows `[data-error]` in place of `[data-stage]`; the error heading takes focus (as `fail()` already does). Added: Chrome keeps a failed `import()` for the life of the page and rejects the same address again without a request (checked: second import rejected with no network request, the same address with `?retry=1` loaded), so the proposed "do not cache the failure" alone would still not retry. `load()` therefore asks for the failed address, taken from the error text, under `?retry=n` (same origin, `script-src 'self'`); where the message has no address it falls back to the plain import. `data-module="error"` also hides the empty table and the intro in CSS. Verified by aborting the first chunk request: the box shows its message with focus on it, no skeleton; close and reopen makes a second request and the hand loads (`module="ready"`, options present).

### M1: double-click on "Deal next hand". Fixed
`SampleHandDialog.ts`: the delegated click handler returns on `event.detail > 1`. Verified at 1280x800 with a real double-click: the dialog is on hand 2, choosing, with no verdict.

### M2: two amount formatters. Fixed, apart from one callout
- One implementation: `format-amount.ts` gains `usdDecimals: 'exact'` and `bbDecimals: 0 | 1`; `SampleHandDialog/format.ts` `money()` is now a one-line wrapper over it (its own `group` and rounding are gone). `Amount.astro` prints `data-bb-decimals`, and `UnitSwitch.ts` reads `exact` and `bb-decimals`, so build and browser agree.
- Build-time check: new `src/scripts/format-check.ts`, imported by `Hero.astro` and `HowItWorks.astro` so every home build runs it. For every dollar figure in `demo-spots.json` (pots, to-call, worth, given up, label amounts), in both units, signed or not, whole or tenths, it asserts: dollars read back equal the JSON figure to the cent, big blinds are within half a step of the figure over the big blind, the number survives a `data-bb` attribute, and the page's formatter gives the same text as `money()`. It also pins hand 1's call to COPY.md: `65 bb` / `$130` and `−62.6 bb` / `−$125.24`, and it exports `sampleCall` (65 and −62.62 big blinds), so Hero no longer holds typed numbers.
- Hero: the pen chip's "Call 65 bb" and the worth line are `<Amount>`s from `sampleCall` (`usdDecimals="exact"`). Verified at 1280x800: dollar view reads "Call $130" and "Calling here is worth −$125.24", the same text as the pop-up's verdict sentence; back in big blinds "Call 65 bb" and "−62.6 bb" (`fa-hero-chip-bb.png`, `fa-hero-chip-usd.png`). The chip's markup now follows `Amount` (data on `.num`, figure in `.num__v`), which is what the roll motion expects.
- Not done: the Coach step's callout "You: Call 65 bb" in `HowItWorks.astro`. `Story.astro` prints a callout as plain text, so a live number cannot be passed through it from `HowItWorks.astro`. `HowItWorks.astro` now builds the text from the same data (`Call ${formatAmount(sampleCall.bb, 'bb')}`), so the figure is no longer typed there. To make it follow the switch, `Story.astro` needs about three lines: add `delBb?: number` to `StoryCallout`, and in the callout markup print `<del class="pen">{callout.del}{callout.delBb !== undefined && <> <Amount bb={callout.delBb} usdPerBb={...} usdDecimals="exact" /></>}</del>`, then pass `delBb: sampleCall.bb` from `HowItWorks.astro` with `del: 'Call'`. Beside it the phone screenshot stays in big blinds ("App screens are shown in big blinds"), so the chip and the picture would then differ in dollar view, which the owner should accept first.
- The 14 bb-only strings on `/gto-hand-review` stay as they are (intended).

### L1: hand-off springs from the top-left corner. Fixed
`Dialog.ts`: `const anchor = trigger.getClientRects().length ? trigger : (returnTo ?? trigger)`. Verified: after sample verdict then "Get early access", the spring origin equals the hero button's centre (it used to equal `-offsetLeft/-offsetTop`).

### L2: early-access submit before its module mounts. Fixed
`Dialog.ts` close handler (capture phase) calls `dialog.querySelector('form')?.reset()`. Verified by holding the module request, typing an address and pressing Enter: the box closes, and after release and reopen the field is empty.

## a11y.md

### A11Y-01 (HIGH): the bar hides focused controls. Fixed
`MobileCtaBar.css`: bar height defined once on `:root` (`--bar-pad-y`, `--bar-pad-y-slim`, `--mobile-bar-h`, `--mobile-bar-h-slim`; the local copy on `.mobile-bar` is gone), and under 768 wide `html:has(.mobile-bar[data-visible])` gets `scroll-padding-bottom` of the bar height plus `--space-sm`, with a second rule for `[data-slim]` (89 px full, 65 px slim, read back at runtime). Verified with section A of `a11y/misc.mjs` against 4361: fully hidden stops 0 at 375x812 (was 2), 0 at 320x568 (was 6), 0 at 390x664 (was 3). A few stops are still partly under the bar (1, 2 and 4 stops); 2.4.11 only fails when a control is entirely hidden. Sections B and C of the script ran clean (no horizontal scroll, no long animations); section D of that script calls `addStyleTag`, which the real CSP blocks, so the hit area was measured separately (A11Y-05).

### A11Y-02: BB/$ names. Fixed
`UnitSwitch.astro`: the `aria-label` is gone; the buttons are "BB" and "$" followed by visually hidden ", big blinds" and ", dollars", built from the existing `unitSwitch` data (no edit to `site.ts`). Read back: "BB, big blinds" and "$, dollars", also in the pop-up header. COPY.md updated.

### A11Y-03: menu link sends focus to the burger. Fixed, beyond the proposed code
The proposed handler change alone did not work: a modal dialog's own close hands focus back to the burger. `Navbar.ts` now keeps a `viaLink` flag and, for a close that follows a link, makes the burger `inert` for that one `menu.close()` (so the browser cannot focus it) and clears it in the close handler. Esc and the X are unchanged. Verified with `a11y/dialogs.mjs 375` (T2): after "How it works", `location.hash` is `#how`, focus is not on the burger, and the next Tab lands on "Record a hand at the table", the first control inside `#how` (before: the hero button, scroll back to 289). Esc still returns focus to the burger.

### A11Y-05: unit switch 36 px tall. Fixed
`UnitSwitch.css`: the `::after` hit-area extension applies to every `.unit-switch__btn` (the pop-up header keeps its larger 8 px extension). Measured at 1280x800: the page switches are 36 px tall and hit-test as the button 3.5 px above and below (44 px). The pop-up's compact switch is still checked by the 44 x 44 corner probe in `popup-check.mjs`.

### A11Y-06: announcement outside the open modal. Fixed
`UnitSwitch.ts` `speak()` writes to `dialog[open] [role="status"]` when a pop-up is open, else to the page's region. Verified: with the sample hand open, pressing `$` puts "Amounts now shown in dollars." in the pop-up's own region and leaves the page region empty.

## Regression scripts

- `scratchpad/checks/popup-check.mjs` (895 checks, against a private copy of the tree that adds the test page, served on 4362): 875 pass, 20 fail. The same 20 fail, with an identical list, when the unmodified script is run against a build of the sources as they were before these fixes, so none comes from this work:
  - 16 "no style attribute but the bars' --f": after a what-if row the "You" tag carries `--fx` and `--fy`, set through `el.style.setProperty` by the E35 tag flight added after the script was written. That is CSSOM, which the CSP allows (no CSP error in the same run).
  - 4 "valid address accepted": the script calls `isVisible` straight after submit, but the success step now mounts after the form's fade (E36, `--dur-1`).
  Left as they are, because no finding changed that behaviour. Assertions I did update, both for conversion L1: the success heading is now "Address checked. Nothing was sent." (was "That address works"), and the grey concept-note line is now expected to be absent (was expected to be present).
- `scratchpad/a11y/misc.mjs` (section A) and `dialogs.mjs 375`, run against 4361 through copies that only change the base address (`scratchpad/fixa/misc-4361.mjs`, `dialogs-4361.mjs`): see A11Y-01 and A11Y-03. `dialogs.mjs` ran to the end with no page errors; the sample hand's Tab stops read BB, $, intro, glossary, answers, "How the hand got here", Close.
- Spot checks in `scratchpad/fixa/verify.mjs`: 19 pass (TS H1, M1, L1, L2, H2 incl. retry, A11Y-02, 05, 06, M2 both units, conversion L1, L3, no CSP or script errors). Also `measure.mjs`, `bar.mjs`, `hero.mjs` in the same folder.

## Files changed

- `src/scripts/format-amount.ts` (exact dollars, `bbDecimals`), `src/scripts/format-check.ts` (new, build time only).
- `src/components/SampleHandDialog/`: `format.ts` (wrapper), `views.ts` (decision first, story disclosure, cue), `SampleHandDialog.ts` (story and intro open state, cue observer, double-click guard), `SampleHandDialog.astro` (two sprite icons), `SampleHandDialog.css` (cue, footnote, scene cap, M3, L3, error state).
- `src/components/Dialog/Dialog.ts` (TS H1, H2, L1, L2).
- `src/components/EarlyAccessDialog/EarlyAccessDialog.astro` (success step).
- `src/components/MobileCtaBar/` (`.ts`, `.css`, `.astro` comment).
- `src/components/UnitSwitch/` (`.ts`, `.astro`, `.css`), `src/components/Amount/Amount.astro` (`data-bb-decimals`).
- `src/components/Navbar/Navbar.ts` (A11Y-03).
- `src/sections/home/Hero.astro`, `HowItWorks.astro` (amount markup only).
- Docs: `docs/site/COPY.md` (hero chip, unit switch names, pop-up order, cue, story disclosure, footnote rule, success step, formatter notes), `docs/site/COMPONENTS.md` (the `Amount` options and the mobile bar line), this file.

## For other owners

- `Story.astro` (TS M2 above), about three lines.
- `ConceptNote.astro`: its header comment still lists "the sign-up success step" among the places it prints; it no longer does.
- Copywriter: the success step's heading and address line both start with "Address checked.".
