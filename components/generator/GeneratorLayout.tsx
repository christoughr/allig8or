'use client';

import { useState } from 'react';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import ToolSelector from './ToolSelector';
import type { ToolType } from '@/types';

export type { ToolType };

type AppState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done' }
  | { status: 'error'; message: string }
  | { status: 'rate_limited'; retryAfter: number };

export default function GeneratorLayout() {
  const [activeTool, setActiveTool] = useState<ToolType>('website');
  const [appState, setAppState] = useState<AppState>({ status: 'idle' });
  const [preview, setPreview] = useState<{
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; fileUrl?: string }>
  >([]);

  const handleGenerate = async (prompt: string) => {
    setAppState({ status: 'generating' });
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);

    try {
      const response = await fetch(`/api/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') ?? '60', 10);
        setAppState({ status: 'rate_limited', retryAfter });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Rate limit reached. Free plan allows 10 generations/hour. Try again in ${retryAfter}s, or upgrade to Pro for 200/day.`,
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      if (activeTool === 'website' || activeTool === 'pdf') {
        setPreview({
          type: 'html',
          content: result.html,
          fileUrl: result.fileUrl,
          fileName: result.fileName,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              activeTool === 'website'
                ? 'Done — preview on the right. Tell me what to change.'
                : 'PDF-ready HTML generated. Preview on the right or download.',
            fileUrl: result.fileUrl,
          },
        ]);
      } else {
        setPreview({
          type: 'file',
          fileUrl: result.fileUrl,
          fileName: result.fileName,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Your ${activeTool} is ready.`,
            fileUrl: result.fileUrl,
          },
        ]);
      }

      setAppState({ status: 'done' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setAppState({ status: 'error', message });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${message} Please try again.` },
      ]);
    }
  };

  const isGenerating = appState.status === 'generating';

  return (
    <div className="flex h-[100dvh] flex-col bg-[#0a0f0d]">
      <ToolSelector
        activeTool={activeTool}
        onSelect={(tool) => {
          setActiveTool(tool);
          setPreview(null);
          setMessages([]);
          setAppState({ status: 'idle' });
        }}
      />
      {/* Mobile: stack vertically; desktop: side by side */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <ChatPanel
          messages={messages}
          isGenerating={isGenerating}
          onSubmit={handleGenerate}
          activeTool={activeTool}
          appState={appState}
        />
        <PreviewPanel preview={preview} activeTool={activeTool} />
      </div>
    </div>
  );
}
