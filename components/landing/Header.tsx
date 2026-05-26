import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b09]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg shadow-lg shadow-emerald-500/20">
            🐊
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            allig8<span className="text-emerald-400">or</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
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
            href="/app"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-[#070b09] shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
