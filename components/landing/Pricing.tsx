import Link from 'next/link';
import { PLANS } from '@/lib/lemonsqueezy';

export default function Pricing() {
  const tiers = [
    { id: 'free' as const, highlight: false },
    { id: 'pro' as const, highlight: true },
    { id: 'team' as const, highlight: false },
  ];

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          Simple pricing
        </h2>
        <p className="mb-12 text-center text-gray-600">
          Used by creators, founders, and teams worldwide
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map(({ id, highlight }) => {
            const plan = PLANS[id];
            return (
              <div
                key={id}
                className={`rounded-2xl border p-8 ${
                  highlight
                    ? 'border-blue-600 bg-white shadow-xl ring-2 ring-blue-600'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-base font-normal text-gray-500">
                      /mo
                    </span>
                  )}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  <li>{plan.limits.generationsPerDay} generations/day</li>
                  <li>File downloads included</li>
                  {plan.limits.customDomain && <li>Custom domain</li>}
                  {plan.limits.teamMembers > 1 && (
                    <li>{plan.limits.teamMembers} team members</li>
                  )}
                </ul>
                {id === 'free' ? (
                  <Link
                    href="/app"
                    className="mt-8 block rounded-xl bg-gray-100 py-3 text-center font-medium text-gray-900 transition hover:bg-gray-200"
                  >
                    Get started
                  </Link>
                ) : (
                  <a
                    href={`/api/checkout?plan=${id}`}
                    className={`mt-8 block rounded-xl py-3 text-center font-medium transition ${
                      highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
