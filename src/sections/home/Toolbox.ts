// Toolbox.ts: the Insights, Goals and History tabs (UX.md 4.6). Roving focus, arrow keys, Home and End, the thumb under the selected tab, and the panel swap.
// Without this script every panel stays open one after another and the tab row stays hidden, so nothing is lost.
const root = document.querySelector<HTMLElement>('#toolbox');
const list = root?.querySelector<HTMLElement>('[role="tablist"]');

if (root && list) {
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')!)!);
  // Durations come from the tokens, never from this file. Under reduced motion the token is 0.01 ms, so the swap is instant.
  const ms = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  let current = 0;
  let timer = 0;

  // The thumb is placed with two custom properties: motion.css moves it with a spring.
  const place = () => {
    list.style.setProperty('--x', `${tabs[current].offsetLeft}px`);
    list.style.setProperty('--w', `${tabs[current].offsetWidth}px`);
  };

  const show = (index: number) =>
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      panel.classList.remove('is-leaving');
    });

  // The leaving panel fades out for --dur-1 (class is-leaving), then the hidden attribute swaps. The entering panel plays its own entrance.
  const select = (index: number, focus = false) => {
    if (focus) tabs[index].focus();
    if (index === current) return;
    const leaving = panels[current];
    current = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    place();
    tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    clearTimeout(timer);
    leaving.classList.add('is-leaving');
    timer = window.setTimeout(() => show(index), ms('--dur-1'));
  };

  list.addEventListener('click', (event) => {
    const tab = (event.target as Element).closest<HTMLElement>('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  });

  list.addEventListener('keydown', (event) => {
    const last = tabs.length - 1;
    const to = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current ? current - 1 : last, Home: 0, End: last }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    select(to, true);
  });

  // Fonts and the viewport change tab widths, so the thumb is measured again.
  const resize = new ResizeObserver(place);
  [list, ...tabs].forEach((el) => resize.observe(el));

  root.classList.add('toolbox--js');
  show(0);
  place();

  // The first view: the device and chips assemble as the panel comes on screen (MOTION.md E27).
  const seen = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      root.classList.add('is-seen');
      seen.disconnect();
    },
    { rootMargin: '0px 0px -25% 0px' },
  );
  seen.observe(panels[0].parentElement!);
}

// A module, so its top-level names stay out of the global scope.
export {};
