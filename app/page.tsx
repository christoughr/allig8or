import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import AppPreview from '@/components/landing/AppPreview';
import DemoSection from '@/components/landing/DemoSection';
import Pricing from '@/components/landing/Pricing';
import Faq from '@/components/landing/Faq';
import Footer from '@/components/landing/Footer';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'allig8or — AI Office Suite | Websites, Decks, Sheets & Docs',
  description: SITE_DESCRIPTION,
  path: '/',
  keywords: [
    ...SITE_KEYWORDS,
    'best AI presentation tool',
    'AI business document generator',
  ],
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b09] text-white">
      <Header />
      <main>
        <Hero />
        <AppPreview />
        <DemoSection />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
