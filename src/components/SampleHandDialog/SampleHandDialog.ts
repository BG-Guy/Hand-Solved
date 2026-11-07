// SampleHandDialog.ts: pop-up 1 (#dlg-sample). Dialog.ts calls mount() once; it swaps the static loading state for the three hands from demo-spots.json,
// takes the visitor's pick, and shows the real engine's verdict. No fetch (the data is bundled), no storage of picks. Spec: docs/site/UX.md 6.1.
// Opening, closing, focus return and the hand-off to pop-up 2 belong to Dialog.ts; the BB/$ switch belongs to UnitSwitch.ts.
import type { Unit } from './format';
import { buildHands, verdict, type Hand } from './hands';
import { table } from './table';
import { choose, verdictTop, verdictView } from './views';

export function mount(dialog: HTMLDialogElement, _trigger?: HTMLElement | null): void {
  if (dialog.hasAttribute('data-ready')) return;
  const part = <T extends HTMLElement>(selector: string) => {
    const el = dialog.querySelector<T>(selector);
    if (!el) throw new Error(`SampleHandDialog: ${selector} is missing`);
    return el;
  };
  const root = document.documentElement;
  // Durations come from the tokens, and are near zero under reduced motion.
  const token = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  // A phone, or any screen under 700 px tall, opens hand 1 with its intro closed (it is one tap away), so the first answer is on screen.
  // From 1024 wide the hand's story under the buttons starts open.
  const compact = matchMedia('(max-width: 47.99rem), (max-height: 43.75rem)');
  const wide = matchMedia('(min-width: 64rem)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = part('[data-scene]');
  const stage = part('[data-stage]');
  const live = part('[data-live]');
  const intro = part<HTMLDetailsElement>('[data-intro]');
  const explain = part<HTMLTemplateElement>('[data-explain-t]');
  const navs = { mid: part('[data-nav="mid"]'), end: part('[data-nav="end"]') };
  const dots = [...dialog.querySelectorAll<HTMLElement>('[data-dot]')];

  let hands: Hand[];
  let unit: Unit = root.dataset.unit === 'usd' ? 'usd' : 'bb';
  let at = 0; // the hand on screen, 0 to 2
  let shown = -1; // the option the verdict is about, or -1 while choosing
  let finished = false; // hand 3's verdict was reached

  const say = (text: string) => {
    live.textContent = text;
  };
  const scroller = stage.closest<HTMLElement>('.dialog__body') ?? dialog;
  /** Focus the view's heading. A verdict is scrolled to the top of the content; a new hand starts at the top of the box, table in view. */
  const focusHeading = (verdictView: boolean) => {
    if (verdictView) stage.scrollIntoView({ block: 'start' });
    else scroller.scrollTop = 0;
    stage.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true });
  };

  const unitName = part('[data-unit-name]');
  const paintUnit = () => {
    unitName.textContent = unit === 'bb' ? 'big blinds' : 'dollars';
  };

  function paintScene(fx = false) {
    const hand = hands[at];
    // A deal (MOTION.md E34): the old table stays on top for one turn, so its cards can go edge-on before the new ones come back.
    const old = fx && !calm.matches ? scene.querySelector('.tb') : null;
    scene.innerHTML = table(hand, unit, hand.alt(unit));
    if (fx) scene.firstElementChild?.classList.add('is-new');
    if (old) {
      old.classList.remove('is-new');
      old.classList.add('tb--out');
      old.setAttribute('aria-hidden', 'true');
      scene.append(old);
      setTimeout(() => old.remove(), token('--dur-4') + 5 * token('--stagger'));
    }
  }

  /** The pick-your-move cue (sticky, bottom of the scrolling area) shows only while the first answer is not fully in view. Re-aimed at every new choose view. */
  let cueWatch: IntersectionObserver | undefined;
  function watchCue() {
    cueWatch?.disconnect();
    const cue = stage.querySelector<HTMLElement>('[data-cue]');
    const first = stage.querySelector<HTMLElement>('.hs-choice');
    if (!cue || !first) return;
    cueWatch = new IntersectionObserver((entries) => (cue.hidden = (entries.at(-1)?.intersectionRatio ?? 0) >= 0.95), { root: scroller, threshold: [0, 0.95, 1] });
    cueWatch.observe(first);
  }

  /** The cue was pressed: bring the answers into view (no animation under reduced motion) and put focus on the first one. */
  function lookAtChoices() {
    stage.querySelector('.hs-choices')?.scrollIntoView({ block: 'end', behavior: calm.matches ? 'auto' : 'smooth' });
    stage.querySelector<HTMLElement>('.hs-choice')?.focus({ preventScroll: true });
  }

  /** The view for the current hand. fx lets bars, stamp and strike play their entrance; a unit change repaints without it. */
  function paintStage(fx: boolean) {
    const hand = hands[at];
    // A repaint of the same view (the unit changed) leaves the story disclosure as the visitor left it.
    const storyOpen = fx ? undefined : stage.querySelector<HTMLDetailsElement>('[data-how]')?.open;
    const body = shown < 0 ? choose(hand, unit) : verdictView(hand, shown, unit, fx);
    stage.innerHTML = `<div class="hs-view${fx ? ' is-new' : ''}">${body}</div>`;
    stage.removeAttribute('aria-busy');
    dialog.dataset.view = shown < 0 ? 'choose' : 'verdict'; // hook for motion.css
    const story = stage.querySelector<HTMLDetailsElement>('[data-how]');
    if (story) story.open = storyOpen ?? wide.matches;
    if (shown >= 0) {
      stage.querySelector('[data-explain]')?.append(explain.content.cloneNode(true));
      stage.querySelectorAll<HTMLElement>('[data-f]').forEach((el) => el.style.setProperty('--f', el.dataset.f ?? '0'));
    }
    navs.mid.hidden = !(shown >= 0 && at < 2);
    navs.end.hidden = !(shown >= 0 && at === 2);
    watchCue();
  }

  function paintHeader() {
    part('[data-count]').textContent = String(at + 1);
    dots.forEach((dot, k) => {
      dot.classList.toggle('is-done', k <= at);
      if (k === at) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
  }

  function paintAll() {
    paintUnit();
    paintHeader();
    paintScene();
    paintStage(false);
  }

  function deal(n: number) {
    at = n;
    shown = -1;
    finished = false;
    intro.open = n === 0 && !compact.matches;
    paintHeader();
    paintScene(true);
    paintStage(true);
    focusHeading(false);
  }

  /** Commit (MOTION.md E33): the pick takes the pressed look at once and the choose view fades, then the verdict mounts and takes focus. */
  function pick(k: number, button: HTMLElement) {
    if (shown === k) return;
    shown = k;
    if (at === 2) finished = true;
    button.classList.add('is-picked');
    dialog.dataset.view = 'leaving';
    setTimeout(() => {
      // Closed in the meantime: the close handler has already reset the view.
      if (shown !== k) return;
      paintStage(true);
      focusHeading(true);
    }, token('--dur-1'));
  }

  /** What-if: another row becomes "You", and its tag flies there from the old row (E35). Focus stays on the row; the change is announced politely. */
  function show(k: number) {
    if (k === shown) return;
    const before = stage.querySelector('.hs-opt.is-you .tag--you')?.getBoundingClientRect();
    shown = k;
    const hand = hands[at];
    const top = stage.querySelector<HTMLElement>('[data-top]')!;
    // The commit's timeline is over: only the sentence and the grade cross-fade, and nothing replays.
    stage.querySelector('.hs-view')?.classList.remove('is-new');
    top.classList.add('is-swap');
    top.innerHTML = verdictTop(hand, hand.opts[k], unit, false);
    stage.querySelectorAll<HTMLElement>('.hs-opt').forEach((row, n) => {
      row.setAttribute('aria-pressed', String(n === k));
      row.classList.toggle('is-you', n === k);
      const tag = row.querySelector<HTMLElement>('.tag--you')!;
      tag.hidden = n !== k;
      if (n === k && before) {
        const now = tag.getBoundingClientRect();
        tag.style.setProperty('--fx', `${before.left - now.left}px`);
        tag.style.setProperty('--fy', `${before.top - now.top}px`);
      }
    });
    say(verdict(hand, hand.opts[k], unit).announce);
  }

  /** Data missing or malformed: no partial hand, just the message, its link and a Close button. */
  function fail() {
    dialog.setAttribute('data-error', '');
    part('[data-error]').hidden = false;
    scene.hidden = stage.hidden = intro.hidden = true;
    part('[data-error-h]').focus();
  }

  try {
    hands = buildHands();
    intro.open = !compact.matches;
    paintAll();
  } catch {
    fail();
    return;
  }

  dialog.addEventListener('click', (event) => {
    // The second click of a double-click lands on whatever the first one just painted (an answer of the next hand), so only the first click counts.
    if (event.detail > 1) return;
    const el = (event.target as Element).closest<HTMLElement>('[data-pick], [data-show], [data-act], [data-cue]');
    if (!el || !dialog.contains(el)) return;
    const { pick: choice, show: row, act } = el.dataset;
    if (choice !== undefined) pick(Number(choice), el);
    else if (row !== undefined) show(Number(row));
    else if (act === 'next') deal(at + 1);
    else if (act === 'again') deal(0);
    else lookAtChoices();
  });

  // Reopening resumes at the current hand with the pick cleared. A finished set starts again at hand 1.
  dialog.addEventListener('close', () => {
    if (finished) at = 0;
    shown = -1;
    finished = false;
    intro.open = at === 0 && !compact.matches;
    paintAll();
    scroller.scrollTop = 0;
  });

  // The page's BB/$ switch (UnitSwitch.ts) owns <html data-unit>, storage and the screen-reader announcement. Every amount here is redrawn when it changes.
  document.addEventListener('unit:change', (event) => {
    unit = (event as CustomEvent<{ unit: Unit }>).detail.unit === 'usd' ? 'usd' : 'bb';
    paintAll();
  });

  dialog.setAttribute('data-ready', '');
}
