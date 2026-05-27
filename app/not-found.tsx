import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Page not found',
  description: 'The page you requested does not exist on allig8tor.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#070b09] px-6 text-center text-white">
      <p className="font-mono text-sm text-emerald-500/80">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        This URL does not exist. Head back to the AI office suite.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#070b09] hover:bg-emerald-400"
        >
          Home
        </Link>
        <Link
          href="/app"
          className="rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-white/25"
        >
          Open app
        </Link>
      </div>
    </div>
  );
}
