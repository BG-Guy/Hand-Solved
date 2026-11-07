// home-faq.ts: the home page FAQ, word for word from COPY.md 4.9. Faq.astro prints it when a page passes no items of its own.
// Apostrophes are typographic (COPY.md, Punctuation and format). No FAQ structured data is made from this: SEO.md 4.
// An answer is plain text. [words](/path) makes a real root-relative link (SEO.md section 6); Faq.astro turns it into <a href> and nothing else.
import { oneLiner } from '../../data/site';

export interface FaqItem {
  question: string;
  answer: string;
}

/** The card index drawn in the section's corner: rank in the display face, suit as one of the four icons. */
export interface FaqIndex {
  rank: string;
  suit: 'spade' | 'heart' | 'club' | 'diamond';
}

export const homeFaq = {
  heading: 'Questions, answered first',
  lead: 'Short answers, with the answer in the first sentence.',
  /** DESIGN.md section 6: #faq is the 6 of spades. */
  index: { rank: '6', suit: 'spade' } satisfies FaqIndex,
  items: [
    {
      question: 'What is HandSolved?',
      answer:
        `${oneLiner} You log sessions, rebuild hands on a table and see each decision graded against GTO, the strategy a poker solver computes. It also has a practice table and a bankroll chart.`,
    },
    {
      question: 'What does graded against GTO mean?',
      answer:
        'It means each choice you made is compared with what GTO does in that spot, then scored from 0 to 100. GTO stands for game theory optimal, the strategy a poker solver computes. It is a baseline to compare against and says nothing about how one opponent will play.',
    },
    {
      question: 'Which games and spots does the coach cover?',
      answer:
        'The coach covers Texas Hold’em only. Preflop it uses charts solved for 8 players at the hand’s stack depth, for cash games and tournaments. After the flop it solves heads-up and 3-way pots. Omaha and custom spots are not covered, and pots with four or more players after the flop are marked not graded. Read [what the coach covers](/gto-hand-review).',
    },
    {
      question: 'Is it an online HUD, and can it import hand histories from poker sites?',
      answer:
        'No to both. HandSolved is for hands you play live and enter yourself on a table. It does not read hand-history files from online poker sites, and it draws nothing over an online table. It does import its own backups and one other tracker’s CSV export. Read about [entering a hand at the table](/live-poker-hand-recorder).',
    },
    {
      question: 'Do I need to install anything?',
      answer:
        'No. The sample hands on this page run in your browser, and this concept site has nothing to install. The product itself is built as an installable web app for iPhone, Android and desktop, so it needs no store.',
    },
    {
      question: 'Can I export or import my data?',
      answer:
        'Yes. You can save a full backup file, export sessions and hands as CSV spreadsheets, and import a backup or one other tracker’s CSV export. An import shows you what it will do before it runs.',
    },
    {
      question: 'Is this site selling something right now?',
      answer:
        'No. This is a concept site, so prices are illustrative, nothing can be bought and nothing is collected or sent. The early-access form only checks that an address looks like an email, and nothing you type is stored. Two small notes stay in your own browser, local storage for settings and session storage for the page intro. Read the [privacy notice](/privacy) and the [terms of use](/terms).',
    },
  ] satisfies FaqItem[],
};
