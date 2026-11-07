# HandSolved site

Static concept site for HandSolved: Astro 7.4.0, plain HTML and CSS, small vanilla TypeScript modules. Nothing is deployed. The specs are in `docs/site/`; `ARCHITECTURE.md` wins on paths, settings and budgets.

## Run

```bash
nvm use            # Node from .nvmrc
npm ci             # npm install only when adding a package
npm run dev        # http://localhost:4321 (no CSP, no CSS minifying)
npm run build      # writes dist/
npm run preview    # serves dist/ with the real CSP, minified CSS and the 404
npm run svg        # optimise src/assets/svg after adding any file
```

## Verify

```bash
npm run verify     # astro check, then build, then scripts/check-dist.mjs
```

`scripts/check-dist.mjs` fails on: home JS over 11 KB gz on load or 25 KB gz in total, home CSS or HTML over 30 KB gz; an `animation:` shorthand holding `view(` or `scroll(`; a `style=` attribute or `data:` URI in HTML; anything loaded from, or an `<a href>` leading to, another origin; an inline script or style whose hash is missing from the CSP; `onrender` or `pokerwiz` anywhere in `dist/`; a page without one `<h1>`, a title, or (except 404) a description and canonical.

Check motion and the CSP in `preview`, never only in `dev`. Stop background servers with `npx astro dev stop` and `npx astro preview stop`.

## Where things live

- `src/pages/` one thin route per URL, plus `robots.txt.ts` and `sitemap.xml.ts` (built from `src/data/pages.ts`).
- `src/layouts/SiteLayout.astro` the html shell. It prints the one inline script, `src/scripts/head-guard.js`, with its hash added to the CSP.
- `src/data/` `site.ts` (nav, footer, concept note), `pages.ts` (titles, descriptions, social art), `legal.ts` (privacy and terms copy), `demo-spots.json` (exact copy of `docs/site/research/demo-spots.json`).
- `src/sections/`, `src/components/` one file set per section or component.
- The domain lives in one place: `site` in `astro.config.mjs`, read as `Astro.site`.
- `head-guard.js` sets `data-js` (script is on), `data-unit` (`bb` or `usd`) and `data-veil="seen"` on `<html>`. Storage keys: `hs-unit` (local) and `hs-veil` (session).
- `src/layouts/SiteLayout.astro` prints the shell: fonts, navbar, the reveal sheet around `<main>`, the card-back footer, the mobile bar and both pop-ups. `docs/site/COMPONENTS.md` lists every shared component with its props.
- Fonts are four subset woff2 files with their OFL licences in `src/assets/fonts/`, wired in `astro.config.mjs` and printed by `<Font>` in `SiteLayout` (only the display face is preloaded).
