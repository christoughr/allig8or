import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentShell from '@/components/content/ContentShell';
import { USE_CASES, getUseCase } from '@/lib/use-cases';
import { buildPageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};

  return buildPageMetadata({
    title: uc.title,
    description: uc.description,
    path: `/use-cases/${slug}`,
    keywords: uc.keywords,
  });
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  return (
    <ContentShell backHref="/use-cases" backLabel="← All use cases">
      <h1 className="font-heading text-4xl font-bold text-white">{uc.title}</h1>
      <p className="mt-4 text-lg text-zinc-400">{uc.description}</p>

      <div className="mt-10 space-y-8">
        {uc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-zinc-400">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
        <Link
          href={`/app?tool=${uc.tool}`}
          className="inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-[#070b09] hover:bg-emerald-400"
        >
          Try {uc.title} →
        </Link>
      </div>
    </ContentShell>
  );
}
