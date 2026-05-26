import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import AppPreview from '@/components/landing/AppPreview';
import DemoSection from '@/components/landing/DemoSection';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b09] text-white">
      <Header />
      <main>
        <Hero />
        <AppPreview />
        <DemoSection />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
