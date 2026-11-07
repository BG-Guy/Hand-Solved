// card-art.ts: the URL of each card's art in src/assets/svg/deck/, for PlayingCard.astro and for a section's loose backs (a deck, a burn pile). Build-time only.
// The art is <img> files, not inline SVG, so the page carries no card drawing in its HTML. scripts/build-deck.mjs writes them; never edit them by hand.
const files = import.meta.glob<string>('../../assets/svg/deck/*.svg', { eager: true, query: '?url', import: 'default' });

/** One card's art: a face code in lower case ("kd", "9c"), or "back". */
export function cardArt(name: string): string {
  const found = files[`../../assets/svg/deck/card-${name}.svg`];
  if (!found) throw new Error(`card-art: no card "${name}" in src/assets/svg/deck/.`);
  return found;
}
