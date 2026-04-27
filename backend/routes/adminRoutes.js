const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, approveProperty, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin); // All admin routes require auth + admin

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/properties/:id/approve', approveProperty);

module.exports = router;
