const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authControl');
const { createAndSend, getAll, getByToken, markPaid } = require('../controllers/invoiceControl');

router.post('/', authMiddleware, createAndSend);
router.get('/', authMiddleware, getAll);
router.patch('/:id/paid', authMiddleware, markPaid);
router.get('/token/:token', getByToken);

module.exports = router;
