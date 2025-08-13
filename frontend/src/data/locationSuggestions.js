// Location suggestions data for YATRA
import axios from "axios";

export const locationSuggestions = [
  // Mumbai locations
  {
    id: 1,
    name: "Chhatrapati Shivaji Terminus (CST)",
    area: "Fort, Mumbai",
    type: "transport",
    icon: "ri-train-line",
  },
  {
    id: 2,
    name: "Bandra-Kurla Complex",
    area: "Bandra East, Mumbai",
    type: "business",
    icon: "ri-building-2-fill",
  },
  {
    id: 3,
    name: "Phoenix Marketcity",
    area: "Kurla, Mumbai",
    type: "mall",
    icon: "ri-store-2-fill",
  },
  {
    id: 4,
    name: "Juhu Beach",
    area: "Juhu, Mumbai",
    type: "tourist",
    icon: "ri-sun-line",
  },
  {
    id: 5,
    name: "Mumbai Airport Terminal 1",
    area: "Vile Parle, Mumbai",
    type: "transport",
    icon: "ri-plane-fill",
  },
  {
    id: 6,
    name: "Powai Lake",
    area: "Powai, Mumbai",
    type: "tourist",
    icon: "ri-water-flash-line",
  },
  {
    id: 7,
    name: "Andheri Station",
    area: "Andheri West, Mumbai",
    type: "transport",
    icon: "ri-train-line",
  },
  {
    id: 8,
    name: "Palladium Mall",
    area: "Lower Parel, Mumbai",
    type: "mall",
    icon: "ri-store-2-fill",
  },
  // Delhi locations
  {
    id: 9,
    name: "Connaught Place",
    area: "Central Delhi",
    type: "business",
    icon: "ri-building-2-fill",
  },
  {
    id: 10,
    name: "India Gate",
    area: "Rajpath, New Delhi",
    type: "tourist",
    icon: "ri-camera-fill",
  },
  {
    id: 11,
    name: "Delhi Airport Terminal 3",
    area: "Aerocity, New Delhi",
    type: "transport",
    icon: "ri-plane-fill",
  },
  {
    id: 12,
    name: "Cyber City",
    area: "Gurgaon",
    type: "business",
    icon: "ri-building-2-fill",
  },
  {
    id: 13,
    name: "Khan Market",
    area: "Delhi",
    type: "shopping",
    icon: "ri-store-2-fill",
  },
  {
    id: 14,
    name: "Red Fort",
    area: "Old Delhi",
    type: "tourist",
    icon: "ri-ancient-gate-fill",
  },
  // Bangalore locations
  {
    id: 15,
    name: "MG Road",
    area: "Central Bangalore",
    type: "business",
    icon: "ri-road-map-line",
  },
  {
    id: 16,
    name: "Electronic City",
    area: "South Bangalore",
    type: "business",
    icon: "ri-building-2-fill",
  },
  {
    id: 17,
    name: "Bangalore Airport",
    area: "Devanahalli, Bangalore",
    type: "transport",
    icon: "ri-plane-fill",
  },
  {
    id: 18,
    name: "Brigade Road",
    area: "Central Bangalore",
    type: "shopping",
    icon: "ri-store-2-fill",
  },
  {
    id: 19,
    name: "UB City Mall",
    area: "Central Bangalore",
    type: "mall",
    icon: "ri-store-3-fill",
  },
  // Pune locations
  {
    id: 20,
    name: "Pune Station",
    area: "Pune Junction",
    type: "transport",
    icon: "ri-train-line",
  },
  {
    id: 21,
    name: "Hinjewadi IT Park",
    area: "Hinjewadi, Pune",
    type: "business",
    icon: "ri-building-2-fill",
  },
  {
    id: 22,
    name: "Phoenix Marketcity Pune",
    area: "Viman Nagar, Pune",
    type: "mall",
    icon: "ri-store-2-fill",
  },
  {
    id: 23,
    name: "Koregaon Park",
    area: "Pune",
    type: "residential",
    icon: "ri-home-4-line",
  },
  {
    id: 24,
    name: "FC Road",
    area: "Pune",
    type: "shopping",
    icon: "ri-store-2-fill",
  },
  // General popular locations
  {
    id: 25,
    name: "My Location",
    area: "Current Location",
    type: "current",
    icon: "ri-map-pin-user-fill",
  },
];

export const getLocationSuggestions = async (query) => {
  // Return empty array if query is not valid
  if (!query || typeof query !== "string") return [];

  // Trim the query and check if it's still valid after trimming
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) return [];

  const lowercaseQuery = trimmedQuery.toLowerCase();

  // Using a debounce approach - add delay to prevent too many requests
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Try to get suggestions from API
    console.log("requesting location suggestions");
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/maps/get-suggestions?location=${encodeURIComponent(lowercaseQuery)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response && response.data && Array.isArray(response.data)) {
      // Transform API response to match our expected format
      const formattedSuggestions = response.data.map((item, index) => ({
        id: item.id || `api-${index}`,
        name: item.displayName || item.name || `Location ${index + 1}`,
        area: item.address || item.area || "Unknown area",
        type: item.type || "default",
      }));

      // Filter and sort suggestions
      return formattedSuggestions
        .filter((location) => {
          if (!location || !location.name) return false;
          return (
            location.name.toLowerCase().includes(lowercaseQuery) ||
            (location.area &&
              location.area.toLowerCase().includes(lowercaseQuery))
          );
        })
        .sort((a, b) => {
          // Prioritize exact matches and those starting with the query
          const aNameMatch = a.name.toLowerCase().startsWith(lowercaseQuery);
          const bNameMatch = b.name.toLowerCase().startsWith(lowercaseQuery);

          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;

          return a.name.length - b.name.length; // Shorter names first
        })
        .slice(0, 6); // Return maximum 6 suggestions
    } else {
      console.log("Using local suggestions due to invalid API response format");
      // Fallback to local suggestions
      return localSuggestionsFallback(lowercaseQuery);
    }
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    // Return local fallback suggestions if API fails
    return localSuggestionsFallback(lowercaseQuery);
  }
};

// Helper function to filter local suggestions
const localSuggestionsFallback = (lowercaseQuery) => {
  // Don't process if query is empty or just spaces
  if (!lowercaseQuery || lowercaseQuery.trim() === "") {
    return [];
  }

  return locationSuggestions
    .filter(
      (location) =>
        location.name.toLowerCase().includes(lowercaseQuery) ||
        location.area.toLowerCase().includes(lowercaseQuery)
    )
    .sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().startsWith(lowercaseQuery);
      const bNameMatch = b.name.toLowerCase().startsWith(lowercaseQuery);

      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;

      return a.name.length - b.name.length;
    })
    .slice(0, 6);
};

export const getLocationIcon = (type) => {
  const iconMap = {
    transport: "ri-train-fill",
    business: "ri-building-2-fill",
    mall: "ri-store-2-fill",
    shopping: "ri-store-2-fill",
    tourist: "ri-camera-fill",
    residential: "ri-home-4-line",
    current: "ri-map-pin-user-fill",
  };

  return iconMap[type] || "ri-map-pin-line";
};
