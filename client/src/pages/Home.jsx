import React, { useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap, Map as MapIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { properties, recommendations, fetchProperties, fetchRecommendations, loading } = useProperties();
    const { user } = useAuth();

    useEffect(() => {
        fetchProperties({});
        if (user) {
            fetchRecommendations(user._id);
        } else {
            fetchRecommendations(null);
        }
    }, [user]);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 select-none">
                    <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        className="w-full h-full object-cover animate-slow-zoom"
                        alt="Premium Property"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
                            Find Your <span className="text-rose-400">Elite</span> <br />
                            Living Space.
                        </h1>
                        <p className="text-blue-50/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto">
                            Experience AI-curated luxury stays and long-term rentals with seamless booking.
                        </p>
                    </motion.div>

                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[3rem] shadow-2xl border border-white/20">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <section className="max-w-7xl mx-auto px-6 py-24 space-y-12">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Recent Submissions</h2>
                        <p className="text-slate-500 font-medium text-lg">Explore the latest curated stays around the globe.</p>
                    </div>
                    <Link to="/properties" className="hidden md:flex items-center gap-2 text-rose-500 font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
                        Explore all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties.slice(0, 6).map(p => <PropertyCard key={p._id} property={p} />)}
                    </div>
                )}
            </section>

            {/* AI Highlight Section */}
            {user && recommendations.length > 0 && (
                <section className="bg-slate-900 py-32 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-500/10 to-transparent" />
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/3 space-y-8 text-white">
                                <div className="inline-flex items-center gap-3 bg-rose-500/20 text-rose-400 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border border-rose-500/20">
                                    <Sparkles className="w-4 h-4" /> Elite Recommendations
                                </div>
                                <h2 className="text-5xl font-black leading-[1.1] tracking-tighter">
                                    Specially Selected <br /> <span className="text-slate-500 underline decoration-rose-500 decoration-4">Just For You</span>.
                                </h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    Our analysis of your preferences suggests these homes are the perfect match for your lifestyle.
                                </p>
                                <button className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]">
                                    See your full list
                                </button>
                            </div>
                            <div className="lg:w-2/3 flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
                                {recommendations.slice(0, 3).map(p => (
                                    <div key={p._id} className="min-w-[320px] md:min-w-[400px] snap-center">
                                        <PropertyCard property={p} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Trust Section */}
            <section className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Verified Stays</h4>
                        <p className="text-slate-500 leading-relaxed">Every listing is manually reviewed and approved by our expert team.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Instant Booking</h4>
                        <p className="text-slate-500 leading-relaxed">No wait times. Secure your premium rental with a single, seamless click.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center">
                            <Search className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Smart Search</h4>
                        <p className="text-slate-500 leading-relaxed">Powerful filters and AI search to find exactly what you're looking for.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
