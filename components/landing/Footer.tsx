import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} allig8or — AI Office Suite
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/app" className="hover:text-emerald-400">
            App
          </Link>
          <Link href="#pricing" className="hover:text-emerald-400">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}
