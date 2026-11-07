// reveal-fallback.ts: one-shot reveals for browsers without scroll timelines (MOTION.md 7.1). Each element gets .is-in once, as it arrives.
// The start poses exist only under html.reveal-io (motion.css), which is added last: everything already on screen or above it is marked first, so nothing flashes,
// and a script that never runs leaves everything visible.
const watch = (selector: string, bottomMargin: string) => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: `0px 0px ${bottomMargin} 0px` },
  );
  const line = innerHeight * 0.9;
  for (const el of document.querySelectorAll(selector)) {
    if (el.getBoundingClientRect().top < line) el.classList.add('is-in');
    else observer.observe(el);
  }
};

watch('[data-reveal]', '-10%');
// The bankroll line waits until its plot is well on screen, so its one draw is seen.
watch('[data-draw]', '-40%');
document.documentElement.classList.add('reveal-io');

export {};
