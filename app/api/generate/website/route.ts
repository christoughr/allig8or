import { generateWithClaude } from '@/lib/claude';
import { createGenerateRoute } from '@/lib/generateRoute';
import { stripHtmlFences } from '@/lib/stripHtml';

export const maxDuration = 60;

export const POST = createGenerateRoute('website', async ({ prompt, history }) => {
  const raw = await generateWithClaude(prompt, 'website', history);
  const html = stripHtmlFences(raw);
  return { html };
});
