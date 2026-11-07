// EarlyAccessDialog.ts: pop-up 2 (#dlg-early). Dialog.ts calls mount() once. It checks the email format in the browser and shows the success step.
// Nothing is sent or stored: no fetch, no beacon, no form action, no storage. The address lives in the field and in one variable, and both are cleared when the box closes.
import { problem, suggest } from './validate';

/**
 * FUTURE BACK END PLUGS IN HERE. Intentionally empty.
 * Today the site collects and sends nothing (docs/site/ARCHITECTURE.md section 10). When a real API exists, this receives the checked address;
 * the page's connect-src and form-action then widen to that origin only. Until then do not add a network call, storage write or log here.
 */
export function submitSignup(_email: string): void {}

/** Which plan chip a trigger asks for: its data-plan, with "pro" meaning the yearly price while the pricing switch shows Yearly. */
function planOf(trigger: Element | null | undefined): string {
  const plan = (trigger as HTMLElement | null | undefined)?.dataset.plan ?? '';
  if (plan === 'pro' && document.querySelector('input[value="yearly" i]:checked')) return 'pro-yearly';
  return plan === 'pro-monthly' ? 'pro' : plan;
}

export function mount(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void {
  if (dialog.hasAttribute('data-ready')) return;
  // The markup is static and ships with this module, so a missing part is a build bug: no runtime message for it.
  const part = <T extends HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const form = part<HTMLFormElement>('[data-form]');
  const input = part<HTMLInputElement>('[data-input]');
  const field = part('[data-field]');
  const message = part('[data-msg]');
  const submit = part<HTMLButtonElement>('[data-submit]');
  const views = { form: part('[data-view="form"]'), done: part('[data-view="done"]') };
  const chips = [...dialog.querySelectorAll<HTMLElement>('[data-chip]')];
  let touched = false; // after the first message, every keystroke is checked

  const setPlan = (plan: string) => chips.forEach((chip) => (chip.hidden = chip.dataset.chip !== plan));

  /** One reserved line under the field: an error (state "error"), the typo hint ("hint") or nothing. */
  function paint(state: '' | 'error' | 'hint' | 'valid', text = '', role = '', suggestion = '') {
    field.dataset.state = state;
    if (state === 'error') input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (role) message.setAttribute('role', role);
    else message.removeAttribute('role');
    message.textContent = text;
    if (suggestion) {
      const use = document.createElement('button');
      use.type = 'button';
      use.className = 'ea-use';
      use.textContent = 'Use this';
      use.setAttribute('aria-label', `Use ${suggestion}`);
      use.addEventListener('click', () => {
        input.value = suggestion;
        input.focus();
        check();
      });
      message.append(' ', use);
    }
  }

  /** Check the field. announce is true only after a failed submit, where the message is read once (role alert). */
  function check(announce = false): boolean {
    const error = problem(input.value);
    if (error) {
      paint('error', error, announce ? 'alert' : '');
      return false;
    }
    const better = suggest(input.value);
    if (better) paint('hint', `Did you mean ${better}?`, 'status', better);
    else paint('valid');
    return true;
  }

  const token = (name: string) => getComputedStyle(dialog).getPropertyValue(name);

  function show(name: 'form' | 'done') {
    const before = dialog.offsetHeight;
    views.form.classList.remove('is-leaving');
    views.form.hidden = name !== 'form';
    views.done.hidden = name !== 'done';
    // Height morph between the two views. Its length and curve are the tokens; it is skipped under reduced motion.
    if (before && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.animate({ height: [`${before}px`, `${dialog.offsetHeight}px`] }, { duration: parseFloat(token('--dur-4')) || 0, easing: token('--ease-out').trim() });
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    touched = true;
    if (!check(true)) return input.focus();
    const email = input.value.trim();
    submit.disabled = true; // the button is muted for the length of the transition, so it cannot fire twice
    submitSignup(email);
    part('[data-addr]').textContent = email;
    // The form fades first, then the success step mounts and takes focus (MOTION.md E36).
    views.form.classList.add('is-leaving');
    setTimeout(() => {
      if (!dialog.open) return;
      show('done');
      part('[data-done-h]').focus();
    }, parseFloat(token('--dur-1')) || 0);
  });

  input.addEventListener('input', () => {
    if (touched) check();
    else if (!problem(input.value)) paint('valid');
    else paint('');
  });

  // On blur, check only when something is typed.
  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      touched = true;
      check();
    }
  });

  // Reset when the dialog closes: nothing typed is kept.
  dialog.addEventListener('close', () => {
    input.value = '';
    part('[data-addr]').textContent = '';
    touched = false;
    submit.disabled = false;
    paint('');
    views.form.classList.remove('is-leaving');
    views.form.hidden = false;
    views.done.hidden = true;
  });

  // Plan chip: Dialog.ts fires dialog:open on every open with the button that opened it (pricing buttons carry data-plan; the sample hand's button has none).
  dialog.addEventListener('dialog:open', (event) => setPlan(planOf((event as CustomEvent<{ trigger: HTMLElement | null }>).detail.trigger)));
  setPlan(planOf(trigger)); // the first open happened before this module arrived

  // Keep the field and button above the on-screen keyboard where the browser does not resize the page for it.
  const viewport = window.visualViewport;
  viewport?.addEventListener('resize', () => {
    dialog.style.setProperty('--kb-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
  });

  dialog.setAttribute('data-ready', '');
}
