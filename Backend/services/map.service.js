import axios from "axios";

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getAddressCoordinates = async ({ address }) => {
  if (!address) {
    throw new Error("Address is required");
  }
  try {
    delay(1000);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const response = await axios.get(nominatimUrl, {
      headers: {
        "User-Agent": "Yatra",
      },
    });
    const data = response.data;
    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }
    return { latitude: data[0].lat, longitude: data[0].lon };
  } catch (error) {
    throw new Error("Failed to fetch coordinates");
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
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPEN_ROUTE_API_KEY}&start=${originCoords.longitude},${originCoords.latitude}&end=${destinationCoords.longitude},${destinationCoords.latitude}`
    );
    const data = response.data;
    // console.log(JSON.stringify(data, null, 2));
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

export {
  getAddressCoordinates,
  getDistanceAndDuration,
  getLocationSuggestions,
};
