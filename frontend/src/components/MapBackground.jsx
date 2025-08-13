import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default markers for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom captain icon
const createCaptainIcon = () => {
  const iconHtml = `<div style="background-color: #c1121f; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
    </svg>
  </div>`;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

/**
 * A functional map component for captain background
 * Shows the captain's current location on a real map
 */
const MapBackground = ({ center }) => {
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default to Mumbai
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (center && center.lat && center.lng) {
      setMapCenter([center.lat, center.lng]);
      setZoom(15);
    }
  }, [center]);

  // Fallback if no location is available
  if (!center || !center.lat || !center.lng) {
    return (
      <div className="absolute inset-0 bg-[#003049] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Getting your location...</p>
          <p className="text-sm mt-2">
            Please enable location access to see the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        key={`${mapCenter[0]}-${mapCenter[1]}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Captain's location marker */}
        <Marker position={mapCenter} icon={createCaptainIcon()}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <br />
              Lat: {center.lat.toFixed(4)}
              <br />
              Lng: {center.lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapBackground;
