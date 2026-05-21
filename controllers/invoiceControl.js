const Invoice = require('../models/invoice');
const transporter = require('../utils/email');
const { buildInvoiceEmail } = require('../utils/emailTemplate');
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

const CLIENT_URL = process.env.CLIENT_URL || 'https://www.southerngassolutions.com';

exports.createAndSend = async (req, res) => {
  try {
    const {
      customer, email, phone, jobAddress, county, area, service, jobType,
      profitMargin, rows, taxRate, isTaxExempt, subtotal, discount, permitFee,
      taxDue, total, dueDate, notes,
    } = req.body;

    const count = await Invoice.countDocuments();
    const invoiceNumber = `SGS-INV-${String(count + 1).padStart(4, '0')}`;

    const invoice = await Invoice.create({
      invoiceNumber, customer, email: email?.trim().toLowerCase(), phone,
      jobAddress, county, area, service, jobType, profitMargin,
      rows, taxRate, isTaxExempt, subtotal, discount, permitFee, taxDue, total,
      dueDate, notes,
    });

    // Generate PDF
    const pdfDir = path.join(__dirname, '..', 'uploads', 'invoices');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `invoice-${invoice._id}.pdf`);
    await generateInvoicePDF(invoice, pdfPath);
    invoice.pdfPath = pdfPath;
    await invoice.save();

    const viewUrl = `${CLIENT_URL}/invoice/${invoice.paymentToken}`;
    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    await transporter.sendMail({
      from: fromLine,
      to: invoice.email,
      bcc: [{ name: 'Southern Gas Solutions', address: process.env.EMAIL_USER }],
      subject: `Invoice ${invoiceNumber} from Southern Gas Solutions`,
      html: buildInvoiceEmail({ name: customer, invoice, viewUrl }),
      attachments: [{ filename: `${invoiceNumber}.pdf`, path: pdfPath }],
    });

    res.status(201).json({ message: 'Invoice sent successfully!', invoice });
  } catch (err) {
    console.error('❌ Invoice error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByToken = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ paymentToken: req.params.token });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice marked as paid', invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
