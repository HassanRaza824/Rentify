import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles, Brain, Shield, Map, MessageSquare, Star,
    ArrowRight, Users, Home, TrendingUp, CheckCircle2
} from 'lucide-react';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
};

const About = () => {
    const stats = [
        { value: '12,000+', label: 'Properties Listed', icon: <Home className="w-6 h-6 text-blue-500" /> },
        { value: '98%', label: 'Match Accuracy', icon: <TrendingUp className="w-6 h-6 text-emerald-500" /> },
        { value: '45,000+', label: 'Happy Renters', icon: <Users className="w-6 h-6 text-indigo-500" /> },
        { value: '4.9 ★', label: 'Average Rating', icon: <Star className="w-6 h-6 text-amber-500" /> },
    ];

    const features = [
        {
            icon: <Brain className="w-7 h-7 text-blue-600" />,
            bg: 'bg-blue-50 border-blue-100',
            title: 'AI Recommendation Engine',
            desc: 'Our proprietary weighted scoring algorithm analyzes your budget, preferred location, property type, and desired amenities to surface the most relevant listings — ranked just for you.',
        },
        {
            icon: <Map className="w-7 h-7 text-emerald-600" />,
            bg: 'bg-emerald-50 border-emerald-100',
            title: 'Interactive Map & Nearby Places',
            desc: 'Explore properties visually with our interactive map. Instantly see nearby schools, hospitals, restaurants, shopping centers and their distances from any listing.',
        },
        {
            icon: <MessageSquare className="w-7 h-7 text-indigo-600" />,
            bg: 'bg-indigo-50 border-indigo-100',
            title: 'Natural Language Chatbot',
            desc: 'No complicated forms needed. Simply tell our AI assistant what you\'re looking for — "Find a 2-bedroom apartment in Karachi under 50,000" — and it instantly finds matches.',
        },
        {
            icon: <Shield className="w-7 h-7 text-rose-600" />,
            bg: 'bg-rose-50 border-rose-100',
            title: 'Verified & Secure',
            desc: 'Every listing is moderated by our admin team. All communications are end-to-end secured with JWT authentication, and owner identities are verified before approval.',
        },
    ];

    const howItWorks = [
        { step: '01', title: 'Set Your Preferences', desc: 'Tell us your budget, favorite city, property type, and must-have amenities through your personalized dashboard.' },
        { step: '02', title: 'AI Finds Your Matches', desc: 'Our algorithm scores every listing on the platform and surfaces the top matches ranked specifically for your preferences.' },
        { step: '03', title: 'Explore on the Map', desc: 'Browse matched properties visually. Click any listing to view its location, interior photos, and nearby points of interest.' },
        { step: '04', title: 'Contact & Move In', desc: 'Reach out directly to verified property owners with a single click. We also send an email notification instantly.' },
    ];

    const team = [
        { name: 'Hassan Dhillon', role: 'Founder & CEO', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan&backgroundColor=b6e3f4' },
        { name: 'Sarah Ahmed', role: 'Head of AI', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede' },
        { name: 'James Park', role: 'Lead Engineer', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1d4f9' },
    ];

    return (
        <div className="bg-white overflow-hidden">

            {/* ── Hero ────────────────────────────── */}
            <section className="relative bg-slate-900 text-white py-32 px-6 text-center overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

                <motion.div {...fadeUp} className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <span className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-sm font-bold px-5 py-2 rounded-full">
                        <Sparkles className="w-4 h-4" /> About RentifyAI
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        The Smarter Way <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            to Find Home
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        RentifyAI is an AI-powered rental platform that cuts through the noise — learning what you love and connecting you with properties that genuinely match your life.
                    </p>
                    <Link to="/properties" className="inline-flex items-center gap-2 btn-primary mt-4 !px-10 !py-4 text-lg">
                        Browse Properties <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>

            {/* ── Stats ───────────────────────────── */}
            <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center space-y-2">
                            <div className="flex justify-center mb-2 opacity-80">{s.icon}</div>
                            <p className="text-4xl font-extrabold">{s.value}</p>
                            <p className="text-blue-100 text-sm font-medium">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Mission ─────────────────────────── */}
            <section className="py-28 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeUp} className="space-y-6">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Mission</span>
                        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                            We believe finding a home should feel exciting, not exhausting.
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            The traditional rental search is broken — overwhelming listings, irrelevant results, and little transparency. We built RentifyAI to fix that by combining modern artificial intelligence with an intuitive, human-first design.
                        </p>
                        <ul className="space-y-3">
                            {['Zero irrelevant listings', 'AI that learns your taste', 'Transparent pricing', 'Direct owner communication'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Beautiful property"
                                className="w-full h-[450px] object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900 text-2xl">98%</p>
                                <p className="text-slate-400 text-xs font-semibold">AI Match Accuracy</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Key Features ────────────────────── */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Platform Features</span>
                        <h2 className="text-4xl font-extrabold text-slate-900">Everything you need, nothing you don't</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Built with renters in mind at every step of the journey.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                                className={`p-8 rounded-[2.5rem] border ${f.bg} space-y-4 hover:shadow-lg transition-all`}
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it Works ────────────────────── */}
            <section className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
                        <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Simple Process</span>
                        <h2 className="text-4xl font-extrabold text-slate-900">From search to keys in 4 steps</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative text-center space-y-4 group">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-extrabold shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
                                    {step.step}
                                </div>
                                {i < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />
                                )}
                                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ────────────────────────────── */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto text-center space-y-16">
                    <motion.div {...fadeUp} className="space-y-3">
                        <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">Our Team</span>
                        <h2 className="text-4xl font-extrabold">Built by people who love technology & homes</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {team.map((member, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4 hover:bg-white/10 transition-all"
                            >
                                <img src={member.img} alt={member.name} className="w-24 h-24 rounded-3xl mx-auto bg-slate-700" />
                                <div>
                                    <h4 className="font-bold text-xl">{member.name}</h4>
                                    <p className="text-blue-300 text-sm font-medium">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────── */}
            <section className="py-28 px-6 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-5xl font-extrabold leading-tight">Ready to find your perfect home?</h2>
                    <p className="text-blue-100 text-xl">Join over 45,000 renters who found their dream properties using our AI-powered platform.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register" className="bg-white text-blue-700 font-bold px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg">
                            Get Started Free
                        </Link>
                        <Link to="/properties" className="border-2 border-white/40 text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/10 transition-all text-lg flex items-center gap-2">
                            Browse Properties <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>

        </div>
    );
};

export default About;
