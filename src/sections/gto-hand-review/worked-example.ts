// worked-example.ts: build time only. The first sample hand in src/data/demo-spots.json as the numbers and words the review page prints, so the page is complete with scripts off.
// Every figure is formatted by the pop-up's own rules (components/SampleHandDialog/format.ts): big blinds, half up to one decimal, pots in whole big blinds, a real minus sign.
// Nothing here changes a number or a grade. Where COPY.md writes the same words out ("Worked example"), the result is compared with them and the build stops if the data has moved,
// so a re-run of the engine can never leave a sentence that disagrees with its table.
import data from '../../data/demo-spots.json';
import { labelAmount, labelText, money, percent } from '../../components/SampleHandDialog/format';
import { buildHands, cardWords } from '../../components/SampleHandDialog/hands';
import { table } from '../../components/SampleHandDialog/table';

interface RawOption {
  label: string;
  type: string;
  frequency: number;
  ev: number;
  best: boolean;
  actual: boolean;
  score: number;
  grade: string;
  givenUpDollars: number;
}

interface RawSpot {
  id: string;
  stakes: string;
  bigBlindDollars: number;
  position: string;
  hero: string[];
  board: string[];
  street: string;
  handClass: string;
  potDollars: number;
  toCallDollars: number;
  equityNeeded: string | null;
  equity: string;
  options: RawOption[];
}

export type GradeSlug = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export interface Card {
  rank: string;
  suit: 'spade' | 'heart' | 'diamond' | 'club';
  /** "8 of hearts": the words a screen reader hears in place of the symbols. */
  name: string;
}

export interface Option {
  /** "Fold", "Call 65 bb". */
  label: string;
  /** "96%". */
  freq: string;
  /** The same figure as a whole number, for the width of its bar. */
  freqPercent: number;
  /** "0 bb", "−62.6 bb". */
  worth: string;
  negative: boolean;
  /** "Best move", "Blunder". */
  grade: string;
  slug: GradeSlug;
  score: number;
  /** What this option gives up against the best one: "0 bb", "62.6 bb". */
  given: string;
  best: boolean;
  /** The option the recorded hand took. */
  you: boolean;
}

const spot = (data as unknown as { spots: RawSpot[] }).spots[0];
if (!spot) throw new Error('worked example: src/data/demo-spots.json has no first spot');

const bb = spot.bigBlindDollars;
const inBb = (dollars: number, sign = false, whole = false) => money(dollars, bb, 'bb', sign, whole);

const SUITS = { s: 'spade', h: 'heart', d: 'diamond', c: 'club' } as const;
const card = (code: string): Card => ({
  rank: code[0] === 'T' ? '10' : code[0],
  suit: SUITS[code[1] as keyof typeof SUITS],
  name: cardWords(code),
});

const SEAT: Record<string, string> = { BB: 'the big blind', SB: 'the small blind', BTN: 'the button' };
const SLUG: Record<string, GradeSlug> = { 'Best move': 'best', Good: 'good', Inaccuracy: 'inaccuracy', Mistake: 'mistake', Blunder: 'blunder' };

/** The build stops when a printed figure no longer matches the words COPY.md wrote around it. */
function expect<T>(what: string, actual: T, wanted: T): void {
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new Error(`worked example: ${what} is ${JSON.stringify(actual)} but COPY.md says ${JSON.stringify(wanted)}. Re-check the copy against src/data/demo-spots.json.`);
  }
}

// Options as the pop-up lists them: smallest amount first, so Fold, then Call.
const options: Option[] = [...spot.options]
  .sort((a, b) => labelAmount(a.label) - labelAmount(b.label))
  .map((raw) => {
    const slug = SLUG[raw.grade];
    if (!slug) throw new Error(`worked example: unknown grade "${raw.grade}"`);
    return {
      label: labelText(raw.label, bb, 'bb'),
      freq: percent(raw.frequency),
      freqPercent: Math.round(raw.frequency * 100),
      worth: inBb(raw.ev, true),
      negative: raw.ev < 0,
      grade: raw.grade,
      slug,
      score: raw.score,
      given: inBb(raw.givenUpDollars),
      best: raw.best,
      you: raw.actual,
    };
  });

const best = options.find((option) => option.best);
const you = options.find((option) => option.you);
if (!best || !you) throw new Error('worked example: the first spot needs a best option and the option that was played');

const beats = /beats (\d+)%/.exec(spot.handClass)?.[1] ?? '';
const pot = inBb(spot.potDollars, false, true);
const toCall = inBb(spot.toCallDollars);
const amount = you.label.replace(/^\D+/, ''); // "Call 65 bb" -> "65 bb"

const setup = {
  street: spot.street,
  stakes: spot.stakes,
  seat: SEAT[spot.position] ?? spot.position,
  hero: spot.hero.map(card),
  board: spot.board.map(card),
  pot,
  toCall,
};

const situation = `The player on the button raised and you called. The board has four cards in a row, 8, 9, 10 and J, and three spades. You hold three of a kind, which beats ${beats}% of possible hands. You bet the river and they pushed all in.`;
const sentence = `Calling scores ${you.grade}, ${you.score} out of 100. GTO folds ${best.freq} of the time, and calling gives up ${you.given} against folding.`;

// COPY.md, "GTO hand review, 2. Worked example", with the owner's ruling that pots round to whole big blinds (COPY.md, "Decided by the main session").
expect('the setup', [setup.street, setup.stakes, setup.seat, setup.pot, setup.toCall], ['River', '$1/$2', 'the big blind', '255 bb', '65 bb']);
expect('the cards', [...setup.hero, ...setup.board].map((c) => c.name), ['8 of hearts', '8 of clubs', '8 of diamonds', 'jack of spades', '9 of spades', '2 of clubs', '10 of spades']);
expect('the options', options.map((o) => [o.label, o.freq, o.worth]), [['Fold', '96%', '0 bb'], ['Call 65 bb', '4%', '−62.6 bb']]);
expect('the grades', options.map((o) => `${o.grade} ${o.score}`), ['Best move 100', 'Blunder 6']);
expect('the played option', you.label, 'Call 65 bb');
expect('the situation', situation, 'The player on the button raised and you called. The board has four cards in a row, 8, 9, 10 and J, and three spades. You hold three of a kind, which beats 64% of possible hands. You bet the river and they pushed all in.');
expect('the grade sentence', sentence, 'Calling scores Blunder, 6 out of 100. GTO folds 96% of the time, and calling gives up 62.6 bb against folding.');

// The table scene is the pop-up's own, for the same hand, so the page and the pop-up cannot disagree.
const hand = buildHands()[0];

export const example = {
  setup,
  situation,
  options,
  best,
  you,
  sentence,
  /** The words of the grade sentence's tail, reused by the "What is a blunder?" answer (COPY.md, FAQ 4). */
  blunderFact: `In the sample hand, calling ${amount} scores ${you.score} and gives up ${you.given}.`,
  equityNeeded: spot.equityNeeded ?? '',
  equity: spot.equity,
  sceneAlt: hand.alt('bb'),
  scene: table(hand, 'bb', hand.alt('bb')),
};
