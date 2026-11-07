# HandSolved performance QA: speed, layout shift, weight (M5)

Measured 2026-11-01 by performance-optimizer against the built site (`dist/`, served by `astro preview` on :4321 with the real CSP meta tag). Changed builds went to a scratch folder and were served on :4381; that server is stopped, :4321 was never touched. No commits, no deploys.

**Result: every budget in ARCHITECTURE.md section 6 and the M5 pass marks is met, on all three pages at 390x844 and 1440x900, with wide margins. One real defect found and fixed: the hero image on `/gto-hand-review` and `/live-poker-hand-recorder` was lazy, which delayed phone LCP by 0.4 s and 0.7 s. Two attributes, two files.** Everything else was already fast and is left alone.

**These are local lab numbers on one laptop with simulated throttling. They are not field data.** Real phones, real networks, other browsers and real visitors will differ. Treat the figures as a regression gate and a way to find problems, not as a prediction of what users see.

## How it was measured

- Chrome 148.0.7778.168 (headless, `channel: 'chrome'`) driven by Playwright 1.64. A fresh browser context per load, so the cache is always cold.
- Throttle (Chrome DevTools Protocol, same for phone and desktop widths): `Network.emulateNetworkConditions` at 1.6 Mbps down, 750 Kbps up, 150 ms latency; `Emulation.setCPUThrottlingRate` 4. Unthrottled runs are listed separately.
- Viewports: 390x844 at device pixel ratio 3 (touch, mobile emulation) and 1440x900 at ratio 2. Phone interactions are taps, desktop interactions are clicks.
- LCP, CLS (with the element that shifted), long tasks and long animation frames (with forced style and layout time per script) from `PerformanceObserver`. CLS is reported both as the plain sum and as the worst session window, which is what Chrome and the web-vitals library report.
- TBT is the sum of (long task minus 50 ms) after first contentful paint, over load plus 4 s of idle with no scrolling. Lighthouse's exact end point (time to interactive) was not used.
- Scroll: real wheel events (`page.mouse.wheel`, 260 px per 110 ms on phone, 340 px on desktop, about 2,000 to 3,000 px/s) down to the bottom and back to the top. Frame rate is the `requestAnimationFrame` interval, sampled the whole way, with the 4x CPU throttle on.
- Bytes are Resource Timing `transferSize`, which includes response headers (about 0.3 KB per request), so they read slightly above gzip file sizes. "First view" is everything fetched by 4 s after the load event, with no scrolling. "Fully scrolled" is after the down-and-back scroll. The sample-hand pop-up is excluded, except where a wheel-scroll pointer happened to trigger its on-demand chunk (noted below).
- Load metrics are the median of 3 runs (home) or 4 runs (the two changed pages). Scroll, byte and interaction figures are one run each.
- The server on :4321 gzips like a real host, but speaks HTTP/1.1. GitHub Pages speaks HTTP/2, so request-count effects here are, if anything, pessimistic.

## Budgets against measurements

| Budget | Limit | Worst measured | Result |
|---|---|---|---|
| LCP | 2.0 s lab, 2.5 s mark | 1.43 s before the fix (recorder, phone); 0.97 s after. Home 0.62 s phone, 0.71 s desktop. Home with the veil finished: 1.41 s phone, 1.42 s desktop | Pass |
| CLS | 0.05 lab, 0.1 mark | Worst window 0.0064 (desktop, all pages); plain sum 0.0127. Phone worst window 0.0029 | Pass |
| INP | 150 ms lab, 200 ms mark | Worst interaction 96 ms (throttled, desktop home, cold open of the sample hand). Unthrottled worst 72 ms | Pass |
| TBT | under 100 ms | 0 ms. One 67 to 74 ms task, at about 525 ms, before first paint, so not counted | Pass |
| Home first view | 300 KB | 209.5 KB phone, 223.2 KB desktop | Pass |
| Home fully scrolled | 900 KB | 296.6 KB phone, 248.5 KB desktop | Pass |
| Supporting page | 400 KB | Fully scrolled 172.0 to 222.0 KB | Pass |
| Hero images | 120 KB at 2x desktop, 40 KB on phones | Phone hero 30.2 KB (780 px AVIF); largest desktop capture loaded 28.7 KB (1280 px AVIF) | Pass |
| Fonts | 70 KB | 41.3 KB, 4 files (42,292 bytes) | Pass |
| Home HTML, CSS, JS | 30, 30, 11 KB gz (JS total 25) | 24.86, 25.03, 10.30 (19.29 total), as supplied by the owner; my transfer sums (24.7, 26.1, 16.0 KB) include headers | Pass |
| Console errors, failed requests | none | none on any run | Pass |

## Before and after (throttled, cold cache)

The home page was not changed. Its "after" column is a control: it shows the run-to-run and server noise, about 12 ms on LCP.

**Load**

| Page | Viewport | FCP ms | LCP ms (range) | LCP element | CLS on load | TBT | First view KB (requests) |
|---|---|---|---|---|---|---|---|
| `/` | phone | 632 > 620 | 632 > 620 (620-640 > 620-632) | hero subhead text, both | 0 > 0 | 0 > 0 | 209.5 (34) > 209.5 (34) |
| `/gto-hand-review` | phone | 586 > 600 | **1180 > 784** (1176-1192 > 776-792) | hero phone image, both | 0 > 0 | 0 > 0 | 123.1 (26) > 123.1 (26) |
| `/live-poker-hand-recorder` | phone | 578 > 584 | **1428 > 716** (1364-1468 > 688-736) | hero phone image, both | 0 > 0 | 0 > 0 | 185.4 (30) > 185.4 (30) |
| `/` | desktop | 640 > 644 | 712 > 708 (704-724 > 708-724) | hero phone image, both | 0.0001 > 0.0001 | 0 > 0 | 223.2 (35) > 223.2 (35) |
| `/gto-hand-review` | desktop | 592 > 592 | 872 > 926 (748-888 > 916-944) | quiet chart background, both | 0.0001 > 0.0001 | 0 > 0 | 175.4 (29) > 175.5 (29) |
| `/live-poker-hand-recorder` | desktop | 576 > 570 | 900 > 974 (888-924 > 944-980) | quiet chart background, both | 0.0001 > 0.0001 | 0 > 0 | 186.1 (31) > 186.1 (31) |

**Scroll and interaction** (one run each; the two changed pages show a before > after pair, the home pair is a repeat)

| Page | Viewport | Scroll CLS: sum / worst window | Fully scrolled KB (requests) | Scroll frame rate, frames over 25 ms / over 50 ms | Scroll long tasks | Worst interaction ms: open cold / pick answer / open warm | Tap to hand drawn ms |
|---|---|---|---|---|---|---|---|
| `/` | phone | 0.0073 / 0.0022 > 0.0074 / 0.0023 | 296.6 (38) > 296.6 (38) | 59.4 fps, 12 / 0 > 59.3 fps, 14 / 0 | 0 > 0 | 88 / 56 / 72 > 88 / 56 / 72 | 213 > 205 |
| `/gto-hand-review` | phone | 0.0006 / 0.0003 > same | 172.0 (28) > 172.0 (28) | 60 fps, 1 / 0 > 59.9 fps, 2 / 0 | 0 > 0 | 72 / 56 / 56 > 72 / 56 / 56 | 210 > 213 |
| `/live-poker-hand-recorder` | phone | 0.0055 / 0.0028 > 0.0057 / 0.0029 | 221.3 (31) > 221.3 (31) | 59.9 fps, 1 / 0 > 60 fps, 1 / 0 | 0 > 0 | 72 / 56 / 56 > 88 / 56 / 72 | 209 > 207 |
| `/` | desktop | 0.0126 / 0.0064 > same | 248.5 (36) > 248.5 (36) | 60 fps, 1 / 0 > 60 fps, 1 / 0 | 0 > 0 | 88 / 40 / 56 > 96 / 40 / 72 | 197 > 200 |
| `/gto-hand-review` | desktop | 0.0126 / 0.0064 > same | 175.4 (29) > 175.5 (29) | 59.9 fps, 1 / 0 > 60 fps, 1 / 0 | 0 > 0 | 72 / 40 / 40 > 72 / 40 / 56 | 194 > 197 |
| `/live-poker-hand-recorder` | desktop | 0.0127 / 0.0064 > 0.0126 / 0.0064 | 222.0 (32) > 222.0 (32) | 59.9 fps, 1 / 0 > 59.9 fps, 1 / 0 | 0 > 0 | 72 / 40 / 40 > 72 / 40 / 56 | 195 > 192 |

Interaction notes. Worst interaction is the longest event duration (input delay, handlers, wait for the next paint) that the Event Timing API reports, rounded to 8 ms by the browser; an event under 16 ms is not reported. On the home page the dialog box itself is open 53 ms (phone) and 32 ms (desktop) after the first tap. "Tap to hand drawn" is the time from the tap until the hand and its choices are in the pop-up (cold, DOM mutation, not paint): the 7 KB `SampleHandDialog` chunk is fetched on first intent over the 150 ms link. The differences between the before and after interaction columns (for example 72 > 88 ms) are noise on pages whose code did not change.

**Unthrottled home** (the baseline you quoted): LCP 80 ms phone, 72 ms desktop, CLS on load 0 and 0.0001, scroll CLS worst window 0.0022 phone and 0.0064 desktop (sums 0.0072, 0.0127), 59.6 and 59.9 fps, worst interaction 72 ms (phone) and 72 ms (desktop). Same 209.5 and 223.2 KB first view. The desktop CLS matches your 0.0065. My phone figure is higher than your 0.0003 because a real wheel scroll through the pinned story toggles the slim mobile bar (see CLS below). The two supporting pages were not run unthrottled.

## What changed

Two files, one attribute each, both on the prop the site already documents for this ("True only for the LCP image"):

- `src/sections/live-poker-hand-recorder/Hero.astro`: `<PhoneFrame ... eager>`.
- `src/sections/gto-hand-review/Hero.astro`: `eager` on the narrow-screen `<PhoneFrame>` only.

`eager` gives the image `loading="eager"` and `fetchpriority="high"`, which is what ARCHITECTURE.md section 5 prescribes for the LCP image and what the home hero already had.

**Why.** On both pages the hero phone is the LCP element on phones, but it was `loading="lazy"` with no priority. A lazy image is not requested until CSS has landed and layout has run, so the request started at about 560 ms (the home hero, eager, starts at 190 ms). It then shared the 200 KB/s link with three other lazy images and three fonts. Measured request for the hero image, throttled phone: recorder 561 > 179 ms start, finished 1379 > 658 ms; gto 561 > 190 ms start, finished 1142 > 732 ms.

**Effect, throttled.** Phone LCP: gto 1180 > 784 ms (-396), recorder 1428 > 716 ms (-712). The before and after ranges across 4 runs do not overlap. Bytes, request counts, CLS and TBT are unchanged.

**Cost, stated plainly.** Desktop LCP on those two pages rose by about 55 to 75 ms (gto 872 > 926, recorder 900 > 974; the ranges do not overlap, so treat it as real). On desktop the hero phone image is now fetched at high priority at the start and competes with the stylesheets and the chart background (the desktop LCP element) on the simulated 1.6 Mbps link. Desktop LCP is still under 1 s, against a 2.0 s target, and a real desktop link is faster than the throttle used here. On gto the narrow-screen phone is hidden from 768 px; with `eager` it still fetches, but its `1px` size picks the 300 px file that the laptop pair's phone needs anyway, so there are no extra bytes (first view 175.4 > 175.5 KB, same 29 requests). A media-gated preload would avoid the 55 ms but needs head plumbing in `SiteLayout`; not built, because the cost is small. The gto laptop capture stays lazy on purpose: eager would download it on phones, where it is hidden.

`astro build` passes with the change. `scripts/check-dist.mjs` has no rule about `eager` or `lazy`. The motion rules are untouched.

## Fine, measured, left alone

- **Hero image on home.** `loading="eager" fetchpriority="high"` with width and height, requested at 192 ms, 31 KB AVIF. The LCP element on phone is actually the hero subhead text (632 ms, same time as first paint); on desktop it is the hero phone (704 to 724 ms). Nothing to fix.
- **Lazy images are really lazy.** Home on a phone loads 3 below-the-fold images at first view: the three stacked story phones, about 1,000 px under the fold, inside Chrome's 1,250 px lazy margin (about 69 KB). Everything lower (first at 4,150 px of a 17,088 px page) loads only on scroll: image bytes go 98.4 > 176.4 KB. Variants hidden at a breakpoint (desktop capture on phones, the other tab panels) are never fetched: the `desk-insights` capture did not download on the phone run.
- **`sizes` are right.** For every loaded image I compared the real width of the chosen file with the slot width times the pixel ratio: ratios 1.07 to 1.30 on all three pages and both viewports. No phone receives a desktop-sized file; the largest phone file is the 780 px top candidate at 30 to 42 KB.
- **Fonts.** 4 files, 3 families, 41.3 KB, `font-display: swap`, metric-matched fallbacks. Only the display face is preloaded (it lands at 485 ms throttled, before first paint). The two Schibsted Grotesk weights and the mono face are requested after CSS and land at 0.89 to 0.95 s throttled. CLS on load is 0 on phone (one shift of 0.000005) and 0.0001 on desktop, where Chrome attributes it to the nav links and an icon at about 0.97 s, just after the body faces land, so the swap moves the layout by almost nothing. On a first visit the veil is still covering the hero at that moment; on a return visit the swap is visible for about 0.3 s throttled, as a change of letterforms only.
- **Page-load veil.** First visit only, intentional, kept. It does not delay LCP as Chrome measures it (the hero paints under the doors), but it does delay what a visitor sees. Throttled phone: first paint 632 ms, the doors hold until about 787 ms and the hero is fully visible at 1,408 ms (desktop 1,416 ms). Unthrottled: 80 ms and 841 ms. So the visual delay is about 0.78 s after first paint (0.76 s unthrottled), and the veil-adjusted LCP is 1.41 s on the throttled phone. That is inside both the 2.0 s lab target and the 2.5 s mark, so no change. By arithmetic, not measurement on other devices: because the veil is a fixed 0.82 s after first paint, it would only break the 2.0 s target on a device whose first paint is later than about 1.2 s, and the 2.5 s mark beyond about 1.7 s.
- **JS.** 17 small module requests at load (16.0 KB with headers, 10.30 KB gz), one 67 to 74 ms task before first paint, and one 51 ms animation frame at 1.3 s containing an 18 ms script. TBT is 0. Nothing long during scroll, and no script reports forced style or layout time. On the throttled link the "Grade a sample hand" handler is live at about 1.05 s and the first-use chunk arrives on first intent. On a phone run the synthetic pointer passed over buttons during the scroll, so the on-demand `SampleHandDialog` and `EarlyAccessDialog` chunks (9.3 KB) were fetched; that is why phone JS reads 25.2 KB fully scrolled and desktop stays at 16.0 KB.
- **Animation does not force layout on load or scroll.** Every `@keyframes` rule animates only `transform`, `opacity`, `stroke-dashoffset` or `visibility` (31 rules checked). 42 scroll-driven view-timeline animations run on the home page on a phone and cost nothing measurable (no long task or dropped frames during the scroll). The only per-frame scroll script is the footer reveal, which runs only within half a screen of the footer and reads layout before it writes.
- **Frame rate.** Under the 4x CPU throttle: 59.3 to 60 fps, 99th-percentile frame 17.6 ms on desktop and 32 ms on the phone's long home page, longest frame 34 ms, none over 50 ms; 12 of 1,156 phone frames (1 percent) over 25 ms.
- **CSS, HTML.** Five stylesheets on home, all requested at 172 ms and done by 528 ms throttled, so first paint (632 ms) is bound by them plus one layout pass. Within budget; left alone.

## Left alone, with the reason

- **CLS from two size transitions (largest contributors, both tiny).** The desktop nav bar morphs when the page scrolls past 16 px (`inline-size`, `block-size`, `padding-inline`, 300 ms): 0.0064 in the window going down and 0.0062 in a second window coming back up, 0.0126 in total. On phones the mobile CTA bar changes between its full and slim height (75 and 56 px) through `padding` and the button's `min-block-size` as the pinned story enters and leaves: 0.0067 of the home page's 0.0073 (the nav brand is the other 0.0006). Both are designed transitions, both sit more than 10 times under the 0.1 mark and about 8 times under the 0.05 lab target, and a version without layout animation would change how the bar and the nav look. Not fixed. Other layout-property transitions exist in the CSS (the nav hover pill and the tab thumb animate `inline-size`, the FAQ animates `grid-template-rows`); they run only on hover or click and I did not exercise them, so they have no measurements here.
- **One screenshot downloaded twice on phones.** Where the same capture sits in two slots with different `sizes` (home: `phone-coach-decision` in the story and again lower down; recorder: `phone-recorder` in the hero and the steps), a phone at ratio 3 fetches two widths (600 and 780 px, a 32 KB and a 41.6 KB file; on the recorder 17.3 and 22.5 KB). Making both slots pick the larger file would, going by the file sizes (an estimate, not a build), save 18 to 32 KB later in the page but add about 15 to 20 KB to the first view (the other story images would also step up). Neither is near a budget; not changed. Desktop and 2.6-ratio phones already share one file.
- **Body font 400 is not preloaded.** Its swap happens at about 0.9 s throttled, under the veil on a first visit, and shifts nothing. A preload would put another 13 KB on the same link as the stylesheets (roughly 65 ms of pipe time, an estimate), for no measured gain.
- **Local server details.** Cache-Control here is `no-cache`; GitHub Pages sends `max-age=600`. Only cold loads were measured. HTTP/1.1 here against HTTP/2 there (above).

## Not measured

Real devices, the real host, WebKit, Firefox, repeat visits with a warm cache, the Lighthouse score (its exact TBT window and simulated throttling were not used), field data (CrUX or RUM), real touch gestures (taps here are CDP-synthesised), GPU or memory limits of a low-end phone (the CPU multiplier does not model them), and the two supporting pages without throttling. Single-run figures (scroll, interactions, bytes) carry run-to-run noise; load figures are medians as stated.

## Re-run

The harness is a scratch script, not part of the repo (`/private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/perf/measure.mjs`, with `summ.py`, `gen.py` and `imgcheck.mjs` beside it, and the raw JSON of every run): a Playwright script using the settings above, run against `http://127.0.0.1:4321` after the main session rebuilds `dist/`. The pass for the two changed pages should show phone LCP near 0.7 to 0.8 s and an unchanged first-view weight; if the hero image lines show `loading="lazy"` again in `dist/gto-hand-review.html` or `dist/live-poker-hand-recorder.html`, the fix has been lost.
