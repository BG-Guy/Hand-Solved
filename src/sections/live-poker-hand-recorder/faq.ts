// faq.ts: the four questions of /live-poker-hand-recorder (COPY.md "5. FAQ"), word for word, with typographic apostrophes. No FAQPage markup is made from this (SEO.md 4).
import type { FaqIndex, FaqItem } from '../../components/Faq/home-faq';

export const recorderFaq = {
  heading: 'Questions about recording hands',
  /** DESIGN.md 7.5: product pages restart at the ace of spades, so the fourth section is the jack of diamonds. */
  index: { rank: 'J', suit: 'diamond' } satisfies FaqIndex,
  items: [
    {
      question: 'What do I need to record a hand?',
      answer:
        'You need each player’s seat, each stack and the actions in order. Stacks can be an exact amount or Short, Average, Big or Huge. Pick the cards you know, and answer each player’s action turn by turn.',
    },
    {
      question: 'What if I do not know the stacks?',
      answer:
        'Pick Short, Average, Big or Huge for any stack you do not know. A hand without stacks is rebuilt from the action log, and the review lists what was assumed.',
    },
    {
      question: 'Can I import online hand histories?',
      answer:
        'No. HandSolved is for hands you play live and enter yourself. It does not read hand-history files from online poker sites. It does import its own backups and one other tracker’s CSV export.',
    },
    {
      question: 'Does it work on iPhone and Android?',
      answer:
        'Yes, the product is built as a web app with phone, tablet and desktop layouts. On iPhone it adds to the Home Screen from Safari, and Chrome, Edge and Android show an Install button. This concept site has nothing to install.',
    },
  ] satisfies FaqItem[],
};
