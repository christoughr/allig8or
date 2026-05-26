import type { NextRequest } from 'next/server';
import { PLANS, type PlanId } from '@/lib/lemonsqueezy';
import { getAdminClient } from '@/lib/supabase/admin';
import { getAuthUser } from '@/lib/supabase/server';
import {
  checkRateLimit,
  getClientIp,
  rateLimitExceededResponse,
} from '@/lib/rateLimit';
import type { GenerationType } from '@/lib/claude';

const DAY_MS = 24 * 60 * 60 * 1000;

export type LimitResult =
  | {
      allowed: true;
      remaining: number;
      resetAt: number;
      plan: PlanId;
      userId: string | null;
    }
  | {
      allowed: false;
      remaining: 0;
      resetAt: number;
      plan: PlanId;
      userId: string | null;
      message: string;
    };

export async function resolveUserPlan(userId: string): Promise<PlanId> {
  const admin = getAdminClient();
  if (!admin) return 'free';

  const { data } = await admin
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) return 'free';

  if (data.status === 'expired') return 'free';

  if (data.status === 'cancelled' && data.current_period_end) {
    const end = new Date(data.current_period_end).getTime();
    if (Date.now() > end) return 'free';
  }

  const plan = data.plan as PlanId;
  return plan in PLANS ? plan : 'free';
}

async function countUserGenerationsToday(userId: string): Promise<number> {
  const admin = getAdminClient();
  if (!admin) return 0;

  const since = new Date(Date.now() - DAY_MS).toISOString();
  const { count, error } = await admin
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since);

  if (error) {
    console.error('[limits] usage count failed:', error.message);
    return 0;
  }

  return count ?? 0;
}

export async function checkGenerationLimit(
  req: NextRequest
): Promise<LimitResult> {
  const ip = getClientIp(req);
  const user = await getAuthUser();
  const userId = user?.id ?? null;

  if (!userId) {
    const { allowed, remaining, resetAt } = checkRateLimit(ip);
    if (!allowed) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        plan: 'free',
        userId: null,
        message:
          'Rate limit reached (10/hour per IP). Sign in for daily limits or upgrade to Pro.',
      };
    }
    return { allowed: true, remaining, resetAt, plan: 'free', userId: null };
  }

  const plan = await resolveUserPlan(userId);
  const limit = PLANS[plan].limits.generationsPerDay;
  const used = await countUserGenerationsToday(userId);
  const resetAt = Date.now() + DAY_MS;

  if (used >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      plan,
      userId,
      message:
        plan === 'free'
          ? `Daily limit reached (${limit}/day). Upgrade to Pro for 200/day.`
          : `Daily limit reached (${limit}/day). Resets in 24 hours.`,
    };
  }

  return {
    allowed: true,
    remaining: limit - used - 1,
    resetAt,
    plan,
    userId,
  };
}

export function limitExceededResponse(resetAt: number) {
  return rateLimitExceededResponse(resetAt);
}

export async function logGeneration(
  userId: string | null,
  type: GenerationType
): Promise<void> {
  if (!userId) return;

  const admin = getAdminClient();
  if (!admin) return;

  await admin.from('usage').insert({
    user_id: userId,
    type,
    tokens_used: 0,
  });
}

export async function saveProject(params: {
  userId: string;
  type: GenerationType;
  prompt: string;
  title?: string;
  fileUrl?: string;
  htmlContent?: string;
  messages?: Array<{ role: string; content: string }>;
}): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;

  const title =
    params.title?.slice(0, 120) ||
    params.prompt.slice(0, 80) ||
    'Untitled';

  await admin.from('projects').insert({
    user_id: params.userId,
    type: params.type,
    title,
    prompt: params.prompt,
    file_url: params.fileUrl ?? null,
    html_content: params.htmlContent ?? null,
    messages: params.messages ?? [],
  });
}
