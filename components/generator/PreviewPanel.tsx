'use client';

import { useState } from 'react';
import {
  Globe,
  Presentation,
  Sheet,
  FileText,
  FileType,
  Download,
  ExternalLink,
  Monitor,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import type { ToolType } from '@/types';

// ─── Tool metadata ────────────────────────────────────────────────────────────
const toolMeta: Record<
  ToolType,
  { Icon: React.ElementType; title: string; hint: string; ext: string }
> = {
  website:      { Icon: Globe,         title: 'Website preview',    hint: 'Your site renders here live.',         ext: 'html' },
  presentation: { Icon: Presentation,  title: 'Presentation ready', hint: 'Download your .pptx when done.',       ext: 'pptx' },
  spreadsheet:  { Icon: Sheet,         title: 'Spreadsheet ready',  hint: 'Download your .xlsx when done.',       ext: 'xlsx' },
  document:     { Icon: FileText,      title: 'Document ready',     hint: 'Download your .docx when done.',       ext: 'docx' },
  pdf:          { Icon: FileType,      title: 'PDF preview',        hint: 'Print-ready HTML renders here.',       ext: 'html' },
};

// ─── Device spec ─────────────────────────────────────────────────────────────
// Desktop : max-w-[1280px], aspect-[16/10], min-h-[520px]
// Mobile  : w-[390px], aspect-[390/844], rounded-[2.5rem]

type DeviceMode = 'desktop' | 'mobile';

// ─── Neutral browser bar (no traffic lights) ─────────────────────────────────
function PreviewBar({
  device,
  setDevice,
  fileUrl,
  fileName,
  html,
}: {
  device: DeviceMode;
  setDevice: (d: DeviceMode) => void;
  fileUrl?: string;
  fileName?: string;
  html?: string;
}) {
  const openInTab = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    if (w) setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const downloadHtml = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ?? 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      aria-hidden="false"
      title="Preview toolbar"
      className="flex items-center gap-2 border-b border-white/8 bg-zinc-950 px-3 py-2"
    >
      {/* Fake URL pill */}
      <div className="hidden sm:flex flex-1 max-w-xs items-center gap-1.5 rounded-md border border-white/8 bg-zinc-900 px-2.5 py-1">
        <Globe size={11} strokeWidth={1.5} className="shrink-0 text-zinc-600" aria-hidden />
        <span className="truncate text-[11px] text-zinc-500 select-none">
          preview.allig8tor.local
        </span>
      </div>

      {/* Label on mobile */}
      <span className="sm:hidden text-xs font-medium text-zinc-500">Preview</span>

      <div className="flex flex-1 sm:flex-none items-center justify-end gap-1.5">
        {/* Device toggle */}
        <div className="flex items-center rounded-md border border-white/8 bg-zinc-900 p-0.5">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            aria-pressed={device === 'desktop'}
            title="Desktop view"
            className={[
              'flex items-center gap-1 rounded px-2 py-1 text-xs transition',
              device === 'desktop'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-500 hover:text-zinc-300',
            ].join(' ')}
          >
            <Monitor size={12} strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            aria-pressed={device === 'mobile'}
            title="Mobile view"
            className={[
              'flex items-center gap-1 rounded px-2 py-1 text-xs transition',
              device === 'mobile'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-500 hover:text-zinc-300',
            ].join(' ')}
          >
            <Smartphone size={12} strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {html && (
          <>
            <button
              type="button"
              onClick={openInTab}
              title="Open preview in a new browser tab"
              aria-label="Open in new tab"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-white/8 bg-zinc-900 px-2 py-1 text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
            >
              <ExternalLink size={11} strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">Open</span>
            </button>
            <button
              type="button"
              onClick={downloadHtml}
              title="Download HTML file"
              aria-label="Download HTML"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-white/8 bg-zinc-900 px-2 py-1 text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
            >
              <Download size={11} strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">Download</span>
            </button>
          </>
        )}

        {!html && fileUrl && (
          <a
            href={fileUrl}
            download={fileName ?? 'file'}
            title="Download file"
            className="flex items-center gap-1 rounded-md border border-white/8 bg-zinc-900 px-2 py-1 text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
          >
            <Download size={11} strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Download</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Mobile device bezel ─────────────────────────────────────────────────────
function MobileBezel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto flex shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-2 border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60"
      style={{ width: 390, aspectRatio: '390/844' }}
    >
      {/* Static notch */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2.5 z-10 h-7 w-28 -translate-x-1/2 rounded-full bg-zinc-900 ring-1 ring-zinc-700"
      />
      {/* Inner screen */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
        {children}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PreviewPanel({
  preview,
  activeTool,
  onGenerateAnother,
}: {
  preview: {
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null;
  activeTool: ToolType;
  onGenerateAnother?: () => void;
}) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const meta = toolMeta[activeTool];
  const { Icon } = meta;

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!preview) {
    return (
      <div className="flex min-h-[120px] flex-1 flex-col items-center justify-center border-t border-white/8 bg-[#070b09] p-6 md:min-h-0 md:border-t-0">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Icon size={28} strokeWidth={1.5} className="text-emerald-500/60" aria-hidden />
          </div>
          <p className="text-sm font-medium text-zinc-400">{meta.title}</p>
          <p className="max-w-[240px] text-xs text-zinc-600">{meta.hint}</p>
        </div>
      </div>
    );
  }

  // ── HTML / website / pdf preview ──────────────────────────────────────────
  if (preview.type === 'html' && preview.content) {
    return (
      <div className="flex min-h-[280px] flex-1 flex-col overflow-hidden bg-[#070b09] md:min-h-0">
        <PreviewBar
          device={device}
          setDevice={setDevice}
          fileUrl={preview.fileUrl}
          fileName={preview.fileName}
          html={preview.content}
        />

        {/* Viewport area */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-zinc-950/60 p-4">
          {device === 'desktop' ? (
            // ── Desktop frame ─────────────────────────────────────────────
            <div
              className="w-full overflow-hidden rounded-lg border border-white/8 bg-white shadow-xl shadow-black/40"
              style={{ maxWidth: 1280, minHeight: 520, aspectRatio: '16/10' }}
            >
              <iframe
                srcDoc={preview.content}
                className="h-full w-full border-none"
                title="Desktop preview"
                sandbox="allow-scripts"
                style={{ minHeight: 520 }}
              />
            </div>
          ) : (
            // ── Mobile frame ──────────────────────────────────────────────
            <MobileBezel>
              <iframe
                srcDoc={preview.content}
                className="h-full w-full border-none bg-white"
                title="Mobile preview"
                sandbox="allow-scripts"
              />
            </MobileBezel>
          )}
        </div>
      </div>
    );
  }

  // ── File download (pptx / xlsx / docx) ────────────────────────────────────
  if (preview.type === 'file' && preview.fileUrl) {
    const ext = (preview.fileName?.split('.').pop() ?? meta.ext).toUpperCase();
    const fileSizeNote = ext === 'PPTX'
      ? 'Opens in PowerPoint or Google Slides'
      : ext === 'XLSX'
        ? 'Opens in Excel or Google Sheets'
        : 'Opens in Word or Google Docs';

    return (
      <div className="flex flex-1 items-center justify-center bg-[#070b09] p-8">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-white/8 bg-zinc-900/60 p-10 text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Icon size={36} strokeWidth={1.25} className="text-emerald-400" aria-hidden />
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-white">{preview.fileName}</p>
            <p className="mt-1 text-xs text-zinc-500">{fileSizeNote}</p>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2">
            <a
              href={preview.fileUrl}
              download={preview.fileName}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#070b09] transition hover:bg-emerald-400"
            >
              <Download size={16} strokeWidth={2} aria-hidden />
              Download .{ext.toLowerCase()}
            </a>
            <button
              type="button"
              onClick={() => onGenerateAnother?.()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-2.5 text-sm text-zinc-400 transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw size={13} strokeWidth={1.75} aria-hidden />
              Generate another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
