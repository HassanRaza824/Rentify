const sendEmail = require('../utils/nodemailer');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc   Contact property owner
// @route  POST /api/contact/owner
// @access Private
const contactOwner = async (req, res) => {
    try {
        const { propertyId, message } = req.body;

        const property = await Property.findById(propertyId).populate('ownerId', 'name email');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const owner = property.ownerId;
        const sender = await User.findById(req.user._id);

        // Send email to property owner
        await sendEmail({
            to: owner.email,
            subject: `New Inquiry for "${property.title}" on RentifyAI`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e40af;">New Property Inquiry 🏠</h2>
          <p>Hello <strong>${owner.name}</strong>,</p>
          <p>You have a new inquiry for your listing: <strong>${property.title}</strong></p>
          <hr style="border-color: #e2e8f0;" />
          <h3 style="color: #374151;">Message from ${sender.name}:</h3>
          <blockquote style="background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            "${message}"
          </blockquote>
          <hr style="border-color: #e2e8f0;" />
          <p>Reply directly to: <a href="mailto:${sender.email}">${sender.email}</a></p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">Sent via RentifyAI Platform</p>
        </div>
      `,
        });

        // Log contact history to user
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                contactHistory: {
                    propertyId,
                    message,
                    sentAt: new Date(),
                },
            },
        });

        res.json({ message: 'Your inquiry has been sent to the property owner.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Rent property and notify owner
// @route  POST /api/contact/rent
// @access Private
const rentProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;

        const property = await Property.findById(propertyId).populate('ownerId', 'name email');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.isRented) {
            return res.status(400).json({ message: 'This property is already rented' });
        }

        const owner = property.ownerId;
        const tenant = await User.findById(req.user._id);

        // Mark property as rented
        property.isRented = true;
        property.rentedBy = req.user._id;
        await property.save();

        // Send confirmation email to property owner
        await sendEmail({
            to: owner.email,
            subject: `🎉 Your Property "${property.title}" has been Rented!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #059669;">Congratulations! 🎊</h2>
          <p>Hello <strong>${owner.name}</strong>,</p>
          <p>Great news! Your property <strong>${property.title}</strong> has just been rented on RentifyAI.</p>
          <hr style="border-color: #e2e8f0;" />
          <h3 style="color: #374151;">Tenant Details:</h3>
          <ul style="background: #f1f5f9; padding: 16px 32px; border-radius: 8px; border-left: 4px solid #10b981;">
            <li><strong>Name:</strong> ${tenant.name}</li>
            <li><strong>Email:</strong> <a href="mailto:${tenant.email}">${tenant.email}</a></li>
          </ul>
          <p>Your listing has now been automatically marked as <strong style="color: #ef4444;">Unavailable (Rented)</strong> so you won't receive further inquiries for it.</p>
          <hr style="border-color: #e2e8f0;" />
          <p>Please contact the tenant to arrange the handover and finalize any documentation.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">Sent via RentifyAI Platform</p>
        </div>
      `,
        });

        // Log to tenant history
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                contactHistory: {
                    propertyId,
                    message: "Property Rented Successfully",
                    sentAt: new Date(),
                },
            },
        });

        res.json({ message: 'Property rented successfully! The owner has been notified.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { contactOwner, rentProperty };
