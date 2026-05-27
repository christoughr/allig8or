import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';

/** RSS 2.0 feed for product pages (submit to Google Search Console). */
export async function GET() {
  const items = [
    {
      title: SITE_TITLE,
      link: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      pubDate: new Date('2026-05-27T00:00:00Z'),
    },
    {
      title: 'Try the AI generator — websites, decks, sheets, docs',
      link: absoluteUrl('/app'),
      description:
        'Open the allig8or workspace and generate office files from a single prompt.',
      pubDate: new Date('2026-05-27T00:00:00Z'),
    },
    {
      title: 'Privacy Policy',
      link: absoluteUrl('/privacy'),
      description: 'How allig8or handles your data.',
      pubDate: new Date('2026-05-26T00:00:00Z'),
    },
    {
      title: 'Terms of Service',
      link: absoluteUrl('/terms'),
      description: 'Terms for using allig8or.',
      pubDate: new Date('2026-05-26T00:00:00Z'),
    },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
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
