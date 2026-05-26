import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 text-5xl">🐊</div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Create anything with AI. Instantly.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 sm:text-xl">
          Websites, presentations, spreadsheets, documents — just describe what
          you need. Download in seconds.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-900 shadow-lg transition hover:bg-blue-50"
        >
          Start for free →
        </Link>
      </div>
    </section>
  );
}
