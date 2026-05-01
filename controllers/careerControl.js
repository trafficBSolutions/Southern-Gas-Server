const Career = require('../models/career');
const transporter = require('../utils/email');
const { buildConfirmationEmail } = require('../utils/emailTemplate');

const myEmail = 'devon@southerngassolutions.com';

const createApplication = async (req, res) => {
  try {
    const { name, email, phone, position, experience, message } = req.body;
    const resume = req.files?.resume?.[0]?.filename || null;
    const coverLetter = req.files?.coverLetter?.[0]?.filename || null;

    const customerEmail = email?.trim().toLowerCase();

    if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const application = await Career.create({
      name,
      email: customerEmail,
      phone,
      position,
      experience,
      message,
      resume,
      coverLetter,
    });

    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    const result = await transporter.sendMail({
      from: fromLine,
      to: customerEmail,
      bcc: myEmail,
      replyTo: myEmail,
      subject: 'Application received — Southern Gas Solutions',
      text: `Hi ${name}, we received your application for ${position}. We will review it and contact you soon.`,
      html: buildConfirmationEmail({
        name,
        type: 'job application',
        details: [
          ['Name', name],
          ['Email', customerEmail],
          ['Phone', phone],
          ['Position', position],
          ['Experience', experience],
          ['Message', message],
          ['Resume', resume ? `📎 ${resume}` : null],
          ['Cover Letter', coverLetter ? `📎 ${coverLetter}` : null],
        ],
      }),
    });

    console.log('✅ Email accepted:', result.accepted);
    console.log('❌ Email rejected:', result.rejected);

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({ error: error.message });
  }
};

const getApplications = async (_req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createApplication, getApplications };
