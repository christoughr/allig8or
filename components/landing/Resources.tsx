import Link from 'next/link';

const links = [
  {
    href: '/use-cases/ai-pitch-deck-generator',
    title: 'AI pitch deck generator',
    sub: 'Investor-ready .pptx from a prompt',
  },
  {
    href: '/use-cases/ai-spreadsheet-generator',
    title: 'AI spreadsheet generator',
    sub: 'Budgets & trackers as .xlsx',
  },
  {
    href: '/use-cases/ai-landing-page-builder',
    title: 'AI landing page builder',
    sub: 'Marketing pages with live preview',
  },
  {
    href: '/blog',
    title: 'Blog & guides',
    sub: 'SEO tips and product tutorials',
  },
];

export default function Resources() {
  return (
    <section id="resources" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Guides & use cases
        </h2>
        <p className="mt-4 text-center text-zinc-400">
          See where premium teams recover time and protect output quality.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
