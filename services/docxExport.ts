
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
  VerticalAlign,
  HeightRule
} from 'docx';
import { InspectionData, InspectionItem } from '../types';

export async function generateDocx(data: InspectionData, style: string) {
  // Constants for sizing
  const FULL_WIDTH = 100;
  const THIRD_WIDTH = 33.3;
  
  // Helper to create an item cell
  const createItemCell = (item: InspectionItem | undefined) => {
    if (!item) return new TableCell({ children: [], borders: { top: { style: BorderStyle.NONE, size: 0 } } });

    return new TableCell({
      width: { size: THIRD_WIDTH, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: "F8FAFC" },
          children: [new TextRun({ text: `${item.no}- ${item.title.toUpperCase()}`, bold: true, size: 16 })],
        }),
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `M:${item.maxScore} E:${item.maxScore} G:${Math.floor(item.maxScore * 0.7)} L:${Math.floor(item.maxScore * 0.4)} B:0`, size: 14, color: "64748B" })
          ],
        }),
        // Checkboxes simulation
        new Paragraph({
          children: item.observations.map(obs => 
            new TextRun({ text: ` □ ${obs.label} `, size: 14 })
          )
        }),
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({ text: "SCORE: ________", bold: true, size: 16 })
          ]
        })
      ],
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
    });
  };

  // Build the Header
  const header = new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 12 }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Support Services Division", bold: true, size: 18 })] }),
                  new Paragraph({ children: [new TextRun({ text: "Environmental Services", size: 16 })] }),
                ],
              }),
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "DAILY INSPECTION & AUDIT REPORT", bold: true, size: 20 })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `(${data.areaType} Area)`, size: 16 })] }),
                ],
              }),
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "KINGDOM OF SAUDI ARABIA", bold: true, size: 16 })] }),
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "National Guard Health Affairs", size: 14 })] }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Main Document Sections
  const doc = new Document({
    sections: [{
      headers: { default: header },
      properties: { page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } } },
      children: [
        // Visit Info Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun(data.date)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Time: ", bold: true }), new TextRun(data.time)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Reviewed By Supervisor: ", bold: true }), new TextRun("________________")] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Area/Room: ", bold: true }), new TextRun(data.areaRoom)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Inspected By: ", bold: true }), new TextRun(data.inspectorName)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Approved By PTR: ", bold: true }), new TextRun("________________")] })] }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { before: 200 } }),

        // 3-Column Grid Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Row 1 (Items 1, 2, 3)
            new TableRow({ children: [createItemCell(data.items[0]), createItemCell(data.items[1]), createItemCell(data.items[2])] }),
            new TableRow({ children: [createItemCell(data.items[3]), createItemCell(data.items[4]), createItemCell(data.items[5])] }),
            new TableRow({ children: [createItemCell(data.items[6]), createItemCell(data.items[7]), createItemCell(data.items[8])] }),
            new TableRow({ children: [createItemCell(data.items[9]), createItemCell(data.items[10]), createItemCell(data.items[11])] }),
            new TableRow({ children: [createItemCell(data.items[12]), createItemCell(data.items[13]), createItemCell(data.items[14])] }),
            new TableRow({ children: [createItemCell(data.items[15]), createItemCell(undefined), createItemCell(undefined)] }),
          ],
        }),

        new Paragraph({ text: "", spacing: { before: 200 } }),

        // Bottom Blocks: Comments, Unavailable, Supervisor
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Inspector Comment", bold: true, size: 16 })] }),
                    new Paragraph({ text: "__________________________" }),
                  ]
                }),
                new TableCell({
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Unavailable chemical/tools", bold: true, size: 16 })] }),
                    ...[1,2,3].map(n => new Paragraph({ text: `${n}- ________________` }))
                  ]
                }),
                new TableCell({
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Supervisor", bold: true, size: 16 })] }),
                    new Paragraph({ text: "□ Available   □ Not Available" }),
                    new Paragraph({ text: "Name: ________________" }),
                  ]
                }),
              ]
            })
          ]
        }),

        new Paragraph({ text: "", spacing: { before: 200 } }),

        // Bilingual Summary Table (6 Columns)
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الدرجة", bold: true })] })] }),
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الرقم", bold: true })] })] }),
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "البند", bold: true })] })] }),
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الدرجة", bold: true })] })] }),
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "الرقم", bold: true })] })] }),
                new TableCell({ shading: { fill: "F1F5F9" }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "البند", bold: true })] })] }),
              ]
            }),
            ...[0,1,2,3,4,5,6,7].map(i => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `  / (${data.items[i+8]?.maxScore || ""})` })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: (i+9).toString() })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: data.items[i+8]?.titleArabic || "" })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `  / (${data.items[i]?.maxScore || ""})` })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: (i+1).toString() })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: data.items[i]?.titleArabic || "" })] }),
              ]
            }))
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Audit_Report_${data.id}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
