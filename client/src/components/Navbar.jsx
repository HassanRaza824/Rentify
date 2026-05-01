import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Heart, User, LogOut, ChevronDown, Building2, Hotel, Warehouse, Store, Plus, Menu, X, Info, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [propertiesOpen, setPropertiesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const propertyCategories = [
        { label: 'All Properties', icon: <Building2 className="w-4 h-4 text-blue-500" />, path: '/properties' },
        { label: 'Apartments', icon: <Hotel className="w-4 h-4 text-indigo-500" />, path: '/properties?type=apartment' },
        { label: 'Houses', icon: <Home className="w-4 h-4 text-emerald-500" />, path: '/properties?type=house' },
        { label: 'Studios', icon: <Warehouse className="w-4 h-4 text-amber-500" />, path: '/properties?type=studio' },
        { label: 'Commercial', icon: <Store className="w-4 h-4 text-rose-500" />, path: '/properties?type=commercial' },
    ];

    return (
        <nav className="glass sticky top-0 z-[100] px-6 md:px-8 py-4 flex items-center justify-between border-b border-white/20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold z-50">
                <Home className="w-8 h-8 text-blue-600" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    RentifyAI
                </span>
            </Link>

            {/* Desktop Center Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>

                {/* Properties Dropdown */}
                <div className="relative" onMouseEnter={() => setPropertiesOpen(true)} onMouseLeave={() => setPropertiesOpen(false)}>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors font-medium">
                        Properties
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${propertiesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {propertiesOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 z-50"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <div className="p-2">
                                        {propertyCategories.map((cat) => (
                                            <Link
                                                key={cat.label}
                                                to={cat.path}
                                                onClick={() => setPropertiesOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-all group"
                                            >
                                                <span className="w-8 h-8 bg-slate-50 group-hover:bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                                                    {cat.icon}
                                                </span>
                                                <span className="font-semibold text-sm">{cat.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-50 p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <Link
                                            to="/properties"
                                            onClick={() => setPropertiesOpen(false)}
                                            className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:underline"
                                        >
                                            <Search className="w-3 h-3" /> Advanced Search
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            </div>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to="/properties" className="text-slate-600 hover:text-blue-600 transition-colors" title="Search Properties">
                            <Search className="w-5 h-5" />
                        </Link>
                        {user.role === 'guest' && (
                            <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors" title="Saved Properties">
                                <Heart className="w-5 h-5" />
                            </Link>
                        )}
                        {user.role === 'host' && (
                            <Link to="/properties/create" className="btn-primary flex items-center gap-1.5 !px-4 !py-2 text-sm shadow-sm" title="Add Listing">
                                <Plus className="w-4 h-4" /> Add Listing
                            </Link>
                        )}
                        {user.role === 'guest' && (
                            <Link to="/dashboard" className="bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                        )}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <Link to="/dashboard" title="Profile Dashboard" className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </Link>
                            <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="px-5 py-2 text-slate-600 font-medium hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="btn-primary flex items-center gap-2 !py-2">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex items-center gap-3 md:hidden z-50">
               {user && (
                    <Link to="/dashboard" title="Profile Dashboard" className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                         {user.name?.charAt(0)?.toUpperCase()}
                    </Link>
               )}
               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 bg-slate-100 rounded-xl">
                   {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
               </button>
            </div>

            {/* Mobile Slide-out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 top-0 right-0 w-full h-screen bg-white/95 backdrop-blur-3xl z-40 flex flex-col pt-24 px-6 md:hidden overflow-y-auto pb-32"
                    >
                        <div className="flex flex-col gap-6 text-xl font-bold text-slate-800">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Home className="w-6 h-6 text-blue-500" /> Home
                            </Link>
                            <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Search className="w-6 h-6 text-indigo-500" /> Advanced Search
                            </Link>
                            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Info className="w-6 h-6 text-emerald-500" /> About
                            </Link>

                            <div className="h-px bg-slate-100 my-2" />

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4">Categories</h4>
                                {propertyCategories.map((cat) => (
                                    <Link
                                        key={cat.label}
                                        to={cat.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-lg"
                                    >
                                        {cat.icon} {cat.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 my-2" />

                            {user ? (
                                <div className="space-y-4">
                                     {user.role === 'host' ? (
                                         <Link to="/properties/create" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
                                             <Plus className="w-6 h-6" /> Add Listing
                                         </Link>
                                     ) : (
                                         <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-slate-100 text-slate-900 shadow-sm active:scale-95 transition-all font-bold">
                                             <LayoutDashboard className="w-6 h-6" /> Dashboard
                                         </Link>
                                     )}
                                     <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                         <LogOut className="w-6 h-6" /> Log Out
                                     </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center p-4 rounded-2xl bg-slate-100 text-slate-700">
                                        Log In
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center p-4 rounded-2xl bg-blue-600 text-white shadow-lg">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
