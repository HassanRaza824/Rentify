const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    location: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'studio', 'commercial'],
        required: true,
    },
    amenities: [{
        type: String,
        enum: ['wifi', 'parking', 'garden', 'pool', 'security'],
    }],
    images: [{
        url: String,
        publicId: String,
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    aiScore: {
        type: Number,
        default: 0,
    },
    isApproved: {
        type: Boolean,
        default: true, // Default to true for now, can be changed for admin flow
    },
    isRented: {
        type: Boolean,
        default: false,
    },
    rentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });

// Create text index for search
propertySchema.index({ title: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Property', propertySchema);
