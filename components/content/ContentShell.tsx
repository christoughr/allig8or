import Link from 'next/link';
import Logo from '@/components/brand/Logo';

export default function ContentShell({
  children,
  backHref = '/',
  backLabel = '← Home',
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-[#070b09] text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/app" className="text-sm font-medium text-emerald-400 hover:underline">
            Open app →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>
      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-zinc-600">
        <Link href={backHref} className="hover:text-emerald-400">
          {backLabel}
        </Link>
      </footer>
    </div>
  );
}
