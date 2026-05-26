export default function AppPreview() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950/80 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs text-zinc-500">allig8or.app</span>
          </div>
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="border-b border-white/10 bg-zinc-950 p-4 md:border-b-0 md:border-r">
              <div className="mb-3 flex gap-1 overflow-x-auto">
                {['Website', 'Slides', 'Sheet', 'Doc'].map((t, i) => (
                  <span
                    key={t}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                      i === 0
                        ? 'bg-emerald-500 text-[#070b09]'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-3 py-2 text-xs text-white">
                  Landing page for a specialty coffee roaster in Brooklyn
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
                  Done — preview on the right. Want darker tones or a menu section?
                </div>
              </div>
            </div>
            <div className="flex min-h-[220px] flex-col bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
              <div className="flex-1 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="text-2xl font-bold text-white">Roast &amp; Co.</p>
                <p className="mt-2 text-sm text-zinc-500">Small-batch coffee, big flavor</p>
                <div className="mx-auto mt-6 h-8 w-32 rounded-lg bg-emerald-500/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
