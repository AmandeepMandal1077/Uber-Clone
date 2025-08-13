// Configuration for location tracking
export const LOCATION_CONFIG = {
  // Set to false for testing with dummy data, true for real GPS location
  USE_REAL_LOCATION: true,

  // Demo locations for testing (you can modify these for different test scenarios)
  DEMO_LOCATIONS: {
    captain: {
      lat: 28.6139,
      lng: 77.209,
      name: "Delhi, India",
    },
    user: {
      lat: 28.6129,
      lng: 77.208,
      name: "Near Delhi, India",
    },
  },

  // Location tracking options
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  },

  // Demo update frequency (for testing mode)
  DEMO_UPDATE_INTERVAL: 3000, // 3 seconds - reduced frequency

  // Real location update frequency
  REAL_UPDATE_INTERVAL: 3000, // 3 seconds
};

// Helper function to toggle between real and demo location for development
export const toggleLocationMode = () => {
  LOCATION_CONFIG.USE_REAL_LOCATION = !LOCATION_CONFIG.USE_REAL_LOCATION;
  console.log(
    `Location tracking mode changed to: ${
      LOCATION_CONFIG.USE_REAL_LOCATION ? "REAL" : "DEMO"
    }`
  );
  return LOCATION_CONFIG.USE_REAL_LOCATION;
};

// Helper function to set custom demo locations
export const setDemoLocation = (userType, lat, lng, name = "") => {
  LOCATION_CONFIG.DEMO_LOCATIONS[userType] = { lat, lng, name };
  console.log(`Demo location for ${userType} set to:`, { lat, lng, name });
};

export default LOCATION_CONFIG;
