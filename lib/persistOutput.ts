import type { GenerationType } from '@/lib/claude';
import { isStorageConfigured, uploadGeneratedFile, uploadHtmlContent } from '@/lib/storage';

function dataUrlToBuffer(dataUrl: string): Buffer | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  try {
    return Buffer.from(match[2], 'base64');
  } catch {
    return null;
  }
}

/** Upload large outputs to Supabase Storage when configured; otherwise keep data URLs. */
export async function persistGenerationOutput(params: {
  userId: string | null;
  type: GenerationType;
  result: {
    html?: string;
    fileUrl?: string;
    fileName?: string;
  };
}): Promise<typeof params.result> {
  if (!params.userId || !isStorageConfigured()) return params.result;

  const { type, result } = params;

  if (result.html?.trim()) {
    const uploaded = await uploadHtmlContent({
      userId: params.userId,
      type,
      html: result.html,
      fileName: result.fileName ?? 'page.html',
    });
    if (uploaded) {
      return { ...result, fileUrl: uploaded.url };
    }
  }

  if (result.fileUrl?.startsWith('data:')) {
    const buffer = dataUrlToBuffer(result.fileUrl);
    if (buffer) {
      const uploaded = await uploadGeneratedFile({
        userId: params.userId,
        type,
        buffer,
        fileName: result.fileName,
      });
      if (uploaded) {
        return { ...result, fileUrl: uploaded.url };
      }
    }
  }

  return result;
}
