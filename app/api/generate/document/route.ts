import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import { generateDOCX, type DocumentData } from '@/lib/generators/document';
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

    const jsonStr = await generateWithClaude(prompt, 'document', history ?? []);
    const data = parseJsonResponse<DocumentData>(jsonStr);
    const buffer = await generateDOCX(data);

    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;

    return NextResponse.json(
      {
        fileUrl: dataUrl,
        fileName: `${data.title || 'document'}.docx`,
      },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('Document generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
