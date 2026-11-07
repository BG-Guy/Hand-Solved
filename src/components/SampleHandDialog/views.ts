// views.ts: HTML for the two views of pop-up 1 (choose, verdict), built from a Hand. No style attributes anywhere (the page's CSP blocks them); bar widths are set afterwards by SampleHandDialog.ts.
import type { Unit } from './format';
import { cardWords, verdict, type Hand, type Opt } from './hands';
import { chip } from './table';

const SLUG: Record<string, string> = { 'Best move': 'best', Good: 'good', Inaccuracy: 'inaccuracy', Mistake: 'mistake', Blunder: 'blunder' };
const NOTE: Record<string, string> = {
  best: 'Nothing to cross out.',
  good: 'A tick in the margin.',
  inaccuracy: 'A small note in the margin.',
  mistake: 'Circled in red.',
  blunder: 'Struck out, better play written in.',
};

const chips = (codes: string[]) => codes.map((code) => chip(code, cardWords(code))).join(' ');

/** A sprite icon at 16 px, drawn the way Icon.astro draws one (SampleHandDialog.astro prints the sprite). */
const icon = (name: string) => `<svg class="icon" width="16" height="16" aria-hidden="true" focusable="false"><use href="#hs-${name}"/></svg>`;

/**
 * Choose view: the decision first (heading, the setup line that names the cards, board, pot and bet, the question, the hint, one real button per option),
 * then the hand's strength and story behind a disclosure, so the first button is on a phone's first screen. The disclosure's open state is the script's (width).
 * The cue is a pointer convenience for a phone: the script shows it only while the first button is out of sight. The buttons are the next Tab stop anyway,
 * so it is out of the Tab order and the accessibility tree.
 */
export function choose(hand: Hand, unit: Unit): string {
  const setup = hand.setup(unit).replace('{hero}', chips(hand.spot.hero)).replace('{board}', chips(hand.spot.board));
  const buttons = hand.opts
    .map((o, k) => `<button type="button" class="hs-choice" data-pick="${k}"><span class="hs-choice__l">${o.label(unit)}</span><span class="hs-choice__s">${o.sub}</span></button>`)
    .join('');
  return (
    `<h3 class="hs-h" tabindex="-1" data-focus>${hand.heading}</h3>` +
    `<p class="hs-setup">${setup}</p>` +
    `<p class="hs-q" id="hs-q">${hand.question(unit)}</p>` +
    '<p class="hs-hint">Pick one. You can try the others afterwards.</p>' +
    `<div class="hs-choices" role="group" aria-labelledby="hs-q" data-n="${hand.opts.length}">${buttons}</div>` +
    `<details class="hs-disc hs-how" data-how><summary>How the hand got here${icon('chevron-down')}</summary><p>${hand.strength}</p><p>${hand.story(unit)}</p></details>` +
    `<button type="button" class="hs-cue" data-cue hidden aria-hidden="true" tabindex="-1">Pick your move${icon('arrow-down')}</button>`
  );
}

/** What you played, marked the way a teacher marks it (docs/site/DESIGN.md 7.6). */
function played(hand: Hand, opt: Opt, unit: Unit, fx: string): string {
  const text = opt.label(unit);
  if (opt.best) return text;
  const grade = SLUG[opt.raw.grade];
  if (grade === 'blunder') {
    return `<del class="pen${fx}">${text}<span class="visually-hidden"> (struck out)</span></del><ins class="pen"><span class="visually-hidden"> GTO plays </span>${hand.best.label(unit)}</ins>`;
  }
  // good: a tick after the text, inaccuracy: a wave under it, mistake: a ring around it (icon-pen-*).
  const mark = { good: 'tick', inaccuracy: 'wave', mistake: 'ring' }[grade];
  return `<span class="pen pen--${mark}">${text}<svg class="pen__m" aria-hidden="true"><use href="#hs-pen-${mark}"/></svg></span>`;
}

/** The part of the verdict that changes when another option is shown: stamp, heading, sentence, You and GTO cards, tiles. */
export function verdictTop(hand: Hand, opt: Opt, unit: Unit, fx: boolean): string {
  const isNew = fx ? ' is-new' : '';
  const { grade, score } = opt.raw;
  const slug = SLUG[grade];
  const text = verdict(hand, opt, unit);
  const tile = (name: string, value: string) => `<div><dt>${name}</dt><dd>${value}</dd></div>`;
  const tiles =
    tile('Pot', hand.pot(unit)) +
    (hand.spot.toCallDollars > 0 ? tile('To call', hand.call(unit)) : '') +
    (hand.spot.equityNeeded ? tile('Equity needed', hand.spot.equityNeeded) : '') +
    tile('Your equity', hand.spot.equity) +
    tile('Given up', opt.given(unit));
  return (
    '<div class="hs-vtop" aria-hidden="true">' +
    `<p class="stamp stamp--${slug}${isNew}"><svg class="hs-ic" aria-hidden="true"><use href="#hs-grade-${slug}"/></svg><span class="stamp__n">${grade}</span><span class="stamp__s">${score}</span></p>` +
    `<p class="hs-note">${NOTE[slug]}</p></div>` +
    `<h3 class="hs-vh" id="hs-vh" tabindex="-1" aria-describedby="hs-vs" data-focus>${text.heading}</h3>` +
    `<p class="hs-vs" id="hs-vs">${text.sentence}</p>` +
    '<div class="hs-ycards">' +
    `<div class="hs-yc"><p class="hs-lab">You</p><p class="hs-val">${played(hand, opt, unit, isNew)}</p></div>` +
    `<div class="hs-yc${opt.best ? '' : ' is-pen'}"><p class="hs-lab">GTO</p><p class="hs-val">${hand.best.label(unit)}</p></div>` +
    `</div><dl class="hs-tiles">${tiles}</dl>`
  );
}

/** Verdict view: the top, the options list (a button per row, for what-if), the engine's bullets, and a slot for the grade explainer. */
export function verdictView(hand: Hand, shown: number, unit: Unit, fx: boolean): string {
  const rows = hand.opts
    .map((o, k) => {
      const flags = `${o.best ? ' is-gto' : ''}${k === shown ? ' is-you' : ''}`;
      return (
        `<button type="button" class="hs-opt${flags}" data-show="${k}" aria-pressed="${k === shown}">` +
        `<span class="hs-opt__n">${o.label(unit)}` +
        (o.best ? ' <span class="tag tag--gto">GTO<span class="visually-hidden">, the top choice</span></span>' : '') +
        `<span class="tag tag--you"${k === shown ? '' : ' hidden'}>You</span></span>` +
        `<span class="hs-opt__f"><span class="bar${fx ? ' is-new' : ''}"><span class="bar__f" data-f="${o.raw.frequency}"></span></span><span class="hs-opt__p"><span class="visually-hidden">GTO plays it </span>${o.freq}</span></span>` +
        `<span class="hs-opt__w${o.raw.ev < 0 ? ' is-neg' : ''}"><span class="visually-hidden">Worth </span>${o.worth(unit)}</span></button>`
      );
    })
    .join('');
  return (
    `<div data-top>${verdictTop(hand, hand.opts[shown], unit, fx)}</div>` +
    '<div class="hs-opts" role="group" aria-label="Options and how often GTO plays them">' +
    '<p class="hs-oh" aria-hidden="true"><span>Option</span><span>GTO plays it</span><span>Worth</span></p>' +
    `${rows}</div><p class="hs-hint">Tap any option to see how it would have graded.</p>` +
    `<ul class="hs-bullets">${hand.bullets(unit).map((b) => `<li>${b}</li>`).join('')}</ul><div data-explain></div>`
  );
}
