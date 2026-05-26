'use client';

import { useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AuthForm({ redirectTo = '/app' }: { redirectTo?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-zinc-400">
        Auth is not configured. Add Supabase env vars to enable sign-in.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Check your email to confirm your account, then sign in.');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        window.location.href = redirectTo;
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-400">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#070b09] transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-emerald-400 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-emerald-400 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>

      <p className="text-center text-xs text-zinc-600">
        <Link href="/app" className="hover:text-zinc-400">
          Continue without account
        </Link>
      </p>
    </form>
  );
}
