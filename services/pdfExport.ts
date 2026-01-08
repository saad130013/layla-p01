
/**
 * Triggers the browser's native print dialog.
 * When combined with the CSS @media print rules in index.html,
 * this produces a pixel-perfect A4 PDF.
 */
export const generatePdf = () => {
  window.print();
};
