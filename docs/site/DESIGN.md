# HandSolved site: design system

Owner: `web-designer` (T11). Written 2026-11-01. This file owns how the site looks. Page structure stays in `UX.md`, words in `COPY.md`, build rules in `ARCHITECTURE.md`. Every value below has a name in `src/styles/tokens.css`, the only token source. Components use semantic tokens; raw scales stay inside that file.

Direction A, "Two Inks", was chosen in `research/visual-inspiration.md` and is not reopened here.

**Checked, not assumed**

| Claim | How |
|---|---|
| Contrast ratios | WCAG 2.x formula on the hex values. Within 0.01 of the research's WebAIM figures |
| Headline widths | Measured in Chrome with the real subset fonts, kerning on, no tracking |
| Chart counts and fade masks | Computed from `research/range-chart.json`: 68 fold, 69 call, 25 raise, 7 mixed. Weighted by combos: fold 48.5, call 38.8, raise 12.7, matching the brief |
| Token file | Loaded in Chrome at 320 to 1920 wide. All 67 library names present, every `var()` resolves except `--face-*`, which Astro supplies |
| Direction | Rendered at 1440: hero plate, ink sheet, quiet chart, red band, card back. Rendered at 320 and 390: narrow plate, no sideways scroll |
| Not rendered | Navbar, dialogs, stamps, switches and the other components in section 9. Their specs are untested until the build |

This role's definition lists no shell or browser. Both were used read-only to measure, and scratch files stayed in the session scratchpad.

## 1. Direction

**Feel:** exact, dry-humoured, tactile, unintimidating.

**What makes it unlike a template:** the site is printed like a deck of cards, with one stock, two inks and a real solved chart where a template would put a gradient.

**Guards.** These override everything below.

| # | Rule | In practice |
|---|---|---|
| 1 | Display type for headlines and big numbers only | Plus the two sources of the face: card ranks and the corner index. Never for buttons, labels, nav or body |
| 2 | One large red thing per view | Large means a red area over about 120 px in both directions, or a red word at `--display-lg` or bigger. Section 6 names it for each section |
| 3 | Generous stock | A section holds one main object. Full-bleed red and ink bands never touch each other; a stock section always sits between them |
| 4 | No gradients, blur, glow or gloss | Fades are stepped dot sizes. Depth is a step in surface plus a hairline |
| 5 | No hard offset shadows, no thick outlines | No drop shadow anywhere. The thickest border is 2 px, on an errored field only |
| 6 | No emoji. Suits always SVG | Suit characters in `COPY.md` become SVG with hidden words, such as "of spades" |
| 7 | Teal, coral and amber stay inside the screens | No green at all. No site element picks a colour from a capture |
| 8 | No device on black | Not on an ink section, the Pro card, the Insights tile, the menu or the veil |
| 9 | The chart is true | It is printed from the JSON, labelled, and never edited or sampled |
| 10 | No faces, hands, chips or felt | Red never appears on a black hero or next to a face |

## 2. Rulings where other documents differ

Later documents assumed things this direction changes. Each ruling below is what the builder follows. Items marked **confirm** touch someone else's file.

| # | Elsewhere | Ruling | Status |
|---|---|---|---|
| 1 | `ARCHITECTURE.md` §5: at most two OFL families, and each is a `latin-wght` variable file | Direction A carries three families. Bytes pass: 42.3 KB against the 70 KB limit, using four static subset files (4.1). The variable route fails: Schibsted's variable file alone is 46.8 KB, which makes 75.3 KB with the other two | **Confirm:** `architect` updates §5 and adds `--face-mono` |
| 2 | `UX.md` 4.1, `COPY.md` alt table, `ARCHITECTURE.md` §5 hero desktop frame: desktop and phone pair in the home hero | The home hero is one phone on the chart at every width (research §10). At 1024 a legible chart, a laptop and a phone do not fit beside a 140 px headline. The laptop and phone pair stays on `/gto-hand-review`. The phone capture is unchanged, and the hero's hand-written desktop `<picture>` is no longer needed | **Confirm:** main session. Restoring the pair means taking the chart out of the hero |
| 3 | `UX.md` 4.1: copy about 5 of 12 columns | H1 takes 7 columns at 1024 and up. "Every hand" is 3.402 em, so 5 columns would cap it at 135 px. The plate bleeds off the right edge to compensate. The narrowest gap between them is 53 px, at 1440 | Applied |
| 4 | `UX.md` 4.8: three plans | Two cards, Free and Pro, as `COPY.md` and `PROJECT.md` say | Applied |
| 5 | `UX.md` 9.2.4: felt rails, teal glow, pip scatter, soft lights | Replaced by the chart levels and lattice in section 6. Each is still lightweight and `aria-hidden` | Applied |
| 6 | `UX.md` 4.10, `COPY.md`: oversized wordmark with a gradient fill | Replaced by the card-back medallion, the mark alone (7.3). The wordmark was `aria-hidden`, so no content is lost. "HandSolved" stays in the legal row | Applied |
| 7 | `UX.md`: glass pill, blurred backdrop, hover lift | Opaque Face White, flat scrim, ink flip | Applied |
| 8 | `UX.md`: teal for best or positive, coral for negative and errors | Key Black plus a tag for best and positive. Pip Red plus sign, icon and text for negative and errors | Applied |
| 9 | `UX.md` 6.2 "no loading state"; `ARCHITECTURE.md` §4 dialog opens before its module lands | Pop-up 1 has a visual loading state (9.8). Pop-up 2 stays without one | Applied |
| 10 | `UX.md` veil 900 ms; `ARCHITECTURE.md` under 700 ms | Timing belongs to `MOTION.md`. This file gives only the veil's look | **Confirm:** `animation-expert` |
| 11 | `PROJECT.md` R6: retheming screens allowed | No retheming. Screens stay as captured, dark ink and teal | Applied |
| 12 | Role quality bar: at most 2 families | Same conflict as item 1. Kept at three, because the mono carries the chart | Noted |

## 3. Color

### 3.1 Palette

| Name | Hex | Token | Job |
|---|---|---|---|
| Card Stock | `#F3F4F1` | `--surface-page` (`--surface-light`) | Page ground |
| Face White | `#FCFCFA` | `--surface-raised`, `--text-inverse` | Raised cards, text on red and black |
| Key Black | `#12181B` | `--text-main`, `--surface-ink`, `--device-ink`, `--chart-call` | Text, call cells, device bodies. Same value as the app's ink |
| Soft Black | `#565D61` | `--text-muted` | Secondary text |
| Pip Red | `#CE1A2C` | `--primary`, `--surface-red`, `--chart-raise`, `--pen-ink` | Main button, raise cells, bands, the coach's pen |
| Overprint Red | `#A81222` | `--primary-hover` | Button hover, lattice lines. Never on ink |
| Red Tint | `#E1878F` | `--accent` | Rare highlight behind Key Black. Available for a second raise size if a later chart has one. This chart has one raise size, so no cell uses it |
| Teal | `#7FC8C2` | none, on purpose | Only ever inside a screen |

### 3.2 Neutrals

Key Black screened over Card Stock, stored as flat hex. Two entries are Face White over ink, for use on ink.

| Step | Hex | Semantic token | Use |
|---|---|---|---|
| 50 | `#FCFCFA` | `--surface-raised` | Face White |
| 100 | `#F3F4F1` | `--surface-page` | Card Stock |
| 200 | `#EAEBE8` | `--surface-muted`, `--chart-line-1` | Tracks, hover fills, fade step 1 hairline |
| 250 | `#E1E2E0` | `--chart-line-2`, `--chart-quiet-call`, `--chart-ghost-line` | Fade step 2, quiet call cells, ghost grid |
| 300 | `#D8DAD7` | `--line`, `--border-subtle`, `--chart-line` | Hairlines |
| 400 | `#BDBFBE` | `--line-strong` | Card outlines |
| 420 | `#B6B8B7` | `--text-inverse-muted` | Secondary text on ink |
| 450 | `#878A8A` | `--line-control` inside `.on-ink` | Control edges on ink |
| 500 | `#7E8282` | `--line-control` | Field and switch edges |
| 600 | `#6C7071` | `--text-faint` | Fold-cell labels only |
| 700 | `#565D61` | `--text-muted` | Soft Black |
| 750 | `#373C3F` | `--border-inverse` | Hairlines on ink |
| 800 | `#2E3336` | `--glass-inverse`, `--surface-muted` inside `.on-ink` | Tracks and fills on ink |
| 900 | `#12181B` | `--text-main` | Key Black |
| 950 | `#0B0F11` | none | Completes the scale. Not used |

Reds: 100 `#EFDAD9` (`--chart-quiet-raise`), 300 Red Tint, 600 Pip Red, 800 Overprint Red.

### 3.3 Semantic colors

There is no green and no third hue, so status is carried by ink, icon and words together.

| Status | Token | Value | Always with |
|---|---|---|---|
| Error | `--danger` | Pip Red | Alert icon, message text, 2 px field border |
| Success | `--success` | Key Black | Check icon and words |
| Warning | `--warning` | Soft Black | Alert icon and words. No component uses it in v1 |
| Info | `--info` | Soft Black | Info icon and words |
| Loss, negative worth | `--text-red` | Pip Red | Real minus sign (U+2212) |

### 3.4 Ground scopes

Put a class on the section or card and every token inside follows, so library modules work inside them unchanged. A scope sets tokens, not the background: the section still sets `background` itself.

| Scope | Ground | Text | Primary button | Allowed inside |
|---|---|---|---|---|
| none | Card Stock | Key Black, Soft Black | Pip Red, Face White label | Everything |
| `.on-paper` | Face White sheet nested in ink or red | Same as above | Same as above | Charts, cards, switches. Resets the scope around it |
| `.on-ink` | Key Black | Face White, `#B6B8B7` | Pip Red; hover flips to Face White | No device, no lattice, no red text |
| `.on-red` | Pip Red, with or without lattice | Face White only | Face White, Key Black label; hover flips to Key Black | A phone is fine, edge 3.25:1. No red text |

### 3.5 Contrast

**Text, 4.5:1 required for every pair. No pair is under AA.** Disabled controls keep real contrast too; nothing is dimmed with opacity.

| Text | On | Ratio | Where |
|---|---|---|---|
| Key Black | Card Stock | 16.23 | Body, headlines |
| Key Black | Face White | 17.44 | Cards, dialogs, nav, inverse button |
| Key Black | `--surface-muted` | 14.97 | Hover rows, switch tracks |
| Key Black | Red Tint | 6.88 | Any `--accent` chip |
| Soft Black | Card Stock | 6.07 | Secondary text |
| Soft Black | Face White | 6.52 | Secondary text in cards, locked actions, grade Inaccuracy |
| Soft Black | `--surface-muted` | 5.60 | Disabled button label |
| Fold grey `#6C7071` | Card Stock | 4.54 | Fold labels on the hero plate |
| Fold grey `#6C7071` | Face White | 4.87 | Fold labels on the Engine figure |
| Pip Red | Card Stock | 4.99 | The word "solved.", pen marks, GTO card |
| Pip Red | Face White | 5.37 | Field errors, grade Mistake, negative worth |
| Pip Red | `--surface-muted` | 4.61 | Negative worth on a hovered row |
| Face White | Pip Red | 5.37 | Main button, raise cells, red band. The floor for any text on the lattice |
| Face White | Overprint Red | 7.37 | Button hover, and text where it crosses a lattice line |
| Face White | Key Black | 17.44 | Ink sections, call cells, Pro card, grade Best move |
| Face White | `#2E3336` | 12.44 | Off label on a switch on ink |
| `#B6B8B7` | Key Black | 8.98 | Secondary text on ink |
| `#B6B8B7` | `#2E3336` | 6.41 | Secondary text on a fill on ink |

**Graphics and controls, 3:1 required.**

| Object | Against | Ratio |
|---|---|---|
| Key Black device | Card Stock | 16.23 |
| Key Black device | Pip Red band | 3.25 |
| Pip Red button | Key Black card | 3.25 |
| Pip Red cell, Key Black cell | Card Stock | 4.99, 16.23 |
| Pip Red cell | Key Black cell | 3.25 |
| `--line-control` | Card Stock, Face White | 3.52, 3.78 |
| `#878A8A` control edge | Key Black | 5.15 |
| Focus ring, outer Key Black | Card Stock, Face White | 16.23, 17.44 |
| Focus ring, inner Face White | Pip Red, Key Black | 5.37, 17.44 |

**Decorative, carrying no information, so exempt:** `--line` 1.27, `--line-strong` 1.67, hairline on ink 1.60, Overprint lines on Pip Red 1.37, quiet raise 1.21, quiet call and ghost 1.18.

**Banned pairs:** Pip Red text on Key Black and Key Black text on Pip Red (3.25), Overprint Red on ink (2.37), fold grey on `--surface-muted` (4.18), Red Tint as text on stock (2.36).

## 4. Typography

### 4.1 Font files

Three families, four weights, all SIL OFL 1.1. All are published on Google Fonts. The site never requests them from Google; they are self-hosted in `src/assets/fonts/`, each with its `LICENSE`.

| File | Family | Weight | Source file | `cssVariable` | Preload | Subset size |
|---|---|---|---|---|---|---|
| `sofia-sans-extra-condensed-800.woff2` | Sofia Sans Extra Condensed | 800 | `@fontsource/sofia-sans-extra-condensed` 5.3.0, `files/...-latin-800-normal.woff2` | `--face-display` | Yes, it sets the LCP text | 9.1 KB |
| `schibsted-grotesk-400.woff2` | Schibsted Grotesk | 400 | `@fontsource/schibsted-grotesk` 5.3.0, `files/...-latin-400-normal.woff2` | `--face-body` | No | 13.0 KB |
| `schibsted-grotesk-600.woff2` | Schibsted Grotesk | 600 | same package, `...-latin-600-normal.woff2` | `--face-body` | No | 13.4 KB |
| `spline-sans-mono-500.woff2` | Spline Sans Mono | 500 | `@fontsource/spline-sans-mono` 5.3.0, `...-latin-500-normal.woff2` | `--face-mono` | No | 6.8 KB |
| **Total** | | | | | | **42.3 KB** (limit 70) |

The packages' stock Latin files total 78.1 KB, over the limit, so the subset is required. Run it once, by hand (`pyftsubset` comes with `fonttools` and `brotli`), and keep the output in the repo. Nothing subsets at build. The sizes above come from this exact command.

```text
pyftsubset <source>.woff2 \
  --unicodes="U+0020-007E,U+00A0,U+00A9,U+00B7,U+00D7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2212" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk,tnum,pnum" \
  --flavor=woff2 --no-hinting --desubroutinize --name-IDs="1,2,4,6,13,14" \
  --output-file=<name>.woff2
```

- `COPY.md` uses only ©, × and − beyond ASCII, plus suits. All three are in the range and in all three fonts.
- Left out on purpose: suits (U+2660 to 2667), which are always SVG, and arrows. No family has a right arrow, and the mono has no arrows at all, so **arrows are always SVG**, never a character.
- Wiring follows `ARCHITECTURE.md` §5: `fontProviders.local()`, `optimizedFallbacks: true`, `font-display: swap`. `tokens.css` reads `--face-*` and must never define them.
- If the fallback shows, Arial Bold is 5.391 em against 3.402 em for "Every hand", so expect a `size-adjust` near 63%. Set `Arial` as the fallback. Do not use `Impact`.

### 4.2 Scale

| Token | Face, weight | 320 | 768 | 1440 and up | Line height | Used for |
|---|---|---|---|---|---|---|
| `--display-xl` | Sofia 800 | 78 | 117.2 | 176, capped at `19svh` | `--leading-display` 0.9 | Home H1 only |
| `--display-lg` | Sofia 800 | 52 | 72.8 | 104 | 0.9 | H2, compact-hero H1, band line, closing H2, plan price, Engine counters |
| `--display-md` | Sofia 800 | 40 | 52.8 | 72 | 0.9 | Legal H1, 404 H1, dashboard's last value |
| `--display-sm` | Sofia 800 | 28 | 32.8 | 40 | 0.9 | Dialog titles, dashboard tile values, verdict score |
| `--text-xl` | Schibsted 600 | 22 | 24.4 | 28 | `--leading-tight` 1.2 | H3, plan names, menu links, verdict heading |
| `--text-lg` | Schibsted 400 | 18 | 19.6 | 22 | `--leading-body` 1.55 | Subhead, leads, closing line |
| `--text-base` | Schibsted 400, 600 | 16 | 16.8 | 18 | 1.55 | Body, buttons (600), kicker (600) |
| `--text-sm` | Schibsted 400, 600 | 14 | 14.4 | 15 | 1.55 | Nav links (600), help text, concept note |
| `--text-mono` | Spline 500 | 13 | 13 | 13 | `--leading-mono` 1.4 | Small facts, proof strip, captions, switch labels, stamps |
| `--text-xs` | Spline 500 | 12 | 12 | 12 | 1.4 | Tags, axis labels, chart labels. Nothing is smaller |

Line length: `--measure` 68ch for prose, `--measure-lead` 34rem for leads. Tracking: `--tracking-display` -0.005em, `--tracking-tight` -0.01em on Schibsted at `--text-xl`, none on mono. Display is sentence case. Uppercase is not used anywhere.

**Numbers that roll** (counters, prices, dashboard values) set `font-variant-numeric: tabular-nums`. Sofia and Schibsted both have `tnum`, kept in the subset. Spline is monospaced by nature.

### 4.3 The 320 px arithmetic

"Every hand / you play, / solved." per `COPY.md`, as three block lines, measured at 3.402 em, 2.729 em and 2.245 em. The whole sentence is 8.628 em, so three lines is the only option on a phone.

| Viewport | Content width | `--display-xl` | "Every hand" | Spare |
|---|---|---|---|---|
| 320 | 288 | 78 | 265.4 | 22.6 (7.8%). The ceiling at this width is 84.6 px |
| 360 | 328 | 81.5 | 277.3 | 50.7 |
| 375 | 343 | 82.8 | 281.7 | 61.3 |
| 768, 5 of 8 columns | 441 | 117.2 | 398.7 | 42. The headline ends at 423, the plate starts at 461 |
| 1024, 7 of 12 columns | 550 | 139.6 | 474.9 | 75 |
| 1200 | 652 | 155 | 527.3 | 125 |
| 1440 | 652 | 176 | 598.8 | 53 |
| 1920 | 652 | 176 | 598.8 | 53 |

- Rendered at 320 and 390: `scrollWidth` equals the viewport.
- **Never use `white-space: nowrap` on display type.** At 125% root font size the H1 grows to 97.5 px, "Every hand" stops fitting, and it must be free to wrap. "Every" alone is 1.772 em, which still fits.
- Height cap: `19svh` holds the H1 to 171 px at 1440 x 900 and 123.5 px at 1366 x 650, so the main button stays above the fold.
- Other display text at 320: "Three of a kind." is 4.72 em, 245 px at 52. The widest single words in the real headlines are about 3.2 em, 166 px at 52. Nothing else comes near the limit.
- UI checks: "Grade a sample hand" is 10.084 em, 161 px at 16 px. The wordmark is 3.65 em, 102 px at 28 px.

### 4.4 Rules for condensed type

- **Leading is 0.9, and that is not arbitrary.** The tallest ascender (`j`, 0.702 em) plus the deepest descender (`g`, 0.191 em) is 0.893 em. At 0.9 no two letters can collide on adjacent lines.
- **Line masks need padding.** Descenders pass the 0.9 line box by 0.041 em. Any `overflow` mask on a headline line (`kinetic-headline.md`) needs `padding-block-end: var(--display-mask-pad)` and a matching negative margin, or the "y" and "p" get clipped.
- Red in a headline is one word at most, and only the last. Hero: "solved." No other headline uses red.

## 5. Space, layout and shape

### 5.1 Spacing

| Token | px | | Token | px |
|---|---|---|---|---|
| `--space-xs` | 4 | | `--space-xl` | 32 |
| `--space-sm` | 8 | | `--space-2xl` | 48 |
| `--space-md` | 16 | | `--space-3xl` | 64 |
| `--space-lg` | 24 | | `--space-4xl`, `--space-5xl` | 96, 128 |

Section padding: `--section-y` 64 to 128, `--section-y-compact` 48 to 72 (bands, legal, 404).

### 5.2 Grid

| Width | Columns (`--grid-cols`) | Gap (`--grid-gap`) | Gutter (`--gutter`) | Content width |
|---|---|---|---|---|
| 320 to 767 | 4 | 16 | 16 | 100% minus 32 |
| 768 to 1023 | 8 | 24 | 24 | 100% minus 48 |
| 1024 to 1200 | 12 | 24 | 32 | 100% minus 64 |
| Over 1200 | 12 | 24 | 32 | 1136. `--container-max` stays 1200, and full-bleed art may pass it |

Other widths: dialogs `--dialog-w-sample` 880 and `--dialog-w-early` 440, chart `--chart-w-figure` 468, scrolled nav `--nav-w-scrolled` 960.

Asymmetric by default. Centered layouts are limited to the veil, the medallion and the 404 cards. Where `UX.md` centers the pricing switch, it stays centered.

### 5.3 Radius

| Token | px | Used for |
|---|---|---|
| `--radius-sm` | 4 | Tags, chips, stamps, switch thumbs, slips |
| `--radius-md` | 8 | Buttons, fields, switch tracks, nav hover slip |
| `--radius-lg` | 12 | Chart sheet, You and GTO cards, summary box |
| `--radius-xl` | 16 | Tiles, plan cards, scrolled nav |
| `--radius-2xl` | 24 | Dialogs, sheet top, card back |
| `--radius-full` | Circle | Circles only: seats, dealer button, dots, check ring. Never a pill-shaped control |

### 5.4 Borders

| Token | Width | Used for |
|---|---|---|
| `--border-hair` | 1 px | Everything by default: cards in `--line-strong`, rules in `--line`, controls in `--line-control` |
| `--border-mark` | 1.5 px | Grade stamps, table rail, pen marks |
| `--border-error` | 2 px | Errored field only. This is the thickest border in the system |

### 5.5 Elevation: what replaces shadows

**No blurred or offset shadow appears anywhere.** `box-shadow` is allowed for exactly two things: the focus ring, and the library's `--shadow-*` tokens, which resolve to 1 px hairline rings here, so a module that asks for a shadow gets a line.

| Need | Instead of a shadow |
|---|---|
| A raised card | Surface step from Stock to Face White, plus `--line-strong` |
| Floating nav over content | Opaque Face White plus `--line-strong`. It stays Face White over red and ink too |
| A dialog | `--scrim`, flat Key Black at 72%, with an opaque surface on top |
| Hover | Ink changes. Nothing lifts or translates up |
| A phone overlapping a laptop | `--device-keyline`, a 4 px outline in the ground colour |
| Stacking order | `--z-sticky` nav, `--z-overlay` mobile bar, dialogs in the top layer via `showModal()` |

## 6. Page map

The whole site's loudness on one table. A section with no named big red thing keeps red to small marks.

| Section | Ground | Grid or lattice | Device | Large red thing | Index |
|---|---|---|---|---|---|
| Veil | Ink | None | None | None, one red cell in the mark | None |
| Hero | Stock | Hero plate, level Screened | Phone on the chart | The word "solved." | None |
| `#how` | Stock | `bg-chart-ghost.svg`, level Ghost, behind the pinned phone | Pinned phone | None. Active step gets a 2 px red bar | A spade |
| Story band | **Red + lattice** | Full lattice | `phone-coach-decision`, the one strong moment | The band | K heart, top left only |
| `#engine` | Stock | Figure, level Full, on a Face White sheet | None | The chart's raise cells | Q club |
| `#highlights` | Stock | None | None | None. Insights tile is ink | J diamond |
| `#numbers` | **Ink** (`.on-ink`), dashboard on a `.on-paper` sheet | None | None, enforced | The CTA button | 10 spade |
| `#toolbox` | Stock | None | Phone, laptop on Insights at 1024 and up | None | 9 heart |
| `#data` | Stock | None | None | None | 8 club |
| `#pricing` | Stock, `bg-lattice-edge.svg` along the top | Edge strip | None | Pro's button on the ink card | 7 diamond |
| `#faq` | Stock | None | None | None | 6 spade |
| `#start`, footer | Stock border, red lattice card | Card back | None | The card back | None |
| Product-page hero | Stock | Level Quiet, right side, behind the pair | Laptop and phone pair | The CTA | None |
| Product-page sections | Stock | None, or Full in the range-grids tile | As `UX.md` | At most one | Restart from A spade |
| Legal | Stock | None | None | None | None |
| 404 | Stock | One face-down card, lattice tile 8 | None | None | None |

**The one inverted section.** `UX.md` does not ask for one. `#numbers` gets it because the page runs long on stock, it holds no device, and it sits between stock sections, so it never touches a red band. Inside it: H2, lead and hint in Face White, the dashboard on a Face White `.on-paper` sheet, then the CTA line and a Pip Red button on ink. `#engine` does not go ink, because it follows the red band and the band's cropped phone would run into black.

## 7. Signature elements

### 7.1 The chart

**Data.** `docs/site/research/range-chart.json`. Row is `floor(i / 13)`, column is `i mod 13`, and `f` is `[fold, call, raise]`. Cell 0 is AA, top left. Never edit, sample or reorder. Spot label and caption come from `COPY.md` 4.3.

**Files.** `svg-expert` generates static SVG once, by script, from the JSON. The output is plain markup with classes, no `style=`, no `<style>`, because inline SVG falls under the CSP. Charts with labels are inline so they can use the page's mono font. `url()` files cannot, so Quiet and Ghost carry no text and hold literal hex. The `svgo` config must keep `class`, `viewBox` and `vector-effect`.

| File | Level | Delivery | Accessibility |
|---|---|---|---|
| `bg-chart-hero-wide.svg`, `bg-chart-hero-narrow.svg` | Screened, with device fade | Inline, one hidden per breakpoint | `aria-hidden`, per `COPY.md` |
| `chart-bb-vs-btn-100.svg` | Full | Inline | `role="img"` with the `COPY.md` description. New `chart-` prefix, because it is content, not background |
| `bg-chart-quiet.svg` | Quiet | `url()` | Decorative |
| `bg-chart-ghost.svg` | Ghost | `url()` | Decorative |

**Geometry.** `viewBox="0 0 1300 1300"`. One cell is 100 units, written below as `u` when rendered. Hairlines use `vector-effect: non-scaling-stroke` at 1 px. Draw order: hairlines, then ink, then labels. Merge cells into one path per ink and one per hairline step, each with a class. Do not draw an element per cell. Target under 5 KB for the hero plates, under 9 KB for the Figure, under 1 KB for the Ghost.

**How loud the grid may be.** Evidence: solid red and black at 640 px beside a 176 px headline is too loud, while the same inks at 72% dot size are not.

| Level | Raise | Call | Fold | Labels | Where | Size limit | Neighbours |
|---|---|---|---|---|---|---|---|
| **Full** | Solid Pip Red, 96 x 96 units | Solid Key Black, 96 x 96 | Hairline | Yes | `#engine` figure, range-grids tile on `/gto-hand-review` | 468 px at most (`--chart-w-figure`), on a Face White sheet, padding 24 (16 under 768) | Up to `--display-lg`, never `--display-xl`. Nothing overlaps it |
| **Screened** | Pip Red square, 72 units per side | Key Black square, 72 per side | Hairline and faint label | Yes | Home hero plate only | `--chart-u-hero`, up to 56 px per cell | May sit beside `--display-xl`. A device may overlap it, with fade steps |
| **Quiet** | Flat `--chart-quiet-raise`, 96 x 96 | Flat `--chart-quiet-call`, 96 x 96 | Hairline | None | Product-page heroes, behind the pair | Free. May bleed | No text on it. A device may overlap it with no fade |
| **Ghost** | Hairline | Hairline | Hairline, `--chart-ghost-line` | None | `#how`, behind the pinned phone, `--chart-u-ghost` | Free | Text and moving devices may cross it. No fade, because the device moves |

Placement: Ghost is `no-repeat`, 13 x `--chart-u-ghost` square, centered on the phone column, not shown under 768. Quiet is `no-repeat` at 48 px per cell, flush to the right edge, not shown under 768.

A screened square still prints at 100% ink. Its loudness falls with area: 52% coverage against the Full level's 92%, and a large red block breaks up into small ones, so "solved." stays the view's large red thing. That is how a print shop screens a tint, so the two-ink rule holds.

**Split cells: mixed plays.** Seven cells, in action order raise, then call, then fold, left to right, as vertical bands with hard edges. Band widths are the true frequencies of the square's side. No minimum width, because the chart must stay true.

| Cell | Row, col | Raise | Call | Fold | Label |
|---|---|---|---|---|---|
| A8s | 0, 6 | 34% | 66% | | Face White |
| QTs | 2, 4 | 10% | 90% | | Face White |
| J9s | 3, 5 | 12% | 88% | | Face White |
| T9s | 4, 5 | 64% | 36% | | Face White |
| 33 | 11, 11 | 18% | 82% | | Face White |
| J4s | 3, 10 | | 60% | 40% | Two copies, see below |
| 53s | 9, 11 | | 64% | 36% | Two copies, see below |

Fold bands stay blank. J4s and 53s print the label twice with a `clipPath` per band: Face White over ink, Key Black over blank, so the letters change colour exactly at the ink edge. Both of those cells sit under the phone on the hero plates, so this appears only on the Figure.

**Labels.** Spline Sans Mono 500, centered, `text-anchor="middle"`, `dominant-baseline="central"`. Set `font-size` in user units by rendered width with a container query (`.chart { container-type: inline-size }`). Nothing renders below 12 px.

| Rendered width | Font size, units | Renders at | Full shows | Screened shows |
|---|---|---|---|---|
| 520 and up | 30 | 12 to 16.8 | n/a, Full stops at 468 | All cells |
| 416 to 519 | 37.5 | 12 to 15 | All cells | Pairs only |
| 320 to 415 | 48.75 | 12 to 15.6 | Pairs only | Pairs only |
| 256 to 319 | 61 | 12 to 15 | Pairs only | n/a |
| Under 256 | none | | None | None |

Pairs only means the diagonal, AA to 22, which doubles as the chart's axis. Label colours: Face White on ink cells, `--chart-label-fold` on fold cells. Checked: at each step a three-letter label (1.8 em) or a pair (1.2 em) fits inside a 72-unit square.

**Fading near a device.** No gradient and no opacity. Each cell's step is set by its distance from the device rectangle, computed once by the generator, per plate.

`gap = max(dx, dy)` in cells, where `dx` and `dy` are the distances from the cell's edges to the rectangle's, floored at 0.

| Step | Gap | Square side | Coverage | Hairline | Label |
|---|---|---|---|---|---|
| 3 | Over 2 | 72 | 52% | `--chart-line` | Yes |
| 2 | Over 1, up to 2 | 54 | 29% | `--chart-line-2` | No |
| 1 | Over 0, up to 1 | 36 | 13% | `--chart-line-1` | No |
| 0 | 0, under or touching | Not printed | 0 | Not printed | No |

Labels drop out before step 3 because a small square cannot hold them. Step 0 leaves bare stock around the phone, so its edge is always 16.23:1 against the page.

```text
Wide plate, 1024 and up. Phone 6u wide at x 6.5u, y 1.5u.
Row 0       3333211111111
Rows 1-12   3333210000000

Narrow plate, under 1024. Phone 8u wide at x 4.5u, y 2u.
Row 0       3321111111111
Rows 1-12   3321000000000
```

The phone sits over the fold region on purpose. On the wide plate it hides 43 fold, 33 call, 5 raise and 3 mixed cells, leaving 20 raise, 36 call, 25 fold and 4 mixed printed, including the strongest hands at top left. The narrow plate hides 55 fold, 39 call, 8 raise and 6 mixed. Do not move it to the left half: that is what the first proof did, and it covered the red.

**Hero plate.**

| | 1024 and up | 768 to 1023 | Under 768 |
|---|---|---|---|
| Cell `u` (`--chart-u-hero`) | `clamp(34.8px, 3.4vw, 56px)` | `40vw / 13` | `min(100vw, 544px) / 13` |
| Plate width | 13u, flush to the viewport's right edge | 13u, flush right | 13u, full bleed, right-aligned above 544 |
| Plate height | 14.07u | 18.75u | 15u, phone cropped at the bottom (`UX.md`) |
| Phone | `--phone-w-hero` 6u | 8u | 8u |
| Rendered at 1440 | u 49, chart 636, phone 294 | | |
| Rendered at 320 | | | u 24.6, chart 320, phone 197 |

- Plate top lines up with the top of the copy column, below the nav. The hero section sets `overflow-x: clip`, so `100vw` cannot cause sideways scroll.
- **Caption,** Mono `--text-mono`, Soft Black, left of the phone at x 0, y 13.2u, 6u wide (below the plate under 1024): `COPY.md` 4.3's Tag, then "Red is raise, black is call, blank is fold." from its How to read. `COPY.md` lists no hero caption yet, so these reuse existing words.
- **Pen slip** (1024 and up): a `.slip` with the pen mark and floating chip from `COPY.md` 4.1. Right edge at 6.9u, overlapping the phone by 0.4u. Top at 8.4u. Width `max(12rem, 4.7u)`. It sits over rows that are all fold cells, so it hides no ink. From 768 to 1023 it sits below the plate. Under 768, hidden.

**Legend** (Engine figure, under the chart): three items in Mono `--text-mono`: a 12 px red square "Raise 12.7%", a 12 px black square "Call 38.8%", a 12 px hairline square "Fold 48.5%". The numbers are computed values from the JSON.

**Forced colors.** Set `forced-color-adjust: none` on the Figure, whose meaning depends on the inks.

### 7.2 The lattice

The chart's grid turned 45 degrees. Drawn from that geometry, not from any card maker's back. Because the CSP bans `data:` URIs, these are files.

`src/assets/svg/bg-lattice-red.svg`, 170 bytes:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M-4-4 36 36M36-4-4 36" fill="none" stroke="#A81222" stroke-width="1.5"/></svg>
```

The lines overshoot the tile so no corner gets clipped. `bg-lattice-edge.svg` is the same path with `stroke="#BDBFBE"` and no ground colour.

```css
background: var(--surface-red) url(<path from this CSS file>/bg-lattice-red.svg);
background-size: var(--lattice-size) var(--lattice-size); /* 24 under 768, 32 from 768 */
```

| Use | Ground | Line | Tile | Height |
|---|---|---|---|---|
| Red band | Pip Red | Overprint Red | `--lattice-size` | Content |
| Card back | Pip Red | Overprint Red | `--lattice-size` | Content |
| Edge strip, top of `#pricing` | Transparent over stock | `#BDBFBE` | 16 | `--lattice-edge-h`, 16 px |
| Face-down playing card | Pip Red | Overprint Red | 8, a `<pattern>` in the card's `<symbol>` | Card |

- Rendered at 32 px it is calmer than the first proof's tighter mesh.
- **Text on the lattice is Face White only,** 16 px or larger. Anything smaller, such as the legal row, sits on a plain Pip Red strip.
- Never on ink, never moving, no `background-attachment: fixed`.

### 7.3 The card-back footer

The back of the card, with every link `UX.md` 4.10 asks for. Replaces the footer art in `reveal-footer.md`.

| Layer | Spec |
|---|---|
| Footer ground | `--surface-page`, padding `--cardback-border` (12 to 32) on all sides. This is the card's stock border |
| Card | `.on-red`, `--surface-red` plus lattice, `--cardback-radius` 24, `overflow: clip` |
| Printed frame | 1 px Face White outline, inset `--cardback-keyline-inset` 12, at the card's own radius minus 12. Decorative |
| Inner padding | `clamp(32px, 5vw, 80px)` inside the frame |
| Closing band | H2 `--display-lg`, line `--text-lg`, primary button (Face White on red), text link |
| Link groups | Three groups, heading Mono `--text-mono`, links Schibsted 400 `--text-base`, 44 px rows. Three columns at 1024, two at 768, one under |
| Medallion | The middle of the card, centered: Face White square `--medallion` (96 to 160), turned 45 degrees, `--radius-md`. Inside, upright, the mark at `--medallion-mark`, Key Black with the red cell |
| Legal row | Plain Pip Red strip, no lattice, inside the printed frame at its bottom, matching its corners, with a top hairline `--line`. `--text-sm` Face White: copyright left, concept note right, stacked under 768 |

- No corner index: a card back has none.
- Sticky reveal at 1024 and up, flow fallback below, as the module's wiring. Delete its radial lights, text gradient and dim gradient. Dim by a flat Key Black overlay on the page sheet instead.
- The medallion scales 0.92 to 1 with reveal progress, and the red cell prints at the end of it. Reduced motion: no scale; the end state is shown.
- Legal and 404 pages: no closing band, the rest stays.

### 7.4 The mark

A spade drawn on the 13 x 13 grid. **One cell is red: row 6, column 6, the center of the chart. That cell is 88, which raises in the real chart and is the hand in sample hand 1.**

```text
......#......
.....###.....
....#####....
...#######...
..#########..
.###########.
######@######   @ = Pip Red
#############
#############
.###.###.###.
.....###.....
....#####....
...#######...
```

| Variant | File | Sizes | Spec |
|---|---|---|---|
| Solid | `logo-mark.svg` | 13, 26, 39, 52 | `viewBox="0 0 13 13"`, one merged path, plus one rect for the red cell. `shape-rendering="crispEdges"` |
| Grid | `logo-mark-grid.svg` | 78, 104, 156 | Same bitmap with an 8% gap between cells, so the chart shows through |

| Ground | Spade | Cell |
|---|---|---|
| Stock, Face White | Key Black | Pip Red |
| Pip Red | Face White | Pip Red |
| Key Black | Face White | Pip Red |

- Only multiples of 13 px, so edges stay crisp. Smallest size 13 px. Clear space: half the mark's width.
- **Lockup** (`logo-lockup.svg`): mark 26 px, 8 px gap, "HandSolved" in Sofia 800 at `--nav-wordmark` 28 px, converted to outlines, all one ink. Width 136 px, fits at 320 beside the burger.
- **Favicon:** `favicon.svg`, 32 x 32, Face White tile, radius 6, cell 2 px, margin 3 px. `favicon-32.png` from it. `apple-touch-icon.png`, 180 x 180, cell 12 px, margin 12 px.
- Rendered at 13, 26, 52, 104 and 156: reads as a spade at all of them.

### 7.5 The corner index

A card index top left and the same index turned 180 degrees bottom right. `aria-hidden`.

| Part | Spec |
|---|---|
| Rank | Sofia 800, `--index-rank` 28 to 44, line height 0.9. "10" keeps `letter-spacing: -0.02em` |
| Suit | `icon-suit-*`, height `--index-suit` (0.6 of the rank), 2 px below the rank, same left edge |
| Colour | Spade, club: Key Black. Heart, diamond: Pip Red. Inside `.on-ink` and `.on-red`: all Face White |
| Position | `absolute` in the section, inside the container, `--index-inset` 8 to 32 from its top and left. The bottom-right copy has the same inset |
| Fit | The index plus its inset is 52 px at 320 against 64 px of section padding, 93 against 128 at 1440, so it never reaches content |

- Sequence on home in section 6. Pattern: ranks fall from A, suits cycle spade, heart, club, diamond. Product pages restart at A spade. Legal, hero and footer have none.
- The story band drops the bottom-right copy, because the phone is there.

### 7.6 The red pen

Black is what you did. Red is the coach's mark. The marks follow the grade, as `COPY.md`'s margin notes say.

| Grade | Mark on the "You" text | Margin note |
|---|---|---|
| Best move | None | "Nothing to cross out." |
| Good | `icon-pen-tick` after the text | "A tick in the margin." |
| Inaccuracy | `icon-pen-wave` under the text | "A small note in the margin." |
| Mistake | `icon-pen-ring` around the text | "Circled in red." |
| Blunder | Strike through, better play written in | "Struck out, better play written in." |

**Strike and write-in.** `<del>Call 65 bb</del> <ins>Fold</ins>`, with visually hidden "You played" and "GTO plays" where the text alone is unclear.

```css
del.pen { position: relative; color: var(--text-main); text-decoration: none; }
del.pen::after { content: ""; position: absolute; inset-inline: -0.06em; top: 52%;
  height: var(--pen-stroke); background: var(--pen-ink);
  transform: rotate(var(--pen-tilt)); transform-origin: left center; }
ins.pen { color: var(--text-red); font-weight: var(--weight-semibold); text-decoration: none; margin-inline-start: 0.5em; }
```

- The strike draws with `scaleX` 0 to 1 over `--dur-3`. Reduced motion: drawn already.
- No handwriting face: a fourth family would break the budget, and exact type suits the voice.
- `icon-pen-ring`: one open path that overshoots its start, stroke 1.5 px, `vector-effect: non-scaling-stroke`, stretched with `preserveAspectRatio="none"`, inset -0.2em around the text.
- **Margin notes:** Schibsted 400, `--text-sm`, `--text-red`, tilt `--pen-note-tilt`. One per tile at most. Red pen is never on ink, and on red it turns Face White.
- **Session stamp, A to F:** see 9.4. All grades use the same red: a teacher's pen does not change colour for an A.

## 8. Device frames

Flat Key Black silhouettes, no gloss, no hands, no notch, no buttons. `frame-phone.svg` and `frame-laptop.svg` are T15's art, inlined by `PhoneFrame` and `LaptopFrame`, with the screenshot on top. Formulas use W, the frame's outer width.

### Phone

| Part | Formula | At W = 300 | CSS or SVG |
|---|---|---|---|
| Bezel | 0.03W | 9 | `--phone-bezel`. Screen inset 3% of W on all sides |
| Screen width | 0.94W | 282 | |
| Screen height | 0.94W x 2532 / 1170 = 2.03425W | 610.3 | `aspect-ratio: 1170 / 2532`, matching the captures |
| Outer height | 2.09425W | 628.3 | `--phone-height`. SVG `viewBox="0 0 1000 2094.25"` |
| Outer radius | 0.15W | 45 | `rx="150"` |
| Screen radius | 0.12W | 36 | `border-radius: 12.766% / 5.899%` on the screen. A percentage needs no inline width |

### Laptop

W is the lid's width. The base is wider, so the frame's total width is 1.12W.

| Part | Formula | At W = 640 | CSS or SVG |
|---|---|---|---|
| Bezel | 0.018W | 11.5 | `--laptop-bezel` |
| Screen width | 0.964W | 617 | |
| Screen height | 0.964W x 1800 / 2880 = 0.6025W | 385.6 | `aspect-ratio: 8 / 5` |
| Lid height | 0.6385W | 408.6 | |
| Lid radius, top corners | 0.022W | 14 | |
| Screen radius | 0.004W | 2.6 | `border-radius: 0.415% / 0.664%` |
| Base | 1.12W x 0.028W | 717 x 18 | Centered under the lid, no gap, same ink. Bottom radius 0.014W, top corners square |
| Total | 1.12W x 0.6665W | 717 x 427 | One silhouette, aspect 1.68 |

### Staging

| Rule | Spec |
|---|---|
| Grounds | Stock and red band only. Rule 8 is absolute |
| Screen fit | `object-fit: cover; object-position: top`. Nothing is rethemed or cropped sideways |
| Edge in the captures | The status area matches the bezel at `#12181B`. The phone's tab bar and the desktop's left rail are `#1A2327`, one step lighter than the bezel. Accepted as captured |
| Pair | Phone in front at the laptop's right end. Phone W is 0.26 of lid W, overlapping the lid by 0.06 of lid W, bottoms aligned. Ink on ink loses the edge, so the phone takes `outline: var(--device-keyline) solid` in the ground colour |
| Sizes | `--phone-w-hero`, `--phone-w-story` (pinned, height-limited), `--phone-w-panel` 260 to 320, `--phone-w-band` 240 to 352, `--laptop-w-panel`, `--laptop-w-hero`. Pass matching `sizes` to `<Picture>` |
| Story band | Phone on the right. At 768 and up it bleeds off the band's bottom edge, cropped 18% of its height, with `overflow: clip` on the band only |
| Sample-data tag | A `.slip`, Mono `--text-xs`, Key Black on Face White, `--line-strong`, height 24. Hangs on the top edge: `top: -0.75rem`, left 12% of W. The top is never cropped, so the tag always shows |

### States

| State | Look |
|---|---|
| Default | As above |
| Tilt, fine pointer only | `perspective(1200px)`, at most 3 degrees on either axis. No shadow, no sheen |
| Loading | Screen is solid `--device-ink`, already sized, so nothing shifts |
| Image failed | Solid `--device-ink` with the alt text centered, Face White, `--text-sm`, inset 8% |
| Reduced motion | No tilt, no float |

## 9. Components

### 9.0 Rules for every state

Where a component below does not mention a state, this table applies.

| State | Rule |
|---|---|
| **Focus-visible** | `outline: 2px solid transparent; box-shadow: var(--focus-ring)`. A Face White ring inside a Key Black ring, so one value passes on stock, white, ink and red. The transparent outline makes it show in forced colors. Where a parent clips: `--focus-ring-inset`. Never removed |
| **Hover** | `@media (hover: hover)` only, and never the only way to reach anything. Colour changes over `--dur-1` or `--dur-2`. Nothing lifts |
| **Active** | `transform: scale(0.98)`, `--dur-1`, on the hover colours |
| **Disabled** | Never opacity. `--surface-muted` ground, `--text-muted` label (5.60:1), no pointer. Used only for the submit lock and locked action buttons |
| **Error** | Pip Red with an icon and words. Never colour alone |
| **Loading** | Only three things wait: device images, fonts, and pop-up 1's module. No button has a loading state, because nothing is sent. No spinners, no shimmer |
| **Success** | Key Black with a check icon and words |
| **Reduced motion** | Same look, instant. Tokens collapse to 0.01 ms |

### 9.1 Buttons and links

Height `--control-h-md` 48, `--control-h-sm` 44 in the nav, `--control-h-lg` 56 for the hero, mobile bar and sheets. Padding-inline 24 (28 at 56). `--radius-md`. Schibsted 600 `--text-base`, or `--text-sm` at 44.

| State | Primary | Secondary | Text link |
|---|---|---|---|
| Default | `--btn-primary-bg` ground, `--btn-primary-fg` label | Transparent, 1 px `--btn-secondary-edge`, `--btn-secondary-fg` label | `--link-fg`, Schibsted 600, 1 px underline, offset 0.2em, `icon-arrow-right` 16 where it navigates |
| Hover | `--btn-primary-bg-hover`, `--btn-primary-fg-hover` | Flips: `--btn-secondary-bg-hover`, `--btn-secondary-fg-hover` | `--link-fg-hover`, underline 2 px, arrow moves 2 px |
| Focus-visible | Ring | Ring | Ring, radius 4 |
| Active | Scale 0.98 | Scale 0.98 | Underline 2 px |
| Disabled | Muted, per 9.0 | Muted, per 9.0 | Not used |
| Loading, error, success | None | None | None |

The scopes in 3.4 set these values, so nothing needs writing per section.

| Ground | Primary | Primary hover |
|---|---|---|
| Stock, paper | Pip Red, Face White | Overprint Red, Face White |
| Ink | Pip Red, Face White | Face White, Key Black. Overprint would fall to 2.37:1 |
| Red | Face White, Key Black | Key Black, Face White |

Full width in sheets and the mobile bar. Flat only: no gradient, sheen or inner highlight from `premium-buttons.md`.

### 9.2 Navbar and global layer

| | Top of page | Scrolled, past 16 px |
|---|---|---|
| Width | Container width | `min(100% - 2 x --gutter, --nav-w-scrolled)`, centered |
| Height | `--nav-h-top` 64 | `--nav-h-scrolled` 56 |
| Top offset | `--nav-inset` 16 | 16 |
| Ground | None, printed straight on the stock | `--surface-raised`, opaque, stays Face White over red and ink |
| Edge | None | 1 px `--line-strong`, `--radius-xl` |
| Shadow | None | None |
| Button | Secondary, while the hero CTA is in view | Primary, once the hero CTA has left. On pages with no hero CTA, primary |
| Change | | Width, height and ground over `--dur-3`, `--ease-out` |

| Part | Default | Hover | Focus | Current |
|---|---|---|---|---|
| Brand | Lockup | Unchanged | Ring | |
| Link, Schibsted 600 `--text-sm`, Key Black, 44 tall, padding-inline 12 | No ground | Slip of `--surface-muted`, `--radius-md`, glides over `--dur-3` with `--ease-spring` | Ring | `aria-current`: the slip rests here. The text stays Key Black |
| Burger, under 1024, 44 x 44 | `icon-menu` plus "Menu" in Mono `--text-mono` | Slip of `--surface-muted` | Ring | Open: `icon-close`, Face White on the panel |

| Component | States |
|---|---|
| **Mobile menu panel** | Closed. Opening and closing: circle reveal from the burger over `--dur-4`. Open: `.on-ink`, full viewport, rows 56 tall in Schibsted 600 `--text-xl`, 1 px `--border-inverse` rules, primary at the bottom, concept note `--text-sm` `--text-inverse-muted`. Link hover: `--surface-muted` row. Focus: ring |
| **Mobile CTA bar** | Under 768. Face White, top hairline `--line-strong`, padding 12 and 16, `max(12px, env(safe-area-inset-bottom))`, primary 56 tall. Visible: slides up over `--dur-3`. Hidden, including by dialog, footer and story: translated off, not faded |
| **Skip link** | Hidden: off-screen. Focus: top left at 16 px, Key Black, Face White, Schibsted 600, height 44, `--radius-md`, ring |
| **Page-load veil** | Playing: Key Black, centered mark at 104 px, Face White spade, red cell. Splits and lifts with `transform`. Done: removed. Skipped or disabled: never shown. Timing: `MOTION.md` |
| **Slip** (`.slip`) | Not in the UX list, used by tags, chips and readouts. Face White, 1 px `--line-strong`, `--radius-sm`, padding 4 and 8, Mono `--text-mono`, Key Black. Flat, never tilted |

### 9.3 Hero and sections

| Component | Spec and states |
|---|---|
| **Hero** | Kicker, Schibsted 600 `--text-base`. H1 `--display-xl`, Key Black, "solved." in `--text-red`. Subhead `--text-lg`, `--measure-lead`. Primary 56, then text link. Micro-line Mono `--text-mono`, `--text-muted`. Proof strip. Plate per 7.1. Top padding `--nav-inset` + `--nav-h-top` + 16. The copy column always ends at least 32 px before the plate's left edge, so the subhead never touches it. **Entering:** H1 lines rise by transform only, never from opacity 0. **Settled:** at rest. **No script:** all visible, noscript link replaces the button. **Image failed:** per section 8 |
| **Compact hero** | H1 `--display-lg`. Laptop and phone pair right, Quiet chart behind it. On `/live-poker-hand-recorder`, phone only |
| **Proof item** | Mono `--text-mono`, Key Black, 16 px icon, 1 px `--line` rule above. Three rows at 1024 and up inside the copy column, stacked under 768. Help tip on hover, focus or tap: Key Black ground, Face White `--text-sm`, `--radius-md`, max 18rem, no arrow |
| **Story** | Step label Mono `--text-mono`. Title `--text-xl`. **Inactive:** all Soft Black. **Active:** Key Black, 2 px Pip Red bar at the left edge, drawing over `--dur-3`. **Passed:** Soft Black, bar gone. Dots 8 px: active Key Black, others `--line-control`. Scenes cross-fade. Callout chips are `.slip`s beside the phone, a single text line under 768. **Stacked fallback:** step, text, phone 240 wide |
| **Counter** | Number `--display-lg`, `tabular-nums`, `--text-main`. Label Schibsted 600 `--text-base`. Note `--text-sm` `--text-muted`. **Final text:** real number in HTML. **Rolling:** digit wheels with the mask pad from 4.4. **Settled, reduced:** final number. Three across at 768 and up, 1 px `--line` rules between them, no cards |
| **Engine figure** | Sheet: Face White, `--radius-lg`, 1 px `--line-strong`, padding 24 (16 under 768). Figure label `--text-base` 600, Tag as `.slip`, chart at `min(100%, --chart-w-figure)`, legend, caption `--text-sm`, how to read `--text-sm` `--text-muted`. Static |
| **Bento tile** | Face White, 1 px `--line-strong`, `--radius-xl`, padding 24. Icon 24, name H3 `--text-xl`, description `--text-sm` `--text-muted`, margin note, rows. **Hover:** edge to `--line-control`; the library's spotlight is deleted. **Focus-within:** ring on the tile. **In-view done:** rows at rest. **Insights tile:** `.on-ink`, no device |
| **Hand row** | Two `sm` cards, title `--text-sm` 600, meta Mono `--text-xs` `--text-muted`, 1 px `--line` rule. Amounts Mono, signed. **Button variant:** hover `--surface-muted`, focus ring, "Grade it" as a text link |
| **Info card** | Face White, 1 px `--line-strong`, `--radius-lg`, padding 24, spot icon 32. **Hover:** edge to `--line-control`. Not clickable |
| **Good-to-know item** | 20 px icon, `--text-sm`, Key Black. Plain row with no box |
| **Chart legend** | See 7.1 |

### 9.4 Grade chips and stamps

Rank is carried by fill, edge and icon together, then word and score. Two ticks, one tick, a wobble, one cross, two crosses.

| Grade | Ground | Text, icon | Edge | Icon | Ratio |
|---|---|---|---|---|---|
| Best move | Key Black | Face White | None | `icon-grade-best`, two ticks | 17.44 |
| Good | Face White | Key Black | 1.5 px Key Black | `icon-grade-good`, one tick | 17.44 |
| Inaccuracy | Face White | Soft Black | 1.5 px dashed Soft Black, dash 4 gap 3 | `icon-grade-inaccuracy`, wave | 6.52 |
| Mistake | Face White | Pip Red | 1.5 px Pip Red | `icon-grade-mistake`, one cross | 5.37 |
| Blunder | Pip Red | Face White | None | `icon-grade-blunder`, two crosses | 5.37 |
| Ungraded | Transparent | Soft Black | 1 px `--line-strong` | `icon-grade-none`, dash | 6.07 |

| Form | Where | Spec |
|---|---|---|
| **Chip** | Engine legend, review page | Height 32, padding-inline 10, `--radius-sm`, Mono `--text-mono`, icon 14, gap 6. No tilt. Static, no hover. The caption or tooltip gives the meaning |
| **Stamp** | Verdict | Height 44, padding-inline 12, `--radius-sm`, name in Mono `--text-mono`, score in Sofia 800 `--display-sm`, icon 16. A second rim: `outline: 1px solid` in the same ink, `outline-offset: 2px`. Tilt `--stamp-tilt`. Lands with scale 1.15 to 1 over `--dur-2`, `--ease-out` |
| **Session stamp** | History tab heading | 56 x 56, `--radius-md`, 2 px Pip Red with a 1 px rim at offset 2, one letter A to F in Sofia 800 at 36 px, Pip Red, tilt `--stamp-tilt-session`, transparent ground. Static. Decorative beside text that says the grade |

### 9.5 Switches

Both are a segmented control with a sliding thumb. Track `--surface-muted`, 1 px `--line-control`, `--radius-md`, padding 3, height 44. Thumb `--switch-thumb`, `--radius-sm`. In the pop-up header it renders 36 tall with a 44 px hit area.

| State | Unit switch, BB / $ | Billing switch, Monthly / Yearly |
|---|---|---|
| Labels | Mono `--text-mono`, 40 wide each. "Show amounts in" as a group label above, Mono `--text-xs` | Schibsted 600 `--text-sm`, padding-inline 16 |
| On, either side | Thumb under it, label `--switch-on-fg` | Same |
| Off label | `--text-main` | Same |
| Hover, off side | Segment ground `--border-subtle` | Same |
| Focus-visible | Ring on the focused button | Ring on the label via `:has(input:focus-visible)`, since this is radio plus `:has()` |
| Active | Thumb scale 0.98 | Same |
| Switching | Thumb moves over `--dur-3`, `--ease-spring`. Numbers roll, `tabular-nums` | Same. Prices roll |
| Reduced | Thumb and numbers change instantly | Same |
| Disabled, error, loading, success | None | None |
| Extra | | Savings chip beside it: `.slip`, Mono `--text-xs`, `--text-red` |

On ink the scopes flip track, thumb and labels. No script: switch hidden, section reads in big blinds.

### 9.6 Tabs and FAQ

| State | Tabs, toolbox | FAQ item |
|---|---|---|
| Default | Schibsted 600 `--text-sm`, Key Black, 44 tall, padding-inline 16, `--radius-md`, no ground. The tab row has a 1 px `--line` rule beneath | 1 px `--line` rule on top. Question Schibsted 600 `--text-lg`, min row 56. `icon-plus` 20 at right |
| Hover | Ground `--surface-muted` | Rule goes `--line-control`, icon goes `--text-red` |
| Focus-visible | Ring | Ring on `<summary>` |
| Selected or expanded | Key Black thumb springs here over `--dur-3`, label Face White | Icon becomes `icon-minus`. Answer `--text-base`, `--measure`, Soft Black, 16 top padding, 24 bottom |
| Active | Scale 0.98 | No scale |
| Animating | Panel cross-fade, device assembles | Height over `--dur-3`, `--ease-out` |
| Panel hidden, shown | `hidden` attribute. Panel: text one side, device the other, sides alternate at 1024 | Native `<details>` |
| Under 768 | Row scrolls and snaps, text then device at 260 | Same |
| No script, reduced | All three panels stacked, instant | Native, instant |

At 1024 and up FAQ's heading and lead stick left, per `UX.md`. The FAQ uses no cards.

### 9.7 Pricing

Two cards. At 1024 and up, Free 5 columns, Pro 7 columns, tops aligned. Under 1024, stacked, Pro first. Pro's bullets run in two columns at 1024 and up.

| State | Free card | Pro card |
|---|---|---|
| Default | Face White, 1 px `--line-strong`, `--radius-xl`, padding 32 (24 under 768) | `.on-ink`, Key Black, same shape, no edge. Never holds a device |
| Name | H3 `--text-xl` | H3 `--text-xl`, plus "Recommended" tag: Pip Red, Face White, Mono `--text-xs`, `--radius-sm` |
| Price | `--display-lg`, `tabular-nums`, then "/mo" in Mono `--text-mono` | Same, Face White |
| Billing, audience | Mono `--text-mono` `--text-muted`, then `--text-base` | Same, on ink |
| Bullets | 16 px `icon-check`, `--text-base`, 8 gap | Same, Face White |
| Button | Secondary, full width | Primary, full width |
| Hover | Edge to `--line-control` | 1.5 px Pip Red rim draws around the card once: an SVG `rect` with `stroke-dashoffset`, over `--dur-4`. Replaces the library's conic gradient |
| Focus-within | Ring on the button only | Ring on the button only |
| Price rolling | Digits roll, `--dur-3` | Same |
| No script | Both prices as text, buttons link to `/#faq` | Same |
| Loading, error, disabled, success | None | None |

Note under the cards: `--text-sm` `--text-muted`, with its FAQ link. Prices are dollars always; the BB/$ switch never touches them.

### 9.8 Dialog shell

| State | 768 and up | Under 768 |
|---|---|---|
| Closed | Nothing | Nothing |
| Opening | Springs from the trigger, `--dur-4`, `--ease-spring` | Slides up, `--dur-4`, `--ease-out` |
| Open | `--surface-raised`, `--dialog-radius`, width `min(--dialog-w-sample, 100vw - 48px)` or `--dialog-w-early`, max height 90svh. No edge; the scrim does the work | Sheet: `--dialog-radius` on top corners only. Pop-up 1 is full height minus `--sheet-top-gap`, pop-up 2 follows its content. Handle: `--sheet-handle-w` x `--sheet-handle-h`, `--line-control`, circle ends |
| Scrim | `--scrim`, flat. No blur | Same |
| Close button | 44 x 44, `icon-close`, Key Black. Hover: `--surface-muted`. Focus: ring | Same |
| Sheet drag | | Follows the finger with `transform`. Scrim fades with it |
| Closing | Reverse of opening | Reverse |
| Reduced | Instant fade | Instant fade |

Header: 1 px `--line` beneath. Footnote: Mono `--text-xs`, `--text-muted`, 1 px `--line` above.

### 9.9 Pop-up 1: sample hand

**Layout.** Left, the scene panel on `--surface-page`, 46%, with a 1 px `--line` between panels. Right, the choices on Face White, 54%. One column from 768 to 1023, scene at most 280 tall. Under 768, the sheet, scene at most 220 tall. Title `--display-sm`. "Hand 1 of 3" Mono `--text-mono` with three 8 px dots: done and current Key Black, later ones `--line-control`.

| Whole-view state | Look |
|---|---|
| **Loading** (module not yet here) | Header works. Scene shows the empty table: rail, dashed board slots, no cards. Right panel: flat `--surface-muted` blocks at the size of the question and each button, `aria-busy="true"`. No animation |
| **Choose** | Scene, situation `--text-base`, question Schibsted 600 `--text-lg`, hint `--text-sm` `--text-muted`, action buttons |
| **Committed** | Actions lock, the view morphs to the verdict within 700 ms. Bars grow, numbers roll |
| **Verdict** | Below |
| **Dealing** | Cards flip over 500 ms, dot advances |
| **Set complete** | Hand 3's primary becomes "Get early access" |
| **Data error** | Scene area holds an `icon-alert` in Pip Red and the message, `--text-base`. Link and Close button. No partial hand |
| **Landscape phone** | Full screen, two columns, header 44 |

**Action button.** Min height `--control-h-lg` 56. Two stacked at 2 options, 2 x 2 at 4 options under 768.

| State | Look |
|---|---|
| Default | Face White, 1 px `--line-control`, `--radius-md`. Label Schibsted 600 16, Key Black. Sublabel `--text-sm`, Soft Black, always visible. Left-aligned |
| Hover | Edge Key Black, ground `--surface-muted` |
| Focus-visible | Ring |
| Pressed | Key Black ground, Face White label and sublabel, scale 0.98 |
| Committed | Key Black ground, Face White text, plus a "You" tag. `aria-pressed="true"` |
| Locked | `disabled`. Face White, 1 px dashed `--line-strong`, label and sublabel Soft Black (6.52:1) |
| Error, loading, success | None. The whole view handles those |

**Verdict display**, in order:

1. **Stamp** plus its margin note, in a row.
2. **Verdict heading** `--text-xl`, then the sentence `--text-base`. Focus target.
3. **You and GTO cards** side by side from 360, stacked under. `--surface-page`, `--radius-lg`, padding 12 and 16, no edge. Label Mono `--text-xs` Soft Black. Value Schibsted 600 `--text-lg`. **You** in Key Black with the grade's pen mark from 7.6. **GTO** in Pip Red (4.99:1), the written-in play. When the visitor picked GTO's top option: both Key Black, no pen.
4. **Stat tiles.** Same ground, label Mono `--text-xs`, value Mono `--text-base`. Amounts follow the unit switch.
5. **Options list.** Header row Mono `--text-xs`: Option, GTO plays it, Worth.
6. **Bullets** `--text-sm`, Key Black, small 4 px square markers in Soft Black.
7. **Actions.** Primary and secondary. Pinned to the sheet bottom under 768. Under 360, primary full width and secondary as a text link.

**Verdict option row** (a button). Min height 56. Three columns, 1 px `--line` rule.

| State | Look |
|---|---|
| Default | Name Schibsted 600 `--text-sm`. Bar plus percent in Mono. Worth in Mono, signed |
| GTO | "GTO" tag: Pip Red, Face White. Bar in Pip Red |
| You | "You" tag: Key Black, Face White. Bar in Key Black |
| GTO and You | Both tags. Bar in Pip Red |
| Hover | `--surface-muted`. Negative worth stays 4.61:1 |
| Focus-visible | `--focus-ring-inset` |
| Selected, what-if | `aria-pressed="true"`, 2 px Key Black bar inside the left edge. The "You" tag moves here |
| Under 480 | Bar drops under the name as a 4 px line |
| Reduced | Bars at final width, tag jumps |

Tags: height 20, Mono `--text-xs`, `--radius-sm`. **Bar:** 6 px track `--surface-muted`, square ends, true width, other rows in Key Black. **Worth:** zero or positive in Key Black, negative in `--text-red` with U+2212. The word "Best" tag sits with the best option, so colour never carries it alone.

**Table scene.** Printed diagram, not felt. Inline SVG.

| Part | Wide (`0 0 480 320`) | Narrow (`0 0 288 220`) |
|---|---|---|
| Rail | Ellipse center 240, 160, radii 200, 120. Face White, 1.5 px Key Black | Center 144, 110, radii 84, 92. Same |
| Inner line | Radii 188, 108, 1 px `--line` | Radii 74, 82 |
| Seats | 8, at angles 90 + 45k degrees from center, on the rail plus 24 | Same, plus 16 |
| Seat circle | r 20, Face White, 1 px `--line-control`, label Mono 12 | r 16 |
| Hero seat, at the bottom | Key Black fill, Face White label, two `md` cards inside the rail | `sm` cards |
| Opponent | 1.5 px Key Black, label, two face-down `sm` cards | Same |
| Other seats | 1 px `--line-control`, labelled | Under 400: 1 px `--line`, unlabelled |
| Dealer button | r 11, Face White, 1 px Key Black, "D" Mono 12 | Same |
| Board | 5 `md` cards, gap 6, centered | 5 `sm` cards, gap 4 |
| Pot line | Mono 13, Key Black, under the board | Same |

No chips. States: per spot, dealing (flip over 500 ms, `transform` only), static on the review page.

**Playing card.** `--card-aspect` 5 / 7, corner 10% of width, one `<symbol>` per card kept under 1 KB.

| State | Look |
|---|---|
| Face up | Face White, 1 px `--line-strong`. Rank top left in Sofia 800 at 45% of the width. `icon-suit-*` beneath it. Spade and club in Key Black, heart and diamond in Pip Red. Suits differ by shape, so colour is never alone. Two ink only: no four-colour deck |
| Face down | Pip Red, lattice tile 8, 2 px Face White inner border at 8% of width |
| Empty slot | No fill, 1 px dashed `--line-control`, dash 4 gap 4 |
| Screen reader | The cards' `<svg>` gets words: "8 of hearts" |

**Glossary disclosure.** Text link with `icon-chevron-down`, turns 180 degrees when open. Terms Mono `--text-mono` 500, definitions `--text-sm`. Focus: ring.

### 9.10 Pop-up 2: early access

Title `--display-sm`. Order: plan chip, label, field, reserved message line, pre-submit line, submit.

**Text field.** Label Schibsted 600 `--text-sm`, always visible above. Height `--control-h-field` 52. Text 16 px or more, Key Black. Placeholder Soft Black (6.52:1).

| State | Look |
|---|---|
| Default | Face White, 1 px `--line-control`, `--radius-md` |
| Hover | Edge Key Black |
| Focus | Ring, edge Key Black |
| Filled | As default |
| Error | 2 px Pip Red, `icon-alert` in Pip Red inside at the right, `aria-invalid="true"`, message below |
| Hint | Edge stays, message below with a "Use this" text link |
| Valid | `icon-check` in Key Black inside at the right, no words |
| Disabled | Not used |
| Loading | None. The check is local and instant |

**Inline message.** One line always reserved (`min-height: 1.55em`), so nothing jumps. `--text-sm`, 16 px icon, gap 6. Error: Pip Red with `icon-alert` (5.37:1). Hint: Key Black with `icon-info`. Success: Key Black with `icon-check`.

**Plan chip.** Absent or present. `--surface-page`, 1 px `--line`, `--radius-sm`, Mono `--text-mono`, Key Black. Read-only text, no hover.

**Submit.** Primary, full width, 56 under 768. Never disabled before submit. Muted for the length of the transition after a valid submit.

**Success view.** Height morph over `--dur-4`. Check ring: 56 px circle, 2 px Key Black, tick draws over `--dur-3`. H2 `--display-sm`, body `--text-base`, address in Mono `--text-mono`, concept wording as `COPY.md`, primary then text link. Reduced: drawn already.

### 9.11 Your numbers: dashboard and chart

`.on-paper` sheet on the ink section: Face White, `--radius-xl`, padding 24, no edge.

| Part | Spec |
|---|---|
| Tiles | 4 across at 768 and up, 2 x 2 under. Label Mono `--text-xs` Soft Black, value Sofia 800 `--display-sm`, `tabular-nums`, 1 px `--line` rules |
| Line | 2 px Key Black. No area fill, no gradient |
| Points | 6 px Key Black circles. Last point 10 px Pip Red, its value Sofia 800 `--display-md` beside it |
| Axes | 3 horizontal `--line` rules, zero line `--line-control`. Labels Mono `--text-xs` Soft Black |

| State | Look |
|---|---|
| No script, drawn | Full line, final numbers |
| Drawing | Line scrubs by scroll with `pathLength` |
| Readout, pointer or keyboard | 1 px Key Black vertical rule. Readout slip: Key Black, Face White, Mono `--text-mono`, `--radius-sm`. Point under it grows to 10 px |
| Focus-visible | Ring on the chart |
| Table view | Disclosure below, then the Options table style |
| Reduced | Drawn, numbers swap |

### 9.12 Closing band, footer, wayfinding and the rest

| Component | Spec and states |
|---|---|
| **Closing band and reveal footer** | 7.3. Sticky reveal, flow fallback, no script: end state shown. Focus-in-footer: module's rule, plus the ring. Footer links: hover underline 2 px, focus ring on the card |
| **Numbers CTA** | On ink. 1 px `--line` rule above. Line Schibsted 600 `--text-xl`, then primary |
| **Story band** | `.on-red` with lattice. Band line `--display-lg`, sub `--text-lg`, closing line `--text-base` 600, primary (Face White), phone at right. Under 768: text, then phone at `--phone-w-band`, cropped by the band's bottom edge |
| **Breadcrumbs** | Mono `--text-mono`. Links underlined, 1 px, hover 2 px. `icon-chevron-right` 12 between. Current page Soft Black, not a link. Focus: ring. Under 44 px tall: add padding for the hit area |
| **Prose block** | H1 `--display-md`, H2 Schibsted 600 `--text-xl`, body `--text-base`, `--measure`. Links underlined. Summary box: Face White, 1 px `--line-strong`, `--radius-lg`, padding 24 |
| **Table of contents** | 1024 and up, left, sticky. Mono `--text-mono`, Soft Black, 32 rows. **Hover:** Key Black. **Focus:** ring. **Current:** Key Black, 2 px Key Black bar at the left |
| **Options table** | Real `<table>`. Header Mono `--text-xs` Soft Black, 1 px `--line-control` below. Rows `--text-sm`, Worth in Mono, 1 px `--line`. GTO row: "GTO" tag and 600. Negative: Pip Red and minus sign. Static |
| **404 block** | Three cards at `--card-w-xl`: a 4 of spades, a face-down card standing in for the zero, a 4 of hearts, gap 12, centered, `aria-hidden`. H1 `--display-md` from `COPY.md`, one line `--text-lg`, primary, three text links |

## 10. Imagery, icons and image slots

**Screens.** Real captures from `src/assets/screens/` are the only raster on the site. Dark ink and teal, as captured, always tagged Sample data.

**Photography.** None. No people, hands, tables, chips or stock.

**Illustration brief for `svg-expert`.** Flat, printed, two inks. Fills only in Key Black and Pip Red, plus Face White. No gradients, filters, or more than one weight of line.

**Icons.** Inline SVG, `currentColor`, one grid.

| Property | Value |
|---|---|
| Grid | 24 x 24, live area 20 |
| Stroke | 1.5, square caps, miter joins |
| Sizes | 12, 14, 16, 20, 24, 32. Keep at the sizes named per component |
| Fill | Outline only, except suits, the mark and pen marks |
| Weight | Under 1 KB, no `<style>`, no `style=` |

| Group | Names (`icon-*`) |
|---|---|
| Navigation | `arrow-right`, `arrow-down`, `chevron-right`, `chevron-down`, `plus`, `minus`, `close`, `menu` |
| Status | `check`, `info`, `alert`, `star` |
| Suits, filled, on a 16 grid | `suit-spade`, `suit-heart`, `suit-diamond`, `suit-club`. Original drawings, distinct silhouettes |
| Grades | `grade-best`, `grade-good`, `grade-inaccuracy`, `grade-mistake`, `grade-blunder`, `grade-none` |
| Pen | `pen-tick`, `pen-wave`, `pen-ring` |
| Hero proof | `proof-charts`, `proof-streets`, `proof-score` |
| Limits | `limit-holdem`, `limit-entered`, `limit-postflop` |
| Highlights tiles | `tile-fame`, `tile-shame`, `tile-tilt`, `tile-pots`, `tile-insights` |
| Data cards, 32 | `data-import`, `data-export`, `data-install` |

**Image aspect ratios.** Phone screen 1170 / 2532, desktop screen 8 / 5, social 1200 / 630. Tile art 4 / 3.

**Backgrounds on home.** `bg-lattice-red.svg`, `bg-lattice-edge.svg`, `bg-chart-ghost.svg`, each under the 8 KB cap. The hero plates are inline and count toward the HTML budget.

### Image slots for future Gemini art

**Nothing needs raster art today, and no layout waits on any of these.** Every slot's fallback is what ships. Do not put empty slot markup in the HTML. `PROJECT.md` keeps generation out of scope until a person runs it.

Common brief for `gemini-image-prompter`: a two-ink relief print on `#F3F4F1`, using only `#12181B` and `#CE1A2C` as flat ink, with no gradients, shading, text, logos, faces, hands, chips, green or teal. Never above the fold, always lazy, reserved with `aspect-ratio`.

| Slot | Where | Size, ratio | What ships without it | Subject |
|---|---|---|---|---|
| IMG-1 | Hall of Fame tile | 640 x 480, 4 / 3 | `icon-tile-fame` | A hand of cards in a picture frame |
| IMG-2 | Wall of Shame tile | 640 x 480, 4 / 3 | `icon-tile-shame` | A hand of cards pinned to a brick wall |
| IMG-3 | Tilt Tower tile | 640 x 480, 4 / 3 | `icon-tile-tilt` | A leaning tower of cards |
| IMG-4 | Monster Pots tile | 640 x 480, 4 / 3 | `icon-tile-pots` | An oversized cooking pot |
| IMG-5 | `#data` cards | 480 x 480, 1 / 1, three images | `icon-data-*` | A crate arriving, a crate leaving, an app on a phone |
| IMG-6 | 404 | 800 x 600, 4 / 3 | The three cards | A card fallen under a table |

### Social images

`public/og/home.jpg`, `hand-recorder.jpg`, `gto-review.jpg`. 1200 x 630, under 200 KB, composed from real screens per `ARCHITECTURE.md`. Not made in this task.

| Part | `home.jpg` | Other two |
|---|---|---|
| Ground | Card Stock | Card Stock |
| Lockup | Top left at 64, 48, mark 52 | Same |
| Headline | Sofia 800, 3 lines, 132 px, x 64, "solved." in Pip Red | Page's H1, 88 px, up to 3 lines |
| Art | Wide plate at u 40, flush right, phone over it, cropped at the bottom | Phone capture on stock, cropped at the bottom |
| Tag | Sample data slip | Same |

## 11. Motion tokens

Choreography belongs to `MOTION.md`. These are the values it uses.

| Token | Value | For |
|---|---|---|
| `--dur-1` | 120 ms | Presses, colour |
| `--dur-2` | 200 ms | Hover, stamp landing |
| `--dur-3` | 320 ms | Switches, pen strike, nav compaction, accordion |
| `--dur-4` | 560 ms | Entrances, morphs, menu reveal, Pro rim |
| `--dur-5` | 900 ms | Large reveals |
| `--stagger` | 60 ms | Sibling entrances |
| `--ease-out` | Fast then settle | Entrances |
| `--ease-in-out` | Even | Cross-fades |
| `--ease-spring` | Slight overshoot | Thumbs, nav slip, tab thumb, dialog |

Only `transform` and `opacity` animate, except the dashed strokes that draw lines and rims. Chart cells and the lattice never move.

## 12. Library overrides

The tokens already flatten most of it. These need deleting when a module is adapted.

| Module | Delete | Use instead |
|---|---|---|
| `floating-navbar.md` | `backdrop-filter`, gradient brand tile, panel radial gradients, gradient text | Opaque `--glass`, the mark, flat `.on-ink` panel, solid text |
| `spring-modal.md` | Backdrop blur, gradient button | `--scrim`, flat primary |
| `pricing-plans.md` | Conic border, radial glow, sheen | Rim in 9.7, flat ground |
| `feature-tabs.md` | Radial mock grounds | Real screens on stock |
| `reveal-footer.md` | Radial lights, gradient wordmark, dim gradient | 7.3 |
| `bento-grid.md` | Spotlight, mask, chip blur, gradient text | Edge change in 9.3 |
| `premium-buttons.md` | Gradient fills, sheen, conic variants, glass variant | 9.1 |
| `sticky-showcase.md` | Radial scene grounds, gradient progress | Real screens, 2 px Pip Red bar |
| `kinetic-headline.md` | Gradient highlight | Plain line rise with the mask pad in 4.4 |
| `curtain-split.md` | Door gradient, line art, blur | Flat Key Black doors and the mark |
| `stat-counters.md` | Gradient rule | 1 px `--line` |
| `aurora-hero.md`, `beam-grid-hero.md` | Aurora, beams | Use only the rising-line structure. Hero art is 7.1 |

Library `--surface-light` is the page ground here. Where a module uses it for a raised card, swap in `--surface-raised`.

## 13. Build checks

Run on the built output, in addition to `scripts/check-dist.mjs`.

| Check | Must find |
|---|---|
| `gradient` in CSS | Only `--gradient-brand` in `tokens.css`, which prints one flat ink |
| `backdrop-filter`, `blur(`, `drop-shadow` | None |
| `box-shadow` values | Only `--focus-ring`, `--focus-ring-inset`, `--shadow-*` |
| Hex values outside `tokens.css` | Only the `bg-lattice-*`, `bg-chart-quiet` and `bg-chart-ghost` files, which CSS cannot reach |
| `#7FC8C2`, or any green | None outside the capture images |
| Suit characters in visible text | None. All SVG |
| Device inside `.on-ink` | None |
| `.on-ink` next to `.on-red` at full bleed | None |
| Chart cells against the JSON | 25 raise, 69 call, 68 fold, 7 split |
| 320 px | `scrollWidth` equals the viewport on every page |
| H1 at 320 | Three lines, no line wider than 288 |
| Any text under 12 px | None, including chart labels at every rendered width |
| Font files | Four, about 42 KB, no others |
