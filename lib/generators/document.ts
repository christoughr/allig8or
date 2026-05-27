import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  ShadingType,
} from 'docx';

export interface DocumentData {
  title: string;
  author?: string;
  sections: Array<{
    heading: string;
    level: number;
    paragraphs?: string[];
    bullets?: string[];
    pageBreakBefore?: boolean;
    table?: {
      headers: string[];
      rows: string[][];
    };
  }>;
}

// Brand blue for table headers
const HEADER_COLOR = '1E3A5F';
const ACCENT_COLOR = '10B981'; // emerald

export async function generateDOCX(data: DocumentData): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  // ── Title ──────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.title,
          bold: true,
          size: 52,
          color: HEADER_COLOR,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Author + date line
  if (data.author) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${data.author}  ·  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            size: 20,
            color: '6B7280',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    );
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  for (const section of data.sections) {
    // Page break before major sections if requested
    if (section.pageBreakBefore) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Heading
    children.push(
      new Paragraph({
        text: section.heading,
        heading: section.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 160 },
      })
    );

    // Paragraphs
    if (section.paragraphs) {
      for (const para of section.paragraphs) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: para, size: 24 })],
            spacing: { after: 200 },
            alignment: AlignmentType.JUSTIFIED,
          })
        );
      }
    }

    // Bullet list
    if (section.bullets) {
      for (const bullet of section.bullets) {
        children.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 120 },
            indent: { left: 360 },
          })
        );
      }
    }

    // Table
    if (section.table) {
      const tableRows = [
        // Header row
        new TableRow({
          tableHeader: true,
          children: section.table.headers.map(
            (h) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 }),
                    ],
                    spacing: { before: 80, after: 80 },
                  }),
                ],
                shading: { fill: HEADER_COLOR, type: ShadingType.SOLID, color: HEADER_COLOR },
              })
          ),
        }),
        // Data rows
        ...section.table.rows.map(
          (row, rowIdx) =>
            new TableRow({
              children: row.map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: cell, size: 22 })],
                        spacing: { before: 80, after: 80 },
                      }),
                    ],
                    shading: rowIdx % 2 === 1
                      ? { fill: 'F5F7FA', type: ShadingType.SOLID, color: 'F5F7FA' }
                      : undefined,
                  })
              ),
            })
        ),
      ];

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            left:   { style: BorderStyle.NONE },
            right:  { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            insideVertical: { style: BorderStyle.NONE },
          },
        })
      );

      // Spacing after table
      children.push(new Paragraph({ spacing: { after: 240 } }));
    }
  }

  const doc = new Document({
    creator: data.author ?? 'allig8tor AI',
    title: data.title,
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: { size: 36, bold: true, color: HEADER_COLOR },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { size: 28, bold: true, color: '374151' },
        },
      ],
    },
    sections: [{ children }],
  });

  return await Packer.toBuffer(doc);
}
