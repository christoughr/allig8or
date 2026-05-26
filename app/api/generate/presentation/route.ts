import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import {
  generatePPTX,
  type PresentationData,
} from '@/lib/generators/presentation';
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

    const jsonStr = await generateWithClaude(
      prompt,
      'presentation',
      history ?? []
    );
    const data = parseJsonResponse<PresentationData>(jsonStr);
    const buffer = await generatePPTX(data);

    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`;

    return NextResponse.json(
      {
        fileUrl: dataUrl,
        fileName: `${data.title || 'presentation'}.pptx`,
      },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('Presentation generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
