// build-deck.mjs: writes the Showdown deck, nine faces and one back, to src/assets/svg/deck/. Plain Node plus svgo (already a dev dependency).
// Run: node scripts/build-deck.mjs        Use: docs/site/DECK.md        Story: docs/site/SHOWDOWN.md
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/assets/svg/deck');
mkdirSync(OUT, { recursive: true });

let optimize = (s) => s;
try {
  const svgo = await import('svgo');
  const config = await svgo.loadConfig(join(root, 'svgo.config.mjs'));
  optimize = (s) => svgo.optimize(s, config).data;
} catch {
  console.warn('build-deck: svgo not found, writing unoptimized output');
}

const NS = 'xmlns="http://www.w3.org/2000/svg"';

// ============================================================ the card: 5 by 7 on the chart's 13, so 65 x 91 cells
const W = 65;
const H = 91;
const RADIUS = 4; // 6% of the width, close to a real card's 1/8 inch on 2.5 inches
const CX = W / 2;
const CY = H / 2;

// Colours, written out: the cards are <img> files, which cannot read the page's tokens. Values from src/styles/tokens.css; change them there and here together.
const FACE = '#fcfcfa'; // Face White, --text-inverse
const INK = '#12181b'; // Key Black, --surface-ink
const RED = '#ce1a2c'; // Pip Red, --primary
const LINE = '#a81222'; // Overprint Red, --primary-hover: lattice lines only
const EDGE = '#373c3f'; // Hairline round the card: --line-strong on ink, the only ground the deck sits on (the Showdown table)

// A file carries its own size rules: in an <img>, a width query measures the image (checked in Chrome and WebKit). Resolution queries do not reach inside an image, so the hairline is 1 px on every screen.
// The ace of diamonds' lattice and keyline are for a close look. Too small to see, they would only be noise.
const HAIR_STYLE = '<style>@media (max-width:199.98px){.pc-hair{display:none}}</style>';

const num = (v) => {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

// ============================================================ a small path kit: absolute segments, so a shape can be scaled, moved and turned 180 degrees
/** Parses absolute M L H V C Q A Z path data into segments of [command, ...numbers]. */
function parsePath(d) {
  const out = [];
  for (const [, cmd, args] of d.matchAll(/([MLHVCQAZz])([^MLHVCQAZz]*)/g)) {
    const n = (args.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
    const size = { M: 2, L: 2, C: 6, Q: 4, A: 7, Z: 0, z: 0 }[cmd];
    if (!size) {
      out.push(['Z']);
      continue;
    }
    for (let i = 0; i < n.length; i += size) out.push([i && cmd === 'M' ? 'L' : cmd, ...n.slice(i, i + size)]);
  }
  return out;
}
/** Applies f(x, y) to every point. Arcs keep their radii, so f may only scale evenly, move or turn 180 degrees. */
function mapPoints(segments, f, arcScale = 1) {
  return segments.map(([c, ...n]) => {
    if (c === 'Z') return [c];
    if (c === 'A') {
      const [x, y] = f(n[5], n[6]);
      return [c, n[0] * arcScale, n[1] * arcScale, n[2], n[3], n[4], x, y];
    }
    const pts = [];
    for (let i = 0; i < n.length; i += 2) pts.push(...f(n[i], n[i + 1]));
    return [c, ...pts];
  });
}
const toD = (segments) => segments.map(([c, ...n]) => c + n.map(num).join(' ')).join('');
const moved = (segments, s, x, y) => mapPoints(segments, (a, b) => [x + a * s, y + b * s], s);
const turned = (segments, x = CX, y = CY) => mapPoints(segments, (a, b) => [2 * x - a, 2 * y - b]);

// ============================================================ suits. The index uses the site's own icon-suit paths, on their 16 grid, centred on 8, 8.
const ICON = {
  s: parsePath('M8 1.25 2.23 6.47A3.75 3.75 0 1 0 8 11.12A3.75 3.75 0 1 0 13.77 6.47ZM7.2 10.6 5.4 14.75L10.6 14.75 8.8 10.6Z'),
  h: parsePath('M8 14.75 1.91 7.7A3.75 3.75 0 1 1 8 3.38A3.75 3.75 0 1 1 14.09 7.7Z'),
  d: parsePath('M8 1 13.5 8 8 15 2.5 8Z'),
  c: parsePath(
    'M8 1.4A3.2 3.2 0 1 1 8 7.8A3.2 3.2 0 1 1 8 1.4ZM4.4 6.4A3.2 3.2 0 1 1 4.4 12.8A3.2 3.2 0 1 1 4.4 6.4ZM11.6 6.4A3.2 3.2 0 1 1 11.6 12.8A3.2 3.2 0 1 1 11.6 6.4ZM8 4.6 11.6 9.6 8.6 9.6 10.3 14.75 5.7 14.75 7.4 9.6 4.4 9.6Z',
  ),
};
const SUIT_COLOUR = { s: INK, c: INK, h: RED, d: RED };

// The big suits for the aces and the pips: the same silhouettes, redrawn with curves that hold at full height on a large screen. Unit box: 100 wide, centred on 0, 0.
const BIG = {
  s: parsePath(
    'M0-60C5-42 26-27 38-13C47-3 50 6 50 15C50 31 38 42 24 42C15 42 8 38 3.5 32C4 44 9 53 21 60L-21 60C-9 53-4 44-3.5 32C-8 38-15 42-24 42C-38 42-50 31-50 15C-50 6-47-3-38-13C-26-27-5-42 0-60Z',
  ),
  h: parsePath(
    'M0-27C6-40 17-47 28-47C41-47 50-36 50-22C50 4 19 24 0 51C-19 24-50 4-50-22C-50-36-41-47-28-47C-17-47-6-40 0-27Z',
  ),
  c: parsePath(
    'M0-56A26 26 0 1 1 0-4A26 26 0 1 1 0-56ZM-26.5-14A26 26 0 1 1-26.5 38A26 26 0 1 1-26.5-14ZM26.5-14A26 26 0 1 1 26.5 38A26 26 0 1 1 26.5-14ZM0-30 26 12 7 12C7 30 11 47 22 60L-22 60C-11 47-7 30-7 12L-26 12Z',
  ),
  d: parsePath('M0-63.6 50 0 0 63.6-50 0Z'),
};

// ============================================================ corner index: rank in Sofia Sans Extra Condensed 800, real outlines, so no font loads and nothing swaps
// Glyphs are font units (1000 to the em, y up), read from src/assets/fonts/sofia-sans-extra-condensed-800.woff2 (SIL OFL 1.1).
// `1` is the font's own 1 without its foot, which is what lets "10" fit the index column beside the pips.
const GLYPH = {
  A: { ink: [1, 428], d: 'M9 0Q-1 0 1 13L136 646Q138 655 147 655L281 655Q291 655 293 646L427 13Q430 0 420 0L305 0Q296 0 294 9L234 398Q229 432 224 466.5Q219 501 215 535L213 535Q208 501 204 466.5Q200 432 194 397L132 9Q131 0 121 0ZM134 136L151 237L274 237L293 136Z' },
  K: { ink: [39, 433], d: 'M49 0Q39 0 39 12L39 643Q39 655 49 655L153 655Q163 655 163 643L163 502Q163 482 162 455Q161 428 160 401.5Q159 375 157 354L159 354Q169 385 180.5 422.5Q192 460 211 501L280 649Q282 655 291 655L407 655Q420 655 413 641L291 382L431 14Q437 0 424 0L301 0Q293 0 290 8L203 272L163 195L163 12Q163 0 153 0Z' },
  Q: { ink: [31, 420], d: 'M316-182Q277-182 251-160.5Q225-139 212.5-91.5Q200-44 200 33Q200 39 203.5 42Q207 45 211 45L295 46Q304 46 304 34Q304-15 308-41Q312-67 320-76.5Q328-86 340-86Q349-86 355-84.5Q361-83 367-81Q377-78 377-91L377-157Q377-169 369-172Q362-176 348.5-179Q335-182 316-182ZM225-6Q130-6 80.5 49Q31 104 31 211L31 442Q31 551 80.5 606Q130 661 225 661Q320 661 370 606Q420 551 420 442L420 211Q420 104 370 49Q320-6 225-6ZM225 106Q262 106 279 131.5Q296 157 296 216L296 438Q296 498 279 523.5Q262 549 225 549Q189 549 171.5 523.5Q154 498 154 438L154 216Q154 157 171.5 131.5Q189 106 225 106Z' },
  J: { ink: [-15, 163], d: 'M24-155Q15-158 12-147L-14-64Q-16-57-14.5-53Q-13-49-9-48Q7-41 18-28.5Q29-16 34 9.5Q39 35 39 79L39 643Q39 655 49 655L153 655Q163 655 163 643L163 84Q163 10 147-39.5Q131-89 100.5-116.5Q70-144 24-155Z' },
  9: { ink: [27, 384], d: 'M206-6Q125-6 83 36Q41 78 41 158Q41 170 54 170L142 170Q154 170 154 158Q154 130 166 114.5Q178 99 204 99Q236 99 249 118.5Q262 138 262 185L262 460Q262 513 250 534.5Q238 556 207 556Q175 556 161.5 533Q148 510 148 447L148 429Q148 378 159.5 356.5Q171 335 198 335Q216 335 235.5 343.5Q255 352 276 369L275 279Q246 258 214.5 247Q183 236 152 236Q87 236 57 283Q27 330 27 432Q27 553 70 607Q113 661 205 661Q297 661 340.5 611.5Q384 562 384 459L384 195Q384 94 339.5 44Q295-6 206-6Z' },
  1: { ink: [26, 247], d: 'M139 0Q127 0 127 12L127 524L38 491Q33 490 29.5 492Q26 494 26 500L26 581Q26 591 36 594L197 655Q204 658 210 658L235 658Q247 658 247 647L247 12Q247 0 235 0Z' },
  0: { ink: [29, 387], d: 'M208-6Q120-6 74.5 45Q29 96 29 194L29 461Q29 560 74.5 610.5Q120 661 208 661Q296 661 341.5 610.5Q387 560 387 461L387 194Q387 96 341.5 45Q296-6 208-6ZM208 101Q238 101 251.5 124Q265 147 265 197L265 458Q265 508 251.5 531Q238 554 208 554Q178 554 164.5 531Q151 508 151 458L151 197Q151 147 164.5 124Q178 101 208 101Z' },
};
const CAP = 655;
const INDEX = {
  top: 3.5, // Top of the rank
  cap: 14, // Rank cap height, in cells: 13 px on a card 60 px wide
  column: 7.2, // Centre line of the rank and the suit
  gap: 2.6, // Rank baseline to the top of the suit: the tails of J and Q curl past the point of the diamond
  suit: 0.72, // Icon units to cells
};
// Two ranks sit off the column on purpose: Q so its tail clears the diamond's shoulder, "10" because it is wide and has the card's edge on one side and a pip on the other.
const RANK_SHIFT = { Q: -0.8, T: 1 };
const TEN = { gap: 30, squeeze: 0.9 }; // Font units between the 1 and the 0, and how much "10" alone is narrowed to clear the pips
function rankSegments(rank) {
  const s = INDEX.cap / CAP;
  const baseline = INDEX.top + INDEX.cap;
  const glyphs = rank === 'T' ? [[GLYPH[1], 0], [GLYPH[0], GLYPH[1].ink[1] + TEN.gap - GLYPH[0].ink[0]]] : [[GLYPH[rank], 0]];
  const outline = glyphs.flatMap(([glyph, dx]) => mapPoints(parsePath(glyph.d), (x, y) => [x + dx, y]));
  const [last, lastDx] = glyphs.at(-1);
  const middle = (glyphs[0][0].ink[0] + last.ink[1] + lastDx) / 2;
  const squeeze = rank === 'T' ? TEN.squeeze : 1;
  const column = INDEX.column + (RANK_SHIFT[rank] ?? 0);
  return mapPoints(outline, (x, y) => [column + (x - middle) * s * squeeze, baseline - y * s]);
}
function suitSegments(suit) {
  const y = INDEX.top + INDEX.cap + INDEX.gap;
  const top = { s: 1.25, h: 2, d: 1, c: 1.4 }[suit]; // Ink top of each icon on its 16 grid
  return mapPoints(ICON[suit], (a, b) => [INDEX.column + (a - 8) * INDEX.suit, y + (b - top) * INDEX.suit], INDEX.suit);
}
/** The two corner indexes. The end copy is baked into its path data, not a transform, so a CSS transform on .pc-index stays free for a section. */
function cornerIndexes(rank, suit) {
  const a = [...rankSegments(rank), ...suitSegments(suit)];
  return `<path class="pc-index" d="${toD(a)}"/><path class="pc-index pc-index--end" d="${toD(turned(a))}"/>`;
}

// ============================================================ pips: traditional layouts, computed
const PIP = { columns: 12, rows: [-27.3, -9.1, 9.1, 27.3] }; // Offsets from the card's centre: rows at 20, 40, 60 and 80 percent of the height
/** [x, y, upright] for each pip of a 9 or a 10. Pips below the centre turn over; the centre pip of a 9 stays upright, as on a real card. */
function pipLayout(count) {
  const spots = [];
  for (const row of PIP.rows) for (const col of [-PIP.columns, PIP.columns]) spots.push([CX + col, CY + row, row < 0]);
  if (count === 9) spots.push([CX, CY, true]);
  if (count === 10) spots.push([CX, CY - 18.2, true], [CX, CY + 18.2, false]);
  return spots;
}
function pipsPath(suit, count, scale) {
  return toD(
    pipLayout(count).flatMap(([x, y, up]) => {
      const pip = moved(BIG[suit], scale, x, y);
      return up ? pip : turned(pip, x, y);
    }),
  );
}

// ============================================================ the bitmaps: trace cells into one merged path, no seams, h and v steps only
/** Outline of the true cells, clockwise, merged. Same method as the mark in build-art.mjs. */
function trace(isOn, cols, rows, ox = 0, oy = 0) {
  const edges = new Map();
  const add = (a, b) => {
    const k = `${a}`;
    if (!edges.has(k)) edges.set(k, []);
    edges.get(k).push(b);
  };
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!isOn(x, y)) continue;
      if (!isOn(x, y - 1)) add([x, y], [x + 1, y]);
      if (!isOn(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
      if (!isOn(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
      if (!isOn(x - 1, y)) add([x, y + 1], [x, y]);
    }
  }
  let d = '';
  while (edges.size) {
    const first = [...edges.keys()][0];
    let cur = first.split(',').map(Number);
    d += `M${cur[0] + ox} ${cur[1] + oy}`;
    let dir = null;
    let run = 0;
    const flush = () => {
      if (run) d += `${dir}${run}`;
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

// ============================================================ the courts. Three inks of one print: . Face White, # Key Black, r Pip Red.
// Each portrait is 39 cells wide, the middle 3 of the card's 5 units. Rows go past the middle because the stepped diagonal decides where the top figure ends.
// Only the top figure is written down. The other end is the same figure turned 180 degrees about the centre cell, so the card is point-symmetric by construction.
// All three look right on purpose: in the royal fan, 10 J Q K A, they are side-eyeing the ace.
const COURT = { x: 13, y: 6, cols: 39, rows: 79 };
const MID = { x: 19, y: 39 };
/** The diagonal that splits the two ends: it climbs one row every 3 columns, 13 rows across the panel. */
const split = (x) => MID.y + Math.round((MID.x - x) / 3);

const KING = [
  '.......................................',
  '....................#..............#...',
  '....r..............#r#............#r#..',
  '...rrr..............#............#rrr#.',
  '..rrrrr....#.......###.......#....#r#..',
  '.rrrrrrr..#r#.....#rrr#.....#r#....#...',
  '..rrrrr....#.....#rrrrr#.....#.....#...',
  '...rrr....###...#rrrrrrr#...###....#...',
  '....r....#rrr#.#rrrrrrrrr#.#rrr#...#...',
  '.........#rrrr#rrrrr.rrrrr#rrrr#...#...',
  '.........#rrrrrrrrr...rrrrrrrrr#...#...',
  '.........#rr.rrrrr.....rrrrr.rr#...#...',
  '.........#rrrrrrrrr...rrrrrrrrr#...#...',
  '.........#rrrrrrrrrr.rrrrrrrrrr#...#...',
  '.........#######################...#...',
  '.........#.#.#.#.#.#.#.#.#.#.#.#...#...',
  '.........#######################...#...',
  '.........#####.............#####...#...',
  '........#####.#####...#####.#####..#...',
  '........#####....##......##.#####..#...',
  '.........####....##......##.####...#...',
  '.........####.......#.......####...#...',
  '........#####......###......#####..#...',
  '........######.###########.######..#...',
  '.........#########.rrr.#########...#...',
  '.........##########...##########...#...',
  '.......###########################.#...',
  '.....###...###################...###...',
  '...###......####.#######.####......###.',
  '.###..#....#.####.#####.####.#....#.###',
  '##....#....#...#####.#####...#....#..##',
  '#..#....#....#...#######.......#....#.#',
  '#..#....#....#.....###.........#....#.#',
  '#.....#....#....#...#...#....#....#...#',
  '#######################################',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrrr#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrr#r#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrr#r.r#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rr#r...r#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrr#r.r#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrr#r#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrrr#rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
];
const QUEEN = [
  '.......................................',
  '....................#..................',
  '....r..............#r#..........#.#.#..',
  '...rrr..............#..........#r#r#r#.',
  '..rrrrr.......#.....#.....#....#rrrrr#.',
  '.rrrrrrr.....#r#...#r#...#r#...#rrrrr#.',
  '..rrrrr.......#...#rrr#...#.....#rrr#..',
  '...rrr.......#r#.#rrrrr#.#r#.....###...',
  '....r......###rr#rrrrrrr#rr###....#....',
  '..........####rrrrrr.rrrrrr####...#....',
  '.........#####rr.rr...rr.rr#####..#....',
  '.........#####rrrrrr.rrrrrr#####..#....',
  '........#########################.###..',
  '........###########...###########.#.##.',
  '........######.##.......##.######.#....',
  '........#####.##.........##.#######....',
  '........####.##..##...##..##.####.#....',
  '........######..#.......#..######.#....',
  '........######.####...####.######.#....',
  '........######...##.....##.######.#....',
  '........######...##.....##.######.#....',
  '........####.#.............#.####.#....',
  '........###.r.......#.......r.###.#....',
  '........####.#......##.....#.####.#....',
  '........######.............######.#....',
  '........######.....r.r..#..######.#....',
  '........######....rrrrr....######.#....',
  '........########...rrr...########.#....',
  '........#########.......#########.#....',
  '.........#########.....#########..#....',
  '..........######.r.....r.######...#....',
  '...........###...r.....r...###....#....',
  '.........rrr#.....r...r.....#rrr..#....',
  '....rrrrrrrr#......rrr......#rrrrrrrr..',
  '#######################################',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrr.rrr.rrr.rrrrrrrrrrrrrrrrrrr.rrr.rrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'r.rrr.rrr.rrrrrrrrrrrrrrrrrrr.rrr.rrr.r',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrr.rrr.rrr.rrrrrrrrrrrrrrrrrrr.rrr.rrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'r.rrr.rrr.rrrrrrrrrrrrrrrrrrr.rrr.rrr.r',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
  'rrr.rrr.rrr.rrrrrrrrrrrrrrrrrrr.rrr.rrr',
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
];
const JACK = [
  '.......................................',
  '.....................................#.',
  '....r..............................###.',
  '...rrr..........##########.......#####.',
  '..rrrrr......###rrrrrrrrrr###...######.',
  '.rrrrrrr...##rrrrrrrrrrrrrrrr#.##.###..',
  '..rrrrr...#rrrrrrrrrrrrrrrrrrr##.###...',
  '...rrr...#rrrrrrrrrrrrrrrrrrr##.###....',
  '....r...#rrrrrrrrrrrrrrrrrrrr#.###.....',
  '.......#rrrrrrrrrrrrrrrrrrrr#.###......',
  '......#rrrrrrrrrrrrrrrrrrrrr.###.......',
  '......#rrrr#####################.......',
  '......###########################......',
  '.........#.#.#.#.#.#.#.#.#.#.#.##......',
  '.........########################......',
  '...........###################.........',
  '..........#####################........',
  '..........#####.......#########....#...',
  '.........#####.####..#.....#####..###..',
  '.........#####...##.....##.#####...#...',
  '.........#####...##.....##.#####...#...',
  '.........#####......#......#####...#...',
  '.........#####.rr...##...rr#####...#...',
  '.........#####........##...#####...#...',
  '.........#####...#####.....#####...#...',
  '..........#####...........#####..#####.',
  '...........#####.........#####.....#...',
  '.............#####.....#####.......#...',
  '..........##..##..######..##..##...#...',
  '.........#..##..##..##..##..##.....#...',
  '........##..##..##..##..##..##..##.#...',
  '...#####..##..##..##..##..##..##..###..',
  '.######################################',
  '#r...rrr...rrr...rrr...rrr...rrr...rrr#',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
  'rr...rrr...rrr...rrr...rrr...rrr...rrr.',
];

function courtBody(code, bitmap) {
  bitmap.forEach((row, i) => {
    if (row.length !== COURT.cols) throw new Error(`${code}: row ${i} is ${row.length} wide, not ${COURT.cols}`);
    if (/[^.#r]/.test(row)) throw new Error(`${code}: row ${i} holds an unknown ink`);
  });
  for (let x = 0; x < COURT.cols; x += 1) {
    if (split(x) > bitmap.length) throw new Error(`${code}: the figure must reach row ${split(x)} at column ${x}`);
  }
  // The cell belongs to the written end when it sits above the diagonal, or on the diagonal's left half. The diagonal is one black rule; the centre cell is Pip Red.
  const onLine = (x, y) => {
    if (y === split(x)) return true;
    // At each step of the stair the rule turns a square corner, so it reads as one line and not as dashes. Only the right half needs saying: the turn makes the left.
    if (y === split(x) - 1 && x > MID.x && split(x + 1) === y) return true;
    return x < MID.x && y === split(x) + 1 && split(x - 1) === y;
  };
  const mine = (x, y) => y < split(x) || (y === split(x) && x < MID.x);
  const ink = (x, y) => {
    if (x < 0 || y < 0 || x >= COURT.cols || y >= COURT.rows || !mine(x, y)) return '.';
    const away = Math.abs(x - MID.x) + Math.abs(y - MID.y);
    if (away <= 2) return '.'; // The brooch: a small diamond of stock round the centre cell
    if (away === 3) return '#';
    if (onLine(x, y)) return '#';
    return bitmap[y]?.[x] ?? '.';
  };
  // Red prints first and runs under any black it touches, so no hairline of stock shows between the two inks when the art is antialiased (a printer's trap).
  const black = (x, y) => ink(x, y) === '#';
  const red = (x, y) => ink(x, y) === 'r';
  const redTrapped = (x, y) => red(x, y) || (black(x, y) && (red(x - 1, y) || red(x + 1, y) || red(x, y - 1) || red(x, y + 1)));
  const rd = trace(redTrapped, COURT.cols, COURT.rows, COURT.x, COURT.y);
  const bd = trace(black, COURT.cols, COURT.rows, COURT.x, COURT.y);
  const id = `pc-${code}-end`;
  const frame = `M${COURT.x} ${COURT.y}h${COURT.cols}v${COURT.rows}H${COURT.x}z`;
  const centre = `M${COURT.x + MID.x} ${COURT.y + MID.y}h1v1h-1z`;
  return (
    `<path class="pc-frame" fill="none" stroke="${INK}" stroke-width=".2" d="${frame}"/>` +
    // Antialiased: every card on the table is scaled and most are turned, where crisp edges would drop rows.
    `<g class="pc-court"><g id="${id}"><path fill="${RED}" d="${rd}"/><path fill="${INK}" d="${bd}"/></g>` +
    `<use href="#${id}" transform="rotate(180 ${CX} ${CY})"/><path fill="${RED}" d="${centre}"/></g>`
  );
}

// ============================================================ the hero: the ace of diamonds is the chart's 13 x 13 grid, turned and drawn to the shape of the pip
function diamondLattice(scale) {
  const hw = 50 * scale;
  const hh = 63.6 * scale;
  const n = 13;
  const top = [CX, CY - hh];
  const right = [CX + hw, CY];
  const bottom = [CX, CY + hh];
  const left = [CX - hw, CY];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  let d = '';
  for (let i = 1; i < n; i += 1) {
    const t = i / n;
    const a = lerp(top, right, t);
    const b = lerp(left, bottom, t);
    const c = lerp(top, left, t);
    const e = lerp(right, bottom, t);
    d += `M${num(a[0])} ${num(a[1])}L${num(b[0])} ${num(b[1])}M${num(c[0])} ${num(c[1])}L${num(e[0])} ${num(e[1])}`;
  }
  const rhomb = (w, h) => `M${num(CX)} ${num(CY - h)}L${num(CX + w)} ${num(CY)}L${num(CX)} ${num(CY + h)}L${num(CX - w)} ${num(CY)}Z`;
  // Cell 6, 6 is the cell the mark prints red, the middle of the chart. Inside the red it is the one cell of stock. A keyline round the pip, a printer's rule, holds the hero apart from the other aces.
  const key = (hw + 2.4) / hw;
  return (
    `<g class="pc-fine" fill="none"><path class="pc-hair" stroke="${LINE}" stroke-width=".14" d="${d}"/><path class="pc-cell" fill="${FACE}" d="${rhomb(hw / n, hh / n)}"/>` +
    `<path class="pc-hair" stroke="${RED}" stroke-width=".18" d="${rhomb(hw * key, hh * key)}"/></g>`
  );
}

// ============================================================ the back: the site's lattice in Pip Red, the printed frame, the footer's medallion
function backLattice() {
  const tile = W / 13; // 13 diamonds across, the chart's 13
  const r = RADIUS;
  const inCorner = (x, y) => {
    const dx = Math.max(r - x, x - (W - r), 0);
    const dy = Math.max(r - y, y - (H - r), 0);
    return dx > 0 && dy > 0 && dx * dx + dy * dy > (r - 0.3) * (r - 0.3);
  };
  // Lines run at 45 degrees and are centred on the card, so the pattern is the same from both ends. Each is walked to the edge and stopped short inside a rounded corner.
  const line = (x0, y0, sx) => {
    let t0 = -200;
    let t1 = 200;
    const clip = (p, d, lo, hi) => {
      const a = (lo - p) / d;
      const b = (hi - p) / d;
      t0 = Math.max(t0, Math.min(a, b));
      t1 = Math.min(t1, Math.max(a, b));
    };
    clip(x0, sx, 0, W);
    clip(y0, 1, 0, H);
    if (t0 >= t1) return '';
    const at = (t) => [x0 + sx * t, y0 + t];
    while (t0 < t1 && inCorner(...at(t0))) t0 += 0.05;
    while (t1 > t0 && inCorner(...at(t1))) t1 -= 0.05;
    if (t1 - t0 < 0.5) return '';
    return `M${num(at(t0)[0])} ${num(at(t0)[1])}L${num(at(t1)[0])} ${num(at(t1)[1])}`;
  };
  let d = '';
  for (let k = -30; k <= 30; k += 1) {
    d += line(CX + k * tile, CY, 1);
    d += line(CX + k * tile, CY, -1);
  }
  return d;
}

// The mark, DESIGN.md 7.4. On the back its red cell lands on the card's centre cell, the same cell the courts print red, so it stays put through a flip.
const MARK = [
  '......#......',
  '.....###.....',
  '....#####....',
  '...#######...',
  '..#########..',
  '.###########.',
  '######@######',
  '#############',
  '#############',
  '.###.###.###.',
  '.....###.....',
  '....#####....',
  '...#######...',
];
function backBody() {
  const inset = 5;
  const plate = 26; // Side of the Face White square, 13 x 2, so the mark inside lands on whole cells of the card
  const mx = Math.floor(CX) - 6;
  const my = Math.floor(CY) - 6;
  const spade = trace((x, y) => (MARK[y]?.[x] ?? '.') !== '.', 13, 13, mx, my);
  return (
    `<rect class="cb-ground" width="${W}" height="${H}" rx="${RADIUS}" fill="${RED}"/>` +
    `<path class="cb-lattice" fill="none" stroke="${LINE}" stroke-width=".36" d="${backLattice()}"/>` +
    `<rect class="pc-edge" width="${W}" height="${H}" rx="${RADIUS}" fill="none" stroke="${EDGE}" vector-effect="non-scaling-stroke"/>` +
    `<rect class="cb-frame" x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" rx="2" fill="none" stroke="${FACE}" stroke-width="1"/>` +
    `<rect class="med-plate" x="${CX - plate / 2}" y="${CY - plate / 2}" width="${plate}" height="${plate}" rx="2" fill="${FACE}" transform="rotate(45 ${CX} ${CY})"/>` +
    `<g class="med-mark"><path class="mark-spade" fill="${INK}" d="${spade}"/><path class="mark-cell" fill="${RED}" d="M${mx + 6} ${my + 6}h1v1h-1z"/></g>`
  );
}

// ============================================================ the nine faces and the back
function face(code, body, style = '') {
  const rank = code[0];
  const suit = code[1];
  const colour = SUIT_COLOUR[suit];
  return (
    `<svg ${NS} viewBox="0 0 ${W} ${H}" fill="${colour}" aria-hidden="true">${style}` +
    `<rect class="pc-ground pc-edge" width="${W}" height="${H}" rx="${RADIUS}" fill="${FACE}" stroke="${EDGE}" vector-effect="non-scaling-stroke"/>` +
    body +
    cornerIndexes(rank, suit) +
    '</svg>'
  );
}

const ACE_SCALE = { s: 0.42, c: 0.4, h: 0.43, d: 0.38 };
const CARDS = {
  'card-as': face('As', `<path class="pc-pip" d="${toD(moved(BIG.s, ACE_SCALE.s, CX, CY))}"/>`),
  'card-ac': face('Ac', `<path class="pc-pip" d="${toD(moved(BIG.c, ACE_SCALE.c, CX, CY - 1))}"/>`),
  'card-ah': face('Ah', `<path class="pc-pip" d="${toD(moved(BIG.h, ACE_SCALE.h, CX, CY - 1))}"/>`),
  'card-ad': face('Ad', `<path class="pc-pip" d="${toD(moved(BIG.d, ACE_SCALE.d, CX, CY))}"/>${diamondLattice(ACE_SCALE.d)}`, HAIR_STYLE),
  'card-9c': face('9c', `<path class="pc-pip" d="${pipsPath('c', 9, 0.118)}"/>`),
  'card-td': face('Td', `<path class="pc-pip" d="${pipsPath('d', 10, 0.11)}"/>`),
  'card-kd': face('Kd', courtBody('Kd', KING)),
  'card-qd': face('Qd', courtBody('Qd', QUEEN)),
  'card-jd': face('Jd', courtBody('Jd', JACK)),
  'card-back': `<svg ${NS} viewBox="0 0 ${W} ${H}" aria-hidden="true">${backBody()}</svg>`,
};

let total = 0;
for (const [name, svg] of Object.entries(CARDS)) {
  const out = optimize(svg);
  writeFileSync(join(OUT, `${name}.svg`), out);
  const bytes = Buffer.byteLength(out);
  total += bytes;
  console.log(`${name.padEnd(12)} ${String(bytes).padStart(6)}`);
  if (bytes > 6144) console.error(`${name} is over 6 KB`);
}
console.log(`${'total'.padEnd(12)} ${String(total).padStart(6)}  (${Object.keys(CARDS).length} files)`);
