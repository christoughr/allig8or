import { generateWithClaude } from '@/lib/claude';
import { createGenerateRoute } from '@/lib/generateRoute';
import { stripHtmlFences } from '@/lib/stripHtml';

export const maxDuration = 120;

export const POST = createGenerateRoute('pdf', async ({ prompt, history }) => {
  const raw = await generateWithClaude(prompt, 'pdf', history);
  const html = stripHtmlFences(raw);
  return { html, fileName: 'document.html' };
});
