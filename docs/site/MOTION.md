# HandSolved site: motion plan

Owner: `animation-expert`. Written 2026-11-01, built in T22. This file owns how the site moves: what animates, when, with which tokens, in which file, and what happens without scroll timelines, without script and under reduced motion. Look stays in `DESIGN.md`, structure in `UX.md`, budgets in `ARCHITECTURE.md`. Where the build had to differ from the plan below, section 0.1 says so and wins.

**How to use this file**

- Section builders (T18 to T20): emit the hooks in section 3 and a complete static layout. Write no autoplay or scroll-linked motion yourself.
- T22: builds `motion.css` from sections 4 to 8, following the script contracts in section 9.
- QA (T24, T31, T32): the checks in section 11.

**Checked, not assumed**

| Claim | How |
|---|---|
| Cell order, the 25 raise cells and which the phone hides | Computed from `research/range-chart.json` (f[2] equal to 1, index = 13 x row + col), with a cell-centre test against the phone rectangles in DESIGN 7.1. Wide plate hides 5 raise cells (88, 77, 66, 55, 44), narrow hides 8 (JTs, TT, 99, 88, 77, 66, 55, 44). Both match DESIGN 7.1 |
| Every timeline total in this file | Added up from the tokens in `tokens.css` (120, 200, 320, 560, 900 ms, stagger 60 ms). The arithmetic is shown next to each one |
| Browser support (scroll timelines Chrome 115+ and Safari 26+, cross-document view transitions Chrome 126+ and Safari 18.2+, Firefox neither) | Taken from `ARCHITECTURE.md` section 4, not retested |
| `pathLength` on a `<rect>` (5.10) | Tested in T22, Chrome 148 and WebKit 27.2: correct in both, with CSS geometry |
| Dash lengths under `vector-effect` (5.7) | Tested in T22, same two engines: broken in both, the same way. In a viewBox scaled 2x, offset 0 draws half the line and offset 0.5 draws all of it. Never combine `non-scaling-stroke` with a drawn dash |
| The rest | Measured on the production build in T22. Numbers in 0.1 |

## 0. Rulings and items to confirm

| # | Source says | Ruling | Status |
|---|---|---|---|
| 1 | `UX.md` veil 900 ms, `ARCHITECTURE.md` and DESIGN 2 item 10 mention 700 ms | Veil is gone at **820 ms**: two doors, left at 200 ms, right at 260 ms, 560 ms each. Hero copy is uncovered by about 700 ms. Section 4.1 | Applied. Closes DESIGN 2 item 10 |
| 2 | `UX.md`: later visits get a 200 ms fade | Return visits: **nothing** from the veil (`head-guard.js` sets `data-veil="seen"`). The cross-page fade (4.2) still runs where supported | Applied |
| 3 | DESIGN 7.2 and 11: the lattice never moves. Owner brief: lattice bands drift subtly with scroll | One exception: the story band's lattice layer drifts 1 rem either way, scroll-linked, behind static text (5.4). The tile geometry never changes and nothing drifts by time. The card back, the pricing edge strip and every Quiet or Ghost chart stay still | Confirmed by the main session: keep E19. The owner asked for backgrounds that keep people engaged |
| 4 | `UX.md` 4.4 and `ARCHITECTURE.md` `Bento.ts`: hover spotlight | **Not built.** DESIGN 9.3 and 12 delete it and rule 4 bans the radial gradient it needs. Row hover (9.3) is the feedback | Confirmed by the main session: `Bento.ts` is not built, which saves 0.6 KB |
| 5 | `UX.md` 4.1: a 40-second drift on one background layer | **Not built.** It would need a pause control, and DESIGN 2 item 5 replaced that background | Applied |
| 6 | `UX.md` 4.2: scene change "scrubbed by position". DESIGN 9.3: scenes cross-fade, bar draws over `--dur-3` | `#how` is **state-driven** (IntersectionObserver in `Story.ts`, time-based transitions) in every browser. A pen stroke is a moment; frozen half-struck mid-scroll it looks broken. Scrubbing is used only where a line should follow the finger: the bankroll line and the hero art lag | Applied |
| 7 | DESIGN 7.6: strike is `scaleX`. Owner brief: `stroke-dashoffset` or clip | The strike is a straight bar, so `scaleX` is the same picture and cheaper (transform only). `stroke-dashoffset` draws everything curved or closed: bankroll line, check ring and tick, Pro rim | Applied |
| 8 | `UX.md` 6.1 and DESIGN 9.9: cards flip over 500 ms | Nearest token, `--dur-4` (560 ms) | Applied |
| 9 | `UX.md` 4.5: the last value counts up | The last-point label is SVG text and cannot hold digit wheels. The Net profit tile counts; the label rises in with the end of the line | Applied |
| 10 | DESIGN 8 mentions float | **No idle float.** A perpetual loop needs a pause control (WCAG 2.2.2) and buys nothing the tilt and rise do not | Applied |
| 11 | The role file shows `--dur-fast`, `--dur-base` and a different `--ease-out` as an example | `tokens.css` wins. Only its names appear here | Applied |
| 12 | Tokens | Add one line to `tokens.css`: `--z-veil: 80;` in the z-index block (above `--z-popover` 70). Nothing else is missing | Done by the main session |

### 0.1 As built (T22): where the build differs from the plan, and why

Each of these came from looking at the built page. Measured on the private production build, Chrome 148: LCP equals FCP in every run, with and without motion (68 and 60 ms desktop, 60 and 60 ms phone). p95 frame 17.6 ms at 4x CPU on a real wheel scroll. All CLS on that scroll comes from the navbar compaction (E03), the one layout effect that runs during a scroll.

| Effect | Plan said | Built | Why |
|---|---|---|---|
| E02 | `@view-transition` in `motion.css` | Inline, hashed `<style>` in `SiteLayout` | Chrome decides on the new page before its external stylesheets apply. Chrome with no automation attached: 1 navigation in 8 transitioned from `motion.css`, 8 in 8 inline. WebKit hides this. Automation (CDP) also makes it fail, so test it with plain Chrome |
| E09 | Close to 0.92 | `data-state="closing"` holds that pose | The open start pose is 0.6, so the close needs its own state |
| E10 | Phone rise on `.tilt` | On `.tilt__body` | Under 768 `.tilt` holds the crop, which must stay on the printed rule |
| E11 | Fill `both` | No fill | A held end frame beats the wake's hover on the 25 raise cells |
| E15 | | `.hero__proof` is opaque and above the art | Otherwise phone ink runs under the proof text as the art lags |
| E21 | Wheels stop on the final digit | The strip has 11 rows and a 0 turns a full circle | Otherwise only one wheel of 100 moves |
| E24 | Timeline and `data-draw` on `.chart-card` | On `.plot`, range `cover 15vh` to `cover 60vh` | The card is taller than the screen: on its timeline the line finished before the plot was in view |
| E24 fallback | Line draws `--ease-out` | Linear | Dots are timed as a linear share of `--dur-5`; with ease-out the line ran ahead of them |
| E24 tiles | Wheels stay | Wheels leave when they stop, or when the switch is flipped; none in a saved dollar view | The unit switch rewrites these numbers |
| E32 | Property on the wrapper; observer on the wrapper | On the footer; a marker at the sheet's end is observed | The wrapper holds the whole page: every frame restyled every element, and it never left view, so the work ran on every scroll |
| E33 | Pen mark per grade | Sprite copies of the pen icons drop `vector-effect` | See the dash test above. Their strokes now scale slightly with the box, which reads as a pen |
| E37 | Range `entry 8%` to `entry 65%` | Capped at `4vh` and `22vh`; opacity lands at the midpoint | A percentage alone left tall blocks pale wherever the visitor stopped |
| 2.4 item 4 | | `head-guard.js` removes `data-js` if a module fails to load | The pinned story hides scenes under `html[data-js]`. A failed script now gets the no-script layout, where everything shows |

## 1. Inventory

**Attention effect** means the one motion in a section that plays by itself or on scroll and is meant to be noticed. There is at most one per section. Feedback (hover, press, switch, open) answers the visitor and does not count. Scroll-linked depth is quiet and does not count.

### 1.1 By section

| Section | Attention effect (max 1) | Entrance | Feedback | Scroll-linked depth |
|---|---|---|---|---|
| Global | Veil, "The cut" (E01), first home visit per session | Page cross-fade (E02) | Navbar slip, button swap, menu circle, mobile bar (E04 to E07), anchor scroll (E08) | Navbar compaction (E03) |
| Hero | The chart reads itself while the coach marks it: scan (E11) and the pen strike (E12) on the slip, complete at 1.9 s. 3.2 s in all, once | H1 lines and phone rise (E10) | Chart wake (E13), phone tilt (E14) | Art lag (E15) |
| `#how` | Pen strike on the Coach scene (E18) | Section head (E37) | Scene change, chips and step bar are the mechanism (E16, E17) | None |
| Story band | The phone rises into the band (E20) | | | Lattice drift (E19, see ruling 3) |
| `#engine` | Three counters roll (E21) | Head, figure sheet (E37) | None | None |
| `#highlights` | Tile rows slide in (E22) | None | Tile edge (E23) | None |
| `#numbers` | Bankroll line draws with scroll (E24) | Head (E37) | Unit switch and number flip (E25), readout (E26) | None |
| `#toolbox` | Device assembles in the panel (E27) | Head (E37) | Tab thumb, panel fade-through (E27) | None |
| `#data` | Three cards rise, staggered (E28) | | Card edge (E23) | None |
| `#showdown` | One ring on the dealer button when the table is in view (E39). The deals themselves are the visitor's own press (E40 to E42) | The page above dims and the table comes up, scrubbed by scroll (E39) | Card select, puck hover (E43) | Arrival and the navbar stepping away (E39) |
| `#pricing` | None. Interactive only | Cards (E37) | Price swap and thumb (E29), Pro rim (E30) | None |
| `#faq` | None. Interactive only | Head (E37) | Accordion (E31) | None |
| `#start`, footer | The sheet lifts and the card back is uncovered (E32) | None | Link and button hover | None |
| Pop-up 1 | Verdict reveal on commit (E33) | Open (E09) | Deal (E34), what-if (E35) | None |
| Pop-up 2 | Success check draws (E36) | Open (E09) | None | None |
| Product pages | Same hooks as home. See section 8 | | | |

### 1.2 What never animates

- Body copy, headings after they have settled, form fields, labels, the options table, grade chips, the session stamp, legal pages (page fade only).
- Chart cells and the Engine figure. Nothing moves a cell. Only a keyline ring fades over them (E11, E13).
- The lattice tile (size, line weight, colour), the pricing edge strip, the Ghost and Quiet charts, device frames, screenshot pixels.
- Focus rings (instant), error messages (no shake, no pulse: the message row is reserved), the skip link, the favicon.
- Never used anywhere: gradients, blur, glow, sheen, shimmer, skeleton shimmer, spinners, hover lift, text parallax, scroll-jacking, idle float, marquees, auto-advancing tabs, custom cursors, ripples, confetti, rotating words, blur-in text, number counting by script on every frame.
- Never animated properties: `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`, `filter`, `backdrop-filter`, `background-position`, any gradient. Sanctioned exceptions are listed in 2.3.

## 2. Motion system

### 2.1 Tokens in use

All names are in `tokens.css`. No duration or easing literal appears in `motion.css`, except `1ms` on the veil's final `visibility` step.

| Token | Value | Used for here |
|---|---|---|
| `--dur-1` | 120 ms | Presses, colour, fade-outs, outgoing page, H1 first-line delay |
| `--dur-2` | 200 ms | Hover, stamp landing, small fades, dialog close, veil hold, phone delay |
| `--dur-3` | 320 ms | Switches, strike and write-in, nav compaction, accordion, incoming panel and page |
| `--dur-4` | 560 ms | Entrances, morphs, menu reveal, dialog open, veil doors, card flips |
| `--dur-5` | 900 ms | Counters, scan ring life, chart wake fade, start of the scan |
| `--stagger` | 60 ms | Sibling offset and scan step. Collapses to 0 under reduced motion |
| `--ease-out` | fast then settle | Entrances, draws, strike |
| `--ease-in-out` | even | Cross-fades, exits, doors, circle reveal |
| `--ease-spring` | slight overshoot (`linear()` where supported) | Thumbs, slips, dialog open, the red cell |

Travel distances reuse spacing tokens: `--space-sm` 8 px (chips), `--space-lg` 24 px (reveals), `--space-xl` 32 px (device rise), `--space-2xl` 48 px (hero art lag, the most any depth effect moves anything). The library names `--transition-fast` and `--transition-smooth` exist for imported modules; new code does not use them.

**To add to `tokens.css`: `--z-veil: 80;`** and nothing else.

### 2.2 Duration and easing by kind

| Kind | Duration | Easing |
|---|---|---|
| Colour, press | `--dur-1` | linear |
| Hover edge or fill | `--dur-2` | `--ease-out` |
| Exit of anything | `--dur-1` or `--dur-2` | `--ease-in-out` |
| Entrance of a block | `--dur-4` | `--ease-out` |
| Draw of a line | `--dur-3` (strike, tick), `--dur-4` (ring, rim), `--dur-5` (fallback bankroll) | `--ease-out` |
| Thumb, slip, dialog | `--dur-3` or `--dur-4` | `--ease-spring` |
| Scroll-linked | No duration. Position decides | linear |

**Stagger rules.** `--stagger` (60 ms) per item, at most 6 items per group (the index `--n` stops at 5). Siblings stagger only where they enter together, so only at 768 and up; under 768 each enters alone with no delay. Order is DOM order. Body text never staggers. The hero scan is a sequence rather than an entrance: 25 steps of `--stagger`, total under 3.3 s, and it is the only exception.

### 2.3 Properties

- **Always allowed:** `transform`, `opacity`.
- **Colour on small elements, hover and focus only:** `color`, `background-color`, `border-color`, `outline-color`.
- **Allowed, paint only:** `stroke-dashoffset` (draws), `clip-path` on the mobile menu panel only.
- **Sanctioned layout exceptions**, each on one small contained element and never on scroll: nav bar `inline-size` and `block-size` (E03), nav slip and tab thumb `inline-size` (E04, E27), FAQ `grid-template-rows` (E31), pop-up 2 height morph by Web Animations (E36).
- **Nothing else.** `will-change` is not used: the browser promotes a layer while a transform or opacity animation runs.

### 2.4 Gating

1. `motion.css` is **one block**: `@media screen and (prefers-reduced-motion: no-preference) { ... }`. Under `reduce` or print the file adds nothing, so every element sits in its end state. Anything that hides an element until it animates lives inside that block.
2. Component CSS must be complete without `motion.css`: layout, every state, a stacked story, a flow footer.
3. Scroll-timeline rules sit in a nested `@supports (animation-timeline: view())`. Where it fails, the element is simply visible.
4. Start poses that need script (`html.reveal-io`, `.story--js`) exist only after the module that uses them adds the class, so no-script and failed-script pages show everything. `html[data-js]` from `head-guard.js` is **not** a gate for hiding anything: it only proves the inline script ran, not that a module loaded.
5. Scripts skip building rolls, wheels, FLIP and the FAQ intercept when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
6. Hover effects sit inside `@media (hover: hover)`. Nothing that matters is reachable only by hover. Tilt, wake and the Pro rim are decoration.
7. Forced colors: `del.pen::after` paints with `background`, which forced colors replaces. Add `@media (forced-colors: active) { del.pen::after { background: CanvasText; } }`.

### 2.5 The scroll-timeline block, and the Lightning CSS trap

`ARCHITECTURE.md` section 4 rule 1: Lightning CSS folds `animation-timeline` into an `animation:` shorthand in the same rule, and Chrome and WebKit then reject it, in production builds only. In every scroll-linked rule write **only** these five longhands: `animation-name`, `animation-timing-function`, `animation-fill-mode`, `animation-timeline`, `animation-range`. Never write `animation-duration`, `-delay`, `-iteration-count`, `-direction` or `-play-state` in the same rule, because a complete set can be folded too. Duration is `auto` by default for scroll timelines, so nothing is lost. Never use the `animation:` shorthand with `view(` or `scroll(`. Time-based animations (no timeline) may use the shorthand freely.

```css
@media screen and (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    [data-reveal] {
      animation-name: reveal-up;
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-timeline: view();
      animation-range: entry 8% entry 65%;
    }
  }
  @keyframes reveal-up { from { opacity: 0; transform: translateY(var(--space-lg)); } }
}
```

No `overflow: hidden`, `auto` or `scroll` may sit between a scroll-linked element and the page (`overflow: clip` is fine), or its timeline binds to that box and never moves.

### 2.6 CSP rules for scripts

- No `style` attributes in markup, no `<style>` in SVG, no `data:` URIs, no inline handlers.
- Scripts set state with `el.style.setProperty('--x', value)`, `el.style.transform = ...` (drag only), `classList`, `dataset`. Never `setAttribute('style')`, `cssText` or `innerHTML` with `style=`.
- Every per-item number the CSS needs (`--n`, `--k`, `--t`, `--d`) comes from `:nth-child` rules, a class or data attribute chosen at build time, or `setProperty`. Never markup `style`.
- Scripts never hard-code a duration. Read it: `const ms = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n))`. Under reduced motion the token is 0.01 ms, so a timer built from it is already instant. Inline this three-line helper in each file that needs it.

## 3. Hooks and file split

### 3.1 File split

| File | Owns |
|---|---|
| `src/styles/motion.css` (T22) | The single gated block: veil, view transition, hero entrance, scan, wake, tilt, lag, pen, reveals and their fallback gate, lattice drift, story states, wheels and rolls, bankroll draw, rim, price swap, FAQ panel, footer consumers, dialog open and close, verdict timeline, success, navbar and menu and bar transitions, smooth anchor scroll |
| Component CSS beside each component | The static layout and every non-motion state, plus the colour hover, focus and active transitions on `--dur-1` and `--dur-2` (states, inside `@media (hover: hover)`) |
| Component TS | State and measurement only. Classes, data attributes, `setProperty`. The only per-frame work is the footer progress and the chart readout (section 10) |

### 3.2 Markup contract

What builders emit so `motion.css` can attach without editing section files.

| Hook | Emitted by | Contract |
|---|---|---|
| `.veil` | `SiteLayout`, home only | First element in `<body>`: `<div class="veil" aria-hidden="true" inert>` holding `.veil__door--l` and `.veil__door--r`. Each door holds its own copy of the 104 px grid mark (`.veil__mark`, from `logo-mark-grid`, Face White spade) whose red cell is the file's own `.mark-cell` |
| `.site-header`, `.mobile-cta` | `Navbar`, `MobileCtaBar` | Plain classes; they get view-transition names in CSS |
| `.hero__h1 .line > .line__in` | `Hero` | Each of the three display lines is `<span class="line"><span class="line__in">Every hand</span></span>`, display block. The kicker inside the H1 stays outside the lines |
| `.hero__art` | `Hero` | One wrapper holding plate, `.plate__grid`, `.tilt` (phone), `.slip`. The whole wrapper moves for the lag, so phone and plate never shift against each other |
| `.plate__grid` | `Hero` | `aria-hidden` list of 169 empty `<i>` in data order (index = 13 x row + col). The 25 pure-raise cells also carry class `r`. Placed over the plate's chart area, under the phone |
| `.tilt`, `.tilt__body`, `.tilt__zones` | `PhoneFrame` hero variant | `.tilt` is static and holds the phone as `.tilt__body` plus `.tilt__zones`, nine `aria-hidden` `<i class="z1">` to `z9` in a 3 by 3 grid over it |
| `del.pen`, `ins.pen` | Hero slip, story callouts, verdict | As DESIGN 7.6. The wipe cover color comes from `--wipe-bg` (default `--surface-raised`; set `--surface-page` where the ground is stock) |
| `[data-reveal="up"]`, `"rise"`, `"row"`, `[data-reveal-stagger]` | Sections | Section 5 lists which elements. Never on anything in the first viewport of any page, and never on the LCP candidate |
| `.story`, `.story__step`, `.story__scene`, `.story__dot`, `.story__chip` | `Story` | `Story.ts` adds `.story--js` to the root and `.is-active` to the matching step, scene and dot |
| `.band__lattice` | Story band | The lattice is always a child layer with `inset: -1rem 0`, never the band's own background, so it can move without restructuring. The band keeps `overflow: clip` |
| `.count`, `.count__w` | `Counter` | Real number in the HTML. `Counter.ts` builds the wheels |
| `.num > .num__v` | Every live number | `UnitSwitch.ts` sets `data-prev` on `.num` and the new text on `.num__v` |
| `.plot`, `.chart__line`, `.dot` | `Numbers` | Line is a `<path pathLength="1">`. Each dot carries `data-t="0"` to `"20"` (section 5.7). The plot carries `data-draw` and the view timeline (0.1) |
| `.switch__thumb` | Unit and billing switches | Position follows `html[data-unit]` or `:has(input:checked)` |
| `.price__m`, `.price__y` | `Pricing` | Both prices in the HTML, stacked in one grid cell |
| `.rim` | Pro card | `<svg class="rim" aria-hidden="true"><rect pathLength="1"/></svg>` filling the card |
| `.faq__item > summary + .faq__panel > .faq__inner > .faq__body` | `Faq` | Paddings live on `.faq__body`, never on `.faq__inner` or the row will not collapse to 0 |
| `.reveal-footer`, `__sheet`, `__footer`, `.cardback__stage`, `.cardback__dim`, `.medallion`, `.mark-cell` | `SiteFooter` | Library wiring. `.cardback__dim` is an empty flat `--surface-dark` layer. The lattice is a child layer here too |
| `[data-state]` on `dialog` | `Dialog` | `data-state="open"` set two frames after `showModal()` (library pattern) |

## 4. Global layer

### 4.1 E01 Page-load veil, "The cut"

**Purpose.** A brand moment that tells the visitor this is a deck of cards, and nothing else. It must cost the hero nothing.

**What happens, first home visit per session (times from the start of the document):**

| t (ms) | What | Token | Property |
|---|---|---|---|
| 0 | First frame. Hero text, phone and plate are already painted at full opacity underneath. The veil covers the viewport: two flat Key Black doors meeting at the centre line, the 104 px mark straddling the seam | none | none |
| 0 | The red cell (the chart's centre cell, 88) prints: scales 0.4 to 1 in both door copies | `--dur-2`, `--ease-spring` | transform |
| 200 | Left door is dealt off to the left | `--dur-4`, `--ease-in-out` | transform |
| 260 | Right door follows to the right. The mark and the red cell split down the middle of the centre column as the doors part | `--dur-4`, `--ease-in-out` | transform |
| about 700 | Hero copy is fully uncovered (ease-in-out puts the door edges past the copy column by then) | | |
| 820 | Veil root becomes `visibility: hidden`. Done | `1ms` step | visibility |

`820 = 200 (--dur-2) + 60 (--stagger) + 560 (--dur-4)`, under the 900 ms ceiling. The CSS delay is written as `calc(var(--dur-2) + var(--stagger) + var(--dur-4))`.

```css
.veil { display: none; }
@media screen and (prefers-reduced-motion: no-preference) {
  html:not([data-veil="seen"]) .veil {
    display: block; position: fixed; inset: 0; z-index: var(--z-veil, 80);
    pointer-events: none; contain: strict;
    animation: veil-end 1ms linear calc(var(--dur-2) + var(--stagger) + var(--dur-4)) forwards;
  }
  .veil__door { position: absolute; inset-block: 0; width: calc(50% + 0.5px); overflow: clip; background: var(--surface-dark); }
  .veil__door--l { left: 0;  animation: veil-l var(--dur-4) var(--ease-in-out) var(--dur-2) forwards; }
  .veil__door--r { right: 0; animation: veil-r var(--dur-4) var(--ease-in-out) calc(var(--dur-2) + var(--stagger)) forwards; }
  .veil__door .veil__mark { position: absolute; top: 50%; margin-top: -52px; width: 104px; height: 104px; }
  .veil__door--l .veil__mark { right: -52px; }
  .veil__door--r .veil__mark { left: -52px; }
  .veil__cell { transform-box: fill-box; transform-origin: center; animation: veil-cell var(--dur-2) var(--ease-spring) both; }
  @keyframes veil-l { to { transform: translateX(-100%); } }
  @keyframes veil-r { to { transform: translateX(100%); } }
  @keyframes veil-cell { from { transform: scale(0.4); } }
  @keyframes veil-end { to { visibility: hidden; } }
}
```

- The seam passes through the middle of the mark's centre column (52 px of 104), which is the red cell's centre: the cell is cut in half exactly.
- **Return visits and reloads in the same session:** `head-guard.js` sets `data-veil="seen"` before first paint, so the selector never matches and the veil is not shown. A new tab or session plays it once. No script: the veil plays on every load, driven only by CSS.
- **Home only.** No veil markup on other pages.
- **LCP and CLS.** The veil is `position: fixed` and paints nothing the hero needs. The hero is never at opacity 0 and never translated by this effect. `ARCHITECTURE.md` section 4 verified LCP equals first paint with the veil playing; T32 measures the real page.
- **Fail-safe.** The veil is displayed only inside the gated block, together with the animations that remove it, and it never takes pointer events or focus (`inert`, `pointer-events: none`). Reduced motion and print never display it. If the stylesheet fails to load there is no veil at all.
- Reduced motion, print, and `display: none` default: no veil. Fallback: not needed.
- File: `motion.css` section "veil".

### 4.2 E02 Page-to-page transition

**Purpose.** Pages feel like one app. The header does not blink.

- **Tool.** `@view-transition { navigation: auto; }`, cross-document, no script. Both pages carry it because every page loads `motion.css`. Chrome 126+, Safari 18.2+. Elsewhere: plain navigation.
- **Named parts.** `.site-header` is `site-header`, `.mobile-cta` is `mobile-cta`. They persist (animation `none`). Everything else is the root snapshot.
- **Timing.** Old page fades out over `--dur-1` (`--ease-in-out`). New page fades in over `--dur-3` (`--ease-out`). Opacity only: no slide, so the sticky footer and fixed layers cannot misalign. The dip lands on Card Stock, which is the page ground, so it reads as a clean fade-through. `UX.md` says 250 ms; the tokens give 320 ms for the new page, which wins.
- Same-page anchors (`#how`) are not navigations and do not transition.

```css
@media screen and (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
  .site-header { view-transition-name: site-header; }
  .mobile-cta  { view-transition-name: mobile-cta; }
  ::view-transition-group(site-header), ::view-transition-group(mobile-cta) { z-index: 1; }
  ::view-transition-old(site-header), ::view-transition-new(site-header),
  ::view-transition-old(mobile-cta),  ::view-transition-new(mobile-cta) { animation: none; mix-blend-mode: normal; }
  ::view-transition-old(root) { animation: vt-out var(--dur-1) var(--ease-in-out) both; }
  ::view-transition-new(root) { animation: vt-in  var(--dur-3) var(--ease-out) both; }
  @keyframes vt-out { to { opacity: 0; } }
  @keyframes vt-in  { from { opacity: 0; } }
}
```

- Home after another page, first time in the session: the veil plays inside the new page while the root fades in. They overlap harmlessly.
- Reduced motion: rule absent, so plain navigation. File: `motion.css`.

### 4.3 E03 Navbar compaction

- **Purpose.** The bar tightens once you leave the top, so it stays out of the way.
- **Tool and trigger.** `Navbar.ts` watches a 1 px sentinel placed 16 px below the document top with an IntersectionObserver and toggles `data-scrolled` on the header. No scroll listener, no per-frame work.
- **Timing.** Width to `min(100% - 2 x --gutter, --nav-w-scrolled)`, height `--nav-h-top` to `--nav-h-scrolled`, ground to `--surface-raised`, border from transparent to `--line-strong`: all `--dur-3`, `--ease-out`. The border is 1 px transparent at the top so nothing shifts.
- **Animates.** `inline-size`, `block-size` (sanctioned exception 2.3: one fixed element, about a dozen nodes, contained with `contain: layout style`), colours.
- Reduced: instant. No fallback needed. File: `motion.css`; trigger in `Navbar.ts`.

### 4.4 E04 Navbar slip

- **Purpose.** Shows where you are and where you are about to go.
- The `--surface-muted` slip glides to the hovered or focused link and rests on `aria-current`. `Navbar.ts` sets `--x` and `--w` with `setProperty` on pointer-over, focus-in, pointer-leave and focus-out. The slip transitions `transform` and `inline-size` over `--dur-3` with `--ease-spring`; opacity over `--dur-1`.
- First appearance jumps into place: the script turns the transition off for one frame so the slip never grows from zero.
- On home the current link follows the section in view (`aria-current="true"`, section observer in `Navbar.ts`), and the slip springs to it.
- Hover rule applies to pointer; focus always moves it. Reduced: no glide. File: `motion.css`, `Navbar.ts`.

### 4.5 E05 Navbar button swap

- Secondary (outline) while the hero CTA is in view, primary after it leaves; pages with no hero CTA are primary. `Navbar.ts` observes the hero CTA and sets `data-cta="primary"`.
- Colour and background only, `--dur-2`. Size never changes. Reduced: instant. File: component CSS plus `Navbar.ts`.

### 4.6 E06 Mobile menu reveal

- **Purpose.** The menu grows out of the button that opened it.
- **Tool.** Modal `<dialog>` with `clip-path`. `Navbar.ts` sets `--mx` and `--my` (the burger's centre) with `setProperty`, calls `showModal()`, then sets `data-state="open"` two frames later.
- **Timing.** `clip-path: circle(0 at var(--mx) var(--my))` to `circle(150vmax at var(--mx) var(--my))`, `--dur-4`, `--ease-in-out`, open and close. The panel is flat `.on-ink`: no gradients (DESIGN 12).
- **Links.** Four links, the primary button and the concept note rise 24 px (`--space-lg`) and fade in, item n starting at `calc(var(--dur-2) + var(--n) * var(--stagger))`, `--dur-4`, `--ease-out`. Six items, the stagger limit. On close they fade over `--dur-1` with no stagger. No blur (library uses it; delete).
- **Burger.** `icon-menu` turns 90 degrees and fades out while `icon-close` turns in from minus 90 degrees, `--dur-3`, `--ease-spring`.
- Close and focus return are native `<dialog>` behaviour plus the exit timer, read from `--dur-4`. Reduced: panel appears and disappears instantly. No script: links wrap under the brand (UX 2). File: `motion.css`, `Navbar.ts`.

### 4.7 E07 Mobile CTA bar

- Under 768 only. Hidden: `translateY(100%)` and `visibility: hidden`. Visible: `translateY(0)`. `MobileCtaBar.ts` sets `data-visible` by the rules in UX 2 (hero CTA gone shows it; open dialog or menu, closing band 20 percent visible, or story 50 percent in view hides it).
- Slide `--dur-3`, `--ease-out`. Visibility flips after the slide on hide (`transition: transform var(--dur-3) var(--ease-out), visibility 0s linear var(--dur-3)`; delay 0 on show), so the hidden bar's button cannot take focus. Translated off, never faded (DESIGN 9.2). Reduced: instant. File: `motion.css`, `MobileCtaBar.ts`.

### 4.8 E08 Smooth anchor scroll

`html { scroll-behavior: smooth; }` inside the gated block. `scroll-padding-top: var(--scroll-pad)` is already in `global.css`. Reduced: jumps. Native scrolling only; nothing intercepts the wheel or touch.

### 4.9 E09 Dialog open and close

- **Purpose.** The dialog comes from the button you pressed, and leaves fast.
- **Where it matters.** The dialog opens at once, before its module arrives, so this is CSS plus the delegated listener in `Dialog.ts`. No loading animation: skeleton blocks are flat and still (DESIGN 9.9).
- **768 and up.** In the same task as `showModal()` (the dialog's offset is only known after it), `Dialog.ts` sets `--ox` and `--oy` (trigger centre minus dialog offset) with `setProperty`. Open: `transform: scale(0.6)` to none, origin at the trigger, `--dur-4`, `--ease-spring`; opacity `--dur-3`, `--ease-out`. Close: scale to 0.92 and opacity to 0 over `--dur-2`, `--ease-in-out`. Scrim `--scrim` (flat, no blur): `--dur-3` in, `--dur-2` out.
- **Under 768 (sheet).** `translateY(100%)` to 0, `--dur-4`, `--ease-out`; close `--dur-3`, `--ease-in-out`.
- **Sheet drag.** Pointer events on the handle and header move the dialog with `el.style.transform` and `transition: none` while dragging, and set `--drag-p` (0 to 1) so `::backdrop` opacity is `calc(1 - var(--drag-p, 0))`. Release: past 120 px or faster than 0.6 px/ms closes (continuing from the current position over `--dur-3`); otherwise it springs back over `--dur-3`, `--ease-spring`.
- **Swapping pop-ups.** Pop-up 1 exits (`--dur-2`), then pop-up 2 opens from the same origin. Total about 760 ms.
- The state (`open`, `aria-pressed`, focus target) changes at the start of a transition, never after it.
- Reduced: no start pose, no spring, no slide; the dialog shows and hides at once. File: `motion.css`, `Dialog.ts`.

## 5. Home sections

### 5.1 Hero

**Hero timeline (everything is CSS, no script, same on return visits):**

| t (ms) | Effect |
|---|---|
| 0 | First paint. H1 lines sit 0.28 em low inside their masks, the phone sits 32 px low. All at full opacity |
| 120 + 60n | H1 line n (n = 0, 1, 2) rises into place, `--dur-4` (done by 800) |
| 200 | Phone rises over the plate, `--dur-4` (done by 760) |
| 900 | Scan starts (E11): 25 rings, one per `--stagger`, each lasting `--dur-5`. The slip (E12, 768 and up) arrives whole, with its worth line, `--dur-3` |
| 1220 | Pen strike starts (E12) |
| 1540 | Write-in starts. Strike is drawn |
| 1860 | The slip is complete: Call 65 bb struck, Fold written in, the worth line in place |
| 2340 | Last ring lights |
| 3240 | Last ring is out |

Total 3.2 s, under the 5 s autoplay limit, so no pause control is needed. The veil (E01) ends at 820 ms, so the scan and the slip start after it with or without a veil. The slip does not wait for the scan (it used to, and sat as a mostly empty white box until 3.3 s): its text is complete 1.9 s after load, and it is never on screen before it can show its words.

#### E10 H1 line rise and phone rise

- **Purpose.** The headline and device settle into place as the veil leaves, with no delay to the first paint of either.
- **Tool.** CSS keyframes.
- **Spec.** `.line { overflow-y: clip; overflow-x: visible; padding-block-end: var(--display-mask-pad); margin-block-end: calc(-1 * var(--display-mask-pad)); }` (DESIGN 4.4). `.line__in` animates `translateY(0.28em)` to none over `--dur-4`, `--ease-out`, delay `calc(var(--dur-1) + var(--n) * var(--stagger))`, fill `both`, so the offset pose exists from the first frame. `--n` is 0, 1, 2 by `:nth-child`. The phone animates `translateY(var(--space-xl))` to none over `--dur-4`, delay `--dur-2`. Opacity never changes. Three elements carry three separate transforms and never conflict: the rise is on `.tilt`, the lean (E14) on `.tilt__body`, the lag (E15) on `.hero__art`.
- **LCP.** The text is painted on the first frame with about 70 percent of each line visible inside the mask, so the H1 is a valid LCP candidate from frame one and the rise cannot delay it. T32 compares LCP with motion on and with `reduce` emulated; the difference must be inside noise (50 ms).
- Subhead, buttons, micro-line and proof strip do not move.
- Reduced: no animation, lines and phone at rest. Fallback: none. File: `motion.css`.

#### E11 Chart scan

- **Purpose.** The chart is the proof. A comet of lit cells reading across the solved hands shows that it is a real, ordered chart, and shows it without moving a single cell.
- **Which cells.** The 25 pure-raise cells, in the chart's data order (reading order, index = 13 x row + col), one ring per `--stagger`:

| k | Hand | Index | k | Hand | Index | k | Hand | Index |
|---|---|---|---|---|---|---|---|---|
| 0 | AA | 0 | 9 | KJs | 16 | 18 | TT | 56 |
| 1 | AKs | 1 | 10 | AQo | 26 | 19 | 99 | 70 |
| 2 | AQs | 2 | 11 | KQo | 27 | 20 | 88 | 84 |
| 3 | AJs | 3 | 12 | QQ | 28 | 21 | 77 | 98 |
| 4 | ATs | 4 | 13 | QJs | 29 | 22 | 66 | 112 |
| 5 | A9s | 5 | 14 | AJo | 39 | 23 | 55 | 126 |
| 6 | AKo | 13 | 15 | JJ | 42 | 24 | 44 | 140 |
| 7 | KK | 14 | 16 | JTs | 43 | | | |
| 8 | KQs | 15 | 17 | ATo | 52 | | | |

  The `.r` cell with index i is `.plate__grid > :nth-child(i + 1)`; its `--k` is set by one rule per cell (25 short rules). If the JSON changes, regenerate this table and the rules from it.
- **What lights.** A 1.5 px Key Black ring (`--border-mark`, `--line-ink`) in the gap around the cell, drawn by the cell's `::after` at `inset: 0`. The ink square is 72 percent of the cell, so the gap is 14 percent per side (about 7 px at 49 px a cell, 3.4 px at 24.6) and the ring touches no ink. Only the ring's opacity changes.
- **Timing.** Each ring: 0 to 1 by 15 percent, held to 60 percent, out by 100 percent of `--dur-5`, linear. Delay `calc(var(--scan-start) + var(--k) * var(--stagger))` with `--scan-start: var(--dur-5)` on `.hero`. About 15 rings are lit at once, a trail that reads down the page row by row, then down the diagonal. The phone covers some rings: on the wide plate 88 to 44 (k 20 to 24); on the narrow plate JTs, TT and 99 to 44 (k 16 and 18 to 24). The trail simply walks behind the phone. Nothing needs to know.
- **Animates.** `opacity` on a pseudo-element. No layout, no transform, no cell moves.
- **Flashing.** Each location changes once in 900 ms and the changing area is hairline rings. Far under the 3 per second limit.
- **Tool.** CSS keyframes, no script. Grid cells use `--chart-u-hero` so the overlay matches the plate at every breakpoint.
- Reduced: rings stay at opacity 0. No script: same. File: `motion.css`; markup from `Hero`.

```css
/* Hero.css: static structure, complete without motion.css */
.plate__grid { position: absolute; inset: 0 auto auto 0; display: grid;
  grid-template: repeat(13, var(--chart-u-hero)) / repeat(13, var(--chart-u-hero)); }
.plate__grid > i { position: relative; }
.plate__grid > i::after { content: ""; position: absolute; inset: 0; opacity: 0;
  border: var(--border-mark) solid var(--line-ink); }

/* motion.css: inside the gated block */
.hero { --scan-start: var(--dur-5); }
.plate__grid > .r::after { animation: scan-ring var(--dur-5) linear both;
  animation-delay: calc(var(--scan-start) + var(--k) * var(--stagger)); }
@keyframes scan-ring { 0% { opacity: 0; } 15% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
```

This is a time-based animation, so the `animation` shorthand is fine here; the longhand rule in 2.5 applies only to scroll timelines.

- **If the owner wants it to loop:** repeat every 12 s. That is longer than 5 s, so it then needs a pause control, built with no script: a visible `<label>` with a checkbox ("Pause motion") beside the plate caption and `:root:has(.motion-pause:checked) * { animation-play-state: paused; }`. Not built by default.

#### E12 Pen strike and write-in on the hero slip (768 and up)

- **Purpose.** The brand's one gesture: your call struck out, the better play written in. It lands while the chart scan runs, and the slip is complete 1.9 s after load.
- **Spec.** `<del class="pen">Call 65 bb</del> <ins class="pen">Fold</ins>` in the slip, with the line "Calling here is worth {value}" (it follows the unit state, so it is a `.num`). The slip itself arrives first: `rise-in`, `--dur-3`, `--ease-out`, delay `--slip-delay` = `--scan-start` = 900 ms, longhands, fill `both` so the box is not on screen before then. `--pen-delay: calc(var(--slip-delay) + var(--dur-3))` = 1220 ms.
  - Strike (`del.pen::after`): `scaleX(0)` to 1 at `rotate(var(--pen-tilt))`, origin left, `--dur-3`, `--ease-out`, from `--pen-delay`. Keyframe: `from { transform: rotate(var(--pen-tilt)) scaleX(0); }`.
  - Write-in (`ins.pen::before`, a cover in `--wipe-bg`, origin right): `scaleX(1)` to 0, `--dur-3`, `--ease-out`, delay `calc(var(--pen-delay) + var(--dur-3))`. Reads left to right like writing. The text stays in the DOM for screen readers.
  - The worth line is part of the slip and arrives with it. It has no animation of its own.
- Below 768 the slip is hidden (DESIGN 7.1). Reduced: drawn and written already. File: `motion.css`. The same `del.pen` and `ins.pen` rules serve E18 and E33 with a different `--pen-delay`.

#### E13 Chart wake (fine pointers)

- **Purpose.** The chart answers the mouse.
- **Spec.** Hovering a cell of `.plate__grid` lights its ring at once; leaving fades it over `--dur-5`, so moving across the plate leaves a trail of fading rings. Opacity only. The phone sits above the grid, so cells under it cannot be hovered.
- Only inside `@media (hover: hover) and (pointer: fine)`. Decoration: the plate is `aria-hidden`.

```css
/* motion.css: inside the gated block */
@media (hover: hover) and (pointer: fine) {
  .plate__grid > i::after { transition: opacity var(--dur-5) var(--ease-out); }
  .plate__grid > i:hover::after { opacity: 1; transition: none; }
}
```

- Cost: 169 empty elements (about 1.6 KB of HTML before compression, about 0.15 KB after). **Cut first** if the hero HTML goes over its share. The scan (E11) uses the same grid, so cutting the wake saves only the hover rules. File: `motion.css`.

#### E14 Phone tilt (fine pointers)

- **Purpose.** The device feels solid. At most 2.5 degrees (DESIGN 8 allows 3), no shadow, no sheen.
- **Spec.** The nine zones sit over a static `.tilt`. The hovered side leans away: top row `rotateX(+2.5deg)`, bottom row minus; left column `rotateY(-2.5deg)`, right column plus; centre flat. `.tilt:has(.z1:hover) { --rx: 2.5deg; --ry: -2.5deg; }` and so on for the other eight zones. `.tilt__body { transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform var(--dur-4) var(--ease-out); }`. The zones belong to the static wrapper, so the tilt cannot move the box under the pointer and flicker between zones.
- Pointer-accurate tilt would need script that is not in the `ARCHITECTURE.md` list, so it is not used.
- Only `(hover: hover) and (pointer: fine)`. Reduced: none. Applies to the hero phone and the story band phone only; every other device stays still.

#### E15 Hero art lag

- **Purpose.** Depth: the art block lags the copy as you scroll away.
- **Spec.** `.hero__art` gets `translateY(0)` to `translateY(var(--art-lag))` over `animation-range: exit 0% exit 100%`, linear, scroll-driven. `--art-lag` is `--space-2xl` (48 px) from 768 and `--space-xl` (32 px) under 768, where the caption is the last thing in the art and sits 24 px above the opaque proof strip: the caption also has 16 px of padding under it there, so it stays 8 px clear of the strip at the lowest point. The whole wrapper moves, so the clear halo the plate leaves around the phone stays exact.
- Longhand block per 2.5. Fallback and reduced: still. File: `motion.css`.

### 5.2 `#how`: the pinned story

State comes from `Story.ts` (about 0.5 KB, an IntersectionObserver with `rootMargin: -50% 0px -40% 0px`): `.is-active` on the matching step, scene and dot, and `aria-current="step"` on the step. All visuals below are time-based CSS keyed to those classes, identical in every browser. No scroll timelines are used here, so this section needs no fallback.

The pinned layout (`position: sticky`, DESIGN 8) is enabled inside the gated block and only when the viewport is at least 600 px tall. Under `reduce` or on short screens the story stacks: step, text, 240 px phone, everything drawn.

#### E16 Scene change, chips and dots

- **Purpose.** The device shows what the step says.
- **Spec.**
  - Scenes (the captures) cross-fade: opacity, `--dur-4`, `--ease-in-out`. The phone frame itself never moves. No scale, no blur.
  - Chips (`.slip` callouts, two per step) rise 8 px (`--space-sm`) and fade in, chip n starting at `calc(var(--dur-2) + var(--n) * var(--stagger))`, `--dur-4`, `--ease-out`. On deactivation they fade over `--dur-2`.
  - Dots: colour over `--dur-3`.
  - Step title: Soft Black to Key Black over `--dur-3` on activation.
- Reduced: swap instantly, chips in place. File: `motion.css`, `Story.ts`.

#### E17 Step bar (the progress line)

- **Purpose.** Marks where you are.
- **Spec.** The 2 px Pip Red bar at the left of the active step draws top to bottom: `scaleY(0)` to 1, origin top, `--dur-3`, `--ease-out`. Passed steps lose it by opacity over `--dur-2`; the selector for "passed" is `.story__step:has(~ .story__step.is-active)`, so no script marks them.
- Reduced: shown on the active step at once. File: `motion.css`.

#### E18 Pen strike on the Coach scene (the section's attention effect)

- **Purpose.** "You called. GTO folds." The mark is made as you reach the step.
- **Spec.** Coach scene callouts: "You: <del class="pen">Call 65 bb</del>" and "GTO: <ins class="pen">Fold</ins> 96%". When the Coach scene becomes active, `--pen-delay` is `var(--dur-3)` (320 ms): the strike draws over `--dur-3`, then the write-in wipes over `--dur-3`. Done 960 ms after activation. Scrolling back to Coach replays it, because the animation names apply only while `.is-active` does.
- The strike and write-in are the same rules as E12. Without `.story--js` (no script, stacked layout, reduced) they are drawn.
- File: `motion.css`.

### 5.3 Story band end (red band)

#### E20 Phone rise

The band phone is `data-reveal="rise"` (transform only, 32 px, no opacity: a faded phone looks like a ghost). It bleeds off the band bottom behind the band's `overflow: clip`. Tilt applies (E14). Fallback: IO (7.1).

### 5.4 Lattice drift (E19, see ruling 3)

- **Purpose.** The red band is a printed object; the print sliding slightly against the page gives depth.
- **Spec.** `.band__lattice` is a child layer, `inset: -1rem 0`, carrying `bg-lattice-red.svg`. It animates `translateY(calc(-1 * var(--space-md)))` to `translateY(var(--space-md))` (1 rem either way, 32 px in total) over `animation-range: cover 0% cover 100%`, linear, scroll-driven, longhand block per 2.5. It lags the content as the band crosses the screen. The text on top does not move. No `background-attachment: fixed`, no `background-position` animation.
- Only on the story band. The card back and the pricing edge strip stay still.
- Fallback and reduced: the layer sits at 0. File: `motion.css`.

### 5.5 `#engine`

#### E21 Counters roll once

- **Purpose.** The three numbers (14, 3, 100) arrive as digits turning like an odometer.
- **Spec.** Real number in the HTML. `Counter.ts` (about 0.5 KB) wraps each digit in `.count__w` and builds a strip of 0 to 9, then, when the counter is 25 percent inside the viewport (`rootMargin: 0px 0px -25% 0px`, once), sets `--d` (the digit) and `--i` (digit position) with `setProperty`. CSS moves the strip: `transform: translateY(calc(var(--d) * var(--leading-display) * -1em))`, `--dur-5`, `--ease-out`, delay `calc(var(--i) * var(--stagger))`. Sign, point, comma and units are static text. Wheels have `aria-hidden`; the real number is the accessible text.
- The mask: `.count__w { overflow-y: clip; block-size: calc(1em * var(--leading-display)); padding-block-end: var(--display-mask-pad); margin-block-end: calc(-1 * var(--display-mask-pad)); }`.
- Reduced and no script: final number, no wheels built. Fallback: none needed (IO is the trigger). File: `motion.css`, `Counter.ts`.

### 5.6 `#highlights`

#### E22 Tile rows slide in

- **Purpose.** Each tile tells its small story once: its three rows arrive.
- **Spec.** The tile frame, icon, name and description are static. The three `.tile__row`s are `data-reveal="row"`: `translateX(calc(-1 * var(--space-md)))` and opacity 0 to rest, `--dur-4`, `--ease-out`, row n offset by `n * --stagger` (n = 0 to 2). Scroll-driven where supported, one-shot IO otherwise (7.1). One effect per tile.
- Fallback per 7.1. Reduced: rows at rest. File: `motion.css`, `reveal-fallback.ts`.

#### E23 Edge and row hover (feedback)

Tile and info card edge `--line-strong` to `--line-control` over `--dur-2`; hand-row buttons `--surface-muted` over `--dur-1`; focus-within ring instant. This is the replacement for the deleted spotlight. File: component CSS.

### 5.7 `#numbers`

#### E24 Bankroll line draws with scroll (the section's attention effect)

- **Purpose.** The bankroll builds as you scroll: the product's second half, shown.
- **Trigger.** Scroll-driven, scrubbed. Progress is 0 when the card's top is 80 percent down the viewport and 1 at 40 percent (UX 4.5): `animation-range: cover 20vh cover 60vh` (lengths, so the mapping does not depend on the card's height).
- **Spec.**
  - `.chart-card { view-timeline: --bankroll block; }`. Descendants use `animation-timeline: --bankroll`.
  - **Line.** `.chart__line` is a `<path pathLength="1">`, `stroke-dasharray: 1`, rest `stroke-dashoffset: 0`; keyframe `from { stroke-dashoffset: 1 }`. Linear, 2 px Key Black, no fill.
  - **Dots.** 6 px circles appear (`scale(0)` and opacity 0 to rest, `transform-box: fill-box`) as the line passes them. Each dot has `data-t="0"` to `"20"`, build-time `round(arc length to the dot / total path length x 20)`, and a rule per value sets `--t` (0, 0.05 ... 1). Its range is `cover calc(20vh + var(--t) * 40vh)` to `cover calc(22vh + var(--t) * 40vh)`. 21 short rules. Arc length, not x position, because the line is drawn by arc length.
  - **Last point.** The 10 px Pip Red point and its label (SVG text, `--display-md`) appear at `--t: 1`, label rising 4 px. It does not count (ruling 9).
  - **Tiles.** The four dashboard tiles' values (Net profit, Hourly, Win rate, Winning sessions) are counters (E21 wheels, `--dur-4`) that start when the tile is 25 percent in view, which is as the draw begins, and finish while the line is still being drawn. They are part of this one choreography, not a second attention effect.
- **Do not** put `vector-effect: non-scaling-stroke` on `.chart__line`. In engines that measure dashes in screen pixels it makes `stroke-dasharray: 1` mean one pixel and the draw fails. Set stroke width in user units with the container-query steps in DESIGN 7.1. T22 tests this in Chrome and WebKit.
- **Fallback (no scroll timelines).** `reveal-fallback.ts` sets `.is-in` on the `data-draw` card at 60 percent down the viewport. Under `html.reveal-io`: line `stroke-dashoffset: 1` until `.is-in`, then 0 over `--dur-5` `--ease-out`; each dot appears with `transition-delay: calc(var(--t) * var(--dur-5))`, so it pops as the line reaches it. Same `--t` drives both paths.
- **No script, reduced:** fully drawn, numbers final. File: `motion.css`, `reveal-fallback.ts`, `Numbers.astro` (computes `data-t`).

#### E25 Unit switch and number flip

- **Purpose.** Flipping BB to $ visibly changes the page's numbers.
- **Thumb.** Springs across: `transform`, `--dur-3`, `--ease-spring`. Its position follows `html[data-unit]`, which `head-guard.js` sets before first paint, so a saved choice never animates on load.
- **Numbers.** Every live number is `<span class="num" data-prev=""><span class="num__v">+733 bb</span></span>`. `UnitSwitch.ts` writes the old text to `data-prev`, the new text to `.num__v`, and re-triggers `.is-roll` (remove, read `offsetWidth`, add). All numbers roll together; no stagger across the page.

```css
/* component CSS: static */
.num { display: inline-block; position: relative; }
/* motion.css: inside the gated block */
@media screen and (prefers-reduced-motion: no-preference) {
  .num.is-roll .num__v { display: inline-block; animation: num-in var(--dur-3) var(--ease-out) both; }
  .num.is-roll::before { content: attr(data-prev); position: absolute; inset: 0; animation: num-out var(--dur-3) var(--ease-out) both; }
  @keyframes num-in  { from { transform: translateY(0.5em); opacity: 0; } }
  @keyframes num-out { to   { transform: translateY(-0.5em); opacity: 0; } }
}
```
- Old value exits up, new enters from below, no clipping, so no mask problems. Reduced: the text swaps. Cost: about 80 bytes inside `UnitSwitch.ts`'s 0.5 KB. File: `motion.css`, `UnitSwitch.ts`.

#### E26 Chart readout (pointer and keyboard)

Vertical rule and readout slip follow the pointer or the Left and Right keys: `transform: translateX()` from `--rx` set with `setProperty` in `Numbers.ts`, throttled to one write per frame, only while the pointer moves over the chart. The point under it grows 6 to 10 px by `scale`, `--dur-1`. Reduced: it jumps. File: `Numbers.ts`, `motion.css`.

### 5.8 `#toolbox`

#### E27 Tabs: thumb, panel, device assembly

- **Thumb.** The Key Black thumb moves with `--x` and `--w` set by `Toolbox.ts` (`transform` and `inline-size`, `--dur-3`, `--ease-spring`).
- **Panel.** Fade-through. The leaving panel fades over `--dur-1`; then `hidden` swaps; the entering panel plays `panel-in`: opacity 0 and `translateY(var(--space-sm))` to rest over `--dur-3`, `--ease-out`. `Toolbox.ts` waits `ms('--dur-1')` between them.
- **Assembly (the section's effect).** In the entering panel the device rises 16 px (`transform`, `--dur-4`, `--ease-out`) and its chips follow at `n * --stagger` (3 chips). Plays on first view and on each tab change.
- Reduced: instant swap, chips in place. No script: all three panels stacked. File: `motion.css`, `Toolbox.ts`.

### 5.9 `#data`

#### E28 Cards rise

Three cards under `data-reveal-stagger`, each `data-reveal="up"`; 24 px and opacity, `--dur-4`, `--ease-out`, `--n` 0 to 2 at 768 and up (section 7.1). Fallback per 7.1. Reduced: at rest.

### 5.9a `#showdown`: the flop, turn and river (`SHOWDOWN.md`)

Everything is in `src/sections/home/Showdown.deal.css`, started by one attribute, `data-street`, that the script sets on a press. Durations the script must wait for are unitless `--end-*` custom properties there (flop 1800, turn 3350, river 11600, reset 760 ms; under reduced motion 260, 260, 420, 240). The choreography and the look load with the script, two screens before the table, so none of it is on the page's first load (`SHOWDOWN.md`, Files and loading). Transform and opacity only, longhands only.

#### E39 Arrival and idle
Scroll timelines only (`@supports (animation-timeline: view())`, motion allowed): a flat Key Black layer dims the section above (`sd-dusk`), the canvas comes up (`sd-come-up`), and the navbar steps away while the table fills the screen and comes back as it leaves (`sd-nav-away`, `sd-nav-back`; never while it holds focus). Once the table is 60% in view, one ring and one beat on the dealer button (`sd-ring` 1100 ms, `sd-beat` 620 ms), repeated only when it is the visitor's turn again. Never a loop.

#### E40 Flop and E41 Turn
A burn card slides to the pile, then each card flies from the deck on two axes (X runs out early, Y late, so it arcs), lands and flips in 3D. Nothing else moves: no table jolt and no hops of the cards already down (removed 2026-11-02, the owner wants it light) (`PlayingCard`'s flip, timed per card with `--pc-flip-delay`). The race's numbers roll, the tug-of-war knot slides, and the street's line prints. The turn is one card and slower.

#### E42 River
The slowest moment on the site, 11.6 s from press to finale. The room dims; the A♦ slides out face down and stops; a corner peels up (the peel: a hinged flap showing the card's own face) before it flips. No camera push and no zoom on the card (removed 2026-11-02). On landing, red ink floods the table from that card (two scaled circles, Overprint Red just ahead of Pip Red), the section turns to the red lattice, the five diamonds lift out of their places into the royal flush fan, the losing cards fade out of the poster (gone once settled), and the headline "HandSolved wins." rises. No stamp, and no slam or jolt when it lands. The press cannot be skipped; "Deal it again" stays reachable from the finale.

#### E43 Select, hover and the carousel
The reasons' carousel: the chosen menu number's Pip Red foot line fills over 3 s (`sd-tick`, `--sd-auto`), and when it ends the next dealt reason comes up (Showdown.ts listens for `animationend`). Paused on hover, focus and off screen by `animation-play-state`; motion allowed only.
Pressing a dealt card raises it and rings it, and its reason replaces the last in the same cell (no layout shift). On devices that hover, the top card of the deck lifts a little while the dealer button is hovered.

**Reduced motion.** No flight, no flood, no camera, no peel: each card fades in where it belongs, the finale still shows the fan. The navbar stays.

### 5.10 `#pricing`

#### E29 Billing swap

- **Purpose.** Prices change with the switch, with no script.
- **Spec.** Radio plus `:has()`. Both prices sit in one grid cell. Monthly hides to `translateY(-0.5em)` and opacity 0; Yearly hides to `translateY(0.5em)` and opacity 0. Switching to Yearly sends Monthly up and brings Yearly from below; switching back reverses it. `--dur-3`, `--ease-out`. The billed-yearly line and savings chip cross-fade by opacity. The thumb springs (`--dur-3`, `--ease-spring`).
- The switch never touches prices' dollars-only rule. Reduced: instant. No script needed. File: `motion.css`.

#### E30 Pro rim

- **Purpose.** Hover draws a 1.5 px Pip Red rim around the ink card once (DESIGN 9.7), replacing the library's conic border.
- **Spec.** `.rim rect`: `pathLength="1"`, `stroke-dasharray: 1`, `fill: none`, `stroke: var(--primary)`, `stroke-width: var(--border-mark)`. CSS geometry fills the card: `x: 0.75px; y: 0.75px; width: calc(100% - 1.5px); height: calc(100% - 1.5px); rx: calc(var(--radius-xl) - 0.75px)`. Rest `stroke-dashoffset: 1`, and the rim `opacity: 0`. On card hover: offset to 0 over `--dur-4`, `--ease-out`, opacity to 1; on leave it retracts over `--dur-2`, `--ease-in-out`.
- **Test first.** `pathLength` on a `<rect>` must work in Chrome and WebKit. The rim's `opacity: 0` rest keeps a failure invisible. Same warning as E24 about `non-scaling-stroke`.
- `(hover: hover)` only; focus-within gets the ring on the button, not the rim (DESIGN 9.7). File: `motion.css`.

### 5.11 `#faq`

#### E31 Accordion height

- **Purpose.** Answers open without a jump.
- **Spec.** `.faq__panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-3) var(--ease-out); }` and `[data-state="open"] .faq__panel { grid-template-rows: 1fr; }`. `.faq__inner { overflow: clip; min-height: 0; }`. `Faq.ts` (about 0.7 KB) intercepts the summary click when motion is allowed: **open** sets `details.open = true`, reads a layout, then sets `data-state="open"`; **close** removes `data-state` and sets `details.open = false` after `transitionend` on the panel (timer fallback `ms('--dur-3') + 80`). The `[open]` state and `aria-expanded` update at the start.
- Icon: `icon-plus` turns 90 degrees while fading out and `icon-minus` fades in, `--dur-3`, `--ease-spring`. Hover: rule colour and icon colour `--dur-1`.
- Find-in-page and hash opens use the native toggle and are instant. No script, reduced: native `<details>`, instant. This is layout, on a user click, on a small column; sanctioned in 2.3. File: `motion.css`, `Faq.ts`.

### 5.12 `#start`: reveal footer and card back

#### E32 Sheet lift and card back

- **Purpose.** The page ends like a card turned over: the sheet lifts and the red back is revealed.
- **Mechanics (library `reveal-footer.md`, adapted):**
  1. `SiteLayout` wraps header, main and footer in `.reveal-footer`. `.reveal-footer__sheet` is `<main>` (and the header if it is outside), opaque `--surface-page`, `overflow: clip`, bottom radius `--reveal-footer-radius` (24 px), no shadow and no lit edge. The footer is the wrapper's last child.
  2. The sheet is `position: relative; z-index: 1`. The footer is `position: sticky; bottom: 0; z-index: 0`, ground `--surface-page` with `--cardback-border` padding, holding the red card. Sticky applies only inside the gated block, from 1024 up, and when the footer fits in the viewport. Below that it is normal flow and shows its end state.
  3. `SiteFooter.ts` (about 0.9 KB): an IntersectionObserver (`rootMargin: 50% 0px`) lets scroll and resize run an rAF update only while the wrapper is near. `p = clamp((innerHeight - sheet.getBoundingClientRect().bottom) / footer.offsetHeight, 0, 1)`, written with `wrapper.style.setProperty('--reveal-footer-p', p.toFixed(4))`. A ResizeObserver toggles `.reveal-footer--flow` when `footer.offsetHeight > innerHeight`, which drops sticky and pins p at 1.
  4. Focus: while the footer is covered, `:focus-within` raises it above the sheet (`z-index: 2`) and `focusin` scrolls the wrapper to its end (smooth only when motion is allowed), so a focused link is never hidden (WCAG 2.4.11).
- **What p drives.** Here `p` stands for `var(--reveal-footer-p, 1)`, 0 while covered and 1 once revealed (1 when there is no script, so the end state is the default). Every consumer is `transform`, `opacity` or a stroke offset:

| Part | Formula | At p = 0 | At p = 1 |
|---|---|---|---|
| `.cardback__stage` (the card and its contents) | `transform: translateY(calc((1 - p) * 8svh))` | 8svh low | at rest |
| `.cardback__dim` (flat Key Black) | `opacity: calc((1 - p) * 0.5)` | 0.5 | 0 |
| `.medallion` | `transform: rotate(45deg) scale(calc(0.92 + 0.08 * p))` | scale 0.92 | scale 1 |
| `.mark-cell` (the red cell) | `transform: scale(clamp(0, (p - 0.85) * 6.667, 1))` | absent | printed during the last 15 percent |
| Lattice layer | rides with the stage | no drift of its own | |
| Printed frame (optional) | `stroke-dashoffset: calc(1 - clamp(0, (p - 0.15) / 0.6, 1))` on a `<rect pathLength="1">` at `inset: var(--cardback-keyline-inset)`, `rx: calc(var(--cardback-radius) - var(--cardback-keyline-inset))` | undrawn | drawn |

  The frame is optional; skip it if it costs more than 0.2 KB of script or markup. Without the dim, the stock-coloured sheet and the stock-coloured footer ground would have no visible edge between them, so the dim is what makes the lift readable.
- **Per-frame work, justified.** One `setProperty` per frame, only while the wrapper is within half a viewport, only at 1024 and up. Phones take the flow path and run none. The three consumers are transform or opacity. Budget: under 0.3 ms of script per frame.
- Reduced and no script: flow footer, end state, no sticky, no dim. Fallback: none needed, because this does not use scroll timelines. File: `motion.css`, `SiteFooter.ts`, `SiteFooter.css` for layout.

## 6. Pop-ups

Open and close, sheet drag and the hand-off are E09. Everything below happens inside the dialogs. Under reduced motion every view swaps instantly, bars show their final width, tags jump.

### E33 Pop-up 1: commit and verdict

**Purpose.** The grade is the reward. It lands in the order it is read, within 700 ms of the choice.

| t from commit (ms) | What | Timing | Property |
|---|---|---|---|
| 0 | Picked action takes its pressed look (Key Black, scale 0.98); the others lock | `--dur-1` | colours, transform |
| 0 | Choose-view content fades out | `--dur-1` | opacity |
| 120 | Verdict view mounts. Grade stamp lands: scale 1.15 to 1 at its tilt (`--stamp-tilt`), opacity in over `--dur-1` | `--dur-2`, `--ease-out` | transform, opacity |
| 160 | Verdict heading and sentence rise 8 px | `--dur-3`, `--ease-out` | transform, opacity |
| 160 + 60n | Option row n (n = 0 to 3): bar `scaleX(0)` to its true frequency (`--f`, origin left, square ends); percent and Worth numbers roll | `--dur-3`, `--ease-out` | transform, text |
| 200 | You and GTO cards rise 8 px. On a graded mistake or blunder the pen strike draws on "You" (`--pen-delay: 0`) | `--dur-3` | transform, opacity |
| 360 | GTO's play is written in (wipe, `--wipe-bg: var(--surface-page)`) | `--dur-3` | transform |
| 260 | Stat tiles, bullets and actions fade in | `--dur-2` | opacity |

Latest end: write-in 360 + 320 = 680 ms. Latest bar: 160 + 180 + 320 = 660 ms. Both inside 700. The mark follows the grade (DESIGN 7.6): no mark for Best move, tick, wave or ring drawn with `stroke-dashoffset` over `--dur-3` for Good, Inaccuracy and Mistake. Focus moves to the verdict heading at t = 0 of the swap, not after the animation.

`SampleHandDialog.ts` sets `--f` on each bar with `setProperty` and toggles a `data-view` attribute; the timeline is CSS keyed to it. Reduced: view swaps, bars at `--f`, strike drawn, tag in place. File: `motion.css`, `SampleHandDialog.ts`.

### E34 Deal next hand

Each card on the table turns edge-on and back: `rotateY(0)` to 90 degrees to 0 over `--dur-4` (the content swaps at the midpoint, when it is invisible), `perspective(600px)` on the scene. Your two cards go first together, then the five board cards at `n * --stagger` (n = 1 to 5): six steps, the limit. Last card ends at 5 x 60 + 560 = 860 ms. The dot advances with colour only (`--dur-3`). Transform only. Reduced: cards swap.

### E35 What-if (FLIP)

Tapping another option row moves the "You" tag to it: the script measures the old and new rectangles, applies the inverse `translate`, then animates to none over `--dur-3`, `--ease-spring` (about 0.2 KB in the dialog module's existing budget). The sentence and grade chip cross-fade over `--dur-2`. Bars do not replay. Focus stays on the row. Reduced: the tag jumps.

### E36 Pop-up 2: success

| t from valid submit (ms) | What | Timing | Property |
|---|---|---|---|
| 0 | Submit takes the muted look; the form fades out | `--dur-1`, `--dur-2` | colours, opacity |
| 120 | Success view mounts; the panel height morphs from the form's height to the success view's | `--dur-4` read as `ms('--dur-4')`, Web Animations, `--ease-out` curve | height (sanctioned) |
| 200 | Check ring (56 px, 2 px Key Black) draws | `--dur-4`, `--ease-out` | `stroke-dashoffset` |
| 480 | Tick draws | `--dur-3`, `--ease-out` | `stroke-dashoffset` |
| 280 | Heading and body rise 8 px | `--dur-3` | transform, opacity |

Everything is done by about 800 ms. Errors never animate: the message row is reserved (DESIGN 9.10) and the border and icon change at once. Reduced: height jumps, ring and tick already drawn. File: `motion.css`, `EarlyAccessDialog.ts`.

## 7. Shared mechanics

### 7.1 E37 Section reveals and stagger

- **Purpose.** Below-the-fold blocks arrive instead of appearing. This is the only generic reveal.
- **Variants.** `up`: 24 px (`--space-lg`) and opacity. `rise`: 32 px (`--space-xl`), transform only, for devices. `row`: minus 16 px (`--space-md`) on the x axis and opacity, for tile rows.
- **Targets (and nothing else).** Section head blocks (H2 plus lead), `#engine` figure sheet, tile rows, `#data` cards, pricing cards, story band phone, `#faq` head, product-page heads and devices. At most three targets per viewport height. Never anything in the first viewport of any page, never the LCP candidate, never whole sections, never FAQ items or body text.
- **Scroll-driven where supported:** the block in 2.5, `animation-range: entry 8% entry 65%`, linear. The variants differ only in `animation-name`: `reveal-up` (shown in 2.5), `reveal-rise` (`from { transform: translateY(var(--space-xl)); }`) and `reveal-row` (`from { opacity: 0; transform: translateX(calc(-1 * var(--space-md))); }`), chosen by `[data-reveal="rise"]` and `[data-reveal="row"]`. Stagger shifts the range: `entry calc(8% + var(--n) * 7%) entry calc(65% + var(--n) * 7%)`, which at n = 5 ends exactly at `entry 100%`.
- **Stagger.** `--n` comes from `:nth-child` rules inside `[data-reveal-stagger]`, capped at 5, and only inside `@media (min-width: 768px)`; under 768 `--n` is 0.
- **Fallback (Firefox, Safari below 26).** `reveal-loader.ts` (0.1 KB) tests `CSS.supports('animation-timeline', 'view()')` and, if false and motion is allowed, imports `reveal-fallback.ts` (0.4 KB). The fallback adds `html.reveal-io` only after it has marked everything already in the viewport `.is-in`, so nothing flashes. Then one IntersectionObserver (`rootMargin: 0px 0px -10% 0px`) adds `.is-in` once per `[data-reveal]` and `[data-draw]`. The start pose and the transition exist only under `html.reveal-io`, so no script or a failed script leaves everything visible.

```css
@media screen and (prefers-reduced-motion: no-preference) {
  html.reveal-io [data-reveal="up"]:not(.is-in)   { opacity: 0; transform: translateY(var(--space-lg)); }
  html.reveal-io [data-reveal="rise"]:not(.is-in) { transform: translateY(var(--space-xl)); }
  html.reveal-io [data-reveal="row"]:not(.is-in)  { opacity: 0; transform: translateX(calc(-1 * var(--space-md))); }
  html.reveal-io [data-reveal].is-in {
    transition: opacity var(--dur-4) var(--ease-out), transform var(--dur-4) var(--ease-out);
    transition-delay: calc(var(--n, 0) * var(--stagger));
  }
}
```
- Reduced: at rest. Print: at rest. File: `motion.css`, `reveal-loader.ts`, `reveal-fallback.ts`.

### 7.2 E38 Feedback

Component CSS, inside `@media (hover: hover)` for hover, nothing that moves layout.

| Control | Hover | Active | Focus-visible |
|---|---|---|---|
| Primary, secondary buttons | Colours flip, `--dur-1` | `scale(0.98)`, `--dur-1` | Ring, instant |
| Text links | Underline 2 px, arrow moves 2 px, `--dur-2` `--ease-spring` | Underline 2 px | Ring |
| Nav links | Slip (E04) | | Ring, slip follows |
| Rows and tiles | Edge or fill, `--dur-1` to `--dur-2` | none | Ring or inset ring |
| FAQ question | Rule `--line-control`, icon `--text-red`, `--dur-1` | none | Ring on summary |

Nothing lifts, glows or casts a shadow.

## 8. Other pages

| Page | Uses |
|---|---|
| `/gto-hand-review` | Navbar, view transition, footer (E32). Compact hero: pair rises (E37 `rise`), Quiet chart still, no scan. Timeline and worked example: head reveals only. Options table static. Legend chips static. FAQ (E31) |
| `/live-poker-hand-recorder` | Same hero. Pinned three-step story (E16, E17). The pen strike is not on this page unless a step shows a graded hand; none does, so no E18. FAQ |
| `/privacy`, `/terms` | Page fade only. No reveals. Footer without the closing band: the reveal still runs |
| 404 | The three cards (4 of spades, face-down, 4 of hearts) deal in on load: `translateY(var(--space-lg))` to rest, `--dur-4`, `--ease-out`, `n * --stagger`. Transform only, once. Reduced: at rest |

## 9. Scripts: reconciliation with `ARCHITECTURE.md` section 4

No new file. One row goes. Hero, veil, view transitions, lattice, pen, scan, wake, tilt, bankroll (where supported), rim, price swap and the lag use no script.

| File | Motion job | `ARCHITECTURE.md` KB | Change |
|---|---|---|---|
| `Navbar.ts` | Sentinel and CTA observers, slip `--x` and `--w`, section observer, menu `--mx` and `--my` | 1.5 | none |
| `SiteFooter.ts` | `--reveal-footer-p`, flow toggle, focus lift | 0.9 | none |
| `Dialog.ts` | `--ox` and `--oy`, state, drag and `--drag-p`, exit timers from tokens | 2.3 | none |
| `MobileCtaBar.ts` | `data-visible` rules | 0.4 | none |
| `UnitSwitch.ts` | Reformat, `data-prev`, `.is-roll` | 0.5 | none |
| `Counter.ts` | Build wheels, `--d` and `--i` on enter | 0.5 | none |
| `Story.ts` | `.is-active`, `aria-current` | 0.5 | none |
| `Bento.ts` | Nothing (spotlight dropped, ruling 4) | 0.6 | **Remove the row** |
| `Faq.ts` | Open and close sequencing | 0.7 | none |
| `Toolbox.ts` | Tabs, thumb, fade-through sequencing | 1.0 | none |
| `Numbers.ts` | Readout | 1.0 | none |
| `reveal-loader.ts` | Detect and import | 0.1 | none |
| On demand | `SampleHandDialog.ts` (verdict state, `--f`, deal, FLIP), `EarlyAccessDialog.ts` (success), `reveal-fallback.ts` | 7 + 1.8, 1.5, 0.4 | none |

On load: 10.0 KB listed, **9.4 KB after removing `Bento.ts`**, against the 11 KB limit. On demand 10.7 of 14. Home total 20.1 of 25.

## 10. Budgets and gates

| Gate | Limit | How this plan meets it |
|---|---|---|
| LCP | 2.0 s lab; motion adds 0 | Hero is painted and opaque on frame one; H1 mask shows about 70 percent; reveals never in the first viewport. Check: LCP with motion and with `reduce` within 50 ms |
| CLS | 0.05 | Only `transform` and `opacity` move. Veil is fixed. Sanctioned layout effects run on user input, inside contained boxes or collapsed rows |
| INP | 150 ms | No work on input except a class or custom property write. Dialogs open from CSS |
| 60 fps on a mid-range phone | p95 frame 18 ms or better at 4x CPU throttle | Scroll-linked effects are compositor transforms and opacity. At most 10 elements animate by scroll in one viewport. The only per-frame scripts are the footer (not on phones) and the readout (while the pointer moves) |
| Autoplay over 5 s | Pause control required | Nothing autoplays beyond 3.3 s. The hero choreography is the longest. If a loop is added, the checkbox control in E11 applies |
| Flashing | At most 3 per second | The scan is hairline rings, each changing once in 900 ms. The veil is one swipe |
| `motion.css` | 6 KB gz at most | Home CSS stays inside 30 KB gz (tokens plus patterns measure 17.9) |
| Motion HTML | Veil about 1 KB, hero grid about 1.6 KB, tilt zones about 0.2 KB | Compressed it is a fraction of that |
| Script | 11 KB on load | 9.4 KB (section 9) |

## 11. Checks (for T24, T27, T31, T32)

**Static, on the built output (add to `check-dist.mjs` or run by hand):**

1. No `animation:` shorthand holding `view(` or `scroll(` (exists).
2. `motion.css` holds no `blur(`, `gradient`, `box-shadow`, `filter`, `backdrop-filter`, `will-change`, `transition: all` or `!important`.
3. No number followed by `ms` and no `cubic-bezier(` in `motion.css`, except `1ms` on the veil.
4. Every `@keyframes` body changes only `transform`, `opacity`, `stroke-dashoffset` or `visibility`.
5. Every rule in `motion.css` sits inside the one `@media screen and (prefers-reduced-motion: no-preference)` block, except the `.veil { display: none; }` default. Static structure (the hero grid, `.num`, layouts) lives in component CSS, not here.
6. `.veil` appears in `dist/index.html` only; no `style=` anywhere (exists).

**Runtime (Playwright in T31, Lighthouse in T32):**

7. Reduced motion emulated: no running animations after load, no veil, story stacked, footer in flow, no sticky.
8. First visit: `.veil` is `visibility: hidden` by 900 ms. Reload in the same tab: `display: none` from the first frame.
9. Lighthouse mobile twice, normal and `reduce`: same LCP element, LCP within 50 ms, CLS 0.
10. Hero: after 3.5 s no hero animation is running; rings are at opacity 0.
11. Tab into the footer while it is covered: the footer comes forward, the link is visible.
12. A 4x CPU throttle trace scrolling home top to bottom: no Layout events during scroll other than navbar compaction; p95 frame 18 ms.
13. Firefox and Safari 25 (no scroll timelines): scroll to the bottom; no `[data-reveal]` is still hidden; the bankroll draws once; the story works.
14. Chrome and Safari 26 production build (not `dev`): scroll timelines move. This is where the Lightning CSS trap shows.
15. Forced colors: the pen strike is visible.
16. Keyboard: dialogs focus the title or field; menu and sheets return focus; Escape closes with the exit animation.
17. 320 px: no horizontal scroll while the veil, doors and hero lines move.

## 12. Build order for T22

1. Audit the built sections against the hooks in 3.2; list missing hooks for the section owners before writing CSS.
2. Skeleton: the one gated block, section comments matching this file, `--z-veil` present.
3. Veil, view transition, smooth scroll (E01, E02, E08). Test LCP at once.
4. Hero (E10 to E15).
5. Reveal system and fallback (E37), with `reveal-loader.ts` and `reveal-fallback.ts`.
6. Story and band (E16 to E20), counters (E21).
7. Numbers (E24 to E26): test `pathLength` and dash behaviour first.
8. Footer (E32).
9. Dialogs (E09, E33 to E36).
10. Navbar, menu, bar (E03 to E07), tabs, pricing, FAQ (E27 to E31).
11. Reduced-motion pass, then the trace pass, then Firefox and Safari.
12. Remove any effect that fails a gate in section 10; do not loosen the gate.
