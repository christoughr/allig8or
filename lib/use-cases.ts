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
  {
    slug: 'ai-proposal-document-generator',
    title: 'AI Proposal Document Generator',
    description:
      'Create structured proposal documents with scope, timeline, pricing, and milestones in .docx format from a single prompt.',
    keywords: ['AI proposal generator', 'AI Word document', 'AI client proposal'],
    tool: 'document',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Agencies, freelancers, and consultants who need fast proposal turnaround without sacrificing professionalism.',
      },
      {
        heading: 'What you get',
        body: 'A .docx-ready proposal structure with headings, bullets, timeline sections, and optional pricing tables.',
      },
      {
        heading: 'Example prompt',
        body: '“Create a web redesign proposal for a B2B SaaS client with 8-week timeline, deliverables, and milestone-based payment terms.”',
      },
    ],
  },
  {
    slug: 'ai-invoice-and-pdf-generator',
    title: 'AI Invoice and PDF Generator',
    description:
      'Generate client-ready invoices and PDF documents with line items, terms, and totals from natural language instructions.',
    keywords: ['AI invoice generator', 'AI PDF generator', 'freelance invoice template AI'],
    tool: 'pdf',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Freelancers and service teams who invoice frequently and want consistent formatting with less admin work.',
      },
      {
        heading: 'What you get',
        body: 'A print-ready HTML output optimized for PDF export with line items, totals, payment terms, and professional layout.',
      },
      {
        heading: 'Example prompt',
        body: '“Create a UX design invoice in USD with 4 line items, subtotal, tax, and net-15 payment terms for April 2026 work.”',
      },
    ],
  },
  {
    slug: 'ai-client-report-generator',
    title: 'AI Client Report Generator',
    description:
      'Build polished monthly client reports with KPIs, highlights, blockers, and next actions for agencies and service teams.',
    keywords: ['AI report generator', 'AI client report', 'agency reporting template'],
    tool: 'document',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Agencies and operators who need recurring reports that are clear, consistent, and easy to customize.',
      },
      {
        heading: 'What you get',
        body: 'A report-ready document structure with executive summary, KPI sections, commentary, and next-step recommendations.',
      },
      {
        heading: 'Example prompt',
        body: '“Generate a monthly SEO client report with traffic KPIs, ranking changes, work completed, risks, and next-month priorities.”',
      },
    ],
  },
  {
    slug: 'ai-marketing-plan-generator',
    title: 'AI Marketing Plan Generator',
    description:
      'Generate structured marketing plans with goals, channels, campaign calendar, and KPI tracking in minutes.',
    keywords: ['AI marketing plan generator', 'AI marketing strategy document', 'campaign plan template AI'],
    tool: 'document',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Startups and growth teams that need clear campaign planning without spending hours formatting docs.',
      },
      {
        heading: 'What you get',
        body: 'A complete marketing plan outline with objectives, audience, channel strategy, timeline, and KPI framework.',
      },
      {
        heading: 'Example prompt',
        body: '“Create a Q3 marketing plan for a B2B AI SaaS including SEO, paid social, webinar funnel, and KPI targets.”',
      },
    ],
  },
  {
    slug: 'ai-sales-deck-generator',
    title: 'AI Sales Deck Generator',
    description:
      'Create persuasive sales decks with clear value proposition, objections handling, and call-to-action slides.',
    keywords: ['AI sales deck generator', 'sales presentation AI', 'B2B sales slides'],
    tool: 'presentation',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Sales teams and founders who need faster, repeatable deck creation for demos and outbound meetings.',
      },
      {
        heading: 'What you get',
        body: 'A .pptx-ready structure with problem framing, solution walkthrough, proof, pricing logic, and closing CTA.',
      },
      {
        heading: 'Example prompt',
        body: '“Build a 12-slide enterprise sales deck for AI documentation software targeting IT teams.”',
      },
    ],
  },
  {
    slug: 'ai-seo-report-generator',
    title: 'AI SEO Report Generator',
    description:
      'Produce monthly SEO reports with rankings, traffic summary, completed actions, and next-step recommendations.',
    keywords: ['AI SEO report generator', 'SEO client report template', 'monthly SEO report'],
    tool: 'document',
    sections: [
      {
        heading: 'Who it is for',
        body: 'SEO freelancers and agencies delivering recurring performance updates to clients.',
      },
      {
        heading: 'What you get',
        body: 'A report format with executive summary, KPI breakdown, completed work, blockers, and action plan.',
      },
      {
        heading: 'Example prompt',
        body: '“Create an SEO performance report for April with ranking changes, organic traffic trends, and next-month priorities.”',
      },
    ],
  },
  {
    slug: 'ai-board-update-deck-generator',
    title: 'AI Board Update Deck Generator',
    description:
      'Generate board update decks with metrics, highlights, risks, and strategic decisions in a clean investor format.',
    keywords: ['board update deck AI', 'AI investor update slides', 'startup board deck template'],
    tool: 'presentation',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Founders and operators preparing monthly or quarterly board updates under tight deadlines.',
      },
      {
        heading: 'What you get',
        body: 'A concise board-style presentation with KPI snapshots, key wins, risks, runway notes, and asks.',
      },
      {
        heading: 'Example prompt',
        body: '“Create a quarterly board deck for a seed-stage SaaS with growth metrics, burn, runway, risks, and key asks.”',
      },
    ],
  },
  {
    slug: 'ai-budget-forecast-generator',
    title: 'AI Budget Forecast Generator',
    description:
      'Create budget and forecast spreadsheets with monthly assumptions, formulas, and scenario planning tabs.',
    keywords: ['AI budget forecast generator', 'financial forecast spreadsheet AI', 'startup budget model'],
    tool: 'spreadsheet',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Finance and operations teams that need fast model drafts for planning and decision-making.',
      },
      {
        heading: 'What you get',
        body: 'An .xlsx-ready model with monthly projections, growth assumptions, and formulas for planning.',
      },
      {
        heading: 'Example prompt',
        body: '“Build a 12-month budget forecast with revenue assumptions, expenses by category, and best/base/worst scenarios.”',
      },
    ],
  },
  {
    slug: 'ai-landing-page-copy-generator',
    title: 'AI Landing Page Copy Generator',
    description:
      'Generate conversion-focused landing page copy with clear messaging, proof blocks, and CTA flow.',
    keywords: ['AI landing page copy generator', 'conversion copy AI', 'website copywriting AI'],
    tool: 'website',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Founders and marketers launching new offers that need clear messaging before design-heavy work.',
      },
      {
        heading: 'What you get',
        body: 'A ready-to-preview landing page draft with headline, value props, social proof, and call-to-action.',
      },
      {
        heading: 'Example prompt',
        body: '“Create high-converting landing page copy for an AI proposal tool targeting agencies and freelancers.”',
      },
    ],
  },
  {
    slug: 'ai-contract-draft-generator',
    title: 'AI Contract Draft Generator',
    description:
      'Create first-draft service agreements and contract-style documents with clear scope, terms, and payment clauses.',
    keywords: ['AI contract draft generator', 'service agreement template AI', 'freelance contract AI'],
    tool: 'pdf',
    sections: [
      {
        heading: 'Who it is for',
        body: 'Freelancers and small teams that need structured first-draft contracts before legal review.',
      },
      {
        heading: 'What you get',
        body: 'A print-ready agreement format covering deliverables, timeline, payment terms, and revision policy.',
      },
      {
        heading: 'Example prompt',
        body: '“Draft a service agreement for website redesign project with milestones, payment schedule, and revision terms.”',
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
