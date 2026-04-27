const express = require('express');
const router = express.Router();
const { contactOwner, rentProperty } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/owner', protect, contactOwner);
router.post('/rent', protect, rentProperty);

module.exports = router;
