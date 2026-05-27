import { NextResponse } from 'next/server';
import { submitIndexNow } from '@/lib/indexnow';

/** Ping Bing/Yandex IndexNow after deploy or new content. */
export async function POST(req: Request) {
  const secret = process.env.INDEXNOW_CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const result = await submitIndexNow();
  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    urlCount: result.urlCount,
  });
}

export async function GET() {
  const result = await submitIndexNow();
  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    urlCount: result.urlCount,
    hint: 'IndexNow notifies Bing and partners. Also import site in Bing Webmaster from Google.',
  });
}
