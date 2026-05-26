/**
 * Lemon Squeezy billing — https://docs.lemonsqueezy.com
 *
 * Dashboard setup:
 * 1. Create store + products (Pro $29, Team $79)
 * 2. Copy variant IDs into env
 * 3. Webhook → https://allig8or.com/api/webhooks/lemonsqueezy
 */

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    variantId: null as string | null,
    limits: {
      projects: 5,
      generationsPerDay: 10,
      fileDownloads: true,
      customDomain: false,
      teamMembers: 1,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO ?? '',
    limits: {
      projects: -1,
      generationsPerDay: 200,
      fileDownloads: true,
      customDomain: true,
      teamMembers: 1,
    },
  },
  team: {
    name: 'Team',
    price: 79,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM ?? '',
    limits: {
      projects: -1,
      generationsPerDay: 1000,
      fileDownloads: true,
      customDomain: true,
      teamMembers: 10,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

const STORE_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID ?? '';

/** Hosted checkout URL (no SDK required for MVP) */
export function getCheckoutUrl(
  planId: 'pro' | 'team',
  options?: { userId?: string; email?: string }
): string | null {
  const variantId = PLANS[planId].variantId;
  if (!variantId || !STORE_ID) return null;

  const params = new URLSearchParams({
    'checkout[custom][plan]': planId,
  });
  if (options?.userId) {
    params.set('checkout[custom][user_id]', options.userId);
  }
  if (options?.email) {
    params.set('checkout[email]', options.email);
  }

  return `https://${STORE_ID}.lemonsqueezy.com/checkout/buy/${variantId}?${params}`;
}

export function planFromVariantName(variantName: string): PlanId {
  const lower = variantName.toLowerCase();
  if (lower.includes('team')) return 'team';
  if (lower.includes('pro')) return 'pro';
  return 'free';
}
