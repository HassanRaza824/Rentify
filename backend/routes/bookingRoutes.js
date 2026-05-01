const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getOwnerBookings,
    updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createBooking);
router.get('/mybookings', getUserBookings);
router.get('/received', getOwnerBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
