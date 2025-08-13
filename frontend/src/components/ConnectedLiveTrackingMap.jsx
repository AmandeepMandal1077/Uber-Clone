import React, { useContext, useEffect, useState } from "react";
import LiveTrackingMap from "./LiveTrackingMap";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import useRealTimeLocation from "../hooks/useRealTimeLocation";

const ConnectedLiveTrackingMap = ({ className = "h-full w-full" }) => {
  const { socket, liveLocations } = useContext(SocketContext);
  const { user } = useContext(UserContext) || {};

  // Get current user's real-time location
  const { currentLocation, error } = useRealTimeLocation();

  // State for ride information
  const [rideState, setRideState] = useState("confirmed");

  // Simple check to determine if current user is captain
  const isCaptain = window.location.pathname.includes("captain");
  const currentUserId =
    user?._id || "demo-user-" + Math.random().toString(36).substr(2, 9);

  // Default demo locations for testing
  const demoUserLocation = { lat: 28.6139, lng: 77.209 };
  const demoCaptainLocation = { lat: 28.6179, lng: 77.213 };
  const demoPickupLocation = { lat: 28.6139, lng: 77.209 };
  const demoDestinationLocation = { lat: 28.6299, lng: 77.2246 };

  // Use real location if available, otherwise use demo locations
  const userLocation = isCaptain
    ? demoUserLocation
    : currentLocation || demoUserLocation;

  const captainLocation = isCaptain
    ? currentLocation || demoCaptainLocation
    : demoCaptainLocation;

  // Broadcast current location if we have one
  useEffect(() => {
    if (currentLocation && socket && currentUserId) {
      socket.emit("update-location", {
        userId: currentUserId,
        location: currentLocation,
        userType: isCaptain ? "captain" : "user",
      });
    }
  }, [currentLocation, socket, currentUserId, isCaptain]);

  // Get locations from other users if available
  const otherUserLocation = Object.entries(liveLocations || {}).find(
    ([id, data]) =>
      id !== currentUserId && data.userType === (isCaptain ? "user" : "captain")
  )?.[1];

  // Final locations to pass to map
  const finalUserLocation = isCaptain
    ? otherUserLocation || demoUserLocation
    : currentLocation || demoUserLocation;

  const finalCaptainLocation = isCaptain
    ? currentLocation || demoCaptainLocation
    : otherUserLocation || demoCaptainLocation;

  return (
    <LiveTrackingMap
      userLocation={finalUserLocation}
      captainLocation={finalCaptainLocation}
      pickupLocation={demoPickupLocation}
      destinationLocation={demoDestinationLocation}
      rideState={rideState}
      className={className}
    />
  );
};

export default ConnectedLiveTrackingMap;
