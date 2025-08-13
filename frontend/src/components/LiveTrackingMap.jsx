import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Custom icons
const createCustomIcon = (color, type) => {
  const iconHtml =
    type === "captain"
      ? `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
         <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
           <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
         </svg>
       </div>`
      : type === "user"
      ? `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
         <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
           <path d="M12 2C8 2 5 5 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5 16 2 12 2M12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7Z"/>
         </svg>
       </div>`
      : `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
         <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
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

// Component to handle map updates
const MapUpdater = ({ center, markers, rideState }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      if (rideState === "ongoing" && markers.length >= 2) {
        // For ongoing rides, fit bounds to show captain, user, and destination
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [20, 20] });
      } else if (center) {
        // For other states, center on the provided location
        map.setView([center.lat, center.lng], 15);
      }
    }
  }, [map, center, markers, rideState]);

  return null;
};

const LiveTrackingMap = ({
  userLocation,
  captainLocation,
  pickupLocation,
  destinationLocation,
  rideState = "waiting", // 'waiting', 'confirmed', 'ongoing', 'completed'
  className = "h-full w-full",
}) => {
  // Initialize with a more generic location, but update it dynamically
  const [mapCenter, setMapCenter] = useState(() => {
    // Try to use any available location first, otherwise fallback to Delhi
    return (
      captainLocation ||
      userLocation ||
      pickupLocation || { lat: 28.6139, lng: 77.209 }
    );
  });
  const [markers, setMarkers] = useState([]);

  // Update map center and markers based on ride state
  useEffect(() => {
    const newMarkers = [];

    // Add captain marker if available
    if (captainLocation) {
      newMarkers.push({
        ...captainLocation,
        type: "captain",
        popup: "Your Captain",
      });
    }

    // Add user marker if available
    if (userLocation) {
      newMarkers.push({
        ...userLocation,
        type: "user",
        popup: "User Location",
      });
    }

    // Add pickup location marker
    if (pickupLocation) {
      newMarkers.push({
        ...pickupLocation,
        type: "pickup",
        popup: "Pickup Location",
      });
    }

    // Add destination marker if available
    if (destinationLocation) {
      newMarkers.push({
        ...destinationLocation,
        type: "destination",
        popup: "Destination",
      });
    }

    setMarkers(newMarkers);

    // Set map center based on ride state
    if (rideState === "waiting" && userLocation) {
      setMapCenter(userLocation);
    } else if (rideState === "confirmed" && captainLocation) {
      setMapCenter(captainLocation);
    } else if (rideState === "ongoing" && captainLocation) {
      setMapCenter(captainLocation);
    } else if (captainLocation) {
      // For captains, always center on their location if available
      setMapCenter(captainLocation);
    } else if (userLocation) {
      // For users, center on their location if available
      setMapCenter(userLocation);
    } else if (pickupLocation) {
      setMapCenter(pickupLocation);
    }
  }, [
    userLocation,
    captainLocation,
    pickupLocation,
    destinationLocation,
    rideState,
  ]);

  const getMarkerIcon = (marker) => {
    switch (marker.type) {
      case "captain":
        return createCustomIcon("#10B981", "captain"); // Green for captain
      case "user":
        return createCustomIcon("#3B82F6", "user"); // Blue for user
      case "pickup":
        return createCustomIcon("#F59E0B", "pickup"); // Orange for pickup
      case "destination":
        return createCustomIcon("#EF4444", "destination"); // Red for destination
      default:
        return createCustomIcon("#6B7280", "default"); // Gray for default
    }
  };

  return (
    <div className={className}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapUpdater
          center={mapCenter}
          markers={markers}
          rideState={rideState}
        />

        {markers.map((marker, index) => (
          <Marker
            key={`${marker.type}-${index}`}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker)}
          >
            <Popup>
              <div className="text-center">
                <strong>{marker.popup}</strong>
                {marker.type === "captain" && (
                  <div className="mt-1 text-sm text-gray-600">
                    Live location
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Status indicator */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              rideState === "waiting"
                ? "bg-yellow-500"
                : rideState === "confirmed"
                ? "bg-blue-500"
                : rideState === "ongoing"
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {rideState === "waiting" && "Waiting for captain"}
            {rideState === "confirmed" && "Captain is coming"}
            {rideState === "ongoing" && "Trip in progress"}
            {rideState === "completed" && "Trip completed"}
          </span>
        </div>
      </div>

      {/* Legend */}
      {markers.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold mb-2">Legend</div>
          {markers.map((marker, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    marker.type === "captain"
                      ? "bg-green-500"
                      : marker.type === "user"
                      ? "bg-blue-500"
                      : marker.type === "pickup"
                      ? "bg-orange-500"
                      : marker.type === "destination"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>
              <span className="text-xs">
                {marker.type === "captain" && "Captain"}
                {marker.type === "user" && "Passenger"}
                {marker.type === "pickup" && "Pickup"}
                {marker.type === "destination" && "Destination"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
