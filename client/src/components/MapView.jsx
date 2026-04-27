import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { animate: true, duration: 1.5 });
        }
    }, [center, map]);
    return null;
};

const MapView = ({ latitude, longitude, title }) => {
    // Default to Karachi if coords are missing
    const position = [latitude || 24.8607, longitude || 67.0011];

    return (
        <div className="h-[400px] w-full rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 relative z-0">
            <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                />
                <MapUpdater center={position} />
                <Marker position={position}>
                    <Popup className="font-sans font-bold text-slate-800">
                        {title}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapView;
