# Showdown: the flop, turn and river section

The owner asked for the peak of the website: a full-screen section that shows why the app beats its competitors by making the visitor deal a flop, a turn and a river, where each card is a reason, and it gets better as you go. "It needs to be the peak of the website." Two versions were built; on 2026-11-02 the owner chose A, "The Table", and it is on the home page as `#showdown`, right after the hero (moved there from before `#pricing` on 2026-11-02). Do not worry about features repeated elsewhere on the page; the owner filters that later.

Owner's words on interaction: "make the user decide to click for a flop, turn and river." "When you click on each card, it gets highlighted, slightly raised up, and a description appears somewhere, the idea is that the user can read more about it. All in the same section. It's a kind of showcase." "Make it a full screen section." "Mostly CSS and front end work, and animations, make it look appealing, unique."

## The idea

The owner named "the classic royal flush hand with Mabuchi": the real hand from the 2008 WSOP Main Event where Motoyuki Mabuchi's four aces lost to Justin Phillips's royal flush.

**Other poker tools hold the aces. HandSolved holds the royal.** Aces are strong, and so are the other tools. Then the river comes.

- Other poker tools: A♠ A♣, black. HandSolved: K♦ J♦, red. This matches the site's device: black is what you did, red is the coach's mark.
- Board: A♥ 9♣ Q♦, then 10♦, then A♦, the last ace in the deck. It gives them four aces and gives you the royal on the same card.
- Each board card is one reason, sorted from good to best. The lead flips on the turn.

| Street | Other tools | HandSolved | Reasons |
|---|---|---|---|
| Before the flop | Pocket aces, 82% | K♦ J♦, 18% | |
| Flop | Three aces, 84% | Needs a ten, 16% | A♥ price, 9♣ table or desk, Q♦ insights |
| Turn | Three aces, 18% | A straight, 82% | 10♦ practice, 3-way and tournament |
| River | Four aces, 0% | Royal flush, 100% | A♦ the coach and the engine |

Everything real comes from `src/data/showdown.ts`, which is final: the words, the percentages and the cards. Import it; never retype or reword it. Win chances there were computed exactly from the cards. Flag copy problems rather than changing them.

## Requirements

**States.** `data-street` on the section: `preflop`, `flop`, `turn`, `river`. The visitor moves it forward with one obvious button whose label comes from the data. Nothing deals by itself on scroll: the visitor decides. A replay ("Deal it again") returns to `preflop`.

**The deal must feel earned.** Flop: three cards in sequence. Turn: slower, more weight. River: the slowest moment on the whole site, a real pause and squeeze before the A♦ shows. The river is the climax.

**Cards.** Dealt board cards are real buttons. Clicking or tapping one highlights it, raises it slightly, and shows its reason in the same section: title, line, three points, the `others` and `here` comparison, and the `tag` where there is one. Selecting never shifts layout. After each deal the street's first card is selected, so the flop reads left to right in the order it was dealt (A♥, then 9♣, then Q♦), and the reasons go from good to better. **The reason card (2026-11-04).** On the felt each reason is a card back from the deck: Pip Red, the lattice on a thin band, the white frame line just inside it, and the HandSolved medallion on the top band (one inline copy, `art-medallion.svg`, shared by all five). The reason's line and its comparison sit on a Face White sheet inside the card (and under the list at the finale), the first thing the eye reads; the three points show only in the no-script list, and the street's narration line and the hand's source line are gone (2026-11-06, less text). Its head prints the reason's number large, as a card prints its rank in the corner, then "Reason 3 of 5" in mono and, on tablet and desktop, the poker card it was dealt on (Q♦ · Flop) as a small tag; phones leave the tag out. White on plain Pip Red is 5.37:1. In the menu the number leads and the card is small. The race's names and hands use the mono label face at the label size, in the quiet ink (owner's call: quieter by face, not by fading below 4.5:1). Above the reason sits a plain menu: one numbered button per dealt reason (1 to 5, in deal order, shown only once its card is dealt), so the visitor sees there is something to press besides the cards; on the red finale it lists all five. Until the visitor picks a reason, the dealt reasons take turns every 3 seconds (a carousel), with a Pip Red timer line filling under the chosen number; it holds while a pointer or the keyboard is on the reasons and while the table is off screen, stops for good when the visitor picks a reason, and has a Pause/Play button (WCAG 2.2.2). Under reduced motion it does not rotate. While it rotates the panel is not a live region, so screen readers are not interrupted every 3 seconds. The reason card is a fixed box about half the screen tall on desktop and phones (its height per canvas is `--why-h`), which every reason fills without scrolling at every size checked. The race is smaller and quiet: names, hands, "Chance to win", the street labels and the hint are the muted ink at 70% (`--sd-quiet`, still 4.7:1 on the felt), and the hand cards are smaller than the board. Undealt cards cannot be selected.

**The race.** Both hands are always visible with their labels, current hand names and win chances, updating at each street. It reads at a glance: the aces lead, the lead flips on the turn, then 100. At the finale, make it obvious the aces lost: their hand name says Four aces and it still dims.

**The finale (revised 2026-11-03).** The headline is "HandSolved wins." (`copy.finale`); the hand itself (Royal flush, 100%) is in the score under the fan. No stamp, no story line, no losing cards: the poster is the headline, the fan, the score and the reasons. The reasons are the main list: "We win at showdown. Here’s how." over five named rows (number, card, title), one column on desktop and phones, two on tablet; the chosen row is filled and its line and its Other tools / HandSolved comparison sit right under the list (no bullet points there). On phones under 46rem tall the rows give way to five numbered buttons, and the chosen reason shows its own title. "Deal it again" is a small dealer button, like the one that dealt the hand. Earlier brief:  After the river, the five diamonds (10♦ J♦ Q♦ K♦ A♦, `hand.royal`) come together as the classic royal flush fan, the hand everyone recognizes, with `copy.finale` huge. A♥ 9♣ and the aces recede. Then the main button (opens `dlg-sample` through `CtaButton`), `copy.early` (opens `dlg-early`), and `copy.again`. The reason panel still works, so a visitor can reread any card from the finale.

**Full screen.** `min-block-size: 100svh`. At 1280x800, 1440x900, 1920x1080, 768x1024 and 390x844 everything fits in one screen with no scrolling inside it. At 375x667 and 360x640 the same if you can; if a panel has to overflow, it scrolls inside its own area and the deal button stays on screen. No sideways scroll at 320.

**Unique, the peak.** This must be the most striking moment on the site, and it must not look like any template. Spend the craft here. One or two real ideas executed extremely well beat ten effects. Layering, depth, weight and timing are what will make it feel expensive.

## The Table (the chosen version)

Dark. A real table seen from above, in Key Black, with the oval rail drawn in hairlines, in the shape of the table inside the app. Other tools sit on one side, HandSolved on the other, and the board in the middle in its 3, 1, 1 grouping with street labels. A deck sits at the dealer's position. The deal button is a dealer button: a round puck you press. Cards really travel: a burn card slides off, cards fly from the deck in an arc, land, and flip in 3D, with landing weight. The race is a tug-of-war bar between the two seats. At the river the A♦ slides out face down and stops, and a corner peels up slowly before the flip. Since 2026-11-02 the owner wants it light: no camera push-in, no zoom on the card, and nothing shakes (no table jolt, no hops). When it lands, red ink floods the table from that card outward (a scaled circle, transform only), the section turns to the red lattice, the five diamonds lift out of their positions and fly into the fan, and the losing cards leave the poster. While the table fills the screen the navbar steps away (scroll timelines only), and the page above dims as it arrives.

Version B, "The Wall" (five full-height card columns), was not chosen and was deleted with the two lab routes.

## Files and loading

| File | Job |
|---|---|
| `src/sections/home/Showdown.astro` | Markup from `src/data/showdown.ts`, and the loader |
| `src/sections/home/Showdown.shell.css` | The only part the page loads up front: the section's box, the canvas size and `--u` at every screen size, and the rule that keeps the table hidden until it is ready |
| `src/sections/home/Showdown.css` | The look: every state at rest, the three canvases, the no-script list |
| `src/sections/home/Showdown.deal.css` | The choreography, started by `data-street`; durations as `--end-*` |
| `src/sections/home/Showdown.ts` | State only: `start(root)` turns the board into buttons and moves `data-street`, `data-busy`, `.is-up` and `aria-pressed` |
| `src/components/Deck/` | The cards, as `<img>` files (`DECK.md`) |

**Loading.** Because the table sits right under the hero, the loader first waits for the page's load event, then watches for it two screens away. The look and the choreography are 13 KB gz, too much for the home page's 30 KB CSS budget on load (`ARCHITECTURE.md` section 6). So the page loads only the shell. When the section is two screens away, the loader fetches `Showdown.ts`, `Showdown.css` and `Showdown.deal.css` side by side (the sheet URLs are in `data-sheets`), then calls `start()`; that sets `data-ready`, and only then does the table show. A press made before then is kept and dealt on start. If anything fails to load, the section sets `data-static` and falls back to its no-script list. Without script, a `<noscript>` link loads `Showdown.css`, which lays the section out as that list. A failure of some other module removes `html[data-js]` (`head-guard.js`); the table then shows as the list too, styled only if its sheets had already arrived.

## Rules

- Design: `docs/site/DESIGN.md` sections 1, 3, 4, 5.5, 7.2, 7.5 and 7.6, and `src/styles/tokens.css`. Stay in Two Inks: card stock, Key Black, Pip Red, Face White, no gradients, no green felt, no chips, no faces, no hard offset shadows, no emoji. Suits are always SVG, never text characters. Teal never appears here. This section may be louder than the "one large red thing per view" guard allows, because it is the peak; the guard against shouting is that the type and timing stay exact. Tokens only: if a value is new, define it as a scoped custom property from tokens at the top of the section's CSS.
- Motion: `docs/site/ARCHITECTURE.md` section 4 rules 1 and 4, and `docs/site/MOTION.md` for tokens and how effects are written. Write animation longhands only, because shorthand with a timeline is silently dropped in production. Animate transform and opacity. No layout thrash. No autoplay longer than 5 seconds without a pause control: the idle state may have one short attention beat, not a loop. 60 fps on a mid-range phone is the target, so keep layers few and `will-change` only during a deal.
- CSP, section 8 of ARCHITECTURE: no `style=` attributes, no `<style>` in inline SVG, no `data:` URIs, no inline handlers. Scripts set custom properties with `el.style.setProperty`.
- Script: one sibling `.ts`, at most 2.5 KB gzipped, no libraries, loaded lazily with the two stylesheets (Files and loading). The home page has about 0.2 KB left in its 11 KB on-load JS budget, so keep the loader tiny.
- No JavaScript: every card and reason reads as a static list, all five dealt, no button that does nothing.
- Reduced motion: no flight, no flood, no tilt. Deals become quick fades, everything still works, and the finale still shows the fan.
- Accessibility: WCAG 2.2 AA. Real buttons, visible focus, keyboard works for everything, targets at least 44 px on phones. Selected card uses `aria-pressed` or a tabs pattern, and the reason area is a polite live region. Each card has an accessible name such as "Ace of diamonds, river: A coach for your real hands". Announce each street's change. Focus stays sensible after a deal and at the finale.
- Real content only. No competitor names. `others` lines stay generic, as written in the data.

## How to check it

Motion only counts in the production build: `npm run verify`, then `npx astro preview` and open `/#showdown`. `tests/e2e/showdown.spec.ts` deals all three streets from the keyboard and checks the no-script list; `reduced-motion.spec.ts` checks the table's text once it has loaded. Filmstrips and the nine-size sweep used for the review are scratch tools, not part of the repo.
