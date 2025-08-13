import React, { useState, useEffect, useRef } from "react";
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

  // Refs to track previous values
  const prevFromLocationRef = useRef("");
  const prevToLocationRef = useRef("");

  useEffect(() => {
    let delayTimeout;

    const fetchFromSuggestions = async () => {
      // Get trimmed value to check
      const trimmedFromLocation = fromLocation.trim();

      // Skip API call if input is empty or too short after trimming
      if (
        !fromLocation ||
        trimmedFromLocation === "" ||
        trimmedFromLocation.length <= 1
      ) {
        // Explicitly clear suggestions when input is empty or too short
        setFromSuggestions([]);
        setShowFromDropdown(false);
        return;
      }

      // Check if fromLocation has changed from previous value
      const hasChanged =
        trimmedFromLocation !== prevFromLocationRef.current.trim();

      // Update the previous value for next comparison
      prevFromLocationRef.current = fromLocation;

      // Only fetch if there's a change and enough text
      if (hasChanged && trimmedFromLocation && trimmedFromLocation.length > 1) {
        try {
          // Add a small delay to prevent too many API calls while typing
          delayTimeout = setTimeout(async () => {
            try {
              const suggestions = await getLocationSuggestions(fromLocation);
              if (Array.isArray(suggestions)) {
                setFromSuggestions(suggestions);
                setShowFromDropdown(suggestions.length > 0);
              } else {
                setFromSuggestions([]);
                setShowFromDropdown(false);
              }
            } catch (innerError) {
              console.error("Inner error fetching suggestions:", innerError);
              setFromSuggestions([]);
              setShowFromDropdown(false);
            }
          }, 700);
        } catch (error) {
          console.error("Error fetching from location suggestions:", error);
          setFromSuggestions([]);
          setShowFromDropdown(false);
        }
      }
    };

    fetchFromSuggestions();

    // Clean up the timeout when component unmounts or when fromLocation changes
    return () => {
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [fromLocation]);

  useEffect(() => {
    let delayTimeout;

    const fetchToSuggestions = async () => {
      // Get trimmed value to check
      const trimmedToLocation = toLocation.trim();

      // Skip API call if input is empty or too short after trimming
      if (
        !toLocation ||
        trimmedToLocation === "" ||
        trimmedToLocation.length <= 1
      ) {
        // Explicitly clear suggestions when input is empty or too short
        setToSuggestions([]);
        setShowToDropdown(false);
        return;
      }

      // Check if toLocation has changed from previous value
      const hasChanged = trimmedToLocation !== prevToLocationRef.current.trim();

      // Update the previous value for next comparison
      prevToLocationRef.current = toLocation;

      // Only fetch if there's a change and enough text
      if (hasChanged && trimmedToLocation && trimmedToLocation.length > 1) {
        try {
          // Add a small delay to prevent too many API calls while typing
          delayTimeout = setTimeout(async () => {
            try {
              const suggestions = await getLocationSuggestions(toLocation);
              if (Array.isArray(suggestions)) {
                setToSuggestions(suggestions);
                setShowToDropdown(suggestions.length > 0);
              } else {
                setToSuggestions([]);
                setShowToDropdown(false);
              }
            } catch (innerError) {
              console.error("Inner error fetching suggestions:", innerError);
              setToSuggestions([]);
              setShowToDropdown(false);
            }
          }, 700);
        } catch (error) {
          console.error("Error fetching to location suggestions:", error);
          setToSuggestions([]);
          setShowToDropdown(false);
        }
      }
    };

    fetchToSuggestions();

    // Clean up the timeout when component unmounts or when toLocation changes
    return () => {
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [toLocation]);

  const handleLocationSelect = (suggestion, type) => {
    if (type === "from") {
      // Update both state and ref to prevent redundant API call
      setFromLocation(suggestion.name);
      prevFromLocationRef.current = suggestion.name;
      setFromSuggestions([]);
      setShowFromDropdown(false);
    } else {
      // Update both state and ref to prevent redundant API call
      setToLocation(suggestion.name);
      prevToLocationRef.current = suggestion.name;
      setToSuggestions([]);
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
                onChange={(newValue) => {
                  const trimmedValue = newValue.trim();

                  // If input is cleared or very short, explicitly clear suggestions immediately
                  if (
                    !newValue ||
                    trimmedValue === "" ||
                    trimmedValue.length <= 1
                  ) {
                    setFromSuggestions([]);
                    setShowFromDropdown(false);
                  }

                  // Store the untrimmed value for display purposes, but use trimmed for comparison
                  setFromLocation(newValue);
                }}
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
                onChange={(newValue) => {
                  const trimmedValue = newValue.trim();

                  // If input is cleared or very short, explicitly clear suggestions immediately
                  if (
                    !newValue ||
                    trimmedValue === "" ||
                    trimmedValue.length <= 1
                  ) {
                    setToSuggestions([]);
                    setShowToDropdown(false);
                  }

                  // Store the untrimmed value for display purposes, but use trimmed for comparison
                  setToLocation(newValue);
                }}
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
