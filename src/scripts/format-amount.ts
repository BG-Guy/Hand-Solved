// format-amount.ts: the one formatter for every amount on the site, in big blinds or dollars (COPY.md Builder notes 1 to 3, UX.md 6.0).
// Pure, so Astro components use it at build (Amount.astro), UnitSwitch.ts uses it in the browser, and the sample hand's money() (SampleHandDialog/format.ts) is a
// thin wrapper around it. They cannot disagree: there is no second implementation. format-check.ts runs it over demo-spots.json at build.

export type Unit = 'bb' | 'usd';

const MINUS = '−';
const plain = new Intl.NumberFormat('en-US');
const cents = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface AmountOptions {
  /** Results carry a sign (+ or the real minus sign). Pots and stacks do not. A negative figure always shows its minus. */
  signed?: boolean;
  /** Dollars per big blind. Default 2 ($1/$2). */
  usdPerBb?: number;
  /** Text after the figure in big blinds. Default " bb". Use " bb/h", "bb/100" and so on. */
  bbSuffix?: string;
  /** Text after the figure in dollars. Default none. Use "/h" or "/100 hands". */
  usdSuffix?: string;
  /**
   * 0 or 2 forces whole dollars or cents. "auto" (default): whole dollars, cents only under $10 when the amount is not whole.
   * "exact": the figure as it is, with cents whenever it has them, at any size ($125.24, $130). The sample hand and the numbers drawn from it use this.
   */
  usdDecimals?: 0 | 2 | 'auto' | 'exact';
  /** Decimals in big blinds. 1 (default): half up to one decimal, a trailing .0 dropped. 0: whole big blinds, which is how the sample hand shows pots. */
  bbDecimals?: 0 | 1;
}

/** Rounds half up (away from zero): 1.55 gives 1.6 and 2.45 gives 2.5, which half-to-even would get wrong. */
const round = (value: number, places: number) => {
  const scale = 10 ** places;
  return (Math.sign(value) * Math.floor(Math.abs(value) * scale + 0.5 + 1e-9)) / scale;
};

/** One figure in either unit: "62.6 bb" or "$125", "+733 bb" or "+$1,466", "−73.5 bb" with a real minus sign. */
export function formatAmount(bb: number, unit: Unit, options: AmountOptions = {}): string {
  const { signed = false, usdPerBb = 2, bbSuffix = ' bb', usdSuffix = '', usdDecimals = 'auto', bbDecimals = 1 } = options;
  let value: number;
  let text: string;
  if (unit === 'bb') {
    value = round(bb, bbDecimals);
    text = plain.format(Math.abs(value)) + bbSuffix;
  } else {
    const dollars = bb * usdPerBb;
    const notWhole = round(dollars, 2) % 1 !== 0;
    const showCents = usdDecimals === 2 || (notWhole && (usdDecimals === 'exact' || (usdDecimals === 'auto' && Math.abs(dollars) < 10)));
    value = round(dollars, showCents ? 2 : 0);
    text = '$' + (showCents ? cents : plain).format(Math.abs(value)) + usdSuffix;
  }
  return (value < 0 ? MINUS : signed && value > 0 ? '+' : '') + text;
}
