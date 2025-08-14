import axios from "axios";
import CAPTAIN from "../models/captain.model.js";

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getAddressCoordinates = async ({ address }) => {
  if (!address) {
    throw new Error("Address is required");
  }
  try {
    // Adding a delay to avoid hitting rate limits of the Nominatim API
    await delay(1000);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const response = await axios.get(nominatimUrl, {
      headers: {
        "User-Agent": "Yatra", // It's good practice to set a User-Agent
      },
    });
    const data = response.data;
    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }
    return { latitude: data[0].lat, longitude: data[0].lon };
  } catch (error) {
    console.error(`Could not fetch coordinates for ${address}:`, error.message);
    return null; // Return null to indicate failure
  }
};

const getDistanceAndDuration = async ({ origin, destination }) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
  try {
    const originCoords = await getAddressCoordinates({ address: origin });
    const destinationCoords = await getAddressCoordinates({
      address: destination,
    });
    if (!originCoords || !destinationCoords) {
      throw new Error("Could not get coordinates for origin or destination");
    }
    await delay(1000); // Simulate network delay
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPEN_ROUTE_API_KEY}&start=${originCoords.longitude},${originCoords.latitude}&end=${destinationCoords.longitude},${destinationCoords.latitude}`
    );
    const data = response.data;
    if (!data || !data.features || data.features.length === 0) {
      throw new Error("Unable to get distance and duration");
    }
    const { distance, duration } = data.features[0].properties.summary;

    const distanceInKm = distance / 1000;
    const days = Math.floor(duration / 86400);
    const hours = Math.floor((duration % 86400) / 3600);
    const minutes = Math.floor(
      (duration % 3600) / 60 + (duration < 60 ? 1 : 0)
    );

    const durationInString = `${days}d ${hours}h ${minutes}m`;
    return {
      distanceInMeters: distance,
      distanceInKm,
      durationInSeconds: duration,
      durationInString,
    };
  } catch (error) {
    throw new Error("Failed to fetch distance and duration");
  }
};

const getLocationSuggestions = async ({ location }) => {
  const searchText = location;
  if (!searchText || searchText.length < 2) {
    return [];
  }

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
    searchText
  )}&lon=78.96&lat=20.59`;

  try {
    await delay(1000); // Simulate network delay
    const response = await axios.get(url);

    if (!response?.data?.features) {
      return [];
    }

    const suggestions = response.data.features.map((feature) => {
      const props = feature.properties;
      const displayName = [props.name, props.city, props.state, props.country]
        .filter(Boolean)
        .join(", ");
      return {
        displayName,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      };
    });

    return suggestions;
  } catch (error) {
    console.error("getLocationSuggestions Error:", error.message);
    throw new Error("Failed to fetch suggestions.");
  }
};

const getCaptainsWithin = async ({ latitude, longitude, radius }) => {
  try {
    const captains = await CAPTAIN.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1],
        },
      },
    });

    return captains;
  } catch (error) {
    console.error("getNearByCaptain Error:", error.message);
    throw new Error("Failed to fetch nearby captains.");
  }
};

const getRoute = async ({ start, end }) => {
  console.log(
    `Calling OpenRouteService API for route from ${JSON.stringify(
      start
    )} to ${JSON.stringify(end)}`
  );
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPEN_ROUTE_API_KEY}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`
    );
    const data = response.data;
    if (!data || !data.features || data.features.length === 0) {
      throw new Error("Unable to get route from OpenRouteService");
    }
    // Transform coordinates to {lat, lng} format
    return data.features[0].geometry.coordinates.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));
  } catch (error) {
    console.error(
      "Error fetching route from OpenRouteService, will retry in 1000ms:",
      error.message
    );
    await delay(1000);
    return getRoute({ start, end }); // Retry logic
  }
};

export {
  getAddressCoordinates,
  getDistanceAndDuration,
  getLocationSuggestions,
  getCaptainsWithin,
  getRoute,
};
