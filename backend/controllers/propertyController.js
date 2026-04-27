const Property = require('../models/Property');
const User = require('../models/User');
const { calculatePropertyScore } = require('../utils/aiEngine');
const { cloudinary, upload, uploadToCloudinary } = require('../utils/cloudinary');

// @desc   Get all properties with filtering
// @route  GET /api/properties
// @access Public
const getProperties = async (req, res) => {
    try {
        const { location, type, minPrice, maxPrice, amenities, search } = req.query;
        let query = { isApproved: true };

        if (location) query.city = { $regex: location, $options: 'i' };
        if (type) query.propertyType = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (amenities) {
            const amenityList = amenities.split(',').filter(Boolean);
            if (amenityList.length) query.amenities = { $all: amenityList };
        }
        if (search) {
            query.$text = { $search: search };
        }

        const properties = await Property.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single property
// @route  GET /api/properties/:id
// @access Public
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('ownerId', 'name email');
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Create property
// @route  POST /api/properties
// @access Private
const createProperty = async (req, res) => {
    try {
        const { title, description, price, city, latitude, longitude, propertyType, amenities } = req.body;

        // Upload images to Cloudinary from memory buffers
        let images = [];
        if (req.files && req.files.length > 0) {
            try {
                images = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
            } catch (uploadError) {
                console.error("Cloudinary Upload Failed:", uploadError.message);
                // Fallback to placeholders if Cloudinary is not configured yet
                images = req.files.map((file, idx) => ({
                    url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
                    publicId: `fallback_${Date.now()}_${idx}`
                }));
            }
        }

        const property = await Property.create({
            title,
            description,
            price: Number(price),
            city,
            location: { latitude: Number(latitude || 0), longitude: Number(longitude || 0) },
            propertyType,
            amenities: amenities ? JSON.parse(amenities) : [],
            images,
            ownerId: req.user._id,
        });

        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update property
// @route  PUT /api/properties/:id
// @access Private (owner or admin)
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        if (property.ownerId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete property
// @route  DELETE /api/properties/:id
// @access Private (owner or admin)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        if (property.ownerId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        // Delete images from Cloudinary
        for (const img of property.images) {
            if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
        }

        await property.deleteOne();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get AI recommendations for a user
// @route  GET /api/properties/recommendations/:userId
// @access Public
const getRecommendations = async (req, res) => {
    try {
        let user = null;
        if (req.params.userId && req.params.userId !== 'null') {
            user = await User.findById(req.params.userId);
        }
        const properties = await Property.find({ isApproved: true }).populate('ownerId', 'name email');

        if (!user || !user.preferences) {
            return res.json(properties.slice(0, 6));
        }

        const scored = properties
            .map(p => ({ ...p.toObject(), aiScore: calculatePropertyScore(p, user.preferences) }))
            .sort((a, b) => b.aiScore - a.aiScore);

        res.json(scored.slice(0, 6));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get user's own property listings (as owner)
// @route  GET /api/properties/mylistings
// @access Private
const getMyListings = async (req, res) => {
    try {
        const properties = await Property.find({ ownerId: req.user._id })
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get user's rented properties (as tenant)
// @route  GET /api/properties/myrentals
// @access Private
const getMyRentals = async (req, res) => {
    try {
        const properties = await Property.find({ rentedBy: req.user._id })
            .populate('ownerId', 'name email')
            .sort({ updatedAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getRecommendations,
    getMyListings,
    getMyRentals,
};
