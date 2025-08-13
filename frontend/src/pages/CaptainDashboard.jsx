import React, { useContext, useEffect, useState, useRef } from "react";
import { CaptainContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import MapBackground from "../components/MapBackground";
import LiveTrackingMap from "../components/LiveTrackingMap";
import LocationDebugPanel from "../components/LocationDebugPanel";
import CaptainHeader from "../components/captain/CaptainHeader";
import CaptainProfileCard from "../components/captain/CaptainProfileCard";
import RideRequestsList from "../components/captain/RideRequestsList";
import CurrentRidePanel from "../components/captain/CurrentRidePanel";
import useRealTimeLocation from "../hooks/useRealTimeLocation";
import { generateRideRequest } from "../utils/rideSimulation";

import axios from "axios";

function CaptainDashboard() {
  const { captain, currentRide, setCurrentRide } = useContext(CaptainContext);
  const { sendMessage, receiveMessage } = useContext(SocketContext);

  // Captain status states
  const [isOnline, setIsOnline] = useState(false);

  // Use the real-time location hook - only active when captain has accepted a ride
  const { currentLocation, locationError } = useRealTimeLocation(
    captain?._id,
    "captain",
    isOnline && (currentRide || ride) // Only track location when online AND has an active ride
  );

  // Also get user location if in active ride
  const [userLocation, setUserLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Ride management states
  const [rideRequests, setRideRequests] = useState([]);
  // currentRide is now from CaptainContext
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);
  const [completingRide, setCompletingRide] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [ride, setRide] = useState(null);

  // Debug state to force show the OTP for testing
  const [testMode, setTestMode] = useState(true);

  // Ref to track if join message has been sent to prevent duplicates
  const hasJoinedRef = useRef(false);

  // Connect to socket when component mounts and captain is available
  useEffect(() => {
    if (captain && captain._id && !hasJoinedRef.current) {
      console.log(`Sending join event for captain with ID: ${captain._id}`);
      sendMessage("join", { userId: captain._id, userType: "captain" });
      hasJoinedRef.current = true; // Mark as joined to prevent duplicates
    }
  }, [captain?._id]); // Only depend on captain ID to prevent infinite join messages

  // Set up socket listeners
  useEffect(() => {
    console.log("Captain is: ", captain);
    if (captain && captain._id) {
      console.log("Setting up new-ride listener for captain:", captain._id);

      const cleanupNewRide = receiveMessage("new-ride", (rideData) => {
        console.log("New ride request received:", rideData);
        setRide(rideData);

        // Optionally add to ride requests list for UI
        if (rideData) {
          console.log("New ride request received:", rideData);

          // Create ride request with a guaranteed unique ID
          const newRideRequest = {
            id:
              rideData._id ||
              `ride-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
            pickup: rideData.pickupLocation,
            dropoff: rideData.dropoffLocation,
            fare: `₹${rideData.fare}`,
            distance: "2.5 km", // You might want to calculate this
            time: "8 min", // You might want to calculate this
            otp: rideData.otp,
            user: rideData.user,
          };

          setRideRequests((prev) => {
            // Check if we already have this ride request
            const isDuplicate = prev.some(
              (req) =>
                // Check by ride ID
                (req.id && req.id === newRideRequest.id) ||
                // Or by user ID if available
                (req.user &&
                  newRideRequest.user &&
                  req.user._id === newRideRequest.user._id)
            );

            if (isDuplicate) {
              console.log(
                "Duplicate ride request detected, not adding to list"
              );
              return prev;
            }

            console.log("Adding new ride request to list:", newRideRequest.id);
            return [...prev, newRideRequest];
          });
        }
      });

      // Set up listener for ride completion (if you want to handle this)
      const cleanupRideComplete = receiveMessage(
        "ride-completed",
        (rideData) => {
          console.log("Ride completed:", rideData);
          // Reset captain state when ride is completed
          setCurrentRide(null);
          setRideStarted(false);
          setCompletingRide(false);
          setShowOtpVerification(false);
          setEnteredOtp("");
        }
      );

      // Return cleanup function that cleans up all listeners
      return () => {
        cleanupNewRide();
        cleanupRideComplete();
      };
    }
  }, [captain, receiveMessage]);

  // Listen for user location updates when in active ride
  useEffect(() => {
    if (!currentRide?.user?._id) return;

    const cleanup = receiveMessage("location-update", (data) => {
      console.log("Received location update in Captain Dashboard:", data);
      if (data.userId === currentRide.user._id && data.userType === "user") {
        setUserLocation(data.location);
      }
    });

    return cleanup;
  }, [currentRide?.user?._id, receiveMessage]);

  // Get coordinates for pickup and destination when ride starts
  useEffect(() => {
    if (currentRide) {
      // Get coordinates for pickup and destination
      const getCoordinates = async (address) => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
            {
              params: { address },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          return {
            lat: response.data.latitude,
            lng: response.data.longitude,
          };
        } catch (error) {
          console.error("Error getting coordinates:", error);
          return null;
        }
      };

      if (currentRide.pickupLocation) {
        getCoordinates(currentRide.pickupLocation).then(setPickupCoords);
      }
      if (currentRide.dropoffLocation) {
        getCoordinates(currentRide.dropoffLocation).then(setDestinationCoords);
      }
    }
  }, [currentRide]);

  const confirmRide = async () => {
    if (!currentRide || !captain) {
      console.error("Cannot confirm ride: missing currentRide or captain data");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
        {
          rideId: currentRide._id || currentRide.id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Ride confirmed successfully");
    } catch (error) {
      console.error("Error confirming ride:", error);
      throw error;
    }
  };
  // Simulate ride requests when captain is online
  // useEffect(() => {
  //   let requestTimer;

  //   if (isOnline && !currentRide && rideRequests.length < 10) {
  //     // Generate a random time between 5-15 seconds for the next request
  //     const nextRequestTime = Math.floor(Math.random() * (15000 - 5000) + 5000);

  //     requestTimer = setTimeout(() => {
  //       simulateRideRequest();
  //     }, nextRequestTime);
  //   }

  //   return () => {
  //     if (requestTimer) clearTimeout(requestTimer);
  //   };
  // }, [isOnline, currentRide, rideRequests]);

  // Toggle captain's online status
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);

    // If going offline, clear any pending requests
    if (isOnline) {
      setRideRequests([]);
      setCurrentRide(null);
    }
  };

  // Handle accepting a ride request
  const handleAcceptRide = async (rideRequest) => {
    if (!rideRequest) {
      console.error("No ride request provided");
      return;
    }

    if (!captain || !captain._id) {
      console.error("Captain not available");
      alert(
        "Error: Captain information not available. Please refresh the page."
      );
      return;
    }

    try {
      // First set the current ride
      setCurrentRide(rideRequest);
      // Clear ALL ride requests when accepting one
      setRideRequests([]);

      // Confirm the ride with the backend
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
        {
          rideId: rideRequest._id || rideRequest.id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Ride confirmed successfully");
    } catch (error) {
      console.error("Error accepting ride:", error);
      // Restore the ride request if confirmation failed
      setCurrentRide(null);
      setRideRequests((prev) => [...prev, rideRequest]);
      alert("Failed to confirm ride. Please try again.");
    }
    // We don't set showOtpVerification true yet, as the captain needs to reach the pickup location first
  };

  // Handle declining a ride request
  const handleDeclineRide = (rideRequestId) => {
    setRideRequests((prev) => prev.filter((req) => req.id !== rideRequestId));
  };

  // Handle arriving at pickup location
  const handleArrivedAtPickup = () => {
    setShowOtpVerification(true);
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (enteredOtp === currentRide.otp) {
      setRideStarted(true);
      setShowOtpVerification(false);
      setEnteredOtp("");

      // Send ride started event to user
      if (currentRide.user && currentRide.user._id) {
        sendMessage("ride-status-update", {
          rideId: currentRide._id || currentRide.id,
          userId: currentRide.user._id,
          status: "ongoing",
          message: "Your ride has started!",
        });
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Handle canceling OTP verification
  const handleCancelOtp = () => {
    setShowOtpVerification(false);
  };

  // Handle ride completion
  const handleCompleteRide = () => {
    setCompletingRide(true);
  };

  // Handle ride confirmation
  const handleConfirmRideComplete = () => {
    if (!currentRide) {
      console.error("No current ride to complete");
      return;
    }

    // In a real app, this would send the completion to the backend
    // and update earnings, ride history, etc.
    const fareString = currentRide.fare || "₹0";
    const fare = parseInt(fareString.replace("₹", "")) || 0;

    // Send ride completion event to user via socket
    if (currentRide.user && currentRide.user._id) {
      sendMessage("ride-completed", {
        rideId: currentRide._id || currentRide.id,
        userId: currentRide.user._id,
        fare: fare,
      });
    }

    // Reset all ride-related states
    setCurrentRide(null);
    setRideStarted(false);
    setCompletingRide(false);
    setShowOtpVerification(false);
    setEnteredOtp("");

    // Show earnings notification
    alert(`Ride completed! You earned ₹${fare}`);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <CaptainHeader
        isOnline={isOnline}
        toggleOnlineStatus={toggleOnlineStatus}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Control Panel */}
        <div className="p-4 bg-white shadow-md z-10">
          <CaptainProfileCard
            captain={captain}
            isOnline={isOnline}
            toggleOnlineStatus={toggleOnlineStatus}
          />

          {isOnline && !currentRide && (
            <RideRequestsList
              rideRequests={rideRequests}
              onAcceptRide={handleAcceptRide}
              onDeclineRide={handleDeclineRide}
            />
          )}

          {/* Current Ride Panel */}
          {currentRide && (
            <CurrentRidePanel
              currentRide={currentRide}
              rideStarted={rideStarted}
              showOtpVerification={showOtpVerification}
              completingRide={completingRide}
              enteredOtp={enteredOtp}
              setEnteredOtp={setEnteredOtp}
              testMode={testMode}
              onArrivedAtPickup={handleArrivedAtPickup}
              onVerifyOtp={handleVerifyOtp}
              onCancelOtp={handleCancelOtp}
              onCompleteRide={handleCompleteRide}
              onConfirmRideComplete={handleConfirmRideComplete}
            />
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-[300px]">
          {currentRide ? (
            <LiveTrackingMap
              userLocation={userLocation}
              captainLocation={currentLocation}
              pickupLocation={pickupCoords}
              destinationLocation={destinationCoords}
              rideState={
                showOtpVerification
                  ? "confirmed"
                  : rideStarted
                  ? "ongoing"
                  : "confirmed"
              }
              className="h-full w-full"
            />
          ) : (
            <MapBackground center={currentLocation} />
          )}

          {/* Location Error Display */}
          {locationError && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-xs">
              <p className="text-sm font-medium">Location Error:</p>
              <p className="text-xs">{locationError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Development Debug Panel */}
      {process.env.NODE_ENV === "development" && <LocationDebugPanel />}
    </div>
  );
}

export default CaptainDashboard;
