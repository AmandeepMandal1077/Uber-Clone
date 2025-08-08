import React from "react";

/**
 * A placeholder component for a map background
 * In a real app, this would be a Google Maps or similar implementation
 */
const MapBackground = ({ center }) => {
  return (
    <div className="absolute inset-0 bg-[#003049] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-xl font-semibold">Map View</p>
        <p className="text-sm mt-2">
          {center
            ? `Location: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
            : "Location not available"}
        </p>
      </div>
    </div>
  );
};

export default MapBackground;
