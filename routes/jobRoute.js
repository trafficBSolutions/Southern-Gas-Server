const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authControl');
const { scheduleJob, getAll } = require('../controllers/jobControl');

router.post('/', scheduleJob);
router.get('/', authMiddleware, getAll);

module.exports = router;
