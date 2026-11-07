// astro.config.mjs: the one site-URL setting, static output rules, the CSP and the self-hosted fonts.
import { defineConfig, fontProviders } from 'astro/config';

// One local face per row of DESIGN.md 4.1: four subset woff2 files (42 KB together), each with its OFL licence beside it.
// Only the display face is preloaded (in SiteLayout), because it sets the LCP text. tokens.css reads --face-* and never defines them.
const font = (name, cssVariable, fallbacks, variants) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  optimizedFallbacks: true,
  options: { variants: variants.map(([weight, file]) => ({ weight, style: 'normal', src: [`./src/assets/fonts/${file}`] })) },
});

export default defineConfig({
  // The only place the domain lives. Code reads it as Astro.site; nothing else holds it.
  site: 'https://handsolved.com',
  // format 'file' writes x.html, which GitHub Pages serves at /x. Never link with a slash or .html.
  trailingSlash: 'never',
  // inlineStylesheets 'never' keeps every stylesheet a cached file, so no inline style needs a CSP hash.
  build: { format: 'file', inlineStylesheets: 'never' },
  // Three families (DESIGN.md section 2, ruling 1): display, body and mono. The generic sans-serif is the display fallback, which Astro adjusts from Arial
  // (DESIGN.md 4.1: Arial, never Impact), so the metric-matched fallback keeps the H1 from shifting when the real face arrives.
  fonts: [
    font('Sofia Sans Extra Condensed', '--face-display', ['sans-serif'], [[800, 'sofia-sans-extra-condensed-800.woff2']]),
    font('Schibsted Grotesk', '--face-body', ['system-ui', 'sans-serif'], [
      [400, 'schibsted-grotesk-400.woff2'],
      [600, 'schibsted-grotesk-600.woff2'],
    ]),
    font('Spline Sans Mono', '--face-mono', ['ui-monospace', 'monospace'], [[500, 'spline-sans-mono-500.woff2']]),
  ],
  // The CSP is written into every page as a <meta> tag at build; Astro adds the script and style hashes.
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "img-src 'self'",
        "font-src 'self'",
        "manifest-src 'self'",
        "connect-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  // assetsInlineLimit 0 stops Vite from inlining assets as data: URIs, which the CSP blocks.
  vite: { build: { assetsInlineLimit: 0 } },
  // The site has no Markdown, and Shiki highlighting needs inline styles the CSP blocks; this silences its build warning.
  markdown: { syntaxHighlight: false },
});
