// SiteFooter.ts: the reveal footer's behaviour. The page works without it (the footer then shows in full, in flow, at its end state). It adds:
//  - --reveal-footer-p on the wrapper: 0 while the sheet (the page) still covers the footer, 1 once it has lifted clear. Always 1 in flow mode.
//  - flow mode (.reveal-footer--flow): below 1024 px, or whenever the footer is taller than the screen, since a footer that tall could never show its top.
//  - focus: tabbing into a footer the sheet still covers scrolls the sheet clear, so focus is never hidden.
const root = document.querySelector<HTMLElement>('[data-reveal-footer]');
const sheet = root?.querySelector<HTMLElement>('.reveal-footer__sheet');
const footer = root?.querySelector<HTMLElement>('.site-footer');

if (root && sheet && footer) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 64rem)');
  let frame = 0;
  let near = false;
  let written = '';
  root.classList.add('reveal-footer--js');

  // The property goes on the footer, not the wrapper: the wrapper holds the whole page, and a custom property changed on it restyles every element every frame.
  const update = () => {
    frame = 0;
    const lifted = innerHeight - sheet.getBoundingClientRect().bottom;
    const p = (root.classList.contains('reveal-footer--flow') ? 1 : Math.min(1, Math.max(0, lifted / footer.offsetHeight))).toFixed(4);
    if (p !== written) footer.style.setProperty('--reveal-footer-p', (written = p));
  };
  const queue = () => {
    if (near && !frame) frame = requestAnimationFrame(update);
  };

  const fit = () => {
    root.classList.toggle('reveal-footer--flow', !wide.matches || reduce.matches || footer.offsetHeight > innerHeight);
    queue();
  };

  // Per-frame work only while the sheet's end is within half a screen. A marker at that end, because the wrapper holds the whole page and a stuck footer is always on screen, so neither ever leaves.
  const end = document.createElement('span');
  end.className = 'reveal-footer__end';
  end.setAttribute('aria-hidden', 'true');
  sheet.append(end);
  new IntersectionObserver(([entry]) => {
    near = entry.isIntersecting;
    queue();
  }, { rootMargin: '50% 0px' }).observe(end);
  new ResizeObserver(fit).observe(footer);
  reduce.addEventListener('change', fit);
  addEventListener('resize', fit, { passive: true });
  addEventListener('scroll', queue, { passive: true });
  fit();

  footer.addEventListener('focusin', () => {
    if (root.classList.contains('reveal-footer--flow') || root.getBoundingClientRect().bottom <= innerHeight + 1) return;
    root.scrollIntoView({ block: 'end', behavior: reduce.matches ? 'auto' : 'smooth' });
  });
}
