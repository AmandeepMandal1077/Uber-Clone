import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { LOCATION_CONFIG } from "../config/locationConfig";

const useRealTimeLocation = (userId, userType, isActive = true) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const { sendLocationUpdate } = useContext(SocketContext);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!isActive || !userId) return;

    let watchId = null;
    let demoInterval = null;

    const startLocationTracking = () => {
      if (LOCATION_CONFIG.USE_REAL_LOCATION) {
        // Use real geolocation
        if (!navigator.geolocation) {
          setLocationError("Geolocation is not supported by this browser.");
          return;
        }

        const successCallback = (position) => {
          const now = Date.now();
          // Throttle updates to prevent too frequent socket emissions
          if (
            now - lastUpdateRef.current <
            LOCATION_CONFIG.REAL_UPDATE_INTERVAL
          ) {
            return;
          }
          lastUpdateRef.current = now;

          const { latitude, longitude } = position.coords;
          const newLocation = {
            lat: latitude,
            lng: longitude,
            accuracy: position.coords.accuracy,
            timestamp: now,
          };

          setCurrentLocation(newLocation);
          setLocationError(null);

          // Send location update via socket
          sendLocationUpdate(userId, newLocation, userType);
        };

        const errorCallback = (error) => {
          console.error("Location error:", error);
          let errorMessage = "Unable to get location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          setLocationError(errorMessage);

          // Fallback to demo location if real location fails
          const demoLocation =
            LOCATION_CONFIG.DEMO_LOCATIONS[userType] ||
            LOCATION_CONFIG.DEMO_LOCATIONS.user;
          setCurrentLocation({
            ...demoLocation,
            accuracy: 100,
            timestamp: Date.now(),
          });
          sendLocationUpdate(userId, demoLocation, userType);
        };

        // Start watching position
        watchId = navigator.geolocation.watchPosition(
          successCallback,
          errorCallback,
          LOCATION_CONFIG.GEOLOCATION_OPTIONS
        );
      } else {
        // Use demo/dummy location for testing
        const demoLocation =
          LOCATION_CONFIG.DEMO_LOCATIONS[userType] ||
          LOCATION_CONFIG.DEMO_LOCATIONS.user;
        setCurrentLocation({
          ...demoLocation,
          accuracy: 100,
          timestamp: Date.now(),
        });
        sendLocationUpdate(userId, demoLocation, userType);

        // Simulate slight movement for demo purposes
        demoInterval = setInterval(() => {
          const variation = 0.001; // Small random movement
          const newDemoLocation = {
            lat: demoLocation.lat + (Math.random() - 0.5) * variation,
            lng: demoLocation.lng + (Math.random() - 0.5) * variation,
            accuracy: 100,
            timestamp: Date.now(),
          };
          setCurrentLocation(newDemoLocation);
          sendLocationUpdate(userId, newDemoLocation, userType);
        }, LOCATION_CONFIG.DEMO_UPDATE_INTERVAL);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (demoInterval !== null) {
        clearInterval(demoInterval);
      }
    };
  }, [userId, userType, isActive, sendLocationUpdate]);

  return { currentLocation, locationError };
};

export default useRealTimeLocation;
