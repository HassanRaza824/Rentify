import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Star, Heart, Sparkles, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const PropertyCard = ({ property }) => {
    const { _id, title, city, price, propertyType, images, aiScore } = property;
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    const isSaved = user?.savedProperties?.includes(_id);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.error('Please login to save properties');
            return navigate('/login');
        }
        try {
            await toggleFavorite(_id);
            toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
        } catch (error) {
            toast.error('Failed to update favorites');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 group transition-all duration-300 h-full flex flex-col"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2.5 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 ${isSaved
                                ? 'bg-rose-500 text-white hover:bg-rose-600'
                                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
                {aiScore > 80 && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm border border-slate-100">
                        <Sparkles className="w-3 h-3 text-rose-500" />
                        <span>TOP MATCH {aiScore}%</span>
                    </div>
                )}
                {property.isRented && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl">
                            <Key className="w-4 h-4 text-rose-500" /> RENTED
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="uppercase tracking-wider">{city}</span>
                </div>

                <div className="mb-6">
                    <span className="text-xl font-extrabold text-slate-900">${price.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm font-medium"> / month</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <Link
                        to={`/properties/${_id}`}
                        className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
