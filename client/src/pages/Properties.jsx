import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, LayoutGrid, List, SlidersHorizontal, Building2, Hotel, Warehouse, Store, Home as HomeIcon } from 'lucide-react';

const CategoryBar = ({ activeType, onSelect }) => {
    const categories = [
        { id: '', label: 'All', icon: <LayoutGrid className="w-5 h-5" /> },
        { id: 'apartment', label: 'Apartments', icon: <Hotel className="w-5 h-5" /> },
        { id: 'house', label: 'Houses', icon: <HomeIcon className="w-5 h-5" /> },
        { id: 'studio', label: 'Studios', icon: <Warehouse className="w-5 h-5" /> },
        { id: 'commercial', label: 'Commercial', icon: <Store className="w-5 h-5" /> },
    ];

    return (
        <div className="flex items-center gap-8 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`flex flex-col items-center gap-2 min-w-fit transition-all duration-300 pb-2 border-b-2 ${activeType === cat.id
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                        }`}
                >
                    <div className={`p-2 rounded-xl transition-colors ${activeType === cat.id ? 'bg-slate-100' : ''}`}>
                        {cat.icon}
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">{cat.label}</span>
                </button>
            ))}
        </div>
    );
};

const Properties = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, loading, fetchProperties } = useProperties();

    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        type: searchParams.get('type') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        amenities: searchParams.get('amenities') || '',
    });

    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const currentFilters = Object.fromEntries([...searchParams]);
        fetchProperties(currentFilters);
    }, [searchParams]);

    const applyFilters = () => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        );
        setSearchParams(activeFilters);
    };

    const sortedProperties = [...properties].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <div className="bg-white min-h-screen pt-10 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Category Bar */}
                <CategoryBar
                    activeType={filters.type}
                    onSelect={(type) => {
                        const newFilters = { ...filters, type };
                        setFilters(newFilters);
                        const activeFilters = Object.fromEntries(
                            Object.entries(newFilters).filter(([_, v]) => v !== '')
                        );
                        setSearchParams(activeFilters);
                    }}
                />

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold text-slate-900">Discover Properties</h1>
                        <p className="text-slate-500 font-medium">
                            Found {properties.length} available properties matching your criteria
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="City or neighborhood..."
                                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>

                        <select
                            className="bg-white border border-slate-100 rounded-2xl px-6 py-3 text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12 pt-4">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                applyFilters={applyFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <main className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-[480px] bg-slate-50 border border-slate-100 animate-pulse rounded-[2.5rem]" />
                                ))}
                            </div>
                        ) : sortedProperties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                {sortedProperties.map(property => (
                                    <div key={property._id} className="h-full">
                                        <PropertyCard property={property} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-20 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                    <Search className="w-10 h-10 text-slate-300" />
                                </div>
                                <div className="max-w-xs mx-auto">
                                    <h3 className="text-xl font-bold text-slate-900">No results found</h3>
                                    <p className="text-slate-500 mt-2">Broaden your search or update your filters to find more properties.</p>
                                    <button
                                        onClick={() => {
                                            setFilters({ location: '', type: '', minPrice: '', maxPrice: '', amenities: '' });
                                            setSearchParams({});
                                        }}
                                        className="mt-6 text-blue-600 font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Properties;
