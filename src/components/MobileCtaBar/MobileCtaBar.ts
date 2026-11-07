// MobileCtaBar.ts: when the bottom bar shows (UX.md section 2, sticky CTA rules).
//  - It waits until the hero button (data-cta="hero") has fully left the screen upward. A page with no hero button shows it at once.
//  - It steps away while the footer is 20% in view, while the pricing section is 40% in view (its own buttons ask for something else), and while a story's own
//    button (data-cta="story") is on screen.
//  - Through a pinned story it stays, but slim (data-slim), so the story keeps its room and the button is still one tap away.
// A dialog or the menu being open is handled in CSS.
const bar = document.querySelector<HTMLElement>('[data-mobile-bar]');

if (bar) {
  const hero = document.querySelector('[data-cta="hero"]');
  let heroGone = !hero;
  let footerNear = false;
  let pricingNear = false;
  const storiesNear = new Set<Element>();
  const ownButtons = new Set<Element>();

  const update = () => {
    const show = heroGone && !footerNear && !pricingNear && ownButtons.size === 0;
    bar.toggleAttribute('data-visible', show);
    bar.toggleAttribute('data-slim', storiesNear.size > 0);
    bar.inert = !show;
  };

  if (hero) {
    new IntersectionObserver(([entry]) => {
      heroGone = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      update();
    }).observe(hero);
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    new IntersectionObserver(([entry]) => {
      footerNear = entry.intersectionRatio >= 0.2;
      update();
    }, { threshold: [0, 0.2] }).observe(footer);
  }

  // "40% in view" is 40% of the screen, or of the section if it is shorter than the screen: the pricing section is taller than a phone, so a plain ratio would never get there.
  const pricing = document.querySelector('#pricing');
  if (pricing) {
    new IntersectionObserver(
      ([entry]) => {
        pricingNear = entry.intersectionRect.height >= 0.4 * Math.min(entry.boundingClientRect.height, entry.rootBounds?.height ?? innerHeight);
        update();
      },
      { threshold: Array.from({ length: 101 }, (_, step) => step / 100) },
    ).observe(pricing);
  }

  // "50% in view": the story overlaps the middle half of the screen. A pinned story is taller than the screen, so a ratio would never get there.
  const stories = document.querySelectorAll('[data-hides-mobile-bar], #how, #steps');
  if (stories.length) {
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.isIntersecting ? storiesNear.add(entry.target) : storiesNear.delete(entry.target));
        update();
      },
      { rootMargin: '-25% 0px -25% 0px' },
    );
    stories.forEach((story) => watcher.observe(story));
  }

  // The story ends with its own button, so the bar leaves while any part of it is on screen.
  const own = document.querySelectorAll('[data-cta="story"]');
  if (own.length) {
    const watcher = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.isIntersecting ? ownButtons.add(entry.target) : ownButtons.delete(entry.target));
      update();
    });
    own.forEach((button) => watcher.observe(button));
  }

  update();
}
