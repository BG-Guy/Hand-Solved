# HandSolved

Concept product site for the owner's portfolio. Planned address: handsolved.com. The app behind it is still called PokerWiz in its repo; that name never appears on the site.

The owner's answers of 2026-11-01, relayed by the main session, replace the earlier brief wherever the two differ. See Decisions.

## Goal
Show the owner's skill in their portfolio with a concept site for HandSolved, a poker tracking and coaching app, that looks and behaves like a real product site built to convert.

## Audience
- **Who visits:** people viewing the owner's portfolio. Within seconds they need to see a polished, believable product site in which every button and pop-up works.
- **Who the page speaks to:** live cash and tournament players who log their sessions and want feedback on their decisions. They need to see what it does, proof from the real product, and a price.

Both are PM defaults, not owner statements.

## Primary conversion
Browser-only sign-up. A main or pricing button opens a pop-up, the visitor enters an email, and a success step shows the concept note. Nothing is sent or stored.

Secondary action: try the hand demo, which uses real numbers from the engine.

## Pages (v1)
Final list, as built:
- **Home:** `/`, the priority.
- **GTO hand review:** `/gto-hand-review`, how a hand gets graded, with a worked example.
- **Live poker hand recorder:** `/live-poker-hand-recorder`, how a hand gets recorded.
- **Privacy:** `/privacy`. It stayed, as a short plain-words page: concept site, nothing collected.
- **Terms:** `/terms`, in the same style.
- **404**

T9 and T10 replaced the first plan (Home, Features, 404, no Privacy page). See `ARCHITECTURE.md` section 2 and `UX.md` section 1.

## Must-haves / Out of scope

### Must-haves
| Must-have | Planned in | Built in | Checked in | Library starting point |
|---|---|---|---|---|
| Reveal footer | T10, T14 | T16 | T32 | `components/premium/reveal-footer.md` |
| Page-load transition | T14 | T22 | T30, T32 | `components/transitions.md` |
| Interactive pop-ups | T10 | T20 | T26, T31 | `components/premium/spring-modal.md` |
| Smooth scroll animations | T14 | T22 | T30, T32 | `components/animations.md`, `components/premium/scroll-timeline.md` |
| Lightweight SVG backgrounds | T11 | T15 | T30 | `components/backgrounds.md` |
| Modern navbar | T10 | T16 | T26, T31 | `components/premium/floating-navbar.md` |
| Sleek device mockups | T10, T11 | T15, T17, T18 | T32 | `components/premium/sticky-showcase.md` |
| Solid technical SEO | T13 | T21, T23 | T27 | None. T13's spec is the source. |
| Illustrative pricing (new) | T10, T12 | T19 | T28, T31 | `components/premium/pricing-plans.md` |
| Concept note (new) | T12 | T16, T20 | T31, T32 | None. |

**Concept note:** one line in the footer and in the sign-up success step, saying this is a concept site, prices are illustrative, and nothing is collected. T12 writes the wording.

Library entries are starting points. T10, T11 and T14 make the choices.

### Out of scope
- Any back end: server, email provider, database, real payment.
- Analytics, trackers and third-party requests of any kind. Any of them would make the concept note false.
- Accounts, login, links to a running app, and download or app-store buttons.
- Testimonials, user counts, ratings and made-up statistics. The owner approved a made-up price and nothing else.
- Competitor names or price comparisons on the site.
- Library proof sections with nothing real to fill them: `testimonial-wall`, `logo-marquee`, `swipe-deck`.
- Gemini image generation (see Hooks for later).
- Any change to the app repo. Blog or CMS.

## Constraints
- **Deadline:** the build runs start to finish with no more questions to the owner. No task may wait on the owner.
- **Cost:** no paid keys or outside accounts.
- **Hosting:** static output. T9 recommends a host. Nothing is committed, pushed or deployed unless the owner asks. The project is not a git repo, so reviewers get file lists rather than diffs.
- **Published output:** `docs/`, `showcase/` and `.claude/` stay out. `docs/` holds competitor prices and the live app's address. `showcase/inspiration/` is other companies' work, for study only.
- **Brand:** fresh direction. The app's palette and fonts do not bind the site. `web-designer` picks one direction and proceeds without owner sign-off.
- **Fonts:** self-hosted, so the site makes no third-party requests.
- **Live app:** never link to, embed or call the live app (its address is in the owner's notes, not here), from the site or from any task.
- **Product truth:** app source at `/private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/repos/pokerwiz-remote` (v0.5.0, README Features). Ignore `~/Code/PokerWiz`, a stale checkout. Feature claims must match the README. No promise of winnings.
- **Numbers:** real numbers come from local engine runs (`docs/site/research/demo-spots.json`, drawn from `engine-output.json`). The repo's engine-vs-solver benchmark predates the current engine and is not usable as a claim.
- **Screens:** from a scratch copy of the app renamed to HandSolved, on localhost, with seeded sample data only.
- **Component library:** `/private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/repos/web-component-library`. `CLAUDE.md` is the index; read only the files a task needs. Where its rules differ from this brief, this brief wins:
  - It says no automated tests unless asked. The owner asked for testing in Phase 5.
  - It says one or two attention effects per page. The owner's must-have list stands; keep one per section.
  - It says deliver one self-contained file. T9's structure stands.
  - It assumes Geist from Google Fonts. Fonts are T11's choice and self-hosted.
  - `src/styles/tokens.css` is the only token source. It keeps the library's token names so modules still work.

## Open questions
None. All closed on 2026-11-01. No more questions go to the owner.

## Decisions

### Owner's answers
| # | Topic | Decision |
|---|---|---|
| 1 | Purpose | A display for the owner's portfolio only, with no real back end ("Maybe in the future I'll add what's needed"). Main buttons and pop-ups work in the browser only and send nothing. |
| 2 | Pricing | A made-up price 30% lower than the competitors. `web-copywriter` is collecting real competitor prices. |
| 3 | Name | HandSolved at handsolved.com, used everywhere on the site. The registry shows the domain unregistered and a search found no poker product using the name. Nothing is bought yet. The repo's app stays PokerWiz. |
| 4 | Look | Fresh direction, not tied to the app's ink and teal. |
| 5 | Note | The concept note, in the footer and the sign-up success step. |
| 6 | Live app | Never link to it. It stays in the report as a risk for the owner to fix. It no longer blocks this site. |

### PM defaults
Set because questions are closed. The owner has not seen these.

| Topic | Default |
|---|---|
| Audience | As written under Audience. |
| Price math | T2 records each competitor's real monthly price with source and date. The plan was a median of comparable products. T12 used one anchor instead, GTO Wizard Starter, multiplied by 0.7 and rounded down to $34 and $27, so the result stays at least 30% below. The math stays in `COPY.md`. |
| Price claim | "30% lower" sets the number. The site does not state it or name a competitor, because a made-up price cannot back a claim about real companies. |
| Plans | One paid plan. More tiers only if every listed feature exists in the app. As built: Free and Pro. |
| Structured data | The price stays out of schema: no `offers`, no `aggregateRating`. `seo-keywords.md` says to add `WebApplication` once pricing is real, and this price is not real, so that stays on hold. |
| Language | English only. |
| Identity | No personal name, email or portfolio link on the site, because none was given. |
| Site URL | `https://handsolved.com`, held in one setting. |

## Hooks for later
| Later step | Where it plugs in | Today |
|---|---|---|
| Real sign-up | One empty function in T20's sign-up flow | Sends nothing. When it goes live, first change the concept note and rewrite the Privacy and Terms pages. |
| Gemini images | Image slot list in `DESIGN.md`. `gemini-image-prompter` writes prompts from `DESIGN.md` and `COPY.md`, and a person runs them. | SVG art and real screens only. No layout waits on raster images. |
| Domain | The one site-URL setting | Points at handsolved.com. |
| Real proof | A new section once real quotes or numbers exist | No empty slot ships. |
| Analytics | None | Adding it makes the concept note false, so the note changes first. |

## Milestones
M1 Discovery → M2 Structure & design → M3 Content → M4 Build → M5 QA → M6 Launch

| Milestone | Owner's phase | Tasks |
|---|---|---|
| M1 Discovery | 1 Research, 2 Project management and questions | T1–T8 |
| M2 Structure & design | 3 Planning | T9, T10, T11, T14, T15 |
| M3 Content | 3 Planning | T12, T13 |
| M4 Build | 4 Code and build | T16–T23 |
| M5 QA | 5 Review and test | T24–T32 |
| M6 Launch | Not part of this build | T33 lists the steps. |

**M5 pass marks,** at phone and desktop widths:
- No console errors or failed requests.
- CLS at most 0.1, LCP at most 2.5 s, INP at most 200 ms.
- Sign-up sends no request and stores nothing typed. The page makes no third-party requests.
- The concept note shows in the footer and the sign-up success step.
- The build has no `onrender` and no `pokerwiz` in any case, and every device screen shows HandSolved only.
- Pop-ups work by keyboard, close with Esc and return focus. Reduced motion works. No sideways scroll at 320 px.
- No open critical or high review findings.

M5 is not done until these pass. T33 reports any miss rather than asking the owner. Results are in `LAUNCH.md` section 1.

## Risks
| # | Risk | What we do | Owner |
|---|---|---|---|
| R1 | The live app exposes the owner's real data with no login. The README's API lists endpoints that download or replace all data. | The site never links to or calls it (T25 scans). T33's report tells the owner. It does not block this site. | Owner to fix |
| R2 | The old name reaches the site through text, alt text, metadata, file names or screens. | T17 renames a scratch copy and checks every capture by eye. T25 scans the build. T32 checks by eye. | T17, T25, T32 |
| R3 | "Nothing is collected" turns false through analytics, third-party fonts, a form action or stored input. | No third-party requests. T25 reads the code. T31 and T32 watch the network. | T25, T31, T32 |
| R4 | The made-up price reads as a real offer or a claim about real competitors. | Concept note on the site, no competitor named, no price in schema, and the plan lists real features only. | T12, T13, T25 |
| R5 | `web-copywriter`'s own rule bans invented prices, so it may leave a placeholder. | T12's brief says the owner approved an illustrative price, and nothing else made up. | Main session |
| R6 | App screens in ink and teal clash with the fresh look. | T11 rules on it. Retheming the scratch copy through `src/global.css` is allowed. T17 follows the ruling. | T11, T17 |
| R7 | The page-load transition or reveal footer delays the hero or shifts layout. | T14 plans around it, T30 fixes, T32 measures. | T14, T30, T32 |
| R8 | handsolved.com is not bought and could be taken. A name search is not a trademark clearance. | One site-URL setting. Buying it is on the go-live list. | Owner |
| R9 | Research written before the rename still says PokerWiz (`seo-keywords.md`). | T12 and T13 read it as HandSolved and drop old-name brand keywords. | T12, T13 |
| R10 | No real proof weakens the page. | Real screens and real engine numbers carry it. | T10, T12 |
| R11 | Library sample text about home services stays in the page. | Builders replace all of it. T24 checks. | T18–T20, T24 |

## Launch blockers
None. An email provider and the live app do not block this site, by the owner's decision.

### Go-live list
Needed only if the owner asks to publish. The current list is `LAUNCH.md` section 6.
