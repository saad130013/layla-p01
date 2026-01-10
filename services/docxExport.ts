
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
  Footer,
  BorderStyle,
  VerticalAlign,
  PageOrientation,
  HeightRule
} from 'docx';
import { InspectionData, InspectionItem, StyleVariant } from '../types';

export async function generateDocx(data: InspectionData, variant: StyleVariant) {
  const themes = {
    Classic: { primary: "1a4a44", border: "1a4a44", bg: "f0fdfa" },
    Executive: { primary: "1e3a8a", border: "1e3a8a", bg: "eff6ff" },
    Slate: { primary: "334155", border: "334155", bg: "f8fafc" },
    Sand: { primary: "78350f", border: "78350f", bg: "fffbeb" },
    Minimal: { primary: "000000", border: "000000", bg: "ffffff" }
  };

  const theme = themes[variant] || themes.Classic;
  const standardBorder = { style: BorderStyle.SINGLE, size: 1, color: theme.border };
  const lightBorder = { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" };

  // Helper to create a cell for the main inspection grid
  const createItemCell = (item: InspectionItem | undefined) => {
    if (!item) {
      return new TableCell({ 
        children: [], 
        borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder } 
      });
    }

    return new TableCell({
      width: { size: 33.3, type: WidthType.PERCENTAGE },
      verticalAlign: VerticalAlign.TOP,
      borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder },
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.LEFT,
          shading: { fill: "fcfcfc" },
          children: [
            new TextRun({ 
              text: `${item.no}- ${item.title.toUpperCase()}`, 
              bold: true, 
              size: 14, 
              color: theme.primary,
              font: "Calibri"
            })
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: theme.primary + "20" } },
          spacing: { after: 40 }
        }),
        // Score Info
        new Paragraph({
          alignment: AlignmentType.BOTH,
          children: [
            new TextRun({ text: `MAX: ${item.maxScore} | EXC: ${item.maxScore}`, size: 11, color: "64748B" }),
            ...(item.lowScoreMarker ? [new TextRun({ text: `  LOW: ${item.lowScoreMarker}`, size: 11, color: "DC2626" })] : [])
          ],
          spacing: { after: 60 }
        }),
        // Observations
        ...item.observations.map(obs => new Paragraph({
          spacing: { before: 20 },
          children: [
            new TextRun({ text: obs.checked ? " ☒ " : " ☐ ", size: 16, font: "Segoe UI Symbol" }),
            new TextRun({ text: ` ${obs.label}`, size: 12, color: "334155" })
          ]
        })),
        // Score Box
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: "SCORE: ", size: 11, bold: true, color: "94A3B8" }),
            new TextRun({ 
              text: ` ${item.givenScore} `, 
              size: 16, 
              bold: true, 
              color: "FFFFFF", 
              shading: { fill: theme.primary } 
            })
          ]
        })
      ],
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
    });
  };

  // Build the items table rows
  const itemRows: TableRow[] = [];
  for (let i = 0; i < data.items.length; i += 3) {
    itemRows.push(new TableRow({
      children: [
        createItemCell(data.items[i]),
        createItemCell(data.items[i + 1]),
        createItemCell(data.items[i + 2])
      ]
    }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 567, right: 567, bottom: 567, left: 567 }, // Approx 1cm margins
          size: { width: 11906, height: 16838 } // A4
        }
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: theme.primary }, top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "KINGDOM OF SAUDI ARABIA", bold: true, size: 14, color: theme.primary })] }),
                        new Paragraph({ children: [new TextRun({ text: "SAUDI NATIONAL GUARD HEALTH AFFAIRS", bold: true, size: 12, color: theme.primary })] }),
                        new Paragraph({ children: [new TextRun({ text: "SUPPORT SERVICES - ENVIRONMENTAL", size: 11, color: theme.primary, opacity: 70 })] }),
                      ]
                    }),
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          shading: { fill: theme.primary },
                          children: [new TextRun({ text: "AUDIT & INSPECTION REPORT", bold: true, size: 22, color: "FFFFFF" })]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: `(${data.areaType.toUpperCase()})`, bold: true, size: 14, color: theme.primary })]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Form # ${data.formNumber}`, bold: true, size: 14, color: theme.primary })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "QUALITY CONTROL DEPT.", bold: true, size: 12, color: theme.primary })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "CONFIDENTIAL DOCUMENT", size: 11, color: theme.primary, opacity: 70 })] }),
                      ]
                    }),
                  ]
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({ text: `Form Ref: ${data.id} | Generated via AuditPro`, size: 10, color: "94A3B8" })
              ]
            })
          ]
        })
      },
      children: [
        // Spacer
        new Paragraph({ spacing: { after: 120 } }),
        
        // Info Bar
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder }, children: [new Paragraph({ children: [new TextRun({ text: "AREA / LOCATION", bold: true, size: 11, color: "64748B" }), new TextRun({ text: `\n${data.areaRoom}`, bold: true, size: 14, color: "334155" })] })] }),
                new TableCell({ borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder }, children: [new Paragraph({ children: [new TextRun({ text: "DATE", bold: true, size: 11, color: "64748B" }), new TextRun({ text: `\n${data.date}`, bold: true, size: 14, color: "1E293B" })] })] }),
                new TableCell({ borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder }, children: [new Paragraph({ children: [new TextRun({ text: "SUPERVISOR", bold: true, size: 11, color: "64748B" }), new TextRun({ text: "\n---", bold: true, size: 14, color: "94A3B8" })] })] }),
                new TableCell({ borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder }, children: [new Paragraph({ children: [new TextRun({ text: "AUDITOR", bold: true, size: 11, color: "64748B" }), new TextRun({ text: "\n---", bold: true, size: 14, color: "94A3B8" })] })] }),
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 120 } }),

        // Main Items Grid
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: itemRows
        }),

        new Paragraph({ spacing: { after: 120 } }),

        // Comments & Tools
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 33.3, type: WidthType.PERCENTAGE },
                  borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "COMMENTS", bold: true, size: 14, color: theme.primary })], border: { bottom: standardBorder } }),
                    new Paragraph({ children: [new TextRun({ text: data.comments, italic: true, size: 12, color: "64748B" })], spacing: { before: 100 } })
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  width: { size: 33.3, type: WidthType.PERCENTAGE },
                  borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "MISSING TOOLS", bold: true, size: 14, color: theme.primary })], border: { bottom: standardBorder } }),
                    new Paragraph({ children: [new TextRun({ text: "1. ............................................", size: 11, color: "CBD5E1" })], spacing: { before: 40 } }),
                    new Paragraph({ children: [new TextRun({ text: "2. ............................................", size: 11, color: "CBD5E1" })] }),
                    new Paragraph({ children: [new TextRun({ text: "3. ............................................", size: 11, color: "CBD5E1" })] }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                new TableCell({
                  width: { size: 33.3, type: WidthType.PERCENTAGE },
                  borders: { top: standardBorder, bottom: standardBorder, left: standardBorder, right: standardBorder },
                  shading: { fill: "f8fafc" },
                  verticalAlign: VerticalAlign.BOTTOM,
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "AVAIL: ☐    N/A: ☐", bold: true, size: 12 })], spacing: { after: 200 } }),
                    new Paragraph({ border: { bottom: { style: BorderStyle.DASHED, size: 1, color: "94A3B8" } } }),
                    new Paragraph({ children: [new TextRun({ text: "Supervisor Signature", size: 10, color: "94A3B8" })] }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 120 } }),

        // Summary Table (Arabic Support)
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [...Array(Math.ceil(data.items.length / 3))].map((_, rowIndex) => {
            const startIdx = rowIndex * 3;
            const items = [data.items[startIdx], data.items[startIdx + 1], data.items[startIdx + 2]];
            
            return new TableRow({
              children: items.flatMap((item, idx) => [
                new TableCell({
                  width: { size: 5, type: WidthType.PERCENTAGE },
                  borders: { right: lightBorder },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item ? (startIdx + idx + 1).toString() : "", size: 10, color: "94A3B8" })] })]
                }),
                new TableCell({
                  width: { size: 23, type: WidthType.PERCENTAGE },
                  borders: { right: standardBorder },
                  children: [
                    new Paragraph({ 
                      alignment: AlignmentType.RIGHT, 
                      bidirectional: true,
                      children: [new TextRun({ text: item?.titleArabic || "", bold: true, size: 11, font: "Arial Unicode MS" })] 
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 5, type: WidthType.PERCENTAGE },
                  shading: { fill: "f8fafc" },
                  borders: { right: idx < 2 ? standardBorder : { style: BorderStyle.NONE } },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item ? `${item.givenScore}/${item.maxScore}` : "", size: 11, bold: true })] })]
                })
              ])
            });
          })
        }),

        new Paragraph({ spacing: { after: 240 } }),

        // Signatures Bar
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: standardBorder, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ spacing: { before: 200 }, border: { bottom: standardBorder } }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AUDITOR SIGNATURE", bold: true, size: 12, color: theme.primary })] })
                  ]
                }),
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({ 
                      alignment: AlignmentType.CENTER, 
                      children: [new TextRun({ text: "Quality Compliance Score: ________ %", bold: true, size: 18, italic: true, color: theme.primary })] 
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ spacing: { before: 200 }, border: { bottom: standardBorder } }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "OFFICIAL APPROVAL", bold: true, size: 12, color: theme.primary })] })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Audit_Report_${data.areaType.replace(/\s+/g, '_')}_${data.id}.docx`;
  a.click();
}
