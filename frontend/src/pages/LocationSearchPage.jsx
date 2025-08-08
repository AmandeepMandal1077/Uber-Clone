import React, { useState, useEffect } from "react";
import {
  getLocationSuggestions,
  getLocationIcon,
} from "../data/locationSuggestions.js";
import LocationInput from "../components/LocationInput";

const LocationSearchPage = ({ onFindRoutes }) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    if (fromLocation.length > 0) {
      const suggestions = getLocationSuggestions(fromLocation);
      setFromSuggestions(suggestions);
      setShowFromDropdown(suggestions.length > 0);
    } else {
      setFromSuggestions([]);
      setShowFromDropdown(false);
    }
  }, [fromLocation]);

  useEffect(() => {
    if (toLocation.length > 0) {
      const suggestions = getLocationSuggestions(toLocation);
      setToSuggestions(suggestions);
      setShowToDropdown(suggestions.length > 0);
    } else {
      setToSuggestions([]);
      setShowToDropdown(false);
    }
  }, [toLocation]);

  const handleLocationSelect = (suggestion, type) => {
    if (type === "from") {
      setFromLocation(suggestion.name);
      setShowFromDropdown(false);
    } else {
      setToLocation(suggestion.name);
      setShowToDropdown(false);
    }
  };

  const handleFindRoutes = () => {
    if (fromLocation && toLocation) {
      onFindRoutes({ from: fromLocation, to: toLocation });
    }
  };

  return (
    <div className="h-full w-full bg-[#fdf0d5] flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-4 md:mb-6">
              Where to?
            </h2>

            <div className="space-y-4">
              <LocationInput
                label="From"
                value={fromLocation}
                onChange={setFromLocation}
                placeholder="Enter pickup location"
                suggestions={fromSuggestions}
                showDropdown={showFromDropdown}
                onSuggestionSelect={(suggestion) =>
                  handleLocationSelect(suggestion, "from")
                }
                getLocationIcon={getLocationIcon}
                dotColor="#c1121f"
              />

              <LocationInput
                label="To"
                value={toLocation}
                onChange={setToLocation}
                placeholder="Enter destination"
                suggestions={toSuggestions}
                showDropdown={showToDropdown}
                onSuggestionSelect={(suggestion) =>
                  handleLocationSelect(suggestion, "to")
                }
                getLocationIcon={getLocationIcon}
                dotColor="#669bbc"
              />

              <button
                onClick={handleFindRoutes}
                disabled={!fromLocation || !toLocation}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors mt-6 ${
                  fromLocation && toLocation
                    ? "bg-[#c1121f] hover:bg-[#780000]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Find Routes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSearchPage;
