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
      currency?: string[];
    };
  }>;
}

export async function generateXLSX(data: SpreadsheetData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'allig8or AI';
  workbook.created = new Date();

  for (const sheetData of data.sheets) {
    const sheet = workbook.addWorksheet(sheetData.name);

    const headerRow = sheet.addRow(sheetData.headers);
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: sheetData.formatting?.headerRow?.fontColor || 'FFFFFFFF',
        },
        size: 12,
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: sheetData.formatting?.headerRow?.bgColor || 'FF4472C4',
        },
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 24;

    sheetData.rows.forEach((rowData, rowIndex) => {
      const row = sheet.addRow(rowData);
      if (sheetData.formatting?.alternateRows && rowIndex % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' },
          };
        });
      }
      row.height = 20;
    });

    sheet.columns.forEach((col) => {
      col.width = 18;
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
