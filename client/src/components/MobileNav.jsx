import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { icon: <Search className="w-6 h-6" />, label: 'Explore', path: '/properties' },
        { icon: <Heart className="w-6 h-6" />, label: 'Wishlist', path: '/dashboard', tab: 'saved' },
        { icon: <PlusCircle className="w-6 h-6" />, label: 'Host', path: '/properties/create' },
        { icon: <User className="w-6 h-6" />, label: user ? 'Profile' : 'Log in', path: user ? '/dashboard' : '/login' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-[90] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => (
                <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 transition-all ${location.pathname === item.path
                            ? 'text-rose-500'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MobileNav;
