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
    if (quote.quoteNumber) doc.text(`Quote #: ${quote.quoteNumber}`);
    doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.text(`Customer: ${quote.customer}`);
    doc.text(`Email: ${quote.email}`);
    if (quote.phone) doc.text(`Phone: ${quote.phone}`);
    if (quote.jobAddress) doc.text(`Job Address: ${quote.jobAddress}`);
    if (quote.county) doc.text(`County / Area: ${quote.county}`);
    if (quote.service) doc.text(`Service: ${quote.service}`);
    if (quote.jobType) doc.text(`Job Type: ${quote.jobType}`);
    doc.moveDown(1);

    // Table header — no price columns
    const tableTop = doc.y;
    const col = { item: 50, desc: 180, qty: 460 };

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.rect(50, tableTop - 4, 512, 20).fill('#0a1628');
    doc.fillColor('#ffffff');
    doc.text('ITEM', col.item, tableTop, { width: 125 });
    doc.text('DESCRIPTION', col.desc, tableTop, { width: 270 });
    doc.text('QTY', col.qty, tableTop, { width: 80, align: 'center' });

    // Table rows — no prices
    let y = tableTop + 22;
    doc.font('Helvetica').fontSize(9).fillColor('#3a4a5c');
    (quote.rows || []).forEach((row, i) => {
      if (i % 2 === 0) doc.rect(50, y - 4, 512, 18).fill('#f8f9fb').fillColor('#3a4a5c');
      doc.text(row.item || '', col.item, y, { width: 125 });
      doc.text(row.description || '', col.desc, y, { width: 270 });
      doc.text(String(row.qty || 0), col.qty, y, { width: 80, align: 'center' });
      y += 20;
    });

    // Total only
    y += 16;
    doc.moveTo(380, y).lineTo(562, y).strokeColor('#eef1f5').lineWidth(1).stroke();
    y += 10;
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

function generateInvoicePDF(invoice, outputPath) {
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

    // Invoice info
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#0a1628').text('INVOICE');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').fillColor('#3a4a5c');
    if (invoice.invoiceNumber) doc.text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    if (invoice.dueDate) doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.text(`Customer: ${invoice.customer}`);
    doc.text(`Email: ${invoice.email}`);
    if (invoice.phone) doc.text(`Phone: ${invoice.phone}`);
    if (invoice.jobAddress) doc.text(`Job Address: ${invoice.jobAddress}`);
    if (invoice.county) doc.text(`County / Area: ${invoice.county}`);
    if (invoice.service) doc.text(`Service: ${invoice.service}`);
    if (invoice.jobType) doc.text(`Job Type: ${invoice.jobType}`);
    doc.moveDown(1);

    // Table header — no price columns
    const tableTop = doc.y;
    const col = { item: 50, desc: 180, qty: 460 };

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.rect(50, tableTop - 4, 512, 20).fill('#0a1628');
    doc.fillColor('#ffffff');
    doc.text('ITEM', col.item, tableTop, { width: 125 });
    doc.text('DESCRIPTION', col.desc, tableTop, { width: 270 });
    doc.text('QTY', col.qty, tableTop, { width: 80, align: 'center' });

    // Table rows — no prices
    let y = tableTop + 22;
    doc.font('Helvetica').fontSize(9).fillColor('#3a4a5c');
    (invoice.rows || []).forEach((row, i) => {
      if (i % 2 === 0) doc.rect(50, y - 4, 512, 18).fill('#f8f9fb').fillColor('#3a4a5c');
      doc.text(row.item || '', col.item, y, { width: 125 });
      doc.text(row.description || '', col.desc, y, { width: 270 });
      doc.text(String(row.qty || 0), col.qty, y, { width: 80, align: 'center' });
      y += 20;
    });

    // Total only
    y += 16;
    doc.moveTo(380, y).lineTo(562, y).strokeColor('#eef1f5').lineWidth(1).stroke();
    y += 10;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0a1628');
    doc.text('TOTAL DUE:', 380, y).text(money(invoice.total), 480, y, { width: 80, align: 'right' });

    // Notes
    if (invoice.notes) {
      y += 40;
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#0a1628').text('Notes:', 50, y);
      y += 16;
      doc.fontSize(9).font('Helvetica').fillColor('#3a4a5c').text(invoice.notes, 50, y, { width: 500 });
    }

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

module.exports = { generateQuotePDF, generateInvoicePDF };
