import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import {
    MapPin, Home, Star, Wifi, Car, Trees, Droplets, Shield,
    Send, Heart, CheckCircle, Navigation, Info, School, Building2, ShoppingBag, Utensils, Sparkles, Key, CreditCard, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('onsite');

    // Airbnb Features State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertyRes, reviewsRes] = await Promise.all([
                    api.get(`/properties/${id}`),
                    api.get(`/reviews/${id}`)
                ]);
                setProperty(propertyRes.data);
                setReviews(reviewsRes.data);
            } catch (error) {
                toast.error('Failed to load property details');
                navigate('/properties');
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const calculateTotal = () => {
        if (!startDate || !endDate || !property) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff * (property.price / 30) : 0;
    };

    const handleContact = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to contact the owner');
        if (!message) return toast.error('Please enter a message');

        setSending(true);
        try {
            await api.post('/contact/owner', { propertyId: id, message });
            toast.success('Inquiry sent to owner successfully!');
            setMessage('');
        } catch (error) {
            toast.error('Failed to send inquiry');
        }
        setSending(false);
    };

    const handleRentProperty = async () => {
        if (!user) return toast.error('Please login to rent this property');
        if (!startDate || !endDate) return toast.error('Please select check-in and check-out dates');

        const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        if (nights <= 0) return toast.error('Check-out date must be after check-in date');

        const basePrice = calculateTotal();
        const discount = nights >= 7 ? basePrice * 0.1 : 0;
        const total = basePrice + 75 - discount; // 75 is cleaning + service fee

        setSending(true);
        try {
            const { data: booking } = await api.post('/bookings', {
                propertyId: id,
                startDate,
                endDate,
                totalPrice: total,
                paymentMethod
            });

            if (paymentMethod === 'stripe') {
                const { data: session } = await api.post('/payments/create-session', {
                    bookingId: booking._id
                });
                window.location.href = session.url;
            } else {
                toast.success('Booking requested successfully! Pay on arrival confirmed.');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        }
        setSending(false);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to review');
        if (!newReview.comment) return toast.error('Please add a comment');

        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                propertyId: id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            toast.success('Review submitted!');
            setNewReview({ rating: 5, comment: '' });
            // Refresh reviews
            const { data } = await api.get(`/reviews/${id}`);
            setReviews(data);
        } catch (error) {
            toast.error('Failed to submit review');
        }
        setSubmittingReview(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 'New';

    const amenityIcons = {
        wifi: <Wifi className="w-5 h-5" />,
        parking: <Car className="w-5 h-5" />,
        garden: <Trees className="w-5 h-5" />,
        pool: <Droplets className="w-5 h-5" />,
        security: <Shield className="w-5 h-5" />,
    };

    const mockReviews = [
        { id: 1, name: 'Jessica Thompson', date: 'October 2025', rating: 5, comment: 'Absolutely stunning space. The AI recommendation was spot on! The location is perfect and the owner was very helpful.' },
        { id: 2, name: 'Michael Chen', date: 'September 2025', rating: 4, comment: 'Great apartment with amazing views. Very clean and modern. Would definitely stay here again.' },
    ];

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse space-y-8">
            <div className="h-[500px] bg-slate-200 rounded-[3rem]" />
            <div className="h-10 w-1/3 bg-slate-200 rounded-lg" />
            <div className="h-6 w-1/4 bg-slate-200 rounded-lg" />
        </div>
    );

    if (!property) return null;

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[500px]">
                    <div className="md:col-span-2 h-full rounded-[2.5rem] overflow-hidden shadow-2xl group relative cursor-pointer">
                        <img
                            src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={property.title}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="hidden md:grid grid-rows-2 gap-4 h-full md:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-[2rem] overflow-hidden shadow-lg border-2 border-white group cursor-pointer relative">
                                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Interior" />
                            </div>
                            <div className="rounded-[2rem] overflow-hidden shadow-lg border-2 border-white group cursor-pointer relative">
                                <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Kitchen" />
                            </div>
                        </div>
                        <div className="rounded-[2rem] overflow-hidden shadow-lg border-2 border-white relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Bedroom" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                                View All Photos
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {property.propertyType}
                                </span>
                                {property.aiScore > 85 && (
                                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" /> AI Recommended
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                                {property.title}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 text-lg">
                                <MapPin className="w-6 h-6 text-rose-500" />
                                <span>{property.city}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 py-8 border-y border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700">
                                    <Home className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold">Entire Home</p>
                                    <p className="text-slate-500 text-sm">You'll have the space to yourself</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold">Enhanced Clean</p>
                                    <p className="text-slate-500 text-sm">Owner committed to 5-step clean</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-900">About this space</h3>
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                                {property.description}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-900">What this place offers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-4 py-2">
                                        <div className="text-slate-700">
                                            {amenityIcons[amenity] || <CheckCircle className="w-5 h-5" />}
                                        </div>
                                        <span className="capitalize text-slate-700 text-lg">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-slate-900">Where you'll be</h3>
                                <div className="flex items-center gap-2 text-slate-900 font-bold underline cursor-pointer">
                                    {property.city}
                                </div>
                            </div>
                            <MapView latitude={property.location.latitude} longitude={property.location.longitude} title={property.title} />
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-10 border-t border-slate-100 pt-12">
                            <div className="flex items-center gap-3">
                                <Star className="w-6 h-6 text-slate-900 fill-slate-900" />
                                <h3 className="text-2xl font-bold text-slate-900">{averageRating} · {reviews.length} reviews</h3>
                            </div>

                            {user && !property.isRented && (
                                <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-8 rounded-3xl space-y-4">
                                    <h4 className="font-bold text-slate-900">Add your review</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    className={`transition-all ${newReview.rating >= star ? 'text-rose-500' : 'text-slate-300'}`}
                                                >
                                                    <Star className={`w-6 h-6 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-slate-500">{newReview.rating}/5 Rating</span>
                                    </div>
                                    <textarea
                                        placeholder="Tell us about your experience..."
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Posting...' : 'Post Review'}
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {reviews.length > 0 ? (
                                    reviews.map(review => (
                                        <div key={review._id} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                                                    {review.userId?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{review.userId?.name || 'Anonymous User'}</h4>
                                                    <p className="text-slate-400 text-sm">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-1 text-slate-900 font-bold text-xs bg-slate-50 px-2 py-1 rounded-lg">
                                                    <Star className="w-3 h-3 fill-slate-900" /> {review.rating}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="md:col-span-2 text-center py-10 text-slate-400 font-medium">
                                        No reviews yet. Be the first to share your experience!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Booking Area */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-slate-200">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <span className="text-2xl font-extrabold text-slate-900">${property.price.toLocaleString()}</span>
                                        <span className="text-slate-500 font-medium"> / month</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                                        <Star className="w-3 h-3 fill-slate-900" /> {averageRating} · {reviews.length} reviews
                                    </div>
                                </div>

                                {property.isRented ? (
                                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center space-y-4">
                                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                            <Key className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-red-900 text-xl tracking-tight">Currently Rented</h4>
                                            <p className="text-red-700/70 text-sm font-medium mt-1">Check back later for availability</p>
                                        </div>
                                    </div>
                                ) : user?.role === 'host' ? (
                                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center space-y-4">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                            <Home className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-blue-900 text-xl tracking-tight">Host View</h4>
                                            <p className="text-blue-700/70 text-sm font-medium mt-1">You are viewing this as a Host. Guests can book this property using the reserve tool.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="border border-slate-400 rounded-xl overflow-hidden">
                                            <div className="grid grid-cols-2 border-b border-slate-400">
                                                <div className="p-3 border-r border-slate-400">
                                                    <label className="block text-[10px] font-extrabold uppercase text-slate-900">Check-in</label>
                                                    <input
                                                        type="date"
                                                        className="w-full text-sm outline-none cursor-pointer mt-1"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <label className="block text-[10px] font-extrabold uppercase text-slate-900">Check-out</label>
                                                    <input
                                                        type="date"
                                                        className="w-full text-sm outline-none cursor-pointer mt-1"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <label className="block text-[10px] font-extrabold uppercase text-slate-900">Guests</label>
                                                <select
                                                    className="w-full text-sm outline-none cursor-pointer mt-1 bg-transparent"
                                                    value={guests}
                                                    onChange={(e) => setGuests(e.target.value)}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                                        <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setPaymentMethod('onsite')}
                                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'onsite' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-blue-200'}`}
                                                >
                                                    <DollarSign className="w-6 h-6" />
                                                    <span className="text-xs font-bold">On-site Payment</span>
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('stripe')}
                                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-blue-200'}`}
                                                >
                                                    <CreditCard className="w-6 h-6" />
                                                    <span className="text-xs font-bold">Credit Card</span>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleRentProperty}
                                            disabled={sending}
                                            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                                        >
                                            {sending ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                            ) : (
                                                paymentMethod === 'stripe' ? 'Pay & Reserve' : 'Reserve'
                                            )}
                                        </button>

                                        <p className="text-center text-slate-500 text-sm py-4">You won't be charged yet</p>

                                        {startDate && endDate && (
                                            <div className="space-y-4 border-t border-slate-100 pt-6">
                                                <div className="flex justify-between text-slate-600">
                                                    <span className="underline">${(property.price / 30).toFixed(0)} x {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} nights</span>
                                                    <span>${calculateTotal().toLocaleString()}</span>
                                                </div>
                                                {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) >= 7 && (
                                                    <div className="flex justify-between text-emerald-600 font-bold">
                                                        <span className="underline">Weekly stay discount</span>
                                                        <span>-${(calculateTotal() * 0.1).toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-slate-600">
                                                    <span className="underline">Cleaning fee</span>
                                                    <span>$50</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span className="underline">RentifyAI service fee</span>
                                                    <span>$25</span>
                                                </div>
                                                <div className="flex justify-between font-black text-xl text-slate-900 pt-6 border-t border-slate-100">
                                                    <span>Total</span>
                                                    <span>
                                                        ${(
                                                            calculateTotal() + 75 -
                                                            (Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) >= 7 ? calculateTotal() * 0.1 : 0)
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                        {property.ownerId?.name?.charAt(0) || 'O'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Hosted by {property.ownerId?.name || 'Property Owner'}</h4>
                                        <p className="text-slate-400 text-sm">Joined in May 2021</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
                                        <span>42 Reviews</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Shield className="w-5 h-5 text-emerald-500" />
                                        <span>Identity verified</span>
                                    </div>
                                    <button
                                        onClick={() => setMessage(`Hi ${property.ownerId?.name}, I have a few questions about your property...`)}
                                        className="w-full py-3 px-6 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50 transition-all text-sm mt-4"
                                    >
                                        Contact Host
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 mt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-6 h-6" />
                                    <h4 className="font-bold text-xl">AI Insights</h4>
                                </div>
                                <p className="text-blue-100 leading-relaxed text-sm mb-6">
                                    Based on your preferences, this property is a <strong className="text-white">perfect match</strong> due to its proximity to transit and within your budget range.
                                </p>
                                <div className="aspect-video bg-blue-700/50 rounded-2xl flex items-center justify-center italic text-blue-200 text-xs text-center px-4">
                                    Score breakdown: Location (40/40), Price (30/30), Type (15/15), Amenities (10/15)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
