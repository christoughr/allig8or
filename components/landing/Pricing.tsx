import Link from 'next/link';
import { PLANS } from '@/lib/lemonsqueezy';

const features: Record<string, string[]> = {
  free: [
    '10 generations / hour',
    'All 5 file types',
    'HTML + file downloads',
    'No account required',
  ],
  pro: [
    '200 generations / day',
    'All 5 file types',
    'HTML + file downloads',
    'Custom domain support',
    'Priority generation',
  ],
  team: [
    '1,000 generations / day',
    'All 5 file types',
    'HTML + file downloads',
    'Custom domain support',
    '10 team seats',
    'Priority generation',
  ],
};

export default function Pricing() {
  const tiers = [
    { id: 'free' as const, highlight: false },
    { id: 'pro' as const, highlight: true },
    { id: 'team' as const, highlight: false },
  ];

  return (
    <section id="pricing" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-zinc-400">
            Start free. Upgrade when you ship more.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map(({ id, highlight }) => {
            const plan = PLANS[id];
            const planFeatures = features[id];
            return (
              <div
                key={id}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  highlight
                    ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-zinc-900/60 shadow-2xl shadow-emerald-500/10'
                    : 'border-white/8 bg-zinc-900/30'
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-[#070b09]">
                    Most popular
                  </span>
                )}

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                    {plan.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-zinc-500">/mo</span>
                    )}
                  </p>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {planFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8l3.5 3.5L13 4.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {id === 'free' ? (
                    <Link
                      href="/app"
                      className="block rounded-xl border border-white/12 py-3 text-center text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/5"
                    >
                      Start for free
                    </Link>
                  ) : (
                    <a
                      href={`/api/checkout?plan=${id}`}
                      className={`block rounded-xl py-3 text-center text-sm font-semibold transition ${
                        highlight
                          ? 'bg-emerald-500 text-[#070b09] hover:bg-emerald-400'
                          : 'border border-white/12 text-white hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      Get {plan.name}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          All plans include file downloads. No usage data sold. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
