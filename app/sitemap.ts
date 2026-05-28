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

  let dynamicBlogPages: MetadataRoute.Sitemap = [];
  try {
    dynamicBlogPages = getAllPosts().map((post) => {
      const parsedDate = new Date(post.date);
      return {
        url: absoluteUrl(`/blog/${post.slug}`),
        // Guard against malformed frontmatter dates breaking sitemap generation.
        lastModified: Number.isNaN(parsedDate.getTime()) ? lastModified : parsedDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error('[sitemap] failed to load blog posts:', error);
  }

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...dynamicBlogPages,
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
