const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createApplication, getApplications } = require('../controllers/careerControl');
const verifyCaptcha = require('../utils/verifyCaptcha');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

router.post('/', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]), verifyCaptcha, createApplication);

router.get('/', getApplications);

module.exports = router;
