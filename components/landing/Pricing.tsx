import Link from 'next/link';
import { getCheckoutUrl } from '@/lib/lemonsqueezy';

const billingEnabled = Boolean(
  getCheckoutUrl('starter') || getCheckoutUrl('pro') || getCheckoutUrl('team')
);

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    highlight: false,
    features: [
      '1 generation / month (evaluation only)',
      'All 5 file types',
      'HTML + file downloads',
      'Save projects when signed in',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 149,
    highlight: false,
    features: [
      '80 generations / month',
      'Built for solo operators shipping client work',
      'All 5 file types',
      'HTML + file downloads',
      'Standard generation queue',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 399,
    highlight: true,
    features: [
      '300 generations / month',
      'Built for high-output freelancers and agencies',
      'All 5 file types',
      'HTML + file downloads',
      'Priority generation',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 999,
    highlight: false,
    features: [
      '1,000 generations / month',
      'Built for teams replacing manual production workflows',
      'All 5 file types',
      'HTML + file downloads',
      'Shared workspace features (5 seats)',
      'Priority generation',
    ],
  },
] as const;

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Premium pricing for real output teams
          </h2>
          <p className="mt-4 text-zinc-400">
            Price is based on delivered output, not chat tokens. Replace hours of manual formatting with monthly-capped production.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => {
            const isPaidPlan = tier.id !== 'free';
            const isCheckoutReady =
              tier.id === 'starter' || tier.id === 'pro' || tier.id === 'team';
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.highlight
                    ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-zinc-900/60 shadow-2xl shadow-emerald-500/10'
                    : 'border-white/8 bg-zinc-900/30'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-[#070b09]">
                    Most popular
                  </span>
                )}

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                    {tier.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">
                      ${tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-sm text-zinc-500">/mo</span>
                    )}
                  </p>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
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
                  {tier.id === 'free' ? (
                    <Link
                      href="/app"
                      className="block rounded-xl border border-white/12 py-3 text-center text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/5"
                    >
                      Start for free
                    </Link>
                  ) : billingEnabled && isCheckoutReady ? (
                    <a
                      href={`/api/checkout?plan=${tier.id}`}
                      className={`block rounded-xl py-3 text-center text-sm font-semibold transition ${
                        tier.highlight
                          ? 'bg-emerald-500 text-[#070b09] hover:bg-emerald-400'
                          : 'border border-white/12 text-white hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      Get {tier.name}
                    </a>
                  ) : (
                    <span
                      className={`block rounded-xl py-3 text-center text-sm font-semibold ${
                        tier.highlight
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border border-white/8 text-zinc-500'
                      }`}
                      title={
                        isPaidPlan
                          ? 'Paid plans activate when our payment store is approved'
                          : undefined
                      }
                    >
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          {billingEnabled
            ? 'All paid plans are monthly-capped subscriptions with no annual lock-in. Cancel anytime.'
            : 'Free tier is live now. Paid billing opens after store approval. All paid plans are monthly-capped subscriptions with no unlimited usage.'}
        </p>
      </div>
    </section>
  );
}
