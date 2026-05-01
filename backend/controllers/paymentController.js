const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-session
// @access  Private
const createCheckoutSession = async (req, res) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('propertyId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            return res.status(500).json({ message: 'Stripe Secret Key is missing or invalid in .env' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: booking.propertyId.title,
                            description: `Booking from ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`,
                            images: [booking.propertyId.images?.[0]?.url || 'https://via.placeholder.com/300'],
                        },
                        unit_amount: Math.round(booking.totalPrice * 100), // Ensure integer for Stripe
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${booking._id}`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard?payment=cancelled`,
            metadata: {
                bookingId: booking._id.toString(),
            },
        });

        booking.stripeSessionId = session.id;
        await booking.save();

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ 
            message: error.message,
            hint: 'Please verify your STRIPE_SECRET_KEY in the .env file and restart the server.'
        });
    }
};

// @desc    Confirm Payment (Simple version without webhooks for now)
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // In a real app, you'd verify the session status with Stripe here
        booking.paymentStatus = 'paid';
        // For onsite payments, we might still want to mark as confirmed if the owner approves
        // but for Stripe, we can mark as confirmed automatically if paid?
        // Actually, let's keep the owner approval flow for both
        await booking.save();

        res.json({ message: 'Payment confirmed', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCheckoutSession,
    confirmPayment,
};
