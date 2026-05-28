import type { Metadata } from 'next';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SOCIAL,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/site';

type PageSeoOptions = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function absoluteUrl(path = ''): string {
  const base = SITE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${base}${p}`;
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '',
  noIndex = false,
  keywords = [...SITE_KEYWORDS],
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: absoluteUrl('/opengraph-image'),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${description}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: SOCIAL.twitter,
      site: SOCIAL.twitter,
      images: [absoluteUrl('/twitter-image')],
    },
  };
}

export const rootMetadata: Metadata = {
  ...buildPageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
  }),
  applicationName: SITE_NAME,
  category: 'technology',
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};
