import { useState, useEffect, useRef } from "react";
import { LOCATION_CONFIG } from "../config/locationConfig";

const useRealTimeLocation = (
  userId,
  userType,
  isActive = true,
  onLocationUpdate // Callback function for location updates
) => {
  const [locationError, setLocationError] = useState(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!isActive || !userId) return;

    let watchId = null;
    let demoInterval = null;

    const startLocationTracking = () => {
      if (LOCATION_CONFIG.USE_REAL_LOCATION) {
        if (!navigator.geolocation) {
          setLocationError("Geolocation is not supported by this browser.");
          return;
        }

        const successCallback = (position) => {
          const now = Date.now();
          if (
            now - lastUpdateRef.current <
            LOCATION_CONFIG.REAL_UPDATE_INTERVAL
          ) {
            return;
          }
          lastUpdateRef.current = now;
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          // Use the callback to pass location updates to the parent component
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        };

        const errorCallback = (error) =>
          setLocationError("Unable to retrieve location.");

        watchId = navigator.geolocation.watchPosition(
          successCallback,
          errorCallback,
          LOCATION_CONFIG.GEOLOCATION_OPTIONS
        );
      } else {
        // Use demo location for testing
        const initialDemoLocation =
          LOCATION_CONFIG.DEMO_LOCATIONS[userType] ||
          LOCATION_CONFIG.DEMO_LOCATIONS.user;

        if (onLocationUpdate) {
          onLocationUpdate(initialDemoLocation);
        }

        // Simulate movement for demo purposes
        demoInterval = setInterval(() => {
          const variation = 0.0005; // Smaller, more realistic movement
          const newDemoLocation = {
            lat:
              (LOCATION_CONFIG.DEMO_LOCATIONS[userType].lat ||
                initialDemoLocation.lat) +
              (Math.random() - 0.5) * variation,
            lng:
              (LOCATION_CONFIG.DEMO_LOCATIONS[userType].lng ||
                initialDemoLocation.lng) +
              (Math.random() - 0.5) * variation,
          };

          // Update the location in the config for persistence
          LOCATION_CONFIG.DEMO_LOCATIONS[userType] = newDemoLocation;

          if (onLocationUpdate) {
            onLocationUpdate(newDemoLocation);
          }
        }, LOCATION_CONFIG.DEMO_UPDATE_INTERVAL);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (demoInterval !== null) clearInterval(demoInterval);
    };
  }, [userId, userType, isActive, onLocationUpdate]);

  return { locationError };
};

export default useRealTimeLocation;
