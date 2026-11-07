// svg-files.ts: finds the icon, logo, frame and art SVG files that svg-expert draws into src/assets/svg/ (listed in docs/site/SVG-USAGE.md).
// One glob, so a name is looked up by string. A name with no file throws, so a typo or a renamed file fails the build instead of printing nothing.
import type { SvgComponent } from 'astro/types';

const files = import.meta.glob<{ default: SvgComponent }>(
  ['../../assets/svg/icon-*.svg', '../../assets/svg/logo-*.svg', '../../assets/svg/frame-*.svg', '../../assets/svg/art-*.svg'],
  { eager: true },
);

/** The inline-SVG component for src/assets/svg/<name>.svg (name without extension). Throws when that file does not exist. */
export function svgFile(name: string): SvgComponent {
  const found = files[`../../assets/svg/${name}.svg`]?.default;
  if (!found) throw new Error(`svgFile: src/assets/svg/${name}.svg does not exist.`);
  return found;
}
