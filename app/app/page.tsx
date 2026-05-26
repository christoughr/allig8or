import { Suspense } from 'react';
import GeneratorLayout from '@/components/generator/GeneratorLayout';
import type { ToolType } from '@/types';

function AppFallback() {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#0a0f0d] text-sm text-zinc-500">
      Loading workspace…
    </div>
  );
}

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const params = await searchParams;
  const valid: ToolType[] = [
    'website',
    'presentation',
    'spreadsheet',
    'document',
    'pdf',
  ];
  const tool = params.tool as ToolType | undefined;
  const initialTool = tool && valid.includes(tool) ? tool : undefined;

  return (
    <Suspense fallback={<AppFallback />}>
      <GeneratorLayout initialTool={initialTool} />
    </Suspense>
  );
}
