const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { propertyId, startDate, endDate, totalPrice, paymentMethod } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const booking = await Booking.create({
            propertyId,
            guestId: req.user._id,
            ownerId: property.ownerId,
            startDate,
            endDate,
            totalPrice,
            paymentMethod: paymentMethod || 'onsite',
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's bookings (as guest)
// @route   GET /api/bookings/mybookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ guestId: req.user._id })
            .populate('propertyId')
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get owner's bookings (as host)
// @route   GET /api/bookings/received
// @access  Private
const getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ ownerId: req.user._id })
            .populate('propertyId')
            .populate('guestId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only owner can update status (confirm/cancel)
        // Or guest can cancel their own booking
        if (booking.ownerId.toString() !== req.user._id.toString() && 
            (booking.guestId.toString() !== req.user._id.toString() || status !== 'cancelled')) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getOwnerBookings,
    updateBookingStatus,
};
