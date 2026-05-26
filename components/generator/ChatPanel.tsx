'use client';

import { useState, useRef, useEffect } from 'react';
import type { ToolType } from '@/types';

const placeholders: Record<ToolType, string> = {
  website: 'Landing page for a specialty coffee roaster in Brooklyn…',
  presentation: '10-slide Series A pitch deck for an AI productivity startup…',
  spreadsheet: 'Monthly budget tracker with income, expenses, and savings…',
  document: 'Business proposal for a mobile app development project…',
  pdf: 'Professional invoice template for a freelance designer…',
};

export default function ChatPanel({
  messages,
  isGenerating,
  onSubmit,
  activeTool,
}: {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    fileUrl?: string;
  }>;
  isGenerating: boolean;
  onSubmit: (prompt: string) => void;
  activeTool: ToolType;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex w-full max-w-md flex-col border-r border-white/10 bg-zinc-950 md:w-[400px]">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-4 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl ring-1 ring-emerald-500/20">
              🐊
            </span>
            <p className="font-medium text-white">What are we building?</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {placeholders[activeTool]}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-emerald-600 text-white'
                  : 'rounded-bl-md bg-zinc-800 text-zinc-200'
              }`}
            >
              {msg.content}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  className="mt-2 block text-emerald-300 underline hover:text-emerald-200"
                >
                  Download file
                </a>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-zinc-800 px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-2 w-2 animate-bounce rounded-full bg-emerald-500/60"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[activeTool]}
            rows={3}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-[#070b09] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
