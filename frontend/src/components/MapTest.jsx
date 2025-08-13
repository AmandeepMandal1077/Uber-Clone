import React, { useState } from "react";
import LiveTrackingMap from "./LiveTrackingMap";

const MapTest = () => {
  const [testData, setTestData] = useState({
    userLocation: { lat: 28.6139, lng: 77.209 },
    captainLocation: { lat: 28.6149, lng: 77.208 },
    pickupLocation: { lat: 28.6139, lng: 77.209 },
    destinationLocation: { lat: 28.6189, lng: 77.215 },
    rideState: "confirmed",
  });

  const changeRideState = () => {
    const states = ["waiting", "confirmed", "ongoing", "completed"];
    const currentIndex = states.indexOf(testData.rideState);
    const nextState = states[(currentIndex + 1) % states.length];
    setTestData((prev) => ({ ...prev, rideState: nextState }));
  };

  const moveCaptain = () => {
    setTestData((prev) => ({
      ...prev,
      captainLocation: {
        lat: prev.captainLocation.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.captainLocation.lng + (Math.random() - 0.5) * 0.001,
      },
    }));
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="h-full flex">
        <div className="w-1/4 p-4 bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Map Test Controls</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Current State: {testData.rideState}</p>
              <button
                onClick={changeRideState}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Change State
              </button>
            </div>
            <div>
              <button
                onClick={moveCaptain}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Move Captain
              </button>
            </div>
            <div className="text-sm space-y-2">
              <p>
                <strong>User:</strong> {testData.userLocation.lat.toFixed(4)},{" "}
                {testData.userLocation.lng.toFixed(4)}
              </p>
              <p>
                <strong>Captain:</strong>{" "}
                {testData.captainLocation.lat.toFixed(4)},{" "}
                {testData.captainLocation.lng.toFixed(4)}
              </p>
              <p>
                <strong>Pickup:</strong>{" "}
                {testData.pickupLocation.lat.toFixed(4)},{" "}
                {testData.pickupLocation.lng.toFixed(4)}
              </p>
              <p>
                <strong>Destination:</strong>{" "}
                {testData.destinationLocation.lat.toFixed(4)},{" "}
                {testData.destinationLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <LiveTrackingMap
            userLocation={testData.userLocation}
            captainLocation={testData.captainLocation}
            pickupLocation={testData.pickupLocation}
            destinationLocation={testData.destinationLocation}
            rideState={testData.rideState}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MapTest;
