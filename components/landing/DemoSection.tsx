const tools = [
  {
    icon: '🌐',
    title: 'Websites',
    desc: 'Landing pages, portfolios, product pages — live preview instantly.',
    accent: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    icon: '📊',
    title: 'Presentations',
    desc: 'Pitch decks and slide decks exported as .pptx.',
    accent: 'from-violet-500/20 to-purple-500/10',
  },
  {
    icon: '📈',
    title: 'Spreadsheets',
    desc: 'Budgets, trackers, models — formatted .xlsx ready to edit.',
    accent: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    icon: '📝',
    title: 'Documents',
    desc: 'Proposals, reports, contracts — professional .docx output.',
    accent: 'from-amber-500/20 to-orange-500/10',
  },
  {
    icon: '📄',
    title: 'PDF-ready',
    desc: 'Invoices and formal docs styled for print.',
    accent: 'from-rose-500/20 to-pink-500/10',
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
          <p className="mt-4 text-lg text-zinc-400">
            Replace the tab-switching chaos of M365 and Google Workspace with a
            single AI workspace.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition hover:border-emerald-500/30 hover:bg-zinc-900/60"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <div className="relative">
                <span className="text-3xl">{tool.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
