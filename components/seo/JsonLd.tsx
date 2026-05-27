import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';

const faqItems = [
  {
    question: 'What is allig8or?',
    answer:
      'allig8or is an AI office suite. You describe what you need in plain language and get a website, presentation, spreadsheet, Word document, or PDF — ready to preview or download.',
  },
  {
    question: 'What file types can allig8or generate?',
    answer:
      'Websites (HTML with live preview), PowerPoint presentations (.pptx), Excel spreadsheets (.xlsx), Word documents (.docx), and print-ready PDFs.',
  },
  {
    question: 'Is allig8or free to try?',
    answer:
      'Yes. You can start building without a credit card. Signed-in users get daily limits; Pro and Team plans add higher limits when billing is enabled.',
  },
  {
    question: 'Do I need design or coding skills?',
    answer:
      'No. Type a prompt describing your deliverable. AI handles structure, copy, and formatting.',
  },
];

export default function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/icon'),
    email: CONTACT_EMAIL,
    description: SITE_DESCRIPTION,
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/app')}?tool={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/app'),
    featureList: [
      'AI website generator',
      'AI presentation maker',
      'AI spreadsheet generator',
      'AI document writer',
      'AI PDF export',
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
  };

  const graphs = [organization, webSite, software, faqPage, webPage];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
