# Security and claims scan

Date 2026-11-01. Role: security-reviewer, run from `.claude/agents/security-reviewer.md` because the agent bundle was not registered. Read-only: no source, dist or config file was changed and `dist/` was not rebuilt. The only files created are this report and scratch files in the session scratchpad.

Scope: `src/`, `dist/` (6 HTML pages) and the running site at http://127.0.0.1:4321. The server's `/` is byte-identical to `dist/index.html` (SHA-256 `cf98650da4e422d66f591a09a998caa04c6ee8af60e2bbc635534581ef2b95a4`), so the runtime results describe the build.

## Result

24 of 24 requested checks pass. 4 hygiene findings fail, all Low (F1 to F4). 6 Info notes (N1 to N6). No Critical, High or Medium finding.

Nothing leaves the browser, nothing typed is stored, and no old name, competitor name, secret or personal data ships. The weak spot is app-build leftovers: a build stamp readable in two screenshots, seven unused app screens, and builder notes in shipped markup and JS.

## What I ran

- `grep -rIniE` over `src/` and `dist/` for the old name and the 8 competitor names (spaced and hyphenated variants too), `find` for file names, and `strings` over every png, webp, avif, ico and woff2. Positive control: 63 `HandSolved` matches in the same trees.
- Opened all 17 images in `src/assets/screens/` and the 4 images in `public/og/` with Read. PNG chunk check with sharp for EXIF, XMP and text.
- Static greps for network and storage APIs, DOM sinks, SVG active content, hosts, secrets and personal data. `npm audit --omit=dev`, `npm audit`, `npm ls fast-uri`, lockfile integrity check.
- Python over all 6 dist pages: CSP parse, SHA-256 of every inline script and style body, JSON-LD dump, visible-text extraction with claim-word regexes, price-context check.
- Playwright (Chrome channel) against the running site, with hooks installed before any page script on Storage set/remove/clear, fetch, XHR, sendBeacon, WebSocket, EventSource, serviceWorker.register, indexedDB.open, caches.open, document.cookie and `securitypolicyviolation`. Flow: home load, sample dialog (picked Fold, verdict view), verdict "Get early access", early dialog with invalid input, typo hint, then `qa-scan@example.com` submit and success step, close, pricing "Pro" button on Monthly and Yearly, BB/$ toggle both ways, reload, the other 5 pages, then CSP enforcement probes. Script `scratchpad/scan-runtime.cjs`, raw output `scratchpad/scan/runtime.json`. Two earlier launches failed before the browser started (missing output folder, no `timeout` command on macOS); the third ran clean.

## Checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | `onrender` and `pokerwiz` in any case, in `src/` and `dist/`: text, file names, alt, meta, JSON-LD, SVG | PASS | 0 text matches, 0 file names, 0 binary-string matches. `scripts/check-dist.mjs:114-117` enforces the same rule in the build. |
| 2 | Old name inside screenshots | PASS | All 17 app screens and 4 OG images viewed. The app header reads HandSolved on every screen that has a header (`phone-practice` has none). Hero: `phone-coach-score`. Story: `phone-recorder`, `phone-coach-decision`, `phone-practice`. Also toolbox (`phone-insights`, `phone-goals`, `phone-history`, `desk-insights`), review page (`desk-coach-top`, `phone-coach-score`, `phone-coach-decision`) and recorder page (`phone-recorder`, `phone-review`, `phone-history`). No old or competitor name in any image. No EXIF, XMP or text chunks. |
| 3 | Competitor names (GTO Wizard, Upswing, PokerCoaching, Run It Once, Regroup, Poker Bankroll Tracker, Poker Analytics, Pokerbase) | PASS | 0 hits in text, file names and binary strings of `src/` and `dist/`. They exist only in `docs/` and `showcase/`. |
| 4 | `fetch(`, XMLHttpRequest, sendBeacon, WebSocket, EventSource in code | PASS | 0 files in `src/` and in dist JS/HTML. Also 0 for importScripts, Worker, serviceWorker, indexedDB, document.cookie, postMessage, eval(, new Function, document.write. |
| 5 | Form action | PASS | One form, `<form class="ea-form" method="dialog" novalidate>` at `src/components/EarlyAccessDialog/EarlyAccessDialog.astro:18`. No `action`; live DOM reads `action: null`. CSP `form-action 'none'`. |
| 6 | Typed input is never stored | PASS | `EarlyAccessDialog.ts`: value read at :87, shown with `textContent` at :90, `submitSignup` at :10 is an empty function, field and address node cleared on close at :115-124. Runtime after submit and after close: no `qa-scan` in localStorage, sessionStorage, cookies, IndexedDB, CacheStorage, URL or hash; input value and address text both `""` after close. |
| 7 | Only allowed storage, and the actual values | PASS | Hooks recorded exactly 3 writes in the whole session: sessionStorage `hs-veil` = `1` (first home load, `head-guard.js:14`); localStorage `hs-unit` = `usd`, then `bb` (only on pressing the BB/$ switch, `UnitSwitch.ts:55`, value forced to `usd` or `bb` at :66). 0 cookies, 0 IndexedDB, 0 CacheStorage, 0 service workers. 0 writes on the other 5 pages. After reload: `hs-unit` = `bb`, `hs-veil` = `1`. |
| 8 | Third-party hosts in any URL, font, image or script | PASS | All 205 runtime requests went to `127.0.0.1:4321`. Hosts in dist text: `www.w3.org` (SVG namespace), `schema.org` (JSON-LD context), `www.sitemaps.org` (sitemap xmlns), `handsolved.com` (canonical, OG, sitemap). None is fetched. Fonts are self-hosted woff2. |
| 9 | External `<a href>` | PASS | 28 anchors in the live home DOM, all internal (`#...` or `/...`). 0 `http(s)://`, `mailto:`, `tel:` hrefs in dist. 0 iframe, object, embed. |
| 10 | Secrets, keys, tokens | PASS | Regex for api key, secret, token, password, bearer, private key, AKIA, ghp_, sk-, xox, AIza, JWT and long base64 over `src`, `dist`, `scripts`, `public`, `.github` and config. Only hits are CSS "design tokens" comments. No `.env` file. |
| 11 | Personal data (owner name, email, local paths) | PASS | 0 hits for the owner's name, `/Users/`, a personal address or phone. The only email-shaped string is the placeholder `name@example.com` (13 times). `validate.ts:7` lists gmail.com and others only to suggest typo fixes. No image metadata. |
| 12 | Content from `docs/`, `showcase/`, `.claude/` in `dist/`, including COPY.md Price notes math | PASS | No such paths, no `.md`, `tasks.json`, `.map` or `.env` files in dist. Searched dist for the Price notes anchor math ($49, $39, $468, $408, 34.30, 27.30, 30.6, 30.8, 0.70, PokerNews, Starter, Ultra, early-bird, "30% below"): 0 hits in visible text. Raw hits explained: `$49` x4 in `SampleHandDialog.CnQZh1Ok.js` is the sample hand line "Raise to 49 bb ($49)"; `anchor` is CSS/SVG attribute text. |
| 13 | CSP present in `dist/*.html` | PASS | 6 of 6 pages carry one `<meta http-equiv="content-security-policy">`: `default-src 'none'`, `img-src 'self'`, `font-src 'self'`, `manifest-src 'self'`, `connect-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `script-src 'self'` + 6 hashes, `style-src 'self'` + 4 hashes. |
| 14 | Every inline script hash matches | PASS | The only executable inline script is the 962-byte head guard; `sha256-dO0gqgBLlyrgxNTasS5RhtiH/c4QRMT4JrXbYWyN1ZA=` is in `script-src` on 6 of 6 pages. The JSON-LD blocks (home 791 bytes, review 266, recorder 284) are `application/ld+json` data, outside `script-src`; 0 violations. The 3 inline `<style>` blocks match 3 `style-src` hashes. See N1 for 5 extra hashes. |
| 15 | `style=` attributes and `data:` URIs | PASS | dist HTML: 0 `style=`, 0 `data:`, 0 `on*=` handlers, 0 `javascript:`. The live DOM has 18 `style` attributes written by script through CSSOM, which CSP allows; 0 violations. |
| 16 | Claims: promises of winning | PASS | Searched guarantee, win more, crush, beat the games, risk-free, never lose, make money, proven and similar: 0 hits. `terms.html`: "Nothing on this site promises winnings, and poker carries a risk of loss." Profit and win-rate figures appear only inside labelled Sample data. |
| 17 | Claims: real-money implications | PASS | `terms.html`: "This site has no real-money play, no games of chance and no wagering." and a "No gambling here" section. Dollar view states its $1/$2 assumption. No payment fields, nothing for sale. |
| 18 | Claims: invented proof | PASS | 0 testimonials, user, customer or member counts, press, awards, product ratings or "trusted by". The only star values ("4.8 stars", "1.5 stars", "3.4 stars") are a player's ratings of sample hands, a product feature inside the Sample data section. JSON-LD has no Offer, Review or AggregateRating (`json-ld.ts:2` forbids them). |
| 19 | Concept note in the footer and on the early-access success step | PASS | "Concept site, illustrative prices, nothing is collected or sent." is inside `<footer data-site-footer>` on 6 of 6 pages (also the mobile menu; 3 instances per page). Runtime: visible in the success step after the test submit (`scratchpad/scan/early-success.png`). |
| 20 | Illustrative prices carry the Concept pricing label | PASS | Price figures exist only in `#pricing` (label `Pricing.astro:48`, lead :50, footnote :131) and in dialog chips ending "(concept pricing)" (`EarlyAccessDialog.astro:20-22`; runtime chips read "Plan: Pro, $34 a month (concept pricing)" and "Plan: Pro, $27 a month, billed yearly (concept pricing)"). 0 price figures outside those, in meta, or in JSON-LD. 27 x 12 = 324 and 34 x 12 - 324 = 84 check out. |
| 21 | `npm audit --omit=dev` | PASS | "found 0 vulnerabilities". Shipped dependencies: astro 7.4.0 and sharp 0.35.5, both build-time only; dist holds no `node_modules` code. Lockfile: 337 packages, all with integrity, all from registry.npmjs.org. |
| 22 | Dev dependencies that matter here | PASS | Full `npm audit`: 1 moderate (`fast-uri`), build-time only and not shipped. See N2. |
| 23 | Runtime requests: home, both dialogs, early-access submit | PASS | 205 requests, all `GET`, all `127.0.0.1:4321`, 0 with a body, 0 failed, 0 WebSocket. Types: 8 document, 33 stylesheet, 89 script, 32 font, 35 image, 8 other (icon.svg). Statuses: 89 x 200, 114 x 304, 2 x 404 (the deliberate `/does-not-exist` page and a probe image). Detail below. |
| 24 | Runtime CSP violations | PASS | 0 organic violations in 8 documents (home with both dialogs and the unit toggle, home reload, review, recorder, privacy, terms, 404). Console: only the expected 404. 5 deliberate probes all blocked. Detail below. |

Hygiene findings, from the same scan:

| # | Check | Result | Evidence |
|---|---|---|---|
| H1 | Build stamp in shipped screenshots | FAIL (Low) | F1 |
| H2 | Only used screens ship | FAIL (Low) | F2 |
| H3 | Builder comments absent from HTML | FAIL (Low) | F3 |
| H4 | Builder notes absent from shipped JS | FAIL (Low) | F4 |

Total: 24 pass, 4 fail.

## Runtime detail

Requests by step (all GET, all same origin):

| Step | Requests | What |
|---|---|---|
| Home load | 34 | document, 5 CSS, 13 page scripts and 3 shared modules, 4 fonts, 4 AVIF phone screens, 3 background SVGs, `icon.svg` |
| Open sample dialog, pick Fold | 1 | `SampleHandDialog.CnQZh1Ok.js` (same-origin chunk) |
| Open early dialog from the verdict | 1 | `EarlyAccessDialog.CzZjcYV4.js` |
| Invalid input, typo hint, valid submit, success step, close | 0 | nothing is sent on submit |
| Scroll to pricing | 1 | lazy `desk-insights...avif` |
| BB/$ toggle both ways | 0 | |
| Reload, review, recorder, privacy, terms, 404, probes | 37, 28, 31, 18, 18, 17, 19 | same kinds of files, all same origin |

Storage keys written (session total): `sessionStorage hs-veil=1`, `localStorage hs-unit=usd`, `localStorage hs-unit=bb`. Nothing else.

Early-access form behaviour: `not-an-email` shows "Add an @, like name@example.com." and stays on the form; `qa@gmial.com` shows "Did you mean qa@gmail.com?"; `qa-scan@example.com` shows "That address works", the checked address, and the concept note; closing the box empties the field and the address line.

CSP enforcement probes, run on `/privacy` and kept apart from the organic results: `fetch('https://example.com/')` blocked by `connect-src`; injected `<img onerror>` blocked by `script-src-attr`; injected inline `<script>` blocked by `script-src-elem`; form POST to `https://example.com/collect` blocked by `form-action`, page stayed on site; `eval` through a string timer blocked by `script-src` (blocked URI `eval`). My first `eval` probe, run inside `page.evaluate`, reported "allowed". That was a test artifact (the Chrome DevTools protocol lifts the eval check for code it evaluates), not a site defect; the string-timer rerun is the valid result.

## Findings

### F1 Low: app build stamp readable in the shipped desktop screenshots

- Where: `src/assets/screens/desk-insights.png` and `src/assets/screens/desk-coach-top.png`, both used on the site. The sidebar footer prints "v0.5.0 . 1e61f62" and "Updated Oct 17, 2026", at about x 50 to 310, y 1660 to 1745 in the 2880 x 1800 master. The same stamp is on the unused `desk-home.png` and `desk-highlights.png`.
- Evidence: shipped at 2240 x 1400 in `dist/_astro/desk-insights.DBH3J-mD_15dMs2.avif` and `dist/_astro/desk-coach-top.BvIkWzk3_1O4Cz6.avif`, where it reads clearly (crop: `scratchpad/scan/stamp-crop-2240.png`). At on-page size (about 560 px wide) it is not legible.
- Impact: publishes the private app's build number and git short hash. No credential.
- Fix: in each desk PNG, paint over that box with the adjacent sidebar colour (sample the pixel at x 20, y 1700), keep the file names, rebuild, then crop the 2240 variant again to confirm.

### F2 Low: seven unused app screens are published as full-size masters

- Where: `src/components/Screenshot/Screenshot.astro:32`, `import.meta.glob('../../assets/screens/*.png', { eager: true, import: 'default' })`. Astro emits every PNG in the folder, so `dist/_astro/` holds, unreferenced by any page, CSS or JS: `desk-highlights.qjDFItJ0.png`, `desk-home.BxGmTXGe.png`, `desk-practice.BhUyV52c.png`, `phone-bankroll.Cis3Tggb.png`, `phone-hands.BXhA5ycW.png`, `phone-highlights.CpJOG_0N.png`, `phone-home.CyDRhsDq.png` (2,617,065 bytes).
- Evidence: I viewed all seven. No old or competitor name, but they are unlabelled app screens with winning figures (+733 bb, "Win $2,000 by year end", 61% winning sessions) and the F1 stamp on two of them.
- Impact: unlabelled sample numbers and build info reachable by direct URL; 2.6 MB of dead weight.
- Fix: move the seven PNGs out of `src/assets/screens/` (for example to `showcase/app/unused/`) and delete their names from `ScreenName` and `screens` in `src/data/screens.ts:5-22`. Or narrow the glob at `Screenshot.astro:32` to the used names. Verify `ls dist/_astro/*.png` lists none.

### F3 Low: builder comments ship as HTML comments on every page

- Where: `src/components/SampleHandDialog/SampleHandDialog.astro:68` and `src/components/EarlyAccessDialog/EarlyAccessDialog.astro:17`. Both use `<!-- ... -->`, which Astro keeps. All 6 dist pages carry "Verdict navigation, two variants so Tab order follows the visual order. Dialog.ts opens pop-up 2 from the data-dialog-open buttons." and "method="dialog": a submit before the script arrives closes the box and never navigates. The script always prevents it. No action, nothing is sent."
- Impact: internal notes and a source file name in public markup. No secret.
- Fix: change both to `{/* ... */}`, the form `Pricing.astro` already uses. Verify `grep -c '<!--' dist/*.html` is 0 for every page.

### F4 Low: internal builder notes in the public JS bundle

- Where: `src/data/demo-spots.json:2-3` (`note`, `capturedAt`), imported whole at `src/components/SampleHandDialog/hands.ts:2` and read at :88. `dist/_astro/SampleHandDialog.CnQZh1Ok.js` therefore contains "Real output of the app engine (v0.5.0) on its seed hands, one solver run each...". Nothing displays it. (`range-chart.json:1` and `bankroll.json:2` carry similar notes, "cash-100.pfc" and "a throwaway copy"; neither string is in dist.)
- Impact: reveals the app engine version and internal vocabulary. No secret.
- Fix: at `hands.ts:2` use `import { spots as rawSpots } from '../../data/demo-spots.json';` and at :88 `const spots = rawSpots as unknown as Spot[];` so Vite drops the unused keys. Or delete `note` and `capturedAt` from the JSON and keep them in `docs/`. Verify `grep -c "app engine" dist/_astro/SampleHandDialog.*.js` is 0.

## Info notes

- N1, CSP hygiene. 5 of the 6 `script-src` hashes (`xIb/Pa7F...`, `1BvDVWLr...`, `kmZE/W8I...`, `Y8t0ntte...`, `0O7iB6zr...`) match no inline script and no file in dist, including trimmed variants. Likely leftovers for scripts Astro later emitted as files (my inference, not verified). The `style-src` hash `47DEQpj8...` is the SHA-256 of an empty string. Impact none found, policy slightly wider than needed. Separately, Astro places the meta CSP after the head guard and the three `<style>` blocks, so those run before the policy is parsed (same origin or hash-listed, no exposure), and `frame-ancestors` cannot be set from a meta tag; GitHub Pages sets no custom headers, so framing cannot be blocked. Optional fix: extend rule 5 in `scripts/check-dist.mjs` (about lines 230-240) to fail on a `script-src` hash that matches no inline script on that page.
- N2, dev-only advisory. `npm audit` reports 1 moderate: `fast-uri` 3.0.0 to 3.1.8 (4 advisories: scheme spoofing, path equivalence, host confusion, scheme injection) through `@astrojs/check` > `@astrojs/language-server` > `volar-service-yaml` > `yaml-language-server` > `ajv` > `fast-uri@3.1.8`. It runs only in `astro check` on the build machine, on the project's own files, and is absent from dist; `--omit=dev` is clean. Fix when convenient: `npm audit fix` (lockfile only), once a patched release is 14 days old under `.npmrc` `min-release-age=14`. `npm ls --omit=dev` also lists `@img/sharp-wasm32@0.35.5` as extraneous, an unused optional platform package; harmless.
- N3, CI hardening. `.github/workflows/deploy-pages.yml:20,21,27,28,40` pin actions by tag (`checkout@v7`, `setup-node@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`), not by commit SHA. Trigger is manual only and permissions are the Pages minimum, which is good. Fix: pin each `uses:` to a full commit SHA with the tag in a comment.
- N4, claims and metadata consistency (owner's call). (a) The home, review and recorder meta descriptions, og:description and the JSON-LD `WebSite.description` describe HandSolved as a live product with no "concept" wording (`src/data/pages.ts:41,52,63`; only privacy and terms say it). The concept note shows only after a visitor lands. (b) `src/components/SeoHead/json-ld.ts:23-30` declares an `Organization` named HandSolved with a logo, while COPY.md says no company stands behind the site. Fix: add "Concept site." to the three descriptions (they are 142, 144 and 149 of the 155 limit, so trim first) and drop the Organization node (`json-ld.ts:23-30`) and the `publisher` line (`json-ld.ts:21`); or record both as accepted in `docs/site/SEO.md`.
- N5, repo exposure (could not verify). The folder is not a git repo, so I cannot see where it is published. GitHub Pages on a free plan needs a public repo. If it is public, `docs/` (competitor names and the Price notes math from `docs/site/COPY.md:827`), `showcase/inspiration/` (170 competitor captures), `showcase/app/raw` and `.claude/agents/` are public even though dist is clean. Fix: confirm visibility; if public, publish from a repo that holds only the site and `dist/`.
- N6, build checks. `scripts/check-dist.mjs` covers the old name (:114-117), off-origin loads (:135, :221), `data:` URIs (:216) and CSP hash coverage (:230-240). It has no competitor-name rule, no HTML-comment rule and no stray-PNG rule, so it cannot catch F2 or F3 (I did not run `npm run verify`; dist was already built). Fix: after line 117 add a `COMPETITORS` regex (`/gto[ -]?wizard|upswing|poker[ -]?coaching|run[ -]?it[ -]?once|\bregroup\b|poker[ -]?bankroll[ -]?tracker|poker[ -]?analytics|pokerbase/i`) tested against file names and contents with the same `fail(...)` call, and fail on `<!--` in dist HTML and on any `dist/_astro/*.png`.

## Notes on false positives

- `$49` in the sample dialog JS is the hand 2 line "Raise to 49 bb ($49)", not competitor math.
- `anchor` in dist is CSS/SVG attribute text.
- `innerHTML` in `SampleHandDialog.ts:53,68,131` is fed only by static hand data and a unit value forced to `bb` or `usd`; no typed input reaches a sink. Keep it so. `json-ld.ts:serialize` escapes `<`, so the JSON-LD block cannot close its own script tag.
