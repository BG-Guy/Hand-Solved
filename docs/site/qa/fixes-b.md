# Fixes B: content, sections, pages and cleanup

Role: frontend-builder. Written 2026-11-01. Scope: `conversion.md` (M2, M4, L1 pricing, L4, L5, L6, the hero slip), `code-review.md`, `seo.md` findings 1 to 4, `scan.md` F2 to F4, `a11y.md` A11Y-04, and the two hand-offs in `fixes-a.md` (TS M2 in `Story.astro`, the `ConceptNote` comment). The other builder owned the pop-ups, the mobile bar, the unit switch, the menu and the shared formatter at the same time, so nothing in those folders was edited. What that leaves open is listed under "Open in the other builder's folders", with the exact edits.

Checked on a private build of the current sources (`astro build --outDir scratchpad/fixb-dist`, after the other builder finished), served on 127.0.0.1:4371 by a small static server with `astro preview`'s file rules (`/x` serves `x.html`, unknown paths serve `404.html` with status 404). The CSP is the meta tag, so it is the real one. The baseline for before and after was a build of the sources as they stood at the start (`fixb/base-dist`, port 4372, both servers stopped at the end). The server on 4321 was not touched. `astro check`: 0 errors, 0 warnings, 0 hints (98 files). No console error, page error or failed request in any run, except the 404 page's own 404.

`scripts/check-dist.mjs` reads `<repo>/dist` and takes no path, so I ran an unmodified copy of it next to a link to my build: ok, 6 pages, 190 files. Home, KB gz: HTML 25.00 of 30, CSS 25.06 of 30, JS on load 10.29 of 11, JS in total 19.49 of 25. I added no script. `ls dist/_astro/*.png`: none.

## Result

| Source | Findings | Closed | Open |
|---|---|---|---|
| conversion.md | M2, M4, L1 (pricing), L4, L5, L6, hero slip | 7 of 7 | none |
| code-review.md | M1, M2, M3, M4, L1, L2, L3, L4, L5, L7, L8 | 8 of 11 | M1, L4, L7: my half is done, the other half is in the other builder's folders (L2 was closed by the other builder's formatter work, checked) |
| seo.md | 1, 2, 3, 4 | 4 of 4 | none |
| scan.md | F2, F3, F4 | 1 of 3 | F3, F4 only exist inside the other builder's folders |
| a11y.md | A11Y-04 | 1 of 1 | the second half of its fix (a non-colour cue for call) was not asked for and is not done |
| fixes-a.md hand-offs | Story callout, ConceptNote comment | 2 of 2 | the copywriter note stays with the copywriter |

## conversion.md

### M2: hero art lag hits the proof strip on phones. Fixed

`motion.css`: `art-lag` now ends at `var(--art-lag)`, set on `.hero__art` to `--space-xl` (32 px) and to `--space-2xl` (48 px) from 768. The report's 32 px alone was not enough: the proof strip is opaque now, and with 32 px the caption's last line ended 8 px under the strip's top edge and was cut at its bottom. So under 768 `Hero.css` also gives the caption `padding-block-end: var(--space-md)` (16 px; the hero is 16 px taller on phones). At the lowest point the caption's text now ends 8 px above the strip.

Measured with real wheel scrolling every 30 px, while the caption is on screen (`fixb/m2b.mjs`), caption bottom to the strip's top edge, worst case:

| Viewport | Before | After |
|---|---|---|
| 375x667 | -24 px (caption under the strip) | +8 px |
| 390x844 | -24 px | +8 px |
| 320x568 | -24 px | +8 px |

Looked at: `fb-hero-375-y1100.png` and `fb-hero-390-y1100.png` (at exactly 1,100 the caption has already left the screen, no collision), and `fb-hero-375-y1010.png`, `fb-hero-390-y1040.png`, which catch the caption closest to the strip: whole, clear of the hairline. 414, 600 and 767 wide were measured too (no overlap).

### M4 (decided): two rows per list under 768 px. Fixed

`Highlights.css`, CSS only: `@media (max-width: 767.98px) { .hl .tile__rows > .tile__row:nth-child(n + 3) { display: none } }`, and the second row loses its bottom padding. No disclosure, no script, no reworded row. The breakpoint is in px on purpose: it is the grid's own breakpoint in `Bento.css`, so rows and columns change at one width. #highlights is 2,881 px at 375 wide before and 2,532 after. The rows are in the page and show from 768 up. Looked at: `fb-highlights-375-a.png`, `-b.png`, `-c.png`. COPY.md 4.4 says so.

### L1 (pricing part). Fixed

The lead now reads "Log your sessions for free. Add the coach and practice for $34 a month, or $27 a month billed yearly." The Concept pricing tag and the note under the cards are kept. The prices come from one place (code-review L7). Looked at: `fb-pricing-1280.png`. COPY.md 4.8 updated. The success step is the other builder's and is done in `fixes-a.md`.

### L4. Fixed

`Hero.css`: `.hero__micro` takes `--space-sm` (8 px) from 768 up. The strip under it moves 4 px lower; at 1280x800 its text is still fully on screen (button bottom 723 as before, strip row bottoms 809, text above 800).

### L5: H1 on short phones. Fixed, because it stays good

Under 768 wide and under 700 px tall the H1 is `min(var(--display-xl), var(--display-xl-short))`, with the new token `--display-xl-short: max(3.5rem, 9.6svh)` in `tokens.css`. At 375x667 that is 64 px against 83: the art starts at 633 instead of 683 and the first row of the chart shows above the fold; the button's bottom is 516 instead of 567. I compared 83, 72, 64 and 56 px side by side (`fb-l5-compare-375x667.png`) and kept 64: the H1 is still the loudest thing on the screen, three lines, the first chart row peeks as a scroll cue. 56 px read as timid. Looked at 375x667, 360x640, 320x568 and 390x664 (`fb-first-short-phones.png`): all fine, 320x568 gets the 56 px floor. Taller phones, tablets and desktops are unchanged.

### L6: recorder page. Fixed

`CompactHero.astro` takes an optional `note`, printed under the buttons in the home micro-line's style. `live-poker-hand-recorder` passes "Recording happens in the app. This sample shows what you get back, the grade." The label and the "See the three steps" link are unchanged. COPY.md updated.

### Hero slip: an empty-looking white box until about 3.3 s. Fixed

The cause: the slip sat on screen from the first frame, but "Fold" stayed under a white cover until 2,660 ms and the worth line was transparent until 2,980 ms (finished at 3,300 ms), so for the first 2.7 s the box showed one line of text and white. The report measured about 9 s on a loaded run; the filmstrip `m-load-hero-late.png` and the timings in the file both give 3.3 s.

`motion.css`, longhands only: `.hero__slip` arrives whole, with its worth line, with `rise-in` (320 ms) from `--slip-delay`, which is `--scan-start` (900 ms, right after the veil has gone). It is at opacity 0 before then, so no box is ever on screen before it has words. The pen follows: strike 1,220 to 1,540 ms, "Fold" written in 1,540 to 1,860 ms. The old separate animation on `.hero__worth` is gone. The chart scan is unchanged and keeps lighting rings until 3.2 s; the slip does not wait for it. MOTION.md (E12, the hero timeline, E15) says so.

Verified with frames from 300 ms to 2,400 ms, on a first visit (veil) and on a return visit, and with the animations' own timing read back: `rise-in` ends 1,220, `pen-strike` 1,540, `pen-write` 1,860. Looked at: `fb-slip-strip-1280.png` (first visit), `fb-slip-strip-return-1280.png`, `fb-hero-1280-t2000.png` (the whole 1280 screen at 2 s), `fb-hero-820` and 1024 in `fb-first-tablet-laptop.png` (the slip sits under the caption there and is complete too). Under reduced motion `motion.css` adds nothing: the slip is complete at the first frame (opacity 1, strike drawn, no cover, no animation running; `fb-hero-reduced-1280-t0000.png`). Under 768 the slip does not exist, as before.

## code-review.md

### M1: `.pen` four times. My half done
New `components/Pen/Pen.css` holds the pen once (strike, tick, wave, ring, write-in's `ins`, and the forced-colors rule), loaded by `SiteLayout.astro` next to `Slip.css`. Removed: the Hero copy, the Story copy, the `global.css` forced-colors rule. Left to the other builder: the dialog's copy at `SampleHandDialog.css` lines 443 to 497 (below). It is identical to `Pen.css`, so nothing differs while both exist. Checked: the pinned story's Coach step with the pen strike and write-in is pixel-identical to the baseline (0.000%, `fixb/story-pen.mjs`), and the hero slip's computed colours, weights and margins match.

### M2: `.grade-chip` twice, shared parts in a page folder. Fixed
`GradeChip`, `CompactHero`, `RelatedLinks` moved to `src/components/<Name>/` (imports fixed in the two page folders and the two routes). `Engine.astro` uses `<GradeChip>`, and the copy in `Engine.css` is gone. Geometry and styles of the legend chips are identical to the baseline.

### M3: corner index by hand. Fixed for four of the five
`HowItWorks` (both the A of spades and the band's K of hearts), `Engine`, `Pricing`, `YourData` and the `Faq` component now print `<CornerIndex>`, and their CSS blocks are deleted. `CornerIndex.css` gains one property, `--corner-inline`, for the sections whose index lines up with the text column (`--gutter`: `how__frame`, `band__frame`, `engine__frame`). Two small differences, both from the spec: the rank takes `letter-spacing: -0.02em` (DESIGN 7.5, "10 keeps its digits close"), up to 1.2 px narrower for "10"; and Pricing keeps its all-red 7 of diamonds with one rule (`.pricing__wrap .corner__rank`), because the shared index prints the rank in ink. Left alone: the 404's card index. It is the face of a drawn card, scaled in container units, not a section corner, and swapping it would need four overrides and would turn the 4 of hearts' rank black.
Checked by element geometry and computed styles, section by section, at 375 and 1280 against the baseline: identical apart from the two points above.

### M4: PNG masters in `dist/`. Fixed
The seven unused captures (`desk-highlights`, `desk-home`, `desk-practice`, `phone-bankroll`, `phone-hands`, `phone-highlights`, `phone-home`) moved out of `src/assets/screens/` to `showcase/app/unused/` (not deleted: three of them carry the re-captured desk screens), and their entries left `src/data/screens.ts`. `check-dist.mjs` rule 8 fails when any `*.png` is under `dist/_astro/`. `public/` PNGs (icons, social images) are not under `_astro/` and are fine. Verified: none in my build; and a scratch copy of the build with one PNG added to `_astro/` fails with exit code 1 and a message naming the file.

### L1 (H1 words fuse): Fixed
`Hero.astro` prints a space after each line but the last. Layout is unchanged (`.line` is a block). The H1's plain text now reads "Live poker session tracker and hand recorder. Every hand you play, solved." (the report's re-check).

### L2: closed by the other builder
`Hero.astro` prints `<Amount>` from the shared formatter; I did not touch that markup. The pen chip follows the switch (`fixes-a.md`).

### L3: 404 CSS. Fixed
`src/sections/404/NotFound.astro` and `NotFound.css` hold the markup and the 145 lines of CSS; `pages/404.astro` is 12 lines. Same geometry and styles as the baseline at 375 and 1280.

### L4: borrowed CSS. My half done
`TextLink.css` (the `.text-link` rules, out of `CtaButton.css`) and `Amount.css` (the `.num` block). `TextLink.astro` and `Amount.astro` import their own; `SiteLayout` loads `TextLink.css` right after `CtaButton.css`, so the cascade is where it was, and the two places that print `class="text-link"` by hand (`CtaButton.astro`, `Numbers.astro`) import it. Left to the other builder: the `.num` block in `UnitSwitch.css` (lines 101 to 105, below).

### L5: scaffolding. Fixed
`SiteLayout.astro` imports both dialogs statically and prints them unconditionally; `svgFile()` throws when a file is missing; the `X &&` guards are gone from `Icon`, `Navbar` (two), `SiteFooter`, `PhoneFrame`, `LaptopFrame` and `Story`, and the veil. One effect to know: the glob used to hoist the dialogs' CSS above the tokens; it now loads in file order, after the reset. I found no element selector in the dialogs' CSS that depends on the old order, and both dialogs open and render correctly (`fb-dialog-choose-1280.png`, `fb-dialog-verdict-1280.png`).

### L7: prices typed twice. My half done
`pricing` in `src/data/site.ts` (`proMonthly: 34`, `proYearly: 27`; the yearly total 324 and the saving 84 are worked out). `Pricing.astro` prints all its prices from it (lead, switch chip, both card prices, the billing line, the no-script text). Left to the other builder: the three plan chips in `EarlyAccessDialog.astro`.

### L8: dead file. Fixed
`icon-info.svg` deleted (nothing used it); `SVG-USAGE.md` no longer lists it.

## seo.md

### 1: FAQ 1 and the JSON-LD one-liner. Fixed
`home-faq.ts` builds FAQ 1's first sentence from `oneLiner` in `site.ts`, the same constant the WebSite and Organization JSON-LD print. Re-check: `grep -o 'grades each decision in your Texas Hold’em hands against GTO strategy' dist/index.html | wc -l` prints 3. The second sentence still says "graded against GTO", as the report left the trim to the copywriter. COPY.md FAQ 1 updated.

### 2: H1 words fuse. Fixed (same change as code-review L1).

### 3: contextual links (SEO.md section 6). Fixed
`Faq.astro` turns `[words](/path)` in an answer into a real `<a href>` (split into text and link parts, no HTML is injected), styled in `Faq.css`. Added to the answers, each as its own closing sentence: FAQ 3 "Read what the coach covers." (`/gto-hand-review`), FAQ 4 "Read about entering a hand at the table." (`/live-poker-hand-recorder`), FAQ 7 "Read the privacy notice and the terms of use." (`/privacy`, `/terms`). The recorder page's step 3 link is now "How the coach grades it", so its two links to `/gto-hand-review` differ. Checked in the built HTML: inside `<main>` of the home page, `/gto-hand-review` has 3 links (3 different anchors), `/live-poker-hand-recorder` 2, `/privacy` 1, `/terms` 1; the recorder page links `/gto-hand-review` twice with two anchors. Those three closing sentences are new words, written only to carry the anchors the spec names: the copywriter should read them. SEO.md's table also lists a "how a hand is recorded" link in the review page's Limits; the report's fix does not, so I did not add it.

### 4: alt text. Fixed
All 10 screens now have an alt of 8 to 20 words (18 to 20 in the build), what the screen is and one figure, ending "Sample data." (or "Sample screen." where no number shows). The three second uses on a page have their own sentence: the home red band, the review page's small phone beside the laptop, and the recorder's Record step (through a new optional `alt` on `StoryStep`). Checked in the built HTML: every `<img>` alt is 18 to 20 words and unique on its page (home 9, review 4, recorder 5). The numbers are the ones in the old alts, which the report had checked against the screens. COPY.md's alt table rewritten.

## scan.md

### F2: unused screens. Fixed (code-review M4).

### F3: builder comments in the HTML. Not touched
Three HTML comments are in the other builder's files: `SampleHandDialog.astro` lines 69 and 82 and `EarlyAccessDialog.astro` line 16. Every page still carries two of them. Exact fix below.

### F4: internal notes in the JS. Not touched
`hands.ts` imports the whole JSON, so "app engine" still ships once in `SampleHandDialog.*.js`. I did not edit `demo-spots.json` (demo data stays as is, and it is an exact copy). Exact fix below.

## a11y.md

### A11Y-04: the range chart has no text equivalent. Fixed
New `components/RangeChartList`: a closed `<details>` "View the chart as a list" under the caption of both charts (home Engine, review page Range grids), written at build from `range-chart.json`. Groups, as the report asked: Always raise (25 hands), Raise or call (5, each with its shares, "A8s: raise 34%, call 66%"), Always call (69), Call or fold (2), Fold: Every other hand. 29 nodes and 711 characters, closed it is a 44 px line and not laid out. Read back in the browser and checked against the JSON. Looked at: `fb-chartlist-375.png`, `fb-engine-1280.png`. COPY.md updated. The report's second suggestion (a hatch or dot so call is not only black) changes how the chart looks and was not in the brief: not done.

## fixes-a.md hand-offs

- Story callout (TS M2). `Story.astro` takes `delBb` and `delUsdPerBb` on a callout and prints an `<Amount>` inside the strike; `HowItWorks.astro` passes `del: 'Call'`, `delBb: sampleCall.bb`. Verified at 1280 and 375: "You: Call 65 bb" and, with the switch on dollars, "You: Call $130", the strike over the whole figure in both (`fb-story-coach-bb-1280.png`, `fb-story-coach-usd-1280.png`). The phone capture beside it stays in big blinds, as its footnote says. COPY.md 4.2 notes it.
- `ConceptNote.astro`: header comment corrected.
- Copywriter: the success step's heading and address line both start with "Address checked.". Not mine.

## Can content stay invisible? The blank headings in a full-page screenshot

Cause: in browsers with scroll timelines (Chrome 115+, Safari 26+) the `[data-reveal]` blocks are held at opacity 0 by a view timeline until they enter the screen. A full-page capture taken without scrolling never moves that timeline, so everything below the first screen is held. On `/gto-hand-review` 8 of its 10 reveal blocks are at opacity 0 at load; on the home page 19 to 23 of 24, depending on width. The text is in the HTML; only its start pose is shown.

Check: real wheel scrolling through every page, probing every heading, paragraph, list item, table, tile and plan card as it passes the upper middle of the screen (`fixb/reveal-audit.mjs`; 36 runs: 6 pages, 375, 768 and 1280 wide, each in three modes).
- Normal Chrome.
- JavaScript off (the scroll timelines are CSS, so they still run).
- Scroll timelines unsupported: the CSS block is switched off in the stylesheets, `CSS.supports` says no, and the IntersectionObserver fallback runs (what Firefox and Safari below 26 do).
Result: nothing stayed invisible on the review page, the recorder page, the two legal pages or the 404, in any mode or width. On the home page the audit flagged three items (the bankroll chart's "+733 bb" label and the toolbox chips); they were sampling gaps, because those two items are timed (the label appears when the line has finished drawing, the chips animate in), and read directly at real scroll positions with time to settle they are at opacity 1 at 375, 768 and 1280 with and without JavaScript. Also checked: the `display: none` third rows from M4 cannot get stuck in the fallback, because the observer fires when they are shown. So no change was needed. What a visitor can see blank is a tool that captures the page without scrolling: Playwright's `fullPage` or `captureBeyondViewport`, and Firefox's page capture, which does not scroll either. Scroll first, or capture with the browser's own full-size capture (Chrome resizes the viewport, so every block is in view). Print is not affected: the motion rules are screen-only.

## Open in the other builder's folders (fixes ready, apply when the folders are free to edit)

1. F3: change the three comments to Astro comments, `{/* ... */}`: `SampleHandDialog.astro:69` and `:82`, `EarlyAccessDialog.astro:16`. Verify `grep -c '<!--' dist/*.html` prints 0 for every page.
2. F4: `hands.ts:2` `import { spots as rawSpots } from '../../data/demo-spots.json';` and `:88` `const spots = rawSpots as unknown as Spot[];`. Verify `grep -c "app engine" dist/_astro/SampleHandDialog.*.js` prints 0.
3. M1: delete the `.pen`, `.pen__m`, `.pen--tick|wave|ring .pen__m`, `del.pen`, `del.pen::after` and `ins.pen` rules in `SampleHandDialog.css` (the comment "The red pen: tick, wave and ring..." through `ins.pen {...}`, about lines 443 to 497). `Pen.css` already holds them, word for word.
4. L4: delete the `.num` block and its comment in `UnitSwitch.css` (lines 101 to 105). `Amount.css` holds it.
5. L7: in `EarlyAccessDialog.astro` lines 19 to 21 import `pricing` from `../../data/site` and print `${pricing.proMonthly}` and `${pricing.proYearly}` in the two plan chips ("Plan: Free, $0" stays).

None of these changes what a visitor sees, except that F3 and F4 stop internal notes shipping.

## Files changed

- New: `components/Pen/Pen.css`, `components/GradeChip/`, `components/CompactHero/`, `components/RelatedLinks/` (moved), `components/TextLink/TextLink.css`, `components/Amount/Amount.css`, `components/RangeChartList/` (`.astro`, `.css`), `sections/404/NotFound.astro`, `NotFound.css`.
- Edited: `styles/motion.css`, `styles/tokens.css` (`--display-xl-short`), `styles/global.css`, `layouts/SiteLayout.astro`, `sections/home/` (`Hero`, `HowItWorks`, `Engine`, `Highlights`, `Pricing`, `YourData`, `Numbers`, their CSS), `components/` (`Faq`, `home-faq.ts`, `Story`, `Screenshot`, `PhoneFrame`, `LaptopFrame`, `Icon`, `Navbar.astro`, `SiteFooter.astro`, `CtaButton`, `TextLink`, `Amount`, `ConceptNote`, `Bento/CornerIndex.css`, `CompactHero`), `sections/live-poker-hand-recorder/` (`Hero`, `Steps`), `sections/gto-hand-review/` (`Hero`, `HowGraded`, `WorkedExample`, `WhatYouSee`), `pages/` (404, review, recorder), `data/site.ts`, `data/screens.ts`, `scripts/check-dist.mjs`.
- Moved or deleted: seven PNGs to `showcase/app/unused/`; `assets/svg/icon-info.svg` deleted.
- Docs: `COPY.md`, `MOTION.md`, `SVG-USAGE.md`, this file.

## Method

Scripts are in `scratchpad/fixb/` (`hero-frames.mjs`, `strip.mjs`, `m2.mjs`, `m2b.mjs`, `geom.mjs`, `diff.mjs`, `reveal-audit.mjs`, `story-pen.mjs`, `story-units.mjs`, `rcl.mjs`, and the static checks); screenshots are `scratchpad/checks/fb-*.png`, all viewport shots, scrolled with real wheel events, every one opened and judged. Chrome through Playwright. Not tested: Safari and Firefox themselves (the no-timeline path was run in Chrome with the CSS and `CSS.supports` switched off), a real phone, 768 to 1023 beyond the hero, and the five open items above, which are not mine to change.
