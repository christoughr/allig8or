import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';
import {
  checkRateLimit,
  getClientIp,
  rateLimitExceededResponse,
} from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = checkRateLimit(ip);

  if (!allowed) {
    const { status, headers } = rateLimitExceededResponse(resetAt);
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status, headers }
    );
  }

  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const html = await generateWithClaude(prompt, 'pdf', history ?? []);

    const base64 = Buffer.from(html, 'utf-8').toString('base64');
    const dataUrl = `data:text/html;base64,${base64}`;

    return NextResponse.json(
      {
        html,
        fileUrl: dataUrl,
        fileName: 'document.html',
      },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
