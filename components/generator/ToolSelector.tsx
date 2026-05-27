'use client';

import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import type { ToolType } from '@/types';
import UserMenu from '@/components/auth/UserMenu';
import Logo from '@/components/brand/Logo';

// lucide-react v1.x — all icons confirmed available
// If build fails on an icon, swap: Presentation→LayoutTemplate, Sheet→Table2, FileType→FileCode2
import {
  Globe,
  Presentation,
  Sheet,
  FileText,
  FileType,
} from 'lucide-react';

const tools: { id: ToolType; label: string; Icon: React.ElementType }[] = [
  { id: 'website',      label: 'Website', Icon: Globe },
  { id: 'presentation', label: 'Slides',  Icon: Presentation },
  { id: 'spreadsheet',  label: 'Sheet',   Icon: Sheet },
  { id: 'document',     label: 'Doc',     Icon: FileText },
  { id: 'pdf',          label: 'PDF',     Icon: FileType },
];

export default function ToolSelector({
  activeTool,
  onSelect,
}: {
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 bg-[#070b09] px-4 py-2.5">
      {/* Logo */}
      <Logo href="/" className="mr-2 shrink-0 [&_span:last-child]:hidden sm:[&_span:last-child]:inline" />

      {/* Tool tabs */}
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {tools.map(({ id, label, Icon }) => {
          const active = activeTool === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={[
                'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400',
                active
                  ? 'bg-emerald-500 text-[#070b09] shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              <Icon size={15} strokeWidth={1.75} aria-hidden className="shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <Link
        href="/projects"
        className="hidden items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 transition hover:border-emerald-500/30 hover:text-white sm:flex"
        title="Saved projects"
      >
        <FolderOpen size={13} aria-hidden />
        Projects
      </Link>
      <UserMenu />
    </div>
  );
}
