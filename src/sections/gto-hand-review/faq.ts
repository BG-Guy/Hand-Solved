// faq.ts: the four questions of /gto-hand-review (COPY.md "6. FAQ"), word for word, with typographic apostrophes. No FAQPage markup is made from this (SEO.md 4): the visible text is what search reads.
// The sample-hand figures in answer 4 come from the same data as the worked example, so the two can never disagree.
import type { FaqIndex, FaqItem } from '../../components/Faq/home-faq';
import { example } from './worked-example';

export const reviewFaq = {
  heading: 'Questions about GTO hand review',
  /** DESIGN.md 7.5: product pages restart at the ace of spades, so the fifth section is the 10 of spades. */
  index: { rank: '10', suit: 'spade' } satisfies FaqIndex,
  items: [
    {
      question: 'Can I grade online hands?',
      answer:
        'No. HandSolved grades hands you enter yourself on a table, such as hands from your live sessions. It does not read hand-history files from online poker sites.',
    },
    {
      question: 'Does it work for Omaha?',
      answer:
        'No. The coach covers Texas Hold’em only, so Omaha is not graded. Preflop it uses 8-handed charts, and after the flop it solves heads-up and 3-way pots.',
    },
    {
      question: 'What if I did not record the stacks?',
      answer:
        'The coach makes assumptions and lists them. It rebuilds the hand from the action log, fills in the missing stacks, and shows what it assumed at the top of the review, so you can judge how much to trust the grade.',
    },
    {
      question: 'What is a blunder?',
      answer: `A blunder is a choice that scores below 30 out of 100. It gives up a very large share of the pot compared with the best option. ${example.blunderFact}`,
    },
  ] satisfies FaqItem[],
};
