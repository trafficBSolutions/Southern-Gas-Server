const AdminQuote = require('../models/adminQuote');
const transporter = require('../utils/email');
const { buildQuoteEmail } = require('../utils/emailTemplate');
const { generateQuotePDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

exports.createAndSend = async (req, res) => {
  try {
    const { customer, email, phone, service, rows, taxRate, isTaxExempt, subtotal, taxDue, total } = req.body;

    const quote = await AdminQuote.create({
      customer, email: email?.trim().toLowerCase(), phone, service,
      rows, taxRate, isTaxExempt, subtotal, taxDue, total,
    });

    // Generate PDF
    const pdfDir = path.join(__dirname, '..', 'uploads', 'quotes');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `quote-${quote._id}.pdf`);
    await generateQuotePDF(quote, pdfPath);
    quote.pdfPath = pdfPath;
    await quote.save();

    const approveUrl = `${CLIENT_URL}/approve-quote/${quote.approvalToken}`;
    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    // Send to customer
    await transporter.sendMail({
      from: fromLine,
      to: quote.email,
      bcc: [{ name: 'Southern Gas Solutions', address: process.env.EMAIL_USER }],
      subject: `Your Quote from Southern Gas Solutions`,
      html: buildQuoteEmail({ name: customer, quote, approveUrl }),
      attachments: [{ filename: `SGS-Quote-${quote._id}.pdf`, path: pdfPath }],
    });

    res.status(201).json({ message: 'Quote sent successfully!', quote });
  } catch (err) {
    console.error('❌ Admin quote error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const quotes = await AdminQuote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByToken = async (req, res) => {
  try {
    const quote = await AdminQuote.findOne({ approvalToken: req.params.token });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
