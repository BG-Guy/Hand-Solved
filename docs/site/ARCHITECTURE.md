# HandSolved site: architecture

Owner: `architect` (T9), 2026-11-01. Agents build from this file. It wins on paths, settings and budgets; `SEO.md` wins on SEO content and `UX.md` on structure. "Verified" means I built a scratch proof of this config and loaded it in Chrome and WebKit. The proof is not in this repo, and Firefox was not available, so QA must test it by hand.

## 1. Stack

**Astro 7.4.0, static output, no UI framework. Plain HTML and CSS, small vanilla TypeScript modules. Recommended host: GitHub Pages (nothing is deployed).**

| Tool | Version | Why |
|---|---|---|
| Astro | 7.4.0 | One HTML file per URL and no JavaScript by default, with image optimization, self-hosted fonts and CSP hashes built in. It runs on Vite, so the owner's Vite habits carry over, and library patterns move in as they are. |
| sharp | 0.35.5 | The encoder behind Astro's `<Picture>`: AVIF and WebP. |
| TypeScript, @astrojs/check | 6.0.3, 0.9.10 | Type-check `.astro` and `.ts`. Verified: 0 errors with Astro 7.4.0. TypeScript 7.x falls outside the checker's peer range. T24 runs `typescript-reviewer`, not `react-reviewer`. |
| svgo | 4.1.0 | Cleans SVG files when they are added. |
| Node | 24.22.0 in `.nvmrc` | Build only; no Node runs in production. Astro 7.4.0 needs 22.22.0 or later. |

Vite 8.3.4 and Lightning CSS 1.33.0 come with Astro; do not add them directly. `e2e-runner` adds `@playwright/test` 1.64.1 in T31. `.npmrc` sets `save-exact=true` and `min-release-age=14`, which enforces the two-week rule on every install (verified: it picks Vite 8.3.4 over 8.3.5). Astro 7.4.1 to 7.4.4 are too new today; review them on 2026-11-11. **Move `.nvmrc` to 24.22.1 on 2026-11-03**, when it clears the same rule: it carries October's high-severity security fixes, and this machine's 24.14.1 predates them. The owner can choose to take it sooner.

Rejected:
- **Vite + vanilla TS + GSAP (the Web Agency setup).** Its built `index.html` has no `<h1>` and no copy: JavaScript renders the page into `<div id="app">`, across about 80 KB gz of script. `research/seo-keywords.md` §7.1 rates that as critical. Static HTML in plain Vite would mean hand-building layouts and image optimization. What carries over: Vite underneath, vanilla TS, one folder per component, the Pages workflow.
- **GSAP 3.15.0 with ScrollTrigger.** 45.6 KB gz, nearly twice this site's whole JS budget, and the library's bar says no animation libraries. Everything in the brief works with CSS plus small scripts (§4).
- **Eleventy 3.1.7, Next.js, React islands, Tailwind.** Eleventy needs extra setup for TS, images and CSP hashes. React brings a hydration runtime for small interactions. Library patterns already bring classes and tokens, and the structure skill wants CSS beside each component.
- **Astro `<ClientRouter />` and scroll-jacking libraries.** Astro's docs say the router does not work with its CSP; native `@view-transition` needs no JS (verified). Native scrolling stays.
- **@astrojs/sitemap 3.7.4.** It writes `sitemap-index.xml`; `SEO.md` specifies one `/sitemap.xml`, which a short endpoint on the page list produces (verified).

## 2. Pages (v1)

| URL | Route file in `src/pages/` | Job |
|---|---|---|
| `/` | `index.astro` | The product page, complete on its own (`UX.md` §4). Built first. |
| `/gto-hand-review` | `gto-hand-review.astro` | How a hand gets graded, with a worked example in plain HTML. Also the no-script target of the demo button. |
| `/live-poker-hand-recorder` | `live-poker-hand-recorder.astro` | How a hand gets recorded; the most winnable search intent. First to cut if time runs short. |
| `/privacy`, `/terms` | `privacy.astro`, `terms.astro` | Short plain-words pages: concept site, nothing collected, illustrative prices. |
| `404.html` | `404.astro` | Real 404 status, `noindex`. |

Confirmed by `UX.md` §1 and `SEO.md`, which also list what is deferred. This replaces the older Home, Features and 404 list in `PROJECT.md`, including its line dropping Privacy. URLs are lowercase with no trailing slash. GitHub Pages serves `x.html` at `/x` with a 200 and `/x/` as a 404 (checked on a live Pages site), so internal links never use the slash or `.html`.

## 3. Folder structure

Follows `readable-project-structure`: one component per file, CSS beside it with a matching name, grouped by page or feature, no deeper than `src/x/y/`, and every file opens with a one-line purpose comment.

```text
astro.config.mjs        the one site-URL setting, CSP, fonts (below)
package.json  package-lock.json  tsconfig.json  svgo.config.mjs  .npmrc  .nvmrc  .gitignore  README.md
.github/workflows/deploy-pages.yml   host config: a file only, manual trigger (§8)
scripts/check-dist.mjs  fails the build on budget or rule breaks (§6); tests/e2e/ holds key flows (e2e-runner)
public/                 copied as is: favicon.ico, icon.svg, icon-192.png, icon-512.png,
                        apple-touch-icon.png, site.webmanifest, blank.svg, og/*.png
src/
  pages/                routes only: one thin file per URL, plus robots.txt.ts and sitemap.xml.ts
  layouts/SiteLayout.astro   html shell: head, skip link, navbar, main, footer, both dialogs
  sections/             one file set per section, so T18 to T20 can work in parallel
    home/               Hero  HowItWorks  Engine  Highlights  Numbers  Toolbox  YourData  Pricing
    gto-hand-review/  live-poker-hand-recorder/   same pattern
  components/           on more than one page, or page-wide; one folder each
    Navbar/  MobileCtaBar/  SiteFooter/  ClosingBand/  SeoHead/  Breadcrumbs/  ConceptNote/
    Dialog/  SampleHandDialog/  EarlyAccessDialog/  CtaButton/
    Story/  Bento/  Faq/  Counter/  UnitSwitch/  Screenshot/  PhoneFrame/  LaptopFrame/
  scripts/              page-wide: head-guard.js  reveal-loader.ts  reveal-fallback.ts
  styles/               tokens.css (web-designer; the only token source, keeps the library's names)
                        global.css (reset, base type)  motion.css (animation-expert)
  assets/               screens/ (PNG masters)  svg/ (svg-expert)  fonts/ (woff2 and licenses)
  data/                 site.ts (nav, footer, concept note)  pages.ts (page list and SEO values)
                        demo-spots.json (exact copy of docs/site/research/demo-spots.json)
```

A section or component is `Hero.astro` plus `Hero.css`, plus `Hero.ts` only if it has behaviour. Astro turns every file in `src/pages/` into a URL, so page parts live in `src/sections/<page>/`; T21 assembles them in the route file. Use the library's `CLAUDE.md` as the index and open only the pattern you need. Its quality bar applies everywhere: WCAG 2.2 AA, no horizontal scroll at 320px, no icon fonts, tokens instead of hard-coded values.

**Not built:** `docs/`, `showcase/`, `.claude/`. Astro reads only `src/`, `public/` and what they import, so these stay out as long as site code never imports from them. **The one site-URL setting** is `site` below, read as `Astro.site`; nothing else holds the domain.

```js
// astro.config.mjs (verified). format 'file' gives /x from x.html; assetsInlineLimit 0 stops data: URIs and inlined scripts.
export default defineConfig({
  site: 'https://handsolved.com',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'never' },
  fonts: [/* §5 */],
  security: { csp: {
    directives: ["default-src 'none'", "img-src 'self'", "font-src 'self'", "manifest-src 'self'", "connect-src 'none'", "base-uri 'none'", "form-action 'none'"],
    scriptDirective: { resources: ["'self'"] }, styleDirective: { resources: ["'self'"] },
  } },
  vite: { build: { assetsInlineLimit: 0 } },
});
```

## 4. JavaScript

A component with behaviour includes its sibling with `<script src="./Name.ts">`. Astro bundles it as a deferred module and ships it only on pages that use the component. No `client:*` directives and no hydration. All copy is in the HTML; scripts only enhance. One colour theme, so no theme toggle. The library's own scripts measure 0.39 to 1.15 KB gz each, so these limits are real; they replace the 25 + 40 KB in `UX.md` §9.3.

| File, under `src/` | Job | Library pattern | KB gz |
|---|---|---|---|
| **On page load** | | | **limit 11** |
| `components/Navbar/Navbar.ts` | Compact on scroll, hover pill, current link, button style swap, mobile menu | `premium/floating-navbar.md` | 1.5 |
| `components/SiteFooter/SiteFooter.ts` | Reveal progress, flow fallback for tall footers, lift on focus | `premium/reveal-footer.md` | 0.9 |
| `components/Dialog/Dialog.ts` | The one listener for all triggers; open, close, focus return, sheet drag; imports dialog logic on first intent (includes Vite's 0.8 KB import helper) | `premium/spring-modal.md` | 2.3 |
| `components/MobileCtaBar/MobileCtaBar.ts` | Show and hide rules | `cta-sections.md` | 0.4 |
| `components/UnitSwitch/UnitSwitch.ts` | BB/$ switch: reformats every live number, remembers the choice | new | 0.5 |
| `components/Counter/Counter.ts` | Rolls numbers when in view | `premium/stat-counters.md` | 0.5 |
| `components/Story/Story.ts` | Active step and device scene | `premium/sticky-showcase.md` | 0.5 |
| `components/Faq/Faq.ts` | Animates height; `<details>` works without it | `premium/smooth-accordion.md` | 0.7 |
| `sections/home/Toolbox.ts` | Tabs | `premium/feature-tabs.md` | 1.0 |
| `sections/home/Numbers.ts` | Chart readout by pointer and keyboard, table view | new | 1.0 |
| `scripts/reveal-loader.ts` | Imports the fallback only if `animation-timeline: view()` is unsupported | new | 0.1 |
| **On demand** | | | **limit 14** |
| `components/SampleHandDialog/SampleHandDialog.ts` | Renders `data/demo-spots.json`, bundled inside it so no `fetch` exists; takes the visitor's choice, shows frequency, value and grade | `premium/spring-modal.md` shell | 7 + 1.8 |
| `components/EarlyAccessDialog/EarlyAccessDialog.ts` | Validates, shows the success step with the concept note | `premium/floating-label-form.md` | 1.5 |
| `scripts/reveal-fallback.ts` | One-shot IntersectionObserver reveals (Firefox, Safari below 26) | `animations.md` §1, §2 | 0.4 |
| **Home total** | | | **limit 25** |

**CSS only, no script:** the page-load veil (keyframes); page-to-page transitions (`@view-transition`: Chrome 126+, Safari 18.2+, plain navigation in Firefox); scroll reveals, parallax and the chart draw where scroll timelines exist (Chrome 115+, Safari 26+); SVG backgrounds and their motion; the footer's lift (`position: sticky`); device float and hover tilt; pricing monthly/yearly (radio plus `:has()`); anchor scrolling; all hover and focus motion.

**How section buttons open pop-ups.** A section only places `<CtaButton dialog="dlg-early" cta="pricing-pro" plan="pro" />`. It prints `<button type="button" aria-haspopup="dialog" data-dialog-open="dlg-early" data-cta="..." data-plan="...">`; demo buttons also get a `<noscript>` link to `/gto-hand-review#worked-example`. `Dialog.ts` holds one delegated listener on `document`, so no section needs script or wiring. `SiteLayout` mounts `#dlg-sample` and `#dlg-early` once, closed. T20 owns the dialogs; T18 and T19 only place buttons. A dialog opens at once and its logic fills in when the module lands.

**Pop-up data.** `src/data/demo-spots.json` is an unchanged copy of `docs/site/research/demo-spots.json`, the app engine's real output from T5. Nothing recalculates it, and no engine code ships. The same file renders the worked example on `/gto-hand-review` at build, as static HTML. The sign-up (early access) pop-up has no `fetch` and no cookies, and never stores typed input. `submitSignup()` in `EarlyAccessDialog.ts` is the one empty function a future back end replaces.

Motion rules:
1. **Scroll timeline trap (verified).** Lightning CSS folds `animation-timeline` into an `animation:` shorthand in the same rule. Chrome and WebKit reject the result, so the effect disappears, in production builds only. Write longhands (`animation-name`, `-timing-function`, `-fill-mode`, `-timeline`, `-range`). `check-dist.mjs` fails on this.
2. **The veil never holds back the hero.** Per `UX.md` §4 it is in the first HTML, CSS-driven, home only, gone by 900 ms. Hero text and image paint underneath at full opacity, and it moves with `transform` only. Verified in Chrome: LCP equals first paint with the veil playing. T32 measures the real page.
3. **One inline script.** `scripts/head-guard.js` skips the veil on return visits and restores the BB/$ choice before first paint. Astro does not hash `is:inline` scripts by itself (verified: blocked in `<body>`). `SiteLayout` imports it with `?raw`, prints it with `set:html`, and calls `Astro.csp.insertScriptHash()` with its SHA-256 (verified).
4. **The view-transition opt-in is inline (verified).** Chrome decides on the new page before its external stylesheets apply, so `@view-transition` lives in one hashed `<style>` in `SiteLayout`, not in `motion.css`. Test it in Chrome with no automation attached: CDP makes it fail by itself (`MOTION.md` 0.1).
5. **Reduced motion and effect count.** Every effect sits inside `@media (prefers-reduced-motion: no-preference)`; anything moving longer than 5 s has a pause control. The owner's requested effects all ship, despite the library's "one or two" guideline. Its "one attention effect per section" still holds, and anything beyond the brief needs a stated reason in `MOTION.md`.

## 5. Images, fonts, SVG

**Screenshots.** Copy each PNG the site uses, unchanged, from `showcase/app/final/` to `src/assets/screens/`; site code imports only from there. `components/Screenshot/Screenshot.astro` wraps Astro's `<Picture>` (sharp, at build) with `formats={['avif','webp']}` and `fallbackFormat="webp"`, so no PNG ships. Keep sharp's default qualities (AVIF 50, WebP 80): a side-by-side at 2x zoom showed no visible loss on UI text.

| Kind | Source | `widths` | `width` × `height` props | Default `sizes` | Top width, avg / max KB |
|---|---|---|---|---|---|
| Phone | 1170×2532 | 300, 450, 600, 780 | 780 × 1688 | `(min-width: 768px) 320px, 70vw` | AVIF 32 / 40, WebP 49 / 62 |
| Desktop | 2880×1800 | 640, 960, 1280, 1600, 2240 | 2240 × 1400 | `(min-width: 1200px) 1120px, 92vw` | AVIF 52 / 81, WebP 81 / 123 |

- **No layout shift:** `<Picture>` prints `width` and `height`, CSS sets `height: auto`, and frames reserve `aspect-ratio: 1170 / 2532` or `8 / 5`. **Loading:** only the LCP image gets `loading="eager" fetchpriority="high"`, with no preload link since it is in the initial HTML. Everything else gets `loading="lazy" decoding="async"`.
- **Hero desktop frame:** a hand-written `<picture>` with `media="(min-width: 768px)"` sources from `getImage()` and `src="/blank.svg"`, so phones never download it (verified at 390 px).
- **Mockups:** `PhoneFrame` and `LaptopFrame` wrap T15's SVG frame art around the screenshot, with a "Sample data" tag. No raster frames.

**Fonts.** Families are `web-designer`'s call in T11. The pipeline is fixed: at most two OFL families, under 70 KB together, no Google Fonts request, no font package in `package.json`.
- **Files:** `npm pack @fontsource-variable/<family>` (a version over two weeks old), then copy `<family>-latin-wght-normal.woff2` and the license to `src/assets/fonts/`. For scale: Fredoka 29.7 KB, Nunito 39.1, Geist 29.4, Geist Mono 23.1.
- **Wiring:** the `fonts` config with `fontProviders.local()`, the weight range from the package's CSS, and `optimizedFallbacks: true`; `<Font>` in `SiteLayout`, with `preload` only on the LCP text's face. Verified: `font-display: swap`, a metric-matched fallback that limits CLS, and CSP hashes that cover its inline style. **Names:** use `cssVariable: '--face-display'` and `'--face-body'`, and in `tokens.css` set `--font-display: var(--face-display)` and `--font-sans: var(--face-body)`. The library's names must stay, and a linked `tokens.css` would otherwise overwrite Astro's inline variable.

**SVG.** Sources live in `src/assets/svg/` as `logo-*`, `icon-*`, `frame-*` and `bg-*`; run `npm run svg` after adding any, and do not use Astro's `experimental.svgOptimizer`.
- **Icons, logo, frames:** import as Astro components, which inlines them at build (verified). No `<style>` or `style=`, because inline SVG falls under the page's CSP.
- **Backgrounds:** static ones are `url()` in the section's CSS, loaded as cached files that may hold their own `<style>` (verified under the CSP), at most 8 KB before compression (`UX.md` §9.2). Animated ones are inline, `aria-hidden="true"`, moved from the sibling CSS with `transform` and `opacity` only. No SMIL.

## 6. Performance budgets

| Budget | Limit | Basis |
|---|---|---|
| LCP | 2.0 s on Lighthouse mobile; 2.5 s field (M5 mark) | LCP element in the initial HTML, no render-blocking script |
| CLS | 0.05 lab; 0.1 field (M5 mark) | Image dimensions, metric-matched fallback fonts, transform-only veil |
| INP | 150 ms lab, TBT under 100 ms; 200 ms field (M5 mark) | Little script on load; dialogs open before their module arrives |
| HTML and CSS, home | HTML 30 KB gz; CSS 30 KB gz on load, 45 KB gz total | Tokens plus ten likely patterns measure 17.9 KB gz of CSS. Total counts stylesheets a section loads later: the Showdown table loads its 13 KB with its script (`SHOWDOWN.md`) |
| JS, home | 11 KB gz on load, 25 KB gz total | §4 |
| Fonts | 70 KB | Largest pair above: 68.9 KB |
| Hero images | 120 KB at 2x desktop, 40 KB on phones | Top-width AVIF measured; phones skip the desktop frame |
| Page weight | Home first view 300 KB; home fully scrolled 900 KB; supporting page 400 KB | About 8 phone and 4 desktop shots at 2x on home |

`scripts/check-dist.mjs` uses Node built-ins only and fails when home JS or CSS is over limit (a `<noscript>` stylesheet is not counted on load, and every stylesheet the page names counts in the total); CSS has an `animation:` shorthand holding `view(` or `scroll(`; HTML has a `style=` attribute or a `data:` URI; a page loads a script, style, font or image from another origin, or an `<a href>` leaves the site; an inline script's hash is missing from the CSP; `dist/` has `onrender` or `pokerwiz` in any case, including file names; or a page lacks one `<h1>`, a title and (except 404) a description and canonical.

## 7. SEO plumbing (rules and values are in `SEO.md`)

| What | Where | Notes |
|---|---|---|
| Title, description, OG image and alt | `src/data/pages.ts`, printed by `components/SeoHead/SeoHead.astro` | Final words from `COPY.md`. Images are `public/og/*.png` at fixed, unhashed URLs |
| Canonical, `og:url` | `SeoHead`: `new URL(path, Astro.site)` | Not `Astro.url`, which returns `/x.html` with `format: 'file'` (verified) |
| JSON-LD | `components/SeoHead/json-ld.ts`, printed with `<` escaped | Home: `WebSite`, `Organization`. Product pages: `BreadcrumbList`. Never `Offer`, `Product`, `SoftwareApplication`, `AggregateRating` or `FAQPage`; prices are illustrative |
| Sitemap, robots | `src/pages/sitemap.xml.ts` from `pages.ts`, `src/pages/robots.txt.ts` from `site` | Verified. They replace the `public/` files T21 lists. `lastmod` only where `pages.ts` sets it |
| Icons, manifest, 404 | `public/`; `src/pages/404.astro`, built to `dist/404.html` | Manifest is not installable and needs `manifest-src 'self'`. Pages serves the 404 with its status; `SeoHead` prints the reduced head |

## 8. Security headers

**The CSP is a `<meta>` tag written by Astro at build** (§3), with script and style hashes added automatically: `default-src 'none'; img-src 'self'; font-src 'self'; manifest-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; script-src 'self' <hashes>; style-src 'self' <hashes>`

Verified in both engines: no violations on a clean load; dialog, lazy chunk and `<form method="dialog">` all work; `fetch` is blocked and `sendBeacon` is refused in the console, so "sends nothing" is enforced by the browser and not only promised; the page-to-page transition runs. It is not applied in `astro dev`. Rules it imposes (tested):
- No `style="..."` in markup and no `<style>` in inline SVG or injected HTML; both are blocked. The library's `style="--i: n"` (navbar, sticky showcase, feature tabs, bento) becomes `:nth-child` rules or `el.style.setProperty()`.
- In scripts, use `el.style.prop =` or `setProperty()`, which are allowed. `setAttribute('style', ...)` and `innerHTML` with `style=` are blocked. Avoid `cssText`: it worked in both engines, but MDN documents it as blocked. No inline event handlers, no third-party origins, no `<ClientRouter />`, no `define:vars`, no `data:` URIs. Library patterns using `url(data:...)`, such as grain in `backgrounds.md`, move that SVG to a file.

**What GitHub Pages can and can't do.** Observed 2026-11-01 on two Pages sites: it sends `cache-control: max-age=600`, `etag`, `last-modified` and `access-control-allow-origin: *`. HSTS appeared on the github.io site but not on `pages.github.com`, so do not count on it for `handsolved.com`.
- **Can:** CSP by meta tag, except `frame-ancestors`, `sandbox` and reporting, which browsers ignore there; `<meta name="referrer" content="strict-origin-when-cross-origin">`; HTTPS through Enforce HTTPS; www and apex redirects, per its docs. **Can't:** any custom header, so no frame protection, `X-Content-Type-Options`, `Permissions-Policy`, COOP or long caching of hashed assets (`SEO.md` §9 asks for it). `/x.html` stays a 200, not the redirect `SEO.md` §7 lists, and the canonical covers it. Accepted for now: this site has no login, no state-changing action and no secrets.
- **On a host with headers (§10), add:** `Content-Security-Policy: frame-ancestors 'none'` (it combines with the meta tag), `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin`, and `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*`.

**Workflow (T23).** `.github/workflows/deploy-pages.yml` copies the Web Agency file with these changes: `on: workflow_dispatch` only, `node-version-file: .nvmrc`, `npm run verify` as the build step, and current action majors (checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5). GitHub's docs say a `CNAME` file is ignored with a custom workflow, so the domain goes in repo settings once it is bought. It will not be run in this phase.

## 9. Run, build, preview

```bash
nvm use            # Node from .nvmrc
npm ci             # npm install only when adding a package
npm run dev        # http://localhost:4321: no CSP, no CSS minifying
npm run build      # writes dist/; encoded images are cached after the first run
npm run preview    # serves dist/ on :4321 with the real CSP, minified CSS and 404
npm run verify     # astro check, then build, then scripts/check-dist.mjs
npm run svg        # svgo --multipass -f src/assets/svg
```

T16 writes `package.json` and the config by hand and does not run `npm create astro`, because `docs/`, `showcase/`, `.claude/`, `tokens.css` and `src/assets/svg/` already exist by then. Check motion and the CSP in `preview`, never only in `dev`: the worst failures above happen only in the built site. Agents: Astro detects agent shells and runs `preview` in the background, and its CLI offers the same for `dev`. Stop them with `npx astro preview stop` and `npx astro dev stop`. No commits, pushes or deploys in this phase.

## 10. App readiness

The site cannot take a real sign-up today, on purpose. Before it could, in priority order:
1. **Close the open deployment. This comes first, today, whatever happens to the site.** A deployment holding the owner's real data is reachable with no login. `server/index.js` mounts every route with no auth, so anyone with the address can download everything (`GET /api/data/backup`), replace it (`POST /api/data/import`, `POST /api/data/snapshots/:name/restore`) or delete it. Owner action: download a backup from Profile in their own browser, then suspend the service in the host's dashboard. Bring it back only behind item 2 or, as a stopgap, one shared password checked in a middleware ahead of all routes. Nobody on this team calls that server.
2. **A login on the API.** Accounts table, `HttpOnly`, `Secure`, `SameSite=Lax` session cookie, one auth middleware ahead of `/api/data` (mounted first today) and every other route, rate limit on login. Use an emailed 6-digit code, not a link: an installed iPhone web app keeps its cookies apart from Safari, so a link would log in the wrong place. This needs one transactional email provider. No auth, CORS or rate-limit code exists today.
3. **Per-user data: accounts, not per-device.** Add `user_id` to `sessions`, `hands` and `goals` (`session_events` follows its session) and scope about 55 SQL statements in `server/models/`. The trap is `/api/data/*`: backup, import, snapshots and restore all act on the whole database, so one user's restore would overwrite everyone. Make them per-user, move the owner's rows to the owner's account, key the browser's device copy by user, and add account deletion. Per-device data is rejected because the product is used on a phone at the table and a desktop later, and a lost device would lose the history. SQLite on one paid disk is fine at this stage.
4. **Finish the rename.** At commit 1e61f62 the app still says PokerWiz; HandSolved in the screenshots comes only from a scratch copy. Do not blind-replace. `BACKUP_APP` is checked on import and the snapshot filename pattern matches `pokerwiz-`, so old backups would be rejected or orphaned. Six `localStorage` keys, the IndexedDB name, `POKERWIZ_DB` and the disk path also carry data. Read both names, write the new one.
5. **Payments, last.** No payment code exists (the "premium lock" in the 0.4.0 commit concerns premium hands in the preflop charts, not a paywall). Stripe Checkout, a webhook and a `plan` field on the account, checked on the server. First confirm the processor accepts poker-related software.

When those land, this site changes in one pass. It leaves GitHub Pages, whose limits page rules out sites "primarily directed at either facilitating commercial transactions or providing commercial software as a service" and "sensitive transactions like sending passwords or credit card numbers"; Cloudflare Pages takes the same `dist/` and adds the §8 headers. The app moves to `app.handsolved.com` with `noindex`. `submitSignup()` calls it, and `connect-src` and `form-action` widen to that origin only. The concept note changes first, prices become real, and `/privacy` and `/terms` are rewritten.
