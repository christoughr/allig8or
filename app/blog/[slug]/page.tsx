import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentShell from '@/components/content/ContentShell';
import { Markdown } from '@/lib/markdown';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';
import { USE_CASES } from '@/lib/use-cases';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <ContentShell backHref="/blog" backLabel="← All posts">
      <article>
        <p className="text-sm text-zinc-600">{post.date}</p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white">{post.title}</h1>
        <p className="mt-4 text-lg text-zinc-400">{post.description}</p>
        <div className="prose-custom mt-10">
          <Markdown content={post.content} />
        </div>
        <section className="mt-12 rounded-2xl border border-white/10 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Related workflows</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Move from reading to execution with a matching use case.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {USE_CASES.slice(0, 3).map((uc) => (
              <li key={uc.slug}>
                <Link
                  href={`/use-cases/${uc.slug}`}
                  className="block rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-emerald-500/30 hover:text-white"
                >
                  {uc.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <div className="mt-12 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 text-center">
          <p className="text-sm text-zinc-400">Ready to generate your file?</p>
          <Link
            href="/app"
            className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#070b09] hover:bg-emerald-400"
          >
            Open allig8tor →
          </Link>
        </div>
      </article>
    </ContentShell>
  );
}
