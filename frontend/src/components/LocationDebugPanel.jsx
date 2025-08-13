import React, { useState } from "react";
import {
  LOCATION_CONFIG,
  toggleLocationMode,
  setDemoLocation,
} from "../config/locationConfig";

const LocationDebugPanel = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [customLat, setCustomLat] = useState("");
  const [customLng, setCustomLng] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("captain");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50 text-xs"
        title="Open Location Debug Panel"
      >
        🗺️
      </button>
    );
  }

  const handleToggleLocationMode = () => {
    toggleLocationMode();
    // Force page refresh to apply changes
    window.location.reload();
  };

  const handleSetCustomLocation = () => {
    if (customLat && customLng) {
      const lat = parseFloat(customLat);
      const lng = parseFloat(customLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setDemoLocation(selectedUserType, lat, lng, "Custom Location");
        alert(
          `Custom demo location set for ${selectedUserType}: ${lat}, ${lng}`
        );
        setCustomLat("");
        setCustomLng("");
      } else {
        alert("Please enter valid coordinates");
      }
    }
  };

  const presetLocations = {
    delhi: { lat: 28.6139, lng: 77.209, name: "Delhi, India" },
    mumbai: { lat: 19.076, lng: 72.8777, name: "Mumbai, India" },
    bangalore: { lat: 12.9716, lng: 77.5946, name: "Bangalore, India" },
    newyork: { lat: 40.7128, lng: -74.006, name: "New York, USA" },
    london: { lat: 51.5074, lng: -0.1278, name: "London, UK" },
  };

  const handlePresetLocation = (preset) => {
    const location = presetLocations[preset];
    setDemoLocation(
      selectedUserType,
      location.lat,
      location.lng,
      location.name
    );
    alert(`Demo location for ${selectedUserType} set to ${location.name}`);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4 z-50 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Location Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Current Mode */}
        <div className="text-xs">
          <strong>Current Mode:</strong>{" "}
          <span
            className={
              LOCATION_CONFIG.USE_REAL_LOCATION
                ? "text-green-600"
                : "text-orange-600"
            }
          >
            {LOCATION_CONFIG.USE_REAL_LOCATION ? "REAL LOCATION" : "DEMO MODE"}
          </span>
        </div>

        {/* Toggle Mode */}
        <button
          onClick={handleToggleLocationMode}
          className={`w-full py-2 px-3 rounded text-xs font-medium ${
            LOCATION_CONFIG.USE_REAL_LOCATION
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Switch to{" "}
          {LOCATION_CONFIG.USE_REAL_LOCATION ? "Demo Mode" : "Real Location"}
        </button>

        {/* Demo Location Settings */}
        {!LOCATION_CONFIG.USE_REAL_LOCATION && (
          <div className="border-t pt-3">
            <div className="text-xs font-medium mb-2">
              Demo Location Settings
            </div>

            {/* User Type Selection */}
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="w-full p-2 border rounded text-xs mb-2"
            >
              <option value="captain">Captain</option>
              <option value="user">User</option>
            </select>

            {/* Preset Locations */}
            <div className="text-xs mb-2">Quick Presets:</div>
            <div className="grid grid-cols-2 gap-1 mb-3">
              {Object.entries(presetLocations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => handlePresetLocation(key)}
                  className="py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  {location.name.split(",")[0]}
                </button>
              ))}
            </div>

            {/* Custom Coordinates */}
            <div className="text-xs mb-2">Custom Coordinates:</div>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="flex-1 p-1 border rounded text-xs"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="flex-1 p-1 border rounded text-xs"
              />
            </div>
            <button
              onClick={handleSetCustomLocation}
              className="w-full py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            >
              Set Custom Location
            </button>
          </div>
        )}

        {/* Current Demo Locations */}
        <div className="border-t pt-3 text-xs">
          <div className="font-medium mb-1">Current Demo Locations:</div>
          <div className="space-y-1 text-xs">
            <div>
              <strong>Captain:</strong>{" "}
              {LOCATION_CONFIG.DEMO_LOCATIONS.captain.lat.toFixed(4)},{" "}
              {LOCATION_CONFIG.DEMO_LOCATIONS.captain.lng.toFixed(4)}
            </div>
            <div>
              <strong>User:</strong>{" "}
              {LOCATION_CONFIG.DEMO_LOCATIONS.user.lat.toFixed(4)},{" "}
              {LOCATION_CONFIG.DEMO_LOCATIONS.user.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDebugPanel;
