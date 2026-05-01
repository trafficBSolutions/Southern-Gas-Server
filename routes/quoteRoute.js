const express = require('express');
const router = express.Router();
const { submitQuote } = require('../controllers/quoteControl');
const cors = require('cors');
router.use (
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)
router.post('/', submitQuote);

module.exports = router;
