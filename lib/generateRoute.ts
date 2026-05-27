import { NextRequest, NextResponse } from 'next/server';
import type { GenerationType } from '@/lib/claude';
import {
  checkGenerationLimit,
  limitExceededResponse,
  logGeneration,
  saveProject,
} from '@/lib/generationLimits';
import { persistGenerationOutput } from '@/lib/persistOutput';

type GenerateHandler = (body: {
  prompt: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}) => Promise<{
  html?: string;
  fileUrl?: string;
  fileName?: string;
}>;

function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('JSON')) {
      return 'AI returned invalid structure. Try a shorter prompt or add more detail about sections/slides.';
    }
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return 'Generation timed out. Try fewer slides/rows or a simpler layout.';
    }
    return error.message;
  }
  return 'Generation failed. Please try again.';
}

export function createGenerateRoute(type: GenerationType, handler: GenerateHandler) {
  return async function POST(req: NextRequest) {
    const limit = await checkGenerationLimit(req);

    if (!limit.allowed) {
      const { status, headers } = limitExceededResponse(limit.resetAt);
      return NextResponse.json(
        { error: limit.message, retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000) },
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

      let result = await handler({ prompt, history });
      result = await persistGenerationOutput({
        userId: limit.userId,
        type,
        result,
      });

      await logGeneration(limit.userId, type);

      let projectId: string | null = null;
      if (limit.userId) {
        projectId = await saveProject({
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

      return NextResponse.json(
        { ...result, projectId },
        {
          headers: {
            'X-RateLimit-Remaining': String(limit.remaining),
            'X-RateLimit-Plan': limit.plan,
          },
        }
      );
    } catch (error) {
      console.error(`${type} generation failed:`, error);
      return NextResponse.json(
        {
          error: friendlyError(error),
          hint:
            type === 'presentation'
              ? 'Tip: specify slide count and key sections (problem, solution, traction).'
              : type === 'spreadsheet'
                ? 'Tip: name sheets and columns you need (e.g. Revenue, Expenses, Summary).'
                : 'Tip: add audience, tone, and length (e.g. 5 sections, formal tone).',
        },
        { status: 500 }
      );
    }
  };
}
