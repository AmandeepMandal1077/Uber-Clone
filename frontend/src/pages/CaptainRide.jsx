import React, { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";

const CaptainRide = () => {
  const [rideRequest, setRideRequest] = useState(null);
  const [rideState, setRideState] = useState("no-ride"); // no-ride, requested, accepted, in-progress, completed
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  // Simulate ride request after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setRideRequest({
        id: 1,
        user: "Aman",
        pickup: "123 Main St",
        dropoff: "456 Oak Ave",
      });
      setRideState("requested");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptRide = () => {
    setRideState("accepted");
    // Generate a random 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(newOtp);
  };

  const handleStartRide = () => {
    if (enteredOtp === otp) {
      setRideState("in-progress");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleCompleteRide = () => {
    setRideState("completed");
  };

  const handleBackToDashboard = () => {
    // In a real app, you would navigate back to the dashboard
    // For now, we just reset the state
    setRideRequest(null);
    setRideState("no-ride");
    setOtp("");
    setEnteredOtp("");
  };

  const renderContent = () => {
    switch (rideState) {
      case "requested":
        return (
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#003049] mb-2">
              New Ride Request!
            </h3>
            <p className="text-gray-600 mb-4">
              From: {rideRequest.pickup}
              <br />
              To: {rideRequest.dropoff}
            </p>
            <button
              onClick={handleAcceptRide}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium"
            >
              Accept Ride
            </button>
          </div>
        );
      case "accepted":
        return (
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#003049] mb-2">
              Ride Accepted
            </h3>
            <p className="text-gray-600 mb-4">
              Please enter the OTP from the user to start the ride.
            </p>
            <p className="text-2xl font-bold text-blue-600 mb-4">OTP: {otp}</p>
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mb-4"
              placeholder="Enter OTP"
            />
            <button
              onClick={handleStartRide}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium"
            >
              Start Ride
            </button>
          </div>
        );
      case "in-progress":
        return (
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#003049] mb-2">
              Ride In Progress
            </h3>
            <p className="text-gray-600 mb-4">
              Drive safely to the destination.
            </p>
            <button
              onClick={handleCompleteRide}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium"
            >
              Complete Ride
            </button>
          </div>
        );
      case "completed":
        return (
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-500 mb-2">
              Ride Completed!
            </h3>
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#003049]">
              Waiting for a ride...
            </h3>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-[#fdf0d5] flex flex-col">
      <div className="flex-1 h-full w-full relative">
        <MapComponent />
        <div className="absolute top-4 left-4 right-4 z-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CaptainRide;
