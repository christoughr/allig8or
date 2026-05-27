import Link from 'next/link';
import ContentShell from '@/components/content/ContentShell';
import { getAllPosts } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Blog — AI office tips & guides',
  description:
    'Guides for AI pitch decks, Excel spreadsheets, landing pages, and office file generation with allig8tor.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <ContentShell backHref="/" backLabel="← allig8tor home">
      <h1 className="font-heading text-4xl font-bold text-white">Blog</h1>
      <p className="mt-4 text-lg text-zinc-400">
        Practical guides for AI presentations, spreadsheets, websites, and documents.
      </p>
      <ul className="mt-12 space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-white/8 pb-8 last:border-0">
            <p className="text-sm text-zinc-600">{post.date}</p>
            <Link href={`/blog/${post.slug}`} className="mt-2 block group">
              <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400">
                {post.title}
              </h2>
              <p className="mt-2 text-zinc-400">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-center">
        <Link
          href="/use-cases"
          className="text-sm text-emerald-400 hover:underline"
        >
          Browse use cases →
        </Link>
      </p>
    </ContentShell>
  );
}
