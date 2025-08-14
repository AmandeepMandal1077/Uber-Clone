import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Enhanced Custom Icons with better SVGs
const createIcon = (color, svgPath, size = 40) =>
  L.divIcon({
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
           <svg width="${size * 0.5}" height="${
      size * 0.5
    }" fill="white" viewBox="0 0 24 24">${svgPath}</svg>
         </div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });

const icons = {
  captain: createIcon(
    "#22c55e",
    `<path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>`,
    45
  ),
  user: createIcon(
    "#3b82f6",
    `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`,
    40
  ),
  pickup: createIcon(
    "#f97316",
    `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`,
    42
  ),
  destination: createIcon(
    "#ef4444",
    `<path d="M9 11H7l3-3 3 3h-2v8h-2v-8z M5 2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z"/>`,
    42
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
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
      }
    }
  }, [map, positions]);

  return null;
};

const EnhancedLiveTrackingMap = ({
  rideState,
  rideId,
  captainLocation,
  userLocation,
  pickupCoords,
  destinationCoords,
  onRouteUpdate,
}) => {
  const [primaryRoute, setPrimaryRoute] = useState([]);
  const [routeType, setRouteType] = useState("");
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get route data from backend
  const fetchRouteData = useCallback(async () => {
    if (!rideId || !captainLocation) return;

    setIsLoadingRoute(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/map/get-ride-route`,
        {
          rideId,
          captainLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { primaryRoute, routeType } = response.data;
      setPrimaryRoute(primaryRoute || []);
      setRouteType(routeType || "");

      if (onRouteUpdate) {
        onRouteUpdate(response.data);
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
      // Fallback to simple direct line if API fails
      if (rideState === "confirmed" && captainLocation && pickupCoords) {
        setPrimaryRoute([captainLocation, pickupCoords]);
        setRouteType("captain-to-pickup");
      } else if (
        rideState === "ongoing" &&
        captainLocation &&
        destinationCoords
      ) {
        setPrimaryRoute([captainLocation, destinationCoords]);
        setRouteType("captain-to-destination");
      }
    } finally {
      setIsLoadingRoute(false);
    }
  }, [
    rideId,
    captainLocation,
    rideState,
    pickupCoords,
    destinationCoords,
    onRouteUpdate,
  ]);

  // Fetch route when captain location changes or ride state changes
  useEffect(() => {
    fetchRouteData();
  }, [fetchRouteData]);

  // Auto-refresh route every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (rideState === "confirmed" || rideState === "ongoing") {
        fetchRouteData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchRouteData, rideState]);

  const positionsToBound = [
    captainLocation,
    userLocation,
    pickupCoords,
    destinationCoords,
  ].filter(Boolean);

  // Route colors
  const getRouteColor = (type) => {
    switch (type) {
      case "captain-to-pickup":
        return "#ef4444"; // Red - Captain to pickup
      case "captain-to-destination":
        return "#3b82f6"; // Blue - Captain to destination
      default:
        return "#6b7280"; // Gray - Default
    }
  };

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater positions={positionsToBound} />

      {/* Captain Marker - Always visible when available */}
      {captainLocation && (
        <Marker
          position={[captainLocation.lat, captainLocation.lng]}
          icon={icons.captain}
        >
          <Popup>
            <div className="text-center">
              <strong>Captain</strong>
              <br />
              {rideState === "confirmed" ? "En route to pickup" : "On the way"}
            </div>
          </Popup>
        </Marker>
      )}

      {/* User Marker - Show when ride is confirmed and user location available */}
      {rideState === "confirmed" && userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={icons.user}
        >
          <Popup>
            <div className="text-center">
              <strong>You</strong>
              <br />
              Waiting for pickup
            </div>
          </Popup>
        </Marker>
      )}

      {/* Pickup Marker - Show during confirmed state */}
      {rideState === "confirmed" && pickupCoords && (
        <Marker
          position={[pickupCoords.lat, pickupCoords.lng]}
          icon={icons.pickup}
        >
          <Popup>
            <div className="text-center">
              <strong>Pickup Point</strong>
              <br />
              Captain is on the way
            </div>
          </Popup>
        </Marker>
      )}

      {/* Destination Marker - Show during ongoing state */}
      {rideState === "ongoing" && destinationCoords && (
        <Marker
          position={[destinationCoords.lat, destinationCoords.lng]}
          icon={icons.destination}
        >
          <Popup>
            <div className="text-center">
              <strong>Destination</strong>
              <br />
              Your drop-off point
            </div>
          </Popup>
        </Marker>
      )}

      {/* Primary Route - Thick solid line based on current ride state */}
      {primaryRoute.length > 0 && (
        <Polyline
          positions={primaryRoute.map((point) => [point.lat, point.lng])}
          color={getRouteColor(routeType)}
          weight={6}
          opacity={0.8}
          dashArray={null} // Solid line
        />
      )}

      {/* Loading indicator overlay */}
      {isLoadingRoute && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 1000,
            fontSize: "12px",
          }}
        >
          Updating route...
        </div>
      )}

      {/* Route info overlay */}
      {routeType && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "rgba(255,255,255,0.9)",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 1000,
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "3px",
                backgroundColor: getRouteColor(routeType),
                borderRadius: "2px",
              }}
            />
            <span>
              {routeType === "captain-to-pickup"
                ? "Captain → Pickup"
                : "Captain → Destination"}
            </span>
          </div>
        </div>
      )}
    </MapContainer>
  );
};

export default EnhancedLiveTrackingMap;
