import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import { createGenerateRoute } from '@/lib/generateRoute';
import {
  generatePPTX,
  type PresentationData,
} from '@/lib/generators/presentation';

export const maxDuration = 60;

export const POST = createGenerateRoute('presentation', async ({ prompt, history }) => {
  const jsonStr = await generateWithClaude(prompt, 'presentation', history);
  const data = parseJsonResponse<PresentationData>(jsonStr);
  const buffer = await generatePPTX(data);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`;
  return {
    fileUrl: dataUrl,
    fileName: `${data.title || 'presentation'}.pptx`,
  };
});
