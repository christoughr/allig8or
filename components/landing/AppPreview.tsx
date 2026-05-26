export default function AppPreview() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/8 bg-zinc-950/90 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-amber-500/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-xs text-zinc-500">allig8or.com/app</span>
          </div>

          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Chat panel mock */}
            <div className="border-b border-white/8 bg-zinc-950 p-4 md:border-b-0 md:border-r">
              {/* Tool tabs */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto">
                {['Website', 'Slides', 'Sheet', 'Doc'].map((t, i) => (
                  <span
                    key={t}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                      i === 0
                        ? 'bg-emerald-500 text-[#070b09]'
                        : 'bg-white/5 text-zinc-500'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Messages */}
              <div className="space-y-2.5">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3 py-2 text-xs text-white">
                  Landing page for a specialty coffee roaster in Brooklyn
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
                  Done — preview on the right. Want darker tones or a menu section?
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3 py-2 text-xs text-white">
                  Add a menu section and make the CTA button black
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

            {/* Preview panel mock */}
            <div className="min-h-[240px] bg-zinc-900/40">
              {/* Preview browser bar */}
              <div className="flex items-center gap-2 border-b border-white/8 bg-zinc-950/60 px-4 py-2">
                <span className="text-xs text-zinc-600">Live preview</span>
                <div className="ml-auto flex gap-1 rounded-lg border border-white/8 bg-zinc-900 p-0.5">
                  <span className="rounded-md bg-zinc-700 px-2 py-0.5 text-[10px] text-white">Desktop</span>
                  <span className="px-2 py-0.5 text-[10px] text-zinc-600">Mobile</span>
                </div>
              </div>
              {/* Fake site preview */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-full max-w-sm rounded-xl border border-white/8 bg-zinc-800/50 p-6">
                  <div className="mx-auto mb-2 h-8 w-8 rounded bg-amber-600/80" />
                  <p className="text-sm font-bold text-white">Roast & Co.</p>
                  <p className="mt-1 text-xs text-zinc-500">Small-batch coffee, big flavor</p>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2 rounded-full bg-zinc-700/60" />
                    <div className="h-2 w-4/5 rounded-full bg-zinc-700/40" />
                    <div className="h-2 w-3/5 rounded-full bg-zinc-700/30" />
                  </div>
                  <div className="mx-auto mt-5 h-8 w-28 rounded-lg bg-zinc-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
