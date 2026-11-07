// pages.ts: the page list. One entry per URL with its title, description, heading and social art; SeoHead, the sitemap and the routes all read it.
// Words come from docs/site/COPY.md (final); rules and limits from docs/site/SEO.md. Only paths live here: build absolute URLs from Astro.site.

export interface Crumb {
  name: string;
  /** Root-relative path of the crumb's page. */
  path: string;
}

export interface PageEntry {
  /** Canonical path: "/" or "/name". Lowercase, no extension, no trailing slash. */
  path: string;
  /** <title> and og:title. 60 characters at most. */
  title: string;
  /** Meta description and og:description. 155 characters at most. The 404 has none. */
  description?: string;
  /** Text of the page's single <h1>. On the home page this is the outcome line after the kicker. */
  h1: string;
  /** Home only: the kicker that opens the H1, followed by a visually hidden period. */
  kicker?: string;
  /** Social image under public/og/, 1200 x 630. The 404 has none. */
  ogImage?: string;
  /** og:image:alt and twitter:image:alt, 125 characters at most. */
  ogAlt?: string;
  /** Visible breadcrumb trail, current page last. Absent on home and the 404. */
  breadcrumb?: readonly Crumb[];
  /** Which JSON-LD block the page prints (SEO.md section 4). */
  jsonLd: 'home' | 'breadcrumb' | 'none';
  /** Legal pages only: the real "Last updated" date (YYYY-MM-DD), also the sitemap lastmod. */
  lastmod?: string;
  /** The 404: printed with noindex, no description, canonical or social tags, and left out of the sitemap. */
  noindex?: boolean;
}

const homeCrumb: Crumb = { name: 'Home', path: '/' };

export const pages = {
  home: {
    path: '/',
    title: 'HandSolved | Live Poker Session Tracker & GTO Hand Coach',
    description:
      'Log live poker sessions, record each hand at the table, and get every decision graded against GTO. Texas Hold’em, heads-up and 3-way postflop.',
    kicker: 'Live poker session tracker and hand recorder',
    h1: 'Every hand you play, solved.',
    ogImage: '/og/home.png',
    ogAlt: 'HandSolved. Every hand you play, solved. A struck-out Call 65 bb with Fold written in red.',
    jsonLd: 'home',
  },
  gtoHandReview: {
    path: '/gto-hand-review',
    title: 'GTO Hand Review for Live Poker Hands | HandSolved',
    description:
      'Record a hand and see how often GTO takes each option, what each is worth, plus pot odds and equity. Texas Hold’em, heads-up and 3-way postflop.',
    h1: 'GTO hand review for your live poker hands',
    ogImage: '/og/gto-hand-review.png',
    ogAlt: 'HandSolved GTO hand review. A struck-out Call 65 bb with Fold written in red.',
    breadcrumb: [homeCrumb, { name: 'GTO hand review', path: '/gto-hand-review' }],
    jsonLd: 'breadcrumb',
  },
  liveRecorder: {
    path: '/live-poker-hand-recorder',
    title: 'Live Poker Hand Recorder, Street by Street | HandSolved',
    description:
      'Rebuild any hand on a poker table. Seat the players, set stacks, pick cards, then answer each action street by street. All-ins and side pots handled.',
    h1: 'Live poker hand recorder, one action at a time',
    ogImage: '/og/live-poker-hand-recorder.png',
    ogAlt:
      'HandSolved live poker hand recorder on a phone, showing an empty poker table with seats, a dealer button and board slots.',
    breadcrumb: [homeCrumb, { name: 'Live poker hand recorder', path: '/live-poker-hand-recorder' }],
    jsonLd: 'breadcrumb',
  },
  // The legal pages show a breadcrumb because COPY.md lists one; SEO.md section 4 prints no JSON-LD for them, so jsonLd is 'none'.
  privacy: {
    path: '/privacy',
    title: 'Privacy | HandSolved',
    description:
      'HandSolved is a concept site. It collects and sends nothing. See the two small notes it keeps in your own browser and what the pop-ups do.',
    h1: 'Privacy',
    ogImage: '/og/default.png',
    ogAlt: 'HandSolved wordmark and spade mark.',
    breadcrumb: [homeCrumb, { name: 'Privacy', path: '/privacy' }],
    jsonLd: 'none',
    lastmod: '2026-11-01',
  },
  terms: {
    path: '/terms',
    title: 'Terms | HandSolved',
    description:
      'Terms for the HandSolved concept site. Prices are illustrative, nothing can be bought, and sample hands and numbers are not real results.',
    h1: 'Terms',
    ogImage: '/og/default.png',
    ogAlt: 'HandSolved wordmark and spade mark.',
    breadcrumb: [homeCrumb, { name: 'Terms', path: '/terms' }],
    jsonLd: 'none',
    lastmod: '2026-11-01',
  },
  // SEO.md section 3 prints no description on the 404, so COPY.md's 404 meta description is deliberately unused.
  notFound: {
    path: '/404',
    title: 'Page not found | HandSolved',
    h1: 'This page folded.',
    jsonLd: 'none',
    noindex: true,
  },
} satisfies Record<string, PageEntry>;

/** Pages that go in sitemap.xml: every indexable page. */
export const sitemapPages: readonly PageEntry[] = Object.values(pages).filter((page) => !('noindex' in page));

/** Absolute URL for a root-relative path. `site` is Astro.site (the one site-URL setting). */
export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).href;
}
