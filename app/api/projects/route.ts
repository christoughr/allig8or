import { NextResponse } from 'next/server';
import { listProjectsForUser } from '@/lib/projects';
import { getAuthUser } from '@/lib/supabase/server';

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const projects = await listProjectsForUser(user.id);
  return NextResponse.json({ projects });
}
