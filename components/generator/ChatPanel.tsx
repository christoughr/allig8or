'use client';

import { useState, useRef, useEffect } from 'react';
import type { ToolType } from '@/types';

const placeholders: Record<ToolType, string> = {
  website:
    'Create a landing page for a Korean BBQ restaurant in Seoul...',
  presentation:
    'Make a 10-slide pitch deck for an AI startup raising $5M Series A...',
  spreadsheet:
    'Build a monthly budget tracker with income, expenses, and savings goals...',
  document:
    'Write a business proposal for a mobile app development project...',
  pdf: 'Create a professional invoice template for a freelance designer...',
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
    <div className="flex w-[420px] flex-col border-r border-gray-200 bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-gray-400">
            <div className="text-4xl">🐊</div>
            <p className="font-medium text-gray-600">What do you want to create?</p>
            <p className="text-sm">{placeholders[activeTool]}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-blue-600 text-white'
                  : 'rounded-bl-sm bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  className="mt-2 block text-blue-400 underline hover:text-blue-300"
                >
                  ⬇️ Download file
                </a>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[activeTool]}
            rows={3}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating || !input.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? '...' : '↑'}
          </button>
        </div>
      </div>
    </div>
  );
}
