'use client';

import type { ToolType } from '@/types';

export default function PreviewPanel({
  preview,
  activeTool,
}: {
  preview: {
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null;
  activeTool: ToolType;
}) {
  if (!preview) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="space-y-3 text-center text-gray-400">
          <div className="text-6xl opacity-20">
            {activeTool === 'website'
              ? '🌐'
              : activeTool === 'presentation'
                ? '📊'
                : activeTool === 'spreadsheet'
                  ? '📈'
                  : '📝'}
          </div>
          <p className="text-sm">Your {activeTool} will appear here</p>
        </div>
      </div>
    );
  }

  if (preview.type === 'html' && preview.content) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-xs text-gray-500">Preview</span>
          {preview.fileUrl && (
            <a
              href={preview.fileUrl}
              download={preview.fileName}
              className="ml-auto text-xs text-blue-600 hover:underline"
            >
              Download HTML
            </a>
          )}
        </div>
        <iframe
          srcDoc={preview.content}
          className="w-full flex-1 border-none"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  if (preview.type === 'file' && preview.fileUrl) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="text-6xl">
            {activeTool === 'presentation'
              ? '📊'
              : activeTool === 'spreadsheet'
                ? '📈'
                : '📝'}
          </div>
          <p className="font-medium text-gray-800">{preview.fileName}</p>
          <a
            href={preview.fileUrl}
            download={preview.fileName}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            ⬇️ Download {activeTool}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
