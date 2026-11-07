# HandSolved site: the Showdown deck

Owner: `svg-expert`. Nine faces (A♠ A♣ K♦ J♦ A♥ 9♣ Q♦ 10♦ A♦) and one back, in `src/assets/svg/deck/`, used by `SHOWDOWN.md` through `src/components/Deck/PlayingCard.astro`, as `<img>` files (URLs from `card-art.ts`). Edit `scripts/build-deck.mjs` and run `node scripts/build-deck.mjs`, never an output. The court bitmaps are the text rows in that script.

## Use

```astro
---
import PlayingCard from '../../components/Deck/PlayingCard.astro';
---
<div class="hand">
  <PlayingCard code="Kd" />
  <button type="button" class="board-card">
    <PlayingCard code="Ad" faceDown label="Ace of diamonds, river: A coach for your real hands" />
  </button>
</div>
```

```css
.hand { --card-w: 6rem; }              /* The only way to size a card. A length, never a percentage: it also sets the depth of the flip. */
.sd { --pc-flip-dur: 600ms; }          /* Each section sets its own timing */
```

```js
card.classList.add('is-up');           // Turn it over. Remove the class to turn it back.
```

Each face is an `<img>` of a cached SVG file, `loading="lazy"`, with `width="65" height="91"`: ten small requests on the first visit instead of about 6 KB gz of drawing in every page's HTML (the home page's HTML budget). The markup is `<span>` and `<img>`, so it is valid inside a `<button>`. Height comes from `aspect-ratio`, so nothing shifts. A loose back (a deck, a burn pile) is the same `<img>`, with `cardArt('back')` from `card-art.ts`.

| Prop | Default | |
|---|---|---|
| `code` | required | `CardCode` from `src/data/showdown.ts`: `As Ac Kd Jd Ah 9c Qd Td Ad`. The ten is `Td` |
| `faceDown` | `false` | Starts back up, without `.is-up` |
| `label` | none | Prints a `.visually-hidden` name. Without it the card is `aria-hidden` |
| `class`, others | | Passed to `.pc` |

| Custom property | Default | Set it on `.pc` or any parent |
|---|---|---|
| `--card-w` | The parent's width | Width. Height follows at 5:7 |
| `--pc-flip-dur` | `--dur-4` | Flip duration, so each version can set its own |
| `--pc-flip-ease` | `--ease-in-out` | Flip easing |
| `--pc-flip-delay` | `0ms` | Flip delay, for a wave of columns |
| `--pc-perspective` | `--card-w` x 3 | Depth of the flip. Nothing is needed on the parent |
| `--pc-turn` | `180deg` | The angle while not `.is-up`. `-180deg` turns the other way; `165deg` lifts one edge for a squeeze |

| Class | What |
|---|---|
| `.pc` | The card, and the element that rotates. `.is-up` on it means face up. Every deck card also carries `.pc--deck`, and `PlayingCard.css` keys on that, because the sample-hand pop-up prints its own `.pc` cards |
| `.pc__front`, `.pc__back` | The two faces, `backface-visibility: hidden`. Also the place for a selection ring: they carry the card's corner radius |
| `.pc__art` | The `<img>` in each face |

Inside the art the classes keep their names (`.pc-index`, `.pc-pip`, `.pc-court`, `.pc-hair`, `.pc-edge`, `.cb-lattice`, `.med-mark` and the rest), but page CSS cannot reach into an `<img>`. Anything that depends on size is a `<style>` in the file itself: a width query there measures the image. Only the A♦ has one, which hides its lattice and keyline under 200 px wide. Resolution queries do not reach inside an image (checked in Chrome and WebKit), so the hairline is 1 px on every screen.

## Rules for whoever stages it

- **Never put `transform`, `opacity`, `filter`, `overflow`, `clip-path` or `mask` on `.pc`.** The first overwrites the flip and the rest flatten it. Move, fade and clip a wrapper. A wrapper that tilts needs `transform-style: preserve-3d` to stay in the same 3D space.
- **Set `--card-w` to the largest size a card reaches** and scale the wrapper down from there. A layer scaled up goes soft.
- **A card without `.is-up` paints only its back.** At rest only one face is painted, so the right one shows even where 3D is flattened. If `--pc-turn` takes a card past edge-on before `.is-up` is added, give its `.pc__front` `visibility: visible`.
- **Reduced motion:** the transitions exist only inside `prefers-reduced-motion: no-preference`, so a card turns at once. Fades are the section's job.
- The portraits are antialiased at every size, because every card on the table is scaled and most are turned, where crisp edges would drop rows.
- `label` is read even while a card is face down, so do not name a hidden card until it is dealt.

## The drawing

- **Grid.** 65 x 91 cells, the chart's 13 times 5 by 7. Corner 4 cells, about 6% of the width, like a real card. Deliberately tighter than the `--card-radius` token (10%), which suits small scene cards and looks like an app tile at full height.
- **The centre cell.** Cell 32, 45 is the middle of every drawing. It is the red cell of the mark on the back, the red cell of the brooch on the three courts, and the one white cell in the A♦, whose lattice is the chart's 13 x 13 grid drawn to the shape of the pip. It does not move when a card flips.
- **Courts.** Original portraits on the grid, traced from no maker's design. One end is written down and the other is that end turned 180 degrees about the centre cell (a `<use>`, so a court is point-symmetric by construction and half the bytes). All three glance right: in the royal fan they are side-eyeing the ace.
- **Inks.** Face White, Key Black and Pip Red, plus Overprint Red for lattice lines only, as on the rest of the site. They are written out as hex in `build-deck.mjs`, from `tokens.css`, because an image cannot read tokens; change both together. The hairline is `--line-strong` on ink (#373c3f), the only ground the deck sits on. A deck on another ground would need its own back and faces built with that ground's hairline.
- **The index.** Rank outlines are Sofia Sans Extra Condensed 800, read from the site's font file. The 1 in "10" has lost its foot and "10" is narrowed 10% to clear the pips. Suits are the `icon-suit-*` paths, with one pinhole in the club filled; it never shows at icon size.

## For the owner

`DESIGN.md` guard 10 and `SHOWDOWN.md` say no faces. A king, a queen and a jack need faces, and the deck brief asks for them, so the courts have them. They are the only faces on the site.
