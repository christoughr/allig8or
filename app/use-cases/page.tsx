import Link from 'next/link';
import ContentShell from '@/components/content/ContentShell';
import { USE_CASES } from '@/lib/use-cases';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Use cases — AI websites, decks, sheets & docs',
  description:
    'See how teams use allig8tor for pitch decks, Excel budgets, landing pages, and more.',
  path: '/use-cases',
});

export default function UseCasesIndexPage() {
  return (
    <ContentShell backHref="/" backLabel="← allig8tor home">
      <h1 className="font-heading text-4xl font-bold text-white">Use cases</h1>
      <p className="mt-4 text-lg text-zinc-400">
        Pick a workflow — open the generator with the right tool pre-selected.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-1">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.slug}
            href={`/use-cases/${uc.slug}`}
            className="block rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
          >
            <h2 className="text-xl font-semibold text-white">{uc.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{uc.description}</p>
          </Link>
        ))}
      </div>
      <p className="mt-12 text-center">
        <Link href="/blog" className="text-sm text-emerald-400 hover:underline">
          Read the blog →
        </Link>
      </p>
    </ContentShell>
  );
}
