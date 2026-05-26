'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import ToolSelector from './ToolSelector';
import type { ToolType } from '@/types';
import { parseApiJson } from '@/lib/parseApiResponse';

const GENERATE_TIMEOUT_MS = 120_000;
const VALID_TOOLS: ToolType[] = [
  'website',
  'presentation',
  'spreadsheet',
  'document',
  'pdf',
];

export type { ToolType };

type AppState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done' }
  | { status: 'error'; message: string }
  | { status: 'rate_limited'; retryAfter: number };

export default function GeneratorLayout({
  initialTool,
}: {
  initialTool?: ToolType;
}) {
  const searchParams = useSearchParams();
  const [activeTool, setActiveTool] = useState<ToolType>(
    initialTool && VALID_TOOLS.includes(initialTool) ? initialTool : 'website'
  );
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

  useEffect(() => {
    const t = searchParams.get('tool') as ToolType | null;
    if (t && VALID_TOOLS.includes(t)) {
      setActiveTool(t);
    }
  }, [searchParams]);

  const resetSession = () => {
    setPreview(null);
    setMessages([]);
    setAppState({ status: 'idle' });
  };

  const handleGenerate = async (prompt: string) => {
    setAppState({ status: 'generating' });
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATE_TIMEOUT_MS);

    try {
      const response = await fetch(`/api/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      const result = await parseApiJson<{
        html?: string;
        fileUrl?: string;
        fileName?: string;
        error?: string;
      }>(response);

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') ?? '60', 10);
        setAppState({ status: 'rate_limited', retryAfter });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Limit reached. Try again in ${retryAfter}s, sign in for daily limits, or upgrade to Pro (200/day).`,
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      if (activeTool === 'website' || activeTool === 'pdf') {
        if (!result.html?.trim()) {
          throw new Error('No preview content returned. Please try again.');
        }
        const html = result.html;
        const fileUrl =
          result.fileUrl ??
          `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        setPreview({
          type: 'html',
          content: html,
          fileUrl,
          fileName: result.fileName ?? (activeTool === 'pdf' ? 'document.html' : 'index.html'),
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              activeTool === 'website'
                ? 'Done — preview on the right. Tell me what to change.'
                : 'PDF-ready HTML generated. Preview on the right or download.',
            fileUrl,
          },
        ]);
      } else {
        if (!result.fileUrl) {
          throw new Error('No file returned. Please try again.');
        }
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
      const message =
        err instanceof Error && err.name === 'AbortError'
          ? 'Request timed out after 2 minutes. Try a shorter prompt.'
          : err instanceof Error
            ? err.message
            : 'Something went wrong.';
      setAppState({ status: 'error', message });
      setMessages((prev) => [
        ...prev, { role: 'assistant', content: `Error: ${message} Please try again.` },
      ]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const isGenerating = appState.status === 'generating';

  return (
    <div className="flex h-[100dvh] flex-col bg-[#0a0f0d]">
      <ToolSelector
        activeTool={activeTool}
        onSelect={(tool) => {
          setActiveTool(tool);
          resetSession();
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <ChatPanel
          messages={messages}
          isGenerating={isGenerating}
          onSubmit={handleGenerate}
          activeTool={activeTool}
          appState={appState}
        />
        <PreviewPanel
          preview={preview}
          activeTool={activeTool}
          onGenerateAnother={resetSession}
        />
      </div>
    </div>
  );
}
