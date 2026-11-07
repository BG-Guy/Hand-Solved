// settle-time.ts: how long an element's CSS transitions take, so a script can wait for an exit animation without a hard-coded time.
// The durations stay in the motion tokens; under reduced motion they are near zero and so is the wait.

/** The longest transition (duration plus delay) on an element, in milliseconds. */
export function settleTime(el: Element): number {
  const style = getComputedStyle(el);
  const ms = (text: string) => parseFloat(text) * (text.trim().endsWith('ms') ? 1 : 1000);
  const delays = style.transitionDelay.split(',');
  return Math.max(0, ...style.transitionDuration.split(',').map((duration, i) => ms(duration) + ms(delays[i % delays.length])));
}
