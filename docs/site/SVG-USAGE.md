# HandSolved site: SVG, icons, frames and social art, how to use them

Owner: `svg-expert` (T15). Built 2026-11-01 from `DESIGN.md` 7, 8 and 10, `ARCHITECTURE.md` 5, `SEO.md` 2 and 8, `COPY.md`. Nothing here is traced from another maker's art, and nothing is a placeholder.

**What exists.** 54 SVG files and 1 CSS file in `src/assets/svg/` (34,262 bytes), 11 files in `public/` (106,170 bytes), the chart data, 3 generator scripts and 1 data file for them. Full list with bytes at the end. Every number below was measured on these files.

**Regenerate.** Edit a script, never an output. `node scripts/build-chart.mjs` (chart, from the JSON), `node scripts/build-art.mjs` (mark, lockup, suits, icons, frames, lattice, card back, medallion, favicon set, manifest), `PLAYWRIGHT_DIR=<folder holding node_modules/playwright> node scripts/build-og.mjs` (social images). The first two run svgo with the project's `svgo.config.mjs`, so a later `npm run svg` changes nothing (checked: a second pass changed 0 of 54 files).

## 1. Delivery rules, in one table

| You want | Do this |
|---|---|
| An icon, suit, mark, lockup, frame, plate or figure in the page | Astro import, inlined at build: `import IconCheck from '../assets/svg/icon-check.svg'` then `<IconCheck class="icon" />`. Props land on the `<svg>`. Size it in CSS (`inline-size`, `block-size`). Fallback if the component import is unavailable: `import raw from '...svg?raw'` and `<Fragment set:html={raw} />` |
| A tile or strip behind a section (lattice, Quiet or Ghost chart) | CSS `url()` relative to the CSS file: `background: url('../../assets/svg/bg-lattice-red.svg')`. Vite emits a hashed file; `assetsInlineLimit: 0` keeps it from becoming a `data:` URI. These four files hold literal hex, because CSS cannot reach into them |
| Favicon, manifest, social image, `blank.svg` | Public path, never imported: `/favicon.ico`, `/icon.svg`, `/apple-touch-icon.png`, `/site.webmanifest`, `/og/home.png`, `/blank.svg` |

Rules every file keeps: hairlines and flat shapes only, no gradient, no filter, no blur, no raster inside an SVG, no emoji, suits are never text characters, no `style=` and no `<style>` in anything that is inlined (CSP), no hex in anything that is inlined (colours come from tokens through `var()` or `currentColor`), `viewBox` always kept, `aria-hidden="true"` on everything decorative. Checked on the built files: 0 `style=` or `<style>`, 0 `data:`, 0 `<script>`, 0 `href`, hex only in the four `url()` files, all files well-formed XML.

**svgo notes for whoever owns `svgo.config.mjs`.** With the current config `npm run svg` (a) removes every `id` that nothing inside the file points at, (b) removes `role` (`removeUnknownsAndDefaults` has `keepRoleAttr` off). So: hooks for CSS and motion are **classes**, never ids (the only ids left are the four clip paths in the Full chart and one pattern in the card back, which are referenced); and the Full chart needs `role="img"` passed at the use site (its `aria-label` is in the file and survives). If you would rather have `role` in the file, add `removeUnknownsAndDefaults: { keepRoleAttr: true }` to the preset overrides and rerun `node scripts/build-chart.mjs`.

## 2. The chart (DESIGN.md 7.1)

Data: `src/data/range-chart.json`, copied unchanged from `docs/site/research/range-chart.json` (byte-identical, 5,000 bytes). `node scripts/build-chart.mjs` reads it, checks every hand name against its grid position, asserts **68 fold, 69 call, 25 raise, 7 mixed**, computes the legend numbers (**48.5, 38.8, 12.7**, weighted by combos 6, 4 and 12 of 1,326) and refuses to write if the `COPY.md` description no longer matches them. No cell is typed by hand. After writing, it parses the Full chart back and compares all 169 cells with the JSON: 169 of 169 match.

**Three cells checked (JSON, then what the SVG prints).**

| Hand | Row, col | JSON `f` = [fold, call, raise] | In `chart-bb-vs-btn-100.svg` |
|---|---|---|---|
| AA | 0, 0 | [0, 0, 1] | Red square, 96 of 96 wide |
| T9s | 4, 5 | [0, 0.36, 0.64] | Red band 61.44 wide, then black band 34.56 wide, 96 total, label Face White |
| 72o | 12, 7 | [1, 0, 0] | No ink, hairline box, label `--chart-label-fold` |

| File | Level | Bytes | Limit | Delivery |
|---|---|---|---|---|
| `bg-chart-hero-wide.svg` | Screened, fade from a phone 6u wide at x 6.5u, y 1.5u | 4249 | under 5 KB | Inline, 1024 and up |
| `bg-chart-hero-narrow.svg` | Screened, fade from a phone 8u wide at x 4.5u, y 2u | 3123 | under 5 KB | Inline, under 1024 |
| `chart-bb-vs-btn-100.svg` | Full, labels, split cells with two-colour labels | 7824 | under 9 KB | Inline, once, in the Engine figure |
| `bg-chart-quiet.svg` | Quiet, flat tints, no text, 624 px (48 px a cell) | 2464 | under 8 KB | CSS `url()` |
| `bg-chart-ghost.svg` | Ghost, one hairline grid, no text, 832 px (64 px a cell) | 518 | under 1 KB | CSS `url()` |
| `chart.css` | The label sizes by width, forced colors | 1862 | | Import once next to the inline charts |

The fade grids the script computes from the phone rectangles equal the two in DESIGN.md: wide `3333211111111` then `3333210000000` for rows 1 to 12, narrow `3321111111111` then `3321000000000`. Step 0 cells are not printed at all. A shared hairline takes the louder step.

**How to inline, per viewport and level.** Both hero plates go in the hero, each in a wrapper with class `chart` and a width from layout (13 cells, `--chart-u-hero`), one hidden per breakpoint. The Figure sits in the Engine sheet. Ghost and Quiet are backgrounds.

```astro
---
import PlateWide from '../../assets/svg/bg-chart-hero-wide.svg';
import PlateNarrow from '../../assets/svg/bg-chart-hero-narrow.svg';
import Figure from '../../assets/svg/chart-bb-vs-btn-100.svg';
import '../../assets/svg/chart.css';
---
<div class="chart plate plate--wide"><PlateWide /></div>
<div class="chart plate plate--narrow"><PlateNarrow /></div>
<!-- Engine: pass role, svgo strips it from the file. The name is already inside as aria-label. -->
<div class="chart"><Figure role="img" /></div>
```

```css
.plate { inline-size: calc(var(--chart-u-hero) * 13); }
.plate--wide { display: none; }
@media (min-width: 1024px) { .plate--wide { display: block; } .plate--narrow { display: none; } }
/* #how, Ghost: not shown under 768 */
.story-ghost { background: url('../../assets/svg/bg-chart-ghost.svg') center / calc(var(--chart-u-ghost) * 13) no-repeat; }
/* Product-page hero, Quiet: flush right at 48 px a cell, not shown under 768 */
.hero-quiet { background: url('../../assets/svg/bg-chart-quiet.svg') right top / 624px no-repeat; }
```

`.chart` is a size container (`chart.css`), so its width must come from layout, not from the SVG. Label type size is set in user units by the container's width, exactly as the DESIGN table: Full shows every cell at 416 px and up (37.5, then 30 from 520), pairs only from 256 px (48.75 at 320, 61 at 256), nothing below 256; Screened shows pairs only from 320 px, every cell from 520. Nothing renders under 12 px. The Figure carries `forced-color-adjust: none`.

**Classes, the stable contract** (the files have no ids). Root: `.hc` plus `.hc-screened` with `.hc-wide` or `.hc-narrow`, or `.hc-full`. Layers in draw order: `.hc-grid` (paths `.hc-line-1`, `.hc-line-2`, `.hc-line-3` by fade step), `.hc-ink` (paths `.hc-call`, `.hc-raise`), `.hc-labels` (groups `.hc-pairs`, `.hc-rest`). Inks: Pip Red raise, Key Black call, mixed cells as hard-edged vertical bands in the order raise, call, blank fold, widths the true frequencies of the square's side. J4s and 53s print their label twice, one copy clipped to each band, so the letters change colour exactly at the ink edge. The Full chart draws runs of equal cells as dashed lines (96 on, 4 off); that is why its inks are strokes and the plates' are fills. Neither has one element per cell.

## 3. Lattice, card back, medallion (DESIGN.md 7.2, 7.3)

| File | Bytes | What | Use |
|---|---|---|---|
| `bg-lattice-red.svg` | 171 | The chart grid turned 45 degrees, Overprint Red `#A81222` lines, 1.5 wide, tile 32 | `background: var(--surface-red) url(.../bg-lattice-red.svg); background-size: var(--lattice-size) var(--lattice-size);` Red band, card back |
| `bg-lattice-edge.svg` | 171 | Same path in `#BDBFBE`, no ground | `background: url(.../bg-lattice-edge.svg) 0 0 / 16px 16px repeat-x; block-size: var(--lattice-edge-h);` Top of `#pricing` |
| `art-card-back.svg` | 545 | Face-down card, 100 x 140 (5:7), radius 10, lattice tile 8, 2 wide Face White frame inset 8. Classes `cb-ground`, `cb-lattice`, `cb-frame` | Inline. The 404 face-down card and any hand-built scene card. Several on one page share one pattern id on purpose (same content) |
| `art-medallion.svg` | 532 | The footer medallion: Face White square, side 104 of 147, radius 8, turned 45 degrees, the mark upright at 52, Key Black with the red cell. Classes `med-plate`, `med-mark`, `mark-spade`, `mark-cell` | Inline in the card back, centred, with `inline-size: calc(var(--medallion) * 1.414)` (the square turned 45 degrees). The mark inside is then half the square's side, 48 to 80 px against the 52 and 78 in the tokens |

Lattice lines never move and never sit on ink.

## 4. The mark and the lockup (DESIGN.md 7.4)

The mark is the spade on the 13 x 13 grid with one red cell at row 6, column 6 (hand 88, the middle of the chart). The path is traced from the bitmap in DESIGN.md by `build-art.mjs`, merged into one outline with no seams. Checked by rasterising it and comparing all 169 cells with the bitmap: 0 differences.

| File | Bytes | Use |
|---|---|---|
| `logo-mark.svg` | 330 | Solid mark, `viewBox="0 0 13 13"`, `crispEdges`. Spade is `currentColor`, the cell is `var(--primary)`. Page-load veil (104 px, Face White spade on Key Black), nav 26 px, medallion 52 and 78 |
| `logo-mark-grid.svg` | 468 | Same bitmap with an 8% gap between cells so the chart shows through. 78, 104, 156 px |
| `logo-mark-mono.svg` | 298 | One ink only, the red cell knocked out. For a stamp, an emboss or a single-colour print |
| `logo-lockup.svg` | 2778 | Mark 26 px, 8 px gap, "HandSolved" at 28 px. `viewBox="0 0 136 26"`, one ink (`currentColor`) plus the red cell |

**The wordmark is real outlines, not live text and not faked.** The letters are the glyph outlines of Sofia Sans Extra Condensed 800 (SIL OFL 1.1), read from the font with fontTools, kerning taken from the font's own GPOS table (the only non-zero pairs are l-v and v-e), scaled to 28 px. The set width comes out at 102.2 px, which is the 3.65 em in DESIGN.md 4.3. The path and its provenance are in `scripts/wordmark.json`. No font loads for it, so the nav brand cannot swap or shift.

| Ground | Spade | Cell | How |
|---|---|---|---|
| Stock, Face White | Key Black | Pip Red | `color: var(--text-main)` on the wrapper |
| Pip Red | Face White | Pip Red | Inside `.on-red` the same line works, the scope sets `--text-main` |
| Key Black | Face White | Pip Red | Inside `.on-ink`, same |

Use only multiples of 13 px for `logo-mark` (13, 26, 39, 52) and of 6, 8, 12 px a cell for the grid mark (78, 104, 156), so every edge lands on a pixel. Smallest size 13 px. Clear space: half the mark's width. Never recolour the cell, never stretch, never put it on a photograph. Lockup: 136 px wide at 320 beside the burger; do not set it smaller than 136 px; do not rebuild it from live text. In HTML: `<a href="/" aria-label="HandSolved home"><LogoLockup class="brand" /></a>`, the SVG is already `aria-hidden`.

**Favicon set, all in `public/`.**

| File | Bytes | Spec | Notes |
|---|---|---|---|
| `icon.svg` | 538 | 32 x 32, Face White tile radius 6, cell 2, margin 3, Key Black spade, Pip Red cell | Carries a `<style>` with `prefers-color-scheme: dark`: Key Black tile, Face White spade. A standalone file may; inlined SVG may not |
| `favicon.ico` | 1019 | 16, 32 and 48 px in one file, each drawn on whole pixels | 16 px: cell 1, margin 1. 32: cell 2, margin 3. 48: cell 3, margin 4 |
| `apple-touch-icon.png` | 595 | 180 x 180, opaque, cell 12, margin 12 | No alpha channel |
| `icon-192.png` | 631 | 192 x 192, opaque, cell 12, margin 18 | No alpha channel |
| `icon-512.png` | 2616 | 512 x 512, opaque, cell 32, margin 48 | No alpha channel. Also the Organization logo |
| `site.webmanifest` | 268 | The JSON in SEO.md 8, colours `#F3F4F1` (Card Stock, `--surface-page`), `display: browser` | Not installable on purpose |
| `blank.svg` | 62 | 1 x 1, empty | The `src` of the hand-written `<picture>`, so a phone never downloads the desktop image |

Rendered and looked at: the mark reads as a spade at 13, 26, 39, 52, 78, 104 and 156 px; the 16 px favicon shows the full stepped spade and the red cell on a Face White tile; `icon.svg` was rendered in Chrome at 16, 32 and 48 px, at 1x and 2x, in light and dark. At 1x a 16 px SVG favicon has soft edges (the 1.5 px margin falls between pixels); the `favicon.ico` 16 px is pixel-exact. Head lines are SEO.md 3, unchanged: `<link rel="icon" href="/favicon.ico" sizes="48x48">`, `<link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`, `<link rel="manifest" href="/site.webmanifest">`.

## 5. Suits and the corner index (DESIGN.md 7.5, 10)

`icon-suit-spade` 217, `icon-suit-heart` 184, `icon-suit-diamond` 139, `icon-suit-club` 251 bytes. Filled, `viewBox="0 0 16 16"`, `currentColor`, all on one grid: top 1.25, base 14.75, 14 wide at most, centre line x 8. Original drawings from circles, tangents and a rhombus: round lobes and a flared stem (spade), two lobes and a point (heart), a tall rhombus (diamond), three discs and a stem (club). The four silhouettes differ by shape, so colour is never the only cue. Colour with CSS: spade and club `color: var(--text-main)`, heart and diamond `color: var(--primary)`; inside `.on-ink` and `.on-red` all four are Face White.

**Corner index.** No separate file: the rank is live text in the display face (`aria-hidden`), the suit is one of the four icons. Markup and CSS:

```html
<span class="index" aria-hidden="true"><span class="index-rank">K</span><IconSuitHeart class="index-suit index-suit--red" /></span>
<span class="index index--end" aria-hidden="true">...same...</span>
```
```css
.index { position: absolute; inset-block-start: var(--index-inset); inset-inline-start: var(--index-inset);
  display: grid; justify-items: start; row-gap: 2px; font: var(--weight-display) var(--index-rank)/0.9 var(--font-display); }
.index-suit { block-size: var(--index-suit); inline-size: auto; color: var(--text-main); }
.index-suit--red { color: var(--primary); }               /* heart, diamond; the scopes turn all four Face White on ink and red */
.index--end { inset: auto var(--index-inset) var(--index-inset) auto; transform: rotate(180deg); }
```

## 6. Red pen marks (DESIGN.md 7.6)

`icon-pen-tick` 266, `icon-pen-wave` 314, `icon-pen-ring` 338 bytes. Strokes in `currentColor`, so set `color: var(--pen-ink)` where they are used (Pip Red on stock and white, Face White on red; never on ink). Stroke 1.5, `vector-effect="non-scaling-stroke"`, round caps and joins because this is a pen, not a pictogram. The wave and the ring have `preserveAspectRatio="none"` and stretch to the text: `.pen-ring { position: absolute; inset: -0.2em; inline-size: calc(100% + 0.4em); block-size: calc(100% + 0.4em); }`. The ring is one open path that overshoots its start. All three paths carry `pathLength="1"`, so a draw is `stroke-dasharray: 1; stroke-dashoffset: 1 to 0` (tried in Chrome with the non-scaling stroke: it draws in normalised units). The strike for a Blunder is the CSS in DESIGN.md 7.6 (`del.pen::after`), so there is no strike file.

## 7. Device frames (DESIGN.md 8)

Flat Key Black (`var(--device-ink)`), no gloss, no hand, no notch, no buttons. The screenshot goes on top, as HTML, at the inset below. Verified in Chrome with the real `phone-coach-score.png` and `desk-coach-top.png`: the bezels measured equal on all sides, and the screen box ratio was 0.46209 (capture 0.46209) and 1.60005 (capture 1.6).

| | `frame-phone.svg` (182 bytes) | `frame-laptop.svg` (251 bytes) |
|---|---|---|
| `viewBox` | `0 0 1000 2094.25` (W = 1000) | `0 0 1120 666.5` (lid W = 1000, base 1120) |
| Outer shape | Rounded rectangle, radius 150 | Lid 1000 x 638.5, top radius 22, plus base 1120 x 28 under it, bottom radius 14, one silhouette |
| Frame `aspect-ratio` | `1000 / 2094.25` | `1120 / 666.5` |
| Screen, in frame units | x 30, y 30, 940 x 2034.25, radius 120 | x 78, y 18, 964 x 602.5, radius 4 |
| Screen, as percentages of the frame box | left and right **3%**, top and bottom **1.43249%**, so width 94%, height 97.13501% | left and right **6.9643%**, top **2.7007%**, bottom **6.9017%**, so width 86.0714%, height 90.3976% |
| Screen radius | `12.766% / 5.899%` | `0.415% / 0.664%` |
| Screen ratio | 940 / 2034.25 = 0.46209, the capture is 1170 / 2532 = 0.46209 | 964 / 602.5 = 1.6, the capture is 2880 / 1800 = 1.6 |
| Bezel | 0.03 W | 0.018 W sides and top; 0.046 W at the bottom (bezel plus base) |

```css
.phone  { position: relative; inline-size: var(--w); aspect-ratio: 1000 / 2094.25; }
.laptop { position: relative; inline-size: var(--w); aspect-ratio: 1120 / 666.5; }
.phone > svg, .laptop > svg { display: block; inline-size: 100%; block-size: 100%; }
.phone  > .screen { position: absolute; inset: 1.43249% 3%; border-radius: 12.766% / 5.899%; overflow: hidden; }
.laptop > .screen { position: absolute; inset: 2.7007% 6.9643% 6.9017%; border-radius: 0.415% / 0.664%; overflow: hidden; }
.screen img { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; object-position: top; }
```

The laptop's `--w` is the frame's full width (lid width times 1.12). States are DESIGN.md 8: loading and failed show the bare frame, which is already solid `--device-ink`.

## 8. Icons (DESIGN.md 10)

One grid for all of them: 24 x 24, live area 20, stroke 1.5, square caps, miter joins, outline only, `currentColor`, `aria-hidden`. The icons in the table are 182 to 267 bytes each, the suits 139 to 251 and the pen marks 266 to 338 (limit 1 KB for every one). Sizes are CSS (`inline-size`): use the size named in DESIGN.md for the component (12, 14, 16, 20, 24; the three data icons 32). Suits and pen marks are in sections 5 and 6.

| Group | Files (bytes) | Where |
|---|---|---|
| Navigation | icon-arrow-down 195, icon-arrow-right 195, icon-chevron-down 186, icon-chevron-right 186, plus 190, minus 182, close 194, menu 197 | Links (16), breadcrumbs (12), FAQ (20), burger and dialog close (24) |
| Status | check 193, alert 215, star 267 | Pricing bullets (16), messages (16), pop-up errors |
| Grades | icon-grade-best 212, icon-grade-blunder 207, icon-grade-good 193, icon-grade-inaccuracy 201, icon-grade-mistake 194, icon-grade-none 182 | Chips 14, stamps 16: two ticks, one tick, a wobble, one cross, two crosses, a dash |
| Hero proof | icon-proof-charts 217, icon-proof-score 211, icon-proof-streets 215 | Proof strip, 16 |
| Limits | icon-limit-entered 210, icon-limit-holdem 216, icon-limit-postflop 261 | Good to know, 20 |
| Highlights tiles | icon-tile-fame 258, icon-tile-insights 220, icon-tile-pots 250, icon-tile-shame 230, icon-tile-tilt 229 | Tile art fallback, 24 |
| Data cards | icon-data-export 215, icon-data-import 217, icon-data-install 225 | Info cards, shown at 32 |

```astro
---
import IconCheck from '../assets/svg/icon-check.svg';
---
<IconCheck class="icon" />   <!-- .icon { inline-size: 16px; block-size: 16px; flex: none; } -->
```

An icon-only button carries its label on the button (`aria-label`); the icon stays hidden.

## 9. Social images (SEO.md 2, DESIGN.md 10)

1200 x 630 PNG, flat palette PNG, rendered from HTML in Chrome with the site's own `tokens.css`, `chart.css`, chart and frame SVGs, the real captures from `showcase/app/final`, and the four fonts. No screenshot is edited. Bytes: home 34774, gto-hand-review 29258, live-poker-hand-recorder 27978, default 8431 (limit 300 KB, DESIGN 200 KB).

| File | Pages | Text printed (proofread against COPY.md) | Art |
|---|---|---|---|
| `/og/home.png` | `/` | HandSolved lockup; "Every hand / you play, / solved." with "solved." in Pip Red; "Live poker session tracker / and hand recorder"; "Call 65 bb" struck, "Fold" in red; "Sample data" | Screened chart plate at 36 px a cell, flush right, `phone-coach-score` over it, cropped at the bottom |
| `/og/gto-hand-review.png` | `/gto-hand-review` | Lockup; "GTO hand / review"; "Call 65 bb" struck with a red pen line, "Fold" in red; "Sample data" | `phone-coach-decision`, cropped at the bottom |
| `/og/live-poker-hand-recorder.png` | `/live-poker-hand-recorder` | Lockup; "Live poker / hand recorder"; "One action at a time."; "Sample data" | `phone-recorder`, cropped at the bottom |
| `/og/default.png` | `/privacy`, `/terms` | Lockup only | Ghost hairline grid behind the wordmark and mark, no screenshot |

The `og:image:alt` strings already in `src/data/pages.ts` match what is drawn. Notes: (1) **Files are PNG**, as SEO.md and ARCHITECTURE.md say; DESIGN.md 10 names `.jpg`. (2) **Safe square.** SEO.md says the wordmark and key words stay inside the central 630 px square, so the text column starts at x 285, not at 64 as DESIGN.md 10 draws it. To keep the text clear of the plate, the home headline is 120 px (DESIGN 132) and the plate 36 px a cell (DESIGN 40); the other two headlines are 112 and 104 px with short key words, not the full H1, as SEO.md asks. Nothing is under 30 px except the "Sample data" slip and the pen slip. (3) The fonts: `src/assets/fonts/` was empty when these were rendered, so the four families (same name, weight and design as DESIGN.md 4.1) came from a temporary npm pack of the fontsource packages. Run `node scripts/build-og.mjs` again once the four subset files are in `src/assets/fonts/`; the script reads that folder first.

## 10. Hooks for the motion plan (`MOTION.md` did not exist yet)

Static art is delivered with class names that will not change. Motion belongs to `animation-expert`. Fixed by DESIGN.md 11: only `transform` and `opacity` move, **chart cells and the lattice never move**, no SMIL, every effect inside `prefers-reduced-motion: no-preference`. Anything animated inline is small: the hero plates are 3.1 and 4.2 KB, the mark 330 bytes, the medallion 532.

| Art | Hooks | Safe to do | Never |
|---|---|---|---|
| Hero plates, Figure | `.hc-grid`, `.hc-call`, `.hc-raise`, `.hc-labels` | A one-time print-in by group `opacity` (grid, then call, then raise, then labels; red last). Or fade the whole wrapper | Move or scale any cell, animate the hairline paths individually |
| Card-back medallion | `.med-plate`, `.med-mark`, `.mark-cell` | Scale 0.92 to 1 on the group with reveal progress, the red cell printing at the end (`transform-box: fill-box; transform-origin: center`) | Rotate the mark; it stays upright |
| Mark in the veil | `.mark-spade`, `.mark-cell` | Door split by the page's own panels; the red cell fades or scales in last | Recolour the cell |
| Face-down card | whole `<svg>` | Flip with `transform` on a wrapper (500 ms, DESIGN.md 9.9) | Move the lattice inside |
| Pen marks | the single `<path>` with `pathLength="1"` | Draw with `stroke-dashoffset` over `--dur-3` | Animate with SMIL |
| Frames | `.frame-body` | Wrapper tilt (3 degrees at most) | A shadow or sheen |
| Ghost, Quiet, lattice | none (CSS backgrounds) | Fade or translate the element that carries the background | Parallax the lattice |

## 11. Not done, and things other owners should know

- **`MOTION.md` was not there**, so hooks are named by this file, not taken from it. If the plan wants a different class, change `build-chart.mjs` or `build-art.mjs` and rerun them.
- **`svgo.config.mjs`** drops `role` and unreferenced ids (section 1). Not edited, because it is not mine.
- **Fonts** were not in `src/assets/fonts/` yet (section 9).
- **The section 13 build check "Hex values outside tokens.css"** will find hex in `bg-lattice-red`, `bg-lattice-edge`, `bg-chart-quiet` and `bg-chart-ghost`, which DESIGN.md names, and in two public files that cannot read tokens: `public/icon.svg` and `public/site.webmanifest`. Exempt them in the check or accept them.
- The strike for a Blunder, the stamps and the chips are CSS in DESIGN.md, not SVG, so there are no files for them.
- No raster was made for the Gemini image slots; none was asked for.

## 12. Every file, with bytes

```text
src/assets/svg/art-card-back.svg                        545
src/assets/svg/art-medallion.svg                        532
src/assets/svg/bg-chart-ghost.svg                       518
src/assets/svg/bg-chart-hero-narrow.svg                3123
src/assets/svg/bg-chart-hero-wide.svg                  4249
src/assets/svg/bg-chart-quiet.svg                      2464
src/assets/svg/bg-lattice-edge.svg                      171
src/assets/svg/bg-lattice-red.svg                       171
src/assets/svg/chart-bb-vs-btn-100.svg                 7824
src/assets/svg/chart.css                               1862
src/assets/svg/frame-laptop.svg                         251
src/assets/svg/frame-phone.svg                          182
src/assets/svg/icon-alert.svg                           215
src/assets/svg/icon-arrow-down.svg                      195
src/assets/svg/icon-arrow-right.svg                     195
src/assets/svg/icon-check.svg                           193
src/assets/svg/icon-chevron-down.svg                    186
src/assets/svg/icon-chevron-right.svg                   186
src/assets/svg/icon-close.svg                           194
src/assets/svg/icon-data-export.svg                     215
src/assets/svg/icon-data-import.svg                     217
src/assets/svg/icon-data-install.svg                    225
src/assets/svg/icon-grade-best.svg                      212
src/assets/svg/icon-grade-blunder.svg                   207
src/assets/svg/icon-grade-good.svg                      193
src/assets/svg/icon-grade-inaccuracy.svg                201
src/assets/svg/icon-grade-mistake.svg                   194
src/assets/svg/icon-grade-none.svg                      182
src/assets/svg/icon-limit-entered.svg                   210
src/assets/svg/icon-limit-holdem.svg                    216
src/assets/svg/icon-limit-postflop.svg                  261
src/assets/svg/icon-menu.svg                            197
src/assets/svg/icon-minus.svg                           182
src/assets/svg/icon-pen-ring.svg                        338
src/assets/svg/icon-pen-tick.svg                        266
src/assets/svg/icon-pen-wave.svg                        314
src/assets/svg/icon-plus.svg                            190
src/assets/svg/icon-proof-charts.svg                    217
src/assets/svg/icon-proof-score.svg                     211
src/assets/svg/icon-proof-streets.svg                   215
src/assets/svg/icon-star.svg                            267
src/assets/svg/icon-suit-club.svg                       251
src/assets/svg/icon-suit-diamond.svg                    139
src/assets/svg/icon-suit-heart.svg                      184
src/assets/svg/icon-suit-spade.svg                      217
src/assets/svg/icon-tile-fame.svg                       258
src/assets/svg/icon-tile-insights.svg                   220
src/assets/svg/icon-tile-pots.svg                       250
src/assets/svg/icon-tile-shame.svg                      230
src/assets/svg/icon-tile-tilt.svg                       229
src/assets/svg/logo-lockup.svg                         2778
src/assets/svg/logo-mark-grid.svg                       468
src/assets/svg/logo-mark-mono.svg                       298
src/assets/svg/logo-mark.svg                            330
public/favicon.ico                                     1019
public/icon.svg                                         538
public/icon-192.png                                     631
public/icon-512.png                                    2616
public/apple-touch-icon.png                             595
public/site.webmanifest                                 268
public/blank.svg                                         62
public/og/home.png                                    34774
public/og/gto-hand-review.png                         29258
public/og/live-poker-hand-recorder.png                27978
public/og/default.png                                  8431
src/data/range-chart.json                              5000
scripts/build-chart.mjs                               16488
scripts/build-art.mjs                                 17480
scripts/build-og.mjs                                   8399
scripts/wordmark.json                                  4414
```

72 files including this one. Total of the lines above: 192,213 bytes.
