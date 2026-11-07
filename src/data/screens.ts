// screens.ts: the app captures the site uses (PNG masters in src/assets/screens/) with their kind and alt text.
// Every capture here is used on a page: a PNG in that folder that no page uses is still published as a full-size file, so it does not belong there.
// The seven captures nothing uses (desk-highlights, desk-home, desk-practice, phone-bankroll, phone-hands, phone-highlights, phone-home) are parked in showcase/app/unused/, which stays out of git.
// Alt text is 8 to 20 words (SEO.md section 8): what the screen shows, then the figure that matters, ending in Sample data wherever numbers show. COPY.md, "Alt text for every device screen slot", holds the same words.
// The default alt is for the first use on a page. Where one screen appears twice on a page, the second use passes its own `alt` prop, so no two images on a page share one.
// The capture desk-coach-decision.png is never used: it prints a number the demo contradicts.

export type ScreenName =
  | 'phone-coach-decision'
  | 'phone-coach-score'
  | 'phone-practice'
  | 'phone-insights'
  | 'phone-recorder'
  | 'phone-goals'
  | 'phone-history'
  | 'phone-review'
  | 'desk-coach-top'
  | 'desk-insights';

export type PhoneScreen = Extract<ScreenName, `phone-${string}`>;
export type DesktopScreen = Extract<ScreenName, `desk-${string}`>;

export interface ScreenInfo {
  /** Phone captures are 1170 x 2532, desktop captures 2880 x 1800. */
  kind: 'phone' | 'desktop';
  alt: string;
}

export const screens: Record<ScreenName, ScreenInfo> = {
  'phone-coach-decision': {
    kind: 'phone',
    alt: 'Coach verdict on a phone: GTO folds 96 percent, and calling 65 bb is graded Blunder, F. Sample data.',
  },
  'phone-coach-score': {
    kind: 'phone',
    alt: 'HandSolved coach report on a phone: the hand is graded F, Poor, with 6 decisions reviewed. Sample data.',
  },
  'phone-practice': {
    kind: 'phone',
    alt: 'Full-screen practice table on a phone: the flop, a 20 big blind pot and three action buttons. Sample data.',
  },
  'phone-insights': {
    kind: 'phone',
    alt: 'Insights on a phone: no downswing, swings rated very normal, and plus 360 big blinds in September. Sample data.',
  },
  'phone-recorder': {
    kind: 'phone',
    alt: 'Add hand screen on a phone: an empty poker table with seats, a dealer button and board slots. Sample screen.',
  },
  'phone-goals': {
    kind: 'phone',
    alt: 'Goals on a phone: 0 of 4 on track, and a volume goal at 4,683 of 20,000 hands. Sample data.',
  },
  'phone-history': {
    kind: 'phone',
    alt: 'Game history on a phone: 18 sessions, 11 winning, net plus 733 big blinds in 66.8 hours. Sample data.',
  },
  'phone-review': {
    kind: 'phone',
    alt: 'Hand review on a phone: a 219 big blind pot, result plus 109, and a Coach review button. Sample data.',
  },
  'desk-coach-top': {
    kind: 'desktop',
    alt: 'Coach report on a desktop: graded F, Poor, with 72.69 big blinds given up to GTO. Sample data.',
  },
  'desk-insights': {
    kind: 'desktop',
    alt: 'Insights on a desktop: no downswing, swings rated very normal, 18 sessions and 67 hours played. Sample data.',
  },
};
