const User = require('../models/User');
const Property = require('../models/Property');

// @desc   Get admin dashboard statistics
// @route  GET /api/admin/stats
// @access Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalProperties, pendingProperties, recentProperties] = await Promise.all([
            User.countDocuments(),
            Property.countDocuments({ isApproved: true }),
            Property.countDocuments({ isApproved: false }),
            Property.find().sort({ createdAt: -1 }).limit(8).populate('ownerId', 'name'),
        ]);

        res.json({ totalUsers, totalProperties, pendingProperties, recentProperties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Approve or reject a property
// @route  PUT /api/admin/properties/:id/approve
// @access Private/Admin
const approveProperty = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        );
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: `Property ${isApproved ? 'approved' : 'rejected'} successfully`, property });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete a user
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isAdmin) return res.status(403).json({ message: 'Cannot delete an admin user' });
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getAllUsers, approveProperty, deleteUser };
