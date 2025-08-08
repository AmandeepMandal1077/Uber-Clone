import React, { useContext, useEffect, useState } from "react";
import { CaptainContext } from "../context/CaptainContext";
import MapBackground from "../components/MapBackground";
import CaptainHeader from "../components/captain/CaptainHeader";
import CaptainProfileCard from "../components/captain/CaptainProfileCard";
import RideRequestsList from "../components/captain/RideRequestsList";
import CurrentRidePanel from "../components/captain/CurrentRidePanel";
import useGeolocation from "../hooks/useGeolocation";
import { generateRideRequest } from "../utils/rideSimulation";

function CaptainDashboard() {
  const { captain } = useContext(CaptainContext);

  // Captain status states
  const [isOnline, setIsOnline] = useState(false);

  // Use the geolocation hook
  const currentLocation = useGeolocation(isOnline);

  // Ride management states
  const [rideRequests, setRideRequests] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);
  const [completingRide, setCompletingRide] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  // Debug state to force show the OTP for testing
  const [testMode, setTestMode] = useState(true);

  // Simulate ride requests when captain is online
  useEffect(() => {
    let requestTimer;

    if (isOnline && !currentRide && rideRequests.length < 10) {
      // Generate a random time between 5-15 seconds for the next request
      const nextRequestTime = Math.floor(Math.random() * (15000 - 5000) + 5000);

      requestTimer = setTimeout(() => {
        simulateRideRequest();
      }, nextRequestTime);
    }

    return () => {
      if (requestTimer) clearTimeout(requestTimer);
    };
  }, [isOnline, currentRide, rideRequests]);

  // Simulate a ride request with random data
  const simulateRideRequest = () => {
    if (!isOnline || rideRequests.length >= 10) return;

    const newRideRequest = generateRideRequest();
    setRideRequests((prev) => [...prev, newRideRequest]);
  };

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
  const handleAcceptRide = (rideRequest) => {
    setCurrentRide(rideRequest);
    setRideRequests((prev) => prev.filter((req) => req.id !== rideRequest.id));
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
  const handleVerifyOtp = () => {
    if (enteredOtp === currentRide.otp) {
      setRideStarted(true);
      setShowOtpVerification(false);
      setEnteredOtp("");
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
    // In a real app, this would send the completion to the backend
    // and update earnings, ride history, etc.
    setCurrentRide(null);
    setRideStarted(false);
    setCompletingRide(false);

    // Simulate adding to earnings
    const fare = parseInt(currentRide.fare.replace("₹", ""));
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
          <MapBackground center={currentLocation} />
        </div>
      </div>
    </div>
  );
}

export default CaptainDashboard;
