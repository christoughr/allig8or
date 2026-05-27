'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Download, Lightbulb } from 'lucide-react';
import GenerationProgress from './GenerationProgress';
import {
  Globe,
  Presentation,
  Sheet,
  FileText,
  FileType,
} from 'lucide-react';
import type { ToolType } from '@/types';

const placeholders: Record<ToolType, string> = {
  website:      'Landing page for a specialty coffee roaster in Brooklyn…',
  presentation: '10-slide Series A pitch deck for a climate tech startup…',
  spreadsheet:  'Monthly budget tracker with income, expenses, and savings rate…',
  document:     'Business proposal for a mobile app development project…',
  pdf:          'Professional invoice for a freelance UX designer, net-15…',
};

const emptyHints: Record<ToolType, { title: string; Icon: React.ElementType; examples: string[] }> = {
  website: {
    title: 'Build a website',
    Icon: Globe,
    examples: [
      'Portfolio for a product designer',
      'SaaS landing page with waitlist',
      'Restaurant menu + online booking',
    ],
  },
  presentation: {
    title: 'Create a deck',
    Icon: Presentation,
    examples: [
      'Series A pitch, 10 slides',
      'Q3 company all-hands update',
      'Product launch announcement',
    ],
  },
  spreadsheet: {
    title: 'Build a spreadsheet',
    Icon: Sheet,
    examples: [
      'Monthly personal budget tracker',
      'SaaS revenue model with projections',
      'Employee expense report',
    ],
  },
  document: {
    title: 'Write a document',
    Icon: FileText,
    examples: [
      'App development proposal + timeline',
      'Employee onboarding handbook',
      'NDA for a freelance project',
    ],
  },
  pdf: {
    title: 'Create a PDF',
    Icon: FileType,
    examples: [
      'Freelancer invoice, net-15',
      'One-page product brief',
      'Client meeting summary',
    ],
  },
};

type AppState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done' }
  | { status: 'error'; message: string; hint?: string }
  | { status: 'rate_limited'; retryAfter: number };

export default function ChatPanel({
  messages,
  isGenerating,
  onSubmit,
  activeTool,
  appState,
  followUpSuggestions = [],
  onPickSuggestion,
}: {
  messages: Array<{ role: 'user' | 'assistant'; content: string; fileUrl?: string }>;
  isGenerating: boolean;
  onSubmit: (prompt: string) => void;
  activeTool: ToolType;
  appState: AppState;
  followUpSuggestions?: string[];
  onPickSuggestion?: (text: string) => void;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hints = emptyHints[activeTool];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isGenerating) return;
    onSubmit(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fillExample = (example: string) => {
    setInput(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex w-full min-h-0 flex-col border-b border-white/8 bg-zinc-950 md:w-[400px] md:border-b-0 md:border-r max-h-[45vh] md:max-h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center px-2 text-center">
            <span
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl ring-1 ring-emerald-500/20"
              aria-hidden
            >
              🐊
            </span>
            <p className="text-sm font-semibold text-white">{hints.title}</p>
            <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[260px]">
              {hints.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => fillExample(ex)}
                  className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-zinc-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={[
                'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'rounded-br-md bg-emerald-600 text-white'
                  : 'rounded-bl-md bg-zinc-800/80 text-zinc-200',
              ].join(' ')}
            >
              {msg.content}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300 underline-offset-2 hover:underline"
                >
                  <Download size={13} strokeWidth={1.5} aria-hidden />
                  Download file
                </a>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <GenerationProgress activeTool={activeTool} />
          </div>
        )}

        {followUpSuggestions.length > 0 && !isGenerating && (
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Lightbulb size={12} aria-hidden />
              Try next for a stronger deliverable
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {followUpSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onPickSuggestion?.(s)}
                  className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {appState.status === 'rate_limited' && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-300">
            Generation limit reached.{' '}
            <a href="/login?next=/app" className="font-semibold underline underline-offset-2 hover:text-amber-200">
              Sign in
            </a>{' '}
            for daily limits, or{' '}
            <a
              href="/api/checkout?plan=pro"
              className="font-semibold underline underline-offset-2 hover:text-amber-200"
            >
              upgrade to Pro
            </a>{' '}
            (200/day).
          </div>
        )}

        {appState.status === 'error' && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
            <p>{appState.message}</p>
            {appState.hint && (
              <p className="mt-2 text-xs text-red-200/80">{appState.hint}</p>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/8 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[activeTool]}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-white/8 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating || !input.trim()}
            aria-label="Generate"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-[#070b09] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowUp size={18} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-zinc-700">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
