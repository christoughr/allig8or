'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, ExternalLink, Globe } from 'lucide-react';
import type { ToolType } from '@/types';

const DEMO_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Park & Associates</title><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"/><style>body{font-family:'Source Sans 3',sans-serif}</style></head><body class="bg-white text-slate-800"><nav class="flex items-center justify-between bg-[#0a1628] px-6 py-4"><span class="font-[Cormorant_Garamond] text-lg font-semibold tracking-widest text-amber-400">PARK & ASSOCIATES</span><div class="flex gap-4 text-sm text-slate-400"><span>Practice</span><span>Team</span><span>Contact</span></div></nav><header class="bg-gradient-to-br from-[#0a1628] to-[#1a2f50] px-6 py-16 text-center"><p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Startup IP Law</p><h1 class="mt-3 text-3xl font-bold text-white">Protecting Your Most Valuable Assets</h1><a href="#" class="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-[#0a1628]">Free Consult</a></header><section class="mx-auto max-w-2xl px-6 py-10 space-y-3"><div class="h-2 rounded bg-slate-200"></div><div class="h-2 w-4/5 rounded bg-slate-100"></div><div class="h-2 w-3/5 rounded bg-slate-100"></div></section></body></html>`;

const tabs: { label: string; tool: ToolType }[] = [
  { label: 'Website', tool: 'website' },
  { label: 'Slides', tool: 'presentation' },
  { label: 'Sheet', tool: 'spreadsheet' },
  { label: 'Doc', tool: 'document' },
  { label: 'PDF', tool: 'pdf' },
];

export default function AppPreview() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState(0);

  const openDemo = () => {
    const blob = new Blob([DEMO_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const activeTool = tabs[activeTab].tool;

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-center text-xs text-zinc-600">
          Interactive preview — try Desktop / Mobile / Open, then{' '}
          <Link href="/app" className="text-emerald-400 hover:underline">
            open the real app
          </Link>
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">
          <div className="flex items-center gap-2 border-b border-white/8 bg-zinc-950/90 px-3 py-2.5">
            <div className="hidden max-w-[220px] flex-1 items-center gap-1.5 rounded-md border border-white/8 bg-zinc-900 px-2.5 py-1 sm:flex">
              <Globe size={11} className="shrink-0 text-zinc-600" aria-hidden />
              <span className="truncate text-[11px] text-zinc-500 select-none">
                preview.allig8or.local
              </span>
            </div>
            <span className="text-xs text-zinc-500 sm:hidden">Preview</span>
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <div className="flex rounded-md border border-white/8 bg-zinc-900 p-0.5">
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] transition ${
                    device === 'desktop'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Monitor size={11} aria-hidden />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] transition ${
                    device === 'mobile'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Smartphone size={11} aria-hidden />
                  Mobile
                </button>
              </div>
              <button
                type="button"
                onClick={openDemo}
                className="flex items-center gap-1 rounded-md border border-white/8 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
              >
                <ExternalLink size={10} aria-hidden />
                Open
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-[300px_1fr]">
            <div className="border-b border-white/8 bg-zinc-950 p-4 md:border-b-0 md:border-r">
              <div className="mb-4 flex gap-1.5 overflow-x-auto">
                {tabs.map(({ label, tool }, i) => (
                  <Link
                    key={tool}
                    href={`/app?tool=${tool}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(i);
                    }}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                      activeTab === i
                        ? 'bg-emerald-500 text-[#070b09]'
                        : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3 py-2 text-white">
                  {activeTool === 'website'
                    ? 'Landing page for a boutique law firm specializing in startup IP'
                    : `Create a ${tabs[activeTab].label.toLowerCase()} for my business`}
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800 px-3 py-2 text-zinc-300">
                  Done — preview on the right. Open the app to generate for real.
                </div>
              </div>
              <Link
                href={`/app?tool=${activeTool}`}
                className="mt-4 block rounded-xl bg-emerald-500/15 py-2 text-center text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/25 hover:bg-emerald-500/25"
              >
                Try {tabs[activeTab].label} in app →
              </Link>
            </div>

            <div className="flex min-h-[280px] items-center justify-center bg-zinc-900/30 p-4">
              {device === 'desktop' ? (
                <div
                  className="w-full overflow-hidden rounded-lg border border-white/8 bg-white shadow-lg"
                  style={{ maxWidth: 480, aspectRatio: '16/10' }}
                >
                  <MockLawSite />
                </div>
              ) : (
                <div
                  className="overflow-hidden rounded-[2rem] border-2 border-zinc-700 bg-zinc-900 p-1 shadow-xl"
                  style={{ width: 220, aspectRatio: '390/844' }}
                >
                  <div className="h-full overflow-hidden rounded-[1.75rem] bg-white">
                    <MockLawSite compact />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockLawSite({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white text-left">
      <div className="flex items-center justify-between bg-[#0a1628] px-3 py-2">
        <span
          className={`font-bold tracking-widest text-amber-400 ${compact ? 'text-[8px]' : 'text-[10px]'}`}
        >
          PARK & ASSOCIATES
        </span>
        {!compact && (
          <div className="flex gap-2 text-[8px] text-zinc-400">
            {['Practice', 'Team', 'Contact'].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#1a2f50] text-center ${compact ? 'px-2 py-4' : 'px-4 py-6'}`}
      >
        <p className={`font-bold uppercase tracking-widest text-amber-400 ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
          Startup IP Law
        </p>
        <p className={`mt-1 font-bold leading-tight text-white ${compact ? 'text-[10px]' : 'text-xs'}`}>
          Protecting Your
          <br />
          Most Valuable Assets
        </p>
        <span
          className={`mt-2 rounded-full bg-amber-500 font-semibold text-[#0a1628] ${compact ? 'px-2 py-0.5 text-[7px]' : 'px-3 py-1 text-[9px]'}`}
        >
          Free Consult
        </span>
      </div>
      {!compact && (
        <div className="space-y-1 px-3 py-2">
          <div className="h-1 rounded-full bg-zinc-200" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-100" />
        </div>
      )}
    </div>
  );
}
