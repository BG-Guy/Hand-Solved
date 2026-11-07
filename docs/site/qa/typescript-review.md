# TypeScript review: HandSolved browser scripts

Scope: every `.ts` under `src/` plus `src/scripts/head-guard.js` (no git diff, so whole files). `npx tsc --noEmit` and `npx astro check`: 0 errors, 0 warnings, 0 hints. No ESLint config exists, so lint was skipped.
Every finding below was reproduced in headless Chrome against http://127.0.0.1:4321 (CDP, throwaway profile, real mouse, touch and key events).

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH | 2 |
| MEDIUM | 2 |
| LOW | 2 |

## HIGH

### H1. A double-click on a page CTA closes the pop-up it just opened
`src/components/Dialog/Dialog.ts:187`

- **Problem:** the backdrop-close branch has no guard against the second click of a double-click. Once `showModal()` runs, the CTA's coordinates are covered by the `::backdrop`, so click 2 targets the `<dialog>`, and `target === pressed` (set at pointerdown, line 208) is true.
- **Scenario (verified, 1280x800):** double-click "Grade a sample hand" in the hero, or the header button. The dialog is open at 150 ms and gone at 1.65 s. `elementFromPoint` at the CTA returns `DIALOG#dlg-sample`; click 2 reports `detail: 2`. A single click stays open. The phone sheet is unaffected (`isSheet`).
- **Fix:** line 187 becomes `else if (isPopup(target) && target === pressed && !isSheet(target) && event.detail < 2) void close(target);`

### H2. One failed chunk load disables a pop-up until page reload, with no message
`src/components/Dialog/Dialog.ts:59-66` (and `68-81`)

- **Problem:** `warm()` turns a rejected `import()` into a cached `Promise<undefined>` (`slot.module ??=` is never cleared). `dataset.module = 'error'` has no reader (no CSS or script reads `data-module`), so the stage keeps its skeleton with `aria-busy="true"`. The in-dialog error block (`[data-error]`, copy "Close this box and reopen it") is only revealed by the module's own `fail()`, which never runs.
- **Scenario (verified):** fail the SampleHandDialog chunk request once (flaky mobile network, or a deploy that renames hashed chunks under an open tab). Open "Grade a sample hand": endless skeleton. Close and reopen: still skeleton, `module="error"`, exactly 1 request for the chunk, so no retry.
- **Fix:**
  ```ts
  // warm(): never cache a failure
  slot.module ??= (loaders[moduleOf[dialog.id]]?.() ?? Promise.resolve(undefined)).catch(() => {
    slot.module = undefined;
    dialog.dataset.module = 'error';
    return undefined;
  });
  // mountModule(): mark each attempt and surface the failure
  dialog.dataset.module = 'loading'; // replaces the `if (!dialog.dataset.module)` guard
  const popup = await warm(dialog);
  dialog.querySelector<HTMLElement>('[data-error]')?.toggleAttribute('hidden', !!popup);
  dialog.querySelector<HTMLElement>('[data-stage]')?.toggleAttribute('hidden', !popup);
  ```

## MEDIUM

### M1. A double-click on "Deal next hand" (or "Start over") answers the next hand for the visitor
`src/components/SampleHandDialog/SampleHandDialog.ts:162-170`

- **Problem:** the delegated click handler repaints synchronously (`deal()` swaps the stage and resets scroll), so click 2 of a double-click lands on whatever is now under the pointer, a `[data-pick]` button.
- **Scenario (verified, 1280x800, real double-click):** the dialog ends on hand 2's verdict ("Best move, 100 out of 100") with no choice made. Click 2 had `detail: 2` and its target sat inside a `.hs-choice`. The 390 px layout is not affected.
- **Fix:** first line of the handler: `if (event.detail > 1) return;`

### M2. Two amount formatters, and they disagree in dollars
`src/components/SampleHandDialog/format.ts:17-34` vs `src/scripts/format-amount.ts:30-44`, plus `src/sections/home/Hero.astro:72-73`

- **Problem:** `format-amount.ts:1-3` and `UnitSwitch.ts:2` promise one formatter ("the two always agree", "the pop-ups import formatAmount"). No pop-up imports it; the dialog and `worked-example.ts` use `money()`. Big-blind output is identical (brute force: 3.6M signed amounts, $0 to $3,000, six big blinds, 0 differences). Dollars are not: `money()` prints exact cents at any size, `formatAmount` drops cents from $10 up, and only `money()` has whole-bb pots (254.5 prints `255 bb` vs `254.5 bb`).
- **Scenario (verified):** switch to $ on the home page. The hero reads "Calling here is worth −$125" (`data-bb="-62.6"`), while the pop-up it opens reads "−$125.24" and "gives up about $125.24" for the same call. Also, `Call 65 bb` (Hero.astro:72 and HowItWorks.astro:28) stays in bb beside flipped numbers, and 14 bb-only strings on `/gto-hand-review` (worked example, "what you see", FAQ) never follow the switch (confirm that is intended).
- **Fix:** one implementation. Add `usdDecimals: 'exact'` and `bbDecimals: 0 | 1` to `AmountOptions`, then make `money(d, bb, unit, sign, whole)` return `formatAmount(d / bb, unit, { usdPerBb: bb, signed: sign, usdDecimals: 'exact', bbDecimals: whole ? 0 : 1 })` and delete its own `group`/rounding. Until then: Hero.astro:73 `data-bb="-62.62" data-usd-decimals="2"` (bb text stays −62.6, dollars become −$125.24), Hero.astro:72 and HowItWorks.astro:28 use a live `<Amount bb={65} />` for the call, and add a build-time `expect` that runs both formatters over `demo-spots.json`, as `worked-example.ts` already does for its copy.

## LOW

### L1. A pop-up opened by a hand-off springs from the top-left corner of the viewport
`src/components/Dialog/Dialog.ts:105-107`

- **Problem:** after `await close(other)` the trigger sits inside a closed (`display: none`) dialog, so `getBoundingClientRect()` is all zeros and `--ox/--oy` become `-offsetLeft/-offsetTop`.
- **Scenario (verified):** sample verdict, then "Get early access": `--ox: -420px; --oy: -228px` equal `-offsetLeft/-offsetTop` (420, 228). The first open from a page CTA is correct (803px, 4px). The mobile-menu hand-off takes the same code path (not run).
- **Fix:** `const anchor = trigger.getClientRects().length ? trigger : (returnTo ?? trigger); const box = anchor.getBoundingClientRect();`

### L2. Submitting the early-access form before its module mounts leaves the address in the field
`src/components/EarlyAccessDialog/EarlyAccessDialog.astro:18` with `src/components/Dialog/Dialog.ts:142-153`

- **Problem:** `<form method="dialog">` closes the box natively. The module's reset (`EarlyAccessDialog.ts:115-124`) is not attached yet, so the typed address survives the close, contradicting "cleared when the box closes" (EarlyAccessDialog.ts:2-3 and the success copy). The user also gets no feedback. Nothing is sent.
- **Scenario (verified):** hold the chunk request, open the dialog, type `me@example.com`, submit: the box closes with no success view. Release the chunk and reopen: the field still holds `me@example.com`, unvalidated.
- **Fix:** in the capture-phase `close` handler, after line 147, add `dialog.querySelector('form')?.reset();` (a no-op for the sample dialog).

## Checked, no problem found

- **Nothing leaves the page.** No `fetch`, XHR, beacon, WebSocket, `new Image`, `window.open` or cookie code in `src/` (the one `import()` is the same-origin reveal chunk). In a full run (load, open, pick, hand-off, type and submit an address, flip the unit) there were 37 requests, all GET to 127.0.0.1, and none cross-origin on any of the 6 pages. CSP has `connect-src 'none'` and `form-action 'none'`.
- **Storage is guarded.** All 3 call sites are in try/catch (`UnitSwitch.ts:54-58`, `head-guard.js:12-18`). With `getItem`/`setItem` throwing, and with the `localStorage`/`sessionStorage` getters throwing, the unit switch, the dialog and `data-js` all work with no uncaught error.
- **DOM insertion.** The `innerHTML` sinks (`SampleHandDialog.ts:53, 68, 131`) are fed only by the bundled `demo-spots.json` and constants; the unit is whitelisted. JSON-LD escapes `<`. No `eval` or `document.write`.
- **Leaks and repeat open/close.** Document listener counts are unchanged after 12 open/pick/close cycles (only the one-time `unit:change` from mount). No leftover `data-state`, `data-dragging` or transform; Esc and touch-drag close both reset the view, and reopen resumes at the right hand.
- **Not reported (not reproduced):** the sheet-drag handler (`Dialog.ts:205-236`) does not filter `button` or `pointerId`; the `([entry])` destructuring in the IntersectionObserver callbacks reads the oldest queued entry.
