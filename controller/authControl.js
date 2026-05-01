const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'sgs-admin-secret-key-2026';

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
    const exists = await Admin.findOne({ email: 'devon@southerngassolutions.com' });
    if (exists) {
      exists.password = 'HankLuke28!';
      await exists.save();
      return res.json({ message: 'Admin password updated' });
    }
    await Admin.create({ email: 'devon@southerngassolutions.com', password: 'HankLuke28!', name: 'Devon' });
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
