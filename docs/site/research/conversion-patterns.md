# Conversion patterns: from first screen to main button

Research input for `docs/site/UX.md` (no sitemap yet). Fetched 2026-11-01. Role: ux-ui-expert.
Companion file: `docs/site/research/conversion-sources.json` (one line per page fetched).

Owner update (2026-11-01): the product is now named **HandSolved**. The site is a static portfolio display with no backend. It keeps a normal conversion structure, and the main button opens a browser-only pop-up. Sections 1, 3, 6, 7 and 8 are worded for that and assume no working sign-up and no app link. Product facts quoted from the README still carry its old name, PokerWiz.

## 1. Answer in brief

- Strong pages keep the first screen to one promise, one primary button and one piece of proof, then show the product as a picture, explain it in three steps or pillars, repeat the same button label, and close with a band that restates the promise. Ten of 16 pages put proof in or directly under the first screen; 12 of 16 end on a closing call to action.
- Poker trainers (GTO Wizard, Upswing, PokerCoaching, Run It Once) lean on named pros and earnings. Poker trackers (Regroup, Nash, Poker Analytics, Poker Bankroll Tracker) are lean store-badge pages with little proof; only Poker Analytics puts a ratings bar under its buttons. No page combines track, coach and practice on one home page.
- No page in the set embeds a try-it demo on the home page. Every one uses screenshots or mockups. HandSolved's main button already opens a browser-only pop-up, so the pop-up can be the demo (recommendation 3). I did not test what any page's buttons do when clicked, so the sample says nothing about pop-ups themselves; the pop-up rules in recommendation 6 are judgment.
- Moves that do not fit HandSolved: pro endorsements and earnings stats, store badges or "Download" and "Sign up" buttons (there is nothing to download or sign up for), long feature lists, pricing grids and guarantees. Section 6 has the full fit table.
- Because the site has no backend and no real users yet, proof must be real or clearly labelled sample data. I recommend no invented ratings, user counts or testimonials.
- This document makes no conversion-uplift claims. None of the pages publish conversion data and I found no source I could cite.

## 2. Method, limits, and what was not fetched

- Each page was fetched with WebFetch (text reading) and with curl (raw HTML, browser user agent), then parsed. H1, subheads, CTA labels and h2 section order were checked against the raw HTML ("verified"). Proof, demo and pricing observations come from the page text; they cannot see images, video, script-injected content or A/B variants.
- Tags: [raw] = checked in raw HTML. [wf] = WebFetch text reading only.
- Not fetched: **Whoop**. WebFetch returned HTTP 403 for `https://www.whoop.com`, `https://www.whoop.com/us/en/` and `https://join.whoop.com`; curl got a Cloudflare "Attention Required!" block page; the browser tool would not start. No record and no claims for Whoop.
- First attempt at `https://www.pokercoaching.com` returned 502; `https://pokercoaching.com` worked.
- `linear.app`: WebFetch returned only a "Loading..." shell, so Linear's record is from raw HTML.
- `superhuman.com`: WebFetch and curl returned different heroes on the same day (see its record). Only the curl text is treated as verified.
- Regroup, Nash and Poker Analytics were found by web search; Poker Bankroll Tracker's domain came from a search result and the page links to the App Store and Google Play listings. Regroup's App Store listing (`https://apps.apple.com/us/app/regroup-poker-tools-charts/id6443664346`) appeared in search results and was not fetched.
- No page showed instructions aimed at an agent; all fetched content was treated as data.

## 3. Assumptions (docs/site/PROJECT.md does not exist; updated with the owner's message of 2026-11-01)

- Product name: HandSolved (renamed from PokerWiz).
- The site is a static portfolio display: no backend, no accounts, no working sign-up, no app link, no store listings, no payments.
- It keeps a conventional conversion structure: one primary button, repeated down the page, which opens a browser-only pop-up. What the pop-up contains is not decided yet (owner question 1).
- Visitor: treated as a poker player deciding whether a hand-review and GTO-coach tool is worth trying, on a phone or a desktop. The page should also read well to someone judging the site itself (owner question 3).
- Price and proof: unknown. Nothing is sold, so no prices, guarantees or checkout are assumed.

Product facts used below come from the README Features section (the product under its old name): live session log; hand recorder on a poker table; Coach grading every decision against GTO (solved 8-max preflop charts by stack depth, postflop solved per street, heads-up or 3-way); Practice and Replay against GTO opponents; session grades and insights; goals; bankroll chart; equity calculator; installable web app; CSV and JSON import and export, including Regroup CSV. On this static site these are things the page describes and shows; none is claimed as something a visitor can use unless the pop-up actually does it.

## 4. Page records

### 4.1 Poker competitors

**GTO Wizard**
- Fetched: `https://gtowizard.com` (200) [raw + wf]
- H1: "Start Crushing Poker Today"
- Subhead: "Your edge in Hold'em and PLO"
- Primary CTA: "Begin Your Journey" (to the app login). Header: "Go to App". Top promo bar: "Get 10% off your first purchase." with a "Get started" button. Secondary: none in the hero.
- Section order: hero → three pillar cards (Analyze, Study, Practice) → "Master Every Decision in Poker" → "The Best Poker Trainer in the World" → "Understand Your Game Like Never Before" → "Upgrade Your Poker IQ" → "Compete. Analyze. Rank Up." → "Multi-Tabling Made Simple" → "Game Integrity" → "Join Us in Shaping the Future of Poker" → "Questions & Answers" → closing "BeAT the best, Crush the rest" with "Try It Now!" → footer.
- Proof: two named WSOP winners under the hero button (Shiina Okamoto, "2024 & 2025 WSOP Ladies Championship Winner"; Espen Uhlen Jørstad, "2022 WSOP Main Event Winner"); an image-only logo strip (names not readable); claims such as "The largest GTO solution library in poker." No ratings or testimonials in the text.
- Interactive demo: none on the page (tabbed screens, videos; the "Daily Dose of GTO" quiz is a link out).
- Pricing visible: no (not in the nav; only the 10% promo).

**Upswing Poker**
- Fetched: `https://www.upswingpoker.com` (200, redirects to `https://upswingpoker.com/`) [raw + wf]
- H1: "Discover Garrett Adelstein's Legendary Approach to Destroying Live Cash Games."
- Subhead: "Learn the same decision-making skills Garrett used to reach the top of live cash poker, so you can read situations more clearly, exploit your opponents' mistakes, and find the best play when it matters most in live cash games."
- Primary CTA: "Explore Destroy Live Cash →". Secondary: "▶ Watch a Free Lesson". Header: "Sign Up", "Log In".
- Section order: hero with stats "50 Hands", "87 Lessons", "35+ Hours" → "AS SEEN ON" logos → "We Create Winners" (testimonials) → "Elite Poker Training / BEGINNERS START HERE" (free preflop charts, a $7 postflop playbook) → signature courses ("For Live Cash Games", "For MTTs", "For PLO MTTs") → "Train by Playing. Win More Pots. Punt Fewer." (Lucid trainer, "Start Playing For Free Now") → "Poker Strategy Articles & Tips" (Articles, Quizzes) → community → link lists → "Sign up for free poker strategies!" → footer.
- Proof: a six-logo media strip under the hero (names not readable from text); testimonials labelled "VERIFIED CUSTOMER" (Dan Ott, "Won $4.7 Million in WSOP Main Event"; Brad); figures such as "$100M+ in Combined Coach Earnings".
- Interactive demo: none embedded. The free lesson, the Lucid trainer and the quizzes are separate pages.
- Pricing visible: partly. "$7" (postflop playbook) and "$999" (three course cards) are on the page [raw]; the Lab membership price is not.

**PokerCoaching**
- Fetched: `https://pokercoaching.com` (200; `www.` host gave 502) [raw + wf]
- H1: "The complete poker training system. Beat the games that you actually play." (in the markup the first sentence is a badge, the period is screen-reader-only, and the second sentence is the visible title)
- Subhead: "Knowing the right play and making it at the table are two different skills, and you'll master both. Learn poker strategy through structured coaching, then practice real decisions with PeakGTO until the right play is automatic."
- Primary CTA: "Start Improving Today" (to /pricing/; appears 3 times). Header: "Get Started". Secondary: "Log In" (text link). Section links: "See Everything Included". Plan cards: "Start Free", "Get the Full System", "See All Plans".
- Section order (h2): hero + stats strip → "Study time that finally shows up at the table." (Learn / Train / Improve) → "From your first hand to the final table." → "From small stakes to the toughest lineups." → "Turn what you've learned into what you do at the table." → "They study the same way you're about to." → "Learn from players who win at the highest level." → "Pick how you want to start." → "Poker Coaching FAQ" → "Backed by My 30-Day No-Risk Money-Back Guarantee!" → footer.
- Proof: stats strip right under the hero button ("245K+ Members", "$210M+ Coach Earnings", "1,700+ Hrs of Coaching"); named student results with prize amounts and the disclaimer "Individual results vary. These results aren't typical or guaranteed."; coach credentials; a 30-day money-back guarantee in the plan block, FAQ and closing block.
- Interactive demo: none seen (trainer and quizzes are described only).
- Pricing visible: plan structure yes ("Start Free" with no card; "Full System" marked "Most Popular"; "Save up to 63% with annual plans"); no dollar prices read [wf]. "Pricing" is in the nav.

**Run It Once**
- Fetched: `https://www.runitonce.com` (200) [raw + wf]
- H1: "Train with the Best"
- Subhead: "Run It Once is the world’s leading poker strategy community."
- Primary CTA: "Get Started For Free" (to plans and pricing). Secondary: "Login". Header: "Sign Up free", "Log in".
- Section order: hero → "Take a Tour" (image) → "Expert Instruction" → "186 of the Toughest Pros" → "An Expansive Library" → "An Active Community" → closing "It only takes seconds to start taking your game seriously." → footer.
- Proof: counts and names only ("186" pros; instructors such as Phil Galfond and Jason Koon; two new videos daily). No testimonials, logos or ratings.
- Interactive demo: none ("Watch Example Video" link).
- Pricing visible: not on the page; plan names "Elite" and "Essential" in the nav; "Plans & Pricing" in the footer; the hero button leads to the plans page.

**PokerTracker**
- Fetched: `https://www.pokertracker.com` (200) [raw + wf]
- H1: "Now Available for Mac and Windows"
- Subhead (first supporting line, under the "PokerTracker 4" link): "The ultimate online poker software suite of tools, created for players just like you."
- Primary CTA: "BUY NOW" and "DOWNLOAD" (equal weight, side by side); line "Download The PT4 Free 14 Day Trial Today!"; nav "Get-It-Free »". Secondary: none.
- Section order: hero → "PokerTracker 4" block → "Improve Your Online Poker Game With PokerTracker 4!" → "All of the major online pokersites are supported by PokerTracker 4!" → "PokerTracker 4 Feature List" → "14-Day Free Trials Available" ("Get Started Now!") → "Popular Hand Converters for PokerTracker 4:" → "The PokerTracker Blog" → "14 day free trial download now" → "PT4 Supported Sites" → "PT4 Videos" → "Press Center" → footer.
- Proof: "Official Tracking Software" / "Sponsor of EPT Season 11" badge; one tweet; "since 2001". No counts or ratings.
- Interactive demo: none (two static screenshots, Graphs and HUD).
- Pricing visible: no ("BUY NOW" goes to the purchase page).

**Regroup Poker Tools**
- Fetched: `https://regroup.app` (200) [raw + wf]
- H1: no h1 element; hero heading "Regroup Poker Tools"
- Subhead: "The best way to track your sessions & improve your game."
- Primary CTA: App Store and Google Play badges (no text label in the HTML); "Download Now" after each of four feature blocks. Secondary: none.
- Section order: hero → "Track Your Sessions" ("The fastest and easiest poker tracker. Unlimited sessions, always free. Easily import from other apps.") → "Equity Calculator" → "Study Preflop Ranges" → "Organize Home Games" → "Extras" (Regroup Events App, Poker Hosting Tool) → closing "You've scrolled this far, it's time to get the app!" with store badges → footer ("Need help with Regroup? DM us on Instagram!").
- Proof: none (no ratings, logos or testimonials).
- Interactive demo: none.
- Pricing visible: only "Unlimited sessions, always free."; no plan table. The page does not mention CSV.

**Nash Bankroll**
- Fetched: `https://nashbankroll.app` (200) [raw + wf]
- H1: "Know your real poker results."
- Subhead: "Nash tracks every cash game, tournament, and transaction so you always know where your bankroll stands. Log hands, replay them, run equity, and see the stats that actually matter."
- Primary CTA: "Download on the App Store" (badge). Header: "Download", with "Free on the App Store" beside it. Secondary: none.
- Section order: hero → feature strip (Cash & MTT, Hand Replays, Multi-currency, Private) → "One app for your whole poker game" (four blocks: "Every session, all in one feed"; "Record and replay your biggest hands"; "Run the math at the table"; "Stats that show the full picture") → "Frequently asked questions" → "Start tracking your bankroll today" → footer.
- Proof: none beyond "Securely synced. Your data stays private to you."
- Interactive demo: none (static screenshots).
- Pricing visible: no; the FAQ mentions an optional Premium subscription without a price.

**Poker Analytics**
- Fetched: `https://www.poker-analytics.net` (200) [raw + wf]
- H1: "Poker Analytics" with "Rise to the top." on the second line
- Subhead: "The poker tracker that turns your sessions data into profitable decisions."
- Primary CTA: "Download on the App Store". Secondary: "Get it on Google Play". Header: "Download".
- Section order (h2): hero with proof bar → "The new home of your poker life" → "Everything you need" → "See your data under any angle." → "Bankroll management" → "Record now. Study later." → "Staking" → "Home screen widget" → "Switching trackers? Bring your history." → "Everything else a serious player leans on." → "Three more modules, one reporting engine" → "Private by design. Yours, always." → "The verdict from the App Store." → "Start free. Go Pro when you're serious." → "Start your new poker journey now" → "Poker Analytics 6 is on Google Play." → footer.
- Proof: bar under the buttons ("4.8 ★ App Store rating", "2,000 + ratings", "14 yrs tracking since 2012", "100 % private"); three first-name reviews; hero chart whose alt text reads "$471,438 over 1,986 sessions".
- Interactive demo: none (static screenshots).
- Pricing visible: plan names only ("Free", "Paid plans"; "Check all plans inside the app."); no prices.

**Poker Bankroll Tracker** (third tracker)
- Fetched: `https://pokerbankrolltracker.net` (200) [raw + wf]
- H1: "Poker Bankroll Tracker App"
- Subhead (an h3): "All-in-one Poker Tracker • Hand Replayer • Odds/Deal Calc. • Tournament Calendar"
- Primary CTA: three download badges (App Store, Google Play, APK); closing "Download for free:". Secondary: none. Nav: HOME, MANUAL, DOWNLOAD, FAQ, ADVERTISE, LOGIN.
- Section order (h2): hero → "Next level Poker Tracker" → "Stats, stats, stats!" → "Play live and share your session with friends!" → "Hand replayer, Odds calculator, Deal calculator, Variance calculation and more tools!" → "Available on Mobile and Desktop!" → "Main features:" → "Well-known PBT user:" → "Video tutorial" → "Scan to download" → "Contact:" → "Download for free:".
- Proof: a quote credited to upswingpoker.com in the hero; seven named players with credentials; "40 different currencies".
- Interactive demo: none; a hand-replayer "example" link opens a separate page.
- Pricing visible: no ("free" wording only). States "Export/Import your data as CSV file or user our public API." (typo in the original).

### 4.2 Track, coach, improve analogues

**Flighty**
- Fetched: `https://flighty.com` (200, no redirect) [raw + wf]
- H1: "Get the truth when you travel"
- Subhead: "The only app that tells you everything about your flight. Get real-time updates, the fastest alerts, and delay predictions so you're always the first to know and rebook—all in a sleek, easy-to-use app. Perfect for frequent flyers and simple enough for everyone."
- Primary CTA: "Get the app" (header); in-page "Give Flighty a try", first placed right after the "Import your flights in seconds" block and repeated down the page. Secondary: none seen (hero anchors "Preflight", "At the airport", "After landing" [wf]).
- Section order: hero (award line, notification mockups, pull quotes) → "Everything you’ve ever wanted to know about your flight—and more." → "Import your flights in seconds" + "Give Flighty a try" → "Share your flying with friends and family." → "Look back on your travels with Flighty Passport" → "Know what’s happening at any airport. Right now." → "From first-time flyers to million-milers, people love Flighty." → "+3 million users enjoy Flighty" → closing "Have a nice flight!" → footer.
- Proof: award lines in the hero (Apple Design Award, Winner 2023; App of the Year, Finalist 2023); unattributed pull quotes; named reviewers (for example David Pogue); "+3 million users"; quantified claims such as "25 hours before your flight".
- Interactive demo: none; the hero shows text-rendered notification mockups.
- Pricing visible: nav "Pricing" link only; no prices on the home page.

**Copilot Money**
- Fetched: `https://copilot.money` (200, redirects to `https://www.copilot.money/`) [raw + wf]
- H1: "Your money finally has a copilot."
- Subhead: "The finance app that coordinates your spending, saving, and investing, and sets you up for what comes next."
- Primary CTA: "Get started" (to /download; also in the header and the plan block). Secondary: an announcement link ("New Meet your money assistant"); header "Log in".
- Section order (h2): hero (proof line, button, dashboard mockup, "Works with 16,000+ institutions" logos) → "Meet your money assistant." → "Pick your assistant’s personality." → "All your money, in one place." → "Your household, one view." → "A few more things." → "Privacy first." → "4.8 out of 5 stars from 31,000 ratings" → "As featured in" → "One simple plan." → footer.
- Proof: one line between the subhead and the button ("Apple Design Awards Finalist", "iPhone, Mac, iPad, and Web", "4.8 stars, 31,000+ ratings") [raw]; bank and brokerage logos; App Store reviews by username; a creator quote [wf]; press logos.
- Interactive demo: none verified (UI mockups).
- Pricing visible: yes, on the home page, one plan: $9 per month or $109 billed yearly, with a Monthly/Yearly toggle [wf; the page data lists a $109 annual offer, raw]. The meta description mentions a "1-month free trial".

**Aimchess**
- Fetched: `https://aimchess.com` (200) [raw + wf]
- H1: "Learn Chess Your Way"
- Subhead: "Aimchess helps chess players like you improve faster by combining unique analytics with personalized lessons (created from your games!) to make training fun and easy."
- Primary CTA: "Try now" (to /try). Secondary: "Register" (to /auth/registration). Header: "Try now", "Login".
- Section order (h2): hero → "Aimchess: A Love Story" (video thumbnail) → "See what’s holding you back from your peak rating" → "Improve faster with personalized lessons built for you and by you" → "Train smarter with a Personalized Study Plan each week from Aimchess" → "Aimchess personalized puzzles increase your rating 31% faster than standard tactics puzzles" → "A chess coach’s dream — reduce preparation time and improve your session productivity" → "Pricing" → "Frequently Asked Questions" → "Stay connected".
- Proof: one cited research claim ("31% faster", with a footnote about a 12-week randomized field experiment by University of British Columbia researchers [wf]); one named coach testimonial (GM Ankit Rajpara). No logos or ratings.
- Interactive demo: none on the page (preview image, video thumbnail). "Try now" goes to a separate page that I did not fetch.
- Pricing visible: yes, on the page: "Free"; Premium "$7.99" billed monthly; annual "$4.85" per month ("$57.99" annual billing) [wf].

**Strava**
- Fetched: `https://www.strava.com` (200) [raw + wf]
- H1: "Community-Powered Motivation"
- Subhead: "Track your progress and cheer each other on. Join over 100 million active people on Strava for free."
- Primary CTA: three sign-up buttons of equal weight, "Sign Up With Google", "Sign Up With Apple", "Sign Up With Email". Secondary: "Log In" ("Already a Member?"). Header: "Sign Up", "Log In". Mid-page: "Join Us Now" (7 times in the HTML).
- Section order: hero (sign-up buttons) → feature band with three steps ("Start by sweating.", "Get better by analysis.", "Dive into details on desktop.") → "Join for the tracking, stay for the community." → "Explore our features." (Track & Analyze, Share & Connect, Explore & Compete) → "Ready to give it a shot?" (Join Us Now) → "Strava Subscription" → "Feature highlight: Beacon." → "Here's how a Strava subscription takes your experience to the next level." → footer.
- Proof: one number in the subhead ("over 100 million active people"); "Millions of athletes". Nothing else.
- Interactive demo: none.
- Pricing visible: no (nav "Subscription"; free to join).

**Whoop**: not fetched (see section 2).

### 4.3 SaaS conversion benchmarks

**Linear**
- Fetched: `https://linear.app` (200). WebFetch returned only "Loading..."; this record is from raw HTML.
- H1: "The product development system for teams and agents"
- Subhead: "Purpose-built for planning and building products. Designed for the AI era."
- Primary CTA: none in the hero body. Header: "Sign up" (with "Open app" and "Log in"). Announcement pill "New Loops →". Closing: "Get started" and "Contact sales". Secondary: "Contact sales".
- Section order: hero (headline, subhead, pill, product UI) → "A new species of product tool." (Purpose-built, Powered by agents, Designed for speed) → "Intake and integrations" → "Planning and monitoring" → "AI and automations" → "Build, review, and ship" → "Changelog" → customer quotes and "Linear powers over 40,000 product teams. From ambitious startups to major enterprises." with "Customer stories →" → closing "Built for the future. Available today." → footer.
- Proof: three named quotes (Nik Koblov, Head of Engineering, Ramp; Kaz Nejatian, Opendoor; Gabriel Peal, Staff Software Engineer, OpenAI) and the 40,000-team count, all placed just before the closing call to action, not in the first screen.
- Interactive demo: the hero product UI is real page markup (an issue called "Faster app launch" with an activity timeline). I did not test whether it responds to clicks.
- Pricing visible: nav "Pricing" only.

**Raycast**
- Fetched: `https://www.raycast.com` (200) [raw + wf]
- H1: "Your shortcut to everything."
- Subhead: "A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable."
- Primary CTA: none readable in the server HTML. The only hero link is "The Raycast Keyboard"; header "Log in". A download button may be added by script; I could not confirm it. Closing: "Take the short way." with "Download and use Raycast for free."
- Section order (h2): hero → "It’s not about saving time." → "There’s an extension for that." → "Meet your new virtual assistant" → "Built for professionals like you." → "Don't repeat yourself." → "What else can Raycast do?" [wf] → "Stay in the loop." → "Build the perfect tools." [wf] → "Take the short way." → footer.
- Proof: 24 named users with handles and roles (for example Guillermo Rauch, CEO, Vercel) [wf]; figures "99.8% crash-free rate", "37k members", "90k followers". No customer logos.
- Interactive demo: none verified (keyboard graphic, extension category tabs, AI chat mockup).
- Pricing visible: nav "Pricing" only.

**Superhuman**
- Fetched: `https://superhuman.com` (200)
- Verified in the curl HTML: no h1 element. The hero is a three-tab selector: "Go: AI that works where you do.", "Mail: The most productive email app.", "Docs: The all-in-one AI workspace." A banner reads "Looking for Superhuman Mail?". The active slide headline is "Save 4+ hours each week with Superhuman Mail".
- Not reproduced: the WebFetch reading gave H1 "Superpowers, everywhere you work", subhead "Mail, Docs, and AI that works in every app and tab" and a "Get Superhuman" button. The raw HTML has zero matches for "Superpowers" and "Get Superhuman", so this is unverified (possibly another variant, which would mean the hero is being tested).
- Primary CTA: "Get Mail". Secondary: "Learn more". Header: "Contact sales", "Sign in". Later: "Try Go". Closing: "Get started".
- Section order: hero tabs → "Trusted by the most innovative organizations in the world" → "Get help from agents right where you work" → "Save 4+ hours every week on email and scheduling" → "Align your team with collaborative AI documents" → "Designed for humans, built for enterprise" → "Make it your best workday yet" (with "Get started") → footer.
- Proof: logo strip directly under the hero; quantified outcome ("Save 4+ hours"); at least one customer quote set in a heading.
- Interactive demo: none verified (autoplay carousel videos).
- Pricing visible: nav "Pricing" menu lists Go + Agents, Mail, Docs, Superhuman Suite; no prices read on the page.

## 5. Patterns seen on 3 or more pages

| # | Pattern | Pages (count of 16) |
|---|---|---|
| 1 | Proof sits in the first screen or directly under it, before the first feature section | GTO Wizard (named WSOP winners), Upswing (stats row, media logos), PokerCoaching (stats strip), Poker Analytics (ratings bar), Poker Bankroll Tracker (credited quote), Flighty (award line, pull quotes), Copilot (award and rating line), Superhuman (logo strip), Strava (100 million in the subhead), Raycast (99.8% crash-free callout). 10 pages. Linear saves proof for just before its closing call to action. |
| 2 | One button label repeated down the page | Regroup ("Download Now" after each of four blocks), Strava ("Join Us Now", 7 times), Flighty ("Give Flighty a try"), PokerCoaching ("Start Improving Today", 3 times), Poker Analytics and Nash ("Download on the App Store", 4 times each), Copilot ("Get started" in header, hero and plan block). 7 pages. |
| 3 | A closing band that restates the promise and repeats the action | GTO Wizard, Upswing, Run It Once, PokerTracker, Regroup, Nash, Poker Analytics, Poker Bankroll Tracker, Flighty, Linear, Raycast, Superhuman. 12 pages. Without one: PokerCoaching (ends on a guarantee block), Copilot (ends on the plan), Aimchess, Strava. |
| 4 | "Free" is stated beside the first action | Strava (subhead), Run It Once ("Get Started For Free"), PokerTracker (14-day trial in the hero), Nash ("Free on the App Store"), Regroup ("Unlimited sessions, always free."), Poker Analytics ("Start free. Go Pro when you're serious."), PokerCoaching ("Start Free" card), Raycast (closing line). 8 pages. |
| 5 | A three-step or three-pillar block right after the hero | GTO Wizard (Analyze, Study, Practice), PokerCoaching (Learn, Train, Improve), Strava (three steps), Aimchess (diagnosis, lessons, weekly plan as three consecutive sections), Flighty (Preflight, At the airport, After landing), Linear (three principles). 6 pages. |
| 6 | The product shown as a picture or mockup in or under the hero; never as a live try-it demo | Copilot, Linear, Flighty, Poker Analytics, Nash, PokerTracker, Aimchess, Superhuman, Raycast, GTO Wizard. No page embeds a demo. The nearest are links to separate pages: Aimchess "Try now", Upswing "Start Playing For Free Now" and "Watch a Free Lesson". |
| 7 | An FAQ block before the footer | GTO Wizard, PokerCoaching, Aimchess, Nash. 4 pages. |
| 8 | Pricing is a nav link, not a home-page section | Flighty, Linear, Raycast, Superhuman, Strava, Run It Once, PokerCoaching (plan cards, no dollar prices read). Prices on the page itself: Copilot, Aimchess, Upswing (course prices). No page puts a price in the hero. |
| 9 | Import or migration treated as a selling point | Flighty (own block before its first button), Poker Analytics ("Switching trackers? Bring your history."), Regroup ("Easily import from other apps."), PokerTracker ("Popular Hand Converters"), Poker Bankroll Tracker (CSV import and export). 5 pages. |
| 10 | Named-person proof: testimonials or credentials | Upswing, PokerCoaching, Run It Once, GTO Wizard, Flighty, Copilot, Raycast, Linear, Poker Analytics (first name and country), Poker Bankroll Tracker. Trainers use pro credentials; apps use reviewers and customers. |
| 11 | Store badges as the main button on tracker pages | Regroup, Nash, Poker Analytics, Poker Bankroll Tracker. 4 pages. |

One outlier worth noting: PokerTracker's H1 ("Now Available for Mac and Windows") announces a release instead of stating a benefit. Every other H1 names a benefit, a category or an identity.

## 6. Which moves fit HandSolved

| Move | Fit | Reason |
|---|---|---|
| Outcome headline, one primary button, proof line in the first screen | Yes | Patterns 1 and 2; matches the "5 seconds to understand" rule. |
| Pro earnings, endorsements, ratings and user counts as proof | No | None exist for HandSolved; inventing them would be fabricated proof. Use product facts and clearly labelled sample data. |
| Store badges, "Download", "Get the app" or "Sign up" as the main button | No | There is no app link, store listing or working sign-up. The label should promise what the pop-up shows. |
| Three-step loop after the hero | Yes | Maps to Log, Coach, Practice. |
| Same button label repeated, closing band | Yes | Patterns 2 and 3; every repeat opens the same pop-up. |
| Embedded try-it demo | Yes, the main opportunity | No page in the set has one; the pop-up can hold it (recommendation 3). |
| Import block | Adapt | Describe Regroup CSV import and CSV and JSON export as features; no upload control on the site unless the pop-up implements it. |
| FAQ before the footer | Yes | Pattern 7; answers must be accurate about what the site does and does not do. |
| Prices on the page | No by default | Nothing is sold. Show a plan structure only if the owner wants one, labelled as an example. |
| Money-back guarantee | No | Nothing is sold. |
| Long section stacks (GTO Wizard 11 sections including careers and integrity; Poker Analytics 15) | Adapt | The product has 20+ features; pick 3 or 4 for the home page and keep 6 to 8 sections. |
| Mega nav (GTO Wizard has 9 items) | No | One product; keep the header to 5 items or fewer plus the button. |

## 7. Recommendations for HandSolved

Type: **Evidence** means the pattern is observed on the pages cited. **Judgment** means my call, not shown by the sample. Button labels and headlines below are shapes for the copywriter, not final copy.

1. **First screen: an outcome headline, a subhead that names the jobs, and one button whose label promises what the pop-up shows.** The H1 states the result a player wants in poker words; the subhead names record, grade and replay. If the pop-up shows a graded sample hand, the label can be "See a hand graded"; if it walks through a sample session, "Try a sample hand". Avoid "Sign up", "Download" and "Open the app", because none of them exists. A short line beside the button says what happens ("Runs in your browser") only if it is true. Type: Evidence for the structure (Nash, GTO Wizard, PokerCoaching, Flighty, Copilot; PokerTracker's launch-notice H1 is the counter-example). Judgment for the label rule and the line beside the button.
2. **One proof line between the subhead and the button, built from real product facts only.** Candidates from the README: preflop charts solved for the hand's stack depth, postflop solved street by street, every decision graded, CSV and JSON export, Regroup CSV import. Add no ratings, user counts, testimonials, awards or press unless they are real; any number shown in a mockup is labelled "sample data". Type: Evidence for placement (10 of 16 pages). Judgment for using product facts as proof and for the no-invention rule.
3. **Make the pop-up the demo: one graded sample hand, run in the browser.** The pop-up shows the table and one decision; the visitor picks an action and sees the coach verdict (how often GTO takes each option and what each is worth). Static data, no network. A picture of the table, carousel and coach verdict sits in the first screen so the pop-up is not the first sight of the product. If the pop-up cannot hold that, fall back to a three-screen walkthrough (record, grade, replay). Type: Evidence that the gap exists (all 16 pages use pictures; none embeds a demo; Aimchess "Try now" and Upswing "Start Playing For Free Now" send visitors to another page). Judgment that it converts better; nothing in this set measures it.
4. **A three-card loop right after the hero: Log, Coach, Practice.** Log = session and hand recorder; Coach = every decision graded against GTO; Practice = play it again or replay from any street against GTO opponents. One image and one line each; a card jumps to its section on the page or opens the same pop-up. Type: Evidence (GTO Wizard, PokerCoaching, Strava, Aimchess, Flighty, Linear). Judgment for the three labels.
5. **Repeat the same button label after each of the 3 or 4 product sections and in a closing band whose headline restates the outcome.** Every repeat opens the same pop-up. Keep the button in a sticky mobile header. Type: Evidence for repetition and the closing band (Regroup, Strava, Flighty, Poker Analytics, Nash; 12 of 16 end on a closing call to action). Judgment for the sticky header and the single pop-up.
6. **Pop-up rules.** It opens on click only (never on page load or exit intent), holds one task, has a visible close button of at least 44 by 44 px, closes on Escape and on a backdrop click, moves focus in and returns it to the button, and becomes a full-height sheet at 375 px. If scripts fail, the button still jumps to a page section with the same content. Coordinate focus handling with `a11y-architect` (WCAG 2.2 AA). Type: Judgment (standard practice; the sample did not test pop-ups).
7. **A short "Coming from another tracker?" block after the product sections, as a description.** State Regroup CSV import, CSV and JSON export, and that the product shows what an import will do before it runs (all in the README), with one screenshot. There is no upload control on the site unless the pop-up implements one. Type: Evidence for the pattern (Poker Analytics' "Switching trackers? Bring your history.", Flighty's import block placed before its first button, Regroup, Poker Bankroll Tracker, PokerTracker). Judgment for the placement and for the wording that this is a feature, not a working import.
8. **A trust block and a 5 to 7 question FAQ before the footer, accurate for a static site.** Cover what the pop-up does and where its data goes (nowhere, if it is browser-only), how the GTO is produced (preflop charts solved offline, postflop solved per street from the ranges, a benchmark against a solver), what the product records, and how import and export work as features. Leave out backup and restore claims: in the README the automatic backups are done by the product's server, which this site does not have. Type: Evidence for an FAQ before the footer (GTO Wizard, PokerCoaching, Aimchess, Nash) and for privacy statements as a section or hero line (Poker Analytics "Private by design. Yours, always.", Copilot "Privacy first.", Nash). Judgment for the contents and the exclusions.

## 8. Questions for the owner before UX.md

1. What does the pop-up contain and do: a graded sample hand, a walkthrough, a form? The button label and recommendations 1, 3 and 6 depend on it.
2. Does the pop-up collect anything (an email, a name)? With no backend, a form that looks like it submits but stores nothing needs a clear label. How should the page say it is a demo or portfolio piece, if at all, and where?
3. Who is the real visitor to write for: poker players, people judging the site as a piece of work, or both?
4. What proof is real and publishable: benchmark results (the repo has `scripts/solver-benchmark`), screenshots with sample data, anything named? Named players need their permission.
5. Should the page show any price or plan structure for realism, labelled as an example, or none?
6. May the page name Regroup as a supported import source?
7. What accuracy statement about the GTO coach may the page make?

## 9. Sources

See `docs/site/research/conversion-sources.json` (16 pages fetched; Whoop excluded because it could not be fetched).
