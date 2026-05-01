const express = require('express');
const router = express.Router();
const { login, seed } = require('../controllers/authControl');

router.post('/login', login);
router.post('/seed', seed);

module.exports = router;
