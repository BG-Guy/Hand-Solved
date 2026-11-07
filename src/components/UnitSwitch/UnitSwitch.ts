// UnitSwitch.ts: the BB / $ state for the whole page. It owns <html data-unit>, the choice in local storage (key hs-unit, inside try/catch), the pressed
// state of every switch, and the text of every live number. The pop-ups format through the same formatAmount (SampleHandDialog/format.ts) and listen for "unit:change".
//
// A live number is an element with data-bb="<big blinds>" that holds only the figure; Amount.astro prints it. Options, all optional:
//   data-signed            results carry a sign (+ or the real minus sign); pots and stacks do not
//   data-usd-per-bb="2"    dollars per big blind, default 2 ($1/$2). Hand 2 of the sample set uses 1
//   data-bb-suffix=" bb"   text after the figure in big blinds, default " bb" (use " bb/h", "bb/100" and so on)
//   data-usd-suffix=""     text after the figure in dollars, default none (use "/h" or "/100 hands")
//   data-usd-decimals      "0" or "2" to force whole dollars or cents, "exact" for cents whenever the figure has them (the sample hand). Default: whole dollars, cents only under $10 when not whole
//   data-bb-decimals       "0" for whole big blinds (pots in the sample hand). Default: half up to one decimal
// For the motion plan (MOTION.md E25) the figure may sit in a child: <span class="num" data-bb><span class="num__v">+733 bb</span></span>.
// Then the old text goes to data-prev on .num, the new text to .num__v, and .is-roll is restarted.
import { unitSwitch } from '../../data/site';
import { formatAmount, type Unit } from '../../scripts/format-amount';

export { formatAmount, type Unit };

export const getUnit = (): Unit => (document.documentElement.dataset.unit === 'usd' ? 'usd' : 'bb');

const USD_DECIMALS = { '0': 0, '2': 2, exact: 'exact' } as const;

function render(unit: Unit, roll = true) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-bb]')) {
    const d = el.dataset;
    const bb = Number(d.bb);
    if (Number.isNaN(bb)) continue;
    const next = formatAmount(bb, unit, {
      signed: 'signed' in d,
      usdPerBb: d.usdPerBb ? Number(d.usdPerBb) : undefined,
      bbSuffix: d.bbSuffix,
      usdSuffix: d.usdSuffix,
      usdDecimals: USD_DECIMALS[d.usdDecimals as keyof typeof USD_DECIMALS] ?? 'auto',
      bbDecimals: d.bbDecimals === '0' ? 0 : 1,
    });
    const figure = el.querySelector('.num__v') ?? el;
    if (figure.textContent === next) continue;
    el.dataset.prev = figure.textContent ?? '';
    figure.textContent = next;
    if (!roll) continue;
    // Restart the roll: take the class off, force a reflow so the browser notices, put it back.
    el.classList.remove('is-roll');
    void el.offsetWidth;
    el.classList.add('is-roll');
  }
  for (const button of document.querySelectorAll<HTMLElement>('[data-set-unit]')) {
    button.setAttribute('aria-pressed', String(button.dataset.setUnit === unit));
  }
}

// One polite live region for the whole page, created before the first change so screen readers have it registered.
const status = document.createElement('p');
status.className = 'visually-hidden';
status.setAttribute('role', 'status');
document.body.append(status);

/** Say it where it can be heard: while a pop-up is open, everything outside it is out of the accessibility tree, so the pop-up's own status region speaks. */
const speak = (text: string) => {
  (document.querySelector<HTMLElement>('dialog[open] [role="status"]') ?? status).textContent = text;
};

function setUnit(unit: Unit) {
  document.documentElement.dataset.unit = unit;
  try {
    localStorage.setItem('hs-unit', unit);
  } catch {
    // Storage can be blocked. The choice then lasts for this page view only.
  }
  render(unit);
  speak(unitSwitch[unit].announce);
  document.dispatchEvent(new CustomEvent('unit:change', { detail: { unit } }));
}

document.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-set-unit]') : null;
  if (button && button.dataset.setUnit !== getUnit()) setUnit(button.dataset.setUnit === 'usd' ? 'usd' : 'bb');
});

// head-guard.js has already set data-unit from storage; bring the numbers and the switches in line with it. A saved choice never animates on load.
render(getUnit(), false);
