import React, { useContext, useEffect, useState } from "react";
import EnhancedLiveTrackingMap from "./EnhancedLiveTrackingMap";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import { CaptainContext } from "../context/CaptainContext";
import useRealTimeLocation from "../hooks/useRealTimeLocation";
import axios from "axios";

const EnhancedConnectedLiveTrackingMap = ({
  className = "h-full w-full",
  rideId,
  rideData,
}) => {
  const { socket, liveLocations } = useContext(SocketContext);
  const { user } = useContext(UserContext) || {};
  const { captain } = useContext(CaptainContext) || {};

  // Get current user's real-time location
  const { currentLocation, error } = useRealTimeLocation();

  // State for ride information
  const [rideState, setRideState] = useState("confirmed");
  const [routeData, setRouteData] = useState(null);

  // Determine if current user is captain
  const isCaptain = window.location.pathname.includes("captain");
  const currentUserId = isCaptain
    ? captain?._id || "demo-captain-" + Math.random().toString(36).substr(2, 9)
    : user?._id || "demo-user-" + Math.random().toString(36).substr(2, 9);

  // Extract coordinates from ride data with proper conversion
  const getCoordinatesFromRideData = async (location) => {
    if (!location) return null;

    // If it's already a coordinate object
    if (typeof location === "object" && (location.lat || location.latitude)) {
      return {
        lat: location.lat || location.latitude,
        lng: location.lng || location.longitude || location.lng,
      };
    }

    // If it's a string, we need to convert it to coordinates
    if (typeof location === "string") {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
          {
            params: { address: location },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return {
          lat: parseFloat(response.data.latitude),
          lng: parseFloat(response.data.longitude),
        };
      } catch (error) {
        console.error("Error converting address to coordinates:", error);
        return null;
      }
    }

    return null;
  };

  const [pickupCoords, setPickupCoords] = useState({
    lat: 28.6139,
    lng: 77.209,
  });
  const [destinationCoords, setDestinationCoords] = useState({
    lat: 28.6299,
    lng: 77.2246,
  });

  // Convert ride location data to coordinates
  useEffect(() => {
    const convertLocations = async () => {
      if (rideData?.pickupLocation) {
        const pickup = await getCoordinatesFromRideData(
          rideData.pickupLocation
        );
        if (pickup) setPickupCoords(pickup);
      }

      if (rideData?.dropoffLocation) {
        const destination = await getCoordinatesFromRideData(
          rideData.dropoffLocation
        );
        if (destination) setDestinationCoords(destination);
      }
    };

    convertLocations();
  }, [rideData?.pickupLocation, rideData?.dropoffLocation]);

  // Default demo locations for testing
  const demoUserLocation = pickupCoords;
  const demoCaptainLocation = { lat: 28.6179, lng: 77.213 };

  // Use real location if available, otherwise use demo locations
  const userLocation = isCaptain
    ? demoUserLocation
    : currentLocation || demoUserLocation;

  const captainLocation = isCaptain
    ? currentLocation || demoCaptainLocation
    : demoCaptainLocation;

  // Update ride state based on ride data
  useEffect(() => {
    if (rideData?.status) {
      setRideState(rideData.status);
    }
  }, [rideData?.status]);

  // Broadcast current location if we have one
  useEffect(() => {
    if (currentLocation && socket && currentUserId) {
      socket.emit("update-location", {
        userId: currentUserId,
        location: currentLocation,
        userType: isCaptain ? "captain" : "user",
        rideId: rideId,
      });
    }
  }, [currentLocation, socket, currentUserId, isCaptain, rideId]);

  // Listen for location updates from other users
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (data) => {
      // Update the route data when location updates come in
      console.log("Location update received:", data);
    };

    socket.on("location-update", handleLocationUpdate);

    return () => {
      socket.off("location-update", handleLocationUpdate);
    };
  }, [socket]);

  // Get locations from other users if available
  const otherUserLocation = Object.entries(liveLocations || {}).find(
    ([id, data]) =>
      id !== currentUserId && data.userType === (isCaptain ? "user" : "captain")
  )?.[1];

  // Final locations to pass to map - centralized approach
  const finalUserLocation = isCaptain
    ? otherUserLocation?.location || demoUserLocation
    : currentLocation || demoUserLocation;

  const finalCaptainLocation = isCaptain
    ? currentLocation || demoCaptainLocation
    : otherUserLocation?.location || demoCaptainLocation;

  // Handle route updates from the map component
  const handleRouteUpdate = (newRouteData) => {
    setRouteData(newRouteData);
  };

  return (
    <div className={className}>
      <EnhancedLiveTrackingMap
        rideState={rideState}
        rideId={rideId}
        captainLocation={finalCaptainLocation}
        userLocation={finalUserLocation}
        pickupCoords={pickupCoords}
        destinationCoords={destinationCoords}
        onRouteUpdate={handleRouteUpdate}
      />

      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded text-xs max-w-xs">
          <div>Mode: {isCaptain ? "Captain" : "User"}</div>
          <div>Ride State: {rideState}</div>
          <div>Ride ID: {rideId || "N/A"}</div>
          <div>
            Captain:{" "}
            {finalCaptainLocation
              ? `${finalCaptainLocation.lat?.toFixed(
                  4
                )}, ${finalCaptainLocation.lng?.toFixed(4)}`
              : "N/A"}
          </div>
          <div>
            User:{" "}
            {finalUserLocation
              ? `${finalUserLocation.lat?.toFixed(
                  4
                )}, ${finalUserLocation.lng?.toFixed(4)}`
              : "N/A"}
          </div>
          <div>Route Type: {routeData?.routeType || "N/A"}</div>
          <div>Route Points: {routeData?.primaryRoute?.length || 0}</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedConnectedLiveTrackingMap;
