# HandSolved site: shared components

Owner: `frontend-builder`. Written 2026-11-01. What section builders may rely on: props, hooks and one example each. Specs stay in `DESIGN.md` (look), `UX.md` (states) and `COPY.md` (words). Rules for all of it: tokens only, no `style=` and no `<style>` in inline SVG (CSP), no inline handlers, one `<h1>` per page. Every prop below is typed in the component's own `Props`, so `npm run verify` catches a wrong one.

## 1. The page shell (SiteLayout prints these; a page never places them)

`<SiteLayout page={pages.home} bare?>` prints the head and fonts, the skip link, `Navbar`, `<main id="main">` as the reveal sheet, `SiteFooter`, `MobileCtaBar`, both pop-ups and the one dialog script. `bare` defaults to true for `/privacy`, `/terms` and `/404`: no closing band, no mobile bar. Slots `navbar` and `footer` exist as an escape hatch only.

What your section must provide for the shell to work:

| Need | Why |
|---|---|
| The hero button is `<CtaButton dialog="dlg-sample" cta="hero" />` (home and the two product pages) | The header button is outline while it is on screen and turns primary once it leaves; the mobile bar waits for it; a pop-up gives focus back to it if its opener is gone |
| Section ids `#how` and `#pricing` | The header marks the one in view with `aria-current="true"` |
| `data-hides-mobile-bar` on a pinned story's root (`#how` and `#steps` are found without it) | The mobile bar goes slim (a 44 px button, `data-slim`) while the story crosses the middle of the screen, and leaves only while a `data-cta="story"` button is on screen. It also leaves while `#pricing` is 40% in view |
| **Do not place `<ClosingBand />` in a page** | `SiteFooter` prints it inside the card back. In a page it prints nothing and warns at build. `index.astro` still has one: remove it |
| No `overflow: hidden` or `auto` on an ancestor of a sticky element, and do not clip the top of a device frame | The sheet uses `overflow: clip`, which is safe. The Sample data chip hangs 12 px above its frame |

`Navbar` (`path`, `heroCta`), `MobileCtaBar`, `SiteFooter` (`closingBand`, `home`) and `ClosingBand` take props only from `SiteLayout`.

## 2. Buttons and links

**`CtaButton`** (`components/CtaButton`): a `<button>` that opens a pop-up, or an `<a>` drawn as a button. The `.btn`, `.btn--primary|secondary`, `.btn--sm|md|lg` and `.btn--full` classes are global, and `.text-link` too.

| Prop | Meaning |
|---|---|
| `dialog` | `"dlg-sample"` (pop-up 1) or `"dlg-early"` (pop-up 2). Prints `data-dialog-open` |
| `href` | A link target, when there is no `dialog` |
| `cta` | Required. The `data-cta` value: `hero`, `header`, `story`, `numbers`, `closing`, `mobile-bar`, `menu`, `pricing-free`, `pricing-pro` |
| `plan` | Pop-up 2 only: `"free"`, `"pro"` or `"pro-yearly"`. Printed as `data-plan`; the pop-up reads it |
| `label` | Default: "Grade a sample hand" for `dlg-sample`, "Get early access" for `dlg-early`. Required for a link |
| `variant`, `size`, `full`, `class` | `primary` or `secondary`; `sm` 44, `md` 48, `lg` 56 px; full width |
| `fallback` | Print the `<noscript>` "Read a worked example" link. Default: true for `dlg-sample` only |

Without script a pop-up button is hidden (`html:not([data-js])`) and its noscript link shows. Colours follow the ground scope (`.on-ink`, `.on-red`, `.on-paper`), so write nothing per section.

```astro
<CtaButton dialog="dlg-sample" cta="hero" size="lg" />
<CtaButton dialog="dlg-early" cta="pricing-pro" plan="pro" full />
```

**`TextLink`**: `<TextLink href="#how" cta?>See how it works</TextLink>`, with the arrow icon (`arrow={false}` to drop it). **`Slip`**: `<Slip>Sample data</Slip>`, or `class="slip"` by hand.

## 3. Pop-ups

**`Dialog`** (`components/Dialog`) is the shell both pop-ups are built on. `<Dialog id size labelledby? sheet? closeButton?>` with slots `header`, default (body, scrolls) and `footer` (optional footnote). `size` is `"sample"` (880 px) or `"early"` (440 px). Under 768 px it is a bottom sheet (`sheet` is `"full"` for sample, `"content"` for early). Put `id="<dialog id>-title"` on the title, and `tabindex="-1" autofocus` on the heading that should take focus. `.dialog__pad` is a padding helper. Anything with `data-dialog-close` closes it.

`Dialog.ts` is the only listener, loaded by `SiteLayout`. Triggers carry `data-dialog-open="<id>"`. It opens at once, closes on Esc, the close button, a backdrop click (768 and up) or a sheet drag (below), and returns focus to the page element that first opened a dialog (the hero button if that is gone). Opening a dialog from inside another closes the first.

Contract with `SampleHandDialog.ts` and `EarlyAccessDialog.ts`, loaded on first intent (pointer over, focus or touch on a trigger) or on the first open:

```ts
export function mount(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void  // called once per dialog
```

`trigger` is the button that opened it. Every later open fires `dialog:open` on the dialog (`detail.trigger`; read `trigger.dataset.plan`), every close fires `dialog:close`. `currentTrigger(dialog)` is exported from `Dialog.ts`. `dialog.dataset.module` is `loading`, `ready` or `error`.

## 4. Images and devices

**`Screenshot`** wraps `<Picture>` (AVIF and WebP only, no PNG ships). `<Screenshot name="desk-insights" eager? sizes? alt? class? />`. `name` is a file in `src/assets/screens/` and alt text comes from `src/data/screens.ts` (word for word from `COPY.md`). A screen with no alt there needs `alt="..."`, or the build stops. `eager` only for the LCP image (`loading="eager" fetchpriority="high"`); everything else is lazy. The wrapper holds the aspect ratio on a solid `--device-ink` placeholder, so nothing shifts; a failed file shows its alt on it. `desk-coach-decision.png` is not in the project, on purpose.

**`PhoneFrame`** `<PhoneFrame screen="phone-coach-score" eager? sizes? alt? chip? class? />` and **`LaptopFrame`** `<LaptopFrame screen="desk-coach-top" ... />` put the capture in the flat frame (`frame-phone.svg`, `frame-laptop.svg`) with the Sample data chip hanging on the top edge. Size is the frame's outer width, set in your own CSS with `--device-w` (default `--phone-w-panel`, `--laptop-w-panel`; tokens `--phone-w-hero`, `--phone-w-story`, `--phone-w-band`, `--laptop-w-hero` exist) and pass a matching `sizes` string.

```astro
<PhoneFrame screen="phone-coach-score" eager class="hero__phone" sizes="(min-width: 1024px) 294px, 197px" />
<LaptopFrame screen="desk-coach-top" class="hero__laptop"><PhoneFrame slot="pair" screen="phone-coach-score" /></LaptopFrame>
```

```css
.hero__phone { --device-w: var(--phone-w-hero); }
```

With the `pair` slot, `--device-w` is the width of laptop and phone together (phone 0.26 of the lid, overlapping it, bottoms aligned, ground keyline from `--device-ground`, default Card Stock).

## 5. Numbers

**`Amount`** prints one live number. `<Amount bb={733} signed />` gives `+733 bb`, and `+$1,466` after the switch. Props: `bb` (the only figure), `signed`, `usdPerBb` (default 2; a $0.50/$1 hand uses 1), `bbSuffix` (default `" bb"`), `usdSuffix`, `usdDecimals` (`0`, `2`, `"auto"`: cents only under $10, or `"exact"`: cents whenever the figure has them, at any size, as the sample hand shows), `bbDecimals` (`1` by default; `0` for whole big blinds, as the sample hand shows pots). The pop-up's `money()` calls the same `formatAmount`, so there is one implementation; `src/scripts/format-check.ts` checks it against the demo spots at build. Use it for every amount; prices are always dollars and never go through it. COPY.md rates: `<Amount bb={15.7} bbSuffix=" bb/100" usdSuffix="/100 hands" usdDecimals={2} />` gives `$31.40/100 hands`. Rounding is half up, the minus is U+2212.

**`UnitSwitch`**: `<UnitSwitch compact? hideLabel? />`, any number of them. `UnitSwitch.ts` sets `<html data-unit>` (`bb` or `usd`), saves it in local storage (`hs-unit`), rewrites every `[data-bb]` and fires `unit:change` on `document`. `formatAmount(bb, unit, options)` is exported from `scripts/format-amount.ts` for scripts that build text.

**`Counter`**: `<Counter value={14} label="stack depths" note? prefix? suffix? as="li"? />`. The real number is in the HTML. With script, digits roll once as the counter passes 75% down the screen; under reduced motion, or if it is already on screen when the script runs, there are no wheels. `data-counter` works on any block holding a `.num__v` too (the dashboard tiles).

## 6. Small ones

| Component | Use |
|---|---|
| `Breadcrumbs` | `<Breadcrumbs trail={page.breadcrumb ?? []} />`. Last item is plain text with `aria-current="page"` |
| `ConceptNote` | `<ConceptNote />`, the one-line note. Takes its colour from the ground scope |
| `Icon` | `<Icon name="check" size={16} />` inlines `icon-check.svg` (`currentColor`, `aria-hidden`). Sizes 12, 14, 16, 20, 24, 32. For a logo, frame or art file use `svgFile(name)` from `components/Icon/svg-files` |

## 7. Hooks left for the motion task

Functional behaviour is built; these are the names `motion.css` can attach to (they follow `MOTION.md`).

| Part | Hook |
|---|---|
| Header | `.site-header[data-scrolled]` (set by a 1 px sentinel, `.nav-sentinel`), `.nav__pill` with `--x` and `--w`, `.btn--primary`/`.btn--secondary` swapped on `.nav__cta` |
| Mobile menu | `.nav__menu[data-state="open"]` with `--mx` and `--my` (circle origin); the circle reveal and the link rise are already in `Navbar.css` |
| Mobile bar | `.mobile-cta[data-visible]`, `inert` while hidden |
| Footer | `--reveal-footer-p` on `.site-footer` (1 with no script), `.reveal-footer--flow`, `.cardback__stage`, `.cardback__dim`, `.medallion` (`art-medallion.svg` is already turned 45 degrees: scale it, never rotate it) with `.mark-cell` |
| Dialog | `.dialog[data-state="open"]`, `--ox` and `--oy`, `--drag-p`, `[data-dragging]` |
| Counter | `.count`, `.count__w` with `--d` (digit) and `--i` (position) |
| Numbers | `.num`, `.num__v`, `data-prev`, `.is-roll` (restarted on each switch) |
| Devices | `.device[data-tilt]` with `--tilt-x` and `--tilt-y` (`.frame-body` is inside the SVG) |

## 8. Not done here

`public/og/*.png` were drawn before the font files existed: rerun `node scripts/build-og.mjs` once.
