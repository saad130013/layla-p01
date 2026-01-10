
import ExcelJS from 'exceljs';
import { InspectionData, StyleVariant } from '../types';

export async function generateExcel(data: InspectionData, variant: StyleVariant) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inspection Report', {
    pageSetup: { 
      paperSize: 9, // A4
      orientation: 'portrait',
      fitToPage: true,
      fitToHeight: 1,
      fitToWidth: 1,
      margins: { left: 0.5, right: 0.5, top: 0.7, bottom: 0.7, header: 0, footer: 0 }
    }
  });

  const colors = {
    Modern: { accent: 'FF2563EB', bg: 'FFEFA6FF' },
    Audit: { accent: 'FFE11D48', bg: 'FFFFF1F2' },
    Emerald: { accent: 'FF059669', bg: 'FFECFDF5' },
    Minimal: { accent: 'FF0F172A', bg: 'FFF8FAFC' },
    Classic: { accent: 'FF1E293B', bg: 'FFF1F5F9' }
  }[variant] || { accent: 'FF1E293B', bg: 'FFF1F5F9' };

  worksheet.columns = [
    { width: 14 }, { width: 14 }, { width: 14 }, 
    { width: 14 }, { width: 14 }, { width: 14 }
  ];

  worksheet.mergeCells('A1:B2');
  worksheet.getCell('A1').value = "Support Services Division\nEnvironmental Services Dept.";
  worksheet.getCell('A1').alignment = { vertical: 'middle', wrapText: true };

  worksheet.mergeCells('C1:D2');
  worksheet.getCell('C1').value = `INSPECTION AUDIT REPORT\n(Standard: HK-F002-A)`;
  worksheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getCell('C1').font = { bold: true, color: { argb: colors.accent.replace('#', '') } };

  worksheet.mergeCells('E1:F2');
  worksheet.getCell('E1').value = "المملكة العربية السعودية\nالشؤون الصحية بالحرس الوطني";
  worksheet.getCell('E1').alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };

  const infoRow = worksheet.getRow(4);
  infoRow.values = ['DATE:', data.date, 'TIME:', data.time, 'AREA:', data.areaRoom];
  infoRow.eachCell(c => {
    c.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
  });

  let currentRow = 6;
  for (let i = 0; i < data.items.length; i += 3) {
    const itemsBatch = [data.items[i], data.items[i+1], data.items[i+2]];
    itemsBatch.forEach((item, idx) => {
      if (!item) return;
      const colStart = (idx * 2) + 1;
      const cell = worksheet.getCell(currentRow, colStart);
      worksheet.mergeCells(currentRow, colStart, currentRow + 2, colStart + 1);
      cell.value = `${item.no}. ${item.title}\nM:${item.maxScore}\nScore: ____`;
      cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg.replace('#', '') } };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });
    currentRow += 4;
  }

  currentRow += 1;
  const summaryHeader = worksheet.getRow(currentRow);
  summaryHeader.values = ['Score', '#', 'Description', 'Score', '#', 'Description'];
  summaryHeader.eachCell(cell => {
    cell.style = { 
      font: { bold: true, color: { argb: 'FFFFFFFF' } }, 
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.accent } },
      alignment: { horizontal: 'center' }
    };
  });

  for (let i = 0; i < 8; i++) {
    const row = worksheet.getRow(currentRow + 1 + i);
    row.values = [
      ` / ${data.items[i+8]?.maxScore}`, i + 9, data.items[i+8]?.titleArabic,
      ` / ${data.items[i]?.maxScore}`, i + 1, data.items[i]?.titleArabic
    ];
    row.eachCell(c => { c.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} } });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Audit_Spreadsheet_${data.id}.xlsx`;
  a.click();
}
