// theme-color.ts: reads the page ground colour from tokens.css at build time, so the theme-color meta can never drift from the tokens.
import tokensCss from '../../styles/tokens.css?raw';

/** Follows var(--other) chains through tokens.css until a literal value is reached. */
function resolveToken(name: string, trail: readonly string[] = []): string {
  if (trail.includes(name)) throw new Error(`tokens.css: ${name} refers back to itself`);
  const declaration = new RegExp(`(?<![\\w-])${name}\\s*:\\s*([^;]+);`).exec(tokensCss);
  if (!declaration) throw new Error(`tokens.css: ${name} is not defined`);
  const value = declaration[1].trim();
  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  return reference ? resolveToken(reference[1], [...trail, name]) : value;
}

/** The page ground (--surface-page). The web manifest's theme and background colours should use the same value. */
export const themeColor = resolveToken('--surface-page');
