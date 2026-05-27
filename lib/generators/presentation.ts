import PptxGenJS from 'pptxgenjs';
import { normalizePresentationData } from '@/lib/normalizePresentation';

interface SlideData {
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
}

export interface PresentationData {
  title: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    font: string;
  };
  slides: SlideData[];
}

export async function generatePPTX(input: PresentationData): Promise<Buffer> {
  const data = normalizePresentationData(input);
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = data.title;

  const { theme } = data;

  for (const slideData of data.slides) {
    const slide = pptx.addSlide();

    slide.background = {
      color: slideData.id === 1 ? theme.primary : theme.background,
    };

    switch (slideData.layout) {
      case 'title':
        slide.addText(slideData.title, {
          x: 0.5,
          y: 2.5,
          w: '90%',
          h: 1.5,
          fontSize: 44,
          bold: true,
          color: theme.background,
          fontFace: theme.font,
          align: 'center',
        });
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5,
            y: 4.2,
            w: '90%',
            h: 0.8,
            fontSize: 20,
            color: theme.secondary,
            fontFace: theme.font,
            align: 'center',
          });
        }
        break;

      case 'bullets':
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.3,
          w: '90%',
          h: 0.9,
          fontSize: 32,
          bold: true,
          color: theme.primary,
          fontFace: theme.font,
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 1.25,
          w: 1.2,
          h: 0.05,
          fill: { color: theme.accent },
        });
        if (slideData.bullets) {
          const bulletItems = slideData.bullets.map((b) => ({
            text: b,
            options: {
              bullet: { type: 'bullet' as const },
              fontSize: 18,
              color: theme.text,
              paraSpaceBefore: 8,
            },
          }));
          slide.addText(bulletItems, {
            x: 0.5,
            y: 1.5,
            w: '90%',
            h: 4.5,
            fontFace: theme.font,
          });
        }
        break;

      case 'two-column':
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.3,
          w: '90%',
          h: 0.9,
          fontSize: 32,
          bold: true,
          color: theme.primary,
          fontFace: theme.font,
        });
        if (slideData.leftContent) {
          slide.addText(slideData.leftContent, {
            x: 0.5,
            y: 1.5,
            w: '44%',
            h: 4.5,
            fontSize: 16,
            color: theme.text,
            fontFace: theme.font,
          });
        }
        if (slideData.rightContent) {
          slide.addShape(pptx.ShapeType.rect, {
            x: '50%',
            y: 1.3,
            w: '46%',
            h: 4.7,
            fill: { color: theme.secondary },
            line: { color: theme.secondary },
          });
          slide.addText(slideData.rightContent, {
            x: '51%',
            y: 1.5,
            w: '44%',
            h: 4.5,
            fontSize: 16,
            color: theme.background,
            fontFace: theme.font,
          });
        }
        break;

      case 'big-stat':
        slide.background = { color: theme.primary };
        slide.addText(slideData.stat || '', {
          x: 0.5,
          y: 1.5,
          w: '90%',
          h: 2.5,
          fontSize: 96,
          bold: true,
          color: theme.background,
          fontFace: theme.font,
          align: 'center',
        });
        slide.addText(slideData.statLabel || '', {
          x: 0.5,
          y: 4.0,
          w: '90%',
          h: 0.8,
          fontSize: 28,
          color: theme.secondary,
          fontFace: theme.font,
          align: 'center',
        });
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.3,
          w: '90%',
          h: 0.7,
          fontSize: 18,
          color: theme.secondary,
          fontFace: theme.font,
          align: 'center',
        });
        break;

      default:
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.3,
          w: '90%',
          h: 0.9,
          fontSize: 32,
          bold: true,
          color: theme.primary,
          fontFace: theme.font,
        });
        if (slideData.bullets) {
          const items = slideData.bullets.map((b) => ({
            text: b,
            options: {
              bullet: true,
              fontSize: 18,
              color: theme.text,
              paraSpaceBefore: 10,
            },
          }));
          slide.addText(items, {
            x: 0.5,
            y: 1.5,
            w: '90%',
            h: 4.5,
            fontFace: theme.font,
          });
        }
    }

    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  }

  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return buffer as Buffer;
}
