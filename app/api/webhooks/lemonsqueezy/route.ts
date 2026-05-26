import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { planFromVariantName, type PlanId } from '@/lib/lemonsqueezy';

type LemonEvent = {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string; plan?: string };
  };
  data: {
    id: string;
    attributes: {
      status: string;
      variant_name: string;
      user_email: string;
      customer_id: number;
      renews_at: string | null;
      ends_at: string | null;
    };
  };
};

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const sig = Buffer.from(signature, 'utf8');

  if (digest.length !== sig.length) return false;
  return crypto.timingSafeEqual(digest, sig);
}

async function syncSubscription(
  userId: string | undefined,
  email: string,
  plan: PlanId,
  subscriptionId: string,
  customerId: string,
  status: string,
  periodEnd: string | null
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('[lemonsqueezy] Supabase not configured — skipping DB sync');
    return;
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);

  const row = {
    lemonsqueezy_customer_id: customerId,
    lemonsqueezy_subscription_id: subscriptionId,
    plan,
    status,
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    await supabase.from('subscriptions').upsert({ user_id: userId, ...row });
    return;
  }

  // Fallback: match by email via auth admin (requires service role)
  const { data: users } = await supabase.auth.admin.listUsers();
  const match = users?.users?.find((u) => u.email === email);
  if (match) {
    await supabase.from('subscriptions').upsert({ user_id: match.id, ...row });
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'LEMONSQUEEZY_WEBHOOK_SECRET not set' },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as LemonEvent;
  const eventName = event.meta.event_name;
  const attrs = event.data.attributes;
  const userId = event.meta.custom_data?.user_id;
  const customPlan = event.meta.custom_data?.plan as PlanId | undefined;
  const plan =
    customPlan ?? planFromVariantName(attrs.variant_name);
  const customerId = String(attrs.customer_id);
  const subscriptionId = event.data.id;

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_resumed':
    case 'subscription_payment_success':
      await syncSubscription(
        userId,
        attrs.user_email,
        plan,
        subscriptionId,
        customerId,
        attrs.status,
        attrs.renews_at
      );
      break;

    case 'subscription_cancelled':
      await syncSubscription(
        userId,
        attrs.user_email,
        plan,
        subscriptionId,
        customerId,
        'cancelled',
        attrs.ends_at ?? attrs.renews_at
      );
      break;

    case 'subscription_expired':
      await syncSubscription(
        userId,
        attrs.user_email,
        'free',
        subscriptionId,
        customerId,
        'expired',
        null
      );
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
