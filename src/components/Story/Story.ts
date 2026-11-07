// Story.ts: marks the step in the middle of the screen, and its scene and dot, as active. State only: classes and aria-current. All motion lives in motion.css.
// .story--js turns on the inactive and active looks, and only while the story is pinned; stacked (reduced motion, short screen) every step reads at full strength.
const pinned = matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 37.5rem)');

for (const root of document.querySelectorAll<HTMLElement>('[data-story]')) {
  const steps = [...root.querySelectorAll<HTMLElement>('.story__step')];
  const sets = [steps, [...root.querySelectorAll<HTMLElement>('.story__scene')], [...root.querySelectorAll<HTMLElement>('.story__dot')]];

  // The active step is the last one whose top has passed the trigger line, so a jump from far away (a nav link, a reload) lands on the right scene too.
  const update = () => {
    const line = innerHeight * 0.6;
    const active = Math.max(0, steps.findLastIndex((step) => step.getBoundingClientRect().top < line));
    for (const set of sets) set.forEach((el, index) => el.classList.toggle('is-active', index === active));
    steps.forEach((step, index) => (index === active ? step.setAttribute('aria-current', 'step') : step.removeAttribute('aria-current')));
  };

  // The band between 50% and 60% of the screen height: a step crossing it changes the answer. The root covers arrivals from outside the story.
  const crossing = new IntersectionObserver(update, { rootMargin: '-50% 0px -40% 0px' });
  steps.forEach((step) => crossing.observe(step));
  new IntersectionObserver(update).observe(root);

  const sync = () => root.classList.toggle('story--js', pinned.matches);
  pinned.addEventListener('change', sync);
  sync();
}
