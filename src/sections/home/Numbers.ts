// Numbers.ts: reads the bankroll plot by pointer, touch and the arrow keys (UX.md 4.5, MOTION.md E26). It only moves a rule, grows one dot and writes the readout.
// The words are copied from the data table, whose figures UnitSwitch.ts keeps in the unit that is showing, so there is no formatter here and no second source of numbers.
const plot = document.querySelector<HTMLElement>('[data-bankroll-plot]');
const rows = [...document.querySelectorAll<HTMLTableRowElement>('[data-bankroll-table] tbody tr')];

if (plot && rows.length) {
  const area = plot.querySelector<HTMLElement>('.plot__area')!;
  const slip = plot.querySelector<HTMLElement>('.plot__readout')!;
  const live = document.querySelector<HTMLElement>('[data-bankroll-live]')!;
  let at = rows.length - 1;
  let frame = 0;

  // Two plots print and CSS shows one: use the one that has a box.
  const visible = () => [...area.querySelectorAll<SVGSVGElement>('svg')].find((svg) => svg.getClientRects().length)!;

  const show = (index: number, say = false) => {
    at = Math.max(0, Math.min(rows.length - 1, index));
    const svg = visible();
    const dots = [...svg.querySelectorAll('.dot')];
    dots.forEach((dot, i) => dot.classList.toggle('is-on', i === at));
    const x = Number(dots[at].getAttribute('cx'));
    const cells = rows[at].cells;
    slip.textContent = `Session ${cells[0].textContent}, ${cells[1].textContent} h, ${cells[2].textContent}`;
    // --rx moves the rule in drawing units, --rp is the same place as a percentage of the plot for the slip.
    plot.style.setProperty('--rx', String(x));
    plot.style.setProperty('--rp', String((x / svg.viewBox.baseVal.width) * 100));
    plot.classList.add('is-reading');
    if (say) live.textContent = slip.textContent;
  };

  const hide = () => {
    plot.classList.remove('is-reading');
    plot.querySelectorAll('.is-on').forEach((dot) => dot.classList.remove('is-on'));
  };

  // Pointer, touch and drag: the nearest point to the finger, one write per frame.
  const point = (event: PointerEvent) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const svg = visible();
      const box = area.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * svg.viewBox.baseVal.width;
      const xs = [...svg.querySelectorAll('.dot')].map((dot) => Number(dot.getAttribute('cx')));
      show(xs.reduce((best, value, i) => (Math.abs(value - x) < Math.abs(xs[best] - x) ? i : best), 0));
    });
  };
  area.addEventListener('pointerdown', point);
  area.addEventListener('pointermove', point);
  plot.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    if (!plot.matches(':focus')) hide();
  });

  // Keyboard: the chart is one tab stop. Arrows step a session, Home and End jump, and each step is said once through the status line.
  plot.tabIndex = 0;
  plot.addEventListener('focus', () => show(at));
  plot.addEventListener('blur', hide);
  plot.addEventListener('keydown', (event) => {
    const to = { ArrowLeft: at - 1, ArrowRight: at + 1, Home: 0, End: rows.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    show(to, true);
  });

  // A flip of the switch while reading: the table already holds the new figures.
  document.addEventListener('unit:change', () => plot.classList.contains('is-reading') && show(at));
}

// A module, so its top-level names stay out of the global scope.
export {};
