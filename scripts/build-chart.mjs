// build-chart.mjs: writes the five hand-chart SVGs into src/assets/svg/ from src/data/range-chart.json. No cell is typed by hand. Plain Node, no packages.
// Run: node scripts/build-chart.mjs        Geometry, levels and fade steps: docs/site/DESIGN.md 7.1.
// Output goes through svgo with the project's svgo.config.mjs when svgo is installed, so `npm run svg` changes nothing afterwards.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/assets/svg');
const RANKS = 'AKQJT98765432';
const N = 13; // cells per side
const U = 100; // units per cell: viewBox is 1300 x 1300
const PHONE_H = 2.09425; // phone outer height as a multiple of its width (DESIGN.md 8)

const fail = (msg) => {
  console.error(`build-chart: ${msg}`);
  process.exit(1);
};
const n = (v) => String(Math.round(v * 100) / 100).replace(/^-0$/, '0');

// ---------------------------------------------------------------- data
const data = JSON.parse(readFileSync(join(root, 'src/data/range-chart.json'), 'utf8'));
if (data.rows.length !== N * N) fail(`expected 169 rows, got ${data.rows.length}`);

// Row is floor(i / 13), column is i mod 13, f is [fold, call, raise]. Cell 0 is AA, top left.
const cells = data.rows.map((row, i) => {
  const r = Math.floor(i / N);
  const c = i % N;
  const want = r === c ? RANKS[r] + RANKS[r] : c > r ? `${RANKS[r]}${RANKS[c]}s` : `${RANKS[c]}${RANKS[r]}o`;
  if (row.hand !== want) fail(`row ${i} is ${row.hand}, its grid position says ${want}`);
  const [fold, call, raise] = row.f;
  if (Math.abs(fold + call + raise - 1) > 1e-6) fail(`${row.hand} frequencies do not sum to 1`);
  const kind = fold === 1 ? 'fold' : call === 1 ? 'call' : raise === 1 ? 'raise' : 'mixed';
  return { i, r, c, hand: row.hand, fold, call, raise, kind, x: c * U, y: r * U };
});

const count = { fold: 0, call: 0, raise: 0, mixed: 0 };
for (const cell of cells) count[cell.kind] += 1;
if (count.fold !== 68 || count.call !== 69 || count.raise !== 25 || count.mixed !== 7) {
  fail(`cell counts ${JSON.stringify(count)} differ from DESIGN.md (68 fold, 69 call, 25 raise, 7 mixed)`);
}

// Weighted by combos (pair 6, suited 4, offsuit 12, of 1326): the legend numbers.
const share = { fold: 0, call: 0, raise: 0 };
for (const cell of cells) {
  const combos = cell.r === cell.c ? 6 : cell.c > cell.r ? 4 : 12;
  for (const k of Object.keys(share)) share[k] += (combos * cell[k]) / 1326;
}
const pct = Object.fromEntries(Object.entries(share).map(([k, v]) => [k, (Math.round(v * 1000) / 10).toFixed(1)]));

// COPY.md 4.3, "Accessible description". The three numbers are computed above and must still match the copy.
const DESCRIPTION =
  'Thirteen by thirteen chart of starting hands for the big blind facing a button open at 100 big blinds, 8-handed. ' +
  'Red squares raise, black squares call, blank squares fold. The strongest hands at the top left are red. ' +
  `Across all hands the chart folds ${pct.fold}%, calls ${pct.call}% and raises ${pct.raise}%.`;
if (!DESCRIPTION.includes('folds 48.5%, calls 38.8% and raises 12.7%')) {
  fail(`legend numbers drifted from COPY.md: ${JSON.stringify(pct)}`);
}

// ---------------------------------------------------------------- geometry
const sq = (x, y, w, h) => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;

/** Vertical bands of one cell, left to right: raise, call, then blank fold. Widths are the true frequencies of the side. */
function bands(cell, side) {
  const pad = (U - side) / 2;
  const left = cell.x + pad;
  const top = cell.y + pad;
  let x = left;
  const out = { left, top, side, raise: null, call: null };
  if (cell.raise > 0) {
    out.raise = [x, x + cell.raise * side];
    x += cell.raise * side;
  }
  if (cell.call > 0) {
    out.call = [x, x + cell.call * side];
    x += cell.call * side;
  }
  out.inkEnd = x;
  return out;
}
const bandPath = (b, kind) => (b[kind] ? sq(b[kind][0], b.top, b[kind][1] - b[kind][0], b.side) : '');

/** Hairlines as merged runs, one path per fade step. An edge shared by two printed cells takes the louder step. */
function hairlines(stepOf) {
  const h = new Map(); // `${line}:${cell}` -> step, horizontal edges
  const v = new Map();
  const put = (map, key, s) => map.set(key, Math.max(map.get(key) ?? 0, s));
  for (const cell of cells) {
    const s = stepOf(cell);
    if (!s) continue;
    put(h, `${cell.r}:${cell.c}`, s);
    put(h, `${cell.r + 1}:${cell.c}`, s);
    put(v, `${cell.c}:${cell.r}`, s);
    put(v, `${cell.c + 1}:${cell.r}`, s);
  }
  const runs = (map, s, cmd, move) => {
    const lines = new Map();
    for (const [key, step] of map) {
      if (step !== s) continue;
      const [a, b] = key.split(':').map(Number);
      if (!lines.has(a)) lines.set(a, []);
      lines.get(a).push(b);
    }
    let d = '';
    for (const [a, list] of [...lines].sort((p, q) => p[0] - q[0])) {
      list.sort((p, q) => p - q);
      let start = list[0];
      let prev = list[0];
      for (const b of [...list.slice(1), Infinity]) {
        if (b !== prev + 1) {
          d += move(a * U, start * U) + cmd + (prev + 1) * U;
          start = b;
        }
        prev = b;
      }
    }
    return d;
  };
  const out = {};
  for (const s of [1, 2, 3]) {
    out[s] = runs(h, s, 'H', (line, from) => `M${from} ${line}`) + runs(v, s, 'V', (line, from) => `M${line} ${from}`);
  }
  return out;
}

/** Fade step from the distance to the device rectangle (DESIGN.md 7.1). Rect is [x0, y0, x1, y1] in cells. */
function fadeStep(cell, rect) {
  if (!rect) return 3;
  const [x0, y0, x1, y1] = rect;
  const dx = Math.max(x0 - (cell.c + 1), cell.c - x1, 0);
  const dy = Math.max(y0 - (cell.r + 1), cell.r - y1, 0);
  const gap = Math.max(dx, dy);
  return gap === 0 ? 0 : gap <= 1 ? 1 : gap <= 2 ? 2 : 3;
}

/** The Full chart's solid inks as dashed lines: one segment per run of equal cells, 96 on and 4 off. No element per cell. */
function inkRuns(kind) {
  let d = '';
  for (let r = 0; r < N; r += 1) {
    let run = null;
    const flush = () => {
      if (run) d += `M${run[0] * U + 2} ${r * U + 50}H${run[1] * U + 98}`;
      run = null;
    };
    for (let c = 0; c < N; c += 1) {
      const cell = cells[r * N + c];
      if (cell.kind === kind) run = run ? [run[0], c] : [c, c];
      else flush();
      if (cell.kind === 'mixed') {
        const b = bands(cell, 96);
        if (b[kind]) d += `M${n(b[kind][0])} ${r * U + 50}H${n(b[kind][1])}`;
      }
    }
    flush();
  }
  return d;
}

// ---------------------------------------------------------------- one inline chart
const SIDE = { full: { 3: 96 }, screened: { 3: 72, 2: 54, 1: 36 } };
const LINE_TOKEN = { 3: '--chart-line', 2: '--chart-line-2', 1: '--chart-line-1' };

function chart({ id, level, extra = '', rect = null, labelText = null }) {
  const stepOf = (cell) => fadeStep(cell, rect);
  const lines = hairlines(stepOf);

  // Inline files read the page tokens through var(), so no hex lives in the HTML.
  let svg = '<g class="hc-grid" fill="none">';
  for (const s of [1, 2, 3]) {
    if (lines[s]) {
      svg += `<path class="hc-line hc-line-${s}" stroke="var(${LINE_TOKEN[s]})" stroke-width="1" vector-effect="non-scaling-stroke" d="${lines[s]}"/>`;
    }
  }
  svg += '</g><g class="hc-ink">';
  if (level === 'full') {
    const dash = 'fill="none" stroke-width="96" stroke-dasharray="96 4"';
    svg += `<path class="hc-call" ${dash} stroke="var(--chart-call)" d="${inkRuns('call')}"/>`;
    svg += `<path class="hc-raise" ${dash} stroke="var(--chart-raise)" d="${inkRuns('raise')}"/>`;
  } else {
    const raise = [];
    const call = [];
    for (const cell of cells) {
      const s = stepOf(cell);
      if (!s) continue;
      const b = bands(cell, SIDE[level][s]);
      if (b.call) call.push(bandPath(b, 'call'));
      if (b.raise) raise.push(bandPath(b, 'raise'));
    }
    svg += `<path class="hc-call" fill="var(--chart-call)" d="${call.join('')}"/>`;
    svg += `<path class="hc-raise" fill="var(--chart-raise)" d="${raise.join('')}"/>`;
  }
  svg += '</g>';

  // Labels: Face White on ink, --chart-label-fold on blank cells. Only step 3 carries them. The diagonal (pairs) is its own group
  // so a narrow chart can show "pairs only" with one CSS rule. A cell with a blank band prints its label twice, one copy per band.
  const groups = { 'ink:hc-pairs': '', 'fold:hc-pairs': '', 'ink:hc-rest': '', 'fold:hc-rest': '' };
  let split = '';
  let defs = '';
  let clip = 0;
  for (const cell of cells) {
    if (stepOf(cell) !== 3) continue;
    const text = `<text x="${cell.x + 50}" y="${cell.y + 50}">${cell.hand}</text>`;
    const place = cell.r === cell.c ? 'hc-pairs' : 'hc-rest';
    if (cell.kind === 'fold') groups[`fold:${place}`] += text;
    else if (cell.kind === 'mixed' && cell.fold > 0) {
      const b = bands(cell, SIDE[level][3]);
      clip += 1;
      const ci = `${id}-k${clip}i`;
      const cb = `${id}-k${clip}b`;
      defs += `<clipPath id="${ci}"><path d="${sq(cell.x, cell.y, b.inkEnd - cell.x, U)}"/></clipPath>`;
      defs += `<clipPath id="${cb}"><path d="${sq(b.inkEnd, cell.y, cell.x + U - b.inkEnd, U)}"/></clipPath>`;
      split += `<g clip-path="url(#${ci})" fill="var(--chart-label-ink)">${text}</g>`;
      split += `<g clip-path="url(#${cb})" fill="var(--text-main)">${text}</g>`;
    } else groups[`ink:${place}`] += text;
  }
  const grp = (key, token) => (groups[key] ? `<g class="${key.split(':')[1]}" fill="var(${token})">${groups[key]}</g>` : '');
  svg += '<g class="hc-labels" text-anchor="middle" dominant-baseline="central">';
  svg += grp('ink:hc-pairs', '--chart-label-ink') + grp('fold:hc-pairs', '--chart-label-fold');
  svg += grp('ink:hc-rest', '--chart-label-ink') + grp('fold:hc-rest', '--chart-label-fold');
  if (split) svg += `<g class="hc-rest">${split}</g>`;
  svg += '</g>';

  const attrs = ['xmlns="http://www.w3.org/2000/svg"', `class="hc hc-${level}${extra}"`, 'viewBox="0 0 1300 1300"'];
  if (labelText) attrs.push('role="img"', `aria-label="${labelText}"`, 'overflow="visible"');
  else attrs.push('aria-hidden="true"', 'focusable="false"');
  return `<svg ${attrs.join(' ')}>${defs ? `<defs>${defs}</defs>` : ''}${svg}</svg>`;
}

// Files used through CSS url() cannot read tokens, so they hold literal hex. Neither carries text.
function urlFile(level, size) {
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1300 1300" aria-hidden="true">`;
  const lines = hairlines(() => 3)[3];
  if (level === 'ghost') {
    return `${head}<path class="hc-line" fill="none" stroke="#E1E2E0" vector-effect="non-scaling-stroke" d="${lines}"/></svg>`;
  }
  const raise = [];
  const call = [];
  for (const cell of cells) {
    const b = bands(cell, 96);
    if (b.call) call.push(bandPath(b, 'call'));
    if (b.raise) raise.push(bandPath(b, 'raise'));
  }
  return (
    `${head}<path class="hc-line" fill="none" stroke="#D8DAD7" vector-effect="non-scaling-stroke" d="${lines}"/>` +
    `<path class="hc-call" fill="#E1E2E0" d="${call.join('')}"/><path class="hc-raise" fill="#EFDAD9" d="${raise.join('')}"/></svg>`
  );
}

// ---------------------------------------------------------------- outputs
const phoneWide = [6.5, 1.5, 12.5, 1.5 + 6 * PHONE_H]; // 1024 and up: phone 6u wide at x 6.5u, y 1.5u
const phoneNarrow = [4.5, 2, 12.5, 2 + 8 * PHONE_H]; // under 1024: phone 8u wide at x 4.5u, y 2u

const files = {
  'bg-chart-hero-wide.svg': chart({ id: 'hcw', level: 'screened', extra: ' hc-wide', rect: phoneWide }),
  'bg-chart-hero-narrow.svg': chart({ id: 'hcn', level: 'screened', extra: ' hc-narrow', rect: phoneNarrow }),
  'chart-bb-vs-btn-100.svg': chart({ id: 'hcf', level: 'full', labelText: DESCRIPTION }),
  'bg-chart-quiet.svg': urlFile('quiet', 624), // 48 px per cell
  'bg-chart-ghost.svg': urlFile('ghost', 832), // 64 px per cell, the default --chart-u-ghost
};

// Same settings as `npm run svg`, so a later run of it changes nothing.
let optimize = (s) => s;
try {
  const svgo = await import('svgo');
  const config = await svgo.loadConfig(join(root, 'svgo.config.mjs'));
  optimize = (s) => svgo.optimize(s, config).data;
} catch {
  console.warn('build-chart: svgo not found, writing unoptimized output (run npm run svg afterwards)');
}

let total = 0;
for (const [name, raw] of Object.entries(files)) {
  const svg = optimize(raw);
  files[name] = svg;
  writeFileSync(join(OUT, name), svg);
  total += Buffer.byteLength(svg);
  console.log(`${name.padEnd(28)} ${String(Buffer.byteLength(svg)).padStart(5)} bytes`);
}
console.log(`${'total'.padEnd(28)} ${String(total).padStart(5)} bytes`);

// Fade grids, printed so they can be compared with the two grids in DESIGN.md 7.1.
for (const [label, rect] of [['wide', phoneWide], ['narrow', phoneNarrow]]) {
  const rowsOut = [0, 1].map((r) => cells.filter((cell) => cell.r === r).map((cell) => fadeStep(cell, rect)).join(''));
  console.log(`${label} plate  row 0: ${rowsOut[0]}   rows 1-12: ${rowsOut[1]}`);
}

// ---------------------------------------------------------------- check: read the Full chart back and compare with the JSON
const full = files['chart-bb-vs-btn-100.svg'];
/** Horizontal line segments [x0, x1, y] of a path, whatever mix of absolute and relative commands svgo wrote. */
function horizontalSegments(d) {
  const out = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  const tokens = d.match(/[MmHhVvLlZz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let i = 0;
  let cmd = '';
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === 'Z' || cmd === 'z') {
      x = sx;
      y = sy;
    } else if (cmd === 'M' || cmd === 'm') {
      const dx = num();
      const dy = num();
      x = cmd === 'm' ? x + dx : dx;
      y = cmd === 'm' ? y + dy : dy;
      sx = x;
      sy = y;
      cmd = cmd === 'm' ? 'l' : 'L';
    } else if (cmd === 'H' || cmd === 'h') {
      const v = num();
      const nx = cmd === 'h' ? x + v : v;
      out.push([Math.min(x, nx), Math.max(x, nx), y]);
      x = nx;
    } else if (cmd === 'V' || cmd === 'v') {
      const v = num();
      y = cmd === 'v' ? y + v : v;
    } else if (cmd === 'L' || cmd === 'l') {
      const dx = num();
      const dy = num();
      const nx = cmd === 'l' ? x + dx : dx;
      const ny = cmd === 'l' ? y + dy : dy;
      if (ny === y) out.push([Math.min(x, nx), Math.max(x, nx), y]);
      x = nx;
      y = ny;
    }
  }
  return out;
}

const segments = (cls) => {
  const el = [...full.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`class="hc-${cls}"`));
  const d = /\bd="([^"]*)"/.exec(el ?? '')?.[1] ?? '';
  const map = new Map(); // `row:col` -> ink width in units
  for (const [x0, x1, y] of horizontalSegments(d)) {
    const row = Math.floor(y / U);
    for (let col = Math.floor(x0 / U); col * U < x1; col += 1) {
      const w = Math.min(x1, col * U + 100) - Math.max(x0, col * U);
      // inside a run the dashes are 96 wide, so a fully covered cell counts 96
      map.set(`${row}:${col}`, (map.get(`${row}:${col}`) ?? 0) + Math.min(w, 96));
    }
  }
  return map;
};
const raiseInk = segments('raise');
const callInk = segments('call');
let mismatches = 0;
for (const cell of cells) {
  const key = `${cell.r}:${cell.c}`;
  const r = (raiseInk.get(key) ?? 0) / 96;
  const c = (callInk.get(key) ?? 0) / 96;
  if (Math.abs(r - cell.raise) > 0.006 || Math.abs(c - cell.call) > 0.006) {
    mismatches += 1;
    console.error(`MISMATCH ${cell.hand}: json [fold,call,raise] ${JSON.stringify([cell.fold, cell.call, cell.raise])}, svg call ${n(c)} raise ${n(r)}`);
  }
}
console.log(`counts from JSON: ${JSON.stringify(count)}; legend ${pct.fold} fold, ${pct.call} call, ${pct.raise} raise`);
for (const hand of ['AA', 'T9s', '72o']) {
  const cell = cells.find((x) => x.hand === hand);
  const key = `${cell.r}:${cell.c}`;
  console.log(
    `${hand}: row ${cell.r}, col ${cell.c}, json [fold,call,raise] ${JSON.stringify([cell.fold, cell.call, cell.raise])}; ` +
      `svg ink at that cell: raise ${n(raiseInk.get(key) ?? 0)} of 96, call ${n(callInk.get(key) ?? 0)} of 96`,
  );
}
if (mismatches) fail(`${mismatches} cells differ between the JSON and the generated Full chart`);
console.log('Full chart read back against the JSON: 169 of 169 cells match');
