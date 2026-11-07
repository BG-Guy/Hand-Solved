# HandSolved site copy

Draft for owner review. Written 2026-11-01 by the web-copywriter role. It follows `docs/site/UX.md` section by section. Slot lengths are the UX upper bounds, counted by hand.

How to read this file

- A line that starts with a slot name (H1, Subhead, Button and so on) holds the words for the page, character for character.
- `{token}` marks a number or label injected from data. Every token follows the BB/$ switch.
- Parts marked "Builder notes" or "Price notes" are for the team. They are not page copy and never ship.
- Quote marks in this file only fence copy. No term on the page is ever put in quotes.

## Voice

**Three traits**

1. **Exact.** Name the thing and give the number. Say what is solved and what is not. Numbers over adjectives.
2. **Dry.** A short deadpan line is welcome where the product has a personality: the red pen, Wall of Shame, Tilt Tower. One joke a section at most. It is never aimed at the reader's play or the reader's losses.
3. **Unintimidating.** Explain a poker word once, in the sentence where it first appears, and move on. Players do not get patronized. Visitors who have never played get a plain caption.

**Person.** Say you to the visitor. HandSolved is the subject when the product acts ("HandSolved grades every decision"). No we, because no company stands behind this concept site. No names and no contact details.

**Reading level.** Grade 6 to 8. One idea per sentence. Short words win, because the H1 sits on three short lines of a very condensed face.

**The red pen.** Black is what you did. Red is the coach's mark. Copy about a graded hand shows both, such as a struck-out Call 65 bb with Fold written in.

**Words to use.** hand, decision, graded, grade, score, session, buy-in, cash-out, stack, big blind (bb), fold, call, raise, flop, turn, river, worth, how often, record, rebuild, replay, practice, log, export, chart, mark. Poker terms are fine once glossed: GTO, range, equity, pot odds.

**Words to avoid.**
- Winning and hype: crush, destroy, dominate, beat the games, win more, guaranteed, perfect, game-changer, unlock, level up, seamless, powerful, cutting-edge, supercharge. Profit appears only as a metric label (Net profit).
- Overclaims about the coach: optimal as an absolute, exact, solver-grade, AI, accurate, validated, matches published charts. Solved always ties to a named thing (preflop charts, a street).
- Store and account words: download, app store, get the app, sign up, log in, account (the only use is the legal line that there are none). Install appears only where the line says this concept site has nothing to install.
- Proof words with nothing real behind them: trusted by, loved by, most popular, rated, reviews, users, members, as seen in. The star ratings a player gives their own hands are a product feature and stay.
- Any competitor name. The old app name.

**Punctuation and format.**
- No em dashes, no en dashes (ranges are written with to), no not-X-but-Y framing, no colon followed by a reveal, no quotation marks around terms.
- A colon may label a value in a chip or caption (Plan: Pro, Sample data). It never sets up a punchline.
- Real minus sign (U+2212) for negative amounts. Typographic apostrophes in the build. Suits are SVG shapes, never text glyphs.
- Amounts: bb shows at most one decimal and drops a trailing .0. Dollars are whole numbers with thousands separators, except under $10 where cents show (see Builder notes). Results carry a sign. Pot and stack figures do not. The exception is the sample hand and the numbers drawn from it (the hero chip): there dollars are the engine's figure exactly, with cents whenever it has them ($125.24, $52.68, $130).

**Plain-word glosses.** Reuse these at first use on every page.

| Term | Short gloss (inline) | Longer gloss (glossary, captions) |
|---|---|---|
| GTO | GTO, the strategy a poker solver computes | Game theory optimal, the strategy a poker solver computes. Use it as a baseline to compare your play with. |
| bb | bb, big blind | Big blind, the forced bet that sets the stakes. At $1/$2 it is $2. Amounts are counted in big blinds, and the BB/$ switch shows dollars. |
| Worth | worth, the average result of a choice | The average result of a choice from this point on, in big blinds. Folding is worth 0. |
| Range | range, every hand a player could hold | Every hand a player could hold in a spot, shown as a 13 by 13 grid. |
| Equity | equity, your chance of winning the hand | The share of the pot you win on average when the rest of the cards are dealt out. |
| Preflop | preflop, before the flop | The betting before the first three shared cards, the flop, are dealt. |
| Stack depth | stack depth, big blinds in front of a player | How many big blinds a player has in front of them. |

**Fixed labels.** One label, used word for word everywhere.

| Name | Text | Used in |
|---|---|---|
| CTA-DEMO | Grade a sample hand | header, hero, story, numbers, closing band, mobile bar and menu, 404, product-page heroes, worked example, pop-up 1 title |
| CTA-EARLY | Get early access | both pricing buttons, verdict panel, pop-up 2 title and submit |
| Secondary hero link | See how it works | hero |
| Sample-data chip | Sample data | every screen and every chart with numbers |
| Concept pricing label | Concept pricing | pricing section, plan chip |
| Concept note | Concept site, illustrative prices, nothing is collected or sent. | footer, mobile menu |
| Saved-run disclosure | Saved sample run from the real engine. Live solves can differ slightly. | pop-up 1 footnote, worked example |
| Unit switch | Show amounts in, BB, $ | numbers card, highlights, pop-up 1 |

## Global elements (UX section 2)

### Skip link
- Text: Skip to main content

### Header
- Brand link, accessible name: HandSolved home
- Nav labels, in order: How it works, Coach, Recorder, Pricing
- Nav targets: `#how`, `/gto-hand-review`, `/live-poker-hand-recorder`, `#pricing` (on other pages `/#how` and `/#pricing`)
- Button: Grade a sample hand
- Burger, visible label (below 1024): Menu
- Burger accessible names: Open menu, Close menu

### Mobile menu panel
- Links and button as in the header.
- Note under the button: Concept site, illustrative prices, nothing is collected or sent.

### Mobile bar
- Button: Grade a sample hand

### Footer (reveal footer, every page)
- Closing band H2: Pick a move. See the grade.
- Closing band line: Three sample hands with real engine numbers. It runs in your browser and sends nothing.
- Closing band button: Grade a sample hand
- Closing band text link: See the concept pricing (to `#pricing`, or `/#pricing` elsewhere)
- Link group headings and links
  - Explore: How it works, Highlights, Your numbers, Pricing, FAQ
  - Pages: GTO hand review, Live poker hand recorder
  - Legal: Privacy, Terms
- Oversized wordmark (`aria-hidden`): HandSolved
- Legal row: © 2026 HandSolved
- Concept note: Concept site, illustrative prices, nothing is collected or sent.
- Legal and 404 pages have no closing band. They keep the link groups, the wordmark and the legal row.

### Unit switch (shared)
- Group label: Show amounts in
- Buttons: BB (accessible name BB, big blinds), $ (accessible name $, dollars). The name starts with the visible text, so voice control can say what it sees.
- Polite announcement on change: Amounts now shown in big blinds. / Amounts now shown in dollars.

### Sample-data chip
- Text: Sample data

### No-script lines
- Beside the hero button: Read a worked example (to `/gto-hand-review#worked-example`)
- Beside every other CTA-DEMO: same link, same label.
- Under the pricing buttons: The early-access form needs scripts. This concept site collects nothing either way.

## Home (`/`), UX section 4

Global layer: the page-load veil has no copy (spade mark, `aria-hidden`). Both dialogs sit in the page source. Their copy is in the Pop-up sections below.

### 4.1 Hero

- Kicker (inside the H1): Live poker session tracker and hand recorder
- H1 line: Every hand you play, solved.
  - Line breaks for the condensed face: Every hand / you play, / solved.
  - Kept from the design proof. The subhead, the proof strip and the Engine section tie solved to named things, so the word never stands alone as a promise.
  - Alternate, only if the owner wants no chance of the certainty reading: Every hand you play, graded.
- Subhead: Log your live sessions. Record each hand on a table. Every decision gets graded against GTO, the strategy a poker solver computes.
- Button (CTA-DEMO): Grade a sample hand
- Secondary link: See how it works
- Micro-line: About 20 seconds a hand. Runs in your browser.
- Proof strip, three items
  1. 8-handed preflop charts at 14 stack depths
  2. Flop, turn and river solved with real bet sizes
  3. Every decision graded from 0 to 100
- Proof item help text (tooltip on hover or focus, tap to reveal on touch)
  1. Preflop is the betting before the flop. Stack depth is big blinds in front of a player.
  2. Flop, turn and river are the three rounds of shared cards. Each is solved for the hand's real bet sizes.
  3. The score compares your choice with the best one. 100 is the best.
- Pen mark on the device art: Call {65 bb} (struck out, black), Fold (written in, red). The call follows the switch: Call 65 bb, Call $130.
- Chip on both devices: Sample data
- Floating chip (768 and up): Calling here is worth {value}
  - Bb view: Calling here is worth −62.6 bb
  - Dollar view: Calling here is worth −$125.24 (the same figure the sample hand shows for that call)
- No-script link beside the button: Read a worked example

### 4.2 How it works (`#how`)

- H2: Log it. Coach it. Practice it.
- Lead: Every hand goes through the same three steps. Record it, see it graded, then play the spot again.

**Step 1**
- Label: Log
- Title: Log the session, rebuild the hand
- Body: Start a session with the game, stakes, venue and buy-in. Add notes and rebuys as you play. When a hand matters, rebuild it on a table with the seats, stacks, cards and every action.
- Chips: Live session log / Rebuilt on a table / Notes and rebuys
- Phone callouts: All-ins and side pots / Tap any step to go back
- Link: Record a hand at the table (to `/live-poker-hand-recorder`)

**Step 2**
- Label: Coach
- Title: Every decision graded against GTO
- Body: Every choice gets a score from 0 to 100. See how often GTO takes each option, what each is worth in big blinds (bb, the unit stakes are counted in), and your chance of winning the hand.
- Chips: Score 0 to 100 / Worth of each option / Odds and equity
- Phone callouts: You: Call 65 bb / GTO: Fold 96%
  - The 65 bb in the first callout is a live amount, like the hero chip's: it reads Call $130 in the dollar view. The phone capture beside it stays in big blinds (see the footnote below).
- Link: See how a decision is graded (to `/gto-hand-review`)

**Step 3**
- Label: Practice
- Title: Play the spot again, against GTO
- Body: Replay any hand from the flop, turn or river, or deal random hands against an 8-handed table of GTO opponents. Every decision is graded, so you can compare the second try with the first.
- Chips: Replay from any street / Random hands / Every decision graded
- Phone callouts: Full-screen table / Same runout or a new one
- Link: See what Pro includes (to `#pricing`)

- Footnote: App screens are shown in big blinds. Sample data on every screen.

**Red band at the end of the story** (the design proof's band line)
- Band line: Three of a kind. Still a fold.
- Band sub: Three eights on a board with four cards in a row, facing an all-in. GTO folds 96% of the time.
- Closing line before the button: Pick your move on a sample hand. See the grade.
- Button (CTA-DEMO): Grade a sample hand

### 4.3 Engine (`#engine`)

- H2: What solved means here
- Lead: Two things get solved here and one gets scored. Preflop charts are solved for 8 seats. Flop, turn and river are solved for each hand, with its real bet sizes.

**Counters** (real numbers in the HTML)

| Number | Label | Note |
|---|---|---|
| 14 | stack depths | 8-handed preflop charts, cash and tournament. Depth is your stack in big blinds. |
| 3 | streets solved | Flop, turn and river, solved in the browser with the hand's real bet sizes. |
| 100 | point score | Every decision gets a score and a grade, Best move to Blunder. |

**Plain words** (a short disclosure under the counters; this is where range is defined for non-players)
- Preflop. The betting before the first three shared cards, the flop, are dealt.
- Stack depth. How many big blinds a player has in front of them.
- Range. Every hand a player could hold in a spot.
- Heads-up and 3-way. Two or three players still in the hand.

**Chart figure** (the real 13 by 13 preflop chart in two inks; the source is `docs/site/research/range-chart.json`, numbers checked against it)
- Figure label: A real preflop chart
- Caption: Big blind facing a button open, 100 big blinds, 8-handed. Fold 48.5%, call 38.8%, raise 12.7%.
- How to read it: Each square is a starting hand, with the strongest at the top left. Red is raise, black is call, blank is fold. A square split between colours is a mix. The whole grid is a range, every hand a player could hold in this spot.
- Accessible description (`role="img"`): Thirteen by thirteen chart of starting hands for the big blind facing a button open at 100 big blinds, 8-handed. Red squares raise, black squares call, blank squares fold. The strongest hands at the top left are red. Across all hands the chart folds 48.5%, calls 38.8% and raises 12.7%.
- Tag: Real chart from the engine
- Text equivalent of the cells (a closed disclosure under the caption, on the home page and on the review page; written at build from `src/data/range-chart.json`, so the numbers cannot drift):
  - Summary: View the chart as a list
  - Always raise: the hands that raise every time, in grid order (25 hands)
  - Raise or call: each hand with its shares, for example A8s: raise 34%, call 66%
  - Always call: the hands that call every time (69 hands)
  - Call or fold: each hand with its shares, for example J4s: call 60%, fold 40%
  - Fold: Every other hand

**Grade legend** (five chips, meaning shown as caption or tooltip)

| Chip | Meaning |
|---|---|
| Best move 97+ | Gives up next to nothing |
| Good 80+ | Gives up a little |
| Inaccuracy 55+ | Gives up a noticeable amount |
| Mistake 30+ | Gives up a large amount |
| Blunder under 30 | Gives up a very large amount |

**Good to know** (three items with icons)
- Texas Hold'em only. Omaha and custom spots are not covered.
- You enter hands yourself. There is no online HUD or hand-history import.
- Postflop is heads-up or 3-way. Bigger pots are marked not graded.

- Link: How a decision is graded (to `/gto-hand-review`)

### 4.4 Highlights (`#highlights`)

- H2: Your best hands, and the other ones
- Lead: HandSolved sorts your saved hands by your own ratings and results. Hall of Fame, Wall of Shame, Tilt Tower and Monster Pots fill themselves in.
- Switch label (heading row): Show amounts in
- Caption on the grid: Sample data

Tile text and rows match `desk-highlights.png`. Titles are written in full. Amounts follow the unit switch.

Under 768 px each of the four lists shows its first two rows. The third row is in the page and is hidden by CSS only; there is no disclosure and nothing is reworded. From 768 px every list shows all three rows, and the Hands stat (7) counts all seven hands.

| Tile | Description (from the app) | Margin note (dry line) |
|---|---|---|
| Hall of Fame | Your best-played hands, by your own rating | Frame these. |
| Wall of Shame | Your lowest-rated hands | Every wall needs something on it. |
| Tilt Tower | The hands you were most tilted in | Tallest tilt on top. |
| Monster Pots | The biggest pots you won | The pots you tell people about. |

**Hall of Fame rows**
1. A♥ A♦ K♥ Q♠. Nut flush on the river. 4.8 stars
2. A♠ K♦. Three streets of value with top pair. 4.5 stars
3. 7♠ 6♠. Turned straight against a check-raise. 4.2 stars

**Wall of Shame rows**
1. 8♥ 8♣. Called a river shove with a set on a four-straight board. 1.5 stars
2. K♥ 9♣. Opened K9 offsuit under the gun. 2.2 stars
3. J♣ 10♣. Missed-draw bluff on the river. 2.8 stars

**Tilt Tower rows**
1. 8♥ 8♣. Called a river shove with a set on a four-straight board. Frustrated
2. J♣ 10♣. Missed-draw bluff on the river. Uneasy
3. K♥ 9♣. Opened K9 offsuit under the gun. Uneasy

**Monster Pots rows**
1. A♠ K♦. Three streets of value with top pair. Won {109 bb}, pot {219 bb}
2. A♥ A♦ K♥ Q♠. Nut flush on the river. Won {76 bb}, pot {153 bb}
3. 7♠ 6♠. Turned straight against a check-raise. Won {26 bb}, pot {57 bb}

**Hand insights card**
- Stat labels and values: Hands 7. Net {−73.5 bb}. Avg rating 3.4 stars. Avg tilt 2.1.
- App line, the capture's words with the colon turned into a full stop: Tilt shows up in your results. Tilted hands average {−63 bb}, calm ones {+28.9 bb}.
- Note under the card: Hand results only. Session results are in the next section.

- Optional row button (P2): Grade it. Accessible name: Grade it, {row title}. Only on Wall of Shame row 1 (hand 1), Hall of Fame row 3 (hand 2) and Hall of Fame row 2 (hand 3).
- Chip row: The Painful Ones and Multiway Madness are in there too.
- Plain words, under the chip row: Tilt is when frustration changes how you play. You rate it yourself, from 1 to 5.

### 4.5 Your numbers (`#numbers`)

- H2: Your results, in big blinds or dollars
- Lead: Net profit, hourly, win rate and a bankroll line that draws as you scroll. Flip the switch and every amount on this page changes units.
- Hint: Flip the switch.
- Switch label: Show amounts in
- Card title: Bankroll
- Tile labels and values (sample data)

| Label | Bb view | Dollar view |
|---|---|---|
| Net profit | +733 bb | +$1,466 |
| Hourly | +11 bb/h | +$22/h |
| Win rate | 15.7 bb/100 | $31.40/100 hands |
| Winning sessions | 61% (11 of 18) | 61% (11 of 18) |

- Tile note (small, under the tiles): bb/h is big blinds won per hour. bb/100 is big blinds won per 100 hands.
- Chart title: Bankroll. X axis label: Hours played
- Caption: Sample data from 18 sessions and 67 hours.
- Chart summary (`role="img"`): Bankroll line over 67 hours of play in 18 sessions, ending at {+733 bb}. Sample data.
- Readout format: Session {n}, {h} h, {value}
- Keyboard hint: Use the left and right arrow keys to read each point.
- Table disclosure: View data as a table. Column headers: Session, Hours played, Bankroll.
- Dollar assumption note (small, only in dollar view): Dollar view assumes a $1/$2 table. 1 bb is $2.
- CTA line: That is the tracker half. Now grade a hand.
- Button (CTA-DEMO): Grade a sample hand

### 4.6 Toolbox (`#toolbox`)

- H2: Insights, goals and history
- Lead: Three more screens that read your sessions back to you. All numbers here are sample data.
- Tabs: Insights / Goals / History

| Tab | Panel heading | Panel text | Chips |
|---|---|---|---|
| Insights | What your bankroll is telling you | HandSolved reads your sessions and answers in plain words: whether you are in a downswing, whether your swings are normal for your win rate, and how each month went. Open any card for the full story, down to your hourly rate by stakes, venue, game and session length. | Downswings / Is it normal? / Hourly by venue |
| Goals | Goals measured from your real play | Set goals for hands played, hours, sessions, profit and hands reviewed. Each one tracks your real data, projects your pace and picks what to focus on next. | Pace projection / Focus next / Edit anytime |
| History | Every session, graded A to F | Sessions sit in a list by month, with filters. Each gets a grade from A to F, built from your saved hands, the money won and the hours played. | Grade A to F / Filters / Open a session |

- Equity line: The app also has an equity calculator, your chance of winning, for 2 to 6 hands. It gives exact results when possible.
- Tab list accessible name: Toolbox screens

### 4.7 Your data (`#data`)

- H2: Bring it in, take it out
- Lead: Moving between trackers is normal. HandSolved reads one other tracker's CSV export and saves your own backups and spreadsheets.

| Card | Title | Text |
|---|---|---|
| Import | Bring your history in | Sessions from one other tracker come in from its CSV export. A backup file can go back in on any device. A preview shows what an import will do before it runs. |
| Export | Take it with you | Save a full backup of your sessions with their timelines, your hands and your goals. Or save sessions and hands as spreadsheets for Excel, Numbers or Google Sheets. |
| Use it as an app | Installs from the browser | On iPhone it adds to the Home Screen from Safari. Chrome, Edge and Android show an Install button. It opens full screen. This concept site has nothing to install. |

### 4.1a Showdown (`#showdown`), right after the hero

The source of truth is `src/data/showdown.ts`; the section prints only from it, and this entry mirrors it. The staging is in `SHOWDOWN.md`.

- Kicker: Why HandSolved
- H2: Other poker tools are holding aces.
- Before the flop: Deal the board and see what beats them.
- Dealer button, by street: Deal the flop / Deal the turn / Deal the river
- Hint: Tap any card to read why.
- Each reason's head: its number, then "Reason N of 5" (`copy.reasonWord`, `copy.ofWord`).
- Reason menu (group name "Reasons"): numbered buttons 1 to 5, each showing its card (A♥, 9♣, Q♦, 10♦, A♦); screen readers hear the card and the reason's title too. Carousel control: Pause / Play.
- Race: Other poker tools and HandSolved, with "Chance to win". Pocket aces 82% against King, jack of diamonds 18%; Three aces 84% against Needs a ten 16%; Three aces 18% against A straight 82%; Four aces 0% against Royal flush 100%.
- Street lines (screen readers only, in the status line): Three good reasons. The aces still lead. / A better reason. You just took the lead. / The last ace in the deck gives them four aces, and gives you the only hand that beats it.

| Card | Street | Title | Line |
|---|---|---|---|
| A♥ | Flop | A fair price (tag: Concept pricing) | Logging is free. The coach costs less than the usual solver subscription. |
| 9♣ | Flop | Table or desk | Record a hand with one thumb at the table. Study it on a big screen at home. |
| Q♦ | Flop | It reads your bankroll | Your sessions come back as plain answers. Is this downswing normal? Do your long sessions pay? Open a card and see. |
| 10♦ | Turn | Practice that plays back | Deal full hands against an 8-handed table of GTO opponents, then replay your real hands from any street. |
| A♦ | River | A coach for your real hands | Rebuild the hand you just played. Every decision gets a score from 0 to 100 and the reason behind it. |

Each reason also has an "Other tools" / "HandSolved" pair, shown on a white sheet with its line, and three points that only the no-script list shows. The coach's third point carries the accuracy claim: checked against a full solver on heads-up flops, its main action 98% of the time, 0.28% of the pot given up per decision, with turn, river and 3-way checks still to come.

- Finale headline: HandSolved wins. Menu heading: We win at showdown. Here’s how. (the five rows show number, card and title). Buttons: Grade a sample hand (opens the sample-hand pop-up), Get early access, and Deal it again on a dealer button (D). The score keeps Royal flush 100% against Four aces 0%.
- No competitor is named anywhere in the section.

### 4.8 Pricing (`#pricing`)

- Label above the cards: Concept pricing
- H2: Free to log. Pro to coach.
- Lead: Log your sessions for free. Add the coach and practice for $34 a month, or $27 a month billed yearly.
  - The lead opens with the offer. The concept note stays in the Concept pricing label above the heading and in the note under the cards.
  - The prices are typed once, in `pricing` in `src/data/site.ts`. The yearly total ($324) and the saving ($84) are worked out from them.
- Switch: Monthly / Yearly. Group label: Billing
- Savings chip (Yearly): Save $84 a year

| | Free | Pro |
|---|---|---|
| Featured tag | none | Recommended |
| Price, monthly | $0 /mo | $34 /mo |
| Price, yearly | $0 /mo | $27 /mo |
| Billing line | Nothing to pay | Monthly view: Billed monthly. Yearly view: Billed yearly at $324 |
| Audience line | For players who log their live sessions | For players who want every hand graded |
| Button (CTA-EARLY) | Get early access | Get early access |

**Free bullets**
1. Live session log
2. Hands rebuilt on a poker table
3. Session history, graded A to F
4. Insights, goals and highlights
5. Bankroll chart in bb or dollars
6. Backup and CSV export

**Pro bullets**
1. Everything in Free
2. Every decision graded against GTO
3. Worth of each option in big blinds
4. Pot odds and equity, explained
5. Practice against GTO opponents
6. Replay from flop, turn or river
7. Coach score saved on each hand

- Note under the cards: Concept pricing. This is a concept site, so nothing is charged and nothing is collected.
- Note link: Read the FAQ (to `#faq`)
- No-script price text: Pro is $34/mo, or $27/mo billed yearly. Free is $0.
- Plan chip, copied into pop-up 2
  - Free: Plan: Free, $0 (concept pricing)
  - Pro, monthly: Plan: Pro, $34 a month (concept pricing)
  - Pro, yearly: Plan: Pro, $27 a month, billed yearly (concept pricing)

### 4.9 FAQ (`#faq`)

- H2: Questions, answered first
- Lead: Short answers, with the answer in the first sentence.

Links in answers are real links to the root-relative path shown (SEO.md section 6). Each answer ends with the sentence that carries its link.

1. **What is HandSolved?**
   HandSolved is a live poker session tracker and hand recorder that grades each decision in your Texas Hold’em hands against GTO strategy. You log sessions, rebuild hands on a table and see each decision graded against GTO, the strategy a poker solver computes. It also has a practice table and a bankroll chart.
   - The first sentence is the one-liner in `src/data/site.ts`, word for word. The WebSite and Organization JSON-LD print the same string as their description, so the markup says nothing the page does not show. Open for the copywriter: the second sentence repeats the graded-against-GTO clause and can be trimmed.
2. **What does graded against GTO mean?**
   It means each choice you made is compared with what GTO does in that spot, then scored from 0 to 100. GTO stands for game theory optimal, the strategy a poker solver computes. It is a baseline to compare against and says nothing about how one opponent will play.
3. **Which games and spots does the coach cover?**
   The coach covers Texas Hold'em only. Preflop it uses charts solved for 8 players at the hand's stack depth, for cash games and tournaments. After the flop it solves heads-up and 3-way pots. Omaha and custom spots are not covered, and pots with four or more players after the flop are marked not graded. Read what the coach covers.
   - Link: what the coach covers (to `/gto-hand-review`)
4. **Is it an online HUD, and can it import hand histories from poker sites?**
   No to both. HandSolved is for hands you play live and enter yourself on a table. It does not read hand-history files from online poker sites, and it draws nothing over an online table. It does import its own backups and one other tracker's CSV export. Read about entering a hand at the table.
   - Link: entering a hand at the table (to `/live-poker-hand-recorder`)
5. **Do I need to install anything?**
   No. The sample hands on this page run in your browser, and this concept site has nothing to install. The product itself is built as an installable web app for iPhone, Android and desktop, so it needs no store.
6. **Can I export or import my data?**
   Yes. You can save a full backup file, export sessions and hands as CSV spreadsheets, and import a backup or one other tracker's CSV export. An import shows you what it will do before it runs.
7. **Is this site selling something right now?**
   No. This is a concept site, so prices are illustrative, nothing can be bought and nothing is collected or sent. The early-access form only checks that an address looks like an email, and nothing you type is stored. Two small notes stay in your own browser, local storage for settings and session storage for the page intro. Read the privacy notice and the terms of use.
   - Links: privacy notice (to `/privacy`), terms of use (to `/terms`)

### 4.10 Closing band and reveal footer (`#start`)

Copy is in Global elements, Footer. The closing band is the same on every page that has one.

### SEO, Home

- Title (56 characters): HandSolved | Live Poker Session Tracker & GTO Hand Coach
- Meta description (142 characters): Log live poker sessions, record each hand at the table, and get every decision graded against GTO. Texas Hold'em, heads-up and 3-way postflop.
- Primary keyword: live poker session tracker. Secondary: poker session and hand tracker, poker hand recorder app, GTO coach for poker hands, HandSolved
- H1: the kicker and line above. First paragraph repeats live poker session tracker once, in the subhead's context.
- Social title and description: same as title and meta.
- Social image text (1200 by 630): Every hand you play, solved. Live poker session tracker and hand recorder.
- Social image alt: HandSolved. Every hand you play, solved. A struck-out Call 65 bb with Fold written in red.
- Structured data text: WebSite name HandSolved, alternateName Hand Solved. Organization name HandSolved. No offers, no ratings, no FAQ markup.

## GTO hand review (`/gto-hand-review`), UX section 5.1

### 1. Compact hero
- Breadcrumb: Home / GTO hand review
- H1: GTO hand review for your live poker hands
- Subhead: Rebuild a hand on a table and see each decision graded against GTO, the strategy a poker solver computes. See how often GTO plays every option.
- Button (CTA-DEMO): Grade a sample hand
- Secondary link: See a worked example (to `#worked-example`)
- Chip on devices: Sample data

### 2. Worked example (`#worked-example`)
- H2: A worked example, start to finish
- Intro: This is the first sample hand from the pop-up, written out so you can read it at your own pace.
- Setup line: River, $1/$2. You are in the big blind with 8♥ 8♣. Board 8♦ J♠ 9♠ 2♣ 10♠. Pot 254.5 bb, 65 bb to call.
- Situation: The player on the button raised and you called. The board has four cards in a row, 8, 9, 10 and J, and three spades. You hold three of a kind, which beats 64% of possible hands. You bet the river and they pushed all in.
- Table caption: What GTO does with these cards
- Table headers: Option / GTO plays it / Worth
- Row 1: Fold, 96%, 0 bb
- Row 2: Call 65 bb (tag: You), 4%, −62.6 bb
- Grade sentence: Calling scores Blunder, 6 out of 100. GTO folds 96% of the time, and calling gives up 62.6 bb against folding.
- Button (CTA-DEMO): Grade a sample hand
- Disclosure: Saved sample run from the real engine. Live solves can differ slightly. Amounts in big blinds.

### 3. How a decision gets graded
- H2: How a decision gets graded
- Step 1. Label: Solve. Title: Solve the spot. Body: Before the flop, the coach reads charts solved for 8 players at your stack depth. After the flop, each street is solved from the hands each player could still hold, heads-up or 3-way, at the hand's real bet sizes.
- Step 2. Label: Compare. Title: Compare every option. Body: Your choice is set beside every option. The coach shows how often GTO plays each one and what each is worth in big blinds, plus the price the pot offers and your equity, your chance of winning the hand.
- Step 3. Label: Grade. Title: Score the choice. Body: The value your choice gives up against the best option, measured against the size of the pot, becomes a score from 0 to 100. Giving up little scores high. Giving up a large share scores low.
- Legend chips: Best move 97+ / Good 80+ / Inaccuracy 55+ / Mistake 30+ / Blunder under 30 (meanings as in Home, Engine)
- Sub-heading: What the grade means
- Text: Every choice has an average result if the same spot came up many times. GTO, the strategy a poker solver computes, puts a number on each option, in big blinds. The grade compares your choice with the best one. The less yours gives up, compared with the size of the pot, the higher the score, from 0 to 100. The grade judges the choice, so how the hand turned out has no effect on it.

### 4. What you see for each decision
- H2: What you see for each decision
- Tile 1. Title: How often GTO plays each option. Text: A bar and a percentage for every option, so strategies that mix two or three plays show as mixes.
- Tile 2. Title: What each option is worth. Text: Each choice's average result in big blinds, with folding as zero. See how far yours sits from the best.
- Tile 3. Title: Pot odds and equity. Text: The equity you need to break even, next to your equity, your chance of winning the hand.
- Tile 4. Title: Range grids. Text: A 13 by 13 grid of the hands each player could hold, so you see what you faced.
- Large tile caption: Coach verdict for the sample hand. Sample data.
- Range grids tile: the same closed disclosure as the home chart, View the chart as a list, under the caption (copy in Home, Engine).

### 5. Limits
- H2: Limits, stated plainly
- Chips: Texas Hold'em only / Heads-up or 3-way postflop / You enter the hands / Bigger pots marked not graded
- Paragraph: The coach covers Texas Hold'em. After the flop it solves pots with two or three players, and larger pots are marked not graded. It assumes everyone plays GTO, counts chips as chips (no rake, no tournament payouts) and gives values as estimates. When stacks were not recorded, the review lists what it assumed.

### 6. FAQ
- H2: Questions about GTO hand review
1. **Can I grade online hands?**
   No. HandSolved grades hands you enter yourself on a table, such as hands from your live sessions. It does not read hand-history files from online poker sites.
2. **Does it work for Omaha?**
   No. The coach covers Texas Hold'em only, so Omaha is not graded. Preflop it uses 8-handed charts, and after the flop it solves heads-up and 3-way pots.
3. **What if I did not record the stacks?**
   The coach makes assumptions and lists them. It rebuilds the hand from the action log, fills in the missing stacks, and shows what it assumed at the top of the review, so you can judge how much to trust the grade.
4. **What is a blunder?**
   A blunder is a choice that scores below 30 out of 100. It gives up a very large share of the pot compared with the best option. In the sample hand, calling 65 bb scores 6 and gives up 62.6 bb.

### 7. Related links and closing band
- Link 1: Record a hand at the table (to `/live-poker-hand-recorder`)
- Link 2: See the concept pricing (to `/#pricing`)
- Closing band and footer as in Global elements.

### SEO, GTO hand review
- Title: GTO Hand Review for Live Poker Hands | HandSolved
- Meta description: Record a hand and see how often GTO takes each option, what each is worth, plus pot odds and equity. Texas Hold'em, heads-up and 3-way postflop.
- Primary keyword: GTO hand review. Secondary: grade my poker hand against GTO, GTO hand review for live poker, review poker hands with GTO
- Social title and description: same as title and meta.
- Social image text: GTO hand review. Call 65 bb struck out, Fold written in red.
- Social image alt: HandSolved GTO hand review. A struck-out Call 65 bb with Fold written in red.
- Breadcrumb labels: Home, GTO hand review

## Live poker hand recorder (`/live-poker-hand-recorder`), UX section 5.2

### 1. Compact hero
- Breadcrumb: Home / Live poker hand recorder
- H1: Live poker hand recorder, one action at a time
- Subhead: Seat the players, set the stacks, pick the cards you know, then answer each action street by street. All-ins and side pots are handled for you.
- Button (CTA-DEMO): Grade a sample hand
- Secondary link: See the three steps (to `#steps`)
- Note under the buttons: Recording happens in the app. This sample shows what you get back, the grade.
- Chip on the phone: Sample data

### 2. Recording in three steps (`#steps`)
- H2: Record it. Review it. Coach it.
- Step 1. Label: Record. Title: Rebuild the hand on a table. Body: Seat yourself and the other players. Set each stack as an exact amount or as Short, Average, Big or Huge. Pick the cards you know, then answer each action in turn.
- Step 2. Label: Review. Title: Replay it street by street. Body: Replay the hand street by street. Your cards show face up, the other players' stay face down unless they showed, and all-ins are highlighted. Add a verdict, a star rating, your tilt and notes.
- Step 3. Label: Coach. Title: Grade it with one tap. Body: Tap the Coach button on any Hold'em hand to grade it. You see how often GTO plays each option and what each is worth. The score is saved onto the hand.
- Link on step 3: How the coach grades it (to `/gto-hand-review`). The related link below the FAQ keeps See how a hand is graded, so the two anchors differ.
- Phone callouts (desktop only; one line of text below 768): Dealer button on the felt / Hand so far, tap to go back / Coach button on every hand

### 3. Details
- H2: The details, handled
- Tile 1. Title: Side pots, handled. Text: All-ins and side pots are handled when you record the action.
- Tile 2. Title: Stacks your way. Text: Type an exact stack, or pick Short, Average, Big or Huge.
- Tile 3. Title: Go back any time. Text: Tap any step in the Hand so far list to return to it.
- Tile 4. Title: Edit anything afterwards. Text: Change a hand's cards, board, result or tags, or reopen its action in the recorder.
- Tile 5. Title: Swipe to edit or delete. Text: Swipe a hand left in the list for Edit and Delete. An Undo bar catches slips.

### 4. The whole session
- H2: The whole session, in one place
- Text: A hand lives inside a session. Log the game, stakes, venue and buy-in, add notes and rebuys as you play, then finish with a cash-out, a star rating and a tilt score from 1 to 5. History grades each session A to F.

### 5. FAQ
- H2: Questions about recording hands
1. **What do I need to record a hand?**
   You need each player's seat, each stack and the actions in order. Stacks can be an exact amount or Short, Average, Big or Huge. Pick the cards you know, and answer each player's action turn by turn.
2. **What if I do not know the stacks?**
   Pick Short, Average, Big or Huge for any stack you do not know. A hand without stacks is rebuilt from the action log, and the review lists what was assumed.
3. **Can I import online hand histories?**
   No. HandSolved is for hands you play live and enter yourself. It does not read hand-history files from online poker sites. It does import its own backups and one other tracker's CSV export.
4. **Does it work on iPhone and Android?**
   Yes, the product is built as a web app with phone, tablet and desktop layouts. On iPhone it adds to the Home Screen from Safari, and Chrome, Edge and Android show an Install button. This concept site has nothing to install.

### 6. Related links and closing band
- Link 1: See how a hand is graded (to `/gto-hand-review`)
- Link 2: See the concept pricing (to `/#pricing`)
- Closing band and footer as in Global elements.

### SEO, Live poker hand recorder
- Title: Live Poker Hand Recorder, Street by Street | HandSolved
- Meta description: Rebuild any hand on a poker table. Seat the players, set stacks, pick cards, then answer each action street by street. All-ins and side pots handled.
- Primary keyword: live poker hand recorder. Secondary: record poker hands at the table, poker hand recorder app, poker hand replayer
- Social title and description: same as title and meta.
- Social image text: Live poker hand recorder. One action at a time.
- Social image alt: HandSolved live poker hand recorder on a phone, showing an empty poker table with seats, a dealer button and board slots.
- Breadcrumb labels: Home, Live poker hand recorder

## Privacy (`/privacy`), UX section 5.3

Plain-words draft for the owner to review. It is not legal advice. It matches how the build is specified: no analytics, no cookies, no third-party requests, two browser-only settings.

- Breadcrumb: Home / Privacy
- H1: Privacy
- Last updated: 1 November 2026
- Summary box: HandSolved is a concept site. It collects nothing and sends nothing. Small notes stay in your own browser, local storage for settings such as big blinds or dollars and session storage so the page intro plays once a visit. Nothing you type is stored.
- Table of contents label: On this page

**What this site is**
HandSolved is a concept site. It shows a poker tracking and coaching product for a portfolio. It is not a live service, and it has no accounts and no purchases.

**What it collects**
Nothing. The site's own code sets no cookies and runs no analytics, ads or trackers. It loads no scripts, fonts or embeds from other sites, so every file comes from the same place as the page.

**What stays in your browser**
Local storage keeps a note in your browser until you clear it. HandSolved uses it to remember settings, such as whether you chose big blinds or dollars.
Session storage keeps a note only until you close the tab. HandSolved uses it so the short opening animation on the home page plays once a visit and not on every page.
Both stay on your device. They are never sent anywhere, and neither holds anything you type. You can clear them in your browser settings.

**The early-access box**
The pop-up checks that what you type looks like an email address. The check runs in your browser. The address is not sent, saved or logged. It is shown back to you on the last step and cleared when you close the box.

**Server logs**
The server that delivers these pages may keep ordinary access logs, such as the time of a request and the page asked for. This site does not read those logs and does not control them.

**Contact**
This concept site has no contact form and no contact address, because it collects nothing.

**If this changes**
If this site ever starts collecting anything, this page and the concept note in the footer change first.

**Not legal advice**
This page describes in plain words how this concept site behaves. It is not legal advice, and it is not the privacy policy of a real business.

- Closing link: Back to home (to `/`)
- Title: Privacy | HandSolved
- Meta description: HandSolved is a concept site. It collects and sends nothing. See the two small notes it keeps in your own browser and what the pop-ups do.
- Social title and description: same. Social image text: Privacy. Nothing is collected.

## Terms (`/terms`), UX section 5.3

Plain-words draft for the owner to review. It is not legal advice.

- Breadcrumb: Home / Terms
- H1: Terms
- Last updated: 1 November 2026
- Summary box: HandSolved is a concept site. Prices are illustrative and nothing can be bought. Sample hands and numbers are saved examples and do not show real results. Solver output here is for study and is not advice.
- Table of contents label: On this page

**What this site is**
HandSolved is a concept site that shows a poker tracking and coaching product. It was made for a portfolio. It may change or go offline at any time.

**No purchases**
Prices and plans are illustrative. Nothing here can be bought, reserved or charged, and the early-access form does not register anyone for anything.

**Sample data**
Every hand, number, grade and chart on this site is sample data or a saved run of the real engine. None of it belongs to a real player. Live solves can differ slightly from the saved runs.

**For study only**
GTO is a baseline to study. Nothing on this site promises winnings, and poker carries a risk of loss. Grades are estimates inside a simplified game. They are not financial, legal or gambling advice.

**No gambling here**
This site has no real-money play, no games of chance and no wagering.

**Names**
HandSolved is a concept name. Other product names that appear, such as Safari, Chrome, Excel and Google Sheets, belong to their owners.

**Using this site**
You can read the pages and use the pop-ups as you like.

**As is**
The pages are provided as they are. No promise is made that they are complete, correct or always available.

**Changes and contact**
These terms may change, and the date at the top shows the last update. This concept site has no contact address.

**Not legal advice**
This page is written in plain words for a concept site. It is not legal advice.

- Closing link: Back to home (to `/`)
- Title: Terms | HandSolved
- Meta description: Terms for the HandSolved concept site. Prices are illustrative, nothing can be bought, and sample hands and numbers are not real results.
- Social title and description: same. Social image text: Terms. Concept site, illustrative prices.

## 404, UX section 5.4

- Status: HTTP 404, `noindex`
- H1: This page folded.
- Sentence: Nothing lives at this address. Pick a real page below, or grade a sample hand.
- Links: Home / GTO hand review / Live poker hand recorder
- Button (CTA-DEMO): Grade a sample hand
- Illustration: a folded card, decorative, empty alt
- Title: Page not found | HandSolved
- Meta description: This page does not exist. Go back to the HandSolved home page, the GTO hand review or the live poker hand recorder.

## Pop-up 1: sample hand (`#dlg-sample`), UX section 6.1

Source rule. Every hand, number and grade below comes from `docs/site/research/demo-spots.json` and nothing else. Amounts there are dollars. Big blinds are dollars divided by that hand's `bigBlindDollars`, rounded half up to one decimal. No number and no grade was changed or written by hand.

### Shell and shared copy

- Dialog title (CTA-DEMO): Grade a sample hand
- Progress: Hand {n} of 3. Dot labels: Hand 1, Hand 2, Hand 3
- Unit switch: Show amounts in. BB (Big blinds). $ (Dollars)
- Close button accessible name: Close
- What you're looking at (open on hand 1 on screens at least 768 wide and 700 tall; closed on phones and shorter screens, where it stays one tap away): You are one player at an 8-seat poker table. Each hand stops at one decision. Pick what you would do, then see what GTO does, how often, and what each choice is worth. Your pick gets a grade.
- Same block, collapsed (hands 2 and 3): What am I looking at?
- Glossary summary: What do these words mean?
  - GTO. Game theory optimal, the strategy a poker solver computes. Use it as a baseline to compare your play with.
  - bb. Big blind, the forced bet that sets the stakes. At $1/$2 it is $2. Amounts are counted in big blinds, and the BB/$ switch shows dollars.
  - Worth. The average result of a choice from this point on, in big blinds. Folding is worth 0.
- Grade explainer (disclosure) summary: What the grade means
  - Text: Every choice has an average result if the same spot came up many times. GTO, the strategy a poker solver computes, puts a number on each option, in big blinds. The grade compares your choice with the best one. The less yours gives up, compared with the size of the pot, the higher the score, from 0 to 100. The grade judges the choice, so how the hand turned out has no effect on it.
  - Scale: Best move 97 and up. Good 80 and up. Inaccuracy 55 and up. Mistake 30 and up. Blunder below 30.
  - Note on percentages: Percentages are rounded, so 0% can mean a hair above zero.
- Default question: What do you do?
- Hint above the buttons: Pick one. You can try the others afterwards.
- Order of the choose view: heading, setup line, question, hint, buttons, then the story disclosure. The decision comes first; the setup line already names your cards, the board, the pot and the bet.
- Story disclosure (under the buttons; closed under 768 wide, open from 1024): summary How the hand got here. It holds each hand's Hand strength and Story, as written for each hand below.
- Cue (a button, only while the first answer is not fully in view; it leaves once the answers are on screen): Pick your move, with a down arrow icon. It scrolls the answers into view. It is not in the Tab order or the accessibility tree, because the answers are the next stop anyway.
- Action sublabels, always visible
  - Fold: Give up the hand
  - Check: Pass, no bet
  - Call: Match the bet
  - Bet: {share}% of the pot (for example 33% of the pot)
  - Raise: Increase the bet
  - All in: Bet everything
- Verdict view labels: You / GTO / Option / GTO plays it / Worth / Pot / To call / Equity needed / Your equity / Given up
- What-if hint: Tap any option to see how it would have graded.
- What-if announcement (polite): Showing {option}. {Grade}. GTO plays it {freq} percent of the time.
- Buttons, hands 1 and 2: Deal next hand (primary), Get early access (secondary)
- Buttons, hand 3: Get early access (primary), Start over (secondary)
- Set-complete line, hand 3: That is all three hands. The early-access form checks an address and sends nothing.
- Footnote: Saved sample run from the real engine. Live solves can differ slightly. Amounts in {big blinds or dollars}. On screens under 700 px tall the choose view hides it, to leave room for the first answer, and the verdict shows it.
- Data error (12 to 20 words): This sample hand could not load. Close this box and reopen it, or read how a hand is graded.
  - Link: See how it works (to `#how`). Button: Close.

### Grades: chip, margin note and verdict template

The verdict line is built from the option's own grade, score, frequency, worth and given-up amount. Tokens: `{option}` the option label, `{freq}` its frequency, `{score}` its score, `{value}` its worth (signed), `{best}` the label of the option marked best, `{given_up}` the amount it gives up against the best.

| Grade | Chip | Margin note (under the chip) | Verdict template (15 to 28 words) |
|---|---|---|---|
| Best move | Best move {score} | Nothing to cross out. | Best move, {score} out of 100. GTO plays {option} {freq}% of the time. It is worth {value} and gives up nothing. |
| Good | Good {score} | A tick in the margin. | Good, {score} out of 100. GTO plays {option} {freq}% of the time. It is worth {value}. Against {best}, that gives up {given_up}. |
| Inaccuracy | Inaccuracy {score} | A small note in the margin. | Inaccuracy, {score} out of 100. GTO plays {option} {freq}% of the time. It is worth {value}. Against {best}, that gives up {given_up}. |
| Mistake | Mistake {score} | Circled in red. | Mistake, {score} out of 100. GTO plays {option} {freq}% of the time. It is worth {value}. Against {best}, that gives up {given_up}. |
| Blunder | Blunder {score} | Struck out, better play written in. | Blunder, {score} out of 100. GTO plays {option} {freq}% of the time. It is worth {value}. Against {best}, that gives up {given_up}. |

Verdict heading (the focus target, read once): {Grade}, {score} out of 100. No option in these three hands lands on Mistake. The template is for the legend and for any later hand.

### Hand 1 of 3 (`set-on-four-straight`, hand h2, stakes $1/$2, 1 bb = $2)

- Heading: Hand 1 of 3, river
- Setup: River, $1/$2. You are in the big blind with 8♥ 8♣. Board 8♦ J♠ 9♠ 2♣ 10♠. Pot {254.5 bb}, {65 bb} to call.
- Hand strength: Three of a kind, medium. It beats 64% of possible hands.
- Story: The player on the button, the dealer seat, raised before the flop and you called from the big blind. You check-raised the flop (passed, then raised their bet) and bet the turn, and they called both. After your river bet, they pushed all their chips in.
- Question: Call {65 bb}, or fold?
- Table scene alt: Poker table with 8 seats. You sit in the big blind holding the 8 of hearts and 8 of clubs. The board shows the 8 of diamonds, jack of spades, 9 of spades, 2 of clubs and 10 of spades. The button player has pushed all in. Pot {254.5 bb}, {65 bb} to call.
- Stat tiles: Pot {254.5 bb} ($509). To call {65 bb} ($130). Equity needed 20%. Your equity 1%.

| Option (button label, sublabel) | GTO plays it | Worth (bb, $) | Grade | Given up (bb, $) |
|---|---|---|---|---|
| Fold, Give up the hand | 96% | 0 bb, $0 | Best move 100 | 0 |
| Call 65 bb ($130), Match the bet | 4% | −62.6 bb, −$125.24 | Blunder 6 | 62.6 bb, $125.24 |

Verdict lines (bb view)
- Fold: Best move, 100 out of 100. GTO plays Fold 96% of the time. It is worth 0 bb and gives up nothing.
- Call 65 bb: Blunder, 6 out of 100. GTO plays Call 65 bb 4% of the time. It is worth −62.6 bb. Against Fold, that gives up 62.6 bb.

Bullets (from the engine's own notes, numbers kept)
1. This river was solved heads-up from the hands both players could still hold, using the real bet sizes.
2. Calling puts 65 bb into a final pot of 319.5 bb. To break even you must win 20% of the time, and you win about 1%.
3. GTO plays Fold 96% of the time. Calling gives up about 62.6 bb against folding.

### Hand 2 of 3 (`straight-check-raised`, hand h4, stakes $0.50/$1, 1 bb = $1)

- Heading: Hand 2 of 3, turn
- Setup: Turn, $0.50/$1. You are in the small blind with 7♠ 6♠. Board 5♠ 8♣ K♦ 4♥. Pot {38 bb}, {14 bb} to call.
- Hand strength: A straight, near the best possible hand.
- Story: You raised from the small blind and the big blind called. You bet the flop and they called. The turn gave you a straight, five cards in a row from 4 to 8. You bet again, and now the big blind raises to {21 bb}.
- Question: Fold, call, or raise?
- Table scene alt: Poker table with 8 seats. You sit in the small blind holding the 7 of spades and 6 of spades. The board shows the 5 of spades, 8 of clubs, king of diamonds and 4 of hearts. The big blind has raised to {21 bb}. Pot {38 bb}, {14 bb} to call.
- Stat tiles: Pot {38 bb} ($38). To call {14 bb} ($14). Equity needed 27%. Your equity 91%.

| Option (button label, sublabel) | GTO plays it | Worth (bb, $) | Grade | Given up (bb, $) |
|---|---|---|---|---|
| Fold, Give up the hand | 0% | 0 bb, $0 | Blunder 0 | 52.7 bb, $52.68 |
| Call 14 bb ($14), Match the bet | 38% | +51.1 bb, +$51.13 | Good 85 | 1.6 bb, $1.55 |
| Raise to 49 bb ($49), Increase the bet | 62% | +52.7 bb, +$52.68 | Best move 100 | 0 |
| All in 94 bb ($94), Bet everything | 0% | +50.2 bb, +$50.23 | Inaccuracy 75 | 2.5 bb, $2.45 |

Verdict lines (bb view)
- Fold: Blunder, 0 out of 100. GTO plays Fold 0% of the time. It is worth 0 bb. Against Raise to 49 bb, that gives up 52.7 bb.
- Call 14 bb: Good, 85 out of 100. GTO plays Call 14 bb 38% of the time. It is worth +51.1 bb. Against Raise to 49 bb, that gives up 1.6 bb.
- Raise to 49 bb: Best move, 100 out of 100. GTO plays Raise to 49 bb 62% of the time. It is worth +52.7 bb and gives up nothing.
- All in 94 bb: Inaccuracy, 75 out of 100. GTO plays All in 94 bb 0% of the time. It is worth +50.2 bb. Against Raise to 49 bb, that gives up 2.5 bb.

Bullets
1. This turn was solved heads-up from the hands both players could still hold, using the real bet sizes.
2. Calling puts 14 bb into a final pot of 52 bb. To break even you must win 27% of the time, and you win about 91%.
3. GTO raises to 49 bb 62% of the time and calls 14 bb 38%. It rarely uses an all-in size, which gives up 2.5 bb.

### Hand 3 of 3 (`top-pair-river-value`, hand h1, stakes $1/$2, 1 bb = $2)

The file holds this spot on the river, so the UX suggestion of a flop is not used. Five options, shown smallest to largest.

- Heading: Hand 3 of 3, river
- Setup: River, $1/$2. You are on the button with A♠ K♦. Board K♥ 7♣ 2♦ Q♠ 3♥. Pot {98.5 bb}, nothing to call.
- Hand strength: A pair of kings, very strong. It beats 90% of possible hands.
- Story: A player raised and you raised again from the button. They called. You bet the flop and the turn with a pair of kings, the top pair on the board, and they called both. The river is a harmless card, and they check to you.
- Question: Check, or bet how much?
- Table scene alt: Poker table with 8 seats. You sit on the button holding the ace of spades and king of diamonds. The board shows the king of hearts, 7 of clubs, 2 of diamonds, queen of spades and 3 of hearts. The cutoff has checked to you. Pot {98.5 bb}, nothing to call.
- Stat tiles: Pot {98.5 bb} ($197). Your equity 89%. No To call and no Equity needed tile, because nothing is bet.

| Option (button label, sublabel) | GTO plays it | Worth (bb, $) | Grade | Given up (bb, $) |
|---|---|---|---|---|
| Check, Pass, no bet | 0% | +87.5 bb, +$175.07 | Blunder 28 | 15.9 bb, $31.85 |
| Bet 32.5 bb ($65.02), 33% of the pot | 0% | +99.9 bb, +$199.84 | Inaccuracy 78 | 3.5 bb, $7.08 |
| Bet 60 bb ($120), 61% of the pot | 9% | +103.2 bb, +$206.39 | Good 96 | 0.3 bb, $0.53 |
| Bet 73.9 bb ($147.76), 75% of the pot | 75% | +103.5 bb, +$206.92 | Best move 100 | 0 |
| All in 151.5 bb ($303), Bet everything | 16% | +103.2 bb, +$206.39 | Good 96 | 0.3 bb, $0.53 |

Verdict lines (bb view)
- Check: Blunder, 28 out of 100. GTO plays Check 0% of the time. It is worth +87.5 bb. Against Bet 73.9 bb, that gives up 15.9 bb.
- Bet 32.5 bb: Inaccuracy, 78 out of 100. GTO plays Bet 32.5 bb 0% of the time. It is worth +99.9 bb. Against Bet 73.9 bb, that gives up 3.5 bb.
- Bet 60 bb: Good, 96 out of 100. GTO plays Bet 60 bb 9% of the time. It is worth +103.2 bb. Against Bet 73.9 bb, that gives up 0.3 bb.
- Bet 73.9 bb: Best move, 100 out of 100. GTO plays Bet 73.9 bb 75% of the time. It is worth +103.5 bb and gives up nothing.
- All in 151.5 bb: Good, 96 out of 100. GTO plays All in 151.5 bb 16% of the time. It is worth +103.2 bb. Against Bet 73.9 bb, that gives up 0.3 bb.

Bullets
1. This river was solved heads-up from the hands both players could still hold, using the real bet sizes.
2. GTO mixes three bets here. It bets 73.9 bb 75% of the time, goes all in for 151.5 bb 16%, and bets 60 bb 9%.
3. This is a close spot. Going all in is worth almost the same as the main bet, and you win about 89% of the time.

## Pop-up 2: early access (`#dlg-early`), UX section 6.2

Nothing is sent, stored or logged. The address lives in page memory only, to show the success step, and is cleared when the box closes.

- Title: Get early access
- Plan chip (only when opened from a pricing button), read-only text
  - Plan: Free, $0 (concept pricing)
  - Plan: Pro, $34 a month (concept pricing)
  - Plan: Pro, $27 a month, billed yearly (concept pricing)
- Field label (always visible, above the field): Email
- Placeholder (an example, never the label): name@example.com
- Help text (always visible, under the field): This is a concept site. The form checks the address format and sends nothing.
- Submit button (CTA-EARLY): Get early access
- Close button accessible name: Close
- Valid-before-submit check icon: decorative, no text

**Validation messages.** Each one is tied to the field with `aria-describedby`. After a failed submit the message is announced once (`role="alert"`). Messages that appear while typing are not announced.

| Case (rule from UX 6.2) | Message |
|---|---|
| Empty | Enter your email address. |
| No @ | Add an @, like name@example.com. |
| More than one @ | Use only one @, like name@example.com. |
| Nothing before the @ | Add the part before the @, like name@example.com. |
| Part before the @ longer than 64 characters | The part before the @ is too long. The limit is 64 characters. |
| Dot first, last or doubled, before or after the @ | Check the dots. They cannot start, end or repeat. |
| Nothing after the @, or no dot after it | Add the part after the @, like example.com. |
| A domain name that starts or ends with a hyphen, or runs past 63 characters | Check the part after the @. Names there cannot start or end with a hyphen, or run past 63 characters. |
| Last part shorter than 2 letters | Finish with a real ending, at least two letters after the last dot, like .com. |
| Space or character outside the allowed set | Remove spaces and special characters. |
| Longer than 254 characters | That address is too long. The limit is 254 characters. |
| Typo hint (soft, never blocks, announced politely) | Did you mean {local}@gmail.com? Button: Use this (accessible name: Use {suggestion}) |

The typo hint offers gmail.com, outlook.com, hotmail.com, yahoo.com, icloud.com or proton.me when the domain is within 2 edits of one of them. {local} is the part the visitor already typed before the @.

**Success step** (replaces the form)
- H2: Address checked. Nothing was sent.
- Body: This is a concept site. Prices are illustrative, and nothing is collected or sent. Your address was checked in this browser tab and is cleared when you close this box. This sentence is the concept note for the step, so the grey one-line note is not repeated under it.
- Address line: the address, in text, with no label. The H2 already says Address checked.
- Primary button: Back to the site
- Secondary button: Grade another sample hand
- Check ring: decorative

## Alt text for every device screen slot

Every screen carries the Sample data chip. Alt text says Sample data wherever the screen shows numbers, and Sample screen where it shows none. Captures come from `showcase/app/final/`. Recaptured on 2026-11-04 from the app's 0.6.0 (commit 5396075, the black and crimson redesign) in a renamed scratch copy with its own seeded sample data, phones at 390 x 844 @3x and desktops at 1440 x 900 @2x. In 0.6.0 the coach shows letter grades (A to F, from the same 0 to 100 score inside) and Insights is a set of cards that open into detail sheets; the Leaks and strengths panel is gone. Amounts are in big blinds, as the captures show them.

Each alt is 8 to 20 words (SEO.md section 8): what the screen is, then the one figure that matters. The rest of each screen's facts is in the nearby text or tile. No two images on a page share an alt, so a screen used twice on a page has a second sentence, marked "second use" below. The words are in `src/data/screens.ts` and, for the second uses, in the page's own markup.

| Slot | File | Alt text | Sample data |
|---|---|---|---|
| Home hero desktop frame. Review page hero | `desk-coach-top.png` | Coach report on a desktop: graded F, Poor, with 72.69 big blinds given up to GTO. Sample data. | yes |
| Home hero phone frame. Review page hero (phone alone, under 768) | `phone-coach-score.png` | HandSolved coach report on a phone: the hand is graded F, Poor, with 6 decisions reviewed. Sample data. | yes |
| Review page hero, the small phone beside the laptop (second use) | `phone-coach-score.png` | The same coach report on a phone, with a result of minus 160 big blinds over 6 decisions. Sample data. | yes |
| Story step Log. Recorder page hero | `phone-recorder.png` | Add hand screen on a phone: an empty poker table with seats, a dealer button and board slots. Sample screen. | no |
| Recorder page Record step (second use) | `phone-recorder.png` | The same Add hand screen: seats around the felt, and a setup panel asking what game it was. Sample screen. | no |
| Story step Coach. Review page worked example. Recorder page Coach step | `phone-coach-decision.png` | Coach verdict on a phone: GTO folds 96 percent, and calling 65 bb is graded Blunder, F. Sample data. | yes |
| Home red band (second use) | `phone-coach-decision.png` | River decision on a phone: calling is worth minus 60.8 big blinds, and GTO folds 96 percent. Sample data. | yes |
| Story step Practice | `phone-practice.png` | Full-screen practice table on a phone: the flop, a 20 big blind pot and three action buttons. Sample data. | yes |
| Toolbox tab Insights, phone | `phone-insights.png` | Insights on a phone: no downswing, swings rated very normal, and plus 360 big blinds in September. Sample data. | yes |
| Toolbox tab Insights, desktop (1024 and up) | `desk-insights.png` | Insights on a desktop: no downswing, swings rated very normal, 18 sessions and 67 hours played. Sample data. | yes |
| Toolbox tab Goals | `phone-goals.png` | Goals on a phone: 0 of 4 on track, and a volume goal at 4,683 of 20,000 hands. Sample data. | yes |
| Toolbox tab History. Recorder page session row | `phone-history.png` | Game history on a phone: 18 sessions, 11 winning, net plus 733 big blinds in 66.8 hours. Sample data. | yes |
| Recorder page Review step | `phone-review.png` | Hand review on a phone: a 219 big blind pot, result plus 109, and a Coach review button. Sample data. | yes |
| Not used. It prints 62.5 bb, a number the demo contradicts | `desk-coach-decision.png` | None. If it is recaptured and used, write 8 to 20 words from the screen and end with Sample data. | yes |

Not embedded in v1: `desk-highlights.png`, `phone-highlights.png`, `desk-home.png`, `phone-home.png`, `phone-bankroll.png`, `phone-hands.png`, `desk-practice.png`. They are the source for the live highlights tiles and the numbers card. They are parked in `showcase/app/unused/`, outside `src/assets/screens/`, because every PNG in that folder is published at full size. If one is embedded later, move it back, add its entry to `src/data/screens.ts`, and write its alt from the screen in 8 to 20 words, marked Sample data.

Graphics with text in place of alt
- Range chart. The accessible description is in Home, Engine.
- Bankroll chart. The summary and table are in Home, Your numbers.
- Table scenes. The alt text for each hand is in Pop-up 1.

Decorative, empty alt and `aria-hidden`: hero backdrop, lattice bands, suit pips, spade mark in the page-load veil, footer card back and oversized wordmark, section icons, check rings, the folded card on the 404 page, sheet drag handles.

## Price notes (NOT FOR PUBLICATION)

This part is for the owner and the team. Never paste any of it onto the site, into a meta tag or into structured data.

**Approved price set** (owner instruction of 2026-11-01, made up on purpose, nothing else invented)

| Plan | Price | Adds |
|---|---|---|
| Free | $0 | Session logging and tracking |
| Pro | $34 a month, or $27 a month billed yearly ($324 a year) | The coach and practice |

**Anchor.** GTO Wizard Starter, the fair floor for the GTO review layer (`messaging.md` section 5.4). $49 a month on monthly billing, $39 a month on annual billing, which is $468 a year (derived). Source `messaging.md` section 5.1, retrieved 2026-11-01. Starter is the best-verified tier: $39 is on the official blog, and $49 is on PokerNews and the older official help page. PokerNews has a discount relationship with that vendor, so treat its table as promotional.

**Math**
- Monthly billing: 49 × 0.70 = 34.30, rounded down to $34. That is 30.6% below $49.
- Annual billing, per month: 39 × 0.70 = 27.30, rounded down to $27. That is 30.8% below $39.
- Annual total: 27 × 12 = $324, against 39 × 12 = $468. That is 30.8% below.
- All three stay at least 30% under the anchor.
- Yearly saving shown on the page: 34 × 12 = $408 on monthly billing, 408 − 324 = $84 a year. That compares the two HandSolved prices only.

**What stays off the site.** Any competitor name, any comparison, any 30% claim, any price in a title, meta description or structured data (no Offer markup). The only price signal is the visible Concept pricing label, the pricing lead and note, the plan chip, the footer note and the success step.

**Limits of the anchor.** One vendor, one tier. Vendor prices move: other tiers rose in March 2026, and an Ultra early-bird price ended on 15 October 2026. No currency code is given in the sources, and the sources do not say whether annual plans are billed up front. The set is illustrative.

**Feature gating is illustrative.** Every bullet maps to a line in the app README.

| Plan bullet | README line |
|---|---|
| Free: Live session log | Log session (live) |
| Free: Hands rebuilt on a poker table | Add hand |
| Free: Session history, graded A to F | Session history, Game history (on Free the grade rests on your own ratings) |
| Free: Insights, goals and highlights | Insights, Goals, Highlights |
| Free: Bankroll chart in bb or dollars | Bankroll chart, Big blinds or dollars |
| Free: Backup and CSV export | Import and export (Profile) |
| Pro: Every decision graded against GTO | Coach |
| Pro: Worth of each option in big blinds | Coach (how often GTO takes each option and what each is worth) |
| Pro: Pot odds and equity, explained | Coach (pot odds, equity against their ranges) |
| Pro: Practice against GTO opponents | Practice |
| Pro: Replay from flop, turn or river | Replay a hand |
| Pro: Coach score saved on each hand | Hand review (the score is saved onto the hand) |

The equity calculator is in the README but sits in neither plan list. It appears only in the Toolbox line.

## Builder notes and open items (NOT FOR PUBLICATION)

**For the builder**
1. Every `{token}` number goes through one formatter (`src/scripts/format-amount.ts`; the pop-up's `money()` calls it, so there is no second implementation, and `src/scripts/format-check.ts` stops the build if it and the demo spots disagree) and follows the unit switch. Negative amounts use the real minus sign. Rounding is half up to one decimal. Two values are exact ties, 1.55 (shown 1.6) and 2.45 (shown 2.5). A half-to-even function would print 2.4, so use half up.
2. Dollar conversion is per hand. Hands 1 and 3 are $1/$2 (1 bb = $2). Hand 2 is $0.50/$1 (1 bb = $1), taken from `bigBlindDollars`. UX 9.3 assumed $1/$2 for all three. The numbers card and the highlights tiles keep the $1/$2 assumption.
3. Dollar view shows cents under $10 on the numbers card and the highlights tiles. In the sample hand and the hero chip dollars are exact at any size, so hand 2 reads $1.55 and $2.45 given up, and hand 1's call reads −$125.24 in the pop-up and in the hero chip. Whole dollars would print $2 for both small figures.
4. Pot figures follow the file: 254.5 bb and 319.5 bb in hand 1. The app captures print 255 bb and 320 bb, because the app rounds pots to whole big blinds. Match the captures by rounding pots to whole bb, or keep the file's figures. Choose one for the pop-up and the worked example.
5. Hand 3 has five options. UX planned up to four. Use a wrapping grid, smallest bet first.
6. Storage. The Privacy page names both browser-only stores in plain words: local storage for remembered settings such as the BB/$ switch, and session storage so the page-load transition plays once per visit. Nothing typed is stored and nothing leaves the browser. If either store is removed, or any other storage is added, change the Privacy summary, its What stays in your browser section, its meta description and the end of FAQ 7 in the same commit.
7. The Privacy page stays in the sitemap and the footer, per UX. PROJECT.md says it was dropped. The coordinator confirmed UX.
8. Markup. One H1 per page. The home H1 holds the kicker and the line. The 404 returns HTTP 404 with `noindex`. No FAQ, Offer, Review or rating markup.
9. Every word in this file for the home page, product pages, legal pages and 404 is meant to appear in the static HTML.

**Decided by the main session (the owner asked for no more questions, so these override the open items below)**
- Other tracker: stays unnamed. The copy keeps "one other tracker's CSV export".
- Plan cards: two, Free and Pro, Pro featured.
- Pots: round to whole big blinds in the pop-up and worked example, so they match the app captures (255 bb and 320 bb in hand 1).
- Screens: stay as the app prints them, including the Hand accuracy label, the PLO row and the four-card hand. The Hold'em-only line is about the coach, and the tracker does log other games. Do not use `desk-coach-decision.png`, which prints 62.5 bb. Use `phone-coach-decision.png` (recaptured, prints 62.6 bb).
- Legal: the OWNER TO CONFIRM lines are resolved in place. No age line. Terms already has a No gambling here section.
- H1: kept. Margin notes: kept. They tease the feature, never the player.
- The 20-seconds micro-line gets timed in final QA.

**Open items**
1. Naming the CSV source. UX 4.7 and `messaging.md` allow naming it (Regroup) as an import source. The brief and the PROJECT.md out-of-scope list say never name a competitor, so the copy says one other tracker's CSV export. Naming it is a one-line change in the Data card, FAQ 4, FAQ 6 and the recorder FAQ 3.
2. Plan cards. UX draws three. The approved price set has two, Free and Pro. Build two cards with Pro featured. Use `data-cta="pricing-free"` and `data-cta="pricing-pro"`.
3. Captures to fix before use. (a) `desk-coach-decision.png` prints 62.5 bb where the file and the phone capture say 62.6 bb. Recapture it. The alt text leaves that figure out. (b) The coach captures print Hand accuracy as a label. The site says hand score, so relabel it in the scratch copy. (c) The history capture lists a PLO session, and Hall of Fame row 1 is a four-card hand. The site says the coach is Hold'em only. Reseed those rows, or keep the UX table and accept the question it invites.
4. Legal placeholders. Privacy and Terms carry marked OWNER TO CONFIRM lines for what the host logs, a contact line and reuse terms. No age line was added. The owner decides on an adults-only statement.
5. About 20 seconds a hand is an estimate. Time the finished pop-up and change the micro-line if it differs.
6. The H1 is kept as directed. The alternate is Every hand you play, graded.
7. The engine calls the hand 2 straight a hand that beats 100% of possible hands. The copy says near the best possible hand, because a holding of 6 and 7 would tie it.
8. Wall of Shame and Tilt Tower stay as feature names. Their margin notes tease the feature and never the player. The owner confirms.
9. No testimonial, rating, user count, press, award or benchmark slot exists, so no placeholder was needed. The solver benchmark is not used anywhere.

## Checks run on this file

| Check | Result |
|---|---|
| Titles at most 60 characters | Home 56, Review 49, Recorder 55, Privacy 20, Terms 18, 404 27 |
| Meta descriptions at most 155 characters | Home 142, Review 144, Recorder 149, Privacy 138, Terms 137, 404 115 |
| CTA labels at most 22 characters | Grade a sample hand 19, Get early access 16 |
| Em dashes and en dashes | none |
| Old app name, host name of the old deployment | none |
| Banned words on the page (download, app store, sign up, log in, crush, unlock, level up) | none outside the avoid list |
| Competitor names | only in Price notes and Builder notes |

