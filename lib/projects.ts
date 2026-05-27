import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Project, ToolType } from '@/types';

export async function getSessionUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function listProjectsForUser(
  userId: string,
  limit = 50
): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[projects] list failed:', error.message);
    return [];
  }

  return (data ?? []).map(rowToProject);
}

export async function getProjectForUser(
  userId: string,
  id: string
): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProject(data);
}

export async function deleteProjectForUser(
  userId: string,
  id: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) {
    console.error('[projects] delete failed:', error.message);
    return false;
  }
  return true;
}

export async function countProjectsForUser(userId: string): Promise<number> {
  const admin = getAdminClient();
  if (!admin) return 0;
  const { count, error } = await admin
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count ?? 0;
}

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title),
    type: row.type as ToolType,
    prompt: String(row.prompt),
    file_url: row.file_url ? String(row.file_url) : undefined,
    html_content: row.html_content ? String(row.html_content) : undefined,
    messages: Array.isArray(row.messages) ? row.messages : [],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
