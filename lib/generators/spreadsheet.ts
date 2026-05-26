import ExcelJS from 'exceljs';

export interface SpreadsheetData {
  title: string;
  sheets: Array<{
    name: string;
    headers: string[];
    rows: (string | number)[][];
    formatting?: {
      headerRow?: { bold?: boolean; bgColor?: string; fontColor?: string };
      alternateRows?: boolean;
      currency?: string[];   // column letters, e.g. ["B","C"]
      percentage?: string[]; // column letters
    };
  }>;
}

export async function generateXLSX(data: SpreadsheetData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'allig8or AI';
  workbook.created = new Date();
  workbook.title = data.title;

  for (const sheetData of data.sheets) {
    const sheet = workbook.addWorksheet(sheetData.name, {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ── Header row ──────────────────────────────────────────────────────────
    const headerBg = sheetData.formatting?.headerRow?.bgColor || '1E3A5F';
    const headerFg = sheetData.formatting?.headerRow?.fontColor || 'FFFFFF';

    const headerRow = sheet.addRow(sheetData.headers);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: `FF${headerFg.replace('#', '')}` }, size: 11, name: 'Calibri' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${headerBg.replace('#', '')}` } };
      cell.border = { bottom: { style: 'medium', color: { argb: 'FFD0D0D0' } } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    });

    // ── Currency / percentage column sets ────────────────────────────────────
    const currencyCols = new Set(
      (sheetData.formatting?.currency ?? []).map((l) => l.toUpperCase().charCodeAt(0) - 64)
    );
    const percentCols = new Set(
      (sheetData.formatting?.percentage ?? []).map((l) => l.toUpperCase().charCodeAt(0) - 64)
    );

    // ── Data rows ────────────────────────────────────────────────────────────
    sheetData.rows.forEach((rowData, rowIndex) => {
      const row = sheet.addRow(rowData);
      row.height = 22;

      const isAlt = sheetData.formatting?.alternateRows && rowIndex % 2 === 1;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { size: 11, name: 'Calibri' };

        if (isAlt) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } };
        }

        // Format numbers
        if (typeof cell.value === 'number') {
          if (currencyCols.has(colNumber)) {
            cell.numFmt = '#,##0.00;(#,##0.00);"-"';
          } else if (percentCols.has(colNumber)) {
            cell.numFmt = '0.0%';
          } else {
            cell.numFmt = '#,##0.##';
          }
        }

        cell.alignment = { vertical: 'middle', horizontal: typeof cell.value === 'number' ? 'right' : 'left' };
        cell.border = {
          bottom: { style: 'hair', color: { argb: 'FFE8E8E8' } },
        };
      });
    });

    // ── Auto column widths ────────────────────────────────────────────────────
    sheet.columns.forEach((col, i) => {
      const header = sheetData.headers[i] ?? '';
      const maxDataLen = sheetData.rows.reduce((max, row) => {
        const cell = row[i];
        const len = cell !== undefined && cell !== null ? String(cell).length : 0;
        return Math.max(max, len);
      }, 0);
      col.width = Math.min(Math.max(header.length + 4, maxDataLen + 4, 10), 40);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
