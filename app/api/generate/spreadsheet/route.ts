import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import {
  generateXLSX,
  type SpreadsheetData,
} from '@/lib/generators/spreadsheet';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const jsonStr = await generateWithClaude(
      prompt,
      'spreadsheet',
      history ?? []
    );
    const data = parseJsonResponse<SpreadsheetData>(jsonStr);
    const buffer = await generateXLSX(data);

    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;

    return NextResponse.json({
      fileUrl: dataUrl,
      fileName: `${data.title || 'spreadsheet'}.xlsx`,
    });
  } catch (error) {
    console.error('Spreadsheet generation failed:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
