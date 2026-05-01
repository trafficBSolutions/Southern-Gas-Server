const express = require('express');
const router = express.Router();
const { submitQuote, getQuotes } = require('../controllers/quoteControl');
const verifyCaptcha = require('../utils/verifyCaptcha');

router.post('/', verifyCaptcha, submitQuote);
router.get('/', getQuotes);

module.exports = router;
