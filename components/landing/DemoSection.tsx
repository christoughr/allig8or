import Link from 'next/link';

const tools = [
  {
    label: 'Website',
    tool: 'website' as const,
    format: 'HTML · live preview',
    desc: 'Landing pages, portfolios, SaaS pages — full Tailwind, responsive, downloadable.',
    color: 'border-blue-500/20 hover:border-blue-500/40',
    dot: 'bg-blue-400',
    tag: 'bg-blue-500/10 text-blue-300',
  },
  {
    label: 'Slides',
    tool: 'presentation' as const,
    format: '.pptx',
    desc: 'Pitch decks, product updates, investor decks — themed, multi-layout, speaker notes.',
    color: 'border-violet-500/20 hover:border-violet-500/40',
    dot: 'bg-violet-400',
    tag: 'bg-violet-500/10 text-violet-300',
  },
  {
    label: 'Spreadsheet',
    tool: 'spreadsheet' as const,
    format: '.xlsx',
    desc: 'Budgets, models, trackers — formatted headers, formulas, alternate row shading.',
    color: 'border-emerald-500/20 hover:border-emerald-500/40',
    dot: 'bg-emerald-400',
    tag: 'bg-emerald-500/10 text-emerald-300',
  },
  {
    label: 'Document',
    tool: 'document' as const,
    format: '.docx',
    desc: 'Proposals, SOPs, reports — headings, bullet lists, tables, professional layout.',
    color: 'border-amber-500/20 hover:border-amber-500/40',
    dot: 'bg-amber-400',
    tag: 'bg-amber-500/10 text-amber-300',
  },
  {
    label: 'PDF-ready',
    tool: 'pdf' as const,
    format: 'HTML → print',
    desc: 'Invoices, briefs, contracts — A4 layout, inline styles, print-optimised.',
    color: 'border-rose-500/20 hover:border-rose-500/40',
    dot: 'bg-rose-400',
    tag: 'bg-rose-500/10 text-rose-300',
  },
];

export default function DemoSection() {
  return (
    <section id="tools" className="border-t border-white/5 bg-[#0a0f0d] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Five tools. One conversation.
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Replace the tab-switching chaos of M365 and Google Workspace.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.label}
              href={`/app?tool=${tool.tool}`}
              className={`group block rounded-2xl border bg-zinc-900/30 p-6 transition duration-200 hover:bg-zinc-900/50 ${tool.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tool.dot}`} />
                  <span className="text-base font-semibold text-white">
                    {tool.label}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tool.tag}`}>
                  {tool.format}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {tool.desc}
              </p>
              <p className="mt-3 text-xs font-medium text-emerald-500/80 group-hover:text-emerald-400">
                Open in app →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
