// check-dist.mjs: fails the build when dist/ breaks a budget or a rule from docs/site/ARCHITECTURE.md section 6. Node built-ins only.
//
// Rules, each reported with the file it was found in:
//   1. Home over a budget: JS 11 KB gz on load and 25 KB gz in total, CSS 30 KB gz on load and 45 KB gz in total, HTML 30 KB gz (the section 6 budget table).
//   2. CSS with an `animation:` shorthand holding view( or scroll( (Lightning CSS breaks it in production builds).
//   3. HTML with a style="" attribute or a data: URI.
//   4. A page that loads a script, style, font or image from another origin, or an <a href> that leaves the site.
//   5. An inline script (or style) whose hash is missing from the page's CSP.
//   6. onrender or pokerwiz in any case anywhere in dist/, file names included.
//   7. A page without exactly one <h1> and one <title>, or (except 404) without a description and a canonical.
//   8. A PNG anywhere under dist/_astro/: the screenshots publish as AVIF and WebP only (ARCHITECTURE.md section 5). A PNG there is a full-size master that no page uses.
// Not enforced here: LCP, CLS, INP, font bytes, image bytes and page weight. performance-optimizer (T32) measures those.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

// Home limits in KB of gzip. 1 KB is 1000 bytes, the way Vite reports sizes.
const LIMIT_KB = { jsOnLoad: 11, jsTotal: 25, css: 30, cssTotal: 45, html: 30 };

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

if (!existsSync(dist)) {
  console.error('check-dist: dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The site origin, read from the one `site:` setting in astro.config.mjs. */
function readSiteOrigin() {
  const config = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const match = /\bsite\s*:\s*['"]([^'"]+)['"]/.exec(config);
  if (!match) throw new Error('check-dist: no `site:` setting found in astro.config.mjs');
  return new URL(match[1]).origin;
}

const siteOrigin = readSiteOrigin();

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const files = walk(dist);
const rel = (file) => relative(dist, file).split(sep).join('/');
const gzKB = (buffer) => gzipSync(buffer, { level: 9 }).length / 1000;
const kb = (value) => value.toFixed(2);

/** True when a URL points to another origin, or to something that is not a page of this site (mailto:, data:, javascript:). */
function leavesSite(value) {
  const url = value.trim();
  if (url === '' || url.startsWith('#')) return false;
  try {
    return new URL(url, `${siteOrigin}/`).origin !== siteOrigin;
  } catch {
    return true;
  }
}

function decodeEntities(text) {
  return text
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

function parseAttrs(source) {
  const attrs = new Map();
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    attrs.set(match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''));
  }
  return attrs;
}

/** Splits markup into start tags (with attributes) and the raw text of inline <script> and <style> blocks. */
function parseHtml(html) {
  const tags = [];
  const inline = [];
  const pattern =
    /<!--[\s\S]*?-->|<(script|style)\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/\1\s*>|<([a-zA-Z][^\s/>]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  for (const match of html.matchAll(pattern)) {
    if (match[0].startsWith('<!--')) continue;
    if (match[1]) {
      const name = match[1].toLowerCase();
      const attrs = parseAttrs(match[2]);
      tags.push({ name, attrs });
      inline.push({ name, attrs, text: match[3] });
    } else {
      tags.push({ name: match[4].toLowerCase(), attrs: parseAttrs(match[5]) });
    }
  }
  return { tags, inline };
}

/** The URLs inside one attribute value (srcset holds several). */
const urlsIn = (attr, value) =>
  attr === 'srcset' ? value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]) : [value];

// ---------------------------------------------------------------------------
// Rule 6: the old product name, anywhere in dist/, in file names and in file contents (images included).
// ---------------------------------------------------------------------------

const OLD_NAME = /onrender|poker[-_ ]?wiz/i;
for (const file of files) {
  if (OLD_NAME.test(rel(file))) fail(rel(file), 'file name holds onrender or pokerwiz');
  if (OLD_NAME.test(readFileSync(file).toString('latin1'))) fail(rel(file), 'contents hold onrender or pokerwiz');
}

// ---------------------------------------------------------------------------
// Rule 8: no PNG master in dist/_astro/. Astro publishes every PNG that a module imports, even one that no page renders, so an unused capture in
// src/assets/screens/ ships at full size. The icons and social images are PNG on purpose, but they are copied from public/, not built into _astro/.
// ---------------------------------------------------------------------------

for (const file of files) {
  if (rel(file).startsWith('_astro/') && /\.png$/i.test(file)) {
    fail(rel(file), 'a PNG master is published in _astro/. Move the capture out of src/assets/screens/ or use it through <Picture>, which publishes AVIF and WebP.');
  }
}

// ---------------------------------------------------------------------------
// Rule 2 and the other-origin part of rule 4, for CSS (files and inline <style> blocks).
// ---------------------------------------------------------------------------

function checkCss(where, css) {
  for (const match of css.matchAll(/(?:^|[;{}\s])(?:-webkit-)?animation\s*:\s*([^;}]*)/g)) {
    if (/\b(?:view|scroll)\(/.test(match[1])) {
      fail(where, `animation shorthand holds view( or scroll(: "${match[1].trim()}". Write the longhands instead.`);
    }
  }
  const references = [
    ...[...css.matchAll(/url\(\s*(['"]?)([^'")]*)\1\s*\)/gi)].map((match) => match[2]),
    ...[...css.matchAll(/@import\s+(?:url\(\s*)?(['"])([^'"]*)\1/gi)].map((match) => match[2]),
  ];
  for (const reference of references) {
    if (leavesSite(reference)) fail(where, `CSS loads from another origin or a data: URI: ${reference.slice(0, 80)}`);
  }
}

for (const file of files.filter((candidate) => candidate.endsWith('.css'))) {
  checkCss(rel(file), readFileSync(file, 'utf8'));
}

// ---------------------------------------------------------------------------
// HTML rules: 3, 4, 5 and 7, for every page in dist/.
// ---------------------------------------------------------------------------

const LOAD_ATTRS = {
  script: ['src'],
  img: ['src', 'srcset'],
  source: ['src', 'srcset'],
  video: ['src', 'poster'],
  audio: ['src'],
  iframe: ['src'],
  embed: ['src'],
  object: ['data'],
  track: ['src'],
  input: ['src'],
  use: ['href', 'xlink:href'],
  image: ['href', 'xlink:href'],
  link: ['href'],
};
const URL_ATTRS = ['src', 'srcset', 'href', 'xlink:href', 'poster', 'data', 'action', 'formaction', 'background', 'cite'];
const JSON_SCRIPT_TYPES = ['application/ld+json', 'application/json'];

function cspDirectives(tags) {
  const meta = tags.find(
    (tag) => tag.name === 'meta' && (tag.attrs.get('http-equiv') ?? '').toLowerCase() === 'content-security-policy',
  );
  if (!meta) return undefined;
  const directives = new Map();
  for (const part of (meta.attrs.get('content') ?? '').split(';')) {
    const [name, ...tokens] = part.trim().split(/\s+/);
    if (name) directives.set(name.toLowerCase(), tokens);
  }
  return directives;
}

/** True when the block's SHA-256, SHA-384 or SHA-512 appears among the CSP tokens. */
function hashAllowed(text, tokens) {
  return ['sha256', 'sha384', 'sha512'].some((algorithm) =>
    tokens.includes(`'${algorithm}-${createHash(algorithm).update(text, 'utf8').digest('base64')}'`),
  );
}

function checkPage(file) {
  const name = rel(file);
  const html = readFileSync(file, 'utf8');
  const headEnd = html.search(/<\/head\s*>/i);
  const head = parseHtml(headEnd === -1 ? html : html.slice(0, headEnd));
  const body = parseHtml(headEnd === -1 ? '' : html.slice(headEnd));
  const tags = [...head.tags, ...body.tags];
  const inline = [...head.inline, ...body.inline];
  const reducedHead = name === '404.html';

  // Rule 7: structure every page needs.
  const h1Count = tags.filter((tag) => tag.name === 'h1').length;
  if (h1Count !== 1) fail(name, `expected one <h1>, found ${h1Count}`);
  const titles = [...(headEnd === -1 ? html : html.slice(0, headEnd)).matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)];
  if (titles.length !== 1 || titles[0][1].trim() === '') fail(name, `expected one non-empty <title>, found ${titles.length}`);
  if (!reducedHead) {
    const descriptions = head.tags.filter(
      (tag) => tag.name === 'meta' && tag.attrs.get('name') === 'description' && (tag.attrs.get('content') ?? '').trim() !== '',
    );
    if (descriptions.length !== 1) fail(name, `expected one meta description, found ${descriptions.length}`);
    const canonicals = head.tags.filter(
      (tag) => tag.name === 'link' && tag.attrs.get('rel') === 'canonical' && (tag.attrs.get('href') ?? '').trim() !== '',
    );
    if (canonicals.length !== 1) fail(name, `expected one canonical link, found ${canonicals.length}`);
  }

  // Rules 3 and 4: attributes.
  for (const tag of tags) {
    if (tag.attrs.has('style')) fail(name, `<${tag.name}> has a style attribute`);
    for (const attr of URL_ATTRS) {
      for (const url of urlsIn(attr, tag.attrs.get(attr) ?? '')) {
        if (/^\s*data:/i.test(url)) fail(name, `<${tag.name} ${attr}> holds a data: URI`);
      }
    }
    for (const attr of LOAD_ATTRS[tag.name] ?? []) {
      for (const url of urlsIn(attr, tag.attrs.get(attr) ?? '')) {
        if (url && !/^\s*data:/i.test(url) && leavesSite(url)) fail(name, `<${tag.name} ${attr}> loads from another origin: ${url}`);
      }
    }
    if ((tag.name === 'a' || tag.name === 'area') && leavesSite(tag.attrs.get('href') ?? '')) {
      fail(name, `<${tag.name} href> leaves the site: ${tag.attrs.get('href')}`);
    }
  }

  // Rule 5: every inline script and style needs its hash in the CSP.
  const csp = cspDirectives(tags);
  if (!csp) {
    fail(name, 'no Content-Security-Policy <meta> tag');
  } else {
    for (const block of inline) {
      if (block.name === 'script') {
        if (block.attrs.has('src') || JSON_SCRIPT_TYPES.includes((block.attrs.get('type') ?? '').toLowerCase())) continue;
        if (!hashAllowed(block.text, csp.get('script-src') ?? [])) {
          fail(name, `inline script hash is missing from the CSP (starts: ${block.text.trim().slice(0, 50)})`);
        }
      } else if (!hashAllowed(block.text, csp.get('style-src') ?? [])) {
        fail(name, `inline style hash is missing from the CSP (starts: ${block.text.trim().slice(0, 50)})`);
      }
      if (block.name === 'style') checkCss(name, block.text);
    }
  }

  return { name, tags };
}

const pages = files.filter((file) => file.endsWith('.html')).map(checkPage);

// ---------------------------------------------------------------------------
// Rule 1: home budgets. JS counts every file the home page loads at once ("on load") and every file it can load at all.
// ---------------------------------------------------------------------------

const home = pages.find((page) => page.name === 'index.html');
if (!home) {
  fail('index.html', 'the home page is missing from dist/');
} else {
  const fileFor = (href) => {
    const path = decodeURI(new URL(href, `${siteOrigin}/`).pathname).replace(/^\//, '');
    const file = join(dist, path);
    return existsSync(file) ? path : undefined;
  };

  // CSS on load: the stylesheet links, except inside <noscript>, which a browser with script never loads.
  const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
  const sheets = parseHtml(homeHtml.replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi, ''))
    .tags.filter((tag) => tag.name === 'link' && /\bstylesheet\b/i.test(tag.attrs.get('rel') ?? ''))
    .map((tag) => fileFor(tag.attrs.get('href') ?? ''))
    .filter(Boolean);
  const cssKB = sheets.reduce((sum, path) => sum + gzKB(readFileSync(join(dist, path))), 0);
  // CSS in total: every stylesheet the page names anywhere, so a section that loads its own later (data-sheets on #showdown, or a noscript link) still counts.
  const named = new Set([...homeHtml.matchAll(/\/_astro\/[^\s"'<>]+?\.css/g)].map((match) => fileFor(match[0])).filter(Boolean));
  const cssTotalKB = [...new Set([...sheets, ...named])].reduce((sum, path) => sum + gzKB(readFileSync(join(dist, path))), 0);

  const entries = home.tags
    .filter(
      (tag) =>
        (tag.name === 'script' && tag.attrs.has('src')) ||
        (tag.name === 'link' && /\bmodulepreload\b/i.test(tag.attrs.get('rel') ?? '')),
    )
    .map((tag) => fileFor(tag.attrs.get(tag.name === 'script' ? 'src' : 'href') ?? ''))
    .filter(Boolean);

  const staticImports = /\b(?:import|export)\s*(?:[^'"();`]*?\bfrom\s*)?["']([^"']+)["']/g;
  const dynamicImports = /\bimport\(\s*["'`]([^"'`]+)["'`]\s*\)/g; // The minifier writes these with backticks.

  /** Every JS file reachable from the entries. Dynamic imports only count when `withDynamic` is set. */
  function reach(withDynamic) {
    const seen = new Set();
    const queue = [...entries];
    while (queue.length) {
      const path = queue.pop();
      if (seen.has(path) || !path.endsWith('.js')) continue;
      seen.add(path);
      const code = readFileSync(join(dist, path), 'utf8');
      const patterns = withDynamic ? [staticImports, dynamicImports] : [staticImports];
      for (const pattern of patterns) {
        for (const match of code.matchAll(pattern)) {
          const spec = match[1];
          if (!/^(\.{1,2}\/|\/)/.test(spec)) continue;
          const target = spec.startsWith('/') ? spec.slice(1) : posix.join(posix.dirname(path), spec);
          if (existsSync(join(dist, target))) queue.push(target);
        }
      }
    }
    return seen;
  }

  const sizeOf = (set) => [...set].reduce((sum, path) => sum + gzKB(readFileSync(join(dist, path))), 0);
  const jsOnLoadKB = sizeOf(reach(false));
  const jsTotalKB = sizeOf(reach(true));
  const htmlKB = gzKB(readFileSync(join(dist, 'index.html')));

  console.log(
    `home (KB gz): html ${kb(htmlKB)} of ${LIMIT_KB.html} | css on load ${kb(cssKB)} of ${LIMIT_KB.css} | css total ${kb(cssTotalKB)} of ${LIMIT_KB.cssTotal} | js on load ${kb(jsOnLoadKB)} of ${LIMIT_KB.jsOnLoad} | js total ${kb(jsTotalKB)} of ${LIMIT_KB.jsTotal}`,
  );
  if (htmlKB > LIMIT_KB.html) fail('index.html', `HTML is ${kb(htmlKB)} KB gz, over the ${LIMIT_KB.html} KB limit`);
  if (cssKB > LIMIT_KB.css) fail('index.html', `CSS on load is ${kb(cssKB)} KB gz, over the ${LIMIT_KB.css} KB limit`);
  if (cssTotalKB > LIMIT_KB.cssTotal) fail('index.html', `CSS in total is ${kb(cssTotalKB)} KB gz, over the ${LIMIT_KB.cssTotal} KB limit`);
  if (jsOnLoadKB > LIMIT_KB.jsOnLoad) fail('index.html', `JS on load is ${kb(jsOnLoadKB)} KB gz, over the ${LIMIT_KB.jsOnLoad} KB limit`);
  if (jsTotalKB > LIMIT_KB.jsTotal) fail('index.html', `JS in total is ${kb(jsTotalKB)} KB gz, over the ${LIMIT_KB.jsTotal} KB limit`);
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error(`\ncheck-dist: ${failures.length} problem${failures.length === 1 ? '' : 's'} found`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-dist: ok (${pages.length} pages, ${files.length} files)`);
