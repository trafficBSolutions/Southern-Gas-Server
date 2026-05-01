const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
    if (err) {
        console.error('❌ Email transporter error:', err.message);
    } else {
        console.log('✅ Email transporter ready');
    }
});

module.exports = transporter;
