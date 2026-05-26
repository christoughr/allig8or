import { NextResponse } from 'next/server';
import { PLANS } from '@/lib/lemonsqueezy';
import { getAuthUser } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { resolveUserPlan } from '@/lib/generationLimits';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({
      user: null,
      plan: 'free',
      usage: null,
    });
  }

  const plan = await resolveUserPlan(user.id);
  const limit = PLANS[plan].limits.generationsPerDay;

  const admin = getAdminClient();
  let used = 0;

  if (admin) {
    const since = new Date(Date.now() - DAY_MS).toISOString();
    const { count } = await admin
      .from('usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since);
    used = count ?? 0;
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    plan,
    usage: {
      used,
      limit,
      remaining: Math.max(0, limit - used),
    },
  });
}
