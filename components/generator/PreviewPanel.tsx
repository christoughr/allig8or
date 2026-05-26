'use client';

import { useState } from 'react';
import type { ToolType } from '@/types';

const toolEmptyState: Record<ToolType, { icon: string; title: string; hint: string }> = {
  website: { icon: '⬡', title: 'Website preview', hint: 'Your site renders here live' },
  presentation: { icon: '▤', title: 'Presentation ready', hint: 'Download your .pptx when done' },
  spreadsheet: { icon: '⊞', title: 'Spreadsheet ready', hint: 'Download your .xlsx when done' },
  document: { icon: '☰', title: 'Document ready', hint: 'Download your .docx when done' },
  pdf: { icon: '⬚', title: 'PDF preview', hint: 'Print-ready HTML renders here' },
};

type DeviceMode = 'desktop' | 'mobile';

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
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const empty = toolEmptyState[activeTool];

  if (!preview) {
    return (
      <div className="hidden flex-1 flex-col items-center justify-center bg-[#070b09] p-8 md:flex">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <span className="font-mono text-2xl text-white/20">{empty.icon}</span>
          </div>
          <p className="text-sm font-medium text-zinc-400">{empty.title}</p>
          <p className="mt-1 text-xs text-zinc-600">{empty.hint}</p>
        </div>
      </div>
    );
  }

  if (preview.type === 'html' && preview.content) {
    return (
      <div className="flex flex-1 flex-col bg-[#070b09]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-zinc-950 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-3">
            <span className="text-xs text-zinc-600">Preview</span>
            {/* Device toggle */}
            <div className="flex rounded-lg border border-white/8 bg-zinc-900 p-0.5">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`rounded-md px-2 py-1 text-xs transition ${
                  device === 'desktop'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`rounded-md px-2 py-1 text-xs transition ${
                  device === 'mobile'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
          {preview.fileUrl && (
            <a
              href={preview.fileUrl}
              download={preview.fileName ?? 'page.html'}
              className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Download HTML
            </a>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-1 items-start justify-center overflow-auto bg-zinc-900/40 p-4">
          <div
            className={`h-full overflow-hidden rounded-xl border border-white/8 bg-white transition-all duration-300 ${
              device === 'mobile' ? 'w-[390px]' : 'w-full'
            }`}
          >
            <iframe
              srcDoc={preview.content}
              className="h-full w-full border-none"
              title="Preview"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    );
  }

  if (preview.type === 'file' && preview.fileUrl) {
    const ext = preview.fileName?.split('.').pop()?.toUpperCase() ?? 'FILE';
    return (
      <div className="flex flex-1 items-center justify-center bg-[#070b09] p-8">
        <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-zinc-900/60 p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/8 bg-zinc-800">
            <span className="font-mono text-sm font-semibold text-zinc-300">.{ext.toLowerCase()}</span>
          </div>
          <p className="font-semibold text-white">{preview.fileName}</p>
          <p className="mt-1 text-sm text-zinc-500">Ready to download</p>
          <a
            href={preview.fileUrl}
            download={preview.fileName}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#070b09] transition hover:bg-emerald-400"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 2v8M4.5 7l3.5 3.5L11.5 7M3 13h10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download {ext}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
