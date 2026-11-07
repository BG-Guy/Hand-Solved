// hands.ts: the three sample hands as the pop-up uses them. Every number comes from src/data/demo-spots.json and is only formatted here; the words come from docs/site/COPY.md ("Pop-up 1").
import { spots as rawSpots } from '../../data/demo-spots.json';
import { labelAmount, labelShare, labelText, money, percent, type Unit } from './format';

interface RawOption {
  label: string;
  type: string;
  frequency: number;
  ev: number;
  best: boolean;
  score: number;
  grade: string;
  givenUpDollars: number;
}

interface Spot {
  id: string;
  stakes: string;
  bigBlindDollars: number;
  position: string;
  villain: string;
  hero: string[];
  board: string[];
  street: string;
  facing: string;
  handClass: string;
  potDollars: number;
  toCallDollars: number;
  equityNeeded: string | null;
  equity: string;
  options: RawOption[];
}

/** One option of a hand: the JSON values plus helpers that print them in the chosen unit. */
export interface Opt {
  raw: RawOption;
  best: boolean;
  /** "Call 65 bb" or "Call $130". */
  label: (u: Unit) => string;
  /** Just the figure, "65 bb" or "$130". */
  amount: (u: Unit) => string;
  /** The line under the button label. */
  sub: string;
  freq: string;
  worth: (u: Unit) => string;
  given: (u: Unit) => string;
}

export interface Hand {
  spot: Spot;
  opts: Opt[];
  best: Opt;
  pot: (u: Unit) => string;
  call: (u: Unit) => string;
  /** The words for this hand. */
  heading: string;
  setup: (u: Unit) => string;
  strength: string;
  story: (u: Unit) => string;
  question: (u: Unit) => string;
  alt: (u: Unit) => string;
  bullets: (u: Unit) => string[];
}

const SUB: Record<string, string> = {
  fold: 'Give up the hand',
  check: 'Pass, no bet',
  call: 'Match the bet',
  raise: 'Increase the bet',
  allin: 'Bet everything',
};

const SEAT: Record<string, string> = {
  BB: 'in the big blind',
  SB: 'in the small blind',
  BTN: 'on the button',
};

const RANKS: Record<string, string> = { T: '10', J: 'jack', Q: 'queen', K: 'king', A: 'ace' };
const SUITS: Record<string, string> = { s: 'spades', h: 'hearts', d: 'diamonds', c: 'clubs' };

/** "8h" -> "8 of hearts". */
export const cardWords = (code: string) => `${RANKS[code[0]] ?? code[0]} of ${SUITS[code[1]]}`;

/** "a, b and c". */
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : (items[0] ?? ''));

const spots = rawSpots as unknown as Spot[];

/** The words around each hand's numbers. Figures arrive as arguments, already in the chosen unit. */
interface Words {
  strength: (beats: string) => string;
  story: (facing: string) => string;
  question: (call: string) => string;
  facing: (facing: string) => string;
  bullets: (m: { call: string; final: string; need: string; eq: string; o: Opt[]; u: Unit }) => string[];
}

const SOLVED = (street: string) => `This ${street} was solved heads-up from the hands both players could still hold, using the real bet sizes.`;

const WORDS: Record<string, Words> = {
  'set-on-four-straight': {
    strength: (beats) => `Three of a kind, medium. It beats ${beats}% of possible hands.`,
    story: () =>
      'The player on the button, the dealer seat, raised before the flop and you called from the big blind. You check-raised the flop (passed, then raised their bet) and bet the turn, and they called both. After your river bet, they pushed all their chips in.',
    question: (call) => `Call ${call}, or fold?`,
    facing: () => 'The button player has pushed all in.',
    bullets: ({ call, final, need, eq, o: [fold, called], u }) => [
      SOLVED('river'),
      `Calling puts ${call} into a final pot of ${final}. To break even you must win ${need} of the time, and you win about ${eq}.`,
      `GTO plays ${fold.label(u)} ${fold.freq} of the time. Calling gives up about ${called.given(u)} against folding.`,
    ],
  },
  'straight-check-raised': {
    strength: () => 'A straight, near the best possible hand.',
    story: (facing) =>
      `You raised from the small blind and the big blind called. You bet the flop and they called. The turn gave you a straight, five cards in a row from 4 to 8. You bet again, and now the big blind raises to ${facing}.`,
    question: () => 'Fold, call, or raise?',
    facing: (facing) => `The big blind has raised to ${facing}.`,
    bullets: ({ call, final, need, eq, o: [, c, r, a], u }) => [
      SOLVED('turn'),
      `Calling puts ${call} into a final pot of ${final}. To break even you must win ${need} of the time, and you win about ${eq}.`,
      `GTO raises to ${r.amount(u)} ${r.freq} of the time and calls ${c.amount(u)} ${c.freq}. It rarely uses an all-in size, which gives up ${a.given(u)}.`,
    ],
  },
  'top-pair-river-value': {
    strength: (beats) => `A pair of kings, very strong. It beats ${beats}% of possible hands.`,
    story: () =>
      'A player raised and you raised again from the button. They called. You bet the flop and the turn with a pair of kings, the top pair on the board, and they called both. The river is a harmless card, and they check to you.',
    question: () => 'Check, or bet how much?',
    facing: () => 'The cutoff has checked to you.',
    bullets: ({ eq, o: [, , mid, main, jam], u }) => [
      SOLVED('river'),
      `GTO mixes three bets here. It bets ${main.amount(u)} ${main.freq} of the time, goes all in for ${jam.amount(u)} ${jam.freq}, and bets ${mid.amount(u)} ${mid.freq}.`,
      `This is a close spot. Going all in is worth almost the same as the main bet, and you win about ${eq} of the time.`,
    ],
  },
};

function build(spot: Spot, index: number): Hand {
  const bb = spot.bigBlindDollars;
  const words = WORDS[spot.id];
  const best = spot.options.find((o) => o.best);
  if (!words || !best || spot.options.length < 2) throw new Error(`demo spot ${spot.id} is incomplete`);

  const opts: Opt[] = [...spot.options]
    .sort((a, b) => labelAmount(a.label) - labelAmount(b.label)) // smallest first: fold or check, then calls and bets, all in last
    .map((raw) => ({
      raw,
      best: raw === best,
      label: (u) => labelText(raw.label, bb, u),
      amount: (u) => money(labelAmount(raw.label), bb, u),
      sub: labelShare(raw.label) ? `${labelShare(raw.label)}% of the pot` : (SUB[raw.type] ?? ''),
      freq: percent(raw.frequency),
      worth: (u) => money(raw.ev, bb, u, true),
      given: (u) => money(raw.givenUpDollars, bb, u),
    }));
  const bestOpt = opts.find((o) => o.best) as Opt;

  const pot = (u: Unit) => money(spot.potDollars, bb, u, false, true);
  const call = (u: Unit) => money(spot.toCallDollars, bb, u);
  const final = (u: Unit) => money(spot.potDollars + spot.toCallDollars, bb, u, false, true);
  // "BB raises to 21 bb": the one place the JSON states an amount in big blinds, so it converts the other way.
  const facingBb = /(\d+(?:\.\d+)?) bb/.exec(spot.facing)?.[1];
  const facing = (u: Unit) => (facingBb ? money(Number(facingBb) * bb, bb, u) : '');
  const beats = /beats (\d+)%/.exec(spot.handClass)?.[1] ?? '';
  const street = spot.street.toLowerCase();
  const cards = (codes: string[]) => list(codes.map(cardWords));
  const owed = (u: Unit) => (spot.toCallDollars > 0 ? `${call(u)} to call` : 'nothing to call');

  return {
    spot,
    opts,
    best: bestOpt,
    pot,
    call,
    heading: `Hand ${index + 1} of 3, ${street}`,
    setup: (u) => `${spot.street}, ${spot.stakes}. You are ${SEAT[spot.position]} with {hero}. Board {board}. Pot ${pot(u)}, ${owed(u)}.`,
    strength: words.strength(beats),
    story: (u) => words.story(facing(u)),
    question: (u) => words.question(call(u)),
    alt: (u) =>
      `Poker table with 8 seats. You sit ${SEAT[spot.position]} holding the ${cards(spot.hero)}. The board shows the ${cards(spot.board)}. ${words.facing(facing(u))} Pot ${pot(u)}, ${owed(u)}.`,
    bullets: (u) => words.bullets({ call: call(u), final: final(u), need: spot.equityNeeded ?? '', eq: spot.equity, o: opts, u }),
  };
}

/** The three hands, or throws if the data is missing or malformed (the dialog then shows its data-error view). */
export const buildHands = (): Hand[] => {
  if (!Array.isArray(spots) || spots.length !== 3) throw new Error('demo-spots.json needs three spots');
  return spots.map(build);
};

/** Verdict text for one option: the heading (read once) and the sentence under it, per COPY.md's grade templates. */
export function verdict(hand: Hand, opt: Opt, u: Unit) {
  const { grade, score } = opt.raw;
  const sentence = `GTO plays ${opt.label(u)} ${opt.freq} of the time. It is worth ${opt.worth(u)}`;
  return {
    heading: `${grade}, ${score} out of 100.`,
    sentence: grade === 'Best move' ? `${sentence} and gives up nothing.` : `${sentence}. Against ${hand.best.label(u)}, that gives up ${opt.given(u)}.`,
    announce: `Showing ${opt.label(u)}. ${grade}. GTO plays it ${Math.round(opt.raw.frequency * 100)} percent of the time.`,
  };
}
