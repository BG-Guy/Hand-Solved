// format-check.ts: build time only. Browser code never imports it; Hero.astro and HowItWorks.astro do, so every build of the home page runs it.
// It stops the build when the one formatter (format-amount.ts) and src/data/demo-spots.json disagree, in the way worked-example.ts stops it for the review page's copy:
//   1. every dollar figure in the JSON, in both units, signed or not, whole or not: dollars are exactly the JSON figure, big blinds are that figure over the hand's
//      big blind to the nearest step, and the number survives the trip through a data-bb attribute that UnitSwitch.ts reads back;
//   2. the first hand's call, which the hero chip and the story callout show outside the pop-up, reads the same there as in the pop-up, in both units,
//      and matches the figures COPY.md prints for it. It exports that call as big blinds, so those two places never type the numbers.
import data from '../data/demo-spots.json';
import { labelAmount, money } from '../components/SampleHandDialog/format';
import { buildHands } from '../components/SampleHandDialog/hands';
import { formatAmount, type Unit } from './format-amount';

interface RawOption {
  label: string;
  type: string;
  ev: number;
  givenUpDollars: number;
}
interface RawSpot {
  id: string;
  bigBlindDollars: number;
  potDollars: number;
  toCallDollars: number;
  options: RawOption[];
}

const spots = (data as unknown as { spots: RawSpot[] }).spots;

/** The build stops when a figure no longer reads the way the formatter's rules and COPY.md say. */
function expect<T>(what: string, actual: T, wanted: T): void {
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new Error(`format check: ${what} is ${JSON.stringify(actual)} but should be ${JSON.stringify(wanted)}. See src/scripts/format-amount.ts and src/data/demo-spots.json.`);
  }
}

const UNITS: Unit[] = ['bb', 'usd'];
/** A figure's digits as a number, without its sign, separators, $ or " bb". */
const digits = (text: string) => Number(text.replace(/[+−,$]| bb/g, ''));

for (const spot of spots) {
  const bb = spot.bigBlindDollars;
  const figures = [spot.potDollars, spot.toCallDollars, ...spot.options.flatMap((o) => [o.ev, o.givenUpDollars, labelAmount(o.label)])];
  for (const dollars of figures) {
    const asBb = dollars / bb;
    expect(`${spot.id}: ${dollars} over the big blind survives a data-bb attribute`, Number(String(asBb)), asBb);
    for (const signed of [false, true]) {
      for (const whole of [false, true]) {
        const where = `${spot.id}: ${dollars} (${signed ? 'signed' : 'unsigned'}, ${whole ? 'whole bb' : 'tenths'})`;
        const usd = money(dollars, bb, 'usd', signed, whole);
        expect(`${where} in dollars (${usd}) read back, in cents`, Math.round(digits(usd) * 100), Math.round(Math.abs(dollars) * 100));
        const inBb = money(dollars, bb, 'bb', signed, whole);
        const step = whole ? 1 : 0.1;
        const off = Math.abs(digits(inBb) * bb - Math.abs(dollars));
        expect(`${where} in big blinds (${inBb}) is within half a step of the figure`, off <= (step / 2) * bb + 1e-9, true);
        // Amount.astro and UnitSwitch.ts feed the formatter data-bb, data-usd-per-bb, data-usd-decimals="exact" and data-bb-decimals; the pop-up goes through money().
        for (const unit of UNITS) {
          const page = formatAmount(Number(String(asBb)), unit, { usdPerBb: bb, signed, usdDecimals: 'exact', bbDecimals: whole ? 0 : 1 });
          expect(`${where} in ${unit}: the page's text`, page, money(dollars, bb, unit, signed, whole));
        }
      }
    }
  }
}

// The first hand's call, outside the pop-up.
const hand = buildHands()[0];
const call = hand.opts.find((o) => o.raw.type === 'call');
if (!call) throw new Error('format check: the first sample hand has no call option');
const bigBlind = hand.spot.bigBlindDollars;

/** The call of sample hand 1 as big blinds (the unit the live numbers hold), and the dollars one big blind is worth in that hand. */
export const sampleCall = {
  bb: hand.spot.toCallDollars / bigBlind,
  worthBb: call.raw.ev / bigBlind,
  usdPerBb: bigBlind,
};

const live = (bb: number, unit: Unit, signed = false) => formatAmount(bb, unit, { usdPerBb: sampleCall.usdPerBb, usdDecimals: 'exact', signed });
for (const unit of UNITS) {
  expect(`the hero and story call in ${unit} reads like the pop-up's`, live(sampleCall.bb, unit), hand.call(unit));
  expect(`the hero chip's worth in ${unit} reads like the pop-up's`, live(sampleCall.worthBb, unit, true), call.worth(unit));
}
// COPY.md, "Hero" and "Pop-up 1, hand 1" (the dollar view of the chip was whole dollars, which disagreed with the pop-up's −$125.24).
expect('the call', [live(sampleCall.bb, 'bb'), live(sampleCall.bb, 'usd')], ['65 bb', '$130']);
expect('the call is worth', [live(sampleCall.worthBb, 'bb', true), live(sampleCall.worthBb, 'usd', true)], ['−62.6 bb', '−$125.24']);
