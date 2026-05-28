import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';
import { absoluteUrl } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getAllPosts().slice(0, 50);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} blog</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog';
import { USE_CASES } from '@/lib/use-cases';

/** RSS 2.0 feed — blog posts + key pages. */
export async function GET() {
  const items = [
    {
      title: SITE_TITLE,
      link: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      pubDate: new Date('2026-05-27T00:00:00Z'),
    },
    ...getAllPosts().map((post) => ({
      title: post.title,
      link: absoluteUrl(`/blog/${post.slug}`),
      description: post.description,
      pubDate: new Date(post.date),
    })),
    ...USE_CASES.map((uc) => ({
      title: uc.title,
      link: absoluteUrl(`/use-cases/${uc.slug}`),
      description: uc.description,
      pubDate: new Date('2026-05-27T00:00:00Z'),
    })),
    {
      title: 'Try the AI generator',
      link: absoluteUrl('/app'),
      description: 'Open the allig8tor workspace.',
      pubDate: new Date('2026-05-27T00:00:00Z'),
    },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
