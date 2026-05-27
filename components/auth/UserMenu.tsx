'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, LogIn, LogOut, Sparkles } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { PlanId } from '@/lib/lemonsqueezy';

type MeResponse = {
  user: { id: string; email?: string } | null;
  plan: PlanId;
  usage: { used: number; limit: number; remaining: number } | null;
};

export default function UserMenu() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data: MeResponse) => setMe(data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!me?.user) {
    return (
      <Link
        href="/login?next=/app"
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-emerald-500/30 hover:text-white"
      >
        <LogIn size={14} aria-hidden />
        Sign in
      </Link>
    );
  }

  const checkoutParams = new URLSearchParams({ plan: 'pro' });
  checkoutParams.set('userId', me.user.id);
  if (me.user.email) checkoutParams.set('email', me.user.email);

  return (
    <div className="flex items-center gap-2">
      {me.usage && (
        <span className="hidden text-[11px] text-zinc-500 lg:inline">
          {me.usage.remaining}/{me.usage.limit} today ·{' '}
          <span className="capitalize text-emerald-500/80">{me.plan}</span>
        </span>
      )}
      {me.plan === 'free' && (
        <a
          href={`/api/checkout?${checkoutParams.toString()}`}
          className="hidden items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/25 transition hover:bg-emerald-500/25 sm:flex"
        >
          <Sparkles size={12} aria-hidden />
          Pro
        </a>
      )}
      <Link
        href="/projects"
        className="hidden items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-zinc-400 transition hover:text-white lg:flex"
      >
        <FolderOpen size={12} aria-hidden />
        Projects
      </Link>
      <span className="max-w-[120px] truncate text-xs text-zinc-400" title={me.user.email}>
        {me.user.email?.split('@')[0]}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
        aria-label="Sign out"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
