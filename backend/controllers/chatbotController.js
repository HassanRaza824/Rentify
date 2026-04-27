const Property = require('../models/Property');

// @desc   Search properties via natural language
// @route  POST /api/chatbot/query
// @access Public
const chatbotSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const q = query.toLowerCase();
        let filter = { isApproved: true };

        // Extract city
        const cities = ['karachi', 'lahore', 'islamabad', 'new york', 'los angeles', 'chicago', 'miami', 'san francisco', 'denver', 'dubai'];
        const cityMatch = cities.find(c => q.includes(c));
        if (cityMatch) filter.city = { $regex: cityMatch, $options: 'i' };

        // Extract property type
        const types = ['apartment', 'house', 'studio', 'villa', 'commercial'];
        const typeMatch = types.find(t => q.includes(t));
        if (typeMatch) filter.propertyType = typeMatch === 'villa' ? 'house' : typeMatch;

        // Extract price (e.g. "under 2000", "below 50000", "max 3000")
        const priceMatch = q.match(/(?:under|below|max|less than|upto?)\s*(\d+(?:,\d{3})*)/);
        if (priceMatch) filter.price = { $lte: Number(priceMatch[1].replace(/,/g, '')) };

        // Extract amenities
        const amenityKeywords = ['wifi', 'parking', 'pool', 'garden', 'security'];
        const foundAmenities = amenityKeywords.filter(a => q.includes(a));
        if (foundAmenities.length) filter.amenities = { $all: foundAmenities };

        const results = await Property.find(filter)
            .populate('ownerId', 'name email')
            .limit(5)
            .sort({ createdAt: -1 });

        let message = '';
        if (results.length === 0) {
            message = "I couldn't find properties matching your criteria. Try broadening your search!";
        } else {
            message = `Found ${results.length} propert${results.length > 1 ? 'ies' : 'y'} matching "${query}". Here are the top results:`;
        }

        res.json({ message, results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { chatbotSearch };
