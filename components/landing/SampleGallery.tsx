import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const samples = [
  {
    tool: 'website',
    label: 'Website',
    prompt: 'Landing page for a specialty coffee roaster in Brooklyn',
    result: 'Hero, menu highlights, location map, warm editorial layout',
    gradient: 'from-amber-900/40 to-zinc-900',
  },
  {
    tool: 'presentation',
    label: 'Slides',
    prompt: '10-slide Series A pitch for climate tech — problem, solution, traction',
    result: 'Investor-ready .pptx with charts and speaker-friendly hierarchy',
    gradient: 'from-emerald-900/40 to-zinc-900',
  },
  {
    tool: 'spreadsheet',
    label: 'Sheet',
    prompt: 'SaaS revenue model: MRR, churn, CAC, 12-month forecast',
    result: 'Formatted .xlsx with formulas and summary KPIs',
    gradient: 'from-sky-900/40 to-zinc-900',
  },
  {
    tool: 'document',
    label: 'Document',
    prompt: 'Mobile app development proposal with timeline and milestones',
    result: 'Structured .docx ready to send to a client',
    gradient: 'from-violet-900/40 to-zinc-900',
  },
  {
    tool: 'pdf',
    label: 'PDF',
    prompt: 'Freelance UX invoice — net-15, line items, professional layout',
    result: 'Print-ready HTML you can save as PDF',
    gradient: 'from-rose-900/40 to-zinc-900',
  },
] as const;

export default function SampleGallery() {
  return (
    <section className="border-t border-white/8 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-500">
          Real outputs
        </p>
        <h2 className="mt-2 text-center text-2xl font-semibold text-white sm:text-3xl">
          What you get from one prompt
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500">
          Same flow as the app: describe the deliverable → preview or download → refine in chat.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((s) => (
            <article
              key={s.tool}
              className={`flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${s.gradient}`}
            >
              <div className="flex h-28 items-end border-b border-white/8 bg-black/20 p-4">
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  {s.label}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium text-zinc-400">Prompt</p>
                <p className="mt-1 text-sm text-zinc-200">&ldquo;{s.prompt}&rdquo;</p>
                <p className="mt-3 text-xs text-zinc-500">{s.result}</p>
                <Link
                  href={`/app?tool=${s.tool}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Try this tool
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
