const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactControl');
const verifyCaptcha = require('../utils/verifyCaptcha');

router.post('/', verifyCaptcha, createContact);
router.get('/', getContacts);

module.exports = router;
