// Showdown.ts: moves the table's state and nothing else. The deals are CSS (Showdown.deal.css), started by data-street; this file only says when a street has landed.
// Durations are read from the CSS (--end-*), so reduced motion needs no branch here. All words are in the HTML. Loaded lazily by the loader in Showdown.astro,
// which calls start() only once Showdown.css and Showdown.deal.css are in: those durations and every pose are in them.
//
// The carousel: until the visitor picks a reason, the dealt reasons take turns. The timer is the CSS animation on the chosen menu button's bar (sd-tick), so the
// bar, the pause on hover and the reduced-motion opt-out are all CSS; this file only moves on when that animation ends. Picking a reason, or Pause, stops it.
export function start(root: HTMLElement) {
  const all = <T extends Element>(selector: string) => [...root.querySelectorAll<T>(selector)];
  const puck = all<HTMLButtonElement>('[data-deal]')[0];
  const status = all<HTMLElement>('[data-status]')[0];
  const panels = all<HTMLElement>('[data-why]');
  const reading = all<HTMLElement>('.sd-whys__panels')[0];
  const picks = all<HTMLButtonElement>('[data-pick]');
  const autoToggle = all<HTMLButtonElement>('[data-auto-toggle]')[0];
  const order = ['preflop', 'flop', 'turn', 'river'];
  const ms = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  let at = 0;
  let busy = false;
  // The street that is landing: the replay can be pressed in the river's last moments, and must cancel it.
  let landing = 0;

  // The cards are plain blocks in the HTML, so that without script no button does nothing. Here they become real buttons. Undealt ones stay inert and unnamed: the name is the spoiler.
  const cards = all<HTMLElement>('[data-card]').map((block) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = block.className;
    button.dataset.card = block.dataset.card;
    button.dataset.name = block.dataset.name;
    button.append(...block.childNodes);
    block.replaceWith(button);
    button.parentElement!.closest('li')!.inert = true;
    return button;
  });
  const slot = (card: HTMLElement) => card.closest('li')!;
  const of = (street: string) => cards.filter((card) => slot(card).classList.contains(`on-${street}`));
  const dealt = () => cards.filter((card) => !slot(card).inert);

  const select = (chosen?: HTMLElement) => {
    for (const card of cards) card.setAttribute('aria-pressed', String(card === chosen));
    for (const pick of picks) pick.setAttribute('aria-pressed', String(pick.dataset.pick === chosen?.dataset.card));
    for (const panel of panels) panel.classList.toggle('is-on', panel.dataset.why === chosen?.dataset.card);
    // Only the smallest phones scroll the reason inside its panel; then, and only then, the keyboard can reach it.
    reading.tabIndex = reading.scrollHeight > reading.clientHeight + 1 ? 0 : -1;
  };

  // Rotating, the panel is not announced every three seconds; picked by the visitor, it is.
  const setAuto = (on: boolean) => {
    root.toggleAttribute('data-auto', on);
    reading.setAttribute('aria-live', on ? 'off' : 'polite');
  };
  setAuto(!matchMedia('(prefers-reduced-motion: reduce)').matches);

  const settle = (newest: HTMLElement[]) => {
    busy = false;
    delete root.dataset.busy;
    puck.removeAttribute('aria-disabled');
    for (const card of newest) {
      slot(card).inert = false;
      card.setAttribute('aria-label', card.dataset.name!);
      picks.find((pick) => pick.dataset.pick === card.dataset.card)!.hidden = false;
    }
    autoToggle.hidden = false;
    // The first card of the street, so the flop reads left to right, in the order it was dealt.
    select(newest[0]);
    // The puck has left the table at the river: keep the keyboard where the next step is.
    // preventScroll: a visitor who scrolled away during the river is not pulled back.
    if (at === 3 && document.activeElement === puck) all<HTMLElement>('.sd-end__main')[0].focus({ preventScroll: true });
  };

  const deal = () => {
    if (busy || at === 3) return;
    const street = order[++at];
    // A press from a half-scrolled section brings the whole table into view, so nothing is dealt off screen.
    // Not on a screen too short to hold it: that would push the puck off the bottom.
    if (Math.abs(root.getBoundingClientRect().top) > 8 && root.offsetHeight <= innerHeight + 1) root.scrollIntoView({ block: 'start' });
    busy = true;
    root.dataset.street = street;
    root.dataset.busy = '';
    puck.setAttribute('aria-disabled', 'true');
    select();
    const newest = of(street);
    for (const card of newest) card.querySelector('.pc')!.classList.add('is-up');
    status.textContent = root.getAttribute(`data-say-${street}`);
    landing = window.setTimeout(() => settle(newest), ms(`--end-${street}`));
  };

  const again = () => {
    clearTimeout(landing);
    at = 0;
    busy = true;
    root.dataset.reset = '';
    root.dataset.street = order[0];
    select();
    for (const card of cards) {
      slot(card).inert = true;
      // Unnamed again, as before the first deal: the name is the spoiler.
      card.removeAttribute('aria-label');
      card.querySelector('.pc')!.classList.remove('is-up');
    }
    for (const pick of picks) pick.hidden = true;
    autoToggle.hidden = true;
    status.textContent = '';
    puck.focus({ preventScroll: true });
    setTimeout(() => {
      busy = false;
      delete root.dataset.reset;
    }, ms('--end-reset'));
  };

  root.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button) return;
    if (button === puck) deal();
    else if (button.hasAttribute('data-again')) again();
    else if (button === autoToggle) setAuto(!root.hasAttribute('data-auto'));
    else if (busy) return;
    // A reason the visitor picks, from a card or from the menu, ends the carousel: they are reading now.
    else if (button.dataset.card || button.dataset.pick) {
      setAuto(false);
      select(cards.find((card) => card.dataset.card === (button.dataset.card ?? button.dataset.pick)));
    }
  });

  // The carousel's step: the timer bar on the chosen menu button has run out, so the next dealt reason comes up.
  root.addEventListener('animationend', (event) => {
    if (event.animationName !== 'sd-tick' || busy || !root.hasAttribute('data-auto')) return;
    const list = dealt();
    const now = list.findIndex((card) => card.getAttribute('aria-pressed') === 'true');
    select(list[(now + 1) % list.length]);
  });

  // One short attention beat on the puck, the first time the table is really in view.
  new IntersectionObserver(
    ([entry], watcher) => {
      if (entry.isIntersecting) {
        root.dataset.lit = '';
        watcher.disconnect();
      }
    },
    { threshold: 0.6 },
  ).observe(root);

  // The timer holds while the table is off screen, so nobody comes back to a reason they never chose.
  new IntersectionObserver(([entry]) => root.toggleAttribute('data-away', !entry.isIntersecting)).observe(root);

  root.dataset.ready = '';
  if ('queued' in root.dataset) {
    delete root.dataset.queued;
    deal();
  }
}
