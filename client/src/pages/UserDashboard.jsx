import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { User, Settings, Heart, Bell, Save, MapPin, DollarSign, Home, List as ListIcon, CheckCircle2, Trash2, Search, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PropertyCard from '../components/PropertyCard';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const { properties, recommendations, fetchProperties, fetchRecommendations, fetchMyListings, fetchMyRentals, deleteProperty, fetchMyBookings, fetchReceivedBookings, updateBookingStatus } = useProperties();
    const [activeTab, setActiveTab] = useState(user?.role === 'host' ? 'overview' : 'profile');
    const [myListings, setMyListings] = useState([]);
    const [myRentals, setMyRentals] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [receivedBookings, setReceivedBookings] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        preferences: {
            location: user?.preferences?.location || '',
            budgetMin: user?.preferences?.budgetMin || '',
            budgetMax: user?.preferences?.budgetMax || '',
            propertyType: user?.preferences?.propertyType || '',
        }
    });

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('payment') === 'cancelled') {
            toast.error('Payment cancelled.');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            if (user) {
                fetchRecommendations(user._id);
                fetchProperties({}); // Ensure all properties are available for filtering
                const [listings, rentals, bookings, received] = await Promise.all([
                    fetchMyListings(),
                    fetchMyRentals(),
                    fetchMyBookings(),
                    fetchReceivedBookings()
                ]);
                setMyListings(listings);
                setMyRentals(rentals);
                setMyBookings(bookings);
                setReceivedBookings(received);
            }
            setLoadingData(false);
        };
        loadData();
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handlePreferenceChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            preferences: {
                ...formData.preferences,
                [name]: value
            }
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                await deleteProperty(id);
                setMyListings(prev => prev.filter(p => p._id !== id));
                toast.success('Listing deleted successfully');
            } catch (error) {
                toast.error('Failed to delete listing');
            }
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(`Booking ${status} successfully`);
            // Refresh bookings
            const received = await fetchReceivedBookings();
            setReceivedBookings(received);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-10 pb-28 md:pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar Nav */}
                <aside className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-blue-100">
                            {user?.name?.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                        <p className="text-slate-400 text-sm mb-6">{user?.email}</p>
                        <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold inline-block border border-emerald-100">
                            Verified Member
                        </div>
                    </div>

                    <nav className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-2">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, role: 'host' },
                            { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
                            { id: 'preferences', label: 'Preferences', icon: <Settings className="w-5 h-5" />, role: 'guest' },
                            { id: 'listings', label: 'My Listings', icon: <ListIcon className="w-5 h-5" />, role: 'host' },
                            { id: 'received', label: 'Bookings', icon: <Bell className="w-5 h-5" />, role: 'host' },
                            { id: 'bookings', label: 'My Bookings', icon: <CheckCircle2 className="w-5 h-5" />, role: 'guest' },
                            { id: 'saved', label: 'Wishlist', icon: <Heart className="w-5 h-5" />, role: 'guest' },
                        ].filter(tab => !tab.role || tab.role === user?.role).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.icon}
                                <span className="font-bold">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="lg:col-span-3 space-y-10">
                    {activeTab === 'overview' && user?.role === 'host' && (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Total Listings</p>
                                    <h4 className="text-3xl font-black text-slate-900 mt-1">{myListings.length}</h4>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Active Bookings</p>
                                    <h4 className="text-3xl font-black text-slate-900 mt-1">{receivedBookings.filter(b => b.status === 'confirmed').length}</h4>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Pending Requests</p>
                                    <h4 className="text-3xl font-black text-slate-900 mt-1">{receivedBookings.filter(b => b.status === 'pending').length}</h4>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {receivedBookings.slice(0, 3).map(b => (
                                        <div key={b._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 font-bold border border-slate-100">
                                                {b.guestId?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {b.guestId?.name} <span className="font-normal text-slate-500">requested to book</span> {b.propertyId?.title}
                                                </p>
                                                <p className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                                b.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </div>
                                    ))}
                                    {receivedBookings.length === 0 && (
                                        <p className="text-center text-slate-400 py-10">No recent activity to show.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'profile' && (
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-10">
                            <h2 className="text-3xl font-bold text-slate-900">Manage Profile</h2>
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3 text-slate-500 outline-none cursor-not-allowed"
                                        value={formData.email}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary flex items-center gap-2 !px-10">
                                        <Save className="w-5 h-5" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">AI Personalization</h2>
                                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Smart Notifications On
                                </div>
                            </div>
                            <p className="text-slate-500">Fine-tune how our AI matches you with properties.</p>

                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <MapPin className="w-4 h-4 text-blue-500" /> Preferred Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Karachi"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.location}
                                        onChange={handlePreferenceChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Home className="w-4 h-4 text-indigo-500" /> Property Type
                                    </label>
                                    <select
                                        name="propertyType"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.propertyType}
                                        onChange={handlePreferenceChange}
                                    >
                                        <option value="">Any</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="studio">Studio</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Min Budget
                                    </label>
                                    <input
                                        type="number"
                                        name="budgetMin"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.budgetMin}
                                        onChange={handlePreferenceChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Max Budget
                                    </label>
                                    <input
                                        type="number"
                                        name="budgetMax"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.budgetMax}
                                        onChange={handlePreferenceChange}
                                    />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button type="submit" className="btn-primary flex items-center gap-2 !px-10">
                                        <Save className="w-5 h-5" /> Update Preferences
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-slate-900">My Listings</h2>
                                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold">Add New</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myListings.length > 0 ? (
                                    myListings.map(p => (
                                        <div key={p._id} className="space-y-4">
                                            <div className="relative">
                                                <PropertyCard property={p} />
                                                {p.isRented && (
                                                    <div className="absolute top-4 right-4 z-20 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                                        RENTED
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/properties/${p._id}`)}
                                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                                                >
                                                    <Search className="w-4 h-4" /> View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all border border-rose-100"
                                                    title="Delete Listing"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="md:col-span-2 bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                                        You haven't listed any properties yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-slate-900">My Bookings</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {myBookings.length > 0 ? (
                                    myBookings.map(b => (
                                        <div key={b._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                                            <div className="w-full md:w-40 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={b.propertyId?.images?.[0]?.url || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow space-y-1">
                                                <h4 className="text-xl font-bold text-slate-900">{b.propertyId?.title}</h4>
                                                <p className="text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" /> {b.propertyId?.city}
                                                </p>
                                                <p className="text-sm font-medium text-slate-400">
                                                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-2 w-full md:w-auto">
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-block ${
                                                    b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                                    b.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {b.status}
                                                </div>
                                                <p className="text-2xl font-black text-slate-900">${b.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                                        You haven't booked any properties yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'received' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-slate-900">Received Bookings</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {receivedBookings.length > 0 ? (
                                    receivedBookings.map(b => (
                                        <div key={b._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                                            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                                                <img src={b.propertyId?.images?.[0]?.url || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                                        b.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {b.status}
                                                    </span>
                                                    <span className="text-slate-300">|</span>
                                                    <p className="text-xs font-bold text-slate-400">Booking ID: #{b._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <h4 className="text-2xl font-extrabold text-slate-900 leading-tight">{b.propertyId?.title}</h4>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <User className="w-4 h-4 text-blue-500" />
                                                        <span className="font-bold">{b.guestId?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                                        <span className="font-black text-slate-900">${b.totalPrice}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                                {b.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                                                            className="flex-1 md:w-32 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 text-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                                                            className="flex-1 md:w-32 py-3 bg-rose-50 text-rose-600 font-black rounded-xl hover:bg-rose-100 transition-all text-sm border border-rose-100"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {b.status === 'confirmed' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                                                        className="w-full md:w-32 py-3 bg-slate-50 text-slate-400 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                                        No booking requests received yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">My Wishlist</h2>
                                <p className="text-slate-500">Properties you've saved for later</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {properties.filter(p => user?.savedProperties?.includes(p._id)).length > 0 ? (
                                    properties
                                        .filter(p => user?.savedProperties?.includes(p._id))
                                        .map(p => <PropertyCard key={p._id} property={p} />)
                                ) : (
                                    <div className="md:col-span-2 bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                                        Your wishlist is empty. Start exploring!
                                    </div>
                                )}
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-rose-500" /> AI Recommendations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {recommendations.length > 0 ? (
                                        recommendations.map(p => <PropertyCard key={p._id} property={p} />)
                                    ) : (
                                        <div className="md:col-span-2 bg-slate-50 p-10 rounded-3xl text-center text-slate-400">
                                            Update your preferences for better matches!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
