import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const html = await generateWithClaude(prompt, 'website', history ?? []);
    return NextResponse.json({ html });
  } catch (error) {
    console.error('Website generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
