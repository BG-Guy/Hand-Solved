# HandSolved task board

33 tasks, written on 2026-11-01 after the owner's answers. All 33 are done; results are in `LAUNCH.md`. Statuses, titles and outputs in the tables below are final. The rules, run order, ETAs and agent notes are the original plan, kept for the record. `tasks.json` is that plan, written for the live dashboard: the same tasks with no statuses, and the original titles and output paths.

## Rules
- A task starts only when everything in Depends on is done. Tasks with the same phase and step run in parallel and must not edit the same files.
- No questions go to the owner. No task may wait on the owner: use the default in `PROJECT.md`.
- No commits, pushes or deploys. The project is not a git repo, so give reviewers a file list rather than a diff.
- `architect`, `seo-specialist`, `code-reviewer` and `security-reviewer` have no Write tool in their definitions. If one cannot write, the main session saves its reply to the Output path.

## Run order and ETA
| Phase | Step | Tasks | Minutes (longest task) |
|---|---|---|---|
| 1 Research | 1 | T1, T2, T3, T4, T5 | 15 |
| 1 Research | 2 | T6 | 8 |
| 2 Project management and questions | 1 | T7, T8 | 15 |
| 3 Planning | 1 | T9, T10 | 12 |
| 3 Planning | 2 | T11, T12, T13 | 15 |
| 3 Planning | 3 | T14, T15 | 15 |
| 4 Build | 1 | T16, T17 | 20 |
| 4 Build | 2 | T18, T19, T20 | 20 |
| 4 Build | 3 | T21 | 12 |
| 4 Build | 4 | T22, T23 | 15 |
| 5 Review and test | 1 | T24, T25, T26, T27, T28 | 6 |
| 5 Review and test | 2 | T29 | 15 |
| 5 Review and test | 3 | T30 | 12 |
| 5 Review and test | 4 | T31, T32 | 15 |
| 5 Review and test | 5 | T33 | 4 |

- **Phase totals:** 23, 15, 42, 67 and 52 minutes.
- **Phases 3 to 5:** 161 minutes, or about 2 h 40 min, once T2 and T6 are done.
- **Whole run by dependencies:** 176 minutes, because Phases 1 and 2 overlapped.
- **What the estimates include:** GateGuard's delay on first writes, and one fix loop in T32. Allow about 20% on top for other reruns.

## Phase 1: Research and inspiration
| ID | Task | Agent | Depends on | Status | Output | Est (min) |
|----|------|-------|------------|--------|--------|-----------|
| T1 | Conversion patterns research | ux-ui-expert | – | done | docs/site/research/conversion-patterns.md | 12 |
| T2 | Messaging, player language, competitor prices | web-copywriter | – | done | docs/site/research/messaging.md | 15 |
| T3 | Keyword research | seo-specialist | – | done | docs/site/research/seo-keywords.md | 10 |
| T4 | Capture reference and app screenshots | orchestrator | – | done | showcase/inspiration/, showcase/app/ | 15 |
| T5 | Run engine for real demo numbers | orchestrator | – | done | docs/site/research/demo-spots.json, docs/site/research/engine-output.json | 10 |
| T6 | Study reference screenshots | web-designer | T4 | done | docs/site/research/visual-inspiration.md | 8 |

## Phase 2: Project management and questions
| ID | Task | Agent | Depends on | Status | Output | Est (min) |
|----|------|-------|------------|--------|--------|-----------|
| T7 | Set up project board | web-project-manager | – | done | docs/site/PROJECT.md, docs/site/TASKS.md, docs/site/tasks.json | 15 |
| T8 | Ask owner the open questions | orchestrator | – | done | docs/site/PROJECT.md (Decisions) | 10 |

## Phase 3: End-to-end planning
| ID | Task | Agent | Depends on | Status | Output | Est (min) |
|----|------|-------|------------|--------|--------|-----------|
| T9 | Choose stack and hosting | architect | T7, T8 | done | docs/site/ARCHITECTURE.md | 7 |
| T10 | Sitemap and home wireframe | ux-ui-expert | T1, T2, T3, T5, T7, T8 | done | docs/site/UX.md | 12 |
| T11 | Visual direction and tokens | web-designer | T6, T9, T10 | done | docs/site/DESIGN.md, src/styles/tokens.css | 15 |
| T12 | Write site copy, set illustrative price | web-copywriter | T2, T3, T5, T10 | done | docs/site/COPY.md | 15 |
| T13 | Technical SEO spec | seo-specialist | T3, T9, T10 | done | docs/site/SEO.md | 6 |
| T14 | Motion plan | animation-expert | T9, T10, T11 | done | docs/site/MOTION.md | 6 |
| T15 | Logo, icons, SVG backgrounds, device frames | svg-expert | T10, T11 | done | src/assets/svg/ | 15 |

## Phase 4: Code and build
| ID | Task | Agent | Depends on | Status | Output | Est (min) |
|----|------|-------|------------|--------|--------|-----------|
| T16 | Project setup, navbar, reveal footer | frontend-builder | T9, T10, T11, T12, T14, T15 | done | src/layouts/, src/components/ | 20 |
| T17 | Re-capture app screens as HandSolved | orchestrator | T10, T11, T15 | done | showcase/app/final/ | 10 |
| T18 | Hero and device mockups | frontend-builder | T12, T14, T15, T16, T17 | done | src/sections/, src/assets/screens/ | 18 |
| T19 | Features, pricing, FAQ, closing CTA | frontend-builder | T12, T14, T15, T16 | done | src/sections/ | 18 |
| T20 | Hand demo, pop-ups, sign-up flow | frontend-builder | T5, T9, T10, T12, T14, T16 | done | src/components/, src/data/ | 20 |
| T21 | Assemble home, add technical SEO | frontend-builder | T13, T18, T19, T20 | done | src/pages/, including robots.txt.ts and sitemap.xml.ts | 12 |
| T22 | Page-load transition, scroll animations | animation-expert | T14, T21 | done | src/styles/motion.css, src/scripts/ | 15 |
| T23 | Product pages, legal pages, 404, host config | frontend-builder | T12, T13, T21 | done | src/pages/, src/sections/, .github/workflows/deploy-pages.yml | 10 |

## Phase 5: Review and test
| ID | Task | Agent | Depends on | Status | Output | Est (min) |
|----|------|-------|------------|--------|--------|-----------|
| T24 | Code review | code-reviewer | T22, T23 | done | docs/site/qa/code-review.md, docs/site/qa/typescript-review.md | 6 |
| T25 | Scan for banned content and data sends | security-reviewer | T22, T23 | done | docs/site/qa/scan.md | 5 |
| T26 | Accessibility review | a11y-architect | T22, T23 | done | docs/site/qa/a11y.md | 6 |
| T27 | Technical SEO audit | seo-specialist | T22, T23 | done | docs/site/qa/seo.md | 5 |
| T28 | Conversion review | ux-ui-expert | T22, T23 | done | docs/site/qa/conversion.md | 6 |
| T29 | Fix review findings | frontend-builder | T24, T25, T26, T27, T28 | done | docs/site/qa/fixes-a.md, docs/site/qa/fixes-b.md | 15 |
| T30 | Fix speed and layout shift | performance-optimizer | T29 | done | docs/site/qa/performance.md | 12 |
| T31 | Test key flows | e2e-runner | T30 | done | tests/e2e/, docs/site/qa/e2e.md | 15 |
| T32 | Final check: errors, layout shift, speed | orchestrator | T30 | done | docs/site/LAUNCH.md section 1 (no separate file) | 15 |
| T33 | Final report and go-live list | web-project-manager | T31, T32 | done | docs/site/LAUNCH.md | 4 |

## What to tell each agent
Every agent also reads `docs/site/PROJECT.md`. This list covers only what they would otherwise miss.

### Research
- **T2:** record each competitor's real monthly price, with source link and date checked. If the agent writes to a different file, change the Output here and in `tasks.json`.
- **T5:** `demo-spots.json` holds three chosen spots from real engine runs. `engine-output.json` is the raw run: six hands with their decisions, plus app screen text such as the version and commit. Both stay in `docs/`. Only T20 copies numbers into `src/`.
- **T6:** input is `showcase/inspiration/` (170 images, so give it a selection), `showcase/app/final/`, and `PROJECT.md`. It feeds T11.

### Planning
- **T9:** state the stack, the host to recommend (no deploy), one file per section so T18 to T20 can run in parallel, how section buttons open the sign-up pop-up, and where the one site-URL setting lives. Static output, smallest JS, no server, no third-party requests. A strict content security policy would also enforce that nothing is sent. The build must leave out `docs/`, `showcase/` and `.claude/`.
- **T10:** input is `conversion-patterns.md`, `seo-keywords.md`, T2's file and `demo-spots.json`. Cover the pricing section, the hand demo, the sign-up pop-up through its success step, what each button does, and the list of app screens T17 must capture.
- **T11:** input is `visual-notes.md`, `UX.md` and `ARCHITECTURE.md`. Pick one direction and proceed. Rule on how the app's ink-and-teal screens sit in the new look: as captured, or rethemed in the scratch copy through `src/global.css`. List any image slots for later Gemini use.
- **T12:** input is T2's file, `seo-keywords.md`, `demo-spots.json`, `UX.md` and the app README. Tell the agent the owner approved an illustrative price and nothing else made up, because its own rule bans invented prices. Apply the price math in `PROJECT.md`. Write the concept note from its three facts. Leave no placeholder that could ship.
- **T13:** input is `seo-keywords.md`, `UX.md` and `ARCHITECTURE.md`. That research predates the rename: read PokerWiz as HandSolved and drop old-name brand keywords. Canonical base is `https://handsolved.com`. Keep its advice to skip `FAQPage` markup and hold `WebApplication`. The illustrative price does not meet its "pricing is decided and real" condition.
- **T14:** input is `DESIGN.md`, `UX.md` and `ARCHITECTURE.md`. Hero content shows at first paint and the page-load transition must not delay LCP. The reveal footer must not shift layout. No scroll hijacking. Everything has a reduced-motion path.
- **T15:** input is `DESIGN.md` and `UX.md`. New HandSolved logo, favicon set, Open Graph art, icons, lightweight backgrounds, phone and laptop frames.

### Build
- **T16:** input is `ARCHITECTURE.md`, `UX.md`, `DESIGN.md`, `tokens.css`, `COPY.md`, `MOTION.md` and `src/assets/svg/`. Set up around the existing `docs/`, `showcase/`, `.claude/` and `src/` content; do not overwrite it. The footer carries the concept note.
- **T17:** main session. Copy the app to a scratch folder and never edit the repo. Rename it to HandSolved: a search finds the old name in 9 files under `src/` and `index.html`, and 4 under `server/`. Apply T11's ruling on the look. Run on localhost with seeded sample data (`server/data/` holds no database today). Never connect to the live app. Reuse a capture already in `showcase/app/final/` only if it meets all of this. Check every capture by eye for the old name.
- **T18 to T20:** own files only, no edits to shared layout; T21 assembles. Read the library index and only the entries named in `PROJECT.md` or `UX.md`. Replace all library sample text.
- **T18:** copy chosen screens from `showcase/app/final/` into `src/assets/screens/`. Never use `showcase/inspiration/`.
- **T19:** price and plan come from `COPY.md`. No competitor names.
- **T20:** browser only. One empty function marks where a future back end plugs in. No network call, form action, beacon or storage of typed input. The success step shows the concept note. Copy demo numbers from `demo-spots.json` unchanged. If a spot does not show cleanly, use fewer spots; never adjust or invent numbers.
- **T21:** follow `SEO.md`, with the one site-URL setting. Home comes first.
- **T23:** the Features page is the first thing to cut if time runs short. Host config is a file only.

### Review and test
- **T24:** give it the file list. If T9 chose TypeScript or React, also run `typescript-reviewer` or `react-reviewer` in this step. Look for leftover library sample text.
- **T25:** scan `src/` and the build for `onrender`; `pokerwiz` in any case, including file names and alt text; competitor names; `fetch`, `XMLHttpRequest`, `sendBeacon` and form `action`; storage of typed input; third-party hosts; secrets; and anything from `docs/`, `showcase/` or `.claude/`.
- **T26:** static review. Focus on pop-ups, the navbar menu, the reveal footer, motion and contrast.
- **T28:** review mode against `UX.md`, covering the hero, button reach on phones and the pricing section.
- **T29:** fix all critical and high findings, and medium ones if quick.
- **T30:** measure the built site, then fix. Compress screens and subset fonts. Targets are the M5 pass marks in `PROJECT.md`.
- **T31:** navbar links, every main button opening its pop-up, sign-up through the success step with the concept note, no request on submit, Esc and focus return, phone width, reduced motion.
- **T32:** main session, in Chrome DevTools at phone and desktop sizes: console, network, Lighthouse, and a trace for CLS, LCP and INP. Screenshots at 320, 375, 768 and 1280 px. Check every device screen by eye for the old name. Send failures to `frontend-builder`, then re-check once.
- **T33:** input is `docs/site/qa/`. Report results against the M5 pass marks and update the go-live list. The report must carry R1 for the owner to fix.

## Not scheduled
- `backend-builder`: no back end, by the owner's decision.
- `gemini-image-prompter`: image generation is skipped for now. See Hooks for later in `PROJECT.md`.
- `code-architect`: T9 covers structure.
- `tdd-guide`: nothing to test beyond the flows in T31.
- `react-reviewer`: not needed, the stack has no React. `typescript-reviewer` ran with T24.
