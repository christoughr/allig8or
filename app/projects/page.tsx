'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Presentation,
  Sheet,
  FileText,
  FileType,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import type { Project, ToolType } from '@/types';
import Logo from '@/components/brand/Logo';

const toolIcons: Record<ToolType, React.ElementType> = {
  website: Globe,
  presentation: Presentation,
  spreadsheet: Sheet,
  document: FileText,
  pdf: FileType,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/projects')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? 'Failed to load');
        setProjects(data.projects ?? []);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const r = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (r.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070b09] text-white">
      <header className="border-b border-white/8 px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo href="/" />
          <Link
            href="/app"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-semibold">Your projects</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Recent generations saved while signed in. Open to continue or regenerate.
        </p>

        {loading && (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error === 'Sign in required' ? (
              <>
                <Link href="/login?next=/projects" className="font-semibold underline">
                  Sign in
                </Link>{' '}
                to see saved projects.
              </>
            ) : (
              error
            )}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="mt-8 text-sm text-zinc-500">
            No projects yet. Generate something in the{' '}
            <Link href="/app" className="text-emerald-400 hover:underline">
              app
            </Link>{' '}
            while signed in.
          </p>
        )}

        <ul className="mt-6 space-y-2">
          {projects.map((p) => {
            const Icon = toolIcons[p.type];
            const date = new Date(p.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-zinc-900/40 px-4 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{p.title}</p>
                  <p className="truncate text-xs text-zinc-500">{p.prompt}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">
                    {p.type} · {date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/app?project=${p.id}`}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/25 hover:bg-emerald-500/25"
                  >
                    <ExternalLink size={12} />
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
