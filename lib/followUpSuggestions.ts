import type { ToolType } from '@/types';

const SUGGESTIONS: Record<ToolType, string[]> = {
  website: [
    'Make the hero more authoritative with navy and gold',
    'Add a pricing section with three tiers',
    'Add testimonials from startup founders',
  ],
  presentation: [
    'Add a traction slide with ARR and growth %',
    'Make slide 1 more visual, less text',
    'Add speaker notes with talking points for each slide',
  ],
  spreadsheet: [
    'Add a Summary sheet with key KPIs',
    'Use formulas for totals and growth rates',
    'Add a second sheet for monthly projections',
  ],
  document: [
    'Add an executive summary at the top',
    'Include a timeline table for deliverables',
    'Tighten tone for a corporate client',
  ],
  pdf: [
    'Add line items and payment terms (net-15)',
    'Use A4 layout with page numbers',
    'Add company logo placeholder area at top',
  ],
};

export function followUpSuggestions(tool: ToolType): string[] {
  return SUGGESTIONS[tool] ?? [];
}
