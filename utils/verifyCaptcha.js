const https = require('https');

function verifyCaptcha(req, res, next) {
  const token = req.body?.captchaToken;
  if (!token) return res.status(400).json({ error: 'Please complete the reCAPTCHA.' });

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const postData = `secret=${secret}&response=${token}`;

  const options = {
    hostname: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': postData.length },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          next();
        } else {
          res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
        }
      } catch {
        res.status(500).json({ error: 'reCAPTCHA verification error.' });
      }
    });
  });

  request.on('error', () => res.status(500).json({ error: 'reCAPTCHA verification error.' }));
  request.write(postData);
  request.end();
}

module.exports = verifyCaptcha;
