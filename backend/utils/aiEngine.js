/**
 * AI Weighted Scoring Algorithm
 * 
 * Scores properties based on user preferences.
 * Max Score: 100
 */

exports.calculatePropertyScore = (property, userPreferences) => {
    if (!userPreferences) return 0;

    let score = 0;
    const { location, budgetMin, budgetMax, propertyType, amenities } = userPreferences;

    // 1. Location Match (Weight: 40)
    if (location && property.city.toLowerCase() === location.toLowerCase()) {
        score += 40;
    }

    // 2. Budget Match (Weight: 30)
    if (budgetMin && budgetMax) {
        if (property.price >= budgetMin && property.price <= budgetMax) {
            score += 30;
        } else if (property.price >= budgetMin * 0.8 && property.price <= budgetMax * 1.2) {
            score += 15; // Partial match if close to range
        }
    }

    // 3. Property Type Match (Weight: 15)
    if (propertyType && property.propertyType === propertyType) {
        score += 15;
    }

    // 4. Amenities Match (Weight: 15)
    if (amenities && amenities.length > 0) {
        const matchingAmenities = property.amenities.filter(a => amenities.includes(a));
        const amenityScore = (matchingAmenities.length / amenities.length) * 15;
        score += amenityScore;
    }

    return Math.round(score);
};
