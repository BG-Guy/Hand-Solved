# Visual inspiration and direction

Research input for `docs/site/DESIGN.md` (not written yet). Studied 2026-11-01. Role: web-designer.
Companion file: `docs/site/research/inspiration.json` (one entry per site, for the live board).

## 1. Answer in brief

- **Recommendation: Direction A, "Two Inks".** The site is printed like a deck of cards: pale card stock, one black ink, one red ink, and a real solved 13x13 range chart where a pattern would normally go.
- **Why it suits the screens.** The black is the app's own ink, #12181B, so a phone reads as one solid printed shape. Teal appears nowhere on the page except inside a device, so the eye goes to the product. Ink against the stock is 16.2:1.
- **Why it stands apart.** Four of the five poker sites open on near-black with one bright accent and a picture of a man. None makes the range grid the main picture. A light page with no faces, no chips and no green is open ground.
- **Why it works for people who do not play.** White, red and black reads as a playing card to anyone, and a captioned grid explains the word "solved" in one look.
- **Not proven yet.** I have not seen this palette and type rendered beside the real screenshots. Section 9 lists the first check.

## 2. Method and limits

- I read each capture as an image and judged only what it shows. Captures are still frames, so motion, hover and scroll behaviour are unknown. Blank areas may be content that had not animated in, and I did not count those against a site.
- The 12 priority sites got a hero plus at least three more shots. The others got a hero plus at least one more, except Land-book.
- Not opened: `whoop` and `lapa` (block pages, as instructed), and `saaslanding` and `bg-library` (outside the brief). None of them is in the JSON.
- `godly.website` redirected to recent.design, so that is what its captures show. Arc's captures show a sunset notice, not a normal home page. Land-book's capture is a Cloudflare check.
- App screens opened: `sheet-phone.jpg`, plus `phone-coach-decision`, `phone-coach-score`, `phone-review`, `desk-coach-top`, `desk-coach-decision` and `desk-practice` in `showcase/app/final/`.
- Contrast ratios come from the WebAIM checker API. Font weights and licences come from the `METADATA.pb` files in the google/fonts repository, and the recommended weights were confirmed against the Google Fonts css2 API.
- Tools: the role lists Grep and Glob, which this session does not offer, so a read-only shell listing and a preview of `conversion-patterns.md` stood in for them. No other shell use, and no browser.

## 3. What I saw, per site

Filenames are in `showcase/inspiration/`.

### Poker competitors

- **GTO Wizard** (`gtowizard-hero`, `-s25`, `-s50`, `-s75`, `-end`, `-phone`): Near-black, mint button, a named WSOP winner pointing at a laptop with a red, green and blue range grid. Thin vertical rails, hatched margins and corner ticks at each section break. The end capture carries a plain note: 18+, study tool, no real-money play.
- **Upswing Poker** (`upswing-hero`, `-s25`, `-s75`, `-end`): Black hero with a pro at a table, a faint solver tree and grid behind him, a heavy sans headline whose last clause turns red, small mono labels, green button. Below it, a white page with a two-tier nav, handwritten NEW and FREE tags and dense footer lists.
- **PokerCoaching** (`pokercoaching-hero`, `-s50`, `-end`): Navy-black, cut-out pro over tilted course thumbnails, orange-to-green gradient in the headline, left-border accent cards, a blurred product panel, a money-back seal. Its stats read 0K+, $0M+ and 0+ in the capture, so a count-up was caught at zero.
- **Run It Once** (`runitonce-hero`, `-s50`, `-end`): Black, a dark close-up of a face, red glowing button, spider-web sale banner. The one strong idea is a numeric headline at s50: 2 x 5,083 = 10,166.
- **PokerTracker** (`pokertracker-hero`, `-s50`): An old software page: box shot, glossy green buttons, a spade inside the O of the wordmark, bullet feature list. It is the only poker page that leads with a real table of numbers.

### App sites

- **Flighty** (`flighty-hero`, `-s25`, `-s50`, `-s75`, `-end`, `-phone`): Tight heavy grotesque, a phone in a hand, ringed by app notifications that fade with distance. A bottom pill lists Preflight, At the airport, After landing, Download. The page flips white to near-black and back. Boarding pass, passport, gold trophy and airport-code chips do the work icons usually do. Footer has a Compare column and a cities line.
- **Copilot Money** (`copilot-hero`, `-s25`, `-s50`, `-s75`, `-end`): Ice-blue mist, a pill row of proof above the button, a phone cropped by the fold, pastel tiles. A navy privacy band opens with a mono ticker and a dotted-leader list that reads like a receipt.
- **Oura** (`oura-hero`, `-s25`, `-s50`, `-s75`, `-end`): Warm paper, condensed high-contrast serif, a hand wearing the ring. At s50, five dark app screens fan out at stepped sizes on the paper and read very clearly. At s75, tilted phones bleed out of a black panel.
- **Apple iPhone** (`apple-iphone-hero`, `-s25`, `-s50`, `-end`, `-phone`): A giant left-aligned "iPhone", then a row of small labelled devices as a visual index, then rounded grey tiles with hands holding the phone. Dry titles like "Significant others." Long legal notes, then a sitemap footer.
- **Strava** (`strava-hero`, `-s50`): Wide display face on a black-to-orange gradient, a giant stamped subscriber badge, a verb strip (TRAIN, EXPLORE, COMPETE), bright running photography.
- **Aimchess** (`aimchess-hero`, `-s50`): Purple gradient, glossy 3D chess pieces on a laptop. A white king breaking out of a purple panel is the one moment with tension.
- **Duolingo** (`duolingo-hero`, `-s50`): Mascot and characters on white, thick-lipped buttons, tumbling phones and letter tiles on pale blue. Funny without apology.
- **Things** (`things-hero`, `-s50`): Pale blue-grey, the app icon large and centred, a video link, a slanted section edge, a wall of social posts with names and faces.

### SaaS

- **Linear** (`linear-hero`, `-s25`, `-s50`, `-end`): Near-black, left-aligned headline, a dim app window fading at the bottom. Section heads put the title left and the explanation right, under hairlines.
- **Raycast** (`raycast-hero`, `-s25`, `-s50`, `-end`): Red diagonal stripes that echo its logo at huge scale, floating pill nav, keycaps drawn large instead of icons, product cards that each carry their own colour.
- **Stripe** (`stripe-hero`, `-s25`, `-s50`, `-end`): A tiny, very precise figure above a long two-tone headline sentence, one ribbon graphic, vertical hairline rails, a stat row held by rules, footer columns split by dashed lines.
- **Superhuman** (`superhuman-hero`, `-s25`, `-s50`, `-s75`, `-end`): Split hero: a dark panel with a lit product list, a painted teal field with a UI crop. Text corrected in place ("14 months" struck out, "16 months" written in). Tiles in deep teal, oxblood and stone with UI bleeding off the edge. Oxblood footer with a ghosted giant wordmark.
- **Attio** (`attio-hero`, `-s25`, `-s50`, `-end`): White page, crisp UI in a window, a side list of chapter names with the current one lit, tick-mark strips as dividers. Footer has an Import from column.
- **Mercury** (`mercury-hero`, `-s25`, `-s50`, `-end`): A painted-looking misty valley with a desk on a hill, an email field joined to the button, Launch demo beside it. Below, section heads on hairlines and product objects on matte tiles. Legal notes on dark ink at the end.
- **Vercel** (`vercel-hero`, `-s50`): Pale grey, tight grotesque, one black triangle holding the centre, three short lines on the right, almost no colour.
- **Resend** (`resend-hero`, `-s50`): Black, high-contrast serif with a metallic gradient, a faint 3D cube.
- **Framer** (`framer-hero`, `-s50`): Black, an electric-blue glowing prompt box, hairline rounded panels.
- **Arc** (`arc-hero`, `-s50`): Sticker-style logo, serif, a scalloped edge from black to white, a fixed bottom bar with one button.

### Galleries

- **Godly, shown as recent.design** (`godly-hero`, `-s50`): A masonry wall. At thumbnail size, flat colour fields and big type hold up, while dark glowing windows blur together.
- **Land-book** (`landbook-hero`): Cloudflare security check only. Nothing to judge.

## 4. What the poker competitors share

GTO Wizard, Upswing, PokerCoaching and Run It Once share nearly all of this. PokerTracker is the dated exception.

1. A near-black first screen with one saturated accent: mint, red or green.
2. A man fills the right side, at a table or in close-up, lit low (named as a pro on GTO Wizard and Upswing). The person is the product.
3. A left-aligned sans headline, often with its last clause coloured, and fighting words: crushing, destroying, crush the rest.
4. A green button on four of the five sites (counting GTO Wizard's mint). Run It Once is red.
5. Chips at the table edge as garnish.
6. The product is small, blurred or missing from the first screen. GTO Wizard's laptop is the exception among the four, and even there the man is larger than the screen.
7. The range grid stays a detail: on a laptop at GTO Wizard, a faint backdrop at Upswing. Nobody makes it the main picture.
8. Sale pressure at PokerCoaching and Run It Once: discount bars, a seasonal banner, a money-back seal.
9. They assume you know the words. None of these first screens tries to explain itself to someone who does not play.

**What that leaves open:** a light page, no faces, no chips, no green, the product large on the first screen, the grid as the main picture, and some humour.

## 5. Patterns across the set

**Device staging**

- Bare dark screens fanned at stepped sizes on a light ground: `oura-s50`. This is the closest precedent for our dark screens.
- A phone ringed by real app messages: `flighty-hero`. A phone cropped by the fold to pull the scroll: `copilot-hero`.
- A flat-lay with real objects: `flighty-end`.
- An app window with no device, fading out: `linear-hero`, `attio-hero`, `framer-hero`.
- A UI crop bleeding off a colour tile: `superhuman-s25`, `copilot-s50`.
- Hands holding the device: `flighty-hero`, `apple-iphone-hero`. This needs photography we do not have.
- A laptop as a prop beside a person: `gtowizard-hero`. This is the one to avoid.

**Type**

- Most sites use a tight grotesque around 60 to 80 px. Character comes from treatment: a two-tone sentence (`stripe-hero`, `superhuman-hero`), a wide display face (`strava-hero`), a condensed serif (`oura-hero`), a number as the headline (`runitonce-s50`).
- No capture I opened sets a heavy condensed gothic at poster scale. That space is open.
- Small facts in mono work well: `upswing-hero`, `copilot-s75`, `raycast-hero`.

**Backgrounds**

- The best grow from the brand's own geometry: `raycast-hero` stripes, `stripe-hero` ribbon, `attio-s50` ticks.
- Light pages make dark moments count by flipping for one or two bands: Flighty, Attio, Oura, Copilot.
- Mist, glow and painted scenes look expensive but say nothing about the product: `copilot-hero`, `framer-hero`, `mercury-hero`.

**Navbars**

- A full nav that shrinks to a floating pill with the button inside and flips colour with the section: `flighty-s25` against `flighty-s50`. Raycast keeps a pill throughout.
- A hairline bar with a few links: Linear, Stripe, Attio.
- A two-tier nav with more than a dozen links: `upswing-hero`. Avoid.

**Footers**

- Link columns almost everywhere. What stands out: a ghosted wordmark (`superhuman-end`), a Compare column and cities line (`flighty-end`), an Import from column (`attio-end`), a plain no-real-money note (`gtowizard-end`).
- Nobody makes the footer an object in its own right. That is open.

**How the best avoid a template look**

- Domain objects instead of icons: the boarding pass and airport chips (`flighty-s50`, `flighty-s75`), keycaps (`raycast-s50`).
- A correction shown in place: `superhuman-hero`.
- A number doing a headline's job: `stripe-hero`, `runitonce-s50`.
- A list that reads like a real document: `copilot-s75`.
- Wit in titles: `apple-iphone-s25`.

## 6. What the real screens demand

- The screens are ink, teal, slate-teal panels, coral for losses and blunders, and amber for leaks.
- The one thing in them that is not ink or teal is the white playing card with red and black pips. Face-down cards already show a lattice with a spade (`phone-review`, `phone-coach-score`). A site built from the playing card therefore rhymes with the screens without copying the app's look.
- A dark ground loses the device edge. A green ground sits in the same hue family as teal. Red is teal's opposite, and `superhuman-s25` suggests the pairing works, with oxblood beside deep teal. A light ground gives the strongest edge (`oura-s50`).
- In the screens I opened, the app's own range grid is collapsed ("BTN · GTO range · about 8% of hands"). One capture with the grid open would let the site's grid and the screen's grid connect.

## 7. Materials weighed

- **Baize and ivory:** the most immediate poker material, and it makes a real direction (B). Green is also the competitors' button colour and sits too close to our teal.
- **Two-ink printing and card-back lattice:** printing fits a light ground, is cheap to build, and the lattice is already in the app. This is the base of Direction A.
- **The 13x13 range matrix:** the strongest idea here, because the name is HandSolved and this grid is what solved poker looks like. In the usual solver red, green and blue it reads as a GTO Wizard screenshot. Printed in two inks it reads as ours, so it becomes the pattern inside Direction A rather than a direction of its own.

## 8. Two directions

### Direction A: Two Inks (recommended)

Print the site like a deck of cards: one stock, two inks, and a solved chart where the pattern goes.

Feel: exact, dry-humoured, tactile, unintimidating.

| Name | Hex | Job |
| --- | --- | --- |
| Card Stock | `#F3F4F1` | Page ground. Near neutral with a faint grey-green cast, not cream |
| Face White | `#FCFCFA` | Raised cards, text on red and black |
| Key Black | `#12181B` | Text, call cells, device bodies. Same value as the app's ink |
| Soft Black | `#565D61` | Secondary text |
| Pip Red | `#CE1A2C` | Main button, raise cells, card-back bands, the coach's red pen |
| Overprint Red | `#A81222` | Lattice lines on red bands, button hover |
| Red Tint | `#E1878F` | A second raise size in the grid, printed as a line screen |
| Teal | `#7FC8C2` | Not a site colour. Only ever inside the screens |

| Pair | Ratio | Use |
| --- | --- | --- |
| Key Black on Card Stock | 16.2:1 | Body text, and the phone's edge against the page |
| Face White on Key Black | 17.4:1 | Text on black, labels in call cells |
| Soft Black on Card Stock | 6.06:1 | Secondary text |
| Face White on Pip Red | 5.36:1 | Button label, labels in raise cells, text on bands. This is the floor for text on the lattice, because it is measured against the lighter ink |
| Pip Red on Card Stock | 4.99:1 | Red text and marks |
| Key Black on Red Tint | 6.87:1 | Labels in tint cells |
| Key Black against Pip Red | 3.24:1 | Device edge on a red band. Large text and graphics only |

**Type**

- Display: **Sofia Sans Extra Condensed 800**. Sentence case, tight leading, roughly 64 px on a phone to 176 px on a wide screen, for headlines and big numbers only. It takes after the tall, narrow index on a jumbo-index poker deck, and it is far from the app's round Fredoka.
- Body and UI: **Schibsted Grotesk 400 and 600**.
- Numbers, grid labels, small facts: **Spline Sans Mono 500**.
- Four weights in total. All three families are OFL, so they can be self-hosted. Subset to Latin and use `font-display: swap`.

**Signature: the solved deck.** One piece of geometry does all the work.

- **The chart.** A real 13x13 preflop chart from the app (the README places them in `src/gto/preflop/charts/`), printed in two inks: red for raise, black for call, blank for fold, and a cell split by frequency for mixed plays. Labels are in mono, with a plain caption for people who do not play.
- **The lattice.** The same grid turned 45 degrees is a card-back lattice, used for red bands and section edges. It is SVG or CSS, and the pattern should stay well under a kilobyte.
- **The back of the card.** The footer is the back of the card: full-bleed lattice inside a stock border, with the mark alone in the middle.
- **The mark.** A spade drawn on the 13x13 grid, with one cell in red for the solved hand.
- **The corner index.** Major sections carry a card index top left and the same index inverted bottom right. Suits are always SVG, never text characters, because some phones swap those for emoji.
- **The red pen.** Black is what you did, red is the coach's mark: a struck-out "Call 65 bb" with "Fold" written in, and session grades A to F as red stamps.

**Device staging.** Devices are flat Key Black silhouettes, with no gloss and no hands. Bezel and screen ground are the same ink, so the phone reads as one solid shape. Phones sit on stock, partly over the grid with the cells around them faded back, and one strong moment lies on a red band. No device ever sits on black.

**Check against the looks to avoid.** Not cream, no serif, and a crimson rather than a brown-orange. Not near-black, and no green at all. No gradients. Not Inter or Space Grotesk. Asymmetric layouts rather than everything centred. No accent bars on rounded cards (the app's own stay inside its screens). No emoji.

### Direction B: Card Room

The page is the table: green cloth seen from above, with the device lying on it.

Feel: warm, tactile, clubby.

| Name | Hex | Job |
| --- | --- | --- |
| Baize | `#17634B` | Page ground, with a fine cloth texture |
| Ivory | `#F2ECDD` | Type on cloth, raised cards |
| Brass | `#D4AF5A` | Main button, rails, chip accents |
| Ink | `#12181B` | Text on ivory and brass |

| Pair | Ratio | Use |
| --- | --- | --- |
| Ivory on Baize | 6.09:1 | Body and headlines |
| Ink on Brass | 8.59:1 | Button label |
| Brass against Baize | 3.44:1 | Button edge, large text only |
| Ink against Baize | 2.49:1 | The phone's edge. Below the 3:1 line for objects |

**Type:** Besley 700 for display (a Clarendon-style slab, with the look of old wood type), Hanken Grotesk 400 and 600 for body, Spline Sans Mono 500 for numbers. All OFL.

**Signature:** section titles set on an arc, like the lettering printed on a casino table, with phones lying flat among real cards in the manner of `flighty-end`.

### Side by side

| Test | A: Two Inks | B: Card Room |
| --- | --- | --- |
| Device edge against the ground | 16.2:1 on stock, 3.24:1 on red | 2.49:1 on baize |
| Hue against teal screens | Neutral, or opposite on red | Same family |
| Against the poker competitors | Light page, no faces, no green. Shares red with Upswing and Run It Once, but on white | Breaks from black, but green is the competitors' button colour |
| Reads to someone who does not play | A deck of cards and a chart | A casino |
| Build weight | SVG and CSS | Cloth texture plus rendered or photographed flat-lays |
| Distance from the looks to avoid | Clear | Ivory and a serif drift toward the cream-and-serif look |
| Main risk | Red, black and white turning into a sale or sports poster | Screens recede, and it reads as gambling |

## 9. Recommendation and what could go wrong

**Choose Direction A.** The screens stand out most on it, because nothing outside the device competes with teal. The grid is real product output, so a template cannot copy it, and the name HandSolved finally has a picture. Its graphics cost almost nothing to load, and it gives non-players something to enjoy and a chance to learn what the product does. I make no claim about conversion uplift. The only conversion argument is that one large red object per view leaves the main button as the loudest thing on screen.

Risks and the guard for each:

1. **Not rendered.** This choice rests on the captures, the ratios and my knowledge of the typefaces. I have not seen these fonts in this palette beside a real screen, because this role's tools do not include a browser. First check when tokens exist: `phone-coach-decision.png` on Card Stock and on Pip Red, at 1440 and 390 wide, with a real headline. If the ink phone on red looks harsh, phones stay on stock and red bands carry type and lattice only.
2. **Poster shouting.** Red, black and white with heavy condensed type can turn into a sale poster or a sports team. Guard: display type for headlines and big numbers only, generous stock, and one large red thing per view.
3. **Neighbours in red.** Upswing and Run It Once also use red. Guard: never on a black hero, never next to a face.
4. **Sliding into a template.** Thick black outlines with hard offset shadows would read as the stock neo-brutalist look. Guard: hairlines and flat shapes only.
5. **False data.** The grid is only worth having if it is true. Pick one real chart and label it. I have not opened the chart files, only the README's reference to them. Also make no invented stats: `conversion-patterns.md` records that no ratings, user counts or endorsements are known.
6. **Borrowed card art.** The lattice must be drawn from our own grid, not traced from any card maker's back design. Captured logos and images stay out of the site.
7. **No dark mode at launch.** A dark version would put dark screens back on a dark ground and undo the main reason for choosing this direction.

## 10. What this asks of the wireframes

Page structure belongs to `ux-ui-expert`. Direction A needs only the following.

- A first screen with room for one headline, one main button, one phone and a large grid.
- Room for one or two full-bleed red bands, and a footer that can be a full-bleed band of its own.
- A caption next to the first grid, explaining it to someone who does not play (for `web-copywriter`).
- The corner index works with any number of sections.
- If the page tells a story, Flighty's chapter pill maps well onto At the table, After the session, Before the next one. This is a suggestion only.
