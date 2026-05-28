import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} allig8tor — Premium AI production suite
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500 sm:justify-end">
          <Link href="/app" className="hover:text-emerald-400">
            App
          </Link>
          <Link href="/blog" className="hover:text-emerald-400">
            Blog
          </Link>
          <Link href="/use-cases" className="hover:text-emerald-400">
            Use cases
          </Link>
          <Link href="/#pricing" className="hover:text-emerald-400">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-emerald-400">
            Sign in
          </Link>
          <Link href="/privacy" className="hover:text-emerald-400">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-400">
            Terms
          </Link>
          <a href="/feed.xml" className="hover:text-emerald-400">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
