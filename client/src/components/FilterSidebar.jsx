import React from 'react';
import { Filter, Sliders, X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, applyFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const propertyTypes = ['apartment', 'house', 'studio', 'commercial'];
    const amenities = ['wifi', 'parking', 'garden', 'pool', 'security'];

    const toggleAmenity = (amenity) => {
        const current = filters.amenities ? filters.amenities.split(',') : [];
        const updated = current.includes(amenity)
            ? current.filter(a => a !== amenity)
            : [...current, amenity];
        setFilters({ ...filters, amenities: updated.join(',') });
    };

    return (
        <div className="space-y-10 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-rose-500" />
                    Filters
                </h3>
                <button
                    onClick={() => {
                        setFilters({ location: '', type: '', minPrice: '', maxPrice: '', amenities: '' });
                        applyFilters();
                    }}
                    className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Property Type */}
            <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Property Type</h4>
                <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
                            className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all capitalize ${filters.type === type
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Monthly Budget</h4>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            name="minPrice"
                            className="w-full bg-slate-50 border border-transparent rounded-2xl pl-8 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                            value={filters.minPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-4 h-[2px] bg-slate-200" />
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            name="maxPrice"
                            className="w-full bg-slate-50 border border-transparent rounded-2xl pl-8 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                            value={filters.maxPrice}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                        <button
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-4 py-2.5 rounded-full text-[11px] font-black border transition-all uppercase tracking-wider ${filters.amenities?.includes(amenity)
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-100'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                                }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={applyFilters}
                className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
            >
                Show Results
            </button>
        </div>
    );
};

export default FilterSidebar;
