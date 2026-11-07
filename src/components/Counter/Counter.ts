// Counter.ts: turns each [data-counter]'s figure into digit wheels and rolls them to the real value as it scrolls into view (MOTION.md E21, and the tiles in E24).
// The printed figure stays in the DOM, visually hidden, so screen readers and copy-and-paste still get the real number.
// Hooks: .count holds the wheels, each .count__w is one digit; --d is the row to show and --i is its position, set with setProperty.

const token = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

const wheel = (digit: string, position: number) => {
  const column = document.createElement('span');
  column.className = 'count__w';
  column.style.setProperty('--d', '0');
  column.style.setProperty('--i', String(position));
  // A zero turns all the way round to the second 0 on the strip, so every digit of 100 moves.
  column.dataset.to = digit === '0' ? '10' : digit;
  const strip = document.createElement('span');
  strip.className = 'count__strip';
  strip.textContent = '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0';
  column.append(strip);
  return column;
};

// A dashboard tile holds a live number the BB/$ switch rewrites: its wheels leave when they stop, or at once if the switch is flipped first.
const live = new Map<Element, () => void>();

const rolling = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      rolling.unobserve(entry.target);
      const columns = entry.target.querySelectorAll<HTMLElement>('.count__w');
      // One frame after the zeros are painted, so the move is a transition and not a jump.
      requestAnimationFrame(() => columns.forEach((column) => column.style.setProperty('--d', column.dataset.to ?? '0')));
      const finish = live.get(entry.target);
      if (finish) setTimeout(finish, token('--dur-4') + columns.length * token('--stagger'));
    }
  },
  { rootMargin: '0px 0px -25% 0px' },
);

document.addEventListener('unit:change', () => live.forEach((finish) => finish()));

// Reduced motion: no wheels at all, the printed figure is the final number. Nor for anything already on screen when this runs: it would blink to zero and back.
const allowed = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const fold = innerHeight * 0.75;
const counters = allowed ? [...document.querySelectorAll<HTMLElement>('[data-counter]')].filter((counter) => counter.getBoundingClientRect().top > fold) : [];
const dollars = document.documentElement.dataset.unit === 'usd';

for (const counter of counters) {
  const text = counter.querySelector<HTMLElement>('.counter__text, .num__v');
  const isLive = text?.matches('.num__v');
  // The saved dollar view keeps its plain figures: the switch has already rewritten them, or is about to.
  if (!text?.textContent || (isLive && dollars)) continue;
  const wheels = document.createElement('span');
  wheels.className = 'count';
  wheels.setAttribute('aria-hidden', 'true');
  let digits = 0;
  for (const char of text.textContent) wheels.append(/\d/.test(char) ? wheel(char, digits++) : char);
  text.classList.add('visually-hidden');
  text.after(wheels);
  rolling.observe(counter);
  if (isLive) {
    live.set(counter, () => {
      live.delete(counter);
      rolling.unobserve(counter);
      wheels.remove();
      text.classList.remove('visually-hidden');
    });
  }
}
