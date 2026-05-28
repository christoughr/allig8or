# allig8or.com — AI Office Suite
## Cursor Master Build Prompt

> Copy this entire document into Cursor's AI chat to start building.

---

## 🎯 What We're Building

**allig8or.com** — An AI-powered office suite. Users type a prompt, and AI instantly generates:
- 📊 PowerPoint / Presentations (PPTX download)
- 📈 Excel / Spreadsheets (XLSX download)
- 📝 Word Documents / Reports (DOCX download)
- 🌐 Websites / Landing Pages (live preview + deploy)
- 📄 PDFs

Think: "AI replaces Microsoft 365 + Google Workspace. Prompt in → file out."

---

## 🏗️ Tech Stack

```
Frontend:     Next.js 14 (App Router)
Styling:      Tailwind CSS + shadcn/ui
AI:           Claude API (claude-sonnet-4-20250514)
Auth:         Supabase Auth (Google OAuth)
DB:           Supabase (PostgreSQL)
File Gen:     
  - PPTX: pptxgenjs (npm)
  - XLSX: xlsx / exceljs (npm)
  - DOCX: docx (npm)
  - PDF: jspdf or puppeteer
  - Website: Claude generates HTML → iframe preview
Storage:      Supabase Storage (for generated files)
Deploy:       Vercel
Payments:     Lemon Squeezy
Domain:       allig8or.com
```

---

## 📁 Project Structure

```
allig8or/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Main dashboard
│   │   └── projects/[id]/page.tsx    # Project view
│   ├── api/
│   │   ├── generate/
│   │   │   ├── presentation/route.ts
│   │   │   ├── spreadsheet/route.ts
│   │   │   ├── document/route.ts
│   │   │   ├── website/route.ts
│   │   │   └── pdf/route.ts
│   │   └── projects/route.ts
│   ├── layout.tsx
│   └── page.tsx                      # Landing page
├── components/
│   ├── ui/                           # shadcn components
│   ├── generator/
│   │   ├── GeneratorLayout.tsx       # Left chat + right preview
│   │   ├── ChatPanel.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── ToolSelector.tsx          # PPT / Excel / Doc / Website tabs
│   │   └── DownloadButton.tsx
│   ├── dashboard/
│   │   ├── ProjectCard.tsx
│   │   └── RecentFiles.tsx
│   └── landing/
│       ├── Hero.tsx
│       ├── DemoSection.tsx
│       └── Pricing.tsx
├── lib/
│   ├── claude.ts                     # Claude API client
│   ├── generators/
│   │   ├── presentation.ts           # PPTX generation logic
│   │   ├── spreadsheet.ts            # XLSX generation logic
│   │   ├── document.ts               # DOCX generation logic
│   │   └── website.ts                # HTML generation logic
│   ├── supabase.ts
│   └── lemonsqueezy.ts
├── types/
│   └── index.ts
└── package.json
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Users (handled by Supabase Auth)

-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('presentation', 'spreadsheet', 'document', 'website', 'pdf')),
  prompt text not null,
  file_url text,
  html_content text,
  messages jsonb default '[]',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table projects enable row level security;
create policy "Users can only see their own projects"
  on projects for all
  using (auth.uid() = user_id);

-- Usage tracking
create table usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  tokens_used integer,
  created_at timestamp with time zone default now()
);
```

---

## 🔌 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_claude_api_key
NEXT_PUBLIC_APP_URL=https://allig8or.com
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_signing_secret
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=your-store-slug
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER=variant_uuid
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=variant_uuid
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_TEAM=variant_uuid
```

---

## 🤖 Claude API Integration

### `/lib/claude.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type GenerationType = 'presentation' | 'spreadsheet' | 'document' | 'website' | 'pdf';

export async function generateWithClaude(
  prompt: string,
  type: GenerationType,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const systemPrompts = {
    presentation: `You are an expert presentation designer. Generate a complete JSON structure for a PowerPoint presentation.
    
    RULES:
    - Return ONLY valid JSON, no markdown, no explanation
    - Always include 6-12 slides unless specified
    - Each slide must have: id, layout, title, content, design (colors, fonts)
    - Design should be bold and professional, never boring
    - Vary layouts: title slide, bullet points, two-column, big stat, image+text, timeline
    
    JSON Structure:
    {
      "title": "Presentation Title",
      "theme": {
        "primary": "#hexcolor",
        "secondary": "#hexcolor",
        "accent": "#hexcolor",
        "background": "#hexcolor",
        "text": "#hexcolor",
        "font": "Calibri"
      },
      "slides": [
        {
          "id": 1,
          "layout": "title" | "bullets" | "two-column" | "big-stat" | "timeline" | "image-text",
          "title": "Slide Title",
          "subtitle": "optional subtitle",
          "bullets": ["point 1", "point 2"],
          "leftContent": "for two-column",
          "rightContent": "for two-column",
          "stat": "95%",
          "statLabel": "Customer Satisfaction",
          "notes": "speaker notes"
        }
      ]
    }`,

    spreadsheet: `You are an expert Excel/spreadsheet creator. Generate a complete JSON structure for a spreadsheet.
    
    RULES:
    - Return ONLY valid JSON, no markdown, no explanation
    - Include proper formulas where appropriate (use Excel formula syntax)
    - Include formatting: bold headers, colored cells, borders
    - Multiple sheets if needed
    
    JSON Structure:
    {
      "title": "Spreadsheet Title",
      "sheets": [
        {
          "name": "Sheet Name",
          "headers": ["Col A", "Col B", "Col C"],
          "rows": [
            ["data", "data", "=SUM(A2:A10)"]
          ],
          "formatting": {
            "headerRow": { "bold": true, "bgColor": "4472C4", "fontColor": "FFFFFF" },
            "alternateRows": true,
            "currency": ["B", "C"]
          }
        }
      ]
    }`,

    document: `You are an expert document writer. Generate a complete JSON structure for a Word document.
    
    RULES:
    - Return ONLY valid JSON, no markdown, no explanation
    - Include proper document structure: title, sections, paragraphs
    - Professional formatting
    
    JSON Structure:
    {
      "title": "Document Title",
      "author": "allig8or AI",
      "sections": [
        {
          "heading": "Section Title",
          "level": 1,
          "paragraphs": ["paragraph text"],
          "bullets": ["item 1", "item 2"],
          "table": {
            "headers": ["Col1", "Col2"],
            "rows": [["data", "data"]]
          }
        }
      ]
    }`,

    website: `You are an expert web developer. Generate a complete, beautiful, production-ready HTML website.
    
    RULES:
    - Return ONLY the complete HTML file, nothing else
    - Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
    - Make it fully responsive (mobile-first)
    - Include smooth animations and hover effects
    - Use modern design: clean, professional, impressive
    - Include all sections the user asks for
    - Use real placeholder content (not "Lorem ipsum")
    - Add Font Awesome icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    - Make it look like it was designed by a senior designer
    - Add subtle CSS animations for hero section
    - NEVER use placeholder images — use gradient backgrounds or CSS shapes instead`,

    pdf: `You are an expert document creator. Generate a complete HTML document that will be converted to PDF.
    
    RULES:
    - Return ONLY the complete HTML file
    - Use inline CSS only (no external stylesheets)
    - Design for A4 paper size (210mm × 297mm)
    - Professional typography and layout
    - Include page breaks where appropriate: <div style="page-break-after: always;"></div>`
  };

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompts[type],
    messages: [
      ...conversationHistory,
      { role: 'user', content: prompt }
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

---

## 📊 File Generators

### `/lib/generators/presentation.ts`

```typescript
import pptxgen from 'pptxgenjs';

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

interface PresentationData {
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

export async function generatePPTX(data: PresentationData): Promise<Buffer> {
  const pptx = new pptxgen();
  
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = data.title;

  const { theme } = data;

  for (const slideData of data.slides) {
    const slide = pptx.addSlide();
    
    // Background
    slide.background = { color: slideData.id === 1 ? theme.primary : theme.background };

    switch (slideData.layout) {
      case 'title':
        // Title slide
        slide.addText(slideData.title, {
          x: 0.5, y: 2.5, w: '90%', h: 1.5,
          fontSize: 44, bold: true,
          color: theme.background,
          fontFace: theme.font,
          align: 'center'
        });
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5, y: 4.2, w: '90%', h: 0.8,
            fontSize: 20, color: theme.secondary,
            fontFace: theme.font, align: 'center'
          });
        }
        break;

      case 'bullets':
        // Title + bullets
        slide.addText(slideData.title, {
          x: 0.5, y: 0.3, w: '90%', h: 0.9,
          fontSize: 32, bold: true,
          color: theme.primary, fontFace: theme.font
        });
        // Accent line
        slide.addShape(pptxgen.ShapeType.rect, {
          x: 0.5, y: 1.25, w: 1.2, h: 0.05,
          fill: { color: theme.accent }
        });
        if (slideData.bullets) {
          const bulletItems = slideData.bullets.map(b => ({
            text: b,
            options: { bullet: { type: 'bullet' }, fontSize: 18, color: theme.text, paraSpaceBefore: 8 }
          }));
          slide.addText(bulletItems, {
            x: 0.5, y: 1.5, w: '90%', h: 4.5, fontFace: theme.font
          });
        }
        break;

      case 'two-column':
        slide.addText(slideData.title, {
          x: 0.5, y: 0.3, w: '90%', h: 0.9,
          fontSize: 32, bold: true,
          color: theme.primary, fontFace: theme.font
        });
        if (slideData.leftContent) {
          slide.addText(slideData.leftContent, {
            x: 0.5, y: 1.5, w: '44%', h: 4.5,
            fontSize: 16, color: theme.text, fontFace: theme.font
          });
        }
        if (slideData.rightContent) {
          slide.addShape(pptxgen.ShapeType.rect, {
            x: '50%', y: 1.3, w: '46%', h: 4.7,
            fill: { color: theme.secondary }, line: { color: theme.secondary }
          });
          slide.addText(slideData.rightContent, {
            x: '51%', y: 1.5, w: '44%', h: 4.5,
            fontSize: 16, color: theme.background, fontFace: theme.font
          });
        }
        break;

      case 'big-stat':
        slide.background = { color: theme.primary };
        slide.addText(slideData.stat || '', {
          x: 0.5, y: 1.5, w: '90%', h: 2.5,
          fontSize: 96, bold: true,
          color: theme.background, fontFace: theme.font, align: 'center'
        });
        slide.addText(slideData.statLabel || '', {
          x: 0.5, y: 4.0, w: '90%', h: 0.8,
          fontSize: 28, color: theme.secondary,
          fontFace: theme.font, align: 'center'
        });
        slide.addText(slideData.title, {
          x: 0.5, y: 0.3, w: '90%', h: 0.7,
          fontSize: 18, color: theme.secondary,
          fontFace: theme.font, align: 'center'
        });
        break;

      default:
        // Generic slide
        slide.addText(slideData.title, {
          x: 0.5, y: 0.3, w: '90%', h: 0.9,
          fontSize: 32, bold: true,
          color: theme.primary, fontFace: theme.font
        });
        if (slideData.bullets) {
          const items = slideData.bullets.map(b => ({
            text: b,
            options: { bullet: true, fontSize: 18, color: theme.text, paraSpaceBefore: 10 }
          }));
          slide.addText(items, {
            x: 0.5, y: 1.5, w: '90%', h: 4.5, fontFace: theme.font
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
```

### `/lib/generators/spreadsheet.ts`

```typescript
import ExcelJS from 'exceljs';

export async function generateXLSX(data: any): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'allig8or AI';
  workbook.created = new Date();

  for (const sheetData of data.sheets) {
    const sheet = workbook.addWorksheet(sheetData.name);

    // Headers
    const headerRow = sheet.addRow(sheetData.headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: sheetData.formatting?.headerRow?.fontColor || 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern', pattern: 'solid',
        fgColor: { argb: sheetData.formatting?.headerRow?.bgColor || 'FF4472C4' }
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 24;

    // Data rows
    sheetData.rows.forEach((rowData: any[], rowIndex: number) => {
      const row = sheet.addRow(rowData);
      if (sheetData.formatting?.alternateRows && rowIndex % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
        });
      }
      row.height = 20;
    });

    // Column widths
    sheet.columns.forEach((col) => { col.width = 18; });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
```

### `/lib/generators/document.ts`

```typescript
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, AlignmentType } from 'docx';

export async function generateDOCX(data: any): Promise<Buffer> {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  for (const section of data.sections) {
    // Section heading
    children.push(
      new Paragraph({
        text: section.heading,
        heading: section.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 }
      })
    );

    // Paragraphs
    if (section.paragraphs) {
      for (const para of section.paragraphs) {
        children.push(new Paragraph({
          children: [new TextRun({ text: para, size: 24 })],
          spacing: { after: 200 }
        }));
      }
    }

    // Bullet points
    if (section.bullets) {
      for (const bullet of section.bullets) {
        children.push(new Paragraph({
          text: bullet,
          bullet: { level: 0 },
          spacing: { after: 100 }
        }));
      }
    }

    // Table
    if (section.table) {
      const tableRows = [
        new TableRow({
          children: section.table.headers.map((h: string) =>
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 22 })]
              })],
              shading: { fill: '4472C4' }
            })
          )
        }),
        ...section.table.rows.map((row: string[]) =>
          new TableRow({
            children: row.map((cell: string) =>
              new TableCell({
                children: [new Paragraph({ text: cell })]
              })
            )
          })
        )
      ];

      children.push(new Table({ rows: tableRows, width: { size: 100, type: 'pct' } }));
    }
  }

  const doc = new Document({
    sections: [{ children }]
  });

  return await Packer.toBuffer(doc);
}
```

---

## 🖥️ Core UI Components

### `/components/generator/GeneratorLayout.tsx`

```tsx
'use client';

import { useState, useRef } from 'react';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import ToolSelector from './ToolSelector';

export type ToolType = 'presentation' | 'spreadsheet' | 'document' | 'website' | 'pdf';

export default function GeneratorLayout() {
  const [activeTool, setActiveTool] = useState<ToolType>('website');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<{
    type: 'html' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
  } | null>(null);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    fileUrl?: string;
  }>>([]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`/api/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const result = await response.json();

      if (activeTool === 'website') {
        setPreview({ type: 'html', content: result.html });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '✅ Website generated! You can see the preview on the right. Tell me what to change.'
        }]);
      } else {
        setPreview({ type: 'file', fileUrl: result.fileUrl, fileName: result.fileName });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Your ${activeTool} is ready! Click download to get the file.`,
          fileUrl: result.fileUrl
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.'
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ToolSelector activeTool={activeTool} onSelect={setActiveTool} />
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel
          messages={messages}
          isGenerating={isGenerating}
          onSubmit={handleGenerate}
          activeTool={activeTool}
        />
        <PreviewPanel preview={preview} activeTool={activeTool} />
      </div>
    </div>
  );
}
```

### `/components/generator/ToolSelector.tsx`

```tsx
'use client';

import { ToolType } from './GeneratorLayout';

const tools = [
  { id: 'website', label: 'Website', icon: '🌐', desc: 'Landing pages, portfolios, apps' },
  { id: 'presentation', label: 'Slides', icon: '📊', desc: 'PowerPoint, pitch decks' },
  { id: 'spreadsheet', label: 'Spreadsheet', icon: '📈', desc: 'Excel, financial models' },
  { id: 'document', label: 'Document', icon: '📝', desc: 'Word docs, reports' },
  { id: 'pdf', label: 'PDF', icon: '📄', desc: 'Proposals, invoices' },
] as const;

export default function ToolSelector({
  activeTool,
  onSelect
}: {
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto">
      <span className="text-sm font-semibold text-gray-500 mr-2 whitespace-nowrap">Create:</span>
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onSelect(tool.id as ToolType)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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
```

### `/components/generator/ChatPanel.tsx`

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolType } from './GeneratorLayout';

const placeholders: Record<ToolType, string> = {
  website: 'Create a landing page for a Korean BBQ restaurant in Seoul...',
  presentation: 'Make a 10-slide pitch deck for an AI startup raising $5M Series A...',
  spreadsheet: 'Build a monthly budget tracker with income, expenses, and savings goals...',
  document: 'Write a business proposal for a mobile app development project...',
  pdf: 'Create a professional invoice template for a freelance designer...',
};

export default function ChatPanel({
  messages,
  isGenerating,
  onSubmit,
  activeTool
}: {
  messages: Array<{ role: 'user' | 'assistant'; content: string; fileUrl?: string }>;
  isGenerating: boolean;
  onSubmit: (prompt: string) => void;
  activeTool: ToolType;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isGenerating) return;
    onSubmit(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-[420px] flex flex-col bg-white border-r border-gray-200">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-400">
            <div className="text-4xl">🐊</div>
            <p className="font-medium text-gray-600">What do you want to create?</p>
            <p className="text-sm">{placeholders[activeTool]}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download
                  className="block mt-2 text-blue-400 underline hover:text-blue-300"
                >
                  ⬇️ Download file
                </a>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[activeTool]}
            rows={3}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={isGenerating || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {isGenerating ? '...' : '↑'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### `/components/generator/PreviewPanel.tsx`

```tsx
'use client';

import { ToolType } from './GeneratorLayout';

export default function PreviewPanel({
  preview,
  activeTool
}: {
  preview: { type: 'html' | 'file'; content?: string; fileUrl?: string; fileName?: string } | null;
  activeTool: ToolType;
}) {
  if (!preview) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400 space-y-3">
          <div className="text-6xl opacity-20">
            {activeTool === 'website' ? '🌐' :
             activeTool === 'presentation' ? '📊' :
             activeTool === 'spreadsheet' ? '📈' : '📝'}
          </div>
          <p className="text-sm">Your {activeTool} will appear here</p>
        </div>
      </div>
    );
  }

  if (preview.type === 'html' && preview.content) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-500 ml-2">Preview</span>
        </div>
        <iframe
          srcDoc={preview.content}
          className="flex-1 w-full border-none"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  if (preview.type === 'file' && preview.fileUrl) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="text-6xl">
            {activeTool === 'presentation' ? '📊' :
             activeTool === 'spreadsheet' ? '📈' : '📝'}
          </div>
          <p className="font-medium text-gray-800">{preview.fileName}</p>
          <a
            href={preview.fileUrl}
            download={preview.fileName}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            ⬇️ Download {activeTool}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
```

---

## 🔌 API Routes

### `/app/api/generate/website/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();
    const html = await generateWithClaude(prompt, 'website', history);
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

### `/app/api/generate/presentation/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';
import { generatePPTX } from '@/lib/generators/presentation';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();
    
    const jsonStr = await generateWithClaude(prompt, 'presentation', history);
    const data = JSON.parse(jsonStr.replace(/```json\n?|\n?```/g, '').trim());
    
    const buffer = await generatePPTX(data);
    
    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`;
    
    return NextResponse.json({
      fileUrl: dataUrl,
      fileName: `${data.title || 'presentation'}.pptx`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

### `/app/api/generate/spreadsheet/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';
import { generateXLSX } from '@/lib/generators/spreadsheet';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();
    
    const jsonStr = await generateWithClaude(prompt, 'spreadsheet', history);
    const data = JSON.parse(jsonStr.replace(/```json\n?|\n?```/g, '').trim());
    
    const buffer = await generateXLSX(data);
    
    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    
    return NextResponse.json({
      fileUrl: dataUrl,
      fileName: `${data.title || 'spreadsheet'}.xlsx`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

### `/app/api/generate/document/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateWithClaude } from '@/lib/claude';
import { generateDOCX } from '@/lib/generators/document';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();
    
    const jsonStr = await generateWithClaude(prompt, 'document', history);
    const data = JSON.parse(jsonStr.replace(/```json\n?|\n?```/g, '').trim());
    
    const buffer = await generateDOCX(data);
    
    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
    
    return NextResponse.json({
      fileUrl: dataUrl,
      fileName: `${data.title || 'document'}.docx`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
```

---

## 🚀 Setup Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest allig8or --typescript --tailwind --app --src-dir no --import-alias "@/*"
cd allig8or

# 2. Install dependencies
npm install @anthropic-ai/sdk pptxgenjs exceljs docx
npm install @supabase/supabase-js @supabase/ssr
# Lemon Squeezy — checkout via hosted URLs + webhook (no npm SDK required for MVP)
npm install lucide-react
npx shadcn@latest init
npx shadcn@latest add button input textarea card badge

# 3. Set up env
cp .env.example .env.local
# Fill in your keys

# 4. Run dev
npm run dev
```

---

## 💰 Pricing (Lemon Squeezy)

See `lib/lemonsqueezy.ts` — Starter $149, Pro $399, Team $999 variant IDs in env.
Checkout: `/api/checkout?plan=starter|pro|team`
Webhook: `/api/webhooks/lemonsqueezy`

---

## 📋 Landing Page Copy

```
Hero:
  H1: "Create anything with AI. Instantly."
  Sub: "Websites, presentations, spreadsheets, documents — 
        just describe what you need. Download in seconds."
  CTA: "Start for free →"

Tools showcase:
  - 🌐 Website Builder
  - 📊 AI Presentations  
  - 📈 Smart Spreadsheets
  - 📝 Document Writer
  - 📄 PDF Generator

Social proof:
  "Used by 10,000+ creators, founders, and teams"

Pricing:
  Free: 20 generations/month
  Starter $149/mo: 80 generations/month
  Pro $399/mo: 300 generations/month
  Team $999/mo: 1000 generations/month, 5 seats + priority AI
```

---

## 🎯 Phase 2 Features (After MVP)

- [ ] Template library (100+ templates per tool)
- [ ] AI image generation integration (for slides/websites)  
- [ ] Export to Google Slides / Google Sheets
- [ ] Real-time collaboration (multiple cursors)
- [ ] Version history & restore
- [ ] Custom branding / white-label
- [ ] API access for developers
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

## ⚡ Cursor Instructions

When you start building with this spec:

1. **Start with**: `npx create-next-app` then paste this entire file
2. **Build order**: 
   - API routes first (test in Postman)
   - Then UI components
   - Then wire them together
3. **Test each generator** separately before integrating
4. **Use Cursor's** `@codebase` to reference this spec throughout
5. **For bugs**: Always check the Claude API response format first

---

*Built with Claude API + Next.js. Domain: allig8or.com*
