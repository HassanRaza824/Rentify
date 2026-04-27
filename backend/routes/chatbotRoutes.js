const express = require('express');
const router = express.Router();
const { chatbotSearch } = require('../controllers/chatbotController');

router.post('/query', chatbotSearch);

module.exports = router;
