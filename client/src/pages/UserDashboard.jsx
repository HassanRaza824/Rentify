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
    const { properties, recommendations, fetchProperties, fetchRecommendations, fetchMyListings, fetchMyRentals, deleteProperty } = useProperties();
    const [activeTab, setActiveTab] = useState('profile');
    const [myListings, setMyListings] = useState([]);
    const [myRentals, setMyRentals] = useState([]);
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
        const loadData = async () => {
            setLoadingData(true);
            if (user) {
                fetchRecommendations(user._id);
                fetchProperties({}); // Ensure all properties are available for filtering
                const [listings, rentals] = await Promise.all([
                    fetchMyListings(),
                    fetchMyRentals()
                ]);
                setMyListings(listings);
                setMyRentals(rentals);
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
                            { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
                            { id: 'preferences', label: 'AI Preferences', icon: <Settings className="w-5 h-5" /> },
                            { id: 'listings', label: 'My Listings', icon: <ListIcon className="w-5 h-5" /> },
                            { id: 'rentals', label: 'My Rentals', icon: <CheckCircle2 className="w-5 h-5" /> },
                            { id: 'saved', label: 'Saved Properties', icon: <Heart className="w-5 h-5" /> },
                        ].map(tab => (
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

                    {activeTab === 'rentals' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-slate-900">My Rentals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myRentals.length > 0 ? (
                                    myRentals.map(p => (
                                        <div key={p._id} className="relative">
                                            <PropertyCard property={p} />
                                            <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                                ACTIVE RENTAL
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="md:col-span-2 bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                                        You haven't rented any properties yet.
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
