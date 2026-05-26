import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const html = await generateWithClaude(prompt, 'pdf', history ?? []);

    const base64 = Buffer.from(html, 'utf-8').toString('base64');
    const dataUrl = `data:text/html;base64,${base64}`;

    return NextResponse.json({
      html,
      fileUrl: dataUrl,
      fileName: 'document.html',
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
