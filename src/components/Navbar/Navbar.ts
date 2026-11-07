// Navbar.ts: the header's behaviour. The page works without it (links wrap under the brand); it adds:
//  1. compact on scroll: data-scrolled on the header once the page is 16 px down
//  2. the gliding slip: follows hover and focus over the links, rests on the current link
//  3. section-current on home: the link whose section is in view gets aria-current="true"
//  4. the header button swaps from secondary to primary once the hero button has left the screen
//  5. the mobile menu: a modal <dialog> opened from the burger, closed by its X, Esc, a link or growing past 1024 px; focus returns to the burger, except after a link
import { settleTime } from '../../scripts/settle-time';

const nav = document.querySelector<HTMLElement>('[data-nav]');

if (nav) {
  // -------------------------------------------------------------------------
  // 1. Compact on scroll: a 1 px sentinel 16 px below the top of the page. When it leaves the screen the page is scrolled. No scroll listener.
  // -------------------------------------------------------------------------
  const sentinel = document.createElement('span');
  sentinel.className = 'nav-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => nav.toggleAttribute('data-scrolled', !entry.isIntersecting)).observe(sentinel);

  // -------------------------------------------------------------------------
  // 2. The slip. It moves with --pill-x and --pill-w, and appears in place the first time instead of sliding in from the corner.
  // -------------------------------------------------------------------------
  const track = nav.querySelector<HTMLElement>('.nav__links');
  const pill = nav.querySelector<HTMLElement>('.nav__pill');
  const currentLink = () => track?.querySelector<HTMLElement>('a[aria-current]') ?? null;
  let target: HTMLElement | null = currentLink();

  const place = (link: HTMLElement | null, instant = false) => {
    if (!pill) return;
    target = link;
    const jump = instant || pill.style.opacity !== '1';
    if (jump) pill.style.transition = 'none';
    pill.style.opacity = link ? '1' : '0';
    if (link) {
      pill.style.setProperty('--x', `${link.offsetLeft}px`);
      pill.style.setProperty('--w', `${link.offsetWidth}px`);
    }
    if (jump) {
      void pill.offsetWidth;
      pill.style.transition = '';
    }
  };

  if (track && pill) {
    const linkOf = (e: Event) => (e.target instanceof Element ? e.target.closest<HTMLElement>('a') : null);
    track.addEventListener('pointerover', (e) => {
      const link = linkOf(e);
      if (link) place(link);
    });
    track.addEventListener('pointerleave', () => place(currentLink()));
    track.addEventListener('focusin', (e) => place(linkOf(e)));
    track.addEventListener('focusout', (e) => {
      if (!(e.relatedTarget instanceof Node && track.contains(e.relatedTarget))) place(currentLink());
    });
    new ResizeObserver(() => place(target, true)).observe(track);
    place(target, true);

    // -----------------------------------------------------------------------
    // 3. Section-current, home only: the section that crosses a thin band near the middle of the screen.
    // -----------------------------------------------------------------------
    const sections = new Map<Element, HTMLElement>();
    for (const link of track.querySelectorAll<HTMLElement>('a[href^="#"]')) {
      const section = document.querySelector(link.getAttribute('href') ?? '');
      if (section) sections.set(section, link);
    }
    if (sections.size) {
      const inBand = new Set<Element>();
      const spy = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) (entry.isIntersecting ? inBand.add(entry.target) : inBand.delete(entry.target));
          const active = [...inBand].pop();
          for (const link of sections.values()) link.removeAttribute('aria-current');
          if (active) sections.get(active)?.setAttribute('aria-current', 'true');
          if (!track.matches(':hover') && !track.contains(document.activeElement)) place(currentLink());
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const section of sections.keys()) spy.observe(section);
    }
  }

  // -------------------------------------------------------------------------
  // 4. Button style: secondary while the hero button is in view, primary after. Pages with no hero button keep what the server printed.
  // -------------------------------------------------------------------------
  const cta = nav.querySelector<HTMLElement>('.nav__cta');
  const hero = document.querySelector('[data-cta="hero"]');
  if (cta && hero) {
    new IntersectionObserver(([entry]) => {
      cta.classList.toggle('btn--secondary', entry.isIntersecting);
      cta.classList.toggle('btn--primary', !entry.isIntersecting);
    }).observe(hero);
  }

  // -------------------------------------------------------------------------
  // 5. Mobile menu
  // -------------------------------------------------------------------------
  const toggle = nav.querySelector<HTMLElement>('[data-nav-toggle]');
  const menu = nav.querySelector<HTMLDialogElement>('.nav__menu');
  if (toggle && menu) {
    const SECOND_CLICK_MS = 400;
    let openedAt = 0;
    toggle.addEventListener('click', () => {
      openedAt = performance.now();
      // The circle grows from the middle of the burger.
      const box = toggle.getBoundingClientRect();
      menu.style.setProperty('--mx', `${box.left + box.width / 2}px`);
      menu.style.setProperty('--my', `${box.top + box.height / 2}px`);
      menu.showModal();
      // Two frames, so the closed look is painted before the open look starts the transition.
      requestAnimationFrame(() => requestAnimationFrame(() => (menu.dataset.state = 'open')));
    });

    // A link in the panel closes it too, but then the link's target owns the reading position and focus must not jump back to the burger (WCAG 2.4.3).
    let viaLink = false;

    // Close with the reverse animation, then really close. Esc, the X and a link all come here.
    const close = () => {
      if (!menu.open || !menu.dataset.state) return;
      delete menu.dataset.state;
      // Wait one frame so the timer starts with the CSS transition, then for as long as the CSS says it lasts.
      requestAnimationFrame(() =>
        setTimeout(() => {
          if (!menu.open) return;
          // A modal dialog hands focus back to the element that had it when it opened (the burger). After a link the starting point for Tab is the link's target, set by the jump,
          // so the burger cannot take focus for this one close. Esc and the X leave it focusable, and focus goes back to it as before.
          toggle.inert = viaLink;
          menu.close();
        }, settleTime(menu)),
      );
    };
    menu.addEventListener('cancel', (e) => {
      e.preventDefault();
      close();
    });
    menu.addEventListener('click', (e) => {
      // The X opens under the burger, so the second click of a double-click would close the menu it just opened. Touch browsers don't all count clicks, so for touch the time is checked too.
      const touch = (e as PointerEvent).pointerType === 'touch';
      if (e.detail > 1 || (touch && performance.now() - openedAt < SECOND_CLICK_MS)) return;
      const hit = e.target instanceof Element ? e.target.closest('[data-nav-close], a[href]') : null;
      if (!hit) return;
      viaLink = hit.matches('a[href]');
      close();
    });
    // Any way the panel closes (including Dialog.ts handing off to a pop-up): reset it. Focus goes back to the burger unless a pop-up or a link's target took it.
    menu.addEventListener('close', () => {
      delete menu.dataset.state;
      toggle.inert = false;
      if (viaLink) {
        viaLink = false;
        return;
      }
      if (!document.querySelector('dialog[open]')) toggle.focus();
    });
    // Focus trap: the page behind a modal dialog is inert, and Tab also wraps from the last control to the first (and back) instead of leaving for the browser.
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const controls = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const [first, last] = [controls[0], controls[controls.length - 1]];
      if (e.shiftKey && document.activeElement === first) last.focus();
      else if (!e.shiftKey && document.activeElement === last) first.focus();
      else return;
      e.preventDefault();
    });
    matchMedia('(min-width: 64rem)').addEventListener('change', (e) => {
      if (e.matches && menu.open) menu.close();
    });
  }
}
