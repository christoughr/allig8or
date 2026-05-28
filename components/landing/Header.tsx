import Link from 'next/link';
import Logo from '@/components/brand/Logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b09]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link
            href="#how-it-works"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            How it works
          </Link>
          <Link
            href="#tools"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            Tools
          </Link>
          <Link
            href="#pricing"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            Blog
          </Link>
          <Link
            href="#faq"
            className="hidden text-sm text-zinc-400 transition hover:text-white md:inline"
          >
            FAQ
          </Link>
          <Link
            href="/login?next=/app"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-[#070b09] shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            Start production
          </Link>
        </nav>
      </div>
    </header>
  );
}
