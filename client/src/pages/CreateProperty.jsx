import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { toast } from 'react-hot-toast';
import { Home, MapPin, DollarSign, Image, Upload, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const propertyTypes = ['apartment', 'house', 'studio', 'commercial'];
const amenityOptions = ['wifi', 'parking', 'garden', 'pool', 'security'];

// Component to recenter map when position changes
const RecenterMap = ({ center }) => {
    const map = useMap();
    React.useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 13);
        }
    }, [center, map]);
    return null;
};

// Component to handle map clicks
const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : <Marker position={[position.lat, position.lng]}></Marker>;
};

const CreateProperty = () => {
    const navigate = useNavigate();
    const { createProperty } = useProperties();
    const [loading, setLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [position, setPosition] = useState({ lat: 24.8607, lng: 67.0011 }); // Default to Karachi

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: '',
        propertyType: 'apartment',
        amenities: [],
        images: [],
    });

    const geocodeCity = async (cityName) => {
        if (!cityName) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const newPos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                setPosition(newPos);
            }
        } catch (err) {
            console.error('Geocoding error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCityBlur = () => {
        geocodeCity(formData.city);
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, images: files }));
        const previews = files.map(f => URL.createObjectURL(f));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            return toast.error("Please upload at least one image");
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key === 'images') {
                    val.forEach(img => data.append('images', img));
                } else if (key === 'amenities') {
                    data.append('amenities', JSON.stringify(val));
                } else {
                    data.append(key, val);
                }
            });
            // Append map coordinates
            data.append('latitude', position.lat);
            data.append('longitude', position.lng);

            await createProperty(data);
            toast.success('Property listed successfully!');
            navigate('/properties');
        } catch (error) {
            console.error('Submission error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown API Error';
            toast.error(`Failed to create property: ${errorMsg}`);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-14 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-slate-900">List a Property</h1>
                        <p className="text-slate-500 text-lg">Reach thousands of renters with your AI-powered listing.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Home className="w-5 h-5 text-blue-500" /> Basic Information
                            </h3>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Property Title</label>
                                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                    placeholder="e.g. Modern 2BR Apartment in Downtown"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                <textarea name="description" required value={formData.description} onChange={handleChange}
                                    placeholder="Describe the key features, atmosphere, and what makes this place special..."
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Property Type</label>
                                    <div className="relative">
                                        <select name="propertyType" value={formData.propertyType} onChange={handleChange}
                                            className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none capitalize pr-10 cursor-pointer"
                                        >
                                            {propertyTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Monthly Rent (USD)
                                    </label>
                                    <input type="number" name="price" required min="1" value={formData.price} onChange={handleChange}
                                        placeholder="e.g. 2500"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-500" /> Location
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                                <input type="text" name="city" required value={formData.city} onChange={handleChange} onBlur={handleCityBlur}
                                    placeholder="e.g. Karachi"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Pin on Map (Click to set property location)</label>
                                <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                                    <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                                            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        />
                                        <RecenterMap center={position} />
                                        <LocationPicker position={position} setPosition={setPosition} />
                                    </MapContainer>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-right">
                                    Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                                </p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800">Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {amenityOptions.map(amenity => (
                                    <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all capitalize ${formData.amenities.includes(amenity)
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Image className="w-5 h-5 text-indigo-500" /> Property Photos
                            </h3>
                            <label className="flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl p-10 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                <Upload className="w-10 h-10 text-slate-300" />
                                <div className="text-center">
                                    <p className="font-bold text-slate-700">Click to upload images</p>
                                    <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB each. Minimum 1 required.</p>
                                </div>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                            </label>
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {previewImages.map((src, i) => (
                                        <div key={i} className="h-32 rounded-2xl overflow-hidden border border-slate-100">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-3 !py-5 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" /> Publish Listing
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateProperty;
