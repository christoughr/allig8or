import { SITE_URL } from '@/lib/site';
import { getAllPosts } from '@/lib/blog';
import { USE_CASES } from '@/lib/use-cases';
import { PUBLIC_ROUTES } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';

export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY ?? 'allig8torindexnow2026';
}

export function collectPublicUrls(): string[] {
  const urls = PUBLIC_ROUTES.map((r) =>
    absoluteUrl(r.path === '/' ? '' : r.path)
  );

  for (const post of getAllPosts()) {
    urls.push(absoluteUrl(`/blog/${post.slug}`));
  }
  urls.push(absoluteUrl('/blog'));

  for (const uc of USE_CASES) {
    urls.push(absoluteUrl(`/use-cases/${uc.slug}`));
  }
  urls.push(absoluteUrl('/use-cases'));

  urls.push(absoluteUrl('/app'));

  return [...new Set(urls)];
}

/** Notify Bing, Yandex, etc. via IndexNow (after deploy or new content). */
export async function submitIndexNow(urlList?: string[]): Promise<{
  ok: boolean;
  status: number;
  urlCount: number;
}> {
  const key = getIndexNowKey();
  const host = new URL(SITE_URL).host;
  const list = urlList ?? collectPublicUrls();

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${SITE_URL.replace(/\/$/, '')}/${key}.txt`,
      urlList: list,
    }),
  });

  return { ok: res.ok, status: res.status, urlCount: list.length };
}
