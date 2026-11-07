// table.ts: markup for the playing cards and the table scene. The Astro file prints the empty table with it at build, the dialog module prints each hand with it. Positions are CSS (SampleHandDialog.css).
import type { Unit } from './format';
import type { Hand } from './hands';

/** Seat names in action order. The app's 8-handed table. */
const SEATS = ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const SUIT: Record<string, string> = { s: 'spade', h: 'heart', d: 'diamond', c: 'club' };
const rank = (code: string) => (code[0] === 'T' ? '10' : code[0]);

/** A face-up card for the table: rank, then the suit as SVG from the sprite. The words live in the scene's label. */
export const card = (code: string) =>
  `<span class="pc${/[hd]/.test(code[1]) ? ' pc--red' : ''}"><span class="pc__r">${rank(code)}</span><svg class="pc__s" aria-hidden="true"><use href="#hs-suit-${SUIT[code[1]]}"/></svg></span>`;

/** A card inside a sentence: same look, small, with its name for screen readers. */
export const chip = (code: string, name: string) =>
  `<span class="cc${/[hd]/.test(code[1]) ? ' cc--red' : ''}"><span aria-hidden="true">${rank(code)}</span><svg aria-hidden="true"><use href="#hs-suit-${SUIT[code[1]]}"/></svg><span class="visually-hidden">${name}</span></span>`;

const SLOT = '<span class="pc pc--empty"></span>';
const DOWN = '<span class="pc pc--down"></span>';

/**
 * The table. No hand: the empty table (loading state). With a hand: its cards, pot and seats.
 * The hero sits at the bottom; seat k is turned k places clockwise from there (classes a0 to a7).
 */
export function table(hand?: Hand, unit: Unit = 'bb', label = 'Poker table with 8 seats.'): string {
  const hero = hand ? SEATS.indexOf(hand.spot.position) : SEATS.indexOf('BB');
  const villain = hand ? SEATS.indexOf(hand.spot.villain) : -1;
  const turn = (seat: number) => `a${(seat - hero + 8) % 8}`;
  const seats = SEATS.map((name, k) => {
    const role = k === hero && hand ? ' tb__seat--hero' : k === villain ? ' tb__seat--opp' : '';
    return `<span class="tb__seat ${turn(k)}${role}">${name}</span>`;
  }).join('');
  const board = hand ? hand.spot.board.map(card) : [];
  const pot = hand
    ? `<span>Pot ${hand.pot(unit)}</span>${hand.spot.toCallDollars > 0 ? `<span>To call ${hand.call(unit)}</span>` : ''}`
    : '';
  return (
    `<div class="tb" role="img" aria-label="${label}"><span class="tb__rail"></span>${seats}` +
    `<span class="tb__dealer ${turn(SEATS.indexOf('BTN'))}">D</span>` +
    `<span class="tb__board">${board.join('') + SLOT.repeat(5 - board.length)}</span>` +
    `<span class="tb__pot">${pot}</span>` +
    (hand
      ? `<span class="tb__hole tb__hole--hero">${hand.spot.hero.map(card).join('')}</span>` +
        `<span class="tb__hole tb__hole--opp ${turn(villain)}">${DOWN + DOWN}</span>`
      : '') +
    '</div>'
  );
}
