import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { mockProperties } from '../utils/mockData';

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
    const [properties, setProperties] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProperties = async (filters = {}) => {
        setLoading(true);
        try {
            const { data } = await api.get('/properties', { params: filters });
            setProperties(data);
        } catch (error) {
            // Fallback to mock data when backend is unavailable
            let filtered = [...mockProperties];
            if (filters.location) {
                filtered = filtered.filter(p =>
                    p.city.toLowerCase().includes(filters.location.toLowerCase())
                );
            }
            if (filters.type) {
                filtered = filtered.filter(p => p.propertyType === filters.type);
            }
            if (filters.minPrice) {
                filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
            }
            setProperties(filtered);
        }
        setLoading(false);
    };

    const fetchRecommendations = async (userId) => {
        try {
            const { data } = await api.get(`/properties/recommendations/${userId}`);
            setRecommendations(data);
        } catch (error) {
            // Show top-scored mock properties as recommendations
            const top = [...mockProperties].sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
            setRecommendations(top);
        }
    };

    const createProperty = async (formData) => {
        const { data } = await api.post('/properties', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProperties([data, ...properties]);
        return data;
    };

    const fetchMyListings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/properties/mylistings');
            return data;
        } catch (error) {
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRentals = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/properties/myrentals');
            return data;
        } catch (error) {
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deleteProperty = async (id) => {
        try {
            await api.delete(`/properties/${id}`);
            setProperties(prev => prev.filter(p => p._id !== id));
            return true;
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            recommendations,
            loading,
            fetchProperties,
            fetchRecommendations,
            createProperty,
            fetchMyListings,
            fetchMyRentals,
            deleteProperty
        }}>
            {children}
        </PropertyContext.Provider>
    );
};
