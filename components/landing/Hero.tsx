import Link from 'next/link';

const outputs = [
  { label: 'Website',      sub: 'HTML + live preview' },
  { label: 'Presentation', sub: '.pptx download'      },
  { label: 'Spreadsheet',  sub: '.xlsx download'      },
  { label: 'Document',     sub: '.docx download'      },
  { label: 'PDF',          sub: 'print-ready HTML'    },
];

const steps = [
  { n: '01', title: 'Describe it',    body: 'Type what you need in plain language. No templates, no config, no upload.' },
  { n: '02', title: 'AI builds it',   body: 'Claude generates production-ready code, slides, data, or prose in 10–40 seconds.' },
  { n: '03', title: 'Download & use', body: 'Get a live preview or download .pptx / .xlsx / .docx. Ready to send to clients.' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-0 pt-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            Premium AI production suite - websites, decks, sheets, docs
          </p>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-6xl sm:leading-[1.08]">
            Replace production busywork.
            <br />
            <span className="bg-gradient-to-r from-emerald-300/95 via-teal-200/90 to-emerald-400/95 bg-clip-text font-medium text-transparent">
              Ship client-ready files.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Generate websites, pitch decks, spreadsheets, Word documents, and PDFs in one workflow.
            Built for teams that value speed, quality, and predictable monthly output.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="glow-emerald w-full rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-[#070b09] transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:w-auto"
            >
              Start building →
            </Link>
            <Link
              href="#how-it-works"
              className="w-full rounded-full border border-white/12 bg-white/4 px-8 py-4 text-base font-medium text-zinc-300 backdrop-blur transition hover:border-white/20 hover:bg-white/8 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 sm:w-auto"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-5 text-sm text-zinc-600">
            Free evaluation includes 1 generation/month. Paid plans are monthly-capped and cancel anytime.
          </p>
        </div>

        {/* Output type pills */}
        <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-2">
          {outputs.map(({ label, sub }) => {
            const tool =
              label === 'Website'
                ? 'website'
                : label === 'Presentation'
                  ? 'presentation'
                  : label === 'Spreadsheet'
                    ? 'spreadsheet'
                    : label === 'Document'
                      ? 'document'
                      : 'pdf';
            return (
              <Link
                key={label}
                href={`/app?tool=${tool}`}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-zinc-900/60 px-4 py-2 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <span className="text-sm font-medium text-white">{label}</span>
                <span className="text-xs text-zinc-500">{sub}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-14 border-t border-white/8" />
      </div>

      {/* How it works */}
      <div id="how-it-works" className="relative mx-auto mt-16 max-w-6xl pb-24">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          How it works
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-white/8 bg-zinc-900/30 p-6 backdrop-blur"
            >
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 translate-x-full bg-white/10 sm:block"
                />
              )}
              <span className="font-mono text-xs font-medium text-emerald-500/70">{step.n}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
