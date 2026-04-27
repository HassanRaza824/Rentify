import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('rentify_token');
        const savedUser = localStorage.getItem('rentify_user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('rentify_token', data.token);
        localStorage.setItem('rentify_user', JSON.stringify(data));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('rentify_token', data.token);
        localStorage.setItem('rentify_user', JSON.stringify(data));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('rentify_token');
        localStorage.removeItem('rentify_user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        const { data } = await api.put('/auth/profile', profileData);
        const updated = { ...user, ...data };
        localStorage.setItem('rentify_user', JSON.stringify(updated));
        setUser(updated);
        return updated;
    };

    const toggleFavorite = async (propertyId) => {
        try {
            const { data } = await api.post('/auth/favorites', { propertyId });
            const updated = { ...user, savedProperties: data };
            localStorage.setItem('rentify_user', JSON.stringify(updated));
            setUser(updated);
            return data;
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, toggleFavorite }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
