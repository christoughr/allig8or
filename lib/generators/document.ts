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
} from 'docx';

export interface DocumentData {
  title: string;
  author?: string;
  sections: Array<{
    heading: string;
    level: number;
    paragraphs?: string[];
    bullets?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }>;
}

export async function generateDOCX(data: DocumentData): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  for (const section of data.sections) {
    children.push(
      new Paragraph({
        text: section.heading,
        heading:
          section.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      })
    );

    if (section.paragraphs) {
      for (const para of section.paragraphs) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: para, size: 24 })],
            spacing: { after: 200 },
          })
        );
      }
    }

    if (section.bullets) {
      for (const bullet of section.bullets) {
        children.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 100 },
          })
        );
      }
    }

    if (section.table) {
      const tableRows = [
        new TableRow({
          children: section.table.headers.map(
            (h) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: h,
                        bold: true,
                        color: 'FFFFFF',
                        size: 22,
                      }),
                    ],
                  }),
                ],
                shading: { fill: '4472C4' },
              })
          ),
        }),
        ...section.table.rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cell) =>
                  new TableCell({
                    children: [new Paragraph({ text: cell })],
                  })
              ),
            })
        ),
      ];

      children.push(
        new Table({ rows: tableRows, width: { size: 100, type: 'pct' } })
      );
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBuffer(doc);
}
