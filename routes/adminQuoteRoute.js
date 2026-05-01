const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authControl');
const { createAndSend, getAll, getByToken } = require('../controllers/adminQuoteControl');

router.post('/', authMiddleware, createAndSend);
router.get('/', authMiddleware, getAll);
router.get('/token/:token', getByToken);

module.exports = router;
