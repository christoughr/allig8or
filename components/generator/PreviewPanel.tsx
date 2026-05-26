'use client';

import type { ToolType } from '@/types';

export default function PreviewPanel({
  preview,
  activeTool,
}: {
  preview: {
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null;
  activeTool: ToolType;
}) {
  if (!preview) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-900/50 p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-4xl opacity-40">
            {activeTool === 'website'
              ? '🌐'
              : activeTool === 'presentation'
                ? '📊'
                : activeTool === 'spreadsheet'
                  ? '📈'
                  : '📝'}
          </div>
          <p className="font-medium text-zinc-300">Preview appears here</p>
          <p className="mt-2 text-sm text-zinc-500">
            Describe your {activeTool} in the chat and we&apos;ll generate it
            live.
          </p>
        </div>
      </div>
    );
  }

  if (preview.type === 'html' && preview.content) {
    return (
      <div className="flex flex-1 flex-col bg-zinc-900">
        <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs text-zinc-500">Live preview</span>
          {preview.fileUrl && (
            <a
              href={preview.fileUrl}
              download={preview.fileName}
              className="ml-auto text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Download HTML
            </a>
          )}
        </div>
        <iframe
          srcDoc={preview.content}
          className="w-full flex-1 border-none bg-white"
          title="Preview"
          sandbox="allow-scripts"
        />
      </div>
    );
  }

  if (preview.type === 'file' && preview.fileUrl) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-900/50 p-8">
        <div className="max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center shadow-xl">
          <div className="text-5xl">
            {activeTool === 'presentation'
              ? '📊'
              : activeTool === 'spreadsheet'
                ? '📈'
                : '📝'}
          </div>
          <p className="mt-4 font-medium text-white">{preview.fileName}</p>
          <p className="mt-1 text-sm text-zinc-500">Ready to download</p>
          <a
            href={preview.fileUrl}
            download={preview.fileName}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#070b09] transition hover:bg-emerald-400"
          >
            Download {activeTool}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
