// build-art.mjs: writes the mark, lockup, suits, icons, device frames, lattice, card back, medallion and the favicon set. Plain Node plus sharp (already a dependency).
// Run: node scripts/build-art.mjs        Specs: docs/site/DESIGN.md 7.2 to 7.6, 8 and 10. Chart files come from build-chart.mjs.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG = join(root, 'src/assets/svg');
const PUB = join(root, 'public');
mkdirSync(PUB, { recursive: true });
const num = (v) => String(Math.round(v * 100) / 100);

// Same settings as `npm run svg`, so a later run of it changes nothing.
let optimize = (s) => s;
try {
  const svgo = await import('svgo');
  const config = await svgo.loadConfig(join(root, 'svgo.config.mjs'));
  optimize = (s) => svgo.optimize(s, config).data;
} catch {
  console.warn('build-art: svgo not found, writing unoptimized output');
}

const report = [];
function put(dir, name, content, { raw = false } = {}) {
  const out = typeof content === 'string' && !raw && name.endsWith('.svg') ? optimize(content) : content;
  writeFileSync(join(dir, name), out);
  report.push([dir === SVG ? `src/assets/svg/${name}` : `public/${name}`, Buffer.byteLength(out)]);
}

const NS = 'xmlns="http://www.w3.org/2000/svg"';

// ============================================================ 7.4 the mark: the spade on the 13 x 13 grid, one red cell at row 6, column 6
const BITMAP = [
  '......#......',
  '.....###.....',
  '....#####....',
  '...#######...',
  '..#########..',
  '.###########.',
  '######@######', // @ is the red cell: 88, the center of the chart
  '#############',
  '#############',
  '.###.###.###.',
  '.....###.....',
  '....#####....',
  '...#######...',
];
const filled = (x, y) => (BITMAP[y]?.[x] ?? '.') !== '.';
const RED = { x: BITMAP.findIndex((r) => r.includes('@')) && BITMAP[6].indexOf('@'), y: 6 };
if (RED.x !== 6) throw new Error('the red cell moved: it must be row 6, column 6');

/** Outline of the filled cells as one merged path (no seams between rows), clockwise, h and v steps only. */
function outline() {
  const edges = new Map();
  const add = (a, b) => {
    const k = `${a}`;
    if (!edges.has(k)) edges.set(k, []);
    edges.get(k).push(b);
  };
  for (let y = 0; y < BITMAP.length; y += 1) {
    for (let x = 0; x < BITMAP[y].length; x += 1) {
      if (!filled(x, y)) continue;
      if (!filled(x, y - 1)) add([x, y], [x + 1, y]);
      if (!filled(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
      if (!filled(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
      if (!filled(x - 1, y)) add([x, y + 1], [x, y]);
    }
  }
  let d = '';
  while (edges.size) {
    const first = [...edges.keys()][0];
    let cur = first.split(',').map(Number);
    const start = cur;
    d += `M${start[0]} ${start[1]}`;
    let dir = null;
    let run = 0;
    const flush = () => {
      if (run) d += dir === 'h' ? `h${run}` : `v${run}`;
      run = 0;
    };
    do {
      const list = edges.get(`${cur}`);
      const next = list.shift();
      if (!list.length) edges.delete(`${cur}`);
      const dx = next[0] - cur[0];
      const dy = next[1] - cur[1];
      const nd = dx ? 'h' : 'v';
      const len = dx || dy;
      if (nd !== dir || Math.sign(len) !== Math.sign(run)) {
        flush();
        dir = nd;
      }
      run += len;
      cur = next;
    } while (`${cur}` !== first);
    flush();
    d += 'z';
  }
  return d;
}
const SPADE = outline();
const CELL = 'M6 6h1v1H6z';

put(SVG, 'logo-mark.svg', `<svg ${NS} viewBox="0 0 13 13" shape-rendering="crispEdges" aria-hidden="true"><path class="mark-spade" fill="currentColor" d="${SPADE}"/><path class="mark-cell" fill="var(--primary)" d="${CELL}"/></svg>`);

// Grid variant: the same bitmap with an 8% gap between cells, so the chart shows through. Runs are dashed lines, 0.92 on and 0.08 off.
{
  let d = '';
  for (let y = 0; y < BITMAP.length; y += 1) {
    let x = 0;
    while (x < 13) {
      if (!filled(x, y)) {
        x += 1;
        continue;
      }
      let e = x;
      while (filled(e + 1, y)) e += 1;
      d += `M${num(x + 0.04)} ${y + 0.5}H${num(e + 0.96)}`;
      x = e + 1;
    }
  }
  put(SVG, 'logo-mark-grid.svg', `<svg ${NS} viewBox="0 0 13 13" aria-hidden="true"><path class="mark-spade" fill="none" stroke="currentColor" stroke-width=".92" stroke-dasharray=".92 .08" d="${d}"/><path class="mark-cell" fill="var(--primary)" d="M6.04 6.04h.92v.92h-.92z"/></svg>`);
}

// One ink only: the red cell is knocked out, for a single-colour stamp, emboss or print.
put(SVG, 'logo-mark-mono.svg', `<svg ${NS} viewBox="0 0 13 13" shape-rendering="crispEdges" aria-hidden="true"><path class="mark-spade" fill="currentColor" fill-rule="evenodd" d="${SPADE}${CELL}"/></svg>`);

// Lockup: mark 26 px, 8 px gap, "HandSolved" as real outlines of Sofia Sans Extra Condensed 800 at 28 px (scripts/wordmark.json), one ink.
const wordmark = JSON.parse(readFileSync(join(root, 'scripts/wordmark.json'), 'utf8'));
put(
  SVG,
  'logo-lockup.svg',
  `<svg ${NS} viewBox="0 0 136 26" aria-hidden="true"><g class="lockup-mark" shape-rendering="crispEdges" transform="scale(2)"><path class="mark-spade" fill="currentColor" d="${SPADE}"/><path class="mark-cell" fill="var(--primary)" d="${CELL}"/></g><path class="lockup-word" fill="currentColor" d="${wordmark.d}"/></svg>`,
);

// ============================================================ 7.2 lattice: the chart grid turned 45 degrees (files, because the CSP bans data: URIs)
put(SVG, 'bg-lattice-red.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M-4-4 36 36M36-4-4 36" fill="none" stroke="#A81222" stroke-width="1.5"/></svg>');
put(SVG, 'bg-lattice-edge.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M-4-4 36 36M36-4-4 36" fill="none" stroke="#BDBFBE" stroke-width="1.5"/></svg>');

// ============================================================ 7.3 card back: face-down card (lattice tile 8, 2 px inner border at 8% of width) and the footer medallion
put(
  SVG,
  'art-card-back.svg',
  `<svg ${NS} viewBox="0 0 100 140" aria-hidden="true"><defs><pattern id="hs-cb-p" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-1-1 9 9M9-1-1 9" fill="none" stroke="var(--primary-hover)" stroke-width="1"/></pattern></defs><rect class="cb-ground" width="100" height="140" rx="10" fill="var(--surface-red)"/><rect class="cb-lattice" width="100" height="140" rx="10" fill="url(#hs-cb-p)"/><rect class="cb-frame" x="8" y="8" width="84" height="124" rx="3" fill="none" stroke="var(--surface-raised)" stroke-width="2"/></svg>`,
);
// Face White square turned 45 degrees (side 104, radius 8), the mark upright inside at 52 px, Key Black with the red cell.
put(
  SVG,
  'art-medallion.svg',
  `<svg ${NS} viewBox="0 0 147 147" aria-hidden="true"><rect class="med-plate" x="21.5" y="21.5" width="104" height="104" rx="8" transform="rotate(45 73.5 73.5)" fill="var(--surface-raised)"/><g class="med-mark" shape-rendering="crispEdges" transform="translate(47.5 47.5) scale(4)"><path class="mark-spade" fill="var(--surface-ink)" d="${SPADE}"/><path class="mark-cell" fill="var(--primary)" d="${CELL}"/></g></svg>`,
);

// ============================================================ suits: filled, 16 grid, original drawings from circles and tangents
function tangent(P, C, r, side) {
  const th = Math.atan2(P[1] - C[1], P[0] - C[0]);
  const al = Math.acos(r / Math.hypot(P[0] - C[0], P[1] - C[1]));
  const pts = [th + al, th - al].map((a) => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]);
  return side === 'min' ? (pts[0][0] < pts[1][0] ? pts[0] : pts[1]) : pts[0][0] > pts[1][0] ? pts[0] : pts[1];
}
function lobes(tipY, lobeY, flip) {
  const r = 3.75;
  const tip = [8, tipY];
  const c1 = [4.75, lobeY];
  const c2 = [11.25, lobeY];
  const t1 = tangent(tip, c1, r, 'min');
  const t2 = tangent(tip, c2, r, 'max');
  const dipY = lobeY + (flip ? 1 : -1) * Math.sqrt(r * r - 3.25 * 3.25);
  const f = flip ? 0 : 1;
  const p = (pt) => `${num(pt[0])} ${num(pt[1])}`;
  return `M${p(tip)}L${p(t1)}A${r} ${r} 0 1 ${f} 8 ${num(dipY)}A${r} ${r} 0 1 ${f} ${p(t2)}z`;
}
const SUITS = {
  spade: `<path d="${lobes(1.25, 9.25, true)}M7.2 10.6 5.4 14.75h5.2L8.8 10.6z"/>`,
  heart: `<path d="${lobes(14.75, 5.25, false)}"/>`,
  diamond: '<path d="M8 1l5.5 7L8 15 2.5 8z"/>',
  club: '<circle cx="8" cy="4.6" r="3.2"/><circle cx="4.4" cy="9.6" r="3.2"/><circle cx="11.6" cy="9.6" r="3.2"/><path d="M7.4 8.5 5.7 14.75h4.6L8.6 8.5z"/>',
};
for (const [name, body] of Object.entries(SUITS)) {
  put(SVG, `icon-suit-${name}.svg`, `<svg ${NS} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">${body}</svg>`);
}

// ============================================================ icons: 24 grid, live area 20, stroke 1.5, square caps, miter joins, currentColor
const star = Array.from({ length: 10 }, (_, i) => {
  const a = (-90 + i * 36) * (Math.PI / 180);
  const r = i % 2 ? 4.2 : 9.5;
  return `${num(12 + r * Math.cos(a))} ${num(12.6 + r * Math.sin(a))}`;
}).join('L');

const ICONS = {
  // navigation
  'arrow-right': 'M4 12h16M14 6l6 6-6 6',
  'arrow-down': 'M12 4v16M6 14l6 6 6-6',
  'chevron-right': 'M9 5l7 7-7 7',
  'chevron-down': 'M5 9l7 7 7-7',
  plus: 'M12 4v16M4 12h16',
  minus: 'M4 12h16',
  close: 'M5 5l14 14M19 5 5 19',
  menu: 'M4 7h16M4 12h16M4 17h16',
  // status
  check: 'M4 12.5l5.5 5.5L20 7',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.25h.01"/>',
  alert: 'M12 3.5 21.5 20h-19zM12 10v4.5M12 17.25h.01',
  star: `M${star}z`,
  // grades: two ticks, one tick, a wobble, one cross, two crosses, a dash
  'grade-best': 'M2 13l4.5 4.5L13 8M9.5 13l4.5 4.5L22 7',
  'grade-good': 'M4 12.5l5.5 5.5L20 7',
  'grade-inaccuracy': 'M2 12q2.5-5 5 0t5 0 5 0 5 0',
  'grade-mistake': 'M6 6l12 12M18 6 6 18',
  'grade-blunder': 'M3 8l7 8M10 8l-7 8M14 8l7 8M21 8l-7 8',
  'grade-none': 'M5 12h14',
  // hero proof strip: charts, streets, score
  'proof-charts': 'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18',
  'proof-streets': 'M3 6h5v12H3zM9.5 6h5v12h-5zM16 6h5v12h-5z',
  'proof-score': 'M4 17a8 8 0 0 1 16 0M12 17l4-5M3 20h18',
  // limits: hold'em, hands you enter, heads-up or 3-way
  'limit-holdem': 'M3 6h8v13H3zM13 6h8v13h-8zM5.5 9.5h3v3h-3z',
  'limit-entered': 'M4 20v-4L15 5l4 4L8 20zM12.5 7.5l4 4',
  'limit-postflop': '<circle cx="12" cy="7" r="3"/><circle cx="6.5" cy="16.5" r="3"/><circle cx="17.5" cy="16.5" r="3"/>',
  // highlights tiles: fame, shame, tilt, pots, insights
  'tile-fame': 'M7 4h10v6a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v4M8 20h8',
  'tile-shame': 'M3 5h18v14H3zM3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19',
  'tile-tilt': 'M4 20h10v-4H4zM6 16h10v-4H6zM8.5 12h10V8h-10zM11.5 8h9V4h-9z',
  'tile-pots': 'M5 9h14v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM5 11H2.5M19 11h2.5M9 4v2M12 3v3M15 4v2',
  'tile-insights': 'M4 4v16h16M7.5 20v-6h3v6M11.5 20V9h3v11M15.5 20v-8h3v8',
  // data cards, drawn on this grid and shown at 32
  'data-import': 'M4 14v6h16v-6M12 3v11M7.5 9.5 12 14l4.5-4.5',
  'data-export': 'M4 14v6h16v-6M12 15V4M7.5 8.5 12 4l4.5 4.5',
  'data-install': 'M7 3h10v18H7zM12 8v6M9.5 11.5 12 14l2.5-2.5M10.5 18h3',
};
const ICON_ROOT = `${NS} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"`;
for (const [name, body] of Object.entries(ICONS)) {
  put(SVG, `icon-${name}.svg`, `<svg ${ICON_ROOT}>${body.startsWith('<') ? body : `<path d="${body}"/>`}</svg>`);
}

// Red pen marks: strokes in --pen-ink (set color: var(--pen-ink) where used), round caps like a pen. The ring and wave stretch to the text.
const PEN = 'pathLength="1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';
put(SVG, 'icon-pen-tick.svg', `<svg ${NS} viewBox="0 0 24 24" aria-hidden="true"><path ${PEN} d="M3 13.5l6 6.5L21.5 4"/></svg>`);
put(SVG, 'icon-pen-wave.svg', `<svg ${NS} viewBox="0 0 48 8" preserveAspectRatio="none" aria-hidden="true"><path ${PEN} d="M1 4q3-3.5 6 0t6 0 6 0 6 0 6 0 6 0 6 0 5 0"/></svg>`);
put(SVG, 'icon-pen-ring.svg', `<svg ${NS} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path ${PEN} d="M10 21C8 9 28 3 52 3s44 6 44 17-20 17-46 17S6 31 6 19 20 7 34 6"/></svg>`);

// ============================================================ 8 device frames: flat Key Black silhouettes, no gloss, hands, notch or buttons
// Phone: W 1000 (viewBox 1000 x 2094.25), radius 150, bezel 30, screen 940 x 2034.25, screen radius 120.
put(SVG, 'frame-phone.svg', `<svg ${NS} viewBox="0 0 1000 2094.25" aria-hidden="true"><rect class="frame-body" width="1000" height="2094.25" rx="150" fill="var(--device-ink)"/></svg>`);
// Laptop: lid W 1000, base 1120 x 28 under it, one silhouette 1120 x 666.5. Lid radius 22 on top corners, base radius 14 on the bottom corners.
put(SVG, 'frame-laptop.svg', `<svg ${NS} viewBox="0 0 1120 666.5" aria-hidden="true"><path class="frame-body" fill="var(--device-ink)" d="M0 638.5h60V22a22 22 0 0 1 22-22h956a22 22 0 0 1 22 22v616.5h60v14a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14z"/></svg>`);

// ============================================================ favicon set (DESIGN.md 7.4): Face White tile, Key Black spade, Pip Red cell
const FACE = '#FCFCFA';
const INK = '#12181B';
const PIP = '#CE1A2C';
/** Tile with the mark at an integer cell size, so every edge lands on a pixel. `inset` is the left and top margin. */
function tile({ size, cell, inset, radius }) {
  const mark = `transform="translate(${inset} ${inset}) scale(${cell})"`;
  return (
    `<svg ${NS} width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}"${radius ? ` rx="${radius}"` : ''} fill="${FACE}"/>` +
    `<path ${mark} shape-rendering="crispEdges" fill="${INK}" d="${SPADE}"/>` +
    `<path ${mark} shape-rendering="crispEdges" fill="${PIP}" d="${CELL}"/></svg>`
  );
}
// icon.svg: 32 x 32, tile radius 6, cell 2, margin 3. In dark mode the tile turns Key Black and the spade Face White. A standalone file may carry a style block.
put(
  PUB,
  'icon.svg',
  `<svg ${NS} viewBox="0 0 32 32"><style>.t{fill:${FACE}}.s{fill:${INK}}@media (prefers-color-scheme:dark){.t{fill:${INK}}.s{fill:${FACE}}}</style><rect class="t" width="32" height="32" rx="6"/><path class="s" shape-rendering="crispEdges" transform="translate(3 3) scale(2)" d="${SPADE}"/><path shape-rendering="crispEdges" fill="${PIP}" transform="translate(3 3) scale(2)" d="${CELL}"/></svg>`,
  { raw: true },
);

const png = (svg, { opaque = false } = {}) => {
  const img = sharp(Buffer.from(svg), { density: 72 });
  return (opaque ? img.flatten({ background: FACE }).removeAlpha() : img).png({ compressionLevel: 9 }).toBuffer();
};
const sizes = {
  16: { size: 16, cell: 1, inset: 1, radius: 3 },
  32: { size: 32, cell: 2, inset: 3, radius: 6 },
  48: { size: 48, cell: 3, inset: 4, radius: 9 },
};
const icoImages = [];
for (const [size, spec] of Object.entries(sizes)) icoImages.push({ size: Number(size), data: await png(tile(spec)) });
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = 6 + 16 * icoImages.length;
const dir = icoImages.map(({ size, data }) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0);
  e.writeUInt8(size, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(data.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += data.length;
  return e;
});
put(PUB, 'favicon.ico', Buffer.concat([header, ...dir, ...icoImages.map((i) => i.data)]));

// Opaque squares (no corner radius, no transparency): the platform masks them. Cell 12 on 180 and 192, 32 on 512.
put(PUB, 'apple-touch-icon.png', await png(tile({ size: 180, cell: 12, inset: 12, radius: 0 }), { opaque: true }));
put(PUB, 'icon-192.png', await png(tile({ size: 192, cell: 12, inset: 18, radius: 0 }), { opaque: true }));
put(PUB, 'icon-512.png', await png(tile({ size: 512, cell: 32, inset: 48, radius: 0 }), { opaque: true }));

// SEO.md 8: declares icons and colors only. Not installable on purpose (display browser, no service worker).
const SURFACE = '#F3F4F1'; // Card Stock, --surface-page
put(
  PUB,
  'site.webmanifest',
  JSON.stringify({
    name: 'HandSolved',
    short_name: 'HandSolved',
    start_url: '/',
    display: 'browser',
    theme_color: SURFACE,
    background_color: SURFACE,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }),
);
put(PUB, 'blank.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>', { raw: true });

// ============================================================ report
const w = Math.max(...report.map(([f]) => f.length));
let total = 0;
for (const [f, b] of report) {
  total += b;
  console.log(`${f.padEnd(w)} ${String(b).padStart(6)}`);
}
console.log(`${'total'.padEnd(w)} ${String(total).padStart(6)}  (${report.length} files)`);
const big = report.filter(([f, b]) => f.includes('icon-') && f.endsWith('.svg') && f.startsWith('src') && b >= 1024);
if (big.length) console.error('icons over 1 KB:', big.map(([f]) => f).join(', '));
