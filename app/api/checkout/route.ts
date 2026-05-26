import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutUrl } from '@/lib/lemonsqueezy';

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan');
  const userId = req.nextUrl.searchParams.get('userId') ?? undefined;
  const email = req.nextUrl.searchParams.get('email') ?? undefined;

  if (plan !== 'pro' && plan !== 'team') {
    return NextResponse.json(
      { error: 'Invalid plan. Use pro or team.' },
      { status: 400 }
    );
  }

  const url = getCheckoutUrl(plan, { userId, email });

  if (!url) {
    return NextResponse.json(
      {
        error:
          'Checkout not configured. Set NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID and variant IDs.',
      },
      { status: 503 }
    );
  }

  return NextResponse.redirect(url);
}
