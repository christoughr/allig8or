import { getAdminClient } from '@/lib/supabase/admin';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'generated-files';

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET !== 'disabled'
  );
}

function extForType(type: string, fileName?: string): string {
  if (fileName?.includes('.')) {
    return fileName.split('.').pop() ?? 'bin';
  }
  const map: Record<string, string> = {
    presentation: 'pptx',
    spreadsheet: 'xlsx',
    document: 'docx',
    website: 'html',
    pdf: 'html',
  };
  return map[type] ?? 'bin';
}

function mimeForExt(ext: string): string {
  const m: Record<string, string> = {
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    html: 'text/html;charset=utf-8',
  };
  return m[ext] ?? 'application/octet-stream';
}

/** Upload buffer; returns public/signed URL or null (caller keeps data URL fallback). */
export async function uploadGeneratedFile(params: {
  userId: string;
  type: string;
  buffer: Buffer;
  fileName?: string;
}): Promise<{ url: string; path: string } | null> {
  const admin = getAdminClient();
  if (!admin || !isStorageConfigured()) return null;

  const ext = extForType(params.type, params.fileName);
  const safeName = (params.fileName ?? `file.${ext}`).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${params.userId}/${params.type}/${Date.now()}-${safeName}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, params.buffer, {
    contentType: mimeForExt(ext),
    upsert: false,
  });

  if (error) {
    console.error('[storage] upload failed:', error.message);
    return null;
  }

  const { data, error: signError } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days

  if (signError || !data?.signedUrl) {
    console.error('[storage] signed URL failed:', signError?.message);
    return null;
  }

  return { url: data.signedUrl, path };
}

export async function uploadHtmlContent(params: {
  userId: string;
  type: string;
  html: string;
  fileName?: string;
}): Promise<{ url: string; path: string } | null> {
  return uploadGeneratedFile({
    userId: params.userId,
    type: params.type,
    buffer: Buffer.from(params.html, 'utf-8'),
    fileName: params.fileName ?? 'page.html',
  });
}
