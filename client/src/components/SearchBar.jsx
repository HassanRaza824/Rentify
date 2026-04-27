import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home } from 'lucide-react';

const SearchBar = ({ initialFilters = {} }) => {
    const [formData, setFormData] = useState({
        location: initialFilters.location || '',
        type: initialFilters.type || '',
    });
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(formData).toString();
        navigate(`/properties?${queryParams}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="bg-white p-2 sm:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl mx-auto border border-slate-100"
        >
            <div className="flex-1 w-full flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                <MapPin className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Where are you looking?"
                    className="w-full focus:outline-none text-slate-700 bg-transparent py-2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
            </div>

            <div className="flex-1 w-full flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                <Home className="text-indigo-500 w-5 h-5 flex-shrink-0" />
                <select
                    className="w-full focus:outline-none text-slate-700 bg-transparent py-2 appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                    <option value="">Any Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="commercial">Commercial</option>
                </select>
            </div>

            <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 py-3 px-8">
                <Search className="w-5 h-5" />
                <span>Search</span>
            </button>
        </form>
    );
};

export default SearchBar;
