import { NextRequest, NextResponse } from 'next/server';
import type { GenerationType } from '@/lib/claude';
import {
  checkGenerationLimit,
  limitExceededResponse,
  logGeneration,
  saveProject,
} from '@/lib/generationLimits';

type GenerateHandler = (body: {
  prompt: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}) => Promise<{
  html?: string;
  fileUrl?: string;
  fileName?: string;
}>;

export function createGenerateRoute(type: GenerationType, handler: GenerateHandler) {
  return async function POST(req: NextRequest) {
    const limit = await checkGenerationLimit(req);

    if (!limit.allowed) {
      const { status, headers } = limitExceededResponse(limit.resetAt);
      return NextResponse.json(
        { error: limit.message },
        { status, headers }
      );
    }

    try {
      const body = await req.json();
      const prompt = body.prompt;
      const history = body.history ?? [];

      if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      }

      const result = await handler({ prompt, history });

      await logGeneration(limit.userId, type);

      if (limit.userId) {
        await saveProject({
          userId: limit.userId,
          type,
          prompt,
          title: result.fileName?.replace(/\.\w+$/, '') ?? prompt.slice(0, 80),
          fileUrl: result.fileUrl,
          htmlContent: result.html,
          messages: [
            ...history,
            { role: 'user', content: prompt },
            {
              role: 'assistant',
              content:
                type === 'website' || type === 'pdf'
                  ? 'Generated preview'
                  : `File: ${result.fileName ?? type}`,
            },
          ],
        });
      }

      return NextResponse.json(result, {
        headers: {
          'X-RateLimit-Remaining': String(limit.remaining),
          'X-RateLimit-Plan': limit.plan,
        },
      });
    } catch (error) {
      console.error(`${type} generation failed:`, error);
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }
  };
}
