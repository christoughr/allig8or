import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'AI Generator — Websites, Presentations, Spreadsheets & Docs',
  description:
    'Generate websites, PowerPoint decks, Excel spreadsheets, Word documents, and PDFs with AI. Open the allig8or workspace.',
  path: '/app',
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
