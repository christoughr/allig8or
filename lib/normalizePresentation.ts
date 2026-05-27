/** Coerce Claude JSON fields to plain strings for pptxgenjs. */
export function coerceText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value.map(coerceText).filter(Boolean).join('\n');
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if ('text' in o) return coerceText(o.text);
    if ('content' in o) return coerceText(o.content);
    if ('value' in o) return coerceText(o.value);
  }
  return String(value);
}

export function normalizeBullets(bullets: unknown): string[] {
  if (bullets == null) return [];
  if (typeof bullets === 'string') return bullets.trim() ? [bullets] : [];
  if (!Array.isArray(bullets)) return [coerceText(bullets)].filter(Boolean);

  return bullets
    .flatMap((item) => {
      if (typeof item === 'string') return item.trim() ? [item] : [];
      return [coerceText(item)].filter(Boolean);
    });
}

export function normalizePresentationData(data: {
  title?: string;
  theme?: Partial<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    font: string;
  }>;
  slides?: Array<Record<string, unknown> | {
    id?: number;
    layout?: string;
    title?: string;
    subtitle?: string;
    bullets?: unknown;
    leftContent?: unknown;
    rightContent?: unknown;
    stat?: unknown;
    statLabel?: unknown;
    notes?: unknown;
  }>;
}): {
  title: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    font: string;
  };
  slides: Array<{
    id: number;
    layout: string;
    title: string;
    subtitle?: string;
    bullets?: string[];
    leftContent?: string;
    rightContent?: string;
    stat?: string;
    statLabel?: string;
    notes?: string;
  }>;
} {
  const theme = {
    primary: data.theme?.primary ?? '1E3A5F',
    secondary: data.theme?.secondary ?? '64748B',
    accent: data.theme?.accent ?? '10B981',
    background: data.theme?.background ?? 'FFFFFF',
    text: data.theme?.text ?? '1E293B',
    font: data.theme?.font ?? 'Calibri',
  };

  const slides = (data.slides ?? []).map((raw, index) => {
    const slide = raw as Record<string, unknown>;
    return {
      id: typeof slide.id === 'number' ? slide.id : index + 1,
      layout: typeof slide.layout === 'string' ? slide.layout : 'bullets',
      title: coerceText(slide.title) || `Slide ${index + 1}`,
      subtitle: slide.subtitle != null ? coerceText(slide.subtitle) : undefined,
      bullets: normalizeBullets(slide.bullets),
      leftContent: slide.leftContent != null ? coerceText(slide.leftContent) : undefined,
      rightContent: slide.rightContent != null ? coerceText(slide.rightContent) : undefined,
      stat: slide.stat != null ? coerceText(slide.stat) : undefined,
      statLabel: slide.statLabel != null ? coerceText(slide.statLabel) : undefined,
      notes: slide.notes != null ? coerceText(slide.notes) : undefined,
    };
  });

  return {
    title: coerceText(data.title) || 'Presentation',
    theme,
    slides,
  };
}
