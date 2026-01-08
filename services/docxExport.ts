
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  Header,
  BorderStyle,
  VerticalAlign
} from 'docx';
import { InspectionData, InspectionItem, StyleVariant } from '../types';

export async function generateDocx(data: InspectionData, variant: StyleVariant) {
  // تعريف ألوان الثيمات بناءً على الاختيار
  const getThemeColors = (v: StyleVariant) => {
    switch (v) {
      case 'Modern': return { accent: "2563EB", bg: "EFF6FF", border: "94A3B8" };
      case 'Audit': return { accent: "E11D48", bg: "FFF1F2", border: "FB7185" };
      case 'Emerald': return { accent: "059669", bg: "ECFDF5", border: "6EE7B7" };
      case 'Minimal': return { accent: "0F172A", bg: "F8FAFC", border: "E2E8F0" };
      default: return { accent: "1E293B", bg: "F1F5F9", border: "000000" };
    }
  };

  const theme = getThemeColors(variant);
  const FULL_WIDTH = 100;
  const THIRD_WIDTH = 33.3;

  // دالة لإنشاء خلية لكل بند تفتيش
  const createItemCell = (item: InspectionItem | undefined) => {
    if (!item) {
      return new TableCell({ 
        children: [], 
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } 
      });
    }

    return new TableCell({
      width: { size: THIRD_WIDTH, type: WidthType.PERCENTAGE },
      shading: { fill: "FFFFFF" },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
        left: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
        right: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
      },
      children: [
        // عنوان البند مع خلفية ملونة
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: theme.bg },
          children: [
            new TextRun({ 
              text: `${item.no}- ${item.title.toUpperCase()}`, 
              bold: true, 
              size: 15,
              color: theme.accent
            })
          ],
        }),
        // الدرجات المتاحة (M, E, G, L, B)
        new Paragraph({
          spacing: { before: 40, after: 40 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ 
              text: `M:${item.maxScore} E:${item.maxScore} G:${Math.floor(item.maxScore * 0.7)} L:${Math.floor(item.maxScore * 0.4)} B:0`, 
              size: 12, 
              color: "64748B",
              font: "Courier New"
            })
          ],
        }),
        // الملاحظات (Observations)
        ...item.observations.map(obs => new Paragraph({
          spacing: { before: 20 },
          children: [
            new TextRun({ text: obs.checked ? " [✓] " : " [  ] ", bold: obs.checked, size: 13 }),
            new TextRun({ text: obs.label, size: 13, color: "334155" })
          ]
        })),
        // خانة الدرجة الفارغة
        new Paragraph({
          spacing: { before: 120 },
          children: [
            new TextRun({ text: "SCORE: ", bold: true, size: 14, color: theme.accent }),
            new TextRun({ text: "__________", color: "CBD5E1" })
          ]
        })
      ],
      margins: { top: 80, bottom: 80, left: 80, right: 80 },
    });
  };

  // إنشاء الهيدر (رأس الصفحة)
  const header = new Header({
    children: [
      new Table({
        width: { size: FULL_WIDTH, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 12, color: theme.accent }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Support Services Division", bold: true, size: 18 })] }),
                  new Paragraph({ children: [new TextRun({ text: "Environmental Services Dept.", size: 16, color: "64748B" })] }),
                ],
              }),
              new TableCell({
                width: { size: 34, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({ 
                    alignment: AlignmentType.CENTER, 
                    children: [new TextRun({ text: "INSPECTION AUDIT REPORT", bold: true, size: 22, color: theme.accent })] 
                  }),
                  new Paragraph({ 
                    alignment: AlignmentType.CENTER, 
                    children: [new TextRun({ text: `(${data.areaType} Area)`, size: 14, color: "94A3B8" })] 
                  }),
                ],
              }),
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "المملكة العربية السعودية", bold: true, size: 16 })] }),
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "الشؤون الصحية بالحرس الوطني", size: 14 })] }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // بناء محتوى المستند
  const doc = new Document({
    sections: [{
      headers: { default: header },
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children: [
        // جدول معلومات الزيارة
        new Table({
          width: { size: FULL_WIDTH, type: WidthType.PERCENTAGE },
          borders: { 
            top: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
            left: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
            right: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: theme.border },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ spacing: {before:100, after:100}, children: [new TextRun({ text: " DATE: ", bold: true }), new TextRun(data.date)] })] }),
                new TableCell({ children: [new Paragraph({ spacing: {before:100, after:100}, children: [new TextRun({ text: " TIME: ", bold: true }), new TextRun(data.time)] })] }),
                new TableCell({ shading: { fill: theme.bg }, children: [new Paragraph({ spacing: {before:100, after:100}, children: [new TextRun({ text: " AREA: ", bold: true, color: theme.accent }), new TextRun({ text: data.areaRoom, bold: true })] })] }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { before: 150 } }),

        // شبكة بنود التفتيش (3 أعمدة)
        new Table({
          width: { size: FULL_WIDTH, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [createItemCell(data.items[0]), createItemCell(data.items[1]), createItemCell(data.items[2])] }),
            new TableRow({ children: [createItemCell(data.items[3]), createItemCell(data.items[4]), createItemCell(data.items[5])] }),
            new TableRow({ children: [createItemCell(data.items[6]), createItemCell(data.items[7]), createItemCell(data.items[8])] }),
            new TableRow({ children: [createItemCell(data.items[9]), createItemCell(data.items[10]), createItemCell(data.items[11])] }),
            new TableRow({ children: [createItemCell(data.items[12]), createItemCell(data.items[13]), createItemCell(data.items[14])] }),
            new TableRow({ children: [createItemCell(data.items[15]), createItemCell(undefined), createItemCell(undefined)] }),
          ],
        }),

        new Paragraph({ text: "", spacing: { before: 150 } }),

        // جدول الملخص ثنائي اللغة (مطابق تماماً للتصميم)
        new Table({
          width: { size: FULL_WIDTH, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الدرجة", bold: true, color: "FFFFFF" })] })] }),
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#", bold: true, color: "FFFFFF" })] })] }),
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "بند الفحص الإداري", bold: true, color: "FFFFFF" })] })] }),
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الدرجة", bold: true, color: "FFFFFF" })] })] }),
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#", bold: true, color: "FFFFFF" })] })] }),
                new TableCell({ shading: { fill: theme.accent }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "بند الفحص الإداري", bold: true, color: "FFFFFF" })] })] }),
              ]
            }),
            ...[0,1,2,3,4,5,6,7].map(i => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: ` / (${data.items[i+8]?.maxScore})` })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: (i+9).toString() })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: data.items[i+8]?.titleArabic || "" })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: ` / (${data.items[i]?.maxScore})` })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: (i+1).toString() })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: data.items[i]?.titleArabic || "" })] }),
              ]
            }))
          ]
        }),

        new Paragraph({ 
          text: `Quality Compliance Score: ________ %`, 
          spacing: { before: 200 }, 
          alignment: AlignmentType.RIGHT 
        }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Audit_Report_${variant}_${data.id}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
