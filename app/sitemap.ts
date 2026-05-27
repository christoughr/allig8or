import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { USE_CASES } from '@/lib/use-cases';
import { PUBLIC_ROUTES } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path === '/' ? '' : path),
    lastModified,
    changeFrequency,
    priority,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getAllPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const useCasePages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/use-cases'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...USE_CASES.map((uc) => ({
      url: absoluteUrl(`/use-cases/${uc.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];

  return [...staticPages, ...blogPages, ...useCasePages];
}
