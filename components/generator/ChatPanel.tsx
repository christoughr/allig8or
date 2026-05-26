'use client';

import { useState, useRef, useEffect } from 'react';
import type { ToolType } from '@/types';

const placeholders: Record<ToolType, string> = {
  website: 'Landing page for a specialty coffee roaster in Brooklyn…',
  presentation: '10-slide Series A pitch deck for an AI productivity startup…',
  spreadsheet: 'Monthly budget tracker with income, expenses, and savings rate…',
  document: 'Business proposal for a mobile app development project…',
  pdf: 'Professional invoice template for a freelance UX designer…',
};

const emptyHints: Record<ToolType, { title: string; examples: string[] }> = {
  website: {
    title: 'Build a website',
    examples: [
      'Portfolio for a product designer',
      'Landing page for a SaaS waitlist',
      'Restaurant menu + booking page',
    ],
  },
  presentation: {
    title: 'Create a deck',
    examples: [
      'Series A pitch deck, 10 slides',
      'Q3 company all-hands update',
      'Product launch announcement',
    ],
  },
  spreadsheet: {
    title: 'Build a spreadsheet',
    examples: [
      'Monthly personal budget tracker',
      'SaaS revenue model with projections',
      'Employee expense report template',
    ],
  },
  document: {
    title: 'Write a document',
    examples: [
      'App development proposal with timeline',
      'Employee onboarding handbook',
      'NDA for a freelance project',
    ],
  },
  pdf: {
    title: 'Create a PDF',
    examples: [
      'Freelancer invoice template',
      'One-page product brief',
      'Client meeting summary',
    ],
  },
};

type AppState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done' }
  | { status: 'error'; message: string }
  | { status: 'rate_limited'; retryAfter: number };

export default function ChatPanel({
  messages,
  isGenerating,
  onSubmit,
  activeTool,
  appState,
}: {
  messages: Array<{ role: 'user' | 'assistant'; content: string; fileUrl?: string }>;
  isGenerating: boolean;
  onSubmit: (prompt: string) => void;
  activeTool: ToolType;
  appState: AppState;
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
    <div className="flex w-full flex-col border-b border-white/8 bg-zinc-950 md:w-[400px] md:border-b-0 md:border-r md:max-h-none max-h-[45vh] md:max-h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center px-2 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl ring-1 ring-emerald-500/20">
              🐊
            </span>
            <p className="text-sm font-semibold text-white">{hints.title}</p>
            <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[260px]">
              {hints.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => fillExample(ex)}
                  className="rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-left text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-zinc-200"
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
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-emerald-600 text-white'
                  : 'rounded-bl-md bg-zinc-800/80 text-zinc-200'
              }`}
            >
              {msg.content}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300 underline-offset-2 hover:underline"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 2v8M4.5 7l3.5 3.5L11.5 7M3 13h10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download file
                </a>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-zinc-800/80 px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500/60"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {appState.status === 'rate_limited' && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-300">
            Rate limit reached.{' '}
            <a href="/api/checkout?plan=pro" className="font-semibold underline underline-offset-2 hover:text-amber-200">
              Upgrade to Pro
            </a>{' '}
            for 200 generations/day.
          </div>
        )}

        {appState.status === 'error' && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
            {appState.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/8 p-3">
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
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M8 13V3M3 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-700">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
