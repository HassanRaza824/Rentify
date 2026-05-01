import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles, Brain, Shield, Map, MessageSquare, Star,
    ArrowRight, Users, Home, TrendingUp, CheckCircle2,
    Target, Zap, Globe, Award
} from 'lucide-react';

// --- Custom Components ---

const Counter = ({ value, label, icon }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);
    const target = parseInt(value.replace(/[^0-9]/g, ''));

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    const suffix = value.replace(/[0-9]/g, '');

    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors group"
        >
            <div className="p-4 bg-blue-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="text-4xl font-black text-white mb-1">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-blue-200/60 text-sm font-medium uppercase tracking-wider text-center">
                {label}
            </div>
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -10 }}
        className="group relative p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-500"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
        <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 text-blue-500">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {desc}
            </p>
        </div>
    </motion.div>
);

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const stats = [
        { value: '12,000+', label: 'Properties Listed', icon: <Home className="w-6 h-6" /> },
        { value: '98%', label: 'Match Accuracy', icon: <TrendingUp className="w-6 h-6" /> },
        { value: '45,000+', label: 'Happy Renters', icon: <Users className="w-6 h-6" /> },
        { value: '4.9', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
    ];

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI Recommendation Engine',
            desc: 'Our proprietary weighted scoring algorithm analyzes your budget, preferred location, and lifestyle to surface listings ranked just for you.',
        },
        {
            icon: <Map className="w-8 h-8" />,
            title: 'Interactive Spatial Search',
            desc: 'Explore properties with a neural map overlay that visualizes commute times, neighborhood vibes, and essential local amenities.',
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'Semantic Assistance',
            desc: 'No more rigid filters. Just type what you need: "A cozy studio near the park for under $2k" and let our AI do the heavy lifting.',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Verified Trust Protocol',
            desc: 'Every listing undergoes a 12-point verification process. We ensure what you see is exactly what you get, with zero exceptions.',
        },
    ];

    const howItWorks = [
        { 
            step: '01', 
            title: 'Onboarding', 
            desc: 'Define your lifestyle preferences, not just your budget.',
            icon: <Target className="w-6 h-6 text-blue-400" />
        },
        { 
            step: '02', 
            title: 'AI Curation', 
            desc: 'Our engine processes millions of data points to find your match.',
            icon: <Zap className="w-6 h-6 text-amber-400" />
        },
        { 
            step: '03', 
            title: 'Virtual Tours', 
            desc: 'Experience properties in high-fidelity before you even visit.',
            icon: <Globe className="w-6 h-6 text-emerald-400" />
        },
        { 
            step: '04', 
            title: 'Secure Booking', 
            desc: 'Finalize your lease with end-to-end encrypted documentation.',
            icon: <Award className="w-6 h-6 text-rose-400" />
        },
    ];

    return (
        <div ref={containerRef} className="bg-slate-950 text-slate-200 overflow-hidden font-sans">
            
            {/* --- Hero Section --- */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" 
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]" 
                    />
                </div>

                <motion.div 
                    style={{ y, opacity: opacityHero, scale: scaleHero }}
                    className="relative z-10 max-w-6xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        Next-Gen Rental Platform
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500"
                    >
                        The Future of <br />
                        Living is <span className="text-blue-500">Personal</span>.
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        RentifyAI leverages deep learning to understand your lifestyle, 
                        eliminating the stress of home searching with high-precision matches.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-6"
                    >
                        <Link 
                            to="/properties" 
                            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] flex items-center gap-3"
                        >
                            Explore Marketplace <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-2xl font-bold text-lg transition-all">
                            How it Works
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* --- Stats Section --- */}
            <section className="py-20 px-6 relative z-10 -mt-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Counter key={i} {...stat} />
                    ))}
                </div>
            </section>

            {/* --- Mission & Image --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            We aren't just a platform. <br />
                            <span className="text-blue-500">We're your search partner.</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Traditional real estate is static. We make it dynamic. By analyzing thousands of neighborhood variables and property details, we provide a personalized score for every home based on your unique profile.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                "No more ghost listings",
                                "Hyper-local data insights",
                                "AI-powered negotiation",
                                "Instant owner connection"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-square lg:aspect-video shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
                                alt="Modern Interior" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 p-8 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-2xl">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">2.5s</div>
                                    <div className="text-sm text-slate-400">Avg. Matching Speed</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="py-32 px-6 bg-slate-900/50 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4 block"
                        >
                            Core Capabilities
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                        >
                            Designed for the modern renter.
                        </motion.h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            We've re-engineered every step of the rental process to be smarter, 
                            faster, and more transparent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <FeatureCard key={i} {...f} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Simple, yet powerful.</h2>
                            <p className="text-slate-400 text-lg">Four steps to your next chapter. No paperwork, no stress.</p>
                        </div>
                        <div className="h-px bg-slate-800 flex-grow mx-12 hidden lg:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {howItWorks.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className="text-8xl font-black text-slate-900 absolute -top-10 -left-4 pointer-events-none">
                                    {step.step}
                                </div>
                                <div className="relative z-10 pt-8">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl w-fit mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* --- CTA Section --- */}

            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                                Start your journey <br /> with RentifyAI.
                            </h2>
                            <p className="text-xl text-blue-100 mb-12 font-medium">
                                Join 45,000+ others who have found their perfect space through our AI-powered curation.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link 
                                    to="/register" 
                                    className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl"
                                >
                                    Get Started Free
                                </Link>
                                <Link 
                                    to="/properties" 
                                    className="px-12 py-6 bg-blue-700 text-white border border-blue-500 rounded-2xl font-black text-xl hover:bg-blue-800 transition-all"
                                >
                                    View Listings
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm border-t border-white/5">
                © {new Date().getFullYear()} RentifyAI. Built with passion for better living.
            </footer>

        </div>
    );
};

export default About;
