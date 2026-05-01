const express = require('express');
const router = express.Router();
const { submitQuote } = require('../controllers/quoteControl');
const verifyCaptcha = require('../utils/verifyCaptcha');

router.post('/', verifyCaptcha, submitQuote);

module.exports = router;
