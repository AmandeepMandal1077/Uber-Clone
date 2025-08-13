import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import LiveTrackingMap from "./LiveTrackingMap";
import useRealTimeLocation from "../hooks/useRealTimeLocation";

const RideTracker = ({
  ride,
  rideState,
  pickupCoords,
  destinationCoords,
  onRideComplete,
}) => {
  const { user } = useContext(UserContext);
  const { getCaptainLocation, receiveMessage } = useContext(SocketContext);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState(rideState || "waiting");
  const [captain, setCaptain] = useState(null);

  // Track user location in real-time
  const { currentLocation: userLocation } = useRealTimeLocation(
    user?._id,
    "user",
    rideState === "confirmed" || rideState === "ongoing"
  );

  // Listen for captain location updates
  useEffect(() => {
    if (!ride?.captain?._id) return;

    const cleanup = receiveMessage("location-update", (data) => {
      console.log("Received location update in RideTracker:", data);
      if (data.userId === ride.captain._id && data.userType === "captain") {
        setCaptainLocation(data.location);
      }
    });

    return cleanup;
  }, [ride?.captain?._id, receiveMessage]);

  // Listen for ride status updates
  useEffect(() => {
    const cleanup = receiveMessage("ride-status-update", (data) => {
      console.log("Ride status update:", data);
      if (data.rideId === ride._id) {
        setRideStatus(data.status);
        if (data.status === "completed" && onRideComplete) {
          onRideComplete(data);
        }
      }
    });

    return cleanup;
  }, [ride._id, receiveMessage, onRideComplete]);

  // Set initial captain info
  useEffect(() => {
    if (ride?.captain) {
      setCaptain(ride.captain);
      // Set initial captain location if available
      if (ride.captain.location) {
        setCaptainLocation({
          lat: ride.captain.location.latitude,
          lng: ride.captain.location.longitude,
        });
      }
    }
  }, [ride?.captain]);

  const getPickupLocation = () => {
    if (pickupCoords) {
      return pickupCoords;
    }
    // Fallback to user location
    return userLocation;
  };

  const getDestinationLocation = () => {
    return destinationCoords;
  };

  const getRideStateDisplay = () => {
    switch (rideStatus) {
      case "waiting":
        return {
          title: "Looking for a driver...",
          message: "We're finding you the best driver nearby",
          color: "text-yellow-600",
        };
      case "confirmed":
        return {
          title: "Driver found!",
          message: `${
            captain?.firstName || "Captain"
          } is coming to pick you up`,
          color: "text-blue-600",
        };
      case "ongoing":
        return {
          title: "Trip in progress",
          message: `${
            captain?.firstName || "Captain"
          } is taking you to your destination`,
          color: "text-green-600",
        };
      case "completed":
        return {
          title: "Trip completed!",
          message: "Thank you for riding with us",
          color: "text-green-600",
        };
      default:
        return {
          title: "Preparing your ride...",
          message: "Please wait",
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getRideStateDisplay();

  const estimatedTime = () => {
    if (rideStatus === "confirmed" && captainLocation && userLocation) {
      // In a real app, you'd calculate this based on distance
      return "5-8 min";
    }
    if (rideStatus === "ongoing") {
      return "15-20 min";
    }
    return "Calculating...";
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Status Header */}
      <div className="bg-white p-4 shadow-md z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h3>
            <p className="text-gray-600 text-sm">{statusInfo.message}</p>
          </div>
          {(rideStatus === "confirmed" || rideStatus === "ongoing") && (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {estimatedTime()}
              </div>
              <div className="text-xs text-gray-500">
                {rideStatus === "confirmed" ? "ETA" : "To destination"}
              </div>
            </div>
          )}
        </div>

        {/* Captain Info - Show when captain is assigned */}
        {captain && rideStatus !== "waiting" && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {captain.firstName?.[0] || "C"}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {captain.firstName} {captain.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {captain.vehicle?.plate || "Vehicle"} •{" "}
                  {captain.vehicle?.vehicleType || "Car"}
                </div>
              </div>
              {captainLocation &&
                userLocation &&
                rideStatus === "confirmed" && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {/* Calculate distance - simplified */}~
                      {Math.round(Math.random() * 3 + 1)} km away
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <LiveTrackingMap
          userLocation={userLocation}
          captainLocation={captainLocation}
          pickupLocation={getPickupLocation()}
          destinationLocation={getDestinationLocation()}
          rideState={rideStatus}
          className="h-full w-full"
        />
      </div>

      {/* Action Button */}
      {rideStatus === "ongoing" && (
        <div className="p-4 bg-white border-t">
          <button
            onClick={() => {
              // In a real app, this would call the backend to complete the ride
              if (onRideComplete) {
                onRideComplete({
                  rideId: ride._id,
                  fare: ride.fare,
                  status: "completed",
                });
              }
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium"
          >
            End Trip (For Testing)
          </button>
        </div>
      )}
    </div>
  );
};

export default RideTracker;
