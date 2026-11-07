// sample.ts: what the sample-hand pop-up must print, worked out from src/data/demo-spots.json. Nothing here is copied from the site's code or typed in by hand:
// the formatting follows the rules written down in src/components/SampleHandDialog/format.ts (half up to one decimal, real minus sign, cents only when the figure has them),
// done with whole cents so no floating point rounding is involved, and the site's own formatter is not imported, so a bug in it cannot hide itself.
import demo from '../../../src/data/demo-spots.json' with { type: 'json' };

export type Unit = 'bb' | 'usd';

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

export interface RawSpot {
  id: string;
  stakes: string;
  bigBlindDollars: number;
  street: string;
  potDollars: number;
  toCallDollars: number;
  equityNeeded: string | null;
  equity: string;
  options: RawOption[];
}

export const spots = demo.spots as unknown as RawSpot[];

const MINUS = '−';
const cents = (dollars: number) => Math.round(dollars * 100); // the JSON holds at most two decimals, so this is exact
const grouped = (n: number) => new Intl.NumberFormat('en-US').format(n);

/** One amount in dollars (as in the JSON) shown in the chosen unit. `signed` is for results; `whole` is for pots, which show whole big blinds. */
export function amount(dollars: number, bigBlind: number, unit: Unit, { signed = false, whole = false } = {}): string {
  const c = cents(dollars);
  const sign = c < 0 ? MINUS : signed && c > 0 ? '+' : '';
  if (unit === 'usd') {
    const abs = Math.abs(c);
    const body = `$${grouped(Math.floor(abs / 100))}${abs % 100 ? `.${String(abs % 100).padStart(2, '0')}` : ''}`;
    return sign + body;
  }
  // Big blinds, rounded half up (away from zero): floor(|cents| * scale / bigBlindCents + 1/2) in integers.
  const scale = whole ? 1 : 10;
  const bbCents = cents(bigBlind);
  const units = Math.floor((2 * Math.abs(c) * scale + bbCents) / (2 * bbCents));
  const body = whole ? grouped(units) : `${grouped(Math.floor(units / 10))}${units % 10 ? `.${units % 10}` : ''}`;
  // A result that rounds to zero carries no sign.
  return `${units === 0 ? '' : sign}${body} bb`;
}

const dollarsIn = (label: string) => {
  const hit = /\$([\d,]*\.?\d+)/.exec(label);
  return hit ? Number(hit[1].replace(/,/g, '')) : 0;
};

const SUB: Record<string, string> = { fold: 'Give up the hand', check: 'Pass, no bet', call: 'Match the bet', raise: 'Increase the bet', allin: 'Bet everything' };

export interface ExpectedOption {
  /** "Call 65 bb" or "Call $130". */
  label: string;
  /** The line under the label on the answer button. */
  sub: string;
  /** "96%". */
  freq: string;
  /** "+52.7 bb", "−$125.24", "0 bb". */
  worth: string;
  /** What choosing it gives up against the best option. */
  given: string;
  grade: string;
  score: number;
  best: boolean;
  /** "Blunder, 6 out of 100." */
  heading: string;
}

export interface ExpectedHand {
  id: string;
  pot: string;
  call: string | null;
  options: ExpectedOption[];
  bestLabel: string;
}

/** Everything the pop-up shows for one hand in one unit. Options are in the order of the answer buttons: smallest amount first. */
export function expected(spot: RawSpot, unit: Unit): ExpectedHand {
  const bb = spot.bigBlindDollars;
  const options = [...spot.options]
    .sort((a, b) => dollarsIn(a.label) - dollarsIn(b.label))
    .map<ExpectedOption>((o) => {
      const share = /\((\d+)% pot\)/.exec(o.label)?.[1];
      return {
        label: o.label.replace(/\s*\(\d+% pot\)/, '').replace(/\$([\d,]*\.?\d+)/, (_, f: string) => amount(Number(f.replace(/,/g, '')), bb, unit)),
        sub: share ? `${share}% of the pot` : (SUB[o.type] ?? ''),
        freq: `${Math.round(o.frequency * 100)}%`,
        worth: amount(o.ev, bb, unit, { signed: true }),
        given: amount(o.givenUpDollars, bb, unit),
        grade: o.grade,
        score: o.score,
        best: o.best,
        heading: `${o.grade}, ${o.score} out of 100.`,
      };
    });
  return {
    id: spot.id,
    pot: amount(spot.potDollars, bb, unit, { whole: true }),
    call: spot.toCallDollars > 0 ? amount(spot.toCallDollars, bb, unit) : null,
    options,
    bestLabel: options.find((o) => o.best)!.label,
  };
}

/** The sentence under the verdict heading, from the grade templates in docs/site/COPY.md. */
export function sentence(hand: ExpectedHand, option: ExpectedOption): string {
  const base = `GTO plays ${option.label} ${option.freq} of the time. It is worth ${option.worth}`;
  return option.grade === 'Best move' ? `${base} and gives up nothing.` : `${base}. Against ${hand.bestLabel}, that gives up ${option.given}.`;
}

export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
