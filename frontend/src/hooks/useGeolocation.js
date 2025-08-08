import { useState, useEffect } from "react";

const useGeolocation = (isActive) => {
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.209,
  });

  useEffect(() => {
    if (!isActive) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isActive]);

  return location;
};

export default useGeolocation;
