import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';
import Logo from '@/components/brand/Logo';

import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Sign in',
  description: 'Sign in to allig8tor to save projects and unlock daily AI generation limits.',
  path: '/login',
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.next ?? '/app';

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#070b09] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 shadow-xl">
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sign in to save projects and unlock daily limits.
          </p>

          {params.error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Sign-in failed. Please try again.
            </p>
          )}

          <div className="mt-6">
            <AuthForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </div>
  );
}
