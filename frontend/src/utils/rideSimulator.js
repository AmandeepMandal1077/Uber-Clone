import axios from "axios";

let simulationInterval = null;
let currentRoute = [];
let currentIndex = 0;
let onStepCallback = null;
let onFinishCallback = null;
let onArrivalAtPickupCallback = null;

async function fetchRoute(start, end) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/maps/get-route`,
      {
        start: { latitude: start.lat, longitude: start.lng },
        end: { latitude: end.lat, longitude: end.lng },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.route;
  } catch (error) {
    console.error("Error fetching route for simulation:", error);
    return [];
  }
}

function step() {
  if (currentIndex < currentRoute.length) {
    const currentLocation = currentRoute[currentIndex];
    if (onStepCallback) {
      // Pass the current location and the remainder of the route
      const remainingRoute = currentRoute.slice(currentIndex);
      onStepCallback(currentLocation, remainingRoute);
    }
    currentIndex++;
  } else {
    clearInterval(simulationInterval);
    simulationInterval = null;
    if (onArrivalAtPickupCallback) {
      const callback = onArrivalAtPickupCallback;
      onArrivalAtPickupCallback = null;
      callback();
    } else if (onFinishCallback) {
      onFinishCallback();
    }
  }
}

export async function startSimulation(
  captainStart,
  pickup,
  onStep,
  onArrivalAtPickup,
  speed = 1000
) {
  stopSimulation();
  onStepCallback = onStep;
  onArrivalAtPickupCallback = onArrivalAtPickup;

  currentRoute = await fetchRoute(captainStart, pickup);
  currentIndex = 0;

  if (currentRoute.length > 0) {
    simulationInterval = setInterval(step, speed);
  } else {
    console.error("Could not fetch route from Captain to Pickup.");
  }
}

export async function continueSimulation(
  pickup,
  destination,
  onStep,
  onFinish,
  speed = 1000
) {
  stopSimulation();
  onStepCallback = onStep;
  onFinishCallback = onFinish;

  currentRoute = await fetchRoute(pickup, destination);
  currentIndex = 0;

  if (currentRoute.length > 0) {
    simulationInterval = setInterval(step, speed);
  } else {
    console.error("Could not fetch route from Pickup to Destination.");
    if (onFinish) onFinish();
  }
}

export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  currentRoute = [];
  currentIndex = 0;
  onStepCallback = null;
  onFinishCallback = null;
  onArrivalAtPickupCallback = null;
}
