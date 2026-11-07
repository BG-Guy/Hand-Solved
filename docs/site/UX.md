# HandSolved site: UX plan

Role: ux-ui-expert, plan mode. Written 2026-11-01. This file owns structure, flow, layout and states. Color, type and visual style belong to `web-designer`.

Inputs read: `docs/site/research/conversion-patterns.md` (1, 5, 6, 7), `docs/site/research/seo-keywords.md` (3, 4, "What the home page must contain"), `docs/site/research/engine-output.json` (6 real coach hands), the app captures in `showcase/app/final/` plus the two contact sheets, the app README (Features) and `docs/coach-algorithm.md` (Grading), and the component index of the web-component-library.

`docs/site/PROJECT.md` and `docs/site/research/messaging.md` did not exist when this was written. The assumptions below stand in for PROJECT.md. Re-check them when it lands.

## 0. Assumptions and decisions applied

**Standing in for PROJECT.md**

- Goal: a portfolio showcase that behaves like a real product site. Main conversion: the visitor opens the sample-hand pop-up and finishes one graded hand. Second conversion: the early-access email step (concept only; nothing is sent).
- Two readers: poker players, and people judging the site as portfolio work who may not know poker. Every first-screen and pop-up sentence must work for both.
- No backend, no accounts, no analytics, no cookies, no app link, no store badge, no download. No outbound links in v1.
- Name HandSolved, domain handsolved.com. The old name does not appear anywhere on the site.
- Static HTML first. Every word of copy is in the initial HTML. Scripts enhance and never carry content.

**Owner decisions and where each lands** (these override the research where it disagrees)

| Decision | Lands in |
|---|---|
| Main button opens a browser-only graded sample hand | Pop-up 1 (section 6). Label shape "Grade a sample hand", the copywriter finalizes. Called `CTA-DEMO` below |
| Early access: one email field, real validation, nothing sent | Pop-up 2 (section 6). Opened after a verdict and from every pricing button. Called `CTA-EARLY` |
| Prices shown, made up | Home section 8 plus the nav link "Pricing". Overrides the research's "no pricing" note |
| One-line concept note in the footer | Reveal footer, every page (home section 10, 4.10) |
| Proof is product facts and labelled sample data only | Hero proof strip, section 3, every screenshot tagged "Sample data". No testimonials, ratings, counts, press, awards, accuracy or benchmark claim |
| Reveal footer | Home section 10 (4.10), every page |
| Page-load transition | Intro veil on the home page (first visit per session) plus a cross-page fade (section 4, global layer) |
| Interactive pop-ups | Pop-up 1 and 2 |
| Smooth scroll animations | Hero entrance, pinned story, counters, bento rows, chart draw, tabs, accordion. Native scroll only, no scroll-jacking library |
| Lightweight SVG backgrounds | Hero, story, engine, pricing and footer (section 9, designer notes) |
| Modern navbar | Floating glass bar with a circle-reveal mobile menu |
| Sleek device mockups | Hero pair, pinned story phone, tab panels, product-page heroes |
| Solid technical SEO | Section 9, builder notes |
| BB/$ switch that really flips numbers | Section 5 of the home page, synced with the pop-up and the highlights tiles |

## 1. Sitemap

```text
handsolved.com
├─ /                            Home
│    sections (anchors, not pages): #how #engine #highlights #numbers #toolbox #data #pricing #faq #start
├─ /gto-hand-review             Product page: how a hand gets graded
├─ /live-poker-hand-recorder    Product page: how a hand gets recorded
├─ /privacy                     Legal
├─ /terms                       Legal
└─ any other path               404 page (HTTP 404, noindex)
Files: /robots.txt, /sitemap.xml (5 URLs), one 1200x630 social image per page
```

| Page | Single job | Primary action | Target query (from the SEO research) |
|---|---|---|---|
| `/` | Make the visitor try a graded hand, then ask for early access. Rank for the umbrella intent | CTA-DEMO | live poker session tracker, brand |
| `/gto-hand-review` | Explain and prove how a decision is graded, using one real worked example in plain HTML | CTA-DEMO | GTO hand review for live poker, grade my poker hand against GTO |
| `/live-poker-hand-recorder` | Show how a hand is recorded at the table | CTA-DEMO | live poker hand recorder |
| `/privacy`, `/terms` | Say plainly that this is a concept site and what is (not) collected | none (header button only) | none |
| 404 | Get the visitor back on a real page | CTA-DEMO plus 3 links | none |

**Which supporting pages earn a place in v1, and why**

| Candidate | v1? | Reason |
|---|---|---|
| `/gto-hand-review` | Build | Distinct intent, thin long-tail results, and content only this product can supply (real solved output, the grading rules). It also gives CTA-DEMO a no-script destination (`#worked-example`) |
| `/live-poker-hand-recorder` | Build | Low-to-medium difficulty, no content-rich page from a recorder product, and the table recorder is the most visual feature. Feeds home and the review page |
| `/guides/how-to-review-poker-hands` | Defer to v1.1 | Head term is High difficulty against editorial incumbents. Needs an article layout and long copy. Its only edge, a worked example, already lives on the review page. URL reserved. The prose, callout and FAQ blocks already exist, so it can be added without new components |
| `/gto-trainer`, `/poker-equity-calculator`, bankroll, win-rate, comparison, Regroup pages | Do not build | The research defers or rejects them. Home covers Practice, the equity line, the bankroll chart and Regroup import (data section and FAQ) |
| `/pricing` | Not a page | A home section plus a nav link (owner decision). Other pages link to `/#pricing` |
| `/about`, `/contact`, `/blog`, `/changelog` | Do not build | Nothing true to put on them, and a contact form would collect data the site says it does not collect |
| `/privacy`, `/terms` | Build | The early-access form looks like data collection. A site that says "nothing is collected" must say it on a page. The SEO checklist also asks for legal pages |
| 404 | Build | Real 404 status, recovery links |

All six templates are assembled from one block set: floating navbar, hero (full or compact), story or timeline, bento, tabs, chips and counters, pricing (home only), FAQ, prose, closing band plus reveal footer, and the two dialogs. Nothing needs a one-off component.

| Block | Home | Review | Recorder | Legal | 404 |
|---|---|---|---|---|---|
| Navbar, dialogs, reveal footer | yes | yes | yes | yes | yes |
| Hero | full | compact | compact | title only | minimal |
| Story / timeline | pinned story | timeline | pinned story (3 steps) | no | no |
| Bento | highlights | detail tiles | detail tiles | no | no |
| Tabs | toolbox | no | no | no | no |
| Counters, chips | engine, numbers | grade legend, limits | no | no | no |
| Pricing | yes | no | no | no | no |
| FAQ | 7 questions | 4 | 4 | no | no |
| Prose | no | no | no | yes | no |

## 2. Navigation

### Header

Brand mark and wordmark on the left (links to `/`). Four links, then the button.

| Item | On home | On other pages |
|---|---|---|
| How it works | `#how` | `/#how` |
| Coach | `/gto-hand-review` | same |
| Recorder | `/live-poker-hand-recorder` | same |
| Pricing | `#pricing` | `/#pricing` |
| Button: CTA-DEMO | opens pop-up 1 | same |

Four links plus the button, inside the limit of five. FAQ lives in the footer only. No dropdowns, no search.

- Floating glass pill, 16px from the top, tightens and lifts on scroll. A pill glides between links on hover and rests on the current one. `aria-current="page"` on the current page. On home, the link whose section is in view is marked with `aria-current="true"`.
- One primary button per screen. While the hero CTA is in view, the header button is drawn as secondary (outline). Once the hero CTA scrolls out, it turns primary. Same rule for the mobile bar.
- Anchor jumps use `scroll-behavior: smooth` (off under reduced motion) and `scroll-padding-top` equal to the header height plus 16px, so a focused element is never hidden under the bar.

### Mobile behavior

| Width | Header shows | Menu |
|---|---|---|
| 1024 and up | brand, 4 links, button | none |
| 768 to 1023 | brand, button, burger | burger opens the panel with the 4 links |
| below 768 | brand, burger | burger opens the panel with the 4 links and the button |

- The burger is 44 by 44. The panel is a modal `<dialog>` revealed in a circle from the burger, with links rising in sequence. Link rows are 56px tall. The button sits at the bottom of the panel. A one-line "Concept site" note sits under it.
- Closes on X, Escape, or a link tap. Focus is trapped while open and returns to the burger. Without script the links wrap under the brand and nothing disappears.
- Opening a pop-up from the panel closes the panel first. A pop-up and the panel are never open together.

### Sticky CTA rules

1. Below 768 only: a bottom bar with one full-width button, 56px tall, 16px side gutters, `padding-bottom: max(12px, env(safe-area-inset-bottom))`. It always opens pop-up 1 with the same label as the hero.
2. Hidden on load. It slides up when the hero CTA has fully left the viewport.
3. It slides away while: a dialog or the menu is open; the closing band or footer is 20 percent visible; the pinned story is 50 percent in view (the pinned phone and its copy need the room, and the story ends with its own button).
4. Not on privacy, terms or 404 pages.
5. At 768 and up there is no bar. The header button is always reachable.
6. Pricing buttons are not sticky. They open pop-up 2, never pop-up 1.

### Footer groups (reveal footer, every page)

Top: closing band (see home section 10, 4.10). Then three link groups: **Explore** (How it works, Highlights, Your numbers, Pricing, FAQ), **Pages** (GTO hand review, Live poker hand recorder), **Legal** (Privacy, Terms). Bottom row: copyright, and the one-line note "Concept site, illustrative prices, nothing is collected." in text at least 14px, contrast 4.5:1 or better. No social links, no store badges, no outbound links.

## 3. Key user flows

Risk lines use "R" for the drop-off risk and "M" for the mitigation built into the layout.

**Flow A. Poker player, desktop, from search to early access**
1. Lands on `/`. R: jargon, cannot tell in 5 seconds what it is. M: kicker names the category, subhead defines GTO in plain words, device shows a report card, proof strip lists three facts.
2. Clicks CTA-DEMO. R: expects a sign-up or download. M: the label promises a graded hand, and the line under it says what happens (20 seconds, runs in your browser).
3. Pop-up 1 opens on hand 1 of 3. R: does not understand the table. M: "What you're looking at" paragraph, plain-words situation line, visible sublabels on every action ("Fold: give up the hand").
4. Picks an action. R: mis-taps on a phone. M: 56px choice buttons, 8px gaps, and every option can be tried afterwards (what-if).
5. Reads the verdict. R: numbers overwhelm. M: one plain sentence first, then the table the app uses (option, how often GTO plays it, worth).
6. Chooses "Deal next hand" (primary) or "Get early access" (secondary). After hand 3 the order flips. R: the early-access ask feels pushy. M: it is a button, never automatic.
7. Pop-up 2: types an email. R: friction, or fear of being tracked. M: one field, a pre-submit line that says nothing is sent, errors that say how to fix it.
8. Success step says this is a concept site and nothing was sent. R: feels like a trick. M: said plainly, and the footer and FAQ say the same.

**Flow B. Portfolio judge, desktop, may not know poker**
1. First screen must read as a product site in 5 seconds, not a poker forum.
2. Scrolls the pinned story, the highlights, the chart and the BB/$ switch. R: too many effects or jank. M: one attention effect per section, native scroll, transform and opacity only, reduced motion honored.
3. Opens a pop-up. R: poker words. M: glossary disclosure (GTO, bb, worth), actions explained in plain words.
4. Reaches the pricing and the footer. R: thinks prices are real or the site is deceptive. M: "illustrative prices" in the pricing lead, the footer note, the FAQ answer 7, and the success step.
5. Visits a product page. R: broken or thin page. M: same blocks, same footer, a real worked example.

**Flow C. Mobile poker player (375px) from search**
1. Hero CTA is visible without scrolling at 375 by 667. M: kicker, H1, subhead and button fit within 440px of height.
2. Scrolls. The bottom bar appears after the hero CTA leaves.
3. Pop-up 1 opens as a full-height bottom sheet. R: the table eats the screen. M: table scene capped at 220px tall, choices visible without scrolling for 2-option hands.
4. Verdict scrolls inside the sheet. R: actions scroll away. M: the action row is pinned at the bottom of the sheet.
5. Pop-up 2 opens as a compact bottom sheet. R: keyboard covers the field. M: sheet follows the visual viewport, input is 16px type or larger.

**Flow D. Pricing path**
1. Nav "Pricing" or scroll. 2. Toggles Monthly or Yearly (prices roll). 3. Clicks a plan button, which opens pop-up 2 with a plan chip. 4. Success. R: expects checkout. M: "Illustrative prices" in the lead, no payment fields anywhere, success step explains.

**Flow E. Keyboard and screen-reader user**
1. Skip link, then nav, then hero CTA. 2. Dialog opens, focus lands on the dialog title, Tab stays inside, Escape closes, focus returns to the opener. 3. After picking, focus moves to the verdict heading, which is read once. R: focus lost after the view changes. M: every view change moves focus to that view's heading (specs in section 6).

**Flow F. Wrong-intent visitor (wants an online HUD)**
Lands, sees "Good to know" (home block 3) and FAQ 4, leaves early. That is the intended outcome.

**Flow G. Search visitor on a product page**
Lands on `/gto-hand-review` from "grade my poker hand against GTO". Sees the worked example in the first scroll, presses CTA-DEMO, then follows the related link to the recorder page or to pricing.

**Flow H. 404**
Sees one sentence, three links and CTA-DEMO. Returns to a real page in one click.

## 4. Home page wireframe

### Global layer (not sections)

| Layer | Spec | Library component |
|---|---|---|
| Skip link | First focusable element, "Skip to main content". Visible on focus only | `components/navigation.md` |
| Page-load veil | Home only, first visit per session. A full-viewport ink panel with the spade mark drawn in inline SVG, then it splits and lifts away. 900ms at most. Plays once per session (session storage in try/catch), later visits get a 200ms fade. Reduced motion: none. The veil is in the first HTML and CSS-driven, so it paints on frame one and removes itself even if scripts fail. It is `aria-hidden` and `inert`, holds no images, and never covers the hero's text or image for longer than 900ms. Hero text and image are in the DOM underneath, so there is no layout shift | `components/premium/curtain-split.md` for the door art, `components/transitions.md` for the base |
| Cross-page transition | Cross-document View Transitions (`@view-transition { navigation: auto; }`), 250ms cross-fade, header persists. Browsers without it navigate normally | `components/transitions.md` |
| Navbar | Section 2 | `components/premium/floating-navbar.md` |
| Mobile bar | Section 2, sticky rule | `components/cta-sections.md` (sticky mobile bar) |
| Dialog host | Both dialogs in the page source, closed. Their scripts load on first intent (pointer-enter or focus on any CTA, or idle) | `components/premium/spring-modal.md` |
| Unit state | `data-unit="bb"` or `"usd"` on `<html>`, default bb. Every live number reads it. Saved in local storage inside try/catch | pricing-plans.md billing switch, reused |

### Section order

```text
[HOME]
0. Page-load veil + skip link + floating navbar (+ mobile bar)
1. Hero — kicker + H1, subhead, CTA-DEMO + "See how it works", micro-line, 3-fact proof strip, desktop+phone device pair
2. How it works (#how) — pinned device stepping Log, Coach, Practice; ends with CTA-DEMO
3. Engine (#engine) — three counters (14, 3, 100), grade legend, "Good to know" limits
4. Highlights (#highlights) — bento: Hall of Fame, Wall of Shame, Tilt Tower, Monster Pots, Hand insights
5. Your numbers (#numbers) — dashboard card: BB/$ switch, 4 counters, bankroll chart that draws itself; ends with CTA-DEMO band
6. Toolbox (#toolbox) — tabs: Insights, Goals, History, plus an equity line
7. Your data (#data) — 3 cards: Import (Regroup CSV), Export, Use it as an app
8. Pricing (#pricing) — Monthly/Yearly switch, 3 plans, buttons open pop-up 2, concept note
9. FAQ (#faq) — 7 questions
10. Closing band + reveal footer (#start) — CTA-DEMO, link groups, concept note
```

Ten sections. CTA-DEMO appears in the hero, after the story, after the numbers, and in the closing band (never two sections in a row). Pricing buttons open pop-up 2.

Section ids are fixed: `#how #engine #highlights #numbers #toolbox #data #pricing #faq #start`.

Heading outline: one H1 (hero). One H2 per section. H3 for steps, tiles, plans, questions.

Rules for every section: one attention effect (the rest static), all text in the initial HTML, every screenshot tagged "Sample data", images with width and height, reduced-motion and no-script states given below.

---

### 4.1 Hero

**Purpose.** In 5 seconds, say what it is (a poker session tracker and hand recorder that grades your decisions), show it, and give one action. It must read to a non-poker visitor.

**Layout, 1440 and 1024.** Two columns: copy left (about 5 of 12 columns), devices right. Copy is vertically centered. Height: content-driven with a 640px minimum; 100svh only when the viewport is 800px or taller.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ (logo) HandSolved   How it works  Coach  Recorder  Pricing  [Grade a sample hand] │
│                                                                                │
│  Live poker session tracker and hand recorder   (kicker, part of the H1)       │
│  Find the hands that cost you money              (H1 line, shape only)         │
│  Log sessions, rebuild any hand, and get every   ┌───────── desktop frame ───┐ │
│  decision graded against GTO: what a poker       │ desk-coach-top.png        │ │
│  solver would do.                                │                ┌────────┐ │ │
│  [ Grade a sample hand ]   See how it works  ↓   │                │ phone  │ │ │
│  20 seconds. Runs in your browser.               └────────────────│ coach  │─┘ │
│  ─ 8-handed charts, 14 depths ─ Real bet sizes ─ Every decision    │ score  │   │
│    graded                                                          └────────┘   │
│                                                    [Sample data]               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Layout, 375.** Single column: kicker, H1, subhead, full-width CTA (56px), text link "See how it works", micro-line, then the phone alone (cropped at the bottom edge, `Sample data` tag), then the proof strip stacked in three rows. The desktop frame is not loaded.

**Content and copy slots**

| Slot | Length | Notes |
|---|---|---|
| Kicker (inside the H1) | 5 to 8 words | Carries the SEO phrase: live poker session tracker and hand recorder |
| H1 line | 5 to 9 words | Outcome in plain words, no jargon |
| Subhead | 20 to 30 words | Names the three jobs (log, record, grade). Defines GTO inline in 8 words or fewer |
| CTA-DEMO | 22 characters or fewer | Shape "Grade a sample hand". Same label everywhere |
| Secondary link | 3 to 4 words | Anchor to `#how` |
| Micro-line under the CTA | 6 to 10 words | Says what happens. Only true statements: runs in the browser, about 20 seconds, nothing to install |
| Proof strip | 3 items, each 5 to 9 words | Facts only: 8-handed preflop charts at 14 stack depths (cash and tournament); flop, turn and river each solved with the hand's real bet sizes; every decision graded. Small inline-SVG icon each |
| Chip on devices | 2 to 3 words | "Sample data" |
| Floating chip (768 and up, hidden below) | 6 to 10 words | A real number from spot 1: "Calling here is worth -62.6 bb". Uses the unit state. Decorative echo of the verdict |

**CTA.** CTA-DEMO (primary, `data-cta="hero"`). `<noscript>` link beside it to `/gto-hand-review#worked-example`.

**Device screens.** Desktop frame: `desk-coach-top.png` (score ring 27 percent "Rough", "Biggest leak" banner). Phone frame: `phone-coach-score.png` (same hand, same ring). Both are the same hand, so the pair reads as one product on two screens. Use `<picture>` so only one image downloads below 768 (phone only).

**Library component.** `components/premium/aurora-hero.md` for structure (rising headline, pill, floating glass chip, cursor tilt on devices). Replace its aurora with the SVG backdrop below. `components/premium/kinetic-headline.md` for the H1 line. `components/premium/premium-buttons.md` for CTA-DEMO. Alternate if the designer prefers a technical look: `components/premium/beam-grid-hero.md`.

**Background.** One inline SVG: concentric rounded "table rail" outlines, one soft teal radial glow, a few suit pips at 4 to 6 percent opacity. No canvas, no WebGL. Static, with at most a 40-second CSS drift on one layer.

**Motion (one attention effect).** H1 line rises by clip and transform only. It never starts at opacity 0, so the H1 can be the LCP element. Devices rise in once. Tilt on hover for fine pointers only.

**States.** No script: all copy and both images visible, CTA shows the noscript link. Reduced motion: no rise, no tilt, no veil. Image failure: dark placeholder at the same aspect ratio with the alt text.

---

### 4.2 How it works (`#how`): pinned story

**Purpose.** Show the loop Log, Coach, Practice with the real product. This is the main signature moment.

**Layout, 768 and up.** Two columns. Left: the three steps, tall enough that each takes about one viewport of scroll. Right: a phone frame pinned with `position: sticky; top: header height + 24px`, max height `100svh - header - 48px`. As a step crosses the middle of the viewport, the phone cross-fades to that step's capture and two callout chips assemble around it. Progress dots follow. The active step brightens and its accent bar draws in.

**Layout, below 768.** The phone frame pins at the top (max 38svh tall), the copy scrolls beneath it (this is how the library component behaves on phones). If the viewport is shorter than 600px, or reduced motion is on, drop the pin and stack: step title, text, then the phone image at 240px wide.

```text
≥768                                   <768
01 Log        ┌───────────┐            ┌─────────┐ pinned, ≤38svh
02 Coach  ◄── │  phone    │            │  phone  │
03 Practice   │  scene    │            └─────────┘
 (copy scrolls)│  + chips  │            02 Coach  (copy scrolls under)
              └───────────┘ dots
```

**Content and copy slots**

| Slot | Length |
|---|---|
| H2 | 3 to 8 words (shape "Log it. Coach it. Practice it.") |
| Lead | 15 to 22 words |
| Step label | one word each: Log, Coach, Practice |
| Step title | 4 to 8 words |
| Step body | 25 to 35 words |
| Step chips | 3 per step, 2 to 4 words each |
| Callout chips on the phone | 2 per step, 2 to 5 words each |
| Text link per step | 4 to 6 words, descriptive anchor |
| Footnote | one line: "App screens are shown in big blinds." |
| Closing line before the button | 6 to 10 words |

Step content from the README:
- **Log**: live session log (game, stakes, venue, buy-in, rebuys, notes, cash-out); rebuild a hand on a table with seats, stacks, cards and each action. Link to `/live-poker-hand-recorder`.
- **Coach**: every decision graded; how often GTO takes each option and what each is worth; pot odds and equity. Link to `/gto-hand-review`.
- **Practice**: random hands against an 8-handed table of GTO opponents, every decision graded; replay any hand from the flop, turn or river.

**CTA.** After the last step, a short line and CTA-DEMO (`data-cta="story"`).

**Device screens.** Log: `phone-recorder.png`. Coach: `phone-coach-decision.png` (You: Call 65 bb, GTO: Fold, 96 percent and 4 percent bars). Practice: `phone-practice.png` (full-screen table with Check, Bet, All in). Request to owner: a live-session capture (the "Start a session" screen exists only on the contact sheet) would suit step 1 better than the recorder alone.

**Library component.** `components/premium/sticky-showcase.md`. Keep one `.sticky-showcase__screen` per step in order. No ancestor may set `overflow: hidden` between the frame and the page scroller. The frame is decorative (`aria-hidden`); all meaning sits in the step list, which also gets `aria-current` on the active step.

**Motion.** Scene cross-fade and chip assembly, scrubbed by position. Only transform and opacity.

**States.** No script: three stacked cards, each with its image. Reduced motion: scenes swap instantly, chips are already in place.

---

### 4.3 Engine (`#engine`): why the grades have substance

**Purpose.** Proof from product facts, and honest limits. Filters wrong-intent visitors and keeps any machine summary accurate. No accuracy or benchmark claim anywhere.

**Layout.** Heading and lead on the left (or above at 768 and below). Three counters in a row (stacked at 375). Below: the grade legend as five chips in a row (wraps). Below that: "Good to know", three short items with icons.

```text
H2 + lead
 [ 14 ]            [ 3 ]               [ 100 ]
 stack depths      streets solved      point score
 8-handed preflop  in your browser,    on every
 charts, cash and  heads-up or 3-way,  decision
 tournament        real bet sizes
 Grades:  Best move 97+ | Good 80+ | Inaccuracy 55+ | Mistake 30+ | Blunder
 Good to know:  Hold'em only | You enter hands, not an online HUD | Postflop is heads-up or 3-way
 [text link: How a decision is graded →  /gto-hand-review]
```

**Content and copy slots**

| Slot | Length |
|---|---|
| H2 | 4 to 8 words |
| Lead | 20 to 30 words |
| Counter label | 2 to 4 words |
| Counter note | 8 to 14 words |
| Grade chip meaning (tooltip or caption) | 4 to 8 words each |
| "Good to know" item | 6 to 12 words each |
| Link | 4 to 6 words |

Facts allowed here: preflop charts are 8-handed, solved at 14 stack depths, for cash and tournament. Each postflop street is solved in the browser, heads-up or 3-way, with the hand's real bet sizes. Every decision gets a 0 to 100 score and a grade (Best move 97+, Good 80+, Inaccuracy 55+, Mistake 30+, Blunder below that, from `docs/coach-algorithm.md`). The coach covers Hold'em only. Hands are entered by you, so this is not an online HUD. The app's own word "hand accuracy" should be written "hand score" on the site to avoid sounding like an accuracy claim.

**CTA.** None in this section. A text link to `/gto-hand-review`.

**Device screens.** None. Counters and chips only.

**Library component.** `components/premium/stat-counters.md` for the counters (real numbers in the HTML, so no "0" without script). `components/trust-and-stats.md` for the chips and limits.

**Motion.** Counters roll once on enter. The rest is static.

**States.** No script and reduced motion: final numbers shown.

---

### 4.4 Highlights (`#highlights`): the personality section

**Purpose.** The app gives your history a character: Hall of Fame, Wall of Shame, Tilt Tower, Monster Pots. It is the memorable part for both readers, and it explains the product without poker knowledge ("your best and worst hands").

**Layout.** Bento. At 1024 and up: three columns, two rows. Hall of Fame and Wall of Shame in row 1, Tilt Tower and Monster Pots in row 2, and a tall "Hand insights" card in column 3. At 768: two columns, insights card spans both below. At 375: one column. A chip row under the grid: "And more: The Painful Ones, Multiway Madness".

Tiles are live HTML rebuilt from `desk-highlights.png` (the data and wording must match the capture), not images. Cards are inline-SVG faces. Each tile: icon, name, one-line description, three rows (cards, title, meta).

| Tile | Description line (from the app) | Rows (sample data from the capture) |
|---|---|---|
| Hall of Fame | Your best-played hands, by your own rating | A♥ A♦ K♥ Q♠ Nut flush on the river, 4.8 stars. A♠ K♦ Three streets of value with top pair, 4.5. 7♠ 6♠ Turned straight against a check-raise, 4.2 |
| Wall of Shame | Your lowest-rated hands | 8♥ 8♣ Called a river shove with a set on a four-straight board, 1.5 stars. K♥ 9♣ Opened K9 offsuit under the gun, 2.2. J♣ 10♣ Missed-draw bluff on the river, 2.8 |
| Tilt Tower | The hands you were most tilted in | 8♥ 8♣ Frustrated. J♣ 10♣ Uneasy. K♥ 9♣ Uneasy |
| Monster Pots | The biggest pots you won | A♠ K♦ Won 109 bb, pot 219 bb. A♥ A♦ K♥ Q♠ Won 76 bb, pot 153 bb. 7♠ 6♠ Won 26 bb, pot 57 bb |
| Hand insights | (card) | Hands 7, Net -73.5 bb, Avg rating 3.4, Avg tilt 2.1, and the line "Tilt shows up in your results: tilted hands average -63 bb, calm ones +28.9 bb" |

Amounts in these tiles are live numbers: they follow the unit state (section 4.5). A small copy of the BB/$ switch sits in this section's heading row.

**Content and copy slots**

| Slot | Length |
|---|---|
| H2 | 4 to 8 words |
| Lead | 18 to 26 words |
| Tile name and description | taken from the app (see table) |
| Row title | full title, no ellipsis (wraps to two lines) |
| Chip row | 6 to 10 words |
| Caption | "Sample data" |

**CTA.** None required. Enhancement (P2): three rows match demo spots (Wall of Shame row 1 is spot 1, Hall of Fame row 3 is spot 2, Hall of Fame row 2 is spot 3). Those rows get a small "Grade it" button that opens pop-up 1 at that spot. Rows with no spot data are not buttons.

**Device screens.** None embedded. `desk-highlights.png` and `phone-highlights.png` are the source for data and wording.

**Library component.** `components/premium/bento-grid.md` (cursor spotlight, each tile plays one small story on scroll-in: rows slide in, stars fill).

**Motion.** Row stagger on enter. Spotlight on hover for fine pointers. One effect per tile.

**States.** No script: all rows visible. Reduced motion: no stagger, no spotlight.

---

### 4.5 Your numbers (`#numbers`): the chart that draws itself and the BB/$ switch

**Purpose.** Show the tracker half (results, hourly, win rate, bankroll), and give the visitor a control that really changes the page.

**Layout.** At 1024 and up: copy and switch on the left (4 columns), dashboard card on the right (8 columns). Below 1024: copy, then card. The card imitates the app's Home screen (`phone-home.png`, `phone-bankroll.png`, `desk-home.png`): header row with "Bankroll" and the BB/$ switch, four counter tiles above, the chart below.

```text
H2 + lead + hint "Flip the switch."         ┌ Dashboard card ─────────────── [BB | $] ┐
                                            │ Net profit  Hourly   Win rate  Winning   │
                                            │ +733 bb     +11 bb/h 15.7/100  61%       │
                                            │ Bankroll   (line draws as you scroll)    │
                                            │  800 ┤                       ●           │
                                            │    0 └──────────────── hours played      │
                                            └ Sample data: 18 sessions, 67 hours ──────┘
CTA band: line + [Grade a sample hand]
```

**Behavior**
- **Draw on scroll.** The chart line is an SVG path with `pathLength="1"` and `stroke-dasharray`. Its draw is scrubbed to scroll position while the card crosses the viewport (progress 0 when the card's top is 80 percent down the screen, 1 at 40 percent). Dots pop in as the line passes them; the last value counts up. Use CSS `animation-timeline: view()` where supported and an intersection-based fallback elsewhere.
- **BB/$ switch.** Two buttons in a group labeled "Show amounts in" (`aria-pressed` on each). The thumb springs across and the numbers roll vertically to the new value (the billing-switch pattern). Flipping it changes every live number on the page: this card, the highlights tiles, the pop-up, the hero chip. In dollars the site assumes a $1/$2 table (1 bb = $2); the app itself converts each session at its own stakes. Screenshots stay in big blinds (see the footnote in the story).
- **Read a point.** Pointer move, tap, or Left/Right arrow keys on the focused chart show a vertical rule and a readout ("Session 12, 31 h, +412 bb"). This mirrors the app ("Tap or drag on the chart to read it").
- **Table alternative.** A "View data as a table" disclosure under the chart holds the 18 points as a real table. The chart itself is `role="img"` with a text summary.
- Sample series: read the 18 points from the app's seed data or trace `phone-bankroll.png`. The last point must equal the Net profit tile (+733 bb).

**Content and copy slots**

| Slot | Length |
|---|---|
| H2 | 4 to 8 words |
| Lead | 20 to 28 words |
| Switch label | "Show amounts in" |
| Tile labels | Net profit, Hourly, Win rate, Winning sessions (from the app) |
| Chart title and axis labels | "Bankroll", "Hours played" |
| Caption | "Sample data: 18 sessions, 67 hours" |
| CTA line | 6 to 10 words |

Tile values (sample data): Net profit +733 bb; Hourly +11 bb/h; Win rate 15.7 bb/100; Winning sessions 61 percent (11 of 18). In dollars: +$1,466; +$22/h; 15.7 bb/100 has no clean dollar form, so show $31.40/100 hands; the 61 percent tile does not change.

**CTA.** Band after the card: CTA-DEMO (`data-cta="numbers"`).

**Device screens.** No capture is embedded; the card is live. The three captures above are the visual reference.

**Library component.** `components/premium/stat-counters.md` for the tiles, `components/premium/blueprint-draw.md` for the draw-on-scroll technique, `components/premium/pricing-plans.md` for the spring switch with rolling numbers (the same component is reused as the Monthly/Yearly switch in section 8).

**Motion.** Chart draw (the attention effect). Counters roll once. No other motion.

**States.** No script: chart fully drawn, tiles show final numbers, switch buttons are hidden (the section reads in big blinds). Reduced motion: chart drawn, numbers swap without rolling.

---

### 4.6 Toolbox (`#toolbox`): the rest of the product

**Purpose.** Breadth without clutter: three more screens in tabs, so the page stays short.

**Layout.** Tabs on top (pill springs between them), one panel below: device on one side, text on the other. Panel sides alternate between tabs at 1024 and up. At 375: tabs scroll horizontally (snap), panel stacks (text first, device below at 260px wide).

| Tab | Panel heading shape | Text source (README) | Chips (2 to 4 words) | Capture |
|---|---|---|---|---|
| Insights | Leaks and strengths, spotted for you | Leaks and strengths, hourly by venue, stakes, game and day, all from your sessions | Leaks and strengths; Hourly by venue; By stakes and game | `phone-insights.png`, `desk-insights.png` at 1024 and up |
| Goals | Goals measured from your real play | Hands played, hours, sessions, profit, hands reviewed; pace projections; a "focus next" pick | Pace projection; Focus next; Edit anytime | `phone-goals.png` |
| History | Every session, graded A to F | Sessions by month, each graded from the hands you saved, the money won and the hours | Grade A to F; Filters; Open a session | `phone-history.png` |

Under the tabs, one line: "Also in the app: an equity calculator for 2 to 6 hands, exact when possible." No capture exists for it. Request to owner: add `phone-equity.png` to `showcase/app/final/` and promote it to a fourth tab.

**Content and copy slots.** H2 4 to 8 words; lead 15 to 22 words; tab label 1 to 2 words; panel heading 5 to 8 words; panel text 25 to 35 words; chips 3 each; equity line 10 to 16 words.

**CTA.** None.

**Library component.** `components/premium/feature-tabs.md`. Autoplay off. Full arrow-key, Home and End support as the component provides. Panels are real text in the HTML; inactive panels are hidden with `hidden`, not removed.

**Motion.** Pill spring and panel cross-fade. Product mock assembly inside the panel is the single effect.

**States.** No script: all three panels shown one after another. Reduced motion: instant swap.

---

### 4.7 Your data (`#data`): bring it, keep it, use it as an app

**Purpose.** Objection handling and an import selling point (pattern 9 in the research). Regroup may be named as a CSV import source.

**Layout.** Three equal cards (stacked at 768 and below), each with an inline-SVG illustration.

| Card | Content (README facts) | Slot lengths |
|---|---|---|
| Import | Sessions from Regroup come in from its CSV export. A backup file can be imported on the same device or another. The app shows what an import will do before it runs | title 2 to 4 words, text 25 to 32 words |
| Export | A full backup (sessions with timelines, hands, goals) and spreadsheets (CSV) of sessions and hands for Excel, Numbers or Google Sheets | same |
| Use it as an app | iPhone: Safari, Share, Add to Home Screen. Chrome, Edge and Android offer an Install button. Opens full screen | same |

Leave out the automatic server backups (they depend on a server this site does not have) and any privacy or offline claim. No link to an app or download anywhere in this section.

**CTA.** None. **Device screens.** None (icons only). **Library component.** `components/cards-and-grids.md`, with the `bento-grid.md` hover treatment so it matches section 4. **Motion.** Cards rise in once, staggered. **States.** Static without script.

---

### 4.8 Pricing (`#pricing`)

**Purpose.** Prices are shown (owner decision), labelled illustrative, and lead to pop-up 2. The numbers and plan names come from the copywriter. The prices must never be presented as a comparison to named competitors.

**Layout, 1024 and up.** Switch centered above three cards in a row, middle card featured. **768 to 1023:** the featured card full width first, the other two side by side beneath. **Below 768:** one column, featured card first.

```text
H2 + lead (includes "Illustrative prices on a concept site" and a "from $X a month" statement)
[ Billing:  Monthly | Yearly  (savings chip) ]
┌ Plan A ────────┐  ┌ Plan B  (featured, tag) ┐  ┌ Plan C ────────┐
│ name           │  │ name                    │  │ name           │
│ price /mo      │  │ price /mo               │  │ price /mo      │
│ billed yearly* │  │ billed yearly*          │  │ billed yearly* │
│ audience line  │  │ audience line           │  │ audience line  │
│ 5-6 bullets    │  │ 6-7 bullets             │  │ 6-7 bullets    │
│ [Get early access] [Get early access]         │  [Get early access]
└────────────────┘  └─────────────────────────┘  └────────────────┘
Illustrative prices. This is a concept site: nothing is charged or collected.   (FAQ 7 link)
```

**Content and copy slots**

| Slot | Length |
|---|---|
| H2 | 3 to 7 words |
| Lead | 20 to 30 words |
| Switch labels | Monthly, Yearly |
| Savings chip | 3 to 5 words (the number comes from the copywriter) |
| Plan name | 1 to 2 words |
| Price | a number plus "/mo". Yearly shows the monthly equivalent plus a "billed yearly" line |
| Audience line | 5 to 9 words |
| Feature bullet | 3 to 7 words each, 5 to 7 per plan |
| Featured tag | 1 to 2 words. Use "Recommended". Do not use "Most popular" (no user data exists) |
| Button | CTA-EARLY, same label on all three, 22 characters or fewer |
| Note under the cards | 10 to 16 words |

Rules for the plans: differences are by volume (for example coached hands a month, practice hands a day), never by features that do not exist in the product. No competitor named, no "30 percent cheaper" claim. Prices are always dollars: the BB/$ switch never touches them. No Product or Offer structured data.

**CTA.** All three buttons open pop-up 2 with the plan chip filled (`data-cta="pricing-A|B|C"`). The featured button is solid, the others outline.

**Device screens.** None. **Library component.** `components/premium/pricing-plans.md` (switch with rolling prices, featured card with a tracing border). **Motion.** Price roll on switch, border trace on hover for the featured card. **States.** No script: both billing prices shown as text ("$X/mo, or $Y/mo billed yearly"), buttons become links to `/#faq`. Reduced motion: prices swap without rolling.

---

### 4.9 FAQ (`#faq`)

**Purpose.** Answer objections, supply crawlable text, and be honest about what the site is. No FAQ structured data.

**Layout.** At 1024 and up, heading and lead stick on the left while the list scrolls on the right. Below 1024, heading then list. Native `<details>`. More than one item may be open.

| # | Question (shape) | Answer gist, 25 to 60 words |
|---|---|---|
| 1 | What is HandSolved? | Session tracker, hand recorder, GTO coach and practice table. Plain definition of GTO |
| 2 | What does "graded against GTO" mean? | GTO is the strategy a solver computes. It is the benchmark the coach compares you to, not a prediction for any single opponent. Scores run 0 to 100 |
| 3 | Which games and spots does the coach cover? | Hold'em only. Preflop uses 8-handed charts at the hand's stack depth. Postflop is solved heads-up or 3-way. Not Omaha, not custom spots |
| 4 | Is it an online HUD? Can it import PokerStars hands? | No. You enter hands on a table. Imports are your own backups and Regroup CSV exports |
| 5 | Do I need to install anything? | It is a web app that installs from the browser on iPhone, Android and desktop. No store |
| 6 | Can I export or import my data? | Backup file and CSV export; Regroup CSV import, with a preview of what an import will do |
| 7 | Is this site selling something right now? | It is a concept site. Prices are illustrative. The early-access form checks the format of an email and sends nothing |

**Library component.** `components/premium/smooth-accordion.md`. **CTA.** None. **Motion.** Height animation on open (the one effect). **States.** Collapsed, hover, focus, expanded, animating. Without script, native details still work. Reduced motion: instant.

---

### 4.10 Closing band and reveal footer (`#start`)

**Purpose.** Restate the promise, repeat the one action, and give the page its ending: the page sheet lifts away to reveal the footer.

**Layout.** The closing band is the top of the footer: H2, one line, CTA-DEMO, and a text link to `#pricing`. Under it: three link groups, then the oversized wordmark (`aria-hidden`, outline fills with a gradient as it is revealed), then the legal row with the concept note. Build the footer taller than the viewport at 375, where the component falls back to normal flow and keeps the rounded edge. At 1024 and up it is a true sticky reveal.

**Content and copy slots.** H2 4 to 8 words (restates the outcome); line 10 to 16 words; CTA-DEMO (`data-cta="closing"`); link groups as in section 2; legal row: "(c) 2026 HandSolved" and the concept note, 8 to 12 words: "Concept site, illustrative prices, nothing is collected."

**Device screens.** None. **Library component.** `components/premium/reveal-footer.md` (it includes a closing CTA; for extra structure see `components/premium/cta-footer.md`). Follow the component's wiring: the sheet is `<main>` plus the header, it needs an opaque background, and the footer is the last child of the wrapper. Keep the focus-visible rule: if focus lands in the footer while the sheet covers it, the component raises it and scrolls to the end.

**Motion.** One scroll-progress variable drives the lift, dim and wordmark fill. Reduced motion: dim and fill still fade, nothing translates or scales. **States.** Sticky reveal, flow fallback, no script (end state shown).

---

### CTA map

| Where | Control | Opens |
|---|---|---|
| Header | CTA-DEMO (secondary style until the hero CTA leaves) | pop-up 1 |
| Hero | CTA-DEMO | pop-up 1 |
| End of story | CTA-DEMO | pop-up 1 |
| End of numbers | CTA-DEMO | pop-up 1 |
| Closing band | CTA-DEMO | pop-up 1 |
| Mobile bar and mobile menu | CTA-DEMO | pop-up 1 |
| Highlights rows (P2) | "Grade it" | pop-up 1 at that spot |
| Verdict panel | "Get early access" | pop-up 2 |
| Pricing, 3 buttons | CTA-EARLY | pop-up 2 with plan chip |

## 5. Supporting pages

All use the same navbar, dialogs and reveal footer. Breadcrumbs use `components/tabs-and-wayfinding.md` and match the BreadcrumbList markup.

### 5.1 `/gto-hand-review`

Job: explain and prove how a decision is graded.

```text
[GTO HAND REVIEW]
1. Compact hero — breadcrumb, H1 with "GTO hand review", subhead, CTA-DEMO, desktop+phone devices
2. Worked example (#worked-example) — one real spot, fully in HTML, with a "grade it yourself" button
3. How a decision is graded — 3 steps: solve, compare, grade; grade legend
4. What you see for each decision — 4 bento tiles
5. Limits — chips and one short paragraph
6. FAQ — 4 questions
7. Related links + closing band + reveal footer
```

| # | Purpose, content, slots | Screen | Library |
|---|---|---|---|
| 1 | Name the intent. H1 5 to 9 words (carries "GTO hand review"). Subhead 20 to 28 words. CTA-DEMO | `desk-coach-top.png` plus `phone-coach-score.png` | `aurora-hero.md` (compact), `kinetic-headline.md` |
| 2 | The same data as demo spot 1, rendered as HTML: table scene (SVG), situation sentence (30 to 45 words), a real `<table>` of options with columns Option, GTO plays it, Worth, the grade sentence (15 to 25 words). Button: CTA-DEMO labelled the same, `data-cta="review-example"`. This is also the no-script fallback for every CTA-DEMO | `phone-coach-decision.png` beside the table, `desk-coach-decision.png` at 1024 and up | `content-blocks.md` (feature row) plus the verdict component |
| 3 | Step 1 preflop charts (8-handed, 14 depths, cash and tournament). Step 2 postflop solved per street (heads-up or 3-way, real bet sizes). Step 3 graded 0 to 100. Each 30 to 40 words. Legend chips | none | `components/premium/scroll-timeline.md` |
| 4 | Tiles: how often GTO takes each option; what each is worth; pot odds and equity against ranges; range grids. 12 to 20 words each | `desk-coach-decision.png` as the large tile | `bento-grid.md` |
| 5 | Hold'em only; heads-up or 3-way postflop; you enter hands; the review lists the assumptions it made when stacks were not recorded (the app shows this notice). 40 to 60 words | none | `trust-and-stats.md` |
| 6 | Examples: Can I grade online hands? Does it work for Omaha? What if I did not record the stacks? What is a "blunder"? 25 to 50 words each | none | `smooth-accordion.md` |
| 7 | Links with descriptive anchors: "Record a hand at the table" (`/live-poker-hand-recorder`), "See pricing" (`/#pricing`). Closing band as on home | none | `reveal-footer.md` |

### 5.2 `/live-poker-hand-recorder`

Job: show how a hand is recorded.

```text
[LIVE POKER HAND RECORDER]
1. Compact hero — breadcrumb, H1, subhead, CTA-DEMO, phone with the recorder
2. Recording in 3 steps — pinned story: Record, Review, Coach
3. Details — 5 bento tiles
4. The whole session — one row: live session log and history
5. FAQ — 4 questions
6. Related links + closing band + reveal footer
```

| # | Purpose, content, slots | Screen | Library |
|---|---|---|---|
| 1 | H1 5 to 9 words with "live poker hand recorder". Subhead 20 to 28 words | `phone-recorder.png` | `aurora-hero.md` (compact) |
| 2 | Record: seat players, set stacks, pick cards, answer each action. Review: replay street by street with all-ins highlighted. Coach: one tap to grade. Each step 25 to 35 words, link on step 3 to `/gto-hand-review` | `phone-recorder.png`, `phone-review.png`, `phone-coach-decision.png` | `sticky-showcase.md` (same block as home) |
| 3 | Tiles of 8 to 14 words: all-ins and side pots handled; stacks as Short, Average, Big, Huge or exact; tap any step to go back; edit anything afterwards; swipe a hand to edit or delete | none | `bento-grid.md` |
| 4 | Live session: game, stakes, venue, buy-in, rebuys, notes, cash-out, rating, tilt; history graded A to F. 30 to 45 words | `phone-history.png` | `content-blocks.md` |
| 5 | Examples: How fast can I record a hand? What if I do not know the stacks? Can I import online hand histories (no)? Does it work on iPhone and Android? | none | `smooth-accordion.md` |
| 6 | Link to `/gto-hand-review` ("See how a hand is graded") and `/#pricing`. Closing band | none | `reveal-footer.md` |

### 5.3 `/privacy` and `/terms`

Job: tell the truth about a concept site.

```text
[LEGAL]
1. Title block — H1, "Last updated" (a real date), a boxed plain-words summary
2. Prose — H2 sections, table of contents on the left at 1024 and up
3. Closing — "Back to home" link and the reveal footer (no CTA band)
```

- Summary box, 25 to 45 words. Privacy: this is a concept site; it collects, stores and sends nothing; the pop-ups run in your browser; the only thing kept is your BB/$ choice, in your browser's local storage. Terms: concept site, illustrative prices, nothing can be bought, sample data is not real results, solver output is for study and is not advice.
- Prose line length 68 characters at most, body at least 16px. Copy is the copywriter's draft for the owner to review; it is not legal advice.
- Open items for the owner before publishing: a contact line (or a statement that there is none), and what the host or CDN logs.
- Library: `components/content-blocks.md`, `components/tabs-and-wayfinding.md` (table of contents), `reveal-footer.md`.

### 5.4 404

```text
[404]
1. Minimal hero — H1 (one line, a light poker pun is fine), one sentence, CTA-DEMO, three links: Home, GTO hand review, Live poker hand recorder
2. Reveal footer
```

HTTP 404, `noindex`, same header and footer, small inline-SVG illustration. Library: `components/heroes.md`, `components/cta-sections.md`.

## 6. Pop-up specs

### 6.0 Shared rules

- Native `<dialog>` opened with `showModal()`; background is inert; body scroll locked without layout shift (`scrollbar-gutter: stable`); `overscroll-behavior: contain` inside the dialog. Library base: `components/premium/spring-modal.md`.
- Opens on click or key press only. Never on load, scroll, time or exit intent. Pop-up 2 never opens by itself.
- One dialog at a time. Opening pop-up 2 from pop-up 1 closes pop-up 1 first (about 200ms exit), then pop-up 2 opens from the same point. The saved return target is always the element on the page that first opened a dialog, never a button inside a dialog that no longer exists. If that element is gone (the mobile bar hid), return to the hero CTA.
- Close paths: close button (44 by 44, `aria-label="Close"`), Escape, backdrop click (768 and up), downward flick on the sheet (below 768). The drag handle is decorative; the button is the accessible way. Mobile Back closes the sheet (P2: push a history state on open).
- Size: 768 and up, a centered dialog that springs out of the trigger. Below 768, a bottom sheet that slides up.
- Reduced motion: no spring, no slide, no flip, no roll. Views swap by instant fade; bars show their final width.
- Focus is never placed on the backdrop or the dialog element itself. Every view change moves focus to that view's heading (`tabindex="-1"`). Do not also use a live region for a change where focus moves (it would be read twice).
- All amounts use the shared unit state (section 4.5). Formatting: bb shows at most one decimal and drops a trailing .0; dollars are whole numbers with thousands separators; results always carry a sign, pot and stack figures do not; the minus is a real minus sign.

### 6.1 Pop-up 1: sample hand (`#dlg-sample`)

**What it does.** The visitor sees a table and one decision, picks an action, and gets the coach verdict with real engine numbers: how often GTO takes each option and what each is worth. Three spots, dealt in order, with a way to deal the next. All data is bundled; nothing is fetched.

**Data.** Taken from `docs/site/research/engine-output.json`. Hand ids are the file's. Numbers below are the file's, not rounded by me.

| Order | Spot (file id, decision) | Plain situation | Options: GTO plays it, worth |
|---|---|---|---|
| 1 | River, `h2`, decision 6 ("Called a river shove with a set on a four-straight board"). You: BB, 8♥ 8♣. Board 8♦ J♠ 9♠ 2♣ 10♠. Pot 255 bb, to call 65 bb | Three of a kind, but the board has four cards in a row and the opponent bets big | Fold 96%, 0 bb (GTO). Call 65 bb 4%, -62.6 bb. Recorded grade of Call: Blunder 6 |
| 2 | Turn, `h4`, decision 4 ("Turned straight against a check-raise"). You: SB, 7♠ 6♠. Board 5 8 K 4 (suits from the app's hand). Pot 38 bb, to call 14 bb | You hold a straight and the opponent raised your bet | Fold 0%, 0 bb. Call 14 bb 45%, +51.2 bb. Raise to 49 bb 54%, +52.7 bb (GTO). All in 94 bb 0%, +50.4 bb. Recorded grade of All in: Inaccuracy 77 |
| 3 | Flop, `h1`, decision 2 ("Three streets of value with top pair"). You: BTN, A♠ K♦. Board K♥ 7♣ 2♦. Pot 21.5 bb. Opponent checked | Top pair, best kicker. How much do you bet? | Check 2%, +27.8 bb. Bet 7.1 bb (33% pot) 87%, +28.4 bb (GTO). Bet 11 bb (51% pot) 10%, +28.3 bb. Bet 16.1 bb (75% pot) 0%, +26.7 bb. Recorded grade of Bet 11 bb: Good 96 |

Why these three, in this order: spot 1 has the biggest contrast (0 versus -62.6 bb), uses only two options, and is the same hand as the Coach screen in the story, so the pop-up and the screenshot agree. Spot 2 teaches that two answers can both be right while one option is a disaster. Spot 3 teaches that GTO mixes and that close spots exist.

Do not use spots whose "GTO" tag and frequency disagree (for example the first preflop decision of hands `h1` and `h3`, where the file shows Raise 100% but marks Call as best). They would read as a bug.

Data rules for the builder:
- Each option carries `key, label, amount, freq, value, best` straight from the file.
- Suits: the file holds ranks only in its text. Take suits from the app's own hand (the suits listed above for spots 1 and 3 were read from the captures and the contact sheet, so verify all three against the app's hand records; spot 2's board suits are not visible anywhere). A suited hand stays suited.
- Stakes: assume $1/$2 for all three (1 bb = $2) and verify against the app's hand records.
- Grades: the file stores a grade only for the option the recorded hand actually took. For every other option, run the app's grader (`src/coach/grading.js`, rules in `docs/coach-algorithm.md`, "Grading") offline and store the result. If an option has no grade, show numbers only for it. Never write a grade by hand.

**Anatomy (768 and up)**

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Grade a sample hand        Hand 1 of 3  ● ○ ○          [BB | $]           [X] │
├───────────────────────────────┬──────────────────────────────────────────────┤
│  [table scene, SVG]           │  What you're looking at ▾  (first spot open)  │
│   8 seats, your cards,        │  Situation (plain words, 30-45 words)         │
│   board, pot, opponent's bet  │  What do you do?                              │
│   Pot 255 bb · To call 65 bb  │  [ Fold          ] [ Call 65 bb     ]         │
│                               │    give up hand     match the bet             │
├───────────────────────────────┴──────────────────────────────────────────────┤
│ Concept site: real engine output for a sample hand. Amounts in big blinds.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

Width: min(880px, 100vw - 48px). Height up to 90svh. At 1024 and up, two columns (scene 46 percent, choices and verdict 54 percent); the right column scrolls inside if needed. At 768 to 1023, one column: scene (max 280px tall), then text and choices.

**Content and copy slots**

| Slot | Length |
|---|---|
| Title | CTA-DEMO's label |
| Progress | "Hand 1 of 3" plus three dots |
| "What you're looking at" | 30 to 40 words, plain: you are one player at an 8-seat table, pick what you'd do, then see what a solver does and what each choice is worth |
| Glossary (disclosure, 3 terms) | GTO, bb, "Worth", each 12 to 20 words |
| Situation | 30 to 45 words, per spot, written in plain words with the cards named |
| Question | 3 to 5 words ("What do you do?") |
| Action label | the action and amount ("Call 65 bb") |
| Action sublabel | 2 to 3 words, always visible: Fold (give up the hand), Check (pass, no bet), Call (match the bet), Bet or Raise (put in more), All in (bet everything) |
| Verdict sentence | 15 to 28 words, a template per grade with numbers injected |
| Plain bullets | 2 to 3 bullets, 15 to 22 words, from the engine's own explanation text |
| Footnote | 10 to 16 words |

**States**

| State | Trigger | What the visitor sees | Focus | Announcement |
|---|---|---|---|---|
| Closed | default | nothing | on the page | none |
| Opening | CTA-DEMO | spring from the trigger (768+) or sheet slide (below 768), blurred backdrop | moves to the title (`tabindex="-1"`, set with `autofocus`) once the dialog is open | dialog name and title are read through `aria-labelledby` |
| Choose, first spot | after opening | intro paragraph expanded, glossary closed, table scene, situation, question, 2 to 4 action buttons, all enabled | title, then Tab goes unit switch, glossary, actions, close | none |
| Choose, later spots | after dealing | intro collapsed to a one-line "What am I looking at?" disclosure | the new situation heading | "Hand 2 of 3" through the heading |
| Action hover, focus, press | pointer, keyboard | hover lift, `:focus-visible` ring of at least 2px with 3:1 contrast, press scale | on the button | none |
| Committed | Enter, Space or tap on an action | actions lock (`disabled` after commit, the picked one marked `aria-pressed="true"`), view morphs to the verdict, bars grow and numbers roll in 700ms or less. No fake loading delay | the verdict heading (`tabindex="-1"`) | the heading text is read: grade and one-sentence verdict |
| Verdict by grade | outcome | grade chip with icon and text (Best move, Good, Inaccuracy, Mistake, Blunder plus score), "You" and "GTO" cards, the options list, 2 to 3 bullets, actions | verdict heading | as above |
| What-if | tap another option row | the "You" tag and verdict move to that row (FLIP), sentence and chip update, focus stays on the row | the pressed row | a polite live region says "Showing Fold: Best move, GTO plays it 96 percent" |
| Dealing next | "Deal next hand" | scene updates (cards flip, 500ms), progress dot advances, choose state | the new situation heading | via heading |
| Set complete | verdict of hand 3 | primary action becomes "Get early access", secondary "Start over" (clears picks, back to hand 1) | verdict heading | via heading |
| Early-access hand-off | "Get early access" | this dialog closes, pop-up 2 opens | pop-up 2's email field | via pop-up 2 |
| Data error | spot data missing or malformed | the scene area shows a message (12 to 20 words) with a link to `#how` and a Close button; no partial hand | the message heading | via heading |
| Closing | X, Escape, backdrop, flick | reverse of the opening | back to the saved opener | none |
| Reopen | CTA again | resumes at the current hand in the Choose state, picks cleared | title | none |
| Reduced motion | `prefers-reduced-motion` | instant swaps, bars at final width | unchanged | unchanged |
| Landscape phone | width under 900 and height under 500 | full-screen, two columns (scene left, choices right), header 44px tall | as above | none |

**Verdict view contents (in order)**
1. Grade chip and sentence: for example "Blunder 6. GTO folds this 96 percent of the time. Calling is worth -62.6 bb: about 63 big blinds lost on average."
2. "You" card and "GTO" card side by side (as in `phone-coach-decision.png`): your action, GTO's top action.
3. Options list, one row per option, with three columns: option name with a "GTO" and/or "You" tag, how often GTO plays it (bar plus percent), what it is worth (signed, teal if best or positive, coral if negative, always with the sign and a tag so color is never the only cue). Rows are buttons (`aria-pressed`, an `aria-label` built from the row's own text) for the what-if feature. Best and picked rows are marked with text, not just color.
4. Two or three plain bullets from the engine text (for spot 1: solved heads-up from the ranges everyone arrived with, with the real bet sizes; pot odds, call 65 bb to win 320 bb, so you need 20 percent equity; your equity is about 1 percent).
5. Actions row.

**375px layout (and 320)**

```text
┌ handle ─────────────────┐   sheet: full height minus 16px, 24px top radius
│ Hand 1 of 3 ●○○  [BB|$] [X] │   header 56px: dots left, unit switch, close 44x44
├─────────────────────────┤
│ [table scene ≤ 220px]    │   scrolling content area starts here
│ What am I looking at? ▸  │   collapsed one-liner on mobile (open on the first hand)
│ Situation text           │
│ What do you do?          │
│ [Fold         ]          │   2-option hand: two stacked 56px buttons
│ [Call 65 bb   ]          │   4-option hand: 2 by 2 grid of 56px buttons
├─────────────────────────┤
│ footnote                 │
└─────────────────────────┘
verdict view:  verdict sentence, You/GTO cards stacked, options list, bullets
               actions row pinned at the bottom: [Deal next hand][Get early access]
```

- Scene: portrait-shaped oval like the app's phone table. Only your seat, the opponent's seat and the dealer button are labeled below 400px; other seats are dim silhouettes.
- Option rows below 480px: the frequency bar moves under the option name as a 4px line to keep the name and the two numbers on one row.
- Actions row pinned to the bottom of the sheet with the safe-area inset. At 360px and above: two buttons side by side, each at least 44px tall. Below 360px (320): primary full width, secondary as a text link beneath with a 44px tap area.
- Nothing needs horizontal scroll at 320. Text is never below 12px; action labels 16px.
- Content area scrolls, the header and the actions row stay.

**Keyboard map.** Tab order: title, unit switch, glossary, actions, (verdict: option rows, then actions), close last in DOM order (shown top right with CSS). Enter or Space commits an action. Escape closes. Optional (P3): keys 1 to 4 choose an action, N deals the next hand; show the hint only on devices with a fine pointer.

### 6.2 Pop-up 2: early access (`#dlg-early`)

**What it does.** One email field with real validation. Nothing is sent, stored or logged: no storage write, no network call. The success step says plainly that this is a concept site and nothing was sent.

**Opened from:** the verdict panel in pop-up 1 (after the verdict) and the three pricing buttons. Never automatically.

**Form design**
- One field only: **Email**. Visible `<label>` above the field at all times (no floating label that disappears, no placeholder-as-label). `type="email"`, `inputmode="email"`, `autocomplete="email"`, `autocapitalize="off"`, `spellcheck="false"`, `name="email"`, `novalidate` on the form so the messages are ours. Input height 52px, font size 16px or more (stops iOS zoom).
- Placeholder is an example only ("name@example.com"), never the label.
- One submit button, CTA-EARLY's label. It is never disabled before submit. After a valid submit it is disabled for the length of the transition so it cannot double fire.
- A pre-submit line under the field (10 to 16 words): this is a concept site and the form checks the format of the address and sends nothing. Recommended by UX; the owner may reword it but should not remove it.
- When opened from pricing, a read-only chip above the field: "Plan: {name}, {price} (illustrative)". It is text, not an input.
- Spam protection: not needed, because nothing is sent. If it is ever wired to a backend: honeypot field, minimum fill time, server-side validation and rate limits, and double opt-in.

**Validation rules** (trim whitespace first)

| Check | Rule |
|---|---|
| Empty | required |
| Shape | exactly one `@`, no spaces |
| Local part | 1 to 64 characters, no leading, trailing or doubled dots |
| Domain | at least one dot, labels 1 to 63 characters, no leading or trailing hyphen or dot, final label at least 2 letters |
| Length | 254 characters at most |
| Characters | letters, digits and `. _ % + -` in the local part; letters, digits, hyphens and dots in the domain (internationalized domains accepted in their ASCII form) |
| Typo hint (soft, never blocks) | if the domain is within 2 edits of gmail.com, outlook.com, hotmail.com, yahoo.com, icloud.com or proton.me, offer "Did you mean name@gmail.com?" with a "Use this" button |

**Messages** (each linked with `aria-describedby`; `aria-invalid="true"` on the field while an error shows)

| Case | Message |
|---|---|
| Empty | Enter your email address. |
| No @ | Add an @, like name@example.com. |
| Nothing after @, or no dot | Add the part after the @, like example.com. |
| Space or bad character | Remove spaces and special characters. |
| Too long | That address is too long. The limit is 254 characters. |
| Typo hint | Did you mean name@gmail.com? |

Timing: validate on submit first. After the first error, validate on every input and clear the message the moment the address is valid. On blur, validate only if the field is not empty. Never show an error while the first characters are still being typed.

**States**

| State | What the visitor sees | Focus | Announcement |
|---|---|---|---|
| Closed | nothing | on the page | none |
| Opening | spring or sheet, same as pop-up 1 | the email input (one-field dialog, so the first control gets focus) | the dialog title is read through `aria-labelledby`, then the field label |
| Empty | label, field, pre-submit line, plan chip if any, button | input | none |
| Focused | focus ring on the field | input | none |
| Typing | no message yet | input | none |
| Error | message under the field in coral with an icon, field border changes and the icon repeats the cue, `aria-invalid="true"` | back on the input after a failed submit | the message is announced once (`role="alert"` on submit failure only, not while typing) |
| Typo hint | the message plus a "Use this" button | input | polite |
| Valid before submit | small check icon inside the field, no extra text | input | none |
| Success | height morph to a success view: check ring draws, H2 (3 to 6 words), body (25 to 40 words) that says this is a concept site and nothing was sent or saved, the checked address shown back in text (kept in memory only, cleared on close), primary "Back to the site", secondary "Grade another sample hand" | the success heading | read via the heading |
| Closing | reverse of opening | the saved opener | none |
| Reduced motion | instant swap, check already drawn | unchanged | unchanged |

No loading state: the check is local and instant, and a fake delay would be untrue. No network error state exists for the same reason.

**375px layout**

```text
┌ handle ───────────────────┐   compact bottom sheet, height follows content (about 340px)
│ Get early access      [X]  │
│ [Plan chip, if any]        │
│ Email                      │
│ [ name@example.com       ] │   52px, 16px type
│ error / hint (reserved row)│   one reserved line, so the layout does not jump
│ Concept site: format check │
│ only, nothing is sent.     │
│ [ Get early access        ] │   full width, 56px
└───────────────────────────┘
```

The sheet follows `visualViewport` so the field and button stay above the keyboard (`interactive-widget=resizes-content` in the viewport meta, plus a `--kb-inset` set from `visualViewport.resize`). At 320: the same layout, side gutters 16px. Landscape phone: centered dialog, 420px wide, content scrolls inside it.

Library: `components/premium/spring-modal.md` for the shell and morph, `components/forms.md` for field and message structure, `components/premium/floating-label-form.md` only for its focus ring and error styling (not for the floating label).

## 7. Component inventory and states

| Component | Used in | States |
|---|---|---|
| Skip link | all | hidden, focus |
| Floating navbar | all | top, scrolled (tightened), link default, hover pill, focus-visible, current, section-current, menu open (mobile) |
| Mobile menu panel | below 1024 | closed, opening, open, closing |
| Mobile CTA bar | below 768 | hidden, visible, hidden-by-dialog, hidden-by-footer, hidden-by-story |
| Button, primary | all | default, hover, focus-visible, pressed, in-dialog (full width) |
| Button, secondary and text link | all | default, hover, focus-visible, pressed |
| Page-load veil | home | playing, done, skipped (return visit), disabled (reduced motion, no script) |
| Hero | home, review, recorder | entering, settled, no-script, image-failed |
| Device frame (phone, desktop) | hero, story, tabs, product pages | default, tilt (fine pointer), loading (solid placeholder), image-failed, with "Sample data" tag |
| Proof item | hero | default |
| Story (pinned showcase) | home, recorder | step inactive, active, passed; scene hidden, active; dots; stacked fallback; reduced motion |
| Counter | engine, numbers | final text (no script), rolling, settled, reduced |
| Grade chip | pop-up, review page, engine legend | Best move, Good, Inaccuracy, Mistake, Blunder, ungraded. Each has icon, text and score; color is a secondary cue |
| Playing card (SVG) | tiles, scene, verdict | face up, face down, empty slot (dashed). Suit shown by shape as well as color |
| Hand row | highlights tiles | default, hover, focus-visible, button variant (P2) |
| Bento tile | highlights, detail pages | default, spotlight (hover), focus-within, in-view animation done |
| Unit switch (BB / $) | highlights, numbers, pop-up 1 | BB on, $ on, hover, focus-visible, switching (roll), reduced |
| Dashboard card and chart | numbers | no-script drawn, drawing, drawn, readout (pointer), readout (keyboard), table view open |
| Tabs | toolbox | tab default, hover, selected, focus-visible; panel hidden, shown, assembling |
| Info card | data section | default, hover |
| Billing switch | pricing | Monthly, Yearly, hover, focus-visible, rolling |
| Plan card | pricing | default, featured, hover, focus-within, price rolling |
| FAQ item | home, product pages | collapsed, hover, focus-visible, expanded, animating |
| Closing band and reveal footer | all | sticky reveal, flow fallback, no script, focus-in-footer |
| Dialog shell | both pop-ups | closed, opening, open, closing, sheet drag, reduced |
| Action button | pop-up 1 | default, hover, focus-visible, pressed, committed (selected), locked |
| Table scene | pop-up 1, review page | per spot; dealing (cards flip); static (review page) |
| Verdict option row | pop-up 1, review page | default, GTO, You, GTO and You, hover, focus-visible, selected (what-if) |
| Glossary disclosure | pop-up 1 | closed, open |
| Text field | pop-up 2 | default, hover, focus, filled, error, hint, valid |
| Inline message | pop-up 2 | error, hint (typo), success |
| Plan chip | pop-up 2 | absent, present |
| Breadcrumbs | product pages, legal | default |
| Prose block and table of contents | legal | default, current heading |
| Options table (HTML) | review page worked example | default |
| 404 block | 404 | default |

## 8. Responsive rules

Mobile-first, `min-width` queries, main break at 768. Container max width 1200px, gutters 16px (320 to 767), 24px (768 to 1023), 32px (1024 and up). No horizontal scroll at 320. Body text 16px or more, nothing below 12px.

| Element | 320 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| Header | brand and burger | brand and burger | brand, button, burger | brand, 4 links, button | same, wider spacing |
| Mobile bar | yes, full width | yes | no | no | no |
| Hero | one column, phone only, cropped at the bottom, proof stacked | same, CTA fully visible by 440px height | two columns, phone plus desktop frame small, floating chip | two columns, both frames, tilt | larger frames, backdrop extends full width, container still 1200px |
| Story | pinned phone at the top (38svh) or stacked under 600px height | same | two columns, pinned phone right | wider copy, larger phone | same, more air |
| Engine | counters stacked, chips wrap | same | counters in a row, legend wraps | counters and legend in rows | same |
| Highlights | one column, insights card last | same | two columns | three columns, tall insights card | same |
| Numbers | card full width, tiles 2 by 2, chart 288px plot width | tiles 2 by 2, chart 320px | card full width under the copy | two columns (4 and 8) | same |
| Toolbox | tabs scroll and snap, text above device | same | tabs fit, panel two columns | device larger, sides alternate | same |
| Data | stacked cards | stacked | three cards, tighter | three cards | three cards |
| Pricing | one column, featured first | same | featured full width, then two | three in a row, middle featured | same |
| FAQ | single list | same | single list | heading sticks left, list right | same |
| Footer | stacked groups, wordmark smaller, flow fallback | same | two columns of links | three columns, sticky reveal | same, larger wordmark |
| Pop-up 1 | full-height sheet, actions stacked and pinned, option bars under names | full-height sheet, actions side by side | centered dialog, one column | centered dialog, two columns | max width 880px |
| Pop-up 2 | compact sheet, follows keyboard | compact sheet | centered dialog, 440px wide | same | same |
| Product pages | compact hero, same section rules | same | two columns where the home has them | same | same |

Cross-cutting
- Hide (never remove from the HTML): desktop frame and floating chip below 768; callout chips on the story phone below 768 become a single line of text; dim seat labels in the table scene below 400px.
- Reorder: pricing featured card first below 1024; highlights insights card last below 1024.
- Short screens (height under 600): no pinned story, no 100svh hero, pop-up 1 uses the landscape layout when width under 900 and height under 500.
- Touch targets at least 44 by 44, spacing at least 8px, on every control including the burger, close buttons, switch buttons, tabs, plan buttons and what-if rows.
- Reduced motion, reduced data and no-script variants are listed per section.

## 9. Notes for the other roles

### 9.1 web-copywriter

1. **Slots** are in each section (lengths are rough upper bounds). Final labels needed first: CTA-DEMO (shape "Grade a sample hand", 22 characters or fewer, used verbatim everywhere) and CTA-EARLY (shape "Get early access", 22 or fewer).
2. **Two readers.** Plain words first, poker word second, defined at first use in the same sentence: GTO (the strategy a poker solver computes), bb (big blind, the unit stakes are measured in), "worth" (the average result of an option, in big blinds, from that point on). Never assume the reader knows "pot odds", "equity", "range" or "kicker". If one is needed, gloss it in the sentence.
3. **Do not write**: testimonials, ratings, user counts, press, awards, "trusted by", "most popular", "loved by"; any accuracy, benchmark or "most accurate" claim about the coach; named competitors or "30 percent cheaper"; the words "download", "app store", "get the app", "sign up", "log in"; claims about privacy, security, offline use or backups of product data; the old product name. Use "hand score" for the app's "hand accuracy". "Free" only as a plan name inside the illustrative pricing section.
4. **Proof facts you may use**: 8-handed preflop charts solved at 14 stack depths, cash and tournament; each postflop street solved in the browser, heads-up or 3-way, with the hand's real bet sizes; every decision graded 0 to 100; Hold'em only; hands are entered by you; Regroup CSV import; CSV and backup export. Anything with a number on a screenshot is labelled "Sample data".
5. **Verdict sentence templates** for pop-up 1, one per grade (Best move, Good, Inaccuracy, Mistake, Blunder), with placeholders for frequency, value, best option and bb given up. Every number in the app is injected from data, never typed by hand, and must survive the BB/$ switch.
6. **Dialog microcopy**: title, intro, glossary (3 terms), situation sentences for the three spots (facts are in section 6.1), action sublabels, footnote, data-error message, early-access title, pre-submit line, plan chip format, the six validation messages (section 6.2), success heading and body, both secondary buttons.
7. **Pricing copy**: plan names, prices (made up, owner asked for roughly 30 percent under competitors, never stated), Yearly saving, bullets built from volumes, audience lines, the note under the cards.
8. **Per page**: title (60 characters or fewer), meta description (155 or fewer), H1 containing the target phrase, first paragraph repeating it naturally, social title and description. The drafts in `seo-keywords.md` section 5 apply with the name swapped; recount characters. Do not add "free" to titles. Do not put illustrative prices in titles or descriptions.
9. **Alt text** for every capture, describing what is on screen (for example "HandSolved coach report for a sample hand: score 27 percent, labelled Rough, six decisions reviewed, 76.61 big blinds given up to GTO"), and for decorative SVG, empty alt.
10. **Footer note**: "Concept site, illustrative prices, nothing is collected." (8 to 12 words). Legal pages: plain-words drafts for owner review, not legal advice.
11. **404**: one line with a light poker pun, one sentence, three link labels.

### 9.2 web-designer

1. Use the wireframes, the component inventory and the state tables. Layout is fixed here; everything visual is yours.
2. The app is the visual reference: dark ink, teal, coral for losses, amber for caution (README tokens: ink `#12181B`, slate `#3F5A60`, teal `#7FC8C2`, mist `#D9F0EE`, snow `#F6FBFB`; headings Fredoka, body Nunito). The component library's tokens use Geist. Decide one system. The captures must look at home on the page. The app has a light mode; v1 can ship dark only.
3. **Needed from you**: tokens (color, type scale for 320 to 1440, spacing, radius, shadow, motion durations and easing); grade palette for Best move, Good, Inaccuracy, Mistake and Blunder, each at 4.5:1 text contrast on its surface, with an icon per grade; device frames (phone about 9:19.5 to match the 1170 by 2532 captures, desktop 16:10 to match the 2880 by 1800 captures); the playing-card set (suit by shape as well as color); the table scene (8 seats, felt oval, dealer button, hero seat at the bottom, face-down villain cards, dashed board slots); chart styling; an inline-SVG icon set on one grid with no emoji; the focus ring; favicon; one 1200 by 630 social image per page.
4. **SVG backgrounds** (lightweight, `aria-hidden`): hero felt-rail outlines with one teal glow and suit pips; a faint grid for the story; pip scatter for the engine; rail lines for pricing; two soft lights for the footer. Each 8 KB or less before compression, shared `<symbol>` definitions, no filter beyond one blur layer, no SMIL, animate only transform and opacity, and only one layer per view.
5. **Effect budget.** One attention effect per section (listed in section 4). Background art is ambient and does not count, but it may not compete with text. No effect on top of body text.
6. Never rely on hover, color alone or placeholder-as-label. Touch targets at least 44 by 44. Contrast 4.5:1 for text, 3:1 for UI and focus.
7. Coordinate with `a11y-architect` for WCAG 2.2 AA review of both dialogs, the pinned story, the chart and the reveal footer.

### 9.3 frontend-builder

**Build and SEO**
1. Static site generation. View-source must show every heading, paragraph, FAQ answer, link and alt text with scripts off. One H1 per page. Self-referencing absolute canonical, `<html lang="en">`, one host with a single 301 hop, real 404 status, lowercase hyphenated URLs, one trailing-slash rule.
2. `robots.txt` allows everything and lists the sitemap. `sitemap.xml` has the five canonical URLs. 404 is `noindex`. No `nosnippet`.
3. JSON-LD: `WebSite` and `Organization` on home (name HandSolved, URL, logo; `sameAs` only for profiles that exist, so probably none); `BreadcrumbList` on the two product pages, matching the visible breadcrumbs. No FAQPage, Review, AggregateRating, Offer, Product or SoftwareApplication. No markup for content that is not visible.
4. Titles and descriptions per page from the copywriter. Open Graph and Twitter tags with the 1200 by 630 image.
5. Internal links: the nav, the footer, and descriptive in-text anchors from home to both product pages. No orphans. No outbound links in v1.
6. No analytics, no cookies, no third-party embeds, fonts self-hosted and subset, icons inline. That is what makes "nothing is collected" true. Put a `data-cta` attribute on each CTA (see the CTA map) so measurement can be added later.

**Performance** (75th percentile targets: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less)
1. LCP element is the H1 text or the hero device image. The image uses AVIF or WebP, `fetchpriority="high"`, explicit width and height, never lazy. Use `<picture>` so below 768 only the phone downloads. The captures are 1170 by 2532 and 2880 by 1800 PNGs; export them at display size (phone about 560 px wide at 2x, desktop frame about 1400 px wide).
2. Everything below the first screen is lazy. Load order: HTML and CSS; a small core script (navbar, reveal, unit state); the dialog module on first intent or idle; the story and chart modules when their section nears the viewport. Budget: core script 25 KB or less gzipped; dialogs plus spot data 40 KB or less gzipped; no animation library over 25 KB. Use CSS scroll-driven animation (`animation-timeline: view()`) where supported with an intersection-based fallback.
3. Preload only the one font used by the LCP text, set `font-display`, match fallback metrics. Check INP on a mid-range Android phone.
4. Reserve space for every image, the chart, the counters and the dialogs' host. The veil must not cause shift.

**State and data**
```text
state = { unit: 'bb' | 'usd', spotIndex: 0..2, picks: { spotId: optionKey }, plan: null | 'A' | 'B' | 'C', dialog: null | 'sample' | 'early', returnFocusTo: Element }
```
- `unit` lives on `<html data-unit>` and in local storage (try/catch; the page works if storage throws). All live numbers carry `data-bb="62.6"` and are formatted by one function (rules in 6.0). Dollars = bb times 2 (the $1/$2 assumption).
- Spot data contract: `{ id, source: "engine-output.json#h2/6", title, stake: {sb, bb}, street, hero: {seat, cards}, villain: {seat}, board: [...], pot, toCall, situation, options: [{ key, label, amount, freq, value, best, grade: {name, score} | null }], bullets: [...] }`. The three spots are in section 6.1.
- Verdict wording comes from templates plus data. The coach text bullets are the engine's own sentences, lightly simplified by the copywriter with the numbers kept.

**Dialogs**
1. Native `<dialog>` and `showModal()`. Spring from the trigger at 768 and up, bottom sheet with drag-to-dismiss below 768. Focus rules, return target, close paths and reduced-motion behavior are in section 6.0.
2. Action buttons are real `<button>`s, not auto-committing radios (arrow keys on radios would commit by accident). Verdict rows are buttons with `aria-pressed`.
3. Pop-up 2 follows `visualViewport` and uses `interactive-widget=resizes-content`. `novalidate` form, custom messages, `aria-describedby`, `aria-invalid`, `role="alert"` only on submit failure.
4. CTA-DEMO is a `<button aria-haspopup="dialog">` with a `<noscript>` link beside it to `/gto-hand-review#worked-example`. That page renders spot 1 in plain HTML so the fallback is real.

**Veil and transitions.** The veil is plain HTML and CSS in the document, removed by its own animation end, with a session-storage guard in try/catch. Cross-document View Transitions are an enhancement only.

**Pinned story, chart, reveal footer.** Follow each library component's wiring notes: no `overflow: hidden` on ancestors of a sticky element; chart is `role="img"` with a text summary and a data table; reveal footer is the last child of its wrapper and has the flow fallback for tall footers. Keep each component's accessibility wiring intact.

**QA before hand-off**
- View-source and no-script pass on every page. 320px with no horizontal scroll. Keyboard-only pass of both dialogs, the menu, the tabs, the accordion and the chart. Reduced-motion pass. Screen-reader pass of pop-up 1 (title read on open, verdict read once, what-if announced).
- Lighthouse mobile on home and one product page. Rich Results or schema validator shows no warnings.
- Search the built output: zero matches for the old product name (any case), zero `href` beginning with `http`, zero strings "download", "App Store", "onrender".
- Test the BB/$ switch by checking that no live number is left unconverted (hero chip, highlights, numbers card, both dialogs).

## 10. Open items and things not verified

- `PROJECT.md` and `messaging.md` were not available. Re-check the assumptions in section 0 against them.
- Spot 2's board suits, and the stakes of spots 2 and 3, are not in `engine-output.json` or the captures. The builder takes them from the app's hand records. $1/$2 is assumed.
- Per-option grades for options the recorded hands did not take must be produced by the app's grader (section 6.1). Until then, show numbers only for those options.
- Captures worth requesting: a live-session screen (story step 1) and an equity calculator screen (toolbox fourth tab). Without them the page works as specified.
- Owner inputs for the legal pages: a contact line (or a statement that there is none) and what the host or CDN logs.
- No conversion-uplift claim is made anywhere in this plan. The pop-up-as-demo is a judgment (the research found no competitor that embeds a demo and has no data on what converts).
