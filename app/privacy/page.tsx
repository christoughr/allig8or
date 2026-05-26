import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — allig8or',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 26, 2026">
      <p>
        allig8or (&quot;we&quot;, &quot;us&quot;) operates allig8or.com. This policy explains what we
        collect and how we use it when you use our AI Office Suite.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account email and authentication data (via Supabase) if you sign up</li>
        <li>Prompts and generated outputs you create (stored if you are signed in)</li>
        <li>Usage counts for rate limiting and billing</li>
        <li>IP address for anonymous rate limiting</li>
        <li>Payment metadata from Lemon Squeezy (we do not store card numbers)</li>
      </ul>
      <h2>How we use data</h2>
      <ul>
        <li>To generate websites, slides, spreadsheets, documents, and PDFs via Anthropic Claude</li>
        <li>To enforce plan limits and process subscriptions</li>
        <li>To improve reliability and prevent abuse</li>
      </ul>
      <h2>Third parties</h2>
      <p>
        We use Anthropic (AI), Supabase (auth/database), Vercel (hosting), and Lemon Squeezy
        (payments). Their policies apply to data they process on our behalf.
      </p>
      <h2>Retention</h2>
      <p>
        Signed-in projects are kept until you delete your account or we remove them. Anonymous
        generations are not persisted unless you sign in.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:hello@allig8or.com">hello@allig8or.com</a>
      </p>
    </LegalLayout>
  );
}

function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#070b09] px-6 py-16 text-zinc-300">
      <article className="prose prose-invert prose-emerald mx-auto max-w-2xl prose-headings:font-heading prose-a:text-emerald-400">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-500 hover:text-emerald-400">
          ← allig8or.com
        </Link>
        <h1 className="text-white">{title}</h1>
        <p className="text-sm text-zinc-500">Last updated: {updated}</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  );
}
