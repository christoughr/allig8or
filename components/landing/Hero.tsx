import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-teal-400/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Office Suite — prompt in, file out
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
            Your entire office.
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
              One prompt away.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Websites, pitch decks, spreadsheets, and documents — describe what
            you need. Download production-ready files in seconds.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/app"
              className="w-full rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-[#070b09] shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-400 sm:w-auto"
            >
              Start creating free
            </Link>
            <Link
              href="#tools"
              className="w-full rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              See what you can build
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            No install. No templates. 10 free generations per hour.
          </p>
        </div>
      </div>
    </section>
  );
}
