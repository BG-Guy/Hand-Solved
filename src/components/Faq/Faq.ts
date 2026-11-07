// Faq.ts: animates each FAQ answer open and closed (MOTION.md E31). Without this file the <details> still open and close natively.
// An answer is a one-row grid. Opening: open the item with its row at 0fr (data-state "opening"), force a layout, then let the row go to 1fr ("open").
// Closing ("closing"): send the row to 0fr and close the item when the transition ends (or a timer, read from the CSS transition, if it never fires).
// Clicking again mid-close reverses it. Find-in-page and #hash opens use the native toggle, carry no data-state and stay instant.
import { settleTime } from '../../scripts/settle-time';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const timers = new WeakMap<HTMLDetailsElement, number>();

/** The summary carries the state for screen readers at the start of a move, while `open` lags behind during a close. */
const expanded = (item: HTMLDetailsElement, on: boolean) => item.querySelector('summary')?.setAttribute('aria-expanded', String(on));

for (const item of document.querySelectorAll<HTMLDetailsElement>('.faq__item')) expanded(item, item.open);

document.addEventListener('click', (event) => {
  const summary = (event.target as Element).closest<HTMLElement>('.faq__item > summary');
  if (!summary || reduced.matches) return;
  event.preventDefault();
  const item = summary.parentElement as HTMLDetailsElement;
  const panel = summary.nextElementSibling as HTMLElement;
  clearTimeout(timers.get(item));
  const closing = item.open && item.dataset.state !== 'closing';
  if (closing) {
    item.dataset.state = 'closing';
    const done = () => {
      clearTimeout(timers.get(item));
      panel.removeEventListener('transitionend', onEnd);
      if (item.dataset.state !== 'closing') return;
      item.open = false;
      delete item.dataset.state;
    };
    const onEnd = (e: TransitionEvent) => e.target === panel && done();
    panel.addEventListener('transitionend', onEnd);
    timers.set(item, window.setTimeout(done, settleTime(panel) + 80));
  } else {
    if (!item.open) {
      item.dataset.state = 'opening';
      item.open = true;
      void panel.offsetHeight;
    }
    item.dataset.state = 'open';
  }
  expanded(item, !closing);
});

document.addEventListener(
  'toggle',
  (event) => {
    const item = event.target;
    if (item instanceof HTMLDetailsElement && item.matches('.faq__item') && item.dataset.state !== 'closing') expanded(item, item.open);
  },
  true,
);
