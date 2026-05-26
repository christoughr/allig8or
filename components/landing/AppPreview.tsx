// Static screenshot-style mock of /app — matches real app chrome exactly
// (neutral browser bar, Lucide icons, no traffic lights)

export default function AppPreview() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">

          {/* ── Neutral browser bar (mirrors real PreviewPanel bar) ── */}
          <div className="flex items-center gap-2 border-b border-white/8 bg-zinc-950/90 px-3 py-2.5">
            {/* Fake URL pill */}
            <div className="hidden sm:flex max-w-[220px] flex-1 items-center gap-1.5 rounded-md border border-white/8 bg-zinc-900 px-2.5 py-1">
              {/* globe icon inline SVG at 11px */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-600" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span className="truncate text-[11px] text-zinc-500 select-none">preview.allig8or.local</span>
            </div>
            <span className="sm:hidden text-xs font-medium text-zinc-500">allig8or.com/app</span>

            <div className="flex flex-1 items-center justify-end gap-1.5">
              {/* Device toggle */}
              <div className="flex items-center rounded-md border border-white/8 bg-zinc-900 p-0.5">
                <span className="flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-[10px] text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  Desktop
                </span>
                <span className="px-2 py-1 text-[10px] text-zinc-500">Mobile</span>
              </div>
              {/* Open button */}
              <span className="flex items-center gap-1 rounded-md border border-white/8 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open
              </span>
            </div>
          </div>

          {/* ── App shell ── */}
          <div className="grid md:grid-cols-[300px_1fr]">

            {/* Left: chat + tool tabs */}
            <div className="border-b border-white/8 bg-zinc-950 p-4 md:border-b-0 md:border-r">
              {/* Tool tabs — Lucide-style labels, no emoji */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto">
                {[
                  { label: 'Website',  active: true  },
                  { label: 'Slides',   active: false },
                  { label: 'Sheet',    active: false },
                  { label: 'Doc',      active: false },
                ].map(({ label, active }) => (
                  <span
                    key={label}
                    className={[
                      'whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium',
                      active
                        ? 'bg-emerald-500 text-[#070b09]'
                        : 'bg-white/5 text-zinc-500',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Messages */}
              <div className="space-y-2.5">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3 py-2 text-xs text-white">
                  Landing page for a boutique law firm specializing in startup IP
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
                  Done — preview on the right. Want a different color scheme?
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3 py-2 text-xs text-white">
                  Make it navy and gold, more authoritative
                </div>
                <div className="flex gap-1 pl-1 pt-1">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: preview mock */}
            <div className="min-h-[260px] bg-zinc-900/30">
              <div className="flex h-full flex-col items-center justify-center p-6">
                {/* Simulated website preview card — law firm style */}
                <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/8 bg-white shadow-lg">
                  {/* Nav */}
                  <div className="flex items-center justify-between bg-[#0a1628] px-4 py-3">
                    <span className="text-xs font-bold tracking-widest text-amber-400">PARK & ASSOCIATES</span>
                    <div className="flex gap-3">
                      {['Practice', 'Team', 'Contact'].map(l => (
                        <span key={l} className="text-[10px] text-zinc-400">{l}</span>
                      ))}
                    </div>
                  </div>
                  {/* Hero area */}
                  <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2f50] px-5 py-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Startup IP Law</p>
                    <p className="mt-2 text-sm font-bold text-white leading-tight">Protecting Your Most<br />Valuable Assets</p>
                    <div className="mx-auto mt-4 w-24 rounded-full bg-amber-500 py-1.5">
                      <span className="text-[10px] font-semibold text-[#0a1628]">Free Consult</span>
                    </div>
                  </div>
                  {/* Content lines */}
                  <div className="px-5 py-4 space-y-1.5">
                    <div className="h-1.5 rounded-full bg-zinc-200" />
                    <div className="h-1.5 w-4/5 rounded-full bg-zinc-100" />
                    <div className="h-1.5 w-3/5 rounded-full bg-zinc-100" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
