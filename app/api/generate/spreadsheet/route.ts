import { generateWithClaude, parseJsonResponse } from '@/lib/claude';
import { createGenerateRoute } from '@/lib/generateRoute';
import {
  generateXLSX,
  type SpreadsheetData,
} from '@/lib/generators/spreadsheet';

export const maxDuration = 60;

export const POST = createGenerateRoute('spreadsheet', async ({ prompt, history }) => {
  const jsonStr = await generateWithClaude(prompt, 'spreadsheet', history);
  const data = parseJsonResponse<SpreadsheetData>(jsonStr);
  const buffer = await generateXLSX(data);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
  return {
    fileUrl: dataUrl,
    fileName: `${data.title || 'spreadsheet'}.xlsx`,
  };
});
