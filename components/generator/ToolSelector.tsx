'use client';

import type { ToolType } from '@/types';

const tools = [
  {
    id: 'website',
    label: 'Website',
    icon: '🌐',
    desc: 'Landing pages, portfolios, apps',
  },
  {
    id: 'presentation',
    label: 'Slides',
    icon: '📊',
    desc: 'PowerPoint, pitch decks',
  },
  {
    id: 'spreadsheet',
    label: 'Spreadsheet',
    icon: '📈',
    desc: 'Excel, financial models',
  },
  {
    id: 'document',
    label: 'Document',
    icon: '📝',
    desc: 'Word docs, reports',
  },
  { id: 'pdf', label: 'PDF', icon: '📄', desc: 'Proposals, invoices' },
] as const;

export default function ToolSelector({
  activeTool,
  onSelect,
}: {
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2">
      <span className="mr-2 whitespace-nowrap text-sm font-semibold text-gray-500">
        Create:
      </span>
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => onSelect(tool.id as ToolType)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeTool === tool.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{tool.icon}</span>
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
}
