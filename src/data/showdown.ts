// showdown.ts: the words and numbers for the flop, turn and river section (src/sections/home/Showdown.astro). Final copy; docs/site/COPY.md 4.1a mirrors it.
import { pricing } from './site';

export type CardCode = 'As' | 'Ac' | 'Kd' | 'Jd' | 'Ah' | '9c' | 'Qd' | 'Td' | 'Ad';
export type StreetId = 'preflop' | 'flop' | 'turn' | 'river';

/**
 * The real hand: Motoyuki Mabuchi against Justin Phillips, 2008 WSOP Main Event. Hole cards and board from PokerNews and Card Player.
 * Only PokerNews names the turn card, and Card Player's description of the turn fits it.
 */
export const hand = {
  them: { label: 'Other poker tools', cards: ['As', 'Ac'] as CardCode[] },
  us: { label: 'HandSolved', cards: ['Kd', 'Jd'] as CardCode[] },
  flop: ['Ah', '9c', 'Qd'] as CardCode[],
  turn: 'Td' as CardCode,
  river: 'Ad' as CardCode,
  /** The classic hand, for the closing fan: lowest to highest. */
  royal: ['Td', 'Jd', 'Qd', 'Kd', 'Ad'] as CardCode[],
};

/**
 * Win chances worked out exactly from these four hole cards: every remaining runout counted, ties split. 1,712,304 runouts before the flop,
 * 990 on the flop, 44 on the turn. Raw: 81.92 / 18.08, 83.94 / 16.06, 18.18 / 81.82, 0 / 100. On the turn 8 of 44 rivers win for the aces:
 * 9s 9h Ts Th Tc Qs Qh Qc. The 9 of diamonds would give K J a straight flush, and the A of diamonds is the river that happened.
 */
export const streets: Record<StreetId, { them: { hand: string; win: number }; us: { hand: string; win: number }; line: string; cta: string }> = {
  preflop: {
    them: { hand: 'Pocket aces', win: 82 },
    us: { hand: 'King, jack of diamonds', win: 18 },
    line: 'Deal the board and see what beats them.',
    cta: 'Deal the flop',
  },
  flop: {
    them: { hand: 'Three aces', win: 84 },
    us: { hand: 'Needs a ten', win: 16 },
    line: 'Three good reasons. The aces still lead.',
    cta: 'Deal the turn',
  },
  turn: {
    them: { hand: 'Three aces', win: 18 },
    us: { hand: 'A straight', win: 82 },
    line: 'A better reason. You just took the lead.',
    cta: 'Deal the river',
  },
  river: {
    them: { hand: 'Four aces', win: 0 },
    us: { hand: 'Royal flush', win: 100 },
    line: 'The last ace in the deck gives them four aces, and gives you the only hand that beats it.',
    cta: 'Grade a sample hand',
  },
};

export const copy = {
  id: 'showdown',
  kicker: 'Why HandSolved',
  title: 'Other poker tools are holding aces.',
  /** The finale's headline: the app wins. The hand (Royal flush, 100%) is in the score under the fan. */
  finale: 'HandSolved wins.',
  winLabel: 'Chance to win',
  theirsPrefix: 'Other tools',
  oursPrefix: 'HandSolved',
  again: 'Deal it again',
  early: 'Get early access',
  selectHint: 'Tap any card to read why.',
  menuLabel: 'Reasons',
  menuHead: 'We win at showdown. Here’s how.',
  /** "Reason 3 of 5", on each reason. */
  reasonWord: 'Reason',
  ofWord: 'of',
  pause: 'Pause',
  play: 'Play',
};

export interface Reason {
  key: string;
  card: CardCode;
  street: Exclude<StreetId, 'preflop'>;
  title: string;
  line: string;
  points: string[];
  others: string;
  here: string;
  tag?: string;
}

/** Sorted from good to best: the deal order is the argument. */
export const reasons: Reason[] = [
  {
    key: 'price',
    card: 'Ah',
    street: 'flop',
    title: 'A fair price',
    line: 'Logging is free. The coach costs less than the usual solver subscription.',
    points: [
      'Free: sessions, hands, history, insights and goals',
      `Pro: $${pricing.proMonthly} a month, or $${pricing.proYearly} a month billed yearly`,
      'Your data comes with you, in backups and spreadsheets',
    ],
    others: 'Monthly fees set for pros, with hand limits on the cheaper plans.',
    here: 'Free to log, one simple price to coach.',
    tag: 'Concept pricing',
  },
  {
    key: 'everywhere',
    card: '9c',
    street: 'flop',
    title: 'Table or desk',
    line: 'Record a hand with one thumb at the table. Study it on a big screen at home.',
    points: [
      'Phones get bottom tabs, tablets an icon rail, desktops a full sidebar',
      'Runs full screen from your home screen, like an app',
      'Flip every amount between big blinds and dollars',
    ],
    others: 'A solver for the desk and a separate tracker for the phone.',
    here: 'One app and the same hands, on every screen.',
  },
  {
    key: 'insights',
    card: 'Qd',
    street: 'flop',
    title: 'It reads your bankroll',
    line: 'Your sessions come back as plain answers. Is this downswing normal? Do your long sessions pay? Open a card and see.',
    points: [
      'Downswings, month to month, and hourly by stakes, venue and game',
      'Sessions graded A to F, and goals with pace projections',
      'Hall of Fame, Wall of Shame and Tilt Tower',
    ],
    others: 'A bankroll graph, and the rest is up to you.',
    here: 'What to work on next, in one sentence.',
  },
  {
    key: 'practice',
    card: 'Td',
    street: 'turn',
    title: 'Practice that plays back',
    line: 'Deal full hands against an 8-handed table of GTO opponents, then replay your real hands from any street.',
    points: [
      'Heads-up and 3-way pots, 3-bet pots included',
      'Cash or tournament with antes, at the stack you pick',
      'Every decision graded, with the same runout or a new one',
    ],
    others: '3-way spots tend to sit in the top plans.',
    here: '3-way and tournament practice, all in Pro.',
  },
  {
    key: 'coach',
    card: 'Ad',
    street: 'river',
    title: 'A coach for your real hands',
    line: 'Rebuild the hand you just played. Every decision gets a score from 0 to 100 and the reason behind it.',
    points: [
      'How often GTO takes each option, what each is worth, odds and ranges',
      '14 solved stack depths, and every street solved with your real bet sizes',
      'Checked against a full solver on heads-up flops: its main action 98% of the time, 0.28% of the pot given up per decision. Turn, river and 3-way checks are still to come.',
    ],
    others: 'Look up a similar spot, or upload online hand histories.',
    here: 'Your live hand and your bet sizes, graded in your browser.',
  },
];
