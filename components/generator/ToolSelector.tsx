'use client';

import Link from 'next/link';
import type { ToolType } from '@/types';

const tools = [
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'presentation', label: 'Slides', icon: '📊' },
  { id: 'spreadsheet', label: 'Sheet', icon: '📈' },
  { id: 'document', label: 'Doc', icon: '📝' },
  { id: 'pdf', label: 'PDF', icon: '📄' },
] as const;

export default function ToolSelector({
  activeTool,
  onSelect,
}: {
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 bg-[#070b09] px-4 py-3">
      <Link
        href="/"
        className="mr-2 flex items-center gap-2 text-sm font-semibold text-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm">
          🐊
        </span>
        <span className="hidden sm:inline">
          allig8<span className="text-emerald-400">or</span>
        </span>
      </Link>
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id as ToolType)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
              activeTool === tool.id
                ? 'bg-emerald-500 text-[#070b09] shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{tool.icon}</span>
            <span>{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
