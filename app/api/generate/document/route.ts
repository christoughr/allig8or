import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import { generateDOCX, type DocumentData } from '@/lib/generators/document';

export async function POST(req: NextRequest) {
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

    return NextResponse.json({
      fileUrl: dataUrl,
      fileName: `${data.title || 'document'}.docx`,
    });
  } catch (error) {
    console.error('Document generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
