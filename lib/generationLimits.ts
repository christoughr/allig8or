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
import { countProjectsForUser } from '@/lib/projects';

function getCurrentMonthWindow() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

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

async function countUserGenerationsThisMonth(userId: string): Promise<number> {
  const admin = getAdminClient();
  if (!admin) return 0;

  const { start } = getCurrentMonthWindow();
  const since = start.toISOString();
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
          'Rate limit reached (10/hour per IP). Sign in for monthly limits or upgrade to a paid plan.',
      };
    }
    return { allowed: true, remaining, resetAt, plan: 'free', userId: null };
  }

  const plan = await resolveUserPlan(userId);
  const limit = PLANS[plan].limits.generationsPerMonth;
  const used = await countUserGenerationsThisMonth(userId);
  const { end } = getCurrentMonthWindow();
  const resetAt = end.getTime();

  if (used >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      plan,
      userId,
      message:
        plan === 'free'
          ? `Monthly limit reached (${limit}/month). Upgrade to Starter (80/month), Pro (300/month), or Team (1000/month).`
          : `Monthly limit reached (${limit}/month). Resets next month.`,
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
}): Promise<string | null> {
  const admin = getAdminClient();
  if (!admin) return null;

  const plan = await resolveUserPlan(params.userId);
  const projectLimit = PLANS[plan].limits.projects;
  if (projectLimit >= 0) {
    const count = await countProjectsForUser(params.userId);
    if (count >= projectLimit) {
      console.warn('[projects] limit reached for user', params.userId);
      return null;
    }
  }

  const title =
    params.title?.slice(0, 120) ||
    params.prompt.slice(0, 80) ||
    'Untitled';

  const { data, error } = await admin
    .from('projects')
    .insert({
      user_id: params.userId,
      type: params.type,
      title,
      prompt: params.prompt,
      file_url: params.fileUrl ?? null,
      html_content: params.htmlContent ?? null,
      messages: params.messages ?? [],
    })
    .select('id')
    .single();

  if (error) {
    console.error('[projects] save failed:', error.message);
    return null;
  }

  return data?.id ? String(data.id) : null;
}
