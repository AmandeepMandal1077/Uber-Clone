import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom Icons with SVGs
const createIcon = (color, svgPath) =>
  L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
           <svg width="18" height="18" fill="white" viewBox="0 0 24 24">${svgPath}</svg>
         </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Anchor point at the bottom center
  });

const icons = {
  captain: createIcon(
    "#22c55e",
    `<path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>`
  ),
  user: createIcon(
    "#3b82f6",
    `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`
  ),
  pickup: createIcon(
    "#f97316",
    `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
  ),
  destination: createIcon(
    "#ef4444",
    `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>`
  ),
};

const MapUpdater = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const validPositions = positions.filter((p) => p && p.lat && p.lng);
      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(
          validPositions.map((p) => [p.lat, p.lng])
        );
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      }
    }
  }, [map, positions]);
  return null;
};

const LiveTrackingMap = ({
  rideState,
  captainLocation,
  userLocation,
  pickupCoords,
  destinationCoords,
}) => {
  const positionsToBound = [
    captainLocation,
    userLocation,
    pickupCoords,
    destinationCoords,
  ].filter(Boolean);

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater positions={positionsToBound} />

      {/* Stage 1: Captain moving to Pickup */}
      {rideState === "confirmed" && (
        <>
          {captainLocation && (
            <Marker
              position={[captainLocation.lat, captainLocation.lng]}
              icon={icons.captain}
            >
              <Popup>Captain</Popup>
            </Marker>
          )}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={icons.user}
            >
              <Popup>You</Popup>
            </Marker>
          )}
          {pickupCoords && (
            <Marker
              position={[pickupCoords.lat, pickupCoords.lng]}
              icon={icons.pickup}
            >
              <Popup>Pickup Point</Popup>
            </Marker>
          )}
          {captainLocation && pickupCoords && (
            <Polyline
              positions={[
                [captainLocation.lat, captainLocation.lng],
                [pickupCoords.lat, pickupCoords.lng],
              ]}
              color="#3b82f6"
              dashArray="10, 10"
            />
          )}
        </>
      )}

      {/* Stage 2: Ride in Progress to Destination */}
      {rideState === "ongoing" && (
        <>
          {captainLocation && (
            <Marker
              position={[captainLocation.lat, captainLocation.lng]}
              icon={icons.captain}
            >
              <Popup>Your Ride</Popup>
            </Marker>
          )}
          {destinationCoords && (
            <Marker
              position={[destinationCoords.lat, destinationCoords.lng]}
              icon={icons.destination}
            >
              <Popup>Destination</Popup>
            </Marker>
          )}
          {captainLocation && destinationCoords && (
            <Polyline
              positions={[
                [captainLocation.lat, captainLocation.lng],
                [destinationCoords.lat, destinationCoords.lng],
              ]}
              color="#22c55e"
            />
          )}
        </>
      )}
    </MapContainer>
  );
};

export default LiveTrackingMap;
