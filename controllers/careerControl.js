const Career = require('../models/career');
const transporter = require('../utils/email');
const { buildConfirmationEmail } = require('../utils/emailTemplate');

const myEmail = 'devon@southerngassolutions.com';

const createApplication = async (req, res) => {
  try {
    const { name, email, phone, position, experience, message } = req.body;
    const resumeFile = req.files?.resume?.[0] || null;
    const coverLetterFile = req.files?.coverLetter?.[0] || null;

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
      resume: resumeFile?.filename || null,
      coverLetter: coverLetterFile?.filename || null,
    });

    const fromLine = `"Southern Gas Solutions" <${process.env.EMAIL_USER}>`;

    // Build attachments array from uploaded files
    const emailAttachments = [];
    if (resumeFile) emailAttachments.push({ filename: resumeFile.originalname, path: resumeFile.path });
    if (coverLetterFile) emailAttachments.push({ filename: coverLetterFile.originalname, path: coverLetterFile.path });

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
          ['Resume', resumeFile ? `📎 ${resumeFile.originalname}` : null],
          ['Cover Letter', coverLetterFile ? `📎 ${coverLetterFile.originalname}` : null],
        ],
      }),
      attachments: emailAttachments,
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
