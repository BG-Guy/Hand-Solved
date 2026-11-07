# Code review: HandSolved static site

Scope: `src/` (.astro, .css), `scripts/`, `astro.config.mjs`. `src/styles/motion.css` skipped; `.ts` logic belongs to the TypeScript reviewer. Not a git repo, so files were read directly, plus the dev server on :4321 and the existing `dist/`. `node scripts/check-dist.mjs` passes (home gz: HTML 24.8 KB, CSS 24.8 KB, JS 9.6 KB). Not done: browser rendering checks (320 px overflow), because the shared DevTools browser is locked by another session. A static scan found no fixed width of 20rem or more outside media queries.

## Findings

### MEDIUM

**M1. `.pen` strike/replace styles exist four times; the dialog's copy is unscoped and global**
File: `src/components/SampleHandDialog/SampleHandDialog.css:417-471` (copies: `src/sections/home/Hero.css:218-242`, `src/components/Story/Story.css:109-133`, `src/styles/global.css:121-125`)
Problem: `SiteLayout` mounts the dialog on every page, so its bare `.pen`, `del.pen`, `ins.pen` rules apply site-wide. Hero and Story repeat them scoped and have drifted: `.story ins.pen` sets no margin or weight, so it silently takes `margin-inline-start: 0.5em` and `font-weight` from the dialog's rule. Edit or remove one copy and the others change.
Fix: one owner. Create `src/components/Pen/Pen.css` with `.pen`, `.pen__m`, `.pen--tick|wave|ring`, `del.pen`, `del.pen::after`, `ins.pen` and the forced-colors rule; import it in `SiteLayout.astro` next to `Slip.css`. Delete the dialog, Hero, Story and global copies, keeping only true layout overrides.

**M2. `.grade-chip*` copied verbatim; shared parts live in a page folder (ARCHITECTURE s3)**
File: `src/sections/home/Engine.css:190-232` duplicates `src/sections/gto-hand-review/GradeChip.css:3-45`; `src/sections/home/Engine.astro:82` hand-writes the chip instead of `<GradeChip>`.
Problem: s3 puts anything used by more than one page in `components/`. `GradeChip` (home needs it), `CompactHero` (`src/sections/live-poker-hand-recorder/Hero.astro:6`) and `RelatedLinks` (`src/pages/live-poker-hand-recorder.astro:7`) are imported across page folders. Two definitions of one global class drift apart.
Fix: move `GradeChip`, `CompactHero`, `RelatedLinks` (.astro + .css each) to `src/components/<Name>/` and fix the imports. In `Engine.astro:82` use `<GradeChip grade={item.grade}>{item.name}</GradeChip>` (check `item.icon` equals `grade-${item.grade}`) and delete `Engine.css:190-232`.

**M3. Card-corner index hand-rolled five times; Engine depends on another section's CSS**
File: `src/sections/home/HowItWorks.css:15-38` defines global `.index`, `.index-suit`, `.index--end`. `Engine.astro:44,96` uses them, but `Engine.css` has no `.index` rule. Same pattern again in `Pricing.css:27-50` (+`Pricing.astro:38-45`), `YourData.css:17-40`, `Faq.css:20-48` (+`Faq.astro:38-47`), `src/pages/404.astro:145-157`.
Problem: `components/Bento/CornerIndex.astro` already prints the index and its 180-degree copy and is used by 10 sections. Engine only works because HowItWorks is on the same page; drop or reorder HowItWorks and Engine's corner loses its styling.
Fix: replace each hand-written pair with `<CornerIndex rank="..." suit="..." />` and delete the five CSS blocks. If these sections need the inline inset to be `--gutter` instead of `--index-inset`, add one custom property to `CornerIndex.css` rather than a second copy.

**M4. Seven full-size PNG masters ship in `dist/_astro/` (2.6 MB), against s5 "no PNG ships"**
File: `src/components/Screenshot/Screenshot.astro:32`; `src/data/screens.ts` (17 entries)
Problem: the eager `import.meta.glob('../../assets/screens/*.png')` emits every master that is never passed to `<Picture>`. All six pages render only 10 of the 17 screens. Never rendered: `desk-highlights`, `desk-home`, `desk-practice`, `phone-bankroll`, `phone-hands`, `phone-highlights`, `phone-home`, and their originals sit in `dist/_astro/` (for example `desk-practice.BhUyV52c.png`, 700 KB; 2,617,065 bytes in total). `check-dist.mjs` measures per-page loads only, so it passes.
Fix: delete those 7 PNGs and their `screens.ts` entries until a section uses them. In `scripts/check-dist.mjs` add a rule that fails if any `*.png` exists under `dist/_astro/`.

**M5. BB/$ switch buttons fail WCAG 2.5.3 Label in Name (level A)**
File: `src/components/UnitSwitch/UnitSwitch.astro:26-27`; strings at `src/data/site.ts:98-99`
Problem: the visible text is "BB" and "$" but `aria-label` is "Big blinds" and "Dollars". The accessible name does not contain the visible label, so a voice-control user saying "click BB" gets no match.
Fix: set `bb.name` to `'BB, big blinds'` and `usd.name` to `'$, dollars'` in `data/site.ts` so each name starts with the visible text.

### LOW

**L1. Home `<h1>` lines have no space between them**
File: `src/sections/home/Hero.astro:44-46`
Problem: the rendered H1 is `...Every hand</span></span><span class="line">...you play,...`, so `textContent` reads "Every handyou play,solved." `.hero__h1 .line` is `display:block` (`Hero.css:45`), so browsers and screen readers are fine; text-only consumers are not. The Pricing H2 (`Pricing.astro:49`) does have the space.
Fix: after each line span print `{index < lines.length - 1 && ' '}`.

**L2. Hero's live number breaks the Amount contract, so it never plays the BB/$ roll**
File: `src/sections/home/Hero.astro:73`
Problem: `data-bb` sits on the inner `.num__v`. `Amount.astro:30` and `UnitSwitch.ts:10-11` put it on the outer `.num`, so `UnitSwitch.ts:37-39` sets `is-roll` and `data-prev` on `.num__v`, while `motion.css:398,403` look for `.num.is-roll`.
Fix: `import Amount` and write `<Amount bb={-62.6} />`. It prints the same "−62.6 bb" (checked with `formatAmount`).

**L3. 404 route carries 145 lines of CSS (s3: pages are routes only)**
File: `src/pages/404.astro:56-201`
Fix: move the markup and the `<style is:global>` block to `src/sections/404/NotFound.astro` + `NotFound.css`; leave `404.astro` as a thin route.

**L4. Two components borrow another component's CSS file (s3: CSS beside it, matching name)**
File: `src/components/TextLink/TextLink.astro:6` imports `../CtaButton/CtaButton.css` (rules at `CtaButton.css:85-116`); `src/components/Amount/Amount.astro:10` imports `../UnitSwitch/UnitSwitch.css` (`.num` rules from `UnitSwitch.css:101`).
Fix: create `TextLink.css` and `Amount.css`, move those rules, update the imports.

**L5. Scaffolding that hides missing files is still in place**
File: `src/layouts/SiteLayout.astro:37-44,86-87`; `src/components/Icon/svg-files.ts:2-9,13-22`; guards at `Icon.astro:18`, `Navbar.astro:35,52`, `SiteFooter.astro:40`, `PhoneFrame.astro:33`, `LaptopFrame.astro:39`
Problem: a glob "so the build passes while a file is still missing". Every file exists now (checked), so this only hides future breakage: a renamed dialog leaves every `data-dialog-open` button dead, and a typo in an icon name renders nothing, with only a build `console.warn`. `check-dist` catches neither.
Fix: static imports of the two dialogs in `SiteLayout.astro`, rendered unconditionally; make `svgFile()` throw instead of warn and drop the `X &&` guards.

**L6. Breakpoints mix px and rem**
File: 23 `@media` rules use `768px`/`1024px`: `src/styles/tokens.css:354,367,375`; `Numbers.css:21,70,125,149`; `Toolbox.css:202,209`; `YourData.css:59,99`; `Pricing.css:74,105,209,215,239,246 (1023.98px),358,364`; `Highlights.css:23`; `Faq.css:66`; `Bento.css:16,27`. Everything else uses `48rem`/`64rem`.
Problem: identical at 16 px, but with a larger browser font size the rem rules switch later than the px rules, so tokens and sections flip layout at different widths. Read from the code; not rendered.
Fix: `768px` to `48rem`, `1024px` to `64rem`, `1023.98px` to `63.99rem`.

**L7. Plan prices typed in two files**
File: `src/sections/home/Pricing.astro:50,60,98,99,105,126`; `src/components/EarlyAccessDialog/EarlyAccessDialog.astro:21,22` ($34, $27, $324, $84).
Problem: change a price in one place and the pop-up's plan chips go stale.
Fix: add `pricing = { proMonthly: 34, proYearly: 27 }` to `src/data/site.ts`, derive the $324 and $84 figures, and use it in both files.

**L8. Dead file**
File: `src/assets/svg/icon-info.svg` is referenced nowhere. Fix: delete it, or use it.

## Checked, no action

- **`.chart`**: only definition is `src/assets/svg/chart.css:4` (`container-type: inline-size`). All three wrappers set an explicit inline size (`Hero.css:118-123`, `Engine.css:124-127`, `WhatYouSee.css:147-150`), so containment cannot collapse them; `Numbers.css` uses `.chart-card`/`.chart__*`, never `.chart`; every file that renders a chart imports `chart.css`. Not an active collision.
- **Other repeated selectors** (`.counter*`, `.device*`, `.story__chip|scene`, `.slip`, `.icon`, `.text-link`, `.unit-switch__btn`, `.is-on|neg|gto`) are scoped overrides under a block class, not clashes.
- **Clean**: no TODO/FIXME or library sample words; no `style=`, `data:` URI or inline handler in source; no hex or rgb outside `tokens.css`; all 252 custom properties used are defined; no duplicate or dangling ids, one `<h1>` and no skipped heading levels on all 6 pages; every file opens with a purpose comment; `astro.config.mjs` matches ARCHITECTURE s3 and s8.

## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 0     | pass   |
| MEDIUM   | 5     | info   |
| LOW      | 8     | note   |

Verdict: APPROVE. No CRITICAL or HIGH issues. Fix M1 to M5 before release; M4 is the quickest win (2.6 MB of unused originals).
