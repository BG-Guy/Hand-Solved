// build-og.mjs: renders the four social images (1200 x 630 PNG, SEO.md 2) from HTML with Playwright, using the site's tokens, fonts, chart and frame art.
// Run: node scripts/build-og.mjs [--fonts <dir>] [--shots <dir>]    Needs playwright (PLAYWRIGHT_DIR=<folder holding node_modules/playwright> if it is not installed here) and sharp.
// Fonts: the four files named in DESIGN.md 4.1, from src/assets/fonts by default. Screens: the real captures in src/assets/screens. Nothing here is fetched from a network.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? resolve(process.argv[i + 1]) : fallback;
};
const FONTS = arg('fonts', join(root, 'src/assets/fonts'));
const SHOTS = arg('shots', join(root, 'src/assets/screens'));
const OUT = join(root, 'public/og');
mkdirSync(OUT, { recursive: true });
const TMP = mkdtempSync(join(tmpdir(), 'handsolved-og-'));

const require = createRequire(process.env.PLAYWRIGHT_DIR ? join(process.env.PLAYWRIGHT_DIR, '/') : import.meta.url);
const { chromium } = require('playwright');

const fontFiles = {
  display: 'sofia-sans-extra-condensed-800.woff2',
  body400: 'schibsted-grotesk-400.woff2',
  body600: 'schibsted-grotesk-600.woff2',
  mono: 'spline-sans-mono-500.woff2',
};
for (const f of Object.values(fontFiles)) {
  if (!existsSync(join(FONTS, f))) throw new Error(`font missing: ${join(FONTS, f)} (pass --fonts <dir>)`);
}
const url = (p) => pathToFileURL(p).href;
const svgFile = (name) => readFileSync(join(root, 'src/assets/svg', name), 'utf8');

// Phone frame math (DESIGN.md 8): outer 1000 x 2094.25, screen inset 30 on every side.
const PH = 2094.25;
const screenBox = {
  left: (30 / 1000) * 100,
  top: (30 / PH) * 100,
  width: (940 / 1000) * 100,
  height: (2034.25 / PH) * 100,
};
const pc = (n) => `${Math.round(n * 100000) / 100000}%`;

const phone = ({ shot, w, x, y, cls = '' }) => `
  <div class="phone ${cls}" style="left:${x}px;top:${y}px;width:${w}px">
    ${svgFile('frame-phone.svg')}
    <img src="${url(join(SHOTS, shot))}" alt="" style="left:${pc(screenBox.left)};top:${pc(screenBox.top)};width:${pc(screenBox.width)};height:${pc(screenBox.height)}">
    <span class="slip" style="left:${Math.round(w * 0.12)}px">Sample data</span>
  </div>`;

// All copy comes from COPY.md (social image text). Every string here is proofread against it.
const pages = {
  home: {
    body: `
      <div class="lockup" style="left:285px;top:48px;width:272px">${svgFile('logo-lockup.svg')}</div>
      <h1 style="left:285px;top:150px;font-size:120px"><span>Every hand</span><span>you play,</span><span class="red">solved.</span></h1>
      <p class="kicker" style="left:285px;top:520px;font-size:30px">Live poker session tracker<br>and hand recorder</p>
      <div class="chart plate" style="left:732px;top:162px;width:468px">${svgFile('bg-chart-hero-wide.svg')}</div>
      ${phone({ shot: 'phone-coach-score.png', w: 216, x: 732 + 6.5 * 36, y: 162 + 1.5 * 36 })}
      <div class="penslip" style="left:${Math.round(732 + 6.9 * 36 - 176)}px;top:${Math.round(162 + 8.4 * 36)}px;width:176px"><del>Call 65 bb</del> <ins>Fold</ins></div>`,
  },
  'gto-hand-review': {
    body: `
      <div class="lockup" style="left:285px;top:48px;width:272px">${svgFile('logo-lockup.svg')}</div>
      <h1 style="left:285px;top:150px;font-size:112px"><span>GTO hand</span><span>review</span></h1>
      <p class="pen" style="left:285px;top:392px"><del>Call 65 bb</del> <ins>Fold</ins></p>
      ${phone({ shot: 'phone-coach-decision.png', w: 300, x: 806, y: 150 })}`,
  },
  'live-poker-hand-recorder': {
    body: `
      <div class="lockup" style="left:285px;top:48px;width:272px">${svgFile('logo-lockup.svg')}</div>
      <h1 style="left:285px;top:150px;font-size:104px"><span>Live poker</span><span>hand recorder</span></h1>
      <p class="line" style="left:285px;top:386px">One action at a time.</p>
      ${phone({ shot: 'phone-recorder.png', w: 300, x: 806, y: 150 })}`,
  },
  default: {
    body: `
      <div class="grid"></div>
      <div class="lockup" style="left:294px;top:256px;width:612px">${svgFile('logo-lockup.svg')}</div>`,
  },
};

const html = (body) => `<!doctype html><html lang="en"><meta charset="utf-8">
<link rel="stylesheet" href="${url(join(root, 'src/styles/tokens.css'))}">
<link rel="stylesheet" href="${url(join(root, 'src/assets/svg/chart.css'))}">
<style>
@font-face{font-family:"Sofia Sans Extra Condensed";font-weight:800;src:url(${url(join(FONTS, fontFiles.display))}) format("woff2")}
@font-face{font-family:"Schibsted Grotesk";font-weight:400;src:url(${url(join(FONTS, fontFiles.body400))}) format("woff2")}
@font-face{font-family:"Schibsted Grotesk";font-weight:600;src:url(${url(join(FONTS, fontFiles.body600))}) format("woff2")}
@font-face{font-family:"Spline Sans Mono";font-weight:500;src:url(${url(join(FONTS, fontFiles.mono))}) format("woff2")}
:root{--face-display:"Sofia Sans Extra Condensed";--face-body:"Schibsted Grotesk";--face-mono:"Spline Sans Mono"}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden;background:var(--surface-page);color:var(--text-main);font-family:var(--font-sans)}
body{position:relative}
.lockup{position:absolute;color:var(--text-main)}.lockup svg{display:block;width:100%;height:auto}
h1{position:absolute;font-family:var(--font-display);font-weight:800;line-height:.9;letter-spacing:-.005em}
h1 span{display:block}.red{color:var(--text-red)}
.kicker{position:absolute;font-weight:600;line-height:1.25;color:var(--text-main)}.center{text-align:center}
.line{position:absolute;font-weight:600;font-size:44px;line-height:1.2}
.pen{position:absolute;font-family:var(--font-display);font-weight:800;font-size:64px;line-height:1;display:flex;gap:24px;align-items:baseline}
del{position:relative;text-decoration:none;color:var(--text-main)}
del::after{content:"";position:absolute;left:-.06em;right:-.06em;top:52%;height:.11em;background:var(--pen-ink);transform:rotate(-3deg);transform-origin:left center}
ins{text-decoration:none;color:var(--text-red)}
.penslip{position:absolute;height:46px;padding:0 8px;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--surface-raised);border:1px solid var(--line-strong);border-radius:var(--radius-sm);font-family:var(--font-mono);font-weight:500;font-size:18px;line-height:1}
.penslip ins{font-family:var(--font-sans);font-weight:600}
.plate{position:absolute;overflow:visible}
.phone{position:absolute}.phone svg{display:block;width:100%;height:auto}.phone img{position:absolute;display:block;object-fit:cover;object-position:top;border-radius:12.766% / 5.899%}
.slip{position:absolute;top:-15px;height:30px;padding:0 11px;display:flex;align-items:center;font-family:var(--font-mono);font-weight:500;font-size:16px;line-height:1;background:var(--surface-raised);color:var(--text-main);border:1px solid var(--line-strong);border-radius:var(--radius-sm)}
.grid{position:absolute;inset:0;background:url(${url(join(root, 'src/assets/svg/bg-chart-ghost.svg'))}) 0 0/832px 832px repeat}
</style>
<body>${body}</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const report = [];
for (const [name, def] of Object.entries(pages)) {
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, html(def.body));
  await page.goto(url(file));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const raw = await page.screenshot({ type: 'png' });
  // Flat inks compress well as a palette PNG; keep the text and the screen sharp.
  const png = await sharp(raw).png({ palette: true, quality: 95, effort: 10, colours: 256, dither: 0.6 }).toBuffer();
  writeFileSync(join(OUT, `${name}.png`), png);
  report.push([`public/og/${name}.png`, png.length]);
}
await browser.close();
for (const [f, b] of report) console.log(`${f.padEnd(40)} ${String(b).padStart(7)} bytes  ${(b / 1024).toFixed(1)} KB`);
