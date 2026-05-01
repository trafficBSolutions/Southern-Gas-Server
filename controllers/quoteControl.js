const Quote = require('../models/quote');
const transporter = require('../utils/email');
const { buildEmail, buildConfirmationEmail } = require('../utils/emailTemplate');

const myEmail = 'devon@southerngassolutions.com';

const submitQuote = async (req, res) => {
  try {
    const { name, email, phone, service, details } = req.body;

    const customerEmail = email?.trim().toLowerCase();

    if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const quote = await Quote.create({
      name,
      email: customerEmail,
      phone,
      service,
      details,
    });

    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    // Send confirmation to customer, BCC business
    const result = await transporter.sendMail({
      from: fromLine,
      to: customerEmail,
      bcc: myEmail,
      replyTo: myEmail,
      subject: 'We received your quote request — Southern Gas Solutions',
      text: `Hi ${name}, we received your quote request for ${service}. We will review it and contact you soon.`,
      html: buildConfirmationEmail({
        name,
        type: 'quote request',
        details: [
          ['Name', name],
          ['Email', customerEmail],
          ['Phone', phone],
          ['Service', service],
          ['Project Details', details],
        ],
      }),
    });

    console.log('✅ Email accepted:', result.accepted);
    console.log('❌ Email rejected:', result.rejected);

    res.status(201).json({
      message: 'Quote request submitted successfully',
      quote,
    });
  } catch (error) {
    console.error('❌ Error submitting quote:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitQuote,
};