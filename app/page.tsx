import Link from 'next/link';
import Hero from '@/components/landing/Hero';
import DemoSection from '@/components/landing/DemoSection';
import Pricing from '@/components/landing/Pricing';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span>🐊</span>
          <span>allig8or</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/app"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open app →
          </Link>
        </nav>
      </header>
      <Hero />
      <DemoSection />
      <Pricing />
      <footer className="border-t border-gray-100 bg-white px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} allig8or.com — AI Office Suite
      </footer>
    </div>
  );
}
