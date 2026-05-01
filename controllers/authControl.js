const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  console.error('❌ JWT_SECRET is not set in .env — server cannot issue tokens');
  process.exit(1);
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seed = async (req, res) => {
  try {
    const seedKey = process.env.ADMIN_SEED_KEY;
    if (!seedKey || req.headers['x-seed-key'] !== seedKey) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPass) {
      return res.status(500).json({ error: 'ADMIN_EMAIL and ADMIN_PASS must be set in .env' });
    }

    const exists = await Admin.findOne({ email: adminEmail });
    if (exists) {
      exists.password = adminPass;
      await exists.save();
      return res.json({ message: 'Admin password updated' });
    }
    await Admin.create({ email: adminEmail, password: adminPass, name: adminName });
    res.status(201).json({ message: 'Admin created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
