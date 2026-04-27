const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getRecommendations,
    getMyListings,
    getMyRentals,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// Public routes
router.get('/', getProperties);
router.get('/recommendations/:userId', getRecommendations);

// Protected routes (User specific)
router.get('/mylistings', protect, getMyListings);
router.get('/myrentals', protect, getMyRentals);

router.get('/:id', getPropertyById);

// Protected routes
router.post('/', protect, upload.array('images', 10), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
