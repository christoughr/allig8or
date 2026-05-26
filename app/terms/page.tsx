import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — allig8or',
};

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-[#070b09] px-6 py-16 text-zinc-300">
      <article className="prose prose-invert prose-emerald mx-auto max-w-2xl prose-headings:font-heading prose-a:text-emerald-400">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-500 hover:text-emerald-400">
          ← allig8or.com
        </Link>
        <h1 className="text-white">Terms of Service</h1>
        <p className="text-sm text-zinc-500">Last updated: May 26, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed">
          <p>
            By using allig8or.com you agree to these terms. If you do not agree, do not use the
            service.
          </p>
          <h2 className="text-lg font-semibold text-white">Service</h2>
          <p>
            allig8or provides AI-generated websites, presentations, spreadsheets, documents, and
            PDF-ready HTML. Outputs are provided &quot;as is&quot; — you are responsible for reviewing
            before client or commercial use.
          </p>
          <h2 className="text-lg font-semibold text-white">Accounts & billing</h2>
          <p>
            Paid plans are billed monthly via Lemon Squeezy. You may cancel anytime; access continues
            until the end of the paid period. Refunds follow Lemon Squeezy policy unless required by
            law.
          </p>
          <h2 className="text-lg font-semibold text-white">Acceptable use</h2>
          <ul className="list-disc pl-5">
            <li>No illegal, harmful, or infringing content in prompts or outputs</li>
            <li>No attempts to bypass rate limits or scrape the API</li>
            <li>No resale of the service without permission</li>
          </ul>
          <h2 className="text-lg font-semibold text-white">Limitation of liability</h2>
          <p>
            We are not liable for indirect damages or loss of data. Our total liability is limited to
            fees paid in the prior 12 months.
          </p>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            <a href="mailto:hello@allig8or.com" className="text-emerald-400 hover:underline">
              hello@allig8or.com
            </a>
          </p>
        </div>
      </article>
    </div>
  );
}
