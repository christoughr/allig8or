'use client';

import { useState } from 'react';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import ToolSelector from './ToolSelector';
import type { ToolType } from '@/types';

export type { ToolType };

export default function GeneratorLayout() {
  const [activeTool, setActiveTool] = useState<ToolType>('website');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<{
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      content: string;
      fileUrl?: string;
    }>
  >([]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);

    const userMessage = { role: 'user' as const, content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`/api/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const result = await response.json();

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
                ? '✅ Website generated! Preview on the right. Tell me what to change.'
                : '✅ PDF-ready document generated! Preview on the right or download the HTML.',
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
            content: `✅ Your ${activeTool} is ready! Click download to get the file.`,
            fileUrl: result.fileUrl,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <ToolSelector activeTool={activeTool} onSelect={setActiveTool} />
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel
          messages={messages}
          isGenerating={isGenerating}
          onSubmit={handleGenerate}
          activeTool={activeTool}
        />
        <PreviewPanel preview={preview} activeTool={activeTool} />
      </div>
    </div>
  );
}
