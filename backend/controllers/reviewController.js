const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add review for a property
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { propertyId, rating, comment } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const review = await Review.create({
            propertyId,
            userId: req.user._id,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
exports.getPropertyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ propertyId: req.params.propertyId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
