import React from "react";

const MapComponent = () => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#669bbc] to-[#003049] flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="bg-white rounded-full opacity-20"></div>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="relative z-10 text-center text-white">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
        <p className="text-white text-opacity-75 max-w-xs mx-auto">
          Your route and driver location will be displayed here in real-time
        </p>
      </div>

      {/* Floating Route Info */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-[#c1121f] rounded-full"></div>
          <span className="text-[#003049] font-medium text-sm">
            Pickup Location
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#669bbc] rounded-full"></div>
          <span className="text-[#003049] font-medium text-sm">
            Drop-off Location
          </span>
        </div>
      </div>

      {/* Floating Current Location */}
      <div className="absolute bottom-4 right-4">
        <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#669bbc] hover:text-[#c1121f] transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
