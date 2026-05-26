import Link from 'next/link';
import { PLANS } from '@/lib/lemonsqueezy';

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
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map(({ id, highlight }) => {
            const plan = PLANS[id];
            return (
              <div
                key={id}
                className={`relative rounded-2xl border p-8 ${
                  highlight
                    ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-zinc-900/50 shadow-xl shadow-emerald-500/10'
                    : 'border-white/10 bg-zinc-900/30'
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-[#070b09]">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-zinc-500">/mo</span>
                  )}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                  <li>{plan.limits.generationsPerDay} generations / day</li>
                  <li>All file types & downloads</li>
                  {plan.limits.customDomain && (
                    <li>Custom domain support</li>
                  )}
                  {plan.limits.teamMembers > 1 && (
                    <li>{plan.limits.teamMembers} team seats</li>
                  )}
                </ul>
                {id === 'free' ? (
                  <Link
                    href="/app"
                    className="mt-8 block rounded-xl border border-white/15 py-3 text-center font-medium text-white transition hover:bg-white/5"
                  >
                    Get started
                  </Link>
                ) : (
                  <a
                    href={`/api/checkout?plan=${id}`}
                    className={`mt-8 block rounded-xl py-3 text-center font-semibold transition ${
                      highlight
                        ? 'bg-emerald-500 text-[#070b09] hover:bg-emerald-400'
                        : 'border border-white/15 text-white hover:bg-white/5'
                    }`}
                  >
                    Subscribe
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
