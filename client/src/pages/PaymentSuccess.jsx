import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Home, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const bookingId = searchParams.get('bookingId');

    useEffect(() => {
        const confirmPayment = async () => {
            if (!bookingId) return setLoading(false);
            try {
                await api.post('/payments/confirm', { bookingId });
                toast.success('Booking confirmed!');
            } catch (error) {
                console.error('Confirmation error:', error);
                toast.error('Failed to verify payment status');
            }
            setLoading(false);
        };
        confirmPayment();
    }, [bookingId]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-10 text-center space-y-8 border border-slate-100"
            >
                <div className="relative">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
                    >
                        {loading ? <Loader2 className="w-12 h-12 animate-spin" /> : <CheckCircle2 className="w-12 h-12" />}
                    </motion.div>
                    {!loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -top-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900">Payment Successful!</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Your transaction was processed successfully. Your stay is now officially booked!
                    </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Booking ID</span>
                    <span className="text-sm font-black text-blue-600">#{bookingId?.slice(-6).toUpperCase() || 'N/A'}</span>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full btn-primary !py-4 flex items-center justify-center gap-2 text-lg"
                    >
                        Go to Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </button>
                </div>

                <p className="text-xs text-slate-400 font-medium">
                    A confirmation email has been sent to your registered address.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
