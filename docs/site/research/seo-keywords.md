# HandSolved marketing site: keyword and search-results research

Prepared 2026-11-01, revised the same day after an owner update: the product is renamed **HandSolved** (domain handsolved.com, previously PokerWiz) and the site is a static portfolio display with no backend. Every title, description and page name below uses HandSolved. Anything that depends on sign-up flows has been removed. The repository has no site source yet (only `docs/site/` and `showcase/inspiration/`), so this is a build spec, not an audit.

## Summary

- Every app-shaped query returns mostly App Store listings and their mirrors, with few web brands. PokerCharts is the closest web competitor; in the pages I read it has no hand recorder and no GTO grading. That gap is the positioning.
- Winnable first: the brand, the "live poker hand recorder" family, the "live poker session tracker with hand recorder" combination, and the "grade my poker hand against GTO" long tail. A review-routine guide supports them.
- The name HandSolved: no existing product found under that name, and its vocabulary is on-topic. Costs: it sits next to a crowded "solver" search neighbourhood, "solved" invites overclaiming, the compound spelling splits, and handsolved.com did not resolve in DNS from my environment. Details in section 4.
- Static with no backend is good for SEO but weakens intent-fit for commercial queries if nothing can be tried. In that case lead with the guide and a static worked example (section 1.2).
- Schema: `WebSite`, `Organization`, `BreadcrumbList`, `Article`. No ratings, no `FAQPage`, no AI-specific files.

## 0. Read this first

- **Evidence base.** "Who ranks" comes from a US web-search tool plus page fetches, all run on 2026-11-01. That tool is not Google. Order and result mix can differ from a live Google results page, and it does not show People Also Ask boxes, AI Overviews or personalised results. Read every "who ranks" line as "who is present", not as a rank report. Section 10 has a 30-minute logged-out Google check to confirm the findings that drive page decisions.
- **No volumes.** No keyword-volume tool was available and no volume is estimated anywhere in this file. "Winnable" is not the same as "valuable". Get volumes from Google Keyword Planner before launch and from Search Console after.
- **Difficulty scale (brand-new domain, no backlinks).**
  - Low: results are thin store listings or off-topic pages, no strong web brand owns the intent, one well-matched page can compete.
  - Medium: thin pages plus a few established brands. Needs a clearly better page and some links.
  - High: established brands or editorial sites own it, or tools with years of links do. Treat as long-term.

## 1. What HandSolved can honestly claim, and what "static, no backend" changes

### 1.1 Product facts

Source: the product README (`scratchpad/repos/pokerwiz-remote/README.md`, written under the earlier name PokerWiz). These facts limit which keywords are safe to chase.

- Hands are entered by hand on a table interface. The only imports described are the product's own backups and Regroup CSV exports. No import of PokerStars, GGPoker or other online hand-history files is described, so online-HUD and "PokerTracker alternative" intent is a mismatch.
- The coach is Hold'em only. Preflop uses solved 8-max charts for the hand's stack depth (cash, or tournament with antes). Each postflop street is solved heads-up or 3-way with the hand's real bet sizes. It shows how often GTO takes each option, what each is worth, pot odds, equity against ranges and range grids. No Omaha, and it is not a solver for arbitrary custom spots.
- Practice plays random hands against an 8-handed table of GTO opponents. Any hand can be replayed from the flop, turn or river.
- The equity calculator takes 2 to 6 hands plus an optional board, exact when possible, otherwise simulated. Range input is not described.
- Live sessions: game, stakes, venue, buy-in, rebuys, notes, cash-out, 0 to 5 star rating, 1 to 5 tilt scale, session grade A to F, insights, goals, bankroll chart, BB or dollar display.
- The product itself runs as an installable web app with its own server (Safari Add to Home Screen; Chrome, Edge and Android Install button). No App Store or Play listing is mentioned.
- Not stated anywhere I could read: price, user counts, ratings, testimonials, and whether a public app or demo link will exist. Do not publish claims about these until confirmed (section 9).

### 1.2 What a static, no-backend, no-sign-up site changes

- **Removed from this plan:** sign-up, login, free-trial and waitlist calls to action; "no sign-up" claims; contact or newsletter forms (a form needs a backend or a third-party service); on-site review collection; copy that presupposes the visitor has an account. Contact is a plain `mailto:` link or a link to a profile.
- **What stays easy:** a static build is exactly what the technical plan already needs (all copy in the HTML, fast, no server to fail).
- **Intent-fit risk (my judgment, not a documented rule).** Commercial queries such as `live poker session tracker` and `poker hand recorder app` come from people who want to use something. A page that cannot be used, and has no link to something that can, matches that intent less well than a store listing that installs the app. Rule used in this file: if nothing can be tried from the site or from a link on it, raise the difficulty of the commercial pages (home, recorder, GTO review) by one level and lead with pages that satisfy intent on their own: the review guide and a static worked example.
- **What satisfies intent without a backend:** real screenshots and a short screen recording; a static worked example (a sample hand and the coach's output captured as HTML); and possibly client-side demos. The README places the GTO engine, coach, practice worker and equity worker in the front-end source (`src/gto/`, `src/coach/`, `src/practice/`, `equity.worker.js`) while the Express server stores sessions, hands and goals. If that is accurate, a static page could host a working equity calculator or a practice hand with no server. I have not checked bundle sizes or API dependencies, so treat it as something to test.
- **If a public app or demo exists,** link to it with a plain link, and the README's install steps belong on the site. If not, leave install and availability copy out entirely.
- If the site credits a real creator, `Person` (as author or creator) is appropriate. Never invent credentials.

## 2. What the search results show

### 2.1 Patterns that drive the plan

1. **App-shaped queries return store listings and their mirrors.** For "poker hand tracker app" the results were mostly apps.apple.com listings and aggregator copies ([Poker Memo](https://apps.apple.com/app/id6772399693), [HandRecorder](https://apps.apple.com/app/handrecorder/id6751004127), [Tracker+ on appgoblin](https://appgoblin.info/apps/com.craftywheel.pokerhandtrackerplus), [Tracker+ on mwm.ai](https://mwm.ai/apps/tracker-poker-hand-recorder/6776523299)). "Live poker session tracker" and "poker bankroll tracker app" look the same ([Poker Grinder](https://apps.apple.com/app/id6773290275), [StackTracker](https://apps.apple.com/us/app/id6754944611)). One bankroll listing appeared several times through different country storefronts ([US](https://apps.apple.com/us/app/id999514771), [IL](https://apps.apple.com/il/app/id999514771), [ZA](https://apps.apple.com/za/app/id999514771), [CA](https://apps.apple.com/ca/app/id999514771)), so one listing can take several slots. A web-only product competes with Apple's domain for the word "app".
2. **Few independent web brands, and no independent comparisons.** The web brands present are PokerCharts ([site](https://pokercharts.com), [AlternativeTo listing](https://alternativeto.net/software/pokercharts/about/)) and Poker Analytics ([features](https://www.poker-analytics.net/us/features.html), [guide](https://www.poker-analytics.net/guides/live-poker-win-rate.html)). None of the pages returned for the bankroll and live-tracker queries was an independent head-to-head comparison.
3. **The category is crowded with fresh, thin entrants.** Recent launches show up as store listings and launch pages ([iClarified, June 20, 2026](https://www.iclarified.com/5935/holdem-hand-history), [PokerMemory on Product Hunt](https://www.producthunt.com/products/pokermemory)). Several GTO trainer listings have almost no ratings ([GTO Sensei](https://apps.apple.com/app/id1523876570) shows 1.9 from nine reviews per the search tool's reading; [Poker Reflex](https://apps.apple.com/app/id6761329446) shows two ratings).
4. **Established editorial brands own how-to and GTO-analysis intent.** [Black Rain 79](https://www.blackrain79.com/2017/11/study-your-poker-hands-find-leaks.html) (title tagged "[2026]"), [DeucesCracked](https://www.deucescracked.com/blog/poker-hand-history-review-study-routine), [PokerStrategy](https://www.pokerstrategy.com/strategy/1811) ("Updated on 11 Mar 26"), [Card Player](https://www.cardplayer.com/cardplayer-poker-magazines/66278-talking-stick-resort-27-13/articles/21962-how-to-improve-by-reviewing-your-play). GTO Wizard is the reference product for hand-history analysis ([PokerNews, Dec 2024](https://www.pokernews.com/news/promotions/2024/12/gto-wizard-unveils-upgraded-hand-history-analyzer-47632.htm)).
5. **Spam and look-alike pages sit in these results.** The equity-calculator query returned `pages.dev` casino pages and apparently hijacked domains ([example](https://duckyluck-casino-net.pages.dev/poker-equity-calculator.html), [example](https://microsite.mohawkgroup.com/?p=30013)). "GTO hand review" returned garbled pages ([example](https://aprodeh.org.pe/?p=17690), [example](https://dna.strongeru.com/how-to-put-certain-hands-gto-wizard-2/)). The win-rate query returned [this](https://bandarpokeronline-xyz.pages.dev/win-rate.html). Quality is uneven, which is an opening for a useful page, but it also means the neighbourhood is heavily filtered. Stay clean: no thin programmatic pages, no hidden affiliate links to poker rooms, use a real domain.
6. **Free-tier caps are the baseline offer in GTO tools.** NTPoker lists daily limits for GTO analysis and play, GTOBase lists 10 analyses a day, Poker Academy's free tier is 10 trainer hands a day ([NTPoker's own comparison, vendor-authored](https://ntpoker.jp/en/blog/gto_tool_application/), [Poker Academy listing](https://apps.apple.com/app/id1626050814), [SolvePoker on AlternativeTo](https://alternativeto.net/software/solvepoker/)). If HandSolved's coach or practice is usable somewhere without a daily cap, saying so is a differentiator. Whether and how it is offered is undecided (section 9).
7. **Gaps worth noting.** (a) The search tool found no dedicated free set of 8-max cash preflop charts; the charts it did find were 6-max or tournament ([Poker Academy](https://poker.academy/preflop-charts), [Pokerskill](https://www.pokerskill.com/charts/gto/)). HandSolved ships 8-max charts by stack depth, which could be a linkable asset if the owner is willing to publish them. (b) No returned tool gave a simple letter grade for a hand; they report deviations ([NTPoker](https://ntpoker.jp/en/blog/gto_tool_application/), [GTO Wizard coverage](https://www.pokernews.com/news/promotions/2024/12/gto-wizard-unveils-upgraded-hand-history-analyzer-47632.htm)). (c) A browser-only live tracker did not surface for the "no download, works in browser" query even though PokerCharts claims "No download required" on its own site ([result set included Pokeit](https://pokerfuse.com/features/reviews/pokeit-takes-poker-tracking-cloud-and-brings-mixed-games-it/), which needs a desktop client).
8. **"Poker app" alone means play-poker apps.** A search for "PokerWiz poker app" (the earlier product name) returned real-money and social poker apps ([PokerBROS](https://apps.apple.com/app/id1463376042)) and generic "best poker apps" pages, and no matching product. Avoid the bare phrase "poker app" in titles and H1s.

### 2.2 Query-by-query evidence

| Query | Present in results (examples) | Takeaway |
|---|---|---|
| poker hand tracker app | Store listings: [Poker Hand History App](https://apps.apple.com/us/app/-/id6744484636), [My Pocket Poker](https://apps.apple.com/us/app/-/id6740182522), [Poker Notepad](https://apps.apple.com/us/app/id1524745646); PokerTracker online HUD ([softpedia](https://mac.softpedia.com/get/Games/PokerTracker.shtml)) | Mixed intent (live logging vs online HUD). Store pages dominate. |
| live poker session tracker | [Poker Grinder](https://apps.apple.com/app/id6773290275), [StackTracker](https://apps.apple.com/us/app/id6754944611), [Live Poker Tracker](https://apps.apple.com/us/app/id1399918527), [VPIP Poker Tracker](https://apps.apple.com/app/id1526732724), [Overbet](https://apps.apple.com/ag/app/overbet/id1564188301); PokerCharts via [AlternativeTo](https://alternativeto.net/software/pokercharts/about/) | Few web brands. Clear intent match for the home page. |
| poker bankroll tracker app | [Poler](https://apps.apple.com/app/id828305743), [Poker Bankroll Tracker](https://apps.apple.com/us/app/id999514771), [Nash Bankroll](https://apps.apple.com/at/app/nash-bankroll/id6462712095?l=en-GB), [Bink](https://apps.apple.com/us/app/bink-poker-bankroll-tracker/id6445878829) | Established listings, commodity feature. Not the lead. |
| GTO hand review | [PokerNews on GTO Wizard's analyzer](https://www.pokernews.com/news/promotions/2024/12/gto-wizard-unveils-upgraded-hand-history-analyzer-47632.htm), [PokerNews WPT GTO Trainer review](https://www.pokernews.com/strategy/wpt-gto-trainer-hand-of-the-week-36421.htm), [PokerStrategy](https://www.pokerstrategy.com/?p=37132), plus junk pages | Head term framed around uploading online hand histories. |
| poker hand history app | [Poker Hand History Notes](https://apps.apple.com/us/app/id6754932531), [Poker Hand History Keyboard](https://apps.apple.com/us/app/id6450874851), [Fastroll](https://apps.apple.com/app/id6499390851), [GrindStack](https://apps.apple.com/ly/app/grindstack-live-poker-notes/id6744820078) | Ambiguous (online files vs live notes). Keep secondary. |
| live poker hand recorder | [HandRecorder](https://apps.apple.com/app/handrecorder/id6751004127), [TiltFree](https://apps.apple.com/us/app/id6758140114), [Live Solver](https://apps.apple.com/dk/app/live-solver/id6760947103), [PokerMemory](https://www.producthunt.com/products/pokermemory), [Live Squeezer (GitHub)](https://github.com/vikcch/live-squeezer) | Many entrants, no content-rich web page seen. |
| poker equity calculator | [Poker Academy](https://poker.academy/equity-calculator), [DeucesCracked](https://www.deucescracked.com/tools/equity-calculator), [Omni Calculator](https://omnicalculator.com/other/poker-odds), [PokerNews](https://www.pokernews.com/strategy/talking-poker-equity-21291.htm), [PokerListings on Equilab](https://www.pokerlistings.com/poker-tools/calculators/equilab), plus spam clones | Entrenched. Winners pair calculator + explainer + FAQ. |
| GTO trainer app | [GTO Poker Trainer: Postflop](https://apps.apple.com/us/app/id6448717874), [Poker Academy](https://apps.apple.com/app/id1626050814), [Poker Trainer GTO Preflop](https://apps.apple.com/app/id6450212963), [GTO Sensei](https://apps.apple.com/app/id1523876570) | Store pool plus strong web brands behind it. |
| how to review poker hands | Black Rain 79, Card Player, DeucesCracked, PokerStrategy (links in 2.1), [Pokerskill glossary](https://www.pokerskill.com/poker-glossary/hand-review/), [PokerLog Pro's own guide](https://pokerlogpro.web.app/en/poker-hand-review-guide) | Editorial incumbents, but a small app's guide also appears. |
| (added) poker tracker web app no download | Store listings, [Pokeit review](https://pokerfuse.com/features/reviews/pokeit-takes-poker-tracking-cloud-and-brings-mixed-games-it/), [Poker Session Manager](https://www.producthunt.com/products/poker-session-manager) | Nothing browser-only for live play surfaced. |
| (added) Regroup poker tracker alternative | [Regroup listing](https://apps.apple.com/us/app/regroup-poker-tools-charts/id6443664346), AlternativeTo pages for other trackers | No "Regroup alternative" page exists in results. Tiny niche. |
| (added) play poker against GTO bots free | Store listings and AlternativeTo pages; free tiers capped (see 2.1 point 6) | Free-tier caps are the norm. |
| (added) free poker hand replayer analyzer GTO grade my hand | GTO Wizard (limited free), NTPoker, GTOBase, [PokerDetect](https://lifestyle.thedam.fm/story/64170/pokerdetect-launches-worlds-first-free-post-flop-gto-analyzer-using-two-hole-cards-alongside-advanced-gto-quiz-engine/); a dated desktop replayer ([Universal Replayer](https://mac.softpedia.com/get/Games/Universal-Replayer.shtml)) | Daily caps everywhere; some dated tools. |
| (added) how to track poker results live cash games bb/hr | [PokerListings spreadsheet guide](https://www.pokerlistings.com/strategy/bankroll-management/tracking-your-records-excelent-practice), [Poker Analytics win-rate guide](https://www.poker-analytics.net/guides/live-poker-win-rate.html), [Black Rain 79 on bb/100](https://www.blackrain79.com/2016/08/what-is-bb100.html), [The Poker Bank](https://thepokerbank.com/strategy/other/winrate), [PokerNews](https://www.pokernews.com/strategy/using-win-rates-to-estimate-your-poker-salary-32739.htm) | Current competent guides exist. Defer. |
| (added) GTO preflop charts 8-max cash free | [Poker Academy](https://poker.academy/preflop-charts), [Pokerskill](https://www.pokerskill.com/charts/gto/), [DeucesCracked](https://www.deucescracked.com/blog/texas-holdem-preflop-charts-gto-strategy) | No dedicated free 8-max cash set seen. |
| (added) poker tilt tracking app | App listings only, e.g. [TiltFree](https://apps.apple.com/us/app/id6758140114), [VPIP Poker Tracker](https://apps.apple.com/app/id1526732724) | Feature-level, not a page target. |
| (added, name check) HandSolved; HandSolved poker; poker hand solver online; "hand solved" poker GTO | See section 4 | Brand SERP is empty; the surrounding vocabulary is crowded. |

### 2.3 Closest competitors

- **PokerCharts** ([site](https://pokercharts.com)). Web-first, "No download required", add-to-home-screen, freemium (first 10 sessions free, then $4.95 a month or $23.95 a year). Title tag: "Free Poker Tracker: Stats, Graphs & Results | PokerCharts". It invests in content: a 15-question visible FAQ, an `/alternatives` comparison hub, free tools (hand rankings, ICM, payout calculators), a blog ("The Session Log"), platform pages such as `/en/poker-bankroll-app/iphone`. Per the pages I read it imports online hand histories and has tax reports; I saw no hand recorder or GTO grading. That gap is HandSolved's positioning.
- **Poker Analytics** ([guide](https://www.poker-analytics.net/guides/live-poker-win-rate.html)). App-led, with a guides section. The live win-rate guide says "Updated August 2026", answers six concrete questions, and links to the product only at the end.
- Both competitors run guides and tools off the product site. The first wave below is the minimum subset that does not dilute a new domain.

### 2.4 Question inventory

People Also Ask boxes were not observable. These questions come from competitor FAQs and article headings, so treat them as proxies.

- From PokerCharts' FAQ: Do I need to download anything? Can I track live sessions in real time? Can I import from another tracker? Does it help with poker taxes? How is it different from a HUD like PokerTracker 4? Can I use it for live casino cash games? Does it work on iPhone, Android, Mac and Windows? Is my data private? ([source](https://pokercharts.com))
- From Poker Academy's equity page: what is equity, is it free, hand vs range, works on mobile, how accurate, can I share a scenario ([source](https://poker.academy/equity-calculator)).
- From Poker Analytics' guide: what is a good live win rate, BB/hour vs BB/100, why is real hourly lower than the quoted one, how many sessions before the number means anything, how to measure it ([source](https://www.poker-analytics.net/guides/live-poker-win-rate.html)).
- From the review articles: which hands to review (by decision difficulty, not outcome), how to estimate the villain's range, how long a review should take, how to turn findings into rules ([Black Rain 79](https://www.blackrain79.com/2017/11/study-your-poker-hands-find-leaks.html), [Card Player](https://www.cardplayer.com/cardplayer-poker-magazines/66278-talking-stick-resort-27-13/articles/21962-how-to-improve-by-reviewing-your-play), [DeucesCracked](https://www.deucescracked.com/blog/poker-hand-history-review-study-routine)).

HandSolved can answer these honestly in a home-page FAQ without any sign-up dependency: Is it an online HUD (no)? Which games does the coach cover (Hold'em; heads-up and 3-way postflop)? What does "solved" mean here (section 4)? Can it import (own backup and Regroup CSV)? Can it export (CSV and JSON backup)? Two more only if a public app exists: Do I need to download anything (install steps, no store)? Where does my data live (server database, browser copy, automatic backups)?

## 3. Keyword map

| Page | Primary keyword | Intent | Difficulty (new domain) | Wave |
|---|---|---|---|---|
| `/` | live poker session tracker | Commercial, plus brand navigational | Medium (brand: Low) | 1 |
| `/live-poker-hand-recorder` | live poker hand recorder | Commercial | Low to Medium | 1 |
| `/gto-hand-review` | GTO hand review (live and manual hands angle) | Commercial and informational | High head, Medium long tail | 1 |
| `/guides/how-to-review-poker-hands` | how to review poker hands | Informational | High head, Medium for live variants | 1 (first, if the site is display-only) |
| `/gto-trainer` | GTO trainer app | Commercial | High | 2 |
| `/poker-equity-calculator` | poker equity calculator | Tool | High | 2, only with a differentiated angle |
| (home section only) | poker bankroll tracker app | Commercial | High | Not a page |

Difficulty is for a site where something can be tried or reached. If the site is display-only (section 1.2), raise the three commercial rows by one level. The guide is unaffected.

### `/` (home): the priority

- **Primary:** `live poker session tracker`.
- **Secondary** (one page can serve these because the intent overlaps): `poker session and hand tracker`, `poker hand tracker app`, `track live poker hands`, `poker hand recorder app`, `GTO coach for poker hands`, and the brand `HandSolved`. Add `poker tracker no app store` or `works in your browser` only if a public app exists.
- **Intent:** commercial investigation (choosing a tool), plus navigational for the brand.
- **Who ranks now:** live-tracker store listings ([Poker Grinder](https://apps.apple.com/app/id6773290275), [StackTracker](https://apps.apple.com/us/app/id6754944611), [Live Poker Tracker](https://apps.apple.com/us/app/id1399918527), [VPIP Poker Tracker](https://apps.apple.com/app/id1526732724)); web brands [PokerCharts](https://pokercharts.com) and [Poker Analytics](https://www.poker-analytics.net/us/features.html).
- **Difficulty:** Medium for `live poker session tracker`. Medium to High for the bare `poker hand tracker app`, which has mixed intent (it also returns online HUD software such as [PokerTracker](https://mac.softpedia.com/get/Games/PokerTracker.shtml)). Low for the brand: no product, company or term called HandSolved appeared in my searches (section 4), so the brand results page should be easy to own. It also has no existing demand, because the name is new.
- **Reasoning:** store listings are thin and few web brands exist, so page quality is not the barrier. The barriers are zero links and Apple's domain holding slots. The home page cannot be the best answer to every intent, so it carries the umbrella positioning and hands the hand-level and GTO intents to their own pages.

### `/live-poker-hand-recorder`

- **Primary:** `live poker hand recorder`. **Secondary:** `record poker hands at the table`, `poker hand recorder app`, `log poker hands on iPhone`, `poker hand history for live games`, `poker hand replayer`.
- **Intent:** commercial, with some how-to.
- **Who ranks now:** indie store listings ([HandRecorder](https://apps.apple.com/app/handrecorder/id6751004127), [Poker Memo](https://apps.apple.com/app/id6772399693), [TiltFree](https://apps.apple.com/us/app/id6758140114), [Live Solver](https://apps.apple.com/dk/app/live-solver/id6760947103), [Fastroll](https://apps.apple.com/app/id6499390851)), launch and repo pages ([PokerMemory](https://www.producthunt.com/products/pokermemory), [Live Squeezer](https://github.com/vikcch/live-squeezer)). No content-rich web page from a recorder product turned up.
- **Difficulty:** Low to Medium. Specific phrase, large but almost entirely thin supply. A dedicated page with real screenshots, a walkthrough of recording one hand, and honest limits matches intent better than a store listing can. Confidence is low to medium: this sample is store-heavy and volume is unknown.
- **Caution:** bare `poker hand history app` is ambiguous (online files vs live notes). Keep it secondary here and never lead with it.

### `/gto-hand-review`

- **Primary:** `GTO hand review`, angled to live and manually recorded hands. **Secondary:** `grade my poker hand against GTO`, `review poker hands with GTO`, `GTO analysis of a single hand`, `poker hand analyzer`, `GTO coach for poker`.
- **Intent:** commercial and informational.
- **Who ranks now:** [GTO Wizard's analyzer](https://www.pokernews.com/news/promotions/2024/12/gto-wizard-unveils-upgraded-hand-history-analyzer-47632.htm) as the reference for uploads from online sites; PokerNews and PokerStrategy editorial ([PokerNews](https://www.pokernews.com/strategy/wpt-gto-trainer-hand-of-the-week-36421.htm), [PokerStrategy](https://www.pokerstrategy.com/?p=37132)); daily-capped tools ([NTPoker comparison](https://ntpoker.jp/en/blog/gto_tool_application/)); garbled pages ([example](https://aprodeh.org.pe/?p=17690)).
- **Difficulty:** High for the head term. Medium for the long tail (`grade my poker hand against GTO`, `GTO hand review for live poker`).
- **Reasoning:** the head phrase is framed around uploading online hand-history files, which HandSolved does not do. The long tail, where you enter a hand and get it graded with an explanation, is thinly served and no returned tool offered a simple grade. State the limits plainly (Hold'em, heads-up and 3-way postflop). Because the site is static, this page is also where the **static worked example** lives: one sample hand and the coach's output as real HTML. The README points to `docs/coach-algorithm.md` in the app repo; a "How the coach works" section built from it is the strongest first-hand content the product has.

### `/guides/how-to-review-poker-hands`

- **Primary:** `how to review poker hands`. **Secondary:** `how to review live poker hands`, `poker hand review checklist`, `poker session review`, `how to find leaks in your poker game`.
- **Intent:** informational.
- **Who ranks now:** Black Rain 79, Card Player, DeucesCracked, PokerStrategy (links in 2.1), [Pokerskill glossary](https://www.pokerskill.com/poker-glossary/hand-review/), and a small app's own guide ([PokerLog Pro](https://pokerlogpro.web.app/en/poker-hand-review-guide)).
- **Difficulty:** High for the head. Medium for `live` variants.
- **Reasoning:** established editorial brands with years of links. But a small app's own guide ranks, so product-owned guides are not excluded. Its job is to feed the product pages with internal links, and on a display-only site it is the one page whose value does not depend on the product being usable. It earns external links only if it contains something the incumbents lack, such as a worked example from HandSolved's own coach output or a one-page routine players can print.

### Deferred (do not build in the first wave)

- **`/gto-trainer`** (`GTO trainer app`, `play poker against GTO`, `GTO practice`). High. A store-listing pool ([GTO Poker Trainer: Postflop](https://apps.apple.com/us/app/id6448717874), [Poker Academy](https://apps.apple.com/app/id1626050814), [GTO Sensei](https://apps.apple.com/app/id1523876570)) and free-tier caps set the baseline. The home page covers Practice meanwhile.
- **`/poker-equity-calculator`**. High. Winners pair a free, no-sign-up calculator with an explainer and FAQ ([Poker Academy](https://poker.academy/equity-calculator), [DeucesCracked](https://www.deucescracked.com/tools/equity-calculator)) and support hand vs range, which the README does not describe for HandSolved. A client-side calculator on a static page is technically possible (section 1.2) but revisit only with a differentiated angle.
- **Bankroll tracker page.** High. Long-established listings ([Poker Bankroll Tracker](https://apps.apple.com/us/app/id999514771), [Poler](https://apps.apple.com/app/id828305743)) and PokerCharts. HandSolved is not bankroll-first; mention the bankroll chart on the home page.
- **Win-rate guide plus a BB/hour calculator.** Medium. A current competent guide exists ([Poker Analytics, updated August 2026](https://www.poker-analytics.net/guides/live-poker-win-rate.html)). A small client-side calculator is linkable, but it is a distraction before the home page ranks.
- **Comparison pages.** PokerCharts already runs an `/alternatives` hub. Build only with verified, dated facts about each competitor.
- **Regroup import page.** No competing page found, volume probably tiny. Answer it in the home FAQ.

### Do not target

- Online-tracker intent: `poker tracker`, `PokerTracker alternative`, `HUD`, `Hold'em Manager`. HandSolved does not import online hand histories.
- **Solver intent, which the new name makes tempting:** `poker solver`, `GTO solver`, `hand solver`, `pokersolver`. The coach grades recorded hands; it is not a custom-spot solver, and the `pokersolver` results are a developer library for ranking hands (section 4).
- Bare `poker app` or `free poker app` (play-poker apps, per 2.1 point 8).
- Omaha and PLO. The coach is Hold'em only.
- Tax reporting. PokerCharts offers it; HandSolved does not.

## 4. The name HandSolved: what it helps and hurts

Evidence: searches run 2026-11-01 for `HandSolved`, `HandSolved poker`, `"hand solved" poker GTO`, `poker hand solver online` and `handsolved.com`, plus one fetch of handsolved.com. The same caveat as section 0 applies: this tool is not Google.

### Helps

1. **No collision found.** `HandSolved` returned no product, company or term of that name. The results were fuzzy neighbours: a VR hand-pose plugin ([VR Hands Solver on Fab](https://www.fab.com/listings/3c0c1557-e3de-4fdd-8f79-baf8343c4ece?lang=zh-cn)), a hand-surgery database ([HandSRev](https://bssh.ac.uk/handsrev_.aspx)) and a Final Fantasy puzzle helper ([Hands of Time Puzzle Solver](https://guides.gamercorner.net/ffxiii-2/hands-of-time)). `HandSolved poker` surfaced only generic solver material (below). The brand results page should be easy to own. The flip side: a new name has no existing demand, so brand-query ranking #1 is easy and nearly worthless until people know the name.
2. **On-topic vocabulary.** "Solved" is how this niche markets itself: "1,500,000+ Preflop GTO Solutions" ([Poker Academy](https://poker.academy/)), "15,500+ pre-solved hands" ([GTO Poker Trainer: Postflop](https://apps.apple.com/app/id6448717874)), "over 1 Billion unique spots solved" ([PokerNews on WPT GTO Trainer](https://www.pokernews.com/news/2020/01/learnwpt-wpt-game-theory-optimal-trainer-36420.htm)). A poker player reading the name understands the category at once, and the product does solve things (postflop streets heads-up or 3-way; preflop charts). I am not citing any ranking boost for keywords in a brand or domain name, and I am not claiming one. The benefit is clarity and natural anchor text.
3. **Short, one word, .com.** Easy to say, type and remember (judgment).

### Hurts or needs managing

1. **It sits next to a crowded "solver" neighbourhood.** `poker hand solver online` returned the `pokersolver` JavaScript hand-evaluation library ([npm](https://npmjs.com/package/pokersolver), [GitHub](https://github.com/goldfire/pokersolver)), GTO solver apps ([Solver+](https://apps.apple.com/us/app/-/id1530767783), [PocketSolver](https://apps.apple.com/app/id6479562719), [Live Solver](https://apps.apple.com/dk/app/live-solver/id6760947103)), web solvers ([Omni GTO Solver](https://alternativeto.net/software/omni-gto-solver/about/)), review pages for the big paid solvers ([PokerListings](https://www.pokerlistings.com/poker-tools/solvers)), and garbled "Poker Hand Calculator: Learn the Exact" pages. Visitors who land on the name looking for solver software or hand-evaluation code are the wrong audience. Fix with copy, not keywords: the first screen says it grades your recorded Hold'em hands against solved GTO strategy and is not a solver for custom spots. Do not use "solver" as a descriptor in titles or H1s. How much stem overlap with "solver" queries Google credits is unknown, so do not count on it.
2. **"Solved" invites overclaiming.** The best-known academic use of the word is **heads-up limit** hold'em ([Bowling et al., "Heads-up Limit Hold'em Poker is Solved"](https://webdocs.cs.ualberta.ca/~bowling/publications/b2hd-15science.html)). No-limit hold'em, which HandSolved covers, is not solved in that sense. The site, and any AI summary built from it, must say exactly what is solved: preflop charts for 8-max by stack depth, postflop streets heads-up or 3-way, Hold'em only. Add a short "What 'solved' means here" block to the home page and `/gto-hand-review`. Competitor solved-spot counts are self-reported marketing and I found no independent analysis, so do not copy that style of number unless HandSolved can substantiate it.
3. **Compound spelling.** People will type `hand solved`, `handsolved`, `hand solver` and `handsolve`. I could not verify how Google segments an unfamiliar compound. Keep one casing, "HandSolved", in titles, headings, the logo text and markup; set the `WebSite` `alternateName` to "Hand Solved" (Google's site-name guidance supports `alternateName`, [doc](https://developers.google.com/search/docs/appearance/site-names)); then check Search Console queries after launch for `hand solved` vs `handsolved`.
4. **The domain has no "poker" in it,** so the brand's context comes only from page content. Always pair the brand with "poker" in the home title, H1 and description (done in section 6).
5. **handsolved.com does not currently resolve.** A fetch failed with a DNS lookup error (`getaddrinfo ENOTFOUND`) from my environment. That proves neither ownership nor availability. Confirm the registration and DNS records before verifying a Search Console Domain property.
6. **Near-names.** A Gumroad storefront titled "Solved Poker" ([solvedpoker.gumroad.com](https://solvedpoker.gumroad.com)) surfaced for `HandSolved poker`; the page text I could read was only the title, so I cannot say what it sells or whether it is active. "SolvePoker" ([AlternativeTo](https://alternativeto.net/software/solvepoker/)) and "Poker Solver Pro" ([listing](https://mwm.ai/apps/poker-solver-pro/6760000223)) also share the stem. "Solved" is common in competitor names, so the brand is suggestive rather than distinctive. A trademark search is outside SEO scope but worth doing before launch (not legal advice).
7. **The rename itself.** I found no PokerWiz product in search results, so no ranking equity is lost. But the old name still appears in the app repo README and probably in the app's UI and web app manifest. Make the app name, manifest `name` and `short_name`, header and README say HandSolved, so the entity is consistent across the site and the app. If any public PokerWiz URL is already indexed, 301 it to handsolved.com where you control the redirect, otherwise take it down.

### Net

Slightly positive for brand cleanliness and topical fit; neutral for generic terms; the costs are expectation management (solver drift, "solved" claims) and a spelling split. Keep the name. Mitigate with explicit scope copy, consistent casing, `alternateName`, and by never optimising for solver queries.

## 5. Queries a new site can realistically win first

In order. All carry the caveat that volume is unknown, and the commercial ones carry the intent-fit caveat in section 1.2.

1. **Brand: `HandSolved`.** Home page. Should rank for its own name soon after indexing, but demand starts near zero. Title starts with the brand; set `WebSite` name (section 7).
2. **`live poker hand recorder` and close variants** (`record poker hands at the table`, `poker hand recorder app`). `/live-poker-hand-recorder`. Thin store-listing competition and no content-rich web page seen.
3. **`live poker session tracker`, with the hand-recorder qualifier** (`poker session and hand tracker`). Home page. Medium, but the exact combination of session log plus hand recorder plus grading is rare in the results.
4. **`grade my poker hand against GTO` and `GTO hand review for live poker`.** `/gto-hand-review`. The long tail is thin; the head term is out of reach for now. A static worked example helps here because it answers the intent without needing the app.

Build order: the home page first, always. If something can be tried or reached from the site: recorder page, GTO review page, then the guide. If the site is display-only: the guide and the worked example first, then the product pages.

### Supporting pages that earn their place

A page earns a slot only if it has a distinct intent, content only HandSolved can supply, a weak result set, and a clear internal-link job.

| Page | Distinct intent | What only HandSolved has | SERP weakness | Link job |
|---|---|---|---|---|
| `/live-poker-hand-recorder` | Record a hand at the table | Animated table recorder, stack presets, all-ins and side pots | Store listings only | Feeds home and `/gto-hand-review` |
| `/gto-hand-review` | Grade a hand | Solved 8-max preflop, HU and 3-way postflop, EV per option, replay from a street, a static worked example | Head term online-upload shaped; long tail thin | Receives links from the guide and the recorder page |
| `/guides/how-to-review-poker-hands` | Learn a review routine | Worked example from real coach output | Competent but generic | Passes context and links to both product pages |

Everything else waits until Search Console shows impressions for a cluster that has no matching page.

### What the home page must contain (SEO-relevant)

- An H1 that says "session tracker" and "GTO coach" (or "hand recorder") in natural wording, plus a one-sentence description that names the scope: Texas Hold'em, heads-up and 3-way postflop.
- A "What 'solved' means here" block and a "What HandSolved is not" block (not an online HUD, not a solver for custom spots, Hold'em coach). They filter wrong-intent visitors and keep any AI summary accurate.
- Sections that mirror the product: live session log, hand recorder, GTO coach, practice and replay, insights and goals and bankroll chart, equity calculator, your data (backups, CSV export, import). Install steps only if a public app exists.
- A visible FAQ built from 2.4, real screenshots with descriptive alt text (or a short recording), and links to each supporting page with descriptive anchors.
- No sign-up, trial or waitlist calls to action. No testimonials, ratings, user counts or "as seen in" claims unless real and verifiable. No availability or pricing language until it is confirmed.

## 6. Recommended titles and meta descriptions

Character counts are my count. Google may rewrite titles and descriptions. Roughly 60 characters is the usual safe budget for titles, 155 to 160 for descriptions. None of the text below promises availability, pricing, offline use or sign-up, because none is confirmed and the site has no sign-up. If a public app link exists, a platform sentence can be added to the home description.

**Home `/`**
- Title (55): `HandSolved: Live Poker Session Tracker & GTO Hand Coach`
- Alternative if "Hand Recorder" must be in the title (65, may truncate on some devices; the key phrases sit in the first 45 characters): `HandSolved: Live Poker Session Tracker, Hand Recorder & GTO Coach`
- Description (142): `Log live poker sessions, record every hand at the table, and see each decision graded against GTO. Texas Hold'em, heads-up and 3-way postflop.`

**`/live-poker-hand-recorder`**
- Title (53): `Live Poker Hand Recorder: Log Every Hand | HandSolved`
- Description (149): `Rebuild any hand on a poker table: seat the players, set stacks, pick cards, then answer each action street by street. All-ins and side pots handled.`

**`/gto-hand-review`**
- Title (49): `GTO Hand Review for Live Poker Hands | HandSolved`
- Description (145): `Record a hand and see how often GTO takes each option, what each is worth, plus pot odds and equity. Texas Hold'em, heads-up and 3-way postflop.`

**`/guides/how-to-review-poker-hands`**
- Title (56): `How to Review Poker Hands: A Simple Routine | HandSolved`
- Description (147): `Pick the hands worth studying, estimate ranges, find the decision that mattered, and write it down as a rule. A practical routine for live players.`

Notes:

- The brand leads on the home page (so the brand query matches the title) and trails on supporting pages (so the topic phrase leads). Use the same strings for the Open Graph and social titles.
- The home title pairs the brand with "poker" because the domain does not carry the word (section 4).
- Avoid "Live Poker Tracker" as a phrase in titles; it is the literal name of an existing store app ([listing](https://apps.apple.com/us/app/id1399918527)).
- Avoid "solver" as a descriptor anywhere in titles, descriptions or H1s (section 4).

## 7. Schema.org

Use:

| Type | Where | Notes |
|---|---|---|
| `WebSite` | Home page only | `name` "HandSolved", `alternateName` "Hand Solved", `url` of the chosen canonical host (apex `https://handsolved.com/` or www, one only). Google requires it on the home page to set the site name ([doc](https://developers.google.com/search/docs/appearance/site-names)). Leave out `SearchAction`; there is no site search. |
| `Organization` | Home page | Name "HandSolved", URL, logo. `sameAs` only for profiles you actually control. In Google's current feature list ([gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)). |
| `BreadcrumbList` | Supporting pages | Must match visible breadcrumbs. |
| `Article` | Guide pages | `headline`, `datePublished`, `dateModified` matching visible dates, `author` as a real person or the Organization. |
| `VideoObject` | Only if a screen recording is hosted on the page | Skip otherwise. |

Hold: **`WebApplication`** (a `SoftwareApplication` subtype). Google's Software app rich result requires `name`, `offers.price` and one of `aggregateRating` or `review` ([doc, updated 2026-09-08](https://developers.google.com/search/docs/appearance/structured-data/software-app)). A static site with no backend cannot collect reviews, and a display page has no price to state, so it cannot qualify and Search Console would flag missing fields. Skip it. A competitor uses it with FAQ markup ([Poker Academy's equity page](https://poker.academy/equity-calculator)); that is their choice, not evidence it helps.

Not appropriate:

- **`AggregateRating`, `Review`, `Rating`, testimonial markup** for HandSolved. There are no real, visible, collected reviews, and ratings must not be borrowed from elsewhere. The same doc warns that "spammy markup" can bring manual action.
- **`FAQPage`.** Google ended the FAQ rich result on May 7, 2026 and removed its documentation on June 15, 2026 ([Search Central changelog](https://developers.google.com/search/updates)). Keep the visible FAQ for readers; skip the JSON-LD.
- **`HowTo`.** Not among the 25 feature types in Google's current gallery (updated 2026-10-16).
- **`Product` and `Offer`** on non-purchasable pages, `LocalBusiness`, `Event`, `Course`, `Speakable`, and `Person` with invented credentials.
- **Any markup for content not visible on the page.**
- No schema is needed for AI features: "there's no special schema.org markup you need to add" ([Google's generative AI guide, updated 2026-07-10](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).

## 8. Technical SEO checklist (static marketing site, late 2026)

### 8.1 Highest-impact items

[CRITICAL] Marketing copy must be in the initial HTML
Location: marketing site build (not yet created)
Issue: Google processes JavaScript ("able to process content within JavaScript as long as it isn't blocked", per the [AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). A December 2024 crawl-log study reports that OpenAI and Anthropic crawlers do not execute it ([Vercel/MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler); I read a secondary summary, it is two years old and not vendor-confirmed). The app is a Vite React SPA per the README, so reusing its shell for the marketing pages would ship an empty page to those crawlers.
Fix: static site generation as a separate build from the app. Verify with view-source that every heading, paragraph, FAQ answer, link and image alt is present without JavaScript. Animations may enhance, never carry content.

[CRITICAL] If a public app origin exists, do not hide it with robots.txt
Location: robots.txt and headers of the app origin
Issue: a robots.txt-blocked URL can still be indexed from links, and Google cannot see a noindex on a page it may not fetch ([Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing)).
Fix: serve `noindex` (meta tag or `X-Robots-Tag`) on the app origin and leave it crawlable. Sitemap entries are marketing-only. Keep the web app manifest and any service worker scoped to the app origin so they cannot touch the marketing pages (engineering judgment). Skip this item if no public app exists.

[HIGH] The static host must support the redirects and status codes SEO needs
Location: hosting choice and its config files
Issue: with no backend there is no server code to fix redirect or error behaviour later. A host that cannot issue a single 301 for HTTP to HTTPS and www to apex, serve a real 404 status, or set headers will leave canonical problems the build cannot fix.
Fix: confirm those capabilities before picking the host. Generate `sitemap.xml` and `robots.txt` at build time. Pick the apex or www host once and redirect the other.

[HIGH] No rating, review or FAQ markup
Location: JSON-LD on all pages
Issue and fix: section 7.

[HIGH] Confirm DNS, search bots and the Search Console AI setting
Location: DNS for handsolved.com, CDN and WAF bot rules, robots.txt, Search Console
Issue: the domain did not resolve from my environment (section 4). Google says crawling must be allowed "in robots.txt, and by any CDN or hosting infrastructure" ([AI features doc](https://developers.google.com/search/docs/appearance/ai-features)). OpenAI: sites opted out of OAI-SearchBot "will not be shown in ChatGPT search answers" ([OpenAI](https://developers.openai.com/api/docs/bots)). Some hosts ship default bot-blocking rules, so check yours.
Fix: confirm apex and www resolve, leave robots.txt on default allow for search bots, and test with Search Console's URL Inspection live test. After verifying the domain, open Settings > Search generative AI and confirm it reads "Include my site's links and content in Search generative AI features", the default, rolled out to all sites on Aug 31, 2026 ([Google](https://support.google.com/webmasters/answer/16908024)).

[MEDIUM] Motion-heavy design can cost INP and LCP
Location: hero and scroll animations (`showcase/inspiration/` holds references such as Raycast, Linear and Framer, which are typically animation-led)
Issue: Core Web Vitals are used by Google's ranking systems, but other page-experience aspects "don't directly help your website rank higher" and relevance wins "even if the page experience is sub-par" ([Google](https://developers.google.com/search/docs/appearance/page-experience), updated 2026-09-22). So this is a gate to pass, not a lever to chase.
Fix: see 8.4.

### 8.2 Crawl, index and URL hygiene

1. One canonical host. HTTP to HTTPS and www to apex (or the reverse) in a single 301 hop each. Self-referencing absolute `rel="canonical"` on every indexable page. One trailing-slash policy. Lowercase, hyphenated, keyword-first URLs as in section 3. Real 404 status for missing pages.
2. `robots.txt`: allow everything on the marketing origin, do not block CSS, JS or images, add a `Sitemap:` line.
3. `sitemap.xml`: canonical, indexable, 200-status URLs only. Set `lastmod` only when content really changes. Submit in Search Console. Add Bing Webmaster Tools too (cheap hygiene; I could not verify from vendor documentation which AI products use Bing's index, so do not count on that).
4. Verify a Domain property in Search Console (DNS), then watch the Pages report for "Crawled, not indexed" on the first pages.
5. No `nosnippet`, `max-snippet:0` or `noindex` on pages meant to be cited. Google requires a page to be "indexed and eligible to be shown in Google Search with a snippet" to be a supporting link in AI features ([doc](https://developers.google.com/search/docs/appearance/ai-features)).
6. No hreflang until a second language exists. `<html lang="en">`.
7. Every indexable page is linked from the header or footer, and the home page links to each supporting page with descriptive anchors. Real `<a href>` links, no JavaScript-only navigation. No orphans.

### 8.3 On-page

1. Unique title, meta description and a single H1 per page (section 6). Primary phrase in the title, H1 and first paragraph, in natural wording.
2. Real product screenshots with descriptive `alt`, explicit `width` and `height`, modern image formats. One 1200 by 630 social image per page.
3. Contact is a `mailto:` link or a profile link. No forms, no newsletter, no login, because there is no backend.
4. Visible dates only where real. A guide's "Updated" date changes only when the content does.
5. Add a short privacy note if any analytics or cookies are used. A site that stores nothing needs little more.
6. Install instructions (Safari Add to Home Screen; Chrome and Edge Install) only if a public app exists. Installability is a product feature; I found no Google guidance tying a web app manifest to ranking.

### 8.4 Performance

Targets at the 75th percentile: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less ([web.dev](https://web.dev/articles/vitals)).

- Self-host the two README fonts (Fredoka, Nunito), subset them, preload only the one used by the LCP text, set a `font-display` value, and match fallback metrics to avoid layout shift.
- Hero image or phone mockup: AVIF or WebP, `fetchpriority="high"`, never lazy-loaded, dimensions reserved. A screen recording gets a poster image and no autoplay download on mobile.
- Load animation libraries after first paint and budget their JavaScript. Check INP on a mid-range Android phone, not only on a laptop.
- Use lab data (Lighthouse) before launch. Field data (CrUX, PageSpeed Insights) appears only once there is traffic.

### 8.5 AI search citations: what matters and what does not

Google states that its generative AI features use core Search ranking and quality systems and the Search index ([AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). For a small new site, the keyword and content work above is most of the AI-visibility work. Documented items first, then judgment.

Documented:

- **Be indexed and snippet-eligible in Google.** "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary" ([AI features doc](https://developers.google.com/search/docs/appearance/ai-features), updated 2025-12-10).
- **Allow the vendors' search bots.** OAI-SearchBot is what puts a site in ChatGPT search; GPTBot is training; ChatGPT-User is user-initiated and "is not used to determine whether content may appear in Search" ([OpenAI](https://developers.openai.com/api/docs/bots)). Claude-SearchBot is the search-visibility bot, ClaudeBot is training, Claude-User is user-initiated ([Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)). PerplexityBot is the one that lists sites in results; Perplexity-User "generally ignores robots.txt" ([Perplexity](https://docs.perplexity.ai/guides/bots)). Blocking training crawlers (GPTBot, ClaudeBot, Google-Extended) is a licensing choice and does not by itself remove you from search answers; the Search Console generative AI control does not affect AI training either ([Google](https://support.google.com/webmasters/answer/16908024)).
- **Content as crawlable text.** "Making sure that important content is available in textual form" ([AI features doc](https://developers.google.com/search/docs/appearance/ai-features)).
- **Original, first-hand content over summaries.** The guide favours experience-based material and treats mass-produced pages aimed at AI answers as scaled content abuse (my reading of [the guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). HandSolved's own solver output and recorded-hand walkthroughs are exactly this kind of content.
- **Measure it.** Search Console's generative AI performance report shows impressions only (AI Overviews and AI Mode), by page, country, date and device; it rolled out Aug 31, 2026 ([Google](https://support.google.com/webmasters/answer/16984139)). It is not clicks and not citations in other engines.

Judgment (no vendor documentation, low cost):

- Lead each section with a plain-language answer and put hard facts (scope, limits, what is imported and exported) in text or a small table, so any summary of the page is correct. This matters more for a name like HandSolved, where a careless summary could turn "solved" into a broader claim than the product makes.
- Use the same one-sentence product description in the home page, the Organization description and any profiles.
- Independent mentions and links from real poker communities and review sites are the one lever the site cannot build itself. Earn them with useful content, not with spam.

Do not spend time on:

- **`llms.txt`.** Google's guide says Search does not need it and does not read it, and the June 15, 2026 changelog entry says it does not affect visibility ([guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [changelog](https://developers.google.com/search/updates)). John Mueller wrote on June 17, 2025: "FWIW no AI system currently uses llms.txt" ([Search Engine Roundtable](https://seroundtable.com/google-ai-llms-txt-39607.html)). Some competitors publish one ([Poker Academy](https://poker.academy/llms.txt) appeared in results). Harmless, no evidenced benefit.
- Special AI schema, content "chunking" for AI, Markdown mirrors of pages, stuffed Q&A blocks, and fake freshness (changing `lastmod` or dates without real changes).
- FAQ markup (section 7).

### 8.6 Pre-launch QA

- View-source test of every page for copy, links, alt text and canonical.
- DNS for apex and www, robots.txt, sitemap, redirects (one hop), 404 status.
- Rich Results Test or a schema validator on the home page and one guide; no warnings about invented fields.
- Lighthouse on mobile for the home page and one supporting page.
- URL Inspection live test for the home page after DNS verification.
- Share-preview check for each page.
- Consistency check of the name "HandSolved" across titles, headings, logo text, markup, the app manifest and the app README.

### 8.7 After launch

- Monthly Search Console review: queries, pages, and the generative AI report. Add a new page only when a query cluster has impressions and no matching page. Watch `hand solved` vs `handsolved` and any solver-intent queries reaching the home page.
- Track the brand query and the four first-win queries by manual logged-out checks each quarter, noting who appears and whether an AI Overview cites anyone.
- Refresh a guide only when something real changed, then update its visible date.

## 9. Open decisions for the owner

1. **Can anything be tried or reached from the site?** A public app, a demo, or client-side demos on the static pages. This decides whether the commercial pages carry their normal difficulty or one level higher, and the build order (section 5).
2. **Domain.** handsolved.com did not resolve in DNS from my environment: confirm registration and records. Choose apex or www. Run a trademark check (near-names in section 4).
3. **Rename consistency.** Update the app's name, manifest, header and README to HandSolved, and deal with any already-public PokerWiz URL.
4. **Publish the coach method and chart data?** A public "How the coach works" section and possibly the 8-max charts as crawlable HTML tables would be the strongest first-hand assets, and they define what "solved" means in the product. It is the owner's call.
5. **Availability and pricing language.** Leave it out unless a public app exists and its terms are settled. For reference, PokerCharts is free for 10 sessions then $4.95 a month ([site](https://pokercharts.com)).
6. **Store listings.** An App Store or Play listing (for example a wrapped web app) would open the slots that dominate the app-shaped results in section 2. A product decision, not needed for this plan.
7. **Volumes.** Run the primary and secondary phrases through Google Keyword Planner before committing to wave 2 pages.

## 10. Verification and sources

### 30-minute logged-out Google check (do before building supporting pages)

For each of the nine starting queries plus `live poker session tracker with hand recorder` and `grade my poker hand against GTO`, note:

- How many of the top 10 are apps.apple.com or Play listings, and which web brands appear.
- Whether PokerCharts, Poker Analytics or GTO Wizard appear, and with which page type.
- Whether an AI Overview shows and which domains it cites.
- The People Also Ask questions (add them to the FAQ and guide).
- Whether spam or look-alike pages rank, as seen in this sample.
- The brand check: `HandSolved`, `handsolved`, `hand solved poker`, and `handsolved.com`. Confirm there is still no collision, and whether Google treats `hand solved` and `handsolved` alike.

If the top 10 for a target phrase is mostly established web brands rather than store pages, raise its difficulty one level.

### Primary sources

- Google, generative AI features: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Search generative AI control](https://support.google.com/webmasters/answer/16908024), [Generative AI performance report](https://support.google.com/webmasters/answer/16984139).
- Google, structured data and indexing: [Software app](https://developers.google.com/search/docs/appearance/structured-data/software-app), [feature gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [site names](https://developers.google.com/search/docs/appearance/site-names), [block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [page experience](https://developers.google.com/search/docs/appearance/page-experience), [Search Central changelog](https://developers.google.com/search/updates), [Core Web Vitals thresholds](https://web.dev/articles/vitals).
- Bots: [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/guides/bots).
- Secondary: [Vercel on AI crawlers](https://vercel.com/blog/the-rise-of-the-ai-crawler), [Search Engine Roundtable on llms.txt](https://seroundtable.com/google-ai-llms-txt-39607.html).
- Name research (section 4): [VR Hands Solver](https://www.fab.com/listings/3c0c1557-e3de-4fdd-8f79-baf8343c4ece?lang=zh-cn), [HandSRev](https://bssh.ac.uk/handsrev_.aspx), [Hands of Time Puzzle Solver](https://guides.gamercorner.net/ffxiii-2/hands-of-time), [pokersolver on npm](https://npmjs.com/package/pokersolver), [PokerListings solver reviews](https://www.pokerlistings.com/poker-tools/solvers), [Bowling et al.](https://webdocs.cs.ualberta.ca/~bowling/publications/b2hd-15science.html), [Solved Poker on Gumroad](https://solvedpoker.gumroad.com), [PokerNews on WPT GTO Trainer](https://www.pokernews.com/news/2020/01/learnwpt-wpt-game-theory-optimal-trainer-36420.htm).
- Competitors and result pages: linked inline in sections 2 and 3; fetched pages were [pokercharts.com](https://pokercharts.com), [poker.academy/equity-calculator](https://poker.academy/equity-calculator), [Poker Analytics win-rate guide](https://www.poker-analytics.net/guides/live-poker-win-rate.html), [AlternativeTo on PokerCharts](https://alternativeto.net/software/pokercharts/about/).
