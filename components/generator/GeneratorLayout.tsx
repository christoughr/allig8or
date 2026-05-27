'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import ToolSelector from './ToolSelector';
import type { ToolType } from '@/types';
import { parseApiJson } from '@/lib/parseApiResponse';
import { followUpSuggestions } from '@/lib/followUpSuggestions';
import { sanitizePreviewHtml } from '@/lib/sanitizePreviewHtml';

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
  | { status: 'error'; message: string; hint?: string }
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
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const t = searchParams.get('tool') as ToolType | null;
    if (t && VALID_TOOLS.includes(t)) {
      setActiveTool(t);
    }
  }, [searchParams]);

  const applyProject = useCallback(
    (project: {
      type: ToolType;
      prompt: string;
      file_url?: string;
      html_content?: string;
      messages: Array<{ role: string; content: string; fileUrl?: string }>;
      id: string;
    }) => {
      setActiveTool(project.type);
      setSuggestions([]);
      const msgs = (project.messages ?? []).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        fileUrl: m.fileUrl,
      }));
      setMessages(
        msgs.length
          ? msgs
          : [{ role: 'user' as const, content: project.prompt }]
      );

      if (
        (project.type === 'website' || project.type === 'pdf') &&
        project.html_content
      ) {
        const html = sanitizePreviewHtml(project.html_content);
        const fileUrl =
          project.file_url ??
          `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        setPreview({
          type: 'html',
          content: html,
          fileUrl,
          fileName: project.type === 'pdf' ? 'document.html' : 'index.html',
        });
      } else if (project.file_url) {
        setPreview({
          type: 'file',
          fileUrl: project.file_url,
          fileName: undefined,
        });
      }
      setAppState({ status: 'done' });
    },
    []
  );

  useEffect(() => {
    const id = searchParams.get('project');
    if (!id) return;

    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.project) applyProject(data.project);
      })
      .catch(() => {
        setAppState({
          status: 'error',
          message: 'Could not load project. Sign in or try again.',
        });
      });
  }, [searchParams, applyProject]);

  const resetSession = () => {
    setPreview(null);
    setMessages([]);
    setSuggestions([]);
    setAppState({ status: 'idle' });
  };

  const handleGenerate = async (prompt: string) => {
    setAppState({ status: 'generating' });
    setSuggestions([]);
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
        projectId?: string;
        error?: string;
        hint?: string;
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
        setAppState({
          status: 'error',
          message: result.error || 'Generation failed',
          hint: result.hint,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `${result.error ?? 'Generation failed'}${result.hint ? ` — ${result.hint}` : ''}`,
          },
        ]);
        return;
      }

      if (activeTool === 'website' || activeTool === 'pdf') {
        if (!result.html?.trim()) {
          throw new Error('No preview content returned. Please try again.');
        }
        const html = sanitizePreviewHtml(result.html);
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
                : 'PDF-ready HTML generated. Preview on the right or open/download.',
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
            content: `Your ${activeTool} is ready. Open in browser or download.`,
            fileUrl: result.fileUrl,
          },
        ]);
      }

      setSuggestions(followUpSuggestions(activeTool));
      setAppState({ status: 'done' });
    } catch (err) {
      const message =
        err instanceof Error && err.name === 'AbortError'
          ? 'Request timed out after 2 minutes. Try a shorter prompt.'
          : err instanceof Error
            ? err.message
            : 'Something went wrong.';
      setAppState({
        status: 'error',
        message,
        hint: 'Try fewer slides/rows or name the sections you need.',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${message} Please try again.` },
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
          followUpSuggestions={suggestions}
          onPickSuggestion={(s) => handleGenerate(s)}
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
