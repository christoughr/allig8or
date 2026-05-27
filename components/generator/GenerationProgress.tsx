'use client';

import { useEffect, useState } from 'react';
import { stagesForTool } from '@/lib/generationStages';
import type { ToolType } from '@/types';

export default function GenerationProgress({ activeTool }: { activeTool: ToolType }) {
  const stages = stagesForTool(activeTool);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const id = setInterval(() => {
      setIndex((i) => (i < stages.length - 1 ? i + 1 : i));
    }, 4500);
    return () => clearInterval(id);
  }, [activeTool, stages.length]);

  return (
    <div className="rounded-2xl rounded-bl-md bg-zinc-800/80 px-4 py-3">
      <div className="flex gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500/60"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-emerald-400/90">
        {stages[index]?.label ?? 'Working…'}
      </p>
      <ul className="mt-2 space-y-0.5">
        {stages.map((s, i) => (
          <li
            key={s.id}
            className={`text-[11px] ${
              i <= index ? 'text-zinc-500' : 'text-zinc-700'
            }`}
          >
            {i < index ? '✓' : i === index ? '→' : '○'} {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
