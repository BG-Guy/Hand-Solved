// legal.ts: the plain-words copy for /privacy and /terms, word for word from docs/site/COPY.md. Not legal advice; the owner reviews it.

export interface LegalClause {
  /** Anchor id for the table of contents. */
  id: string;
  heading: string;
  paragraphs: readonly string[];
}

export interface LegalDoc {
  summary: string;
  tocLabel: string;
  clauses: readonly LegalClause[];
}

export const privacy: LegalDoc = {
  summary:
    'HandSolved is a concept site. It collects nothing and sends nothing. Small notes stay in your own browser, local storage for settings such as big blinds or dollars and session storage so the page intro plays once a visit. Nothing you type is stored.',
  tocLabel: 'On this page',
  clauses: [
    {
      id: 'what-this-site-is',
      heading: 'What this site is',
      paragraphs: [
        'HandSolved is a concept site. It shows a poker tracking and coaching product for a portfolio. It is not a live service, and it has no accounts and no purchases.',
      ],
    },
    {
      id: 'what-it-collects',
      heading: 'What it collects',
      paragraphs: [
        'Nothing. The site’s own code sets no cookies and runs no analytics, ads or trackers. It loads no scripts, fonts or embeds from other sites, so every file comes from the same place as the page.',
      ],
    },
    {
      id: 'what-stays-in-your-browser',
      heading: 'What stays in your browser',
      paragraphs: [
        'Local storage keeps a note in your browser until you clear it. HandSolved uses it to remember settings, such as whether you chose big blinds or dollars.',
        'Session storage keeps a note only until you close the tab. HandSolved uses it so the short opening animation on the home page plays once a visit and not on every page.',
        'Both stay on your device. They are never sent anywhere, and neither holds anything you type. You can clear them in your browser settings.',
      ],
    },
    {
      id: 'the-early-access-box',
      heading: 'The early-access box',
      paragraphs: [
        'The pop-up checks that what you type looks like an email address. The check runs in your browser. The address is not sent, saved or logged. It is shown back to you on the last step and cleared when you close the box.',
      ],
    },
    {
      id: 'server-logs',
      heading: 'Server logs',
      paragraphs: [
        'The server that delivers these pages may keep ordinary access logs, such as the time of a request and the page asked for. This site does not read those logs and does not control them.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      paragraphs: ['This concept site has no contact form and no contact address, because it collects nothing.'],
    },
    {
      id: 'if-this-changes',
      heading: 'If this changes',
      paragraphs: [
        'If this site ever starts collecting anything, this page and the concept note in the footer change first.',
      ],
    },
    {
      id: 'not-legal-advice',
      heading: 'Not legal advice',
      paragraphs: [
        'This page describes in plain words how this concept site behaves. It is not legal advice, and it is not the privacy policy of a real business.',
      ],
    },
  ],
};

export const terms: LegalDoc = {
  summary:
    'HandSolved is a concept site. Prices are illustrative and nothing can be bought. Sample hands and numbers are saved examples and do not show real results. Solver output here is for study and is not advice.',
  tocLabel: 'On this page',
  clauses: [
    {
      id: 'what-this-site-is',
      heading: 'What this site is',
      paragraphs: [
        'HandSolved is a concept site that shows a poker tracking and coaching product. It was made for a portfolio. It may change or go offline at any time.',
      ],
    },
    {
      id: 'no-purchases',
      heading: 'No purchases',
      paragraphs: [
        'Prices and plans are illustrative. Nothing here can be bought, reserved or charged, and the early-access form does not register anyone for anything.',
      ],
    },
    {
      id: 'sample-data',
      heading: 'Sample data',
      paragraphs: [
        'Every hand, number, grade and chart on this site is sample data or a saved run of the real engine. None of it belongs to a real player. Live solves can differ slightly from the saved runs.',
      ],
    },
    {
      id: 'for-study-only',
      heading: 'For study only',
      paragraphs: [
        'GTO is a baseline to study. Nothing on this site promises winnings, and poker carries a risk of loss. Grades are estimates inside a simplified game. They are not financial, legal or gambling advice.',
      ],
    },
    {
      id: 'no-gambling-here',
      heading: 'No gambling here',
      paragraphs: ['This site has no real-money play, no games of chance and no wagering.'],
    },
    {
      id: 'names',
      heading: 'Names',
      paragraphs: [
        'HandSolved is a concept name. Other product names that appear, such as Safari, Chrome, Excel and Google Sheets, belong to their owners.',
      ],
    },
    {
      id: 'using-this-site',
      heading: 'Using this site',
      paragraphs: ['You can read the pages and use the pop-ups as you like.'],
    },
    {
      id: 'as-is',
      heading: 'As is',
      paragraphs: [
        'The pages are provided as they are. No promise is made that they are complete, correct or always available.',
      ],
    },
    {
      id: 'changes-and-contact',
      heading: 'Changes and contact',
      paragraphs: [
        'These terms may change, and the date at the top shows the last update. This concept site has no contact address.',
      ],
    },
    {
      id: 'not-legal-advice',
      heading: 'Not legal advice',
      paragraphs: ['This page is written in plain words for a concept site. It is not legal advice.'],
    },
  ],
};
