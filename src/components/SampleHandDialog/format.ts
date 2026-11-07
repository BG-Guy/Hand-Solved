// format.ts: turns the dollar amounts in demo-spots.json into the text shown in pop-up 1, in big blinds or dollars. Pure functions, no DOM.
// money() holds no rounding of its own: it hands the figure to the page's one formatter (scripts/format-amount.ts), so the pop-up, the hero chip and every
// live number read the same for the same amount.
import { formatAmount, type Unit } from '../../scripts/format-amount';

export type { Unit };

/**
 * One amount from the JSON (dollars) as text.
 * - bb: dollars divided by the hand's big blind, rounded half up to one decimal (whole bb for pots), a trailing .0 dropped.
 *   1.55 prints 1.6 and 2.45 prints 2.5 (a half-to-even round would print 1.5 and 2.4).
 * - usd: exactly the JSON figure. Cents show only when the figure has them, so 130 is $130 and 125.24 is $125.24.
 * - sign: results carry a sign (plus, real minus). Zero never does. Pot and stack figures pass sign = false.
 */
export function money(dollars: number, bigBlind: number, unit: Unit, sign = false, whole = false): string {
  return formatAmount(dollars / bigBlind, unit, { usdPerBb: bigBlind, signed: sign, usdDecimals: 'exact', bbDecimals: whole ? 0 : 1 });
}

/** 0.96 -> "96%". */
export const percent = (fraction: number) => `${Math.round(fraction * 100)}%`;

/** Pulls the dollar figure out of a JSON option label: "Bet $65.02 (33% pot)" -> 65.02. No figure (Fold, Check) -> 0. */
export function labelAmount(label: string): number {
  const match = /\$([\d,]*\.?\d+)/.exec(label);
  return match ? Number(match[1].replace(/,/g, '')) : 0;
}

/** The label with its dollar figure shown in the chosen unit, minus the pot share: "Bet $65.02 (33% pot)" -> "Bet 32.5 bb". */
export function labelText(label: string, bigBlind: number, unit: Unit): string {
  return label
    .replace(/\s*\(\d+% pot\)/, '')
    .replace(/\$([\d,]*\.?\d+)/, (_, figure: string) => money(Number(figure.replace(/,/g, '')), bigBlind, unit));
}

/** The pot share in a JSON option label ("33% pot" -> "33"), or null. */
export const labelShare = (label: string) => /\((\d+)% pot\)/.exec(label)?.[1] ?? null;
