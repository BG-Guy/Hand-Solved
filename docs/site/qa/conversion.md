# HandSolved home page: usability and conversion review

Role: ux-ui-expert, review mode. Written 2026-11-01. Site: http://127.0.0.1:4321 with its real CSP. Chrome through Playwright, real wheel scrolling and touch taps, viewport screenshots only, at 375x667, 390x844 and 1280x800. Compared against `docs/site/UX.md` (sections 2, 4.1, 6, 8) and `docs/site/research/conversion-patterns.md` section 7. Motion timing was not judged because `src/styles/motion.css` was being finished; mid-animation states I saw and did not count are listed at the end.

No console errors, page errors or failed requests in any run that recorded them (home at all three widths, the pop-up flows, the menu test, both supporting pages). No sideways scroll at any of the three widths (document width equals viewport width).

## Result

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH | 1 |
| MEDIUM | 4 |
| LOW | 6 |

Top finding (H1): in the sample-hand pop-up, no answer button is visible when a hand opens on a phone, on any of the three hands, at 375x667 and at 390x844. The first button is 304 px below the screen on hand 1 at 375x667.

## The six questions, answered

### 1. Five-second test: pass, with one soft spot

First screen at 375x667: kicker "Live poker session tracker and hand recorder", H1 "Every hand you play, solved.", a subhead that defines GTO in the same sentence ("the strategy a poker solver computes"), a full-width red "Grade a sample hand" button, "See how it works", and "About 20 seconds a hand. Runs in your browser." A poker player gets it from the words live, hand and GTO. A portfolio judge gets it from "tracker", the button label, and the micro-line that says what happens.

Main button, measured: 375x667 top 511, bottom 567 (100 px to spare). 390x844 top 515, bottom 571. 1280x800 top 667, bottom 723, plus a second button in the header. Visible without scrolling at all three.

Soft spot: at 375x667 there is no product image in the first screen (the art starts at y=683, 16 px under the fold), see L5.

Screens: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-375x667.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-390x844.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-1280x800.png.

### 2. Sample hand to success: taps, scrolling, and where the buttons sit

Taps from first screen to the early-access success step: 8 taps plus one typed email (hero button, 3 answers, 2 x "Deal next hand", "Get early access", "Get early access" submit). Every step worked at all three widths, the invalid-email error ("Add an @, like name@example.com.") and the success step included.

Position of the first answer button when a hand opens (question state). Visible body = the scrolling area of the pop-up, between the header and the pinned footnote strip.

| Viewport | Hand | Intro open | First button top (px) | Below the screen by | Scroll to see the first button fully | Scroll to see all buttons |
|---|---|---|---|---|---|---|
| 375x667 | 1 (2 options) | yes | 971 | 304 | 454 px (2 flicks) | 529 px (3 flicks) |
| 375x667 | 2 (4 options) | no | 827 | 160 | 309 px (1 to 2 flicks) | 384 px |
| 375x667 | 3 (5 options) | no | 851 | 184 | 334 px (2 flicks) | 484 px (2 flicks) |
| 390x844 | 1 | yes | 972 | 128 | 278 px | 353 px |
| 390x844 | 2 | no | 827 | inside the screen, but under the footnote strip (66 px below the visible area) | 133 px | 208 px |
| 390x844 | 3 | no | 852 | 8 px below the screen, and under the footnote strip (91 px below the visible area) | 158 px | 308 px |
| 1280x800 | 1 | yes | 728 | 18 px under the visible area | 88 px | 88 px |
| 1280x800 | 2 and 3 | no | 573 / 628 | visible | 0 | 12 / 145 px |

Why the first screen of the pop-up has nothing to press at 375x667: 473 px of visible body, minus a 253 px table scene, leaves about 220 px, and that is filled by the "What am I looking at?" paragraph and the "What do these words mean?" row. The next heading shows only as a clipped sliver above the footnote strip. The footnote strip ("Saved sample run from the real engine. Live solves can differ slightly. Amounts in big blinds.") is pinned at 83 px high in every state, at 375 and at 390 wide.

Collapsing the explainer alone is not enough: hands 2 and 3 already collapse it, and their first button is still 160 and 184 px below the screen at 375x667. What actually pushes the buttons down is the two story paragraphs ("Three of a kind, medium. It beats 64% of possible hands." and "The player on the button, the dealer seat, raised before the flop...") at 190 to 215 px, plus the table scene and the pinned footnote. A sticky answer dock is also a poor fit: hand 3 has five options, which makes a three-row dock of about 210 px, 44 percent of a 473 px body. See H1 for the fix.

Next hands and early access: hand 2 and hand 3 open scrolled to the top (table visible), the verdict view keeps its action row pinned ("Deal next hand" and "Get early access", 56 px high), and after hand 3 the pinned pair flips to "Get early access" (primary) and "Start over". Early access opens as a compact sheet with the field focused, a plan chip when opened from pricing, an inline error, and a success step that shows the checked address and repeats the concept note.

### 3. Is the button reachable at all times on a phone? No, not through the story

Measured with real scrolling at 375x667 (page height 17,556 px = 26 screens). The bottom bar is 81 px tall (586 to 667):

| Scroll range (px) | Bar | Note |
|---|---|---|
| 0 to 450 | hidden | hero button on screen |
| 600 to 750 | shown | about 300 px flash |
| 900 to 4,200 | hidden | 3,450 px, the pinned story (about 5 screens) |
| 4,350 to 15,900 | shown | |
| 16,050 to end | hidden | closing band and footer |

In the hidden stretch the only routes are the story's own button at the end of the story (y=3,933) or Menu then "Grade a sample hand" (2 taps). See M1. At 390x844 the pattern is identical when mapped the same way: hidden 0 to 450, shown 600 to 750, hidden 900 to 4,200, shown 4,350 to 15,600, hidden from 15,750.

Does the bar sit on the reveal footer's links? No. The bar is hidden and inert once the footer is 20 percent in view; at the two final positions (16,443 and 16,889) it is parked at 667 to 748, off screen. At 15,876 it covers most of the closing band's first 105 visible px (its heading) for one step, which is harmless.

Does the navbar cover content? The floating pill (16 to 72 px, fixed) covers the top 72 px while content scrolls under it, which is normal. Anchors land correctly: Menu then Pricing puts the section at y=88 and its heading at y=207, nothing hidden. At the very end of the page on 375x667 the footer (779 px) is taller than the screen, so its first links sit above the fold under the pill and are reached by one flick up; not a defect.

Bar over in-page buttons: the "numbers" button (scroll 10,206) and the Pro plan button (scroll 14,175, 14 px overlap) pass under the bar while scrolling. Normal; the stacking of two red buttons in the pricing section is L2.

### 4. Does the story hold together? Yes, with one repetitive section

Section heights at 375 wide: hero 1,393, story 3,056, engine 2,143, highlights 2,881, numbers 1,478, toolbox 1,495, data 1,261, pricing 1,826, FAQ 858, closing band 339, footer 779.

The order works: promise (hero) then how it works (Log it, Coach it, Practice it) then the proof moment (the red band "Three of a kind. Still a fold." with a real hand and the button next to it) then substance (engine, with a real preflop chart) then personality (highlights) then results (numbers, ends with "That is the tracker half. Now grade a hand.") then breadth (toolbox) then portability (data) then price, FAQ, close. No section is empty. Nothing is cut off on phones. The reveal footer looks right at rest on desktop (red card, "Pick a move. See the grade.", the button, three link groups, copyright and concept line) and is an in-flow red card on phones. Mid-reveal on desktop it is dimmed; that is a motion state. Nothing looked broken in it.

Weak spots: highlights is repetitive (M4); the hero art caption collides with the proof strip on phones (M2); the table scene collides with your cards in hand 2 (M3).

### 5. Pricing: understandable; the concept note works but over-repeats

Free $0 and Pro $34 a month, or $27 a month billed yearly ("Billed yearly at $324", "Save $84 a year", which is 12 x 34 minus 324). The Monthly/Yearly toggle works (checked). On phones Pro comes first. Both buttons say "Get early access" and open the early-access sheet with a plan chip ("Plan: Pro, $34 a month (concept pricing)"). Feature lists are concrete (not checked against the app README in this pass). A reader can tell what each plan costs and includes in one screen.

The concept note does its job: it is in the menu panel, the pricing section, FAQ 7, the footer, the early-access sheet and the success step, and the wording is plain. It does not undermine the page as a whole. It over-repeats inside the pricing section and the success step (L1).

### 6. Supporting pages: both work as landing pages

`/gto-hand-review` and `/live-poker-hand-recorder` each give: breadcrumb, an H1 that echoes the target query ("GTO hand review for your live poker hands", "Live poker hand recorder, one action at a time"), a one-sentence value line, the red button fully visible at 375x667 (top 440, bottom 496) and at 1280x800, a secondary anchor link, then content that earns the visit. The GTO page has the worked example as plain HTML (table of options, "Best move 100", "Blunder 6", the sample-data phone), so it also works without scripts. Both end with the same closing band and footer. One message-match gap on the recorder page (L6).

Screens: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-gto-375-00.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-gto-1280-00.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-rec-375-00.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-rec-1280-00.png.

## Findings

```text
[HIGH] H1  Sample-hand pop-up opens with nothing to press on phones
Page/Section: Home › Grade a sample hand pop-up, choose state (src/components/SampleHandDialog/views.ts:24-29, SampleHandDialog.astro:48 and 93-95, SampleHandDialog.css table scene ~716-726)
Problem: At 375x667 the first answer button is at y=971 on hand 1 (304 px below the screen), 827 on hand 2 (160 px below), 851 on hand 3 (184 px below). At 390x844: 972 / 827 / 852; hand 2's button is inside the screen but under the 83 px footnote strip. On a 1280x800 desktop, hand 1's buttons are 18 px under the visible area. What the visitor sees on open: the table, an expanded "What am I looking at?" paragraph, a closed glossary row, and a clipped sliver of the next heading. There is no button, no "scroll" cue and no fade. A visitor who does not scroll sees an explainer and can close it.
Impact: This is the page's primary conversion (finish one graded hand). Every phone visitor pays 2 to 3 extra flicks (at 375x667) before the first decision, and some will never find the buttons.
Fix, in this order (stop when the first button is on screen at 375x667):
  1. Decision before reading. In views.ts choose(), emit: heading, setup line, question, hint, buttons. Move hand.strength and hand.story(unit) (line 25, 190 to 215 px) into a <details class="hs-disc"><summary>How the hand got here</summary> after the buttons, closed under 768 px wide, open from 1024. The setup line already names your cards, board, pot and the bet.
  2. Free the footnote strip. .hs-foot (SampleHandDialog.astro:93-95, in .dialog__foot, Dialog.css:111) is 83 px in every state. In the choose state, hide it when the viewport is under 700 px tall and keep it in the verdict state, or move the sentence to the end of the "What am I looking at?" text.
  3. Collapse the intro on hand 1 too when under 700 px tall (remove `open` at SampleHandDialog.astro:48 by media query or script). Saves about 130 px. Keep it open on taller screens where it fits.
  4. Cap the table scene at 190 px under 700 px tall (.tb max-block-size is 220 px, plus 16 px padding either side). Saves about 60 px.
  5. Add a cue regardless: while .hs-choices is below the visible area, show a sticky 44 px pill at the bottom of .dialog__body, "Pick your move ↓", that scrolls the choices into view and disappears when they are on screen. It also covers five-option hands.
Estimate if 1 to 4 land (computed from the measured positions, not rendered): first button at about y=570 to 590 and its bottom at about 640 to 655 on all three hands at 375x667, with the table, the setup line, the question and the first answer on one screen. Verify by eye.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-01-open-hand1.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-05-hand2-open.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-09-hand3-open.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-390-01-open-hand1.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-1280-01-open-hand1.png. After scrolling 545 px: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-02-hand1-choices.png. Four states side by side: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-sheet-flow375-a.png.
```

```text
[MEDIUM] M1  No sticky button through the 3,450 px pinned story; the bar flashes up first
Page/Section: Home › mobile bar over #how (src/components/MobileCtaBar/MobileCtaBar.ts:14, rule from UX.md section 2, rule 3)
Problem: At 375x667 the bar slides up when the hero button leaves (scroll 600), stays for about 300 px, then slides away at about 900 because #how crosses the middle of the screen, and stays away until about 4,300. The same at 390x844. The visitor sees a button appear, vanish, and then has nothing for about five screens while the product is being explained.
Impact: Breaks "primary button reachable in one tap on mobile" for the most persuasive part of the page. The only routes are Menu then the button (2 taps) or the story's own button at its end.
Fix: In MobileCtaBar.ts change `show = heroGone && !footerNear && storiesNear.size === 0` to `show = heroGone && !footerNear`, and set a data-slim attribute when storiesNear.size > 0. In MobileCtaBar.css make [data-slim] 56 px tall (button 44 px, 6 px padding top and bottom plus the safe-area inset) instead of 81 px. That keeps 284 px of story copy visible at 375x667 instead of 259. Hide it only while the story's own button is on screen.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-bar-375-flash-y700.png (bar showing), /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-bar-375-gone-y1100.png and /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-bar-375-gone-y2400.png (no button on screen), all three side by side in /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-sheet-flash.png.
```

```text
[MEDIUM] M2  Hero art lag is larger than the gap under the caption, so the caption hits the proof strip on phones
Page/Section: Home › Hero (src/styles/motion.css:455 and 526-530 `art-lag` = translateY(var(--space-2xl)) = 48 px; src/sections/home/Hero.css:191 `.hero__caption`)
Problem: At 375 and 390 wide the gap between the caption "Real chart from the engine. Red is raise, black is call, blank is fold." and the first proof line is 43 px at rest. The art then lags by up to 48 px (it saturates at scroll 1,100), leaving the caption 6 px inside the proof strip. In the served build it overprints "8-handed preflop charts at 14 stack depths". The pending opaque-strip rule (motion.css:463-468, not in the served CSS yet) would clip the bottom of the caption instead. Either way text is damaged, and the caption is the legend for the chart. At 1280 the gap is larger and nothing collides (25 px to spare).
Impact: The first thing under the first screen reads as a rendering bug, on the exact phone widths the page is judged on.
Fix: Cap the lag below the gap: below 768 px use translateY(var(--space-xl)) (32 px) in `art-lag`, or add padding-block-end: var(--space-xl) to `.hero__caption` below 768 px so the gap is at least 56 px. Re-check at scroll 1,100 after motion.css lands.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-bar-375-gone-y1100.png and /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-02.png.
```

```text
[MEDIUM] M3  Table scene: the opponent's cards and the dealer chip sit on your cards
Page/Section: Home › sample-hand pop-up, table scene (src/components/SampleHandDialog/SampleHandDialog.css:782-788 `.tb__dealer`, 820-824 `.tb__hole--opp`, markup in table.ts:44)
Problem: When the opponent sits next to you (hand 2: you SB, they BB; class a1), their face-down pair is placed at 0.64 of the seat radius and lands on your left card, hiding the 7's rank, and the dealer chip (0.8 radius, 24 degrees off) covers the corner of your 6. In hand 3 (opponent at a7) the red pair touches your K. Seen at 375 and 390 wide; not on desktop.
Impact: The two cards you are asked to play are partly hidden in the one graphic that shows them, and it looks like a layout bug to a portfolio reader. The sentence under the scene repeats the cards, so no information is lost.
Fix: In SampleHandDialog.css add `.tb__hole--opp.a1, .tb__hole--opp.a7 { left: calc(50% + var(--rx) * 0.98 * cos(var(--a))); top: calc(50% + var(--ry) * 0.42 * sin(var(--a))); }` so the pair sits outside your cards' 34 to 66 percent span, and move the chip for the same seats outward (`.tb__dealer` radius factor 0.8 to 0.95 when it lands on a1 or a7). Check by eye at 375 wide for all three hands.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-05-hand2-open.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-390-05-hand2-open.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-390-09-hand3-open.png.
```

```text
[MEDIUM] M4  Highlights is the longest non-pinned section and repeats itself
Page/Section: Home › #highlights (src/sections/home/Highlights.astro, Highlights.css)
Problem: 2,881 px on phones (4.3 screens). Four lists with the same anatomy (Hall of Fame, Wall of Shame, Tilt Tower, Monster Pots, three rows each) reuse the same six hands: "Called a river shove with a set..." and "Opened K9 offsuit under the gun" and "Missed-draw bluff on the river" appear in both Wall of Shame and Tilt Tower; "Nut flush on the river", "Three streets of value with top pair" and "Turned straight against a check-raise" appear in both Hall of Fame and Monster Pots. Twelve rows, six hands, because the sample has seven hands.
Impact: Skimmers on phones scroll four screens past the same rows, and a portfolio reader reads thin sample data. The section has no button of its own, so it adds distance between the story and the numbers.
Fix: Below 768 px show Hall of Fame and Wall of Shame, and fold Tilt Tower and Monster Pots into one "Two more lists" disclosure (saves about 740 px). Show two rows per list on phones. Where lists overlap, vary what the row says (Tilt Tower already shows tilt, Monster Pots shows pot size), or stop reusing a hand within one view.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-13.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-14.png, four screens in /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-sheet-scroll375-3.png.
```

```text
[LOW] L1  The concept note is said three times in pricing and twice in a row in the success step
Page/Section: Home › Pricing (src/sections/home/Pricing.astro) and early-access success step (src/components/EarlyAccessDialog)
Problem: Pricing shows the "Concept pricing" tag, then the lead's first sentence "Concept pricing on a concept site, so nothing is charged.", then the footnote "Concept pricing. This is a concept site, so nothing is charged and nothing is collected." The success step shows "This is a concept site. Prices are illustrative, and nothing is collected or sent..." and, directly under it, "Concept site, illustrative prices, nothing is collected or sent." The success heading "That address works" reads as a validator message, not a close to the flow.
Impact: The first words under "Free to log. Pro to coach." are a disclaimer instead of the offer. The repeat adds no honesty and slightly deflates the one section meant to commit.
Fix: Keep the tag and the footnote. Rewrite the lead to open with the offer: "Log your sessions for free. Add the coach and practice for $34 a month, or $27 a month billed yearly." In the success step keep the body sentence and delete the grey footer line, and change the heading to "Address checked. Nothing was sent." (still true, reads as a result).
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-pricing-375-monthly-a.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-15-early-success.png.
```

```text
[LOW] L2  On phones the bar says "Grade a sample hand" over the pricing buttons that say "Get early access"
Page/Section: Home › Pricing with the mobile bar (MobileCtaBar.ts)
Problem: Through the whole pricing section the bar is visible, so two full-width red buttons with different labels share the screen (Pro's "Get early access" sits directly above the bar's "Grade a sample hand" at about scroll 14,175). UX.md section 2 rule 6 says pricing buttons are not sticky; the bar is, and it points elsewhere.
Impact: Mild competition at the one point where the page asks for a different action.
Fix: Hide the bar while #pricing is at least 40 percent in view (same observer pattern the bar already uses for the story), or switch its label to "Get early access" there.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-25.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-pricing-375-yearly-b.png.
```

```text
[LOW] L3  "Get early access" wraps to two lines in the pinned verdict row at 375
Page/Section: Home › sample-hand pop-up, verdict, pinned row (.hs-nav, SampleHandDialog.astro:69-72)
Problem: The two buttons are 168 px wide each at 375; "Get early access" breaks into "Get early / access" while "Deal next hand" is one line.
Impact: Cramped look on the key hand-off to the second conversion.
Fix: Use "Early access" as the label in this row only (data-cta="verdict-early"), or reduce the horizontal padding of .hs-btn to 12 px at this width so it fits on one line.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-03-hand1-verdict-top.png.
```

```text
[LOW] L4  Hero micro-line sits 4 px under the button on desktop
Page/Section: Home › Hero, 1280 wide (src/sections/home/Hero.css)
Problem: Button bottom 723, "About 20 seconds a hand. Runs in your browser." box top 727 (4 px), while the gap between the subhead and the button is 16 px.
Impact: Looks pasted on.
Fix: margin-block-start: var(--space-sm) (8 px) or more on the micro-line at 768 px and up.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-1280x800.png.
```

```text
[LOW] L5  No product visual in the first screen at 375x667
Page/Section: Home › Hero, short phones (src/sections/home/Hero.css)
Problem: The H1 block (2-line kicker plus 3 display lines, 274 px), the subhead, the button and the micro-line use the whole screen; the chart and phone start at y=683. UX.md section 3, Flow C, expects kicker, H1, subhead and button inside 440 px; the button ends at 567. At 390x844 the art does show.
Impact: A portfolio reader on a small phone judges the page from text alone and gets no scroll cue; the button still passes.
Fix: Under 700 px tall, scale the H1 by viewport height (clamp the font so the block is about 220 px) so the first row of the chart peeks above the fold, or drop the micro-line below the art on short screens.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-375x667.png.
```

```text
[LOW] L6  Recorder page asks for a grading demo but promises recording
Page/Section: /live-poker-hand-recorder › Hero (src/sections/live-poker-hand-recorder)
Problem: The H1 and subhead are about recording a hand street by street; the only button, here and in the bar, is "Grade a sample hand", which demos grading. The recording screens are shown as pictures only.
Impact: A search visitor for "live poker hand recorder" gets a button that does not match the query.
Fix: Keep the label (UX.md says one label everywhere) and add one line under the hero button on this page: "Recording happens in the app. This sample shows what you get back, the grade." Link "See the three steps" stays.
Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-rec-375-00.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-rec-1280-00.png.
```

## The three things that work best (do not break them)

1. **The first screen and its button.** One idea, one red button, plain-words GTO definition in the subhead, "About 20 seconds a hand. Runs in your browser." under the button, and the button fully above the fold at all three sizes (bottom at 567, 571 and 723). Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-390x844.png.
2. **The verdict and the hand-off after it.** Pen-marked grade ("Blunder 6", struck-out "Call 65 bb" with "Fold" written in), one plain sentence with real numbers before the table, a pinned action row on phones, the primary button flipping to "Get early access" after hand 3, then a one-field early-access sheet with a visible label, an inline fix-it error and an honest success step. Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-03-hand1-verdict-top.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-flow-375-14-early-error.png.
3. **The proof beat.** The red band "Three of a kind. Still a fold." gives a real hand, the real number (GTO folds 96 percent) and the button in one screen, followed by a real preflop chart and the same hand written out in plain HTML on `/gto-hand-review`. This is what makes the page believable without invented testimonials. Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-06.png, /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-gto-375-03.png.

Also keep: the bar stepping away before the footer (it never covers the footer links), the menu panel (56 px rows, button at the bottom, concept line), and the desktop reveal footer at rest.

## Seen but not counted (motion mid-states, for whoever finishes motion.css)

- Hero floating slip at 1280 shows as an empty-looking white box ("Call 65 bb" with the second line missing) at about 2 s; complete at about 9 s. Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-first-1280x800.png and /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-hero-1280-after-9s.png.
- Story callout reads "GTO: Fol 96%" mid-typing at 375. Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-375-04.png.
- Engine counters read "00 / 0 / 000" until they finish counting.
- Desktop reveal footer is dimmed grey while it reveals; fine at rest. Evidence: /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/u-scroll-1280-18.png.

## Method and limits

- Scripts (not part of the site): `u-lib.mjs`, `u-first.mjs`, `u-flow.mjs`, `u-flow2.mjs`, `u-scroll.mjs`, `u-scroll2.mjs`, `u-barmap.mjs`, `u-collide.mjs`, `u-menu.mjs`, `u-pricing.mjs` in /private/tmp/claude-501/-Users-guybuganim-Code-PokerWiz-Web/6d48b299-46b1-43c3-af0a-b9ba502cc794/scratchpad/checks/.
- Phones used Chrome mobile emulation with touch taps and wheel scrolling; contact sheets (`u-sheet-*.png`) are built from the viewport screenshots for reading only.
- Not tested: a real on-screen keyboard in the early-access sheet, iOS Safari toolbars (a real iPhone SE shows less than 667 px, so the hero button there has less spare room than the 100 px measured), 320 px width, 768 to 1023 px, reduced-motion and no-script states.
- The served build does not yet contain the opaque `.hero__proof` rule that is in `src/styles/motion.css`; M2 should be re-checked once it is rebuilt.
