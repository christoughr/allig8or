import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type GenerationType =
  | 'presentation'
  | 'spreadsheet'
  | 'document'
  | 'website'
  | 'pdf';

export async function generateWithClaude(
  prompt: string,
  type: GenerationType,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const systemPrompts: Record<GenerationType, string> = {
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
    - Include page breaks where appropriate: <div style="page-break-after: always;"></div>`,
  };

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompts[type],
    messages: [
      ...conversationHistory,
      { role: 'user', content: prompt },
    ],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

export function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as T;
}
