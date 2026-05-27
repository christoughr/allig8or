/** Canonical public site URL (www — matches Vercel primary alias). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://www.allig8tor.com';

export const SITE_NAME = 'allig8tor';
export const SITE_TAGLINE = 'AI Office Suite';
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  'Create websites, pitch decks, spreadsheets, Word documents, and PDFs with AI. Describe what you need in plain language — prompt in, office file out. Free to start.';

/** Primary SEO keywords (landing + metadata). */
export const SITE_KEYWORDS = [
  'AI office suite',
  'AI document generator',
  'AI presentation maker',
  'AI spreadsheet generator',
  'AI website builder',
  'generate PowerPoint with AI',
  'AI pitch deck',
  'AI Word document',
  'AI PDF generator',
  'prompt to PowerPoint',
  'prompt to Excel',
  'allig8tor',
] as const;

export const SITE_LOCALE = 'en_US';
export const CONTACT_EMAIL = 'hello@allig8tor.com';

/** Indexable marketing routes (no /app generator UI in sitemap — thin for SEO). */
export const PUBLIC_ROUTES = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/use-cases', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/login', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export const SOCIAL = {
  twitter: '@allig8tor',
} as const;
