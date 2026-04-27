import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Home } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Home className="w-8 h-8 text-blue-500" />
                        <span>RentifyAI</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                        Revolutionizing the property rental market with AI-powered matching and seamless user experiences.
                    </p>
                    <div className="flex gap-4">
                        <Facebook className="w-5 h-5 hover:text-blue-500 cursor-pointer transition-colors" />
                        <Twitter className="w-5 h-5 hover:text-sky-400 cursor-pointer transition-colors" />
                        <Instagram className="w-5 h-5 hover:text-pink-500 cursor-pointer transition-colors" />
                        <Linkedin className="w-5 h-5 hover:text-blue-700 cursor-pointer transition-colors" />
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><a href="/" className="hover:text-blue-500 transition-colors">Home</a></li>
                        <li><a href="/properties" className="hover:text-blue-500 transition-colors">Properties</a></li>
                        <li><a href="/about" className="hover:text-blue-500 transition-colors">About Us</a></li>
                        <li><a href="/contact" className="hover:text-blue-500 transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500" />
                            <span>support@rentifyai.com</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-500" />
                            <span>+1 (234) 567-890</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-blue-500" />
                            <span>123 AI Street, Tech City</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} RentifyAI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
