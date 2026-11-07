// site.ts: site-wide values used on every page: brand, button labels, navigation, footer groups and the concept note. No domain here: read it as Astro.site.

export const siteName = 'HandSolved';

/**
 * One copy token that fills the WebSite and Organization JSON-LD (SEO.md section 4). The same words open the visible FAQ 1 answer (home-faq.ts reads this
 * constant), so the markup never says a sentence the page does not show.
 */
export const oneLiner =
  'HandSolved is a live poker session tracker and hand recorder that grades each decision in your Texas Hold’em hands against GTO strategy.';

/** Shown in the footer, the mobile menu and the sign-up success step. */
export const conceptNote = 'Concept site, illustrative prices, nothing is collected or sent.';

export const skipLinkText = 'Skip to main content';
export const brandLinkLabel = 'HandSolved home';
export const copyright = '© 2026 HandSolved';

/**
 * The concept plan prices, in dollars, typed once. Everything else is worked out from these two numbers: the yearly total and the yearly saving
 * (COPY.md, Price notes). Pricing.astro prints them, and the early-access pop-up's plan chips must read them from here too. Prices never go through the BB/$ switch.
 */
export const pricing = {
  proMonthly: 34,
  proYearly: 27,
  /** Billed once a year: 12 months at the yearly rate. */
  get proYearlyTotal() {
    return this.proYearly * 12;
  },
  /** What the yearly plan saves over 12 monthly payments. */
  get proYearlySaving() {
    return this.proMonthly * 12 - this.proYearly * 12;
  },
};

/** Fixed button labels, used word for word everywhere. */
export const cta = {
  demo: 'Grade a sample hand',
  early: 'Get early access',
} as const;

export interface NavLink {
  label: string;
  /** Root-relative target that works from every page. */
  href: string;
  /** Same-page anchor used instead of `href` while on the home page. */
  homeHref?: string;
}

/** Header links, in order. The header button is the demo CTA. */
export const navLinks: readonly NavLink[] = [
  { label: 'How it works', href: '/#how', homeHref: '#how' },
  { label: 'Coach', href: '/gto-hand-review' },
  { label: 'Recorder', href: '/live-poker-hand-recorder' },
  { label: 'Pricing', href: '/#pricing', homeHref: '#pricing' },
];

export interface FooterGroup {
  heading: string;
  links: readonly { label: string; href: string }[];
}

export const footerGroups: readonly FooterGroup[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'How it works', href: '/#how' },
      { label: 'Highlights', href: '/#highlights' },
      { label: 'Your numbers', href: '/#numbers' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    heading: 'Pages',
    links: [
      { label: 'GTO hand review', href: '/gto-hand-review' },
      { label: 'Live poker hand recorder', href: '/live-poker-hand-recorder' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

/** Closing band, shown above the footer on every page except the legal pages and the 404. */
export const closingBand = {
  heading: 'Pick a move. See the grade.',
  line: 'Three sample hands with real engine numbers. It runs in your browser and sends nothing.',
  pricingLink: { label: 'See the concept pricing', href: '/#pricing' },
} as const;

/** Small fixed labels from COPY.md, Global elements: the burger, the dialog close button, the sample-data chip and the no-script link. */
export const labels = {
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  close: 'Close',
  sampleData: 'Sample data',
  /** Not in COPY.md: names for landmarks only. */
  navPrimary: 'Primary',
  navFooter: 'Footer',
} as const;

/** The no-script link printed beside every demo button (COPY.md, No-script lines). */
export const noScriptDemo = { label: 'Read a worked example', href: '/gto-hand-review#worked-example' } as const;

/** The BB/$ switch (COPY.md, Unit switch). */
export const unitSwitch = {
  group: 'Show amounts in',
  bb: { text: 'BB', name: 'Big blinds', announce: 'Amounts now shown in big blinds.' },
  usd: { text: '$', name: 'Dollars', announce: 'Amounts now shown in dollars.' },
} as const;
