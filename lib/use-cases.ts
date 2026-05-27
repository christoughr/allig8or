export type UseCase = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tool: 'website' | 'presentation' | 'spreadsheet' | 'document' | 'pdf';
  sections: { heading: string; body: string }[];
};

export const USE_CASES: UseCase[] = [
  {
    slug: 'ai-pitch-deck-generator',
    title: 'AI Pitch Deck Generator',
    description:
      'Create investor-ready PowerPoint pitch decks from a plain-language prompt. Download .pptx in minutes with allig8tor.',
    keywords: ['AI pitch deck', 'AI presentation maker', 'prompt to PowerPoint'],
    tool: 'presentation',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Founders, freelancers, and consultants who need a credible deck fast — without fighting slide masters in PowerPoint.',
      },
      {
        heading: 'What you get',
        body: 'A structured .pptx with title slides, problem/solution, traction placeholders, and a clear ask — generated from your brief.',
      },
      {
        heading: 'Example prompt',
        body: '“Series A pitch for a B2B SaaS that automates invoice reconciliation. 12 slides, modern, data-driven tone.”',
      },
    ],
  },
  {
    slug: 'ai-spreadsheet-generator',
    title: 'AI Spreadsheet Generator',
    description:
      'Generate Excel budgets, trackers, and models from a text description. Export .xlsx with formulas and formatting.',
    keywords: ['AI Excel generator', 'AI spreadsheet', 'budget spreadsheet AI'],
    tool: 'spreadsheet',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Operators, analysts, and small business owners who need a working sheet today — not a blank grid.',
      },
      {
        heading: 'What you get',
        body: 'Downloadable .xlsx with labeled columns, sample rows, and formulas where appropriate (sums, growth, runway).',
      },
      {
        heading: 'Example prompt',
        body: '“12-month startup budget with hiring plan, software, and marketing rows. Include monthly burn and runway.”',
      },
    ],
  },
  {
    slug: 'ai-landing-page-builder',
    title: 'AI Landing Page Builder',
    description:
      'Build a marketing landing page from one prompt. Live HTML preview plus copy you can ship or hand to a developer.',
    keywords: ['AI website builder', 'AI landing page', 'prompt to website'],
    tool: 'website',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Marketers and solo founders validating an offer before investing in a full site build.',
      },
      {
        heading: 'What you get',
        body: 'Responsive HTML with hero, proof, features, and CTA sections — tuned to your positioning.',
      },
      {
        heading: 'Example prompt',
        body: '“Landing page for an AI office suite called allig8tor. Dark theme, emerald accent, emphasize prompt-in file-out.”',
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
