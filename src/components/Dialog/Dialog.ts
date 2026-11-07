// Dialog.ts: the one delegated listener for every pop-up on the page. It opens a dialog at once, then loads that pop-up's own module.
//
// Triggers: any element with data-dialog-open="<dialog id>" (CtaButton prints these). Close paths: [data-dialog-close], Esc, a click on the
// backdrop (768 px and up), or a downward drag of the sheet (below 768 px). Focus goes back to the element on the page that first opened a dialog.
//
// Contract with the pop-up modules (SampleHandDialog.ts, EarlyAccessDialog.ts), loaded on first intent (pointer over, focus or touch on a trigger)
// or on the first open, whichever comes first:
//   export function mount(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void
// mount() runs once per dialog. trigger is the button that opened it (null if the dialog was closed again before the module landed).
// Every later open fires "dialog:open" on the dialog (bubbles; detail.trigger is the button, so detail.trigger.dataset.plan is the plan).
// currentTrigger(dialog) returns the same button. "dialog:close" fires on every close. dialog.dataset.module is "loading", "ready" or "error"; on "error" a pop-up
// with a [data-error] block shows it in place of its [data-stage].

import { settleTime } from '../../scripts/settle-time';

type PopupModule = { mount(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void };

// A guarded glob: the build passes while a pop-up module is missing, and picks it up as soon as the file exists.
const loaders = import.meta.glob<PopupModule>([
  '../SampleHandDialog/SampleHandDialog.ts',
  '../EarlyAccessDialog/EarlyAccessDialog.ts',
]);
const moduleOf: Record<string, string> = {
  'dlg-sample': '../SampleHandDialog/SampleHandDialog.ts',
  'dlg-early': '../EarlyAccessDialog/EarlyAccessDialog.ts',
};

interface Slot {
  /** The page element that first opened a dialog: focus returns here. */
  opener: HTMLElement | null;
  /** The button that opened this dialog now. */
  trigger: HTMLElement | null;
  module?: Promise<PopupModule | undefined>;
  /** Address of the chunk that failed to load, and how many times it was asked for again (see load()). */
  failedUrl?: string;
  tries: number;
  mounted: boolean;
  /** False while a hand-off to another dialog is under way, so focus is not given back in between. */
  restore: boolean;
}

const slots = new WeakMap<HTMLDialogElement, Slot>();
function slotOf(dialog: HTMLDialogElement): Slot {
  let slot = slots.get(dialog);
  if (!slot) slots.set(dialog, (slot = { opener: null, trigger: null, tries: 0, mounted: false, restore: true }));
  return slot;
}

/** The button that opened this dialog now, for reading data-plan and data-cta. */
export const currentTrigger = (dialog: HTMLDialogElement): HTMLElement | null => slots.get(dialog)?.trigger ?? null;

/** A pop-up built on the Dialog shell (or one of the two known ids), as opposed to another dialog such as the mobile menu. */
const hasShell = (dialog: HTMLDialogElement) => dialog.hasAttribute('data-dialog') || dialog.id in moduleOf;
const isPopup = (el: unknown): el is HTMLDialogElement => el instanceof HTMLDialogElement && hasShell(el);

/** CSS decides: Dialog.css sets --dialog-sheet to 1 at phone width. */
const isSheet = (dialog: HTMLDialogElement) => getComputedStyle(dialog).getPropertyValue('--dialog-sheet').trim() === '1';

// ---------------------------------------------------------------------------
// The pop-up's own module: warmed on intent, mounted once.
// ---------------------------------------------------------------------------

/** The pop-up's chunk. After a failure, Chrome keeps the failed import for the life of the page and rejects the same address again without asking the network,
 *  so the retry asks for the failed address under a new query: a new request, for the same file. Other browsers retry the plain import. */
function load(dialog: HTMLDialogElement, slot: Slot): Promise<PopupModule | undefined> {
  const loader = loaders[moduleOf[dialog.id]];
  if (!loader) return Promise.resolve(undefined);
  return slot.failedUrl ? import(/* @vite-ignore */ `${slot.failedUrl}?retry=${++slot.tries}`) : loader();
}

function warm(dialog: HTMLDialogElement): Promise<PopupModule | undefined> {
  const slot = slotOf(dialog);
  // A failure is never kept: the next open or intent tries the chunk again.
  slot.module ??= load(dialog, slot).catch((error: unknown) => {
    slot.module = undefined;
    slot.failedUrl ??= /https?:\/\/[^\s'"]+\.js/.exec(String((error as Error | undefined)?.message))?.[0];
    dialog.dataset.module = 'error';
    return undefined;
  });
  return slot.module;
}

async function mountModule(dialog: HTMLDialogElement) {
  const slot = slotOf(dialog);
  if (slot.mounted) return;
  dialog.dataset.module = 'loading';
  const popup = await warm(dialog);
  // The chunk did not arrive: swap the loading skeleton for the box's own message (pop-up 1 has one; pop-up 2 needs none) and read it out.
  const message = dialog.querySelector<HTMLElement>('[data-error]');
  message?.toggleAttribute('hidden', !!popup);
  dialog.querySelector<HTMLElement>('[data-stage]')?.toggleAttribute('hidden', !popup);
  if (!popup && message) dialog.querySelector<HTMLElement>('[data-error-h]')?.focus();
  if (!popup || slot.mounted) return;
  slot.mounted = true;
  try {
    popup.mount(dialog, dialog.open ? slot.trigger : null);
    dialog.dataset.module = 'ready';
  } catch {
    dialog.dataset.module = 'error';
  }
}

// ---------------------------------------------------------------------------
// Open and close
// ---------------------------------------------------------------------------

async function open(dialog: HTMLDialogElement, trigger: HTMLElement) {
  if (dialog.open) return;
  let returnTo: HTMLElement | null = trigger;
  // A trigger inside the mobile menu hands focus back to the burger; the menu names it with data-return-focus="<id>".
  const home = trigger.closest<HTMLElement>('[data-return-focus]');
  if (home) returnTo = document.getElementById(home.dataset.returnFocus ?? '') ?? returnTo;
  // One dialog at a time. A trigger inside another dialog keeps that dialog's own return target.
  for (const other of document.querySelectorAll<HTMLDialogElement>('dialog[open]')) {
    if (other.contains(trigger) && hasShell(other)) returnTo = slotOf(other).opener ?? returnTo;
    await close(other, { restore: false });
  }
  if (dialog.open) return;
  const slot = slotOf(dialog);
  slot.opener = returnTo;
  slot.trigger = trigger;
  slot.restore = true;
  dialog.showModal();
  // The spring starts from the middle of the trigger. A trigger inside the dialog that just closed has no box, so the page's own opener stands in.
  const anchor = trigger.getClientRects().length ? trigger : (returnTo ?? trigger);
  const box = anchor.getBoundingClientRect();
  dialog.style.setProperty('--ox', `${box.left + box.width / 2 - dialog.offsetLeft}px`);
  dialog.style.setProperty('--oy', `${box.top + box.height / 2 - dialog.offsetTop}px`);
  // Two frames, so the browser has painted the closed look before the open look starts the transition.
  requestAnimationFrame(() => requestAnimationFrame(() => (dialog.dataset.state = 'open')));
  dialog.dispatchEvent(new CustomEvent('dialog:open', { bubbles: true, detail: { trigger } }));
  void mountModule(dialog);
}

function close(dialog: HTMLDialogElement, { restore = true } = {}): Promise<void> {
  if (!dialog.open) return Promise.resolve();
  // Dialogs that are not pop-ups (the mobile menu) animate and close themselves; here they just close.
  if (!hasShell(dialog)) {
    dialog.close();
    return Promise.resolve();
  }
  slotOf(dialog).restore = restore;
  // The native close event below clears this. motion.css gives the way out its own pose (MOTION.md E09).
  dialog.dataset.state = 'closing';
  // The exit is a CSS transition. Wait one frame so the timer starts with it, then for as long as the CSS says it lasts.
  return new Promise((resolve) =>
    requestAnimationFrame(() =>
      setTimeout(() => {
        if (dialog.open) dialog.close();
        resolve();
      }, settleTime(dialog)),
    ),
  );
}

/** Focus goes back to the opener. If it is gone or hidden (the mobile bar slid away), the hero button takes it. */
function restoreFocus(opener: HTMLElement | null) {
  opener?.focus();
  if (!opener || document.activeElement !== opener) document.querySelector<HTMLElement>('[data-cta="hero"]')?.focus();
}

// The native close event covers every way a dialog can close, including a <form method="dialog"> button.
document.addEventListener(
  'close',
  (event) => {
    const dialog = event.target;
    if (!isPopup(dialog)) return;
    delete dialog.dataset.state;
    // <form method="dialog"> closes the box natively; if the module has not mounted yet, nothing else would clear the field.
    dialog.querySelector('form')?.reset();
    const slot = slotOf(dialog);
    dialog.dispatchEvent(new CustomEvent('dialog:close', { bubbles: true, detail: { trigger: slot.trigger } }));
    if (slot.restore) restoreFocus(slot.opener);
  },
  true,
);

// Esc: close with the exit animation, not the browser's instant close. The cancel event does not bubble, so listen while it travels down.
document.addEventListener(
  'cancel',
  (event) => {
    if (!isPopup(event.target)) return;
    event.preventDefault();
    void close(event.target);
  },
  true,
);

// ---------------------------------------------------------------------------
// Clicks: triggers, close buttons and the backdrop
// ---------------------------------------------------------------------------

let pressed: EventTarget | null = null;

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const trigger = target.closest<HTMLElement>('[data-dialog-open]');
  if (trigger) {
    const dialog = document.getElementById(trigger.dataset.dialogOpen ?? '');
    if (dialog instanceof HTMLDialogElement) {
      event.preventDefault();
      void open(dialog, trigger);
    }
    return;
  }
  const owner = target.closest('dialog');
  if (target.closest('[data-dialog-close]') && isPopup(owner)) void close(owner);
  // A click whose press and release both landed on the backdrop. At phone width the sheet closes with the button or a drag instead.
  // The second click of a double-click on a page button lands there too (the backdrop now covers the button), so it is not a close.
  else if (isPopup(target) && target === pressed && !isSheet(target) && event.detail < 2) void close(target);
});

// ---------------------------------------------------------------------------
// Intent: start loading a pop-up's module before the click
// ---------------------------------------------------------------------------

function intent(event: Event) {
  const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-dialog-open]') : null;
  const dialog = trigger && document.getElementById(trigger.dataset.dialogOpen ?? '');
  if (dialog instanceof HTMLDialogElement) void warm(dialog);
}
for (const type of ['pointerover', 'focusin', 'touchstart']) document.addEventListener(type, intent, { passive: true });

// ---------------------------------------------------------------------------
// Sheet drag: the handle or the header follows the finger; a long or fast drag down closes it
// ---------------------------------------------------------------------------

document.addEventListener(
  'pointerdown',
  (event) => {
    pressed = event.target;
    const target = event.target instanceof Element ? event.target : null;
    const dialog = target?.closest('dialog');
    if (!target || !isPopup(dialog) || !isSheet(dialog) || !target.closest('.dialog__handle, .dialog__head')) return;
    if (target.closest('button, a, input, select, textarea, [role="switch"]')) return;

    const startY = event.clientY;
    const startTime = performance.now();
    dialog.dataset.dragging = '';
    const move = (e: PointerEvent) => {
      const dy = Math.max(0, e.clientY - startY);
      dialog.style.transform = `translateY(${dy}px)`;
      dialog.style.setProperty('--drag-p', String(Math.min(1, dy / dialog.offsetHeight)));
    };
    const end = (e: PointerEvent) => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
      const dy = e.clientY - startY;
      const speed = dy / Math.max(performance.now() - startTime, 1);
      delete dialog.dataset.dragging;
      dialog.style.removeProperty('transform');
      dialog.style.removeProperty('--drag-p');
      if (dy > 120 || speed > 0.6) void close(dialog);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
  },
  true,
);
