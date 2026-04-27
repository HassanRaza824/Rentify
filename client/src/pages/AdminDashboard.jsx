import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Users, Building2, BarChart3, Check, X, ShieldCheck,
    TrendingUp, Activity, ArrowUpRight, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [activeView, setActiveView] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                toast.error('Failed to load admin data');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleApprove = async (id, isApproved) => {
        try {
            await api.put(`/admin/properties/${id}/approve`, { isApproved });
            toast.success(`Property ${isApproved ? 'approved' : 'rejected'}`);
            // Refresh stats
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            toast.error('Failed to update property status');
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading Admin Suite...</div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-10 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold text-slate-900">Admin Control Center</h1>
                        <p className="text-slate-500 font-medium">Manage platform activity and approve new listings</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        <button
                            onClick={() => setActiveView('overview')}
                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeView === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <BarChart3 className="w-5 h-5" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveView('users')}
                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeView === 'users' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Users className="w-5 h-5" /> Users
                        </button>
                    </div>
                </div>

                {activeView === 'overview' && (
                    <div className="space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +12%
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wide">Total Users</h4>
                                    <p className="text-5xl font-extrabold text-slate-900">{stats?.totalUsers}</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +5%
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wide">Total Properties</h4>
                                    <p className="text-5xl font-extrabold text-slate-900">{stats?.totalProperties}</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                                        Pending
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wide">Pending Approval</h4>
                                    <p className="text-5xl font-extrabold text-slate-900">{stats?.pendingProperties}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Table */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-blue-500" /> Recent Property Submissions
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-sm uppercase font-bold border-b border-slate-50">
                                            <th className="pb-6">Property</th>
                                            <th className="pb-6">Price</th>
                                            <th className="pb-6">Location</th>
                                            <th className="pb-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {stats?.recentProperties.map(p => (
                                            <tr key={p._id} className="group hover:bg-slate-50 transition-all">
                                                <td className="py-6 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                                                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-slate-800">{p.title}</span>
                                                </td>
                                                <td className="py-6 font-bold text-slate-600">${p.price}/mo</td>
                                                <td className="py-6 text-slate-500">{p.city}</td>
                                                <td className="py-6 text-right space-x-2">
                                                    {!p.isApproved ? (
                                                        <button
                                                            onClick={() => handleApprove(p._id, true)}
                                                            className="bg-emerald-100 text-emerald-600 p-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
                                                            <ShieldCheck className="w-4 h-4" /> Approved
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleApprove(p._id, false)}
                                                        className="bg-rose-100 text-rose-600 p-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'users' && (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Users className="w-6 h-6 text-indigo-500" /> Platform User Directory
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.map(u => (
                                <div key={u._id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all cursor-default group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-bold text-xl border border-slate-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 truncate">{u.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                    </div>
                                    <div className="ml-auto">
                                        {u.isAdmin && <ShieldCheck className="w-5 h-5 text-blue-600" title="Admin User" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
