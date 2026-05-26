import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import { createGenerateRoute } from '@/lib/generateRoute';
import { generateDOCX, type DocumentData } from '@/lib/generators/document';

export const maxDuration = 60;

export const POST = createGenerateRoute('document', async ({ prompt, history }) => {
  const jsonStr = await generateWithClaude(prompt, 'document', history);
  const data = parseJsonResponse<DocumentData>(jsonStr);
  const buffer = await generateDOCX(data);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
  return {
    fileUrl: dataUrl,
    fileName: `${data.title || 'document'}.docx`,
  };
});
