const PDFDocument = require('pdfkit');
const fs = require('fs');

const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;

function generateQuotePDF(quote, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#0a1628').text('Southern Gas Solutions', { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#6b7a8d').text('Licensed Gas Professionals · North Georgia & Metro Atlanta', { align: 'center' });
    doc.moveDown(0.5);

    // Orange line
    doc.moveTo(50, doc.y).lineTo(562, doc.y).strokeColor('#e86a10').lineWidth(3).stroke();
    doc.moveDown(1);

    // Quote info
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#0a1628').text('QUOTE');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').fillColor('#3a4a5c');
    doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.text(`Customer: ${quote.customer}`);
    doc.text(`Email: ${quote.email}`);
    if (quote.phone) doc.text(`Phone: ${quote.phone}`);
    if (quote.service) doc.text(`Service: ${quote.service}`);
    doc.moveDown(1);

    // Table header
    const tableTop = doc.y;
    const col = { item: 50, desc: 150, qty: 340, price: 400, total: 480 };

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.rect(50, tableTop - 4, 512, 20).fill('#0a1628');
    doc.fillColor('#ffffff');
    doc.text('ITEM', col.item, tableTop, { width: 95 });
    doc.text('DESCRIPTION', col.desc, tableTop, { width: 185 });
    doc.text('QTY', col.qty, tableTop, { width: 55, align: 'center' });
    doc.text('UNIT PRICE', col.price, tableTop, { width: 75, align: 'right' });
    doc.text('TOTAL', col.total, tableTop, { width: 80, align: 'right' });

    // Table rows
    let y = tableTop + 22;
    doc.font('Helvetica').fontSize(9).fillColor('#3a4a5c');
    (quote.rows || []).forEach((row, i) => {
      const lineTotal = (Number(row.qty) || 0) * (Number(row.unitPrice) || 0);
      if (i % 2 === 0) doc.rect(50, y - 4, 512, 18).fill('#f8f9fb').fillColor('#3a4a5c');
      doc.text(row.item || '', col.item, y, { width: 95 });
      doc.text(row.description || '', col.desc, y, { width: 185 });
      doc.text(String(row.qty || 0), col.qty, y, { width: 55, align: 'center' });
      doc.text(money(row.unitPrice), col.price, y, { width: 75, align: 'right' });
      doc.text(money(lineTotal), col.total, y, { width: 80, align: 'right' });
      y += 20;
    });

    // Totals
    y += 10;
    doc.moveTo(380, y).lineTo(562, y).strokeColor('#eef1f5').lineWidth(1).stroke();
    y += 8;
    doc.fontSize(10).font('Helvetica');
    doc.text('Subtotal:', 380, y).text(money(quote.subtotal), 480, y, { width: 80, align: 'right' });
    y += 18;
    doc.text('Tax:', 380, y).text(money(quote.taxDue), 480, y, { width: 80, align: 'right' });
    y += 22;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0a1628');
    doc.text('TOTAL:', 380, y).text(money(quote.total), 480, y, { width: 80, align: 'right' });

    // Footer
    y += 40;
    doc.fontSize(9).font('Helvetica').fillColor('#6b7a8d');
    doc.text('Thank you for choosing Southern Gas Solutions!', 50, y, { align: 'center' });
    doc.text('(404) 862-3911 · devon@southerngassolutions.com', 50, y + 14, { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = { generateQuotePDF };
