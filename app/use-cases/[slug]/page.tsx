import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentShell from '@/components/content/ContentShell';
import { USE_CASES, getUseCase } from '@/lib/use-cases';
import { buildPageMetadata } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog';

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
  const relatedPosts = getAllPosts()
    .filter((p) => (p.keywords ?? []).some((k) => uc.keywords.includes(k)))
    .slice(0, 3);

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
      {relatedPosts.length > 0 && (
        <section className="mt-12 rounded-2xl border border-white/10 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Related guides</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-emerald-500/30 hover:text-white"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
