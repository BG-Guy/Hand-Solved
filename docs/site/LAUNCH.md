# HandSolved: final report and go-live list

For the owner. Written 2026-11-01. The site is finished and runs on your own machine. Nothing is published, committed or deployed. **Every pass mark is met, with the two notes in section 1. One job is urgent and has nothing to do with this site: see section 2, and do it today.**

## 1. Result against the M5 pass marks
M5 is the QA milestone, and these marks come from `PROJECT.md`. Final build, phone and desktop, unless a row says otherwise. All of this is lab testing on one laptop, not real visitors.

| Pass mark | Result | What was measured |
|---|---|---|
| No console errors or failed requests | Met | 0 and 0, apart from the 404 page's own 404 status |
| Layout shift (CLS) at most 0.1 | Met | 0 on load. While scrolling: 0.0022 on a phone, 0.0064 on desktop (earlier lab run) |
| Main content visible (LCP) within 2.5 s | Met | Phone: 1.2 s home, 2.0 s review page, 1.2 s recorder. Desktop under 1 s (earlier lab run) |
| Response to a tap or click (INP) within 200 ms | Met, note 1 | 96 ms at worst (earlier lab run) |
| Sign-up sends no request and stores nothing typed; no third-party requests | Met, note 2 | 0 requests to other hosts. Storage is identical before and after. The browser itself refuses any send |
| Concept note in the footer and the sign-up success step | Met | End-to-end tests in all four browsers |
| No `onrender` or `pokerwiz` in the build; every device screen shows HandSolved only | Met | 0 matches in the final build, file names included. Screens checked by eye |
| Pop-ups work by keyboard, close with Esc, return focus; reduced motion works; no sideways scroll at 320 px | Met | End-to-end tests. No sideways scroll at 320, 375, 768 or 1280 |
| No open critical or high review findings | Met | No critical findings. The 4 high findings are fixed |

- **Note 1:** INP was not re-measured on the final build. It comes from an earlier lab run (`qa/performance.md`), and true INP needs real visitors. Blocking time (TBT) on the final build is 0 ms everywhere, which points the same way.
- **Note 2:** the submit itself sends nothing. With a mouse, though, the success step puts a button under the pointer, and the browser may then load that button's pop-up script from this site. It is the same file any visitor gets and carries nothing typed. A keyboard submit makes no request at all.

Other final numbers:
- **End-to-end tests:** 141 tests in each of 4 setups (desktop Chrome, mobile Chrome, WebKit with iPhone metrics, desktop Firefox): 535 passed, 0 failed, 29 skipped by design.
- **Lighthouse** (`/`, `/gto-hand-review`, `/live-poker-hand-recorder`, phone and desktop): performance 99 to 100, accessibility 100, best practices 100, SEO 92. Home on a phone totals 179 KiB.
- **That SEO 92 is a false alarm.** It is one failed audit, `robots-txt`. Lighthouse fetches robots.txt from inside the page, and the site's strict `connect-src 'none'` rule refuses it. robots.txt serves correctly over HTTP, and on a temporary copy with that one rule relaxed, SEO scored 100. The rule stays on purpose: it is what makes "nothing is sent" enforced by the browser.
- **Accessibility scan (axe-core):** all 6 pages at 375 and 1280 wide, and both pop-ups open: 0 violations.
- **Pop-up:** the first answer button is on screen when a hand opens at 375x667, 393x727, 360x740, 412x780, 390x844 and 1280x800, for all three hands.
- **Size budgets, home, gzipped:** HTML 24.86 of 30 KB, CSS 25.06 of 30 KB, JS 10.35 of 11 KB on load and 19.35 of 25 KB in total.
- **Throttled phone run, home:** LCP 0.62 s, scroll CLS 0.0022, TBT 0 ms, first view 209.5 KB.

## 2. Do this first, whatever happens to this site (R1)
Your real data sits in the live app with no login. Anyone with its address can download, replace or delete all of it through the app's API.

1. In your own browser, open the app, go to **Profile** and press **Download backup**. Keep the file safe.
2. In Render's dashboard, open that service and **suspend** it. Suspend, don't delete: the app's Render setup keeps the database on that service's disk.
3. Bring it back only behind a login (`ARCHITECTURE.md` section 10, items 1 and 2). One shared password checked ahead of all routes works as a stopgap.

What this team did: the site never links to or calls that address, and the build check fails if it appears. Nobody called its data routes beyond one read-only status check by the main session. That check showed counts only, no hand, session or note content. Per the app's code, its status route gives the number of sessions, hands, goals and automatic backups, plus the date of the newest backup. (`ARCHITECTURE.md` section 10 says nobody calls the server; this is the exact record.)

## 3. Not tested, and can't be from here
- **Real iPhones and Android phones.** The "iPhone" tests are desktop WebKit in a phone-shaped window. Real touch scrolling, browser toolbars, the on-screen keyboard and double-taps are unproven.
- **Real screen readers** (VoiceOver, NVDA, JAWS, TalkBack). Tests check names, roles and focus, not what is actually spoken.
- **Safari below 26.** The fallback it needs for scroll effects was tested in Firefox, not in that Safari.
- **Sheet drag on real touch.** Dragging a phone pop-up down to close it.
- **The live host.** GitHub Pages' own 404s, URL case, caching and HTTPS. There is no live site to test.
- **Also:** the page-to-page transition (test tools break it, so check it by hand in Chrome) and speed for real visitors.

## 4. Decisions you may want to change
You gave the direction for the name, the 30% rule, a fresh look and the concept note in your answers of 2026-11-01 (`PROJECT.md`, Decisions). How they were carried out, and the rest of this list, was settled without asking you again.
- **Name: HandSolved.** handsolved.com was unregistered per the registry at check time. It is not bought, and that check is not a trademark clearance. The app's repo is still called PokerWiz; the screenshots come from a renamed scratch copy.
- **Price: $34 a month, or $27 a month billed yearly.** Made up on purpose: 30% under GTO Wizard Starter ($49 and $39), rounded down. That is one vendor and one tier. Source and date are in `COPY.md`, Price notes. The site names no competitor and does not state the 30%.
- **A free tracker tier.** Free ($0) logs and tracks sessions; Pro adds the coach and practice. The app has no paywall today, so this split is illustrative.
- **Look: "Two Inks".** A printed deck of cards in black and red (`DESIGN.md`). App screens keep the app's own dark teal.
- **No testimonials or invented proof.** Real screens and real engine numbers carry the page.
- **Concept note on the site.** "Concept site, illustrative prices, nothing is collected or sent." It is in the footer and menu, and the same message is in pricing, the FAQ and the sign-up steps.
- **Search listings don't say "concept".** Page descriptions and structured data read like a live product, so a visitor sees the note only after landing (`qa/scan.md` N4).
- **Legal pages.** `/privacy` and `/terms` are plain-words pages written by the team, not a lawyer, with no contact address and no age line. They are yours to review.

## 5. Small items left
None of these affects a pass mark. The reports in `qa/` are snapshots: the five items `fixes-b.md` lists as open and the two bugs in `e2e.md` are since fixed, checked in the source and the final test run.
- **Second click on a fold-out.** The second click of a double-click can still open or close a native disclosure such as "What am I looking at?". Cosmetic.
- **Very short phone windows.** At 568 px tall the first answer sat about 90 px below the visible area when last measured, before the last fix. A "Pick your move" button shows there and scrolls to it.
- **Range chart colour.** Raise and call still differ by colour only. A text list sits under each chart; the second cue suggested in `qa/a11y.md` (A11Y-04) was not done.
- **Phone bar and keyboard focus.** A few focused controls sit partly under the bottom bar, never fully hidden.
- **Words to read.** "About 20 seconds a hand" under the hero button is still an estimate; no report records the timing `COPY.md` asked for. FAQ 1 repeats itself on "graded against GTO", and three FAQ link sentences were written by a builder.
- **File tidying.** 24 screen-size rules use px where the rest use rem, which only matters at larger browser text sizes (`qa/code-review.md` L6). `SEO.md` still needs the four corrections listed in `qa/seo.md`.
- **Optional hardening.** `qa/scan.md` N1 to N3 and N6: tighter build rules and pinned versions in the deploy workflow, plus one advisory in a build-only tool. No impact on visitors found.
- **Dated upkeep.** Move `.nvmrc` to 24.22.1 on 2026-11-03. Review Astro 7.4.x on 2026-11-11 (`ARCHITECTURE.md` section 1).

## 6. Go-live, if you ever want to publish
Nothing here is needed unless you ask for a deploy. The recommended host is GitHub Pages. Do section 2 first.
- [ ] **Keep the working files private.** This folder is not a git repo yet, Pages on a free plan needs a public repo, and `.gitignore` does not exclude `docs/`, `showcase/` or `.claude/`. They hold the open app's address, competitor prices and other companies' screenshots. Publish from a repo holding only the site.
- [ ] **Buy the domain,** handsolved.com. Another domain is a one-line change: `site` in `astro.config.mjs`.
- [ ] **Deploy** with the included manual workflow, `.github/workflows/deploy-pages.yml`: set the repo's Pages source to GitHub Actions, then start it from the Actions tab.
- [ ] **DNS and HTTPS.** Set the custom domain in the repo's Pages settings (a `CNAME` file is ignored with this workflow), point DNS at it, turn on Enforce HTTPS.
- [ ] **Submit the sitemap,** `https://handsolved.com/sitemap.xml`, in Google Search Console.
- [ ] **Check on the live site:** an unknown address shows the 404 page with a 404 status, the favicon and social images show, and the rest of `SEO.md` section 11B passes.

Not needed: redirects, analytics, an email provider, a form delivery test.

**If you add real sign-ups,** first change the concept note and rewrite `/privacy` (and `/terms`), because they say nothing is collected. The site would also have to leave GitHub Pages, and the app needs the login and per-user work in `ARCHITECTURE.md` section 10.

## 7. How to run it
In a terminal, in this folder. Start with `nvm use`. The first time, also run `npm ci`.
- **See the site:** `npm run build`, then `npm run preview`, then open http://localhost:4321. Ctrl+C stops it.
- **Check the build:** `npm run verify` runs the type check, the build, and the site's rules and size budgets.
- **Run the browser tests:** keep the preview running, and in a second terminal run `npm run test:e2e` (about 7.5 minutes). The first time, also run `npx playwright install chromium webkit firefox`.
