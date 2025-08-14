import React, { useState } from "react";
import {
  LOCATION_CONFIG,
  toggleLocationMode,
  setDemoLocation,
} from "../config/locationConfig";

// This component now takes a prop to trigger the simulation in the parent
const LocationDebugPanel = ({ onSimulateRide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(!LOCATION_CONFIG.USE_REAL_LOCATION);
  const [captainLat, setCaptainLat] = useState("28.6272"); // Default near CP
  const [captainLng, setCaptainLng] = useState("77.2166");
  const [fromLocation, setFromLocation] = useState(
    "Connaught Place, New Delhi"
  );
  const [toLocation, setToLocation] = useState("India Gate, New Delhi");

  const handleToggleMode = () => {
    toggleLocationMode();
    setIsDemo(!LOCATION_CONFIG.USE_REAL_LOCATION);
    alert(
      "Location mode switched. Your location will update on the next interval."
    );
  };

  const handleSimulateRide = () => {
    if (!isDemo) {
      alert("Please switch to DEMO mode first.");
      return;
    }
    setDemoLocation("captain", parseFloat(captainLat), parseFloat(captainLng));
    if (onSimulateRide) {
      onSimulateRide({ from: fromLocation, to: toLocation });
    }
    setIsOpen(false); // Close panel after starting simulation
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg z-[9999] text-sm font-bold"
        title="Open Location Debug Panel"
      >
        TEST MODE
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-black shadow-2xl rounded-lg p-4 z-[9999] w-72 text-sm text-black">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-black">Ride Simulation Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="font-bold text-black text-xl"
        >
          ×
        </button>
      </div>

      <div className="mb-3">
        <label className="font-semibold">Mode: </label>
        <strong className={isDemo ? "text-orange-500" : "text-green-500"}>
          {isDemo ? "DEMO" : "REAL"}
        </strong>
        <button
          onClick={handleToggleMode}
          className="w-full py-1 mt-1 bg-gray-200 text-black rounded text-xs"
        >
          Switch to {isDemo ? "Real Mode" : "Demo Mode"}
        </button>
      </div>

      {isDemo && (
        <div className="border-t border-gray-300 pt-2 mt-2">
          <h4 className="font-bold mb-1">Simulate a Full Ride</h4>
          <label className="text-xs font-semibold">
            Captain's Start Position
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Lat"
              value={captainLat}
              onChange={(e) => setCaptainLat(e.target.value)}
              className="w-1/2 p-1 border rounded mb-1 text-xs"
            />
            <input
              type="text"
              placeholder="Lng"
              value={captainLng}
              onChange={(e) => setCaptainLng(e.target.value)}
              className="w-1/2 p-1 border rounded mb-2 text-xs"
            />
          </div>

          <label className="text-xs font-semibold">Ride Pickup</label>
          <input
            type="text"
            placeholder="From Location"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full p-1 border rounded mb-1 text-xs"
          />

          <label className="text-xs font-semibold">Ride Destination</label>
          <input
            type="text"
            placeholder="To Location"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full p-1 border rounded mb-2 text-xs"
          />

          <button
            onClick={handleSimulateRide}
            className="w-full py-2 bg-black text-white rounded font-semibold"
          >
            Run Simulation
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDebugPanel;
