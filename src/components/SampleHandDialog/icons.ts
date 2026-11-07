// icons.ts: build-time only. Turns icon files from src/assets/svg/ (svg-expert's set) into one hidden SVG sprite per dialog (class prefix-sprite), so the dialog's own script can draw an icon with <use href="#prefix-name">. Never reaches the browser bundle.
const files = import.meta.glob('../../assets/svg/icon-*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** The attributes of the source <svg> that must survive on the <symbol>. */
const KEEP = ['viewBox', 'preserveAspectRatio', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin', 'stroke-width'];

/** One <symbol id="prefix-name"> per name. A name with no file fails the build, so a missing icon cannot ship unnoticed. */
export function sprite(prefix: string, names: string[]): string {
  const symbols = names.map((name) => {
    const source = files[`../../assets/svg/icon-${name}.svg`];
    const match = source && /<svg\b([^>]*)>([\s\S]*?)<\/svg>/.exec(source);
    if (!match) throw new Error(`icons: src/assets/svg/icon-${name}.svg is missing`);
    const attrs = KEEP.map((key) => {
      const value = new RegExp(`\\s${key}="([^"]*)"`).exec(match[1])?.[1];
      return value === undefined ? '' : ` ${key}="${value}"`;
    }).join('');
    // The pen marks draw with stroke-dashoffset, and non-scaling-stroke breaks dash lengths in Chrome and WebKit alike (tested, MOTION.md 5.7), so the sprite's copies scale their stroke.
    const body = name.startsWith('pen-') ? match[2].replace(/\s*vector-effect="[^"]*"/, '') : match[2];
    return `<symbol id="${prefix}-${name}"${attrs}>${body}</symbol>`;
  });
  return `<svg class="${prefix}-sprite" aria-hidden="true" focusable="false">${symbols.join('')}</svg>`;
}
