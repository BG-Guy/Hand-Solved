// validate.ts: the email format check for pop-up 2, and the soft "did you mean" hint. Pure functions, no DOM, nothing sent anywhere. Rules: docs/site/UX.md 6.2. Messages: docs/site/COPY.md "Pop-up 2".

const LOCAL = /^[A-Za-z0-9._%+-]+$/;
const DOMAIN = /^[A-Za-z0-9.-]+$/;
/** The last part: two or more letters, or an ASCII-form international ending (xn--...). */
const ENDING = /^(?:[A-Za-z]{2,}|xn--[A-Za-z0-9-]+)$/;
const KNOWN = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'proton.me'];

const DOTS = 'Check the dots. They cannot start, end or repeat.';
const badDots = (part: string) => part.startsWith('.') || part.endsWith('.') || part.includes('..');

/** The message for the first rule an address breaks, or null when the address is fine. The address is trimmed first. */
export function problem(raw: string): string | null {
  const email = raw.trim();
  if (!email) return 'Enter your email address.';
  if (email.length > 254) return 'That address is too long. The limit is 254 characters.';
  if (/\s/.test(email)) return 'Remove spaces and special characters.';
  const at = email.split('@');
  if (at.length < 2) return 'Add an @, like name@example.com.';
  if (at.length > 2) return 'Use only one @, like name@example.com.';
  const [local, domain] = at;
  if (!local) return 'Add the part before the @, like name@example.com.';
  if (local.length > 64) return 'The part before the @ is too long. The limit is 64 characters.';
  if (!domain) return 'Add the part after the @, like example.com.';
  if (badDots(local) || badDots(domain)) return DOTS;
  if (!LOCAL.test(local) || !DOMAIN.test(domain)) return 'Remove spaces and special characters.';
  if (!domain.includes('.')) return 'Add the part after the @, like example.com.';
  const labels = domain.split('.');
  if (labels.some((label) => label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    return 'Check the part after the @. Names there cannot start or end with a hyphen, or run past 63 characters.';
  }
  if (!ENDING.test(labels[labels.length - 1])) return 'Finish with a real ending, at least two letters after the last dot, like .com.';
  return null;
}

/** Number of single-character edits between two strings. */
function edits(a: string, b: string): number {
  let row = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + +(a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
}

/** For a valid address whose domain is within 2 edits of a common one: the same name at that domain. Never blocks anything. */
export function suggest(raw: string): string | null {
  const [local, domain = ''] = raw.trim().split('@');
  const lower = domain.toLowerCase();
  if (KNOWN.includes(lower)) return null;
  const hit = KNOWN.find((known) => edits(lower, known) <= 2);
  return hit ? `${local}@${hit}` : null;
}
