import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentShell from '@/components/content/ContentShell';
import { Markdown } from '@/lib/markdown';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';

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
