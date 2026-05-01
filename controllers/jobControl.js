const Job = require('../models/job');
const AdminQuote = require('../models/adminQuote');
const transporter = require('../utils/email');
const { buildConfirmationEmail } = require('../utils/emailTemplate');

exports.scheduleJob = async (req, res) => {
  try {
    const { token, dates, address, notes } = req.body;
    const quote = await AdminQuote.findOne({ approvalToken: token });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    if (quote.status === 'approved') return res.status(400).json({ error: 'Quote already approved' });

    quote.status = 'approved';
    await quote.save();

    const job = await Job.create({
      quote: quote._id, customer: quote.customer, email: quote.email,
      phone: quote.phone, service: quote.service, total: quote.total,
      dates, address, notes,
    });

    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;
    const dateList = dates.join(', ');

    // Confirmation to customer
    await transporter.sendMail({
      from: fromLine,
      to: quote.email,
      bcc: [{ name: 'Southern Gas Solutions', address: process.env.EMAIL_USER }],
      subject: 'Job Scheduled — Southern Gas Solutions',
      html: buildConfirmationEmail({
        name: quote.customer,
        type: 'job scheduling confirmation',
        details: [
          ['Service', quote.service],
          ['Date(s)', dateList],
          ['Job Site Address', address],
          ['Notes', notes],
          ['Total', `$${quote.total.toFixed(2)}`],
        ],
      }),
    });

    // Notify Devon
    await transporter.sendMail({
      from: fromLine,
      to: process.env.EMAIL_USER,
      subject: `✅ Job Scheduled — ${quote.customer}`,
      html: buildConfirmationEmail({
        name: 'Devon',
        type: 'new job scheduling',
        details: [
          ['Customer', quote.customer],
          ['Email', quote.email],
          ['Phone', quote.phone],
          ['Service', quote.service],
          ['Date(s)', dateList],
          ['Job Site Address', address],
          ['Notes', notes],
          ['Total', `$${quote.total.toFixed(2)}`],
        ],
      }),
    });

    res.status(201).json({ message: 'Job scheduled successfully!', job });
  } catch (err) {
    console.error('❌ Schedule job error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('quote');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
