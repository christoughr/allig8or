import Link from 'next/link';

const socialProof = [
  { stat: '10K+', label: 'files generated' },
  { stat: '< 8s', label: 'avg. generation' },
  { stat: '5 tools', label: 'one workspace' },
];

const steps = [
  { n: '01', title: 'Describe it', body: 'Type what you need in plain language. No templates, no config.' },
  { n: '02', title: 'AI builds it', body: 'Claude generates production-ready code, slides, or spreadsheet data.' },
  { n: '03', title: 'Download & ship', body: 'Get a .pptx, .xlsx, .docx, or a live-preview website. Done.' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-0 pt-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute -right-40 top-32 h-[400px] w-[400px] rounded-full bg-teal-400/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Badge */}
        <div className="flex justify-center">
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-sm font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Office Suite — no install required
          </p>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Your office.
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
              One prompt.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Websites, pitch decks, spreadsheets, documents — describe what you
            need. Download production-ready files in seconds.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="glow-emerald w-full rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-[#070b09] transition hover:bg-emerald-400 sm:w-auto"
            >
              Start creating — it&apos;s free
            </Link>
            <Link
              href="#how-it-works"
              className="w-full rounded-full border border-white/12 bg-white/4 px-8 py-4 text-base font-medium text-zinc-300 backdrop-blur transition hover:border-white/20 hover:bg-white/8 hover:text-white sm:w-auto"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-5 text-sm text-zinc-600">
            No credit card. 10 free generations/hour.
          </p>
        </div>

        {/* Social proof strip */}
        <div className="mx-auto mt-14 flex max-w-lg items-center justify-center gap-10 border-t border-white/8 pt-10">
          {socialProof.map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="relative mx-auto mt-20 max-w-6xl pb-24">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          How it works
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-white/8 bg-zinc-900/30 p-6 backdrop-blur"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 translate-x-full bg-white/10 sm:block" />
              )}
              <span className="font-mono text-xs font-medium text-emerald-500/70">
                {step.n}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
