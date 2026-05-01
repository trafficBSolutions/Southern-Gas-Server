const Contact = require('../models/contact');
const transporter = require('../utils/email');
const { buildConfirmationEmail } = require('../utils/emailTemplate');

const myEmail = 'devon@southerngassolutions.com';

const createContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const customerEmail = email?.trim().toLowerCase();

    if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const contact = await Contact.create({
      name,
      email: customerEmail,
      phone,
      service,
      message,
    });

    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    const result = await transporter.sendMail({
      from: fromLine,
      to: customerEmail,
      bcc: myEmail,
      replyTo: myEmail,
      subject: 'We received your message — Southern Gas Solutions',
      text: `Hi ${name}, we received your message. We will review it and contact you soon.`,
      html: buildConfirmationEmail({
        name,
        type: 'message',
        details: [
          ['Name', name],
          ['Email', customerEmail],
          ['Phone', phone],
          ['Service', service],
          ['Message', message],
        ],
      }),
    });

    console.log('✅ Email accepted:', result.accepted);
    console.log('❌ Email rejected:', result.rejected);

    res.status(201).json({
      message: 'Message sent successfully!',
      contact,
    });
  } catch (error) {
    console.error('❌ Error submitting contact:', error);
    res.status(500).json({ error: error.message });
  }
};

const getContacts = async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createContact, getContacts };
