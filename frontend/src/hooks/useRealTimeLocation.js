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
          setCurrentLocation(newLocation);
          sendLocationUpdate(userId, newLocation, userType);
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
        setCurrentLocation(initialDemoLocation);
        sendLocationUpdate(userId, initialDemoLocation, userType);

        // Simulate movement for demo purposes
        demoInterval = setInterval(() => {
          setCurrentLocation((prevLocation) => {
            const variation = 0.0005; // Smaller, more realistic movement
            const newDemoLocation = {
              lat:
                (prevLocation?.lat || initialDemoLocation.lat) +
                (Math.random() - 0.5) * variation,
              lng:
                (prevLocation?.lng || initialDemoLocation.lng) +
                (Math.random() - 0.5) * variation,
            };
            sendLocationUpdate(userId, newDemoLocation, userType);
            return newDemoLocation;
          });
        }, LOCATION_CONFIG.DEMO_UPDATE_INTERVAL);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (demoInterval !== null) clearInterval(demoInterval);
    };
  }, [userId, userType, isActive, sendLocationUpdate]);

  return { currentLocation, locationError };
};

export default useRealTimeLocation;
