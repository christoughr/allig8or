import type { ToolType } from '@/types';

export type GenerationStage = {
  id: string;
  label: string;
};

const BASE: GenerationStage[] = [
  { id: 'understand', label: 'Understanding your brief' },
  { id: 'draft', label: 'Drafting content' },
  { id: 'format', label: 'Applying layout & formatting' },
  { id: 'finalize', label: 'Finalizing file' },
];

const BY_TOOL: Partial<Record<ToolType, GenerationStage[]>> = {
  website: [
    { id: 'understand', label: 'Understanding your brief' },
    { id: 'structure', label: 'Planning sections & layout' },
    { id: 'design', label: 'Designing visuals & copy' },
    { id: 'finalize', label: 'Building preview' },
  ],
  presentation: [
    { id: 'understand', label: 'Understanding your brief' },
    { id: 'story', label: 'Building slide narrative' },
    { id: 'slides', label: 'Designing slides' },
    { id: 'finalize', label: 'Exporting .pptx' },
  ],
};

export function stagesForTool(tool: ToolType): GenerationStage[] {
  return BY_TOOL[tool] ?? BASE;
}
