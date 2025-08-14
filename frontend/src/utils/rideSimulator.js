// This utility simulates a captain's movement for testing purposes.

let simulationInterval = null;
let route = [];
let currentIndex = 0;
let onStepCallback = null;
let onFinishCallback = null;

/**
 * Generates a series of coordinates between a start and end point.
 * @param {object} start - { lat, lng }
 * @param {object} end - { lat, lng }
 *param {number} steps - Number of points to generate.
 * @returns {array} - An array of { lat, lng } objects.
 */
function generateRoute(start, end, steps = 50) {
  const routePoints = [];
  for (let i = 0; i <= steps; i++) {
    const lat = start.lat + (end.lat - start.lat) * (i / steps);
    const lng = start.lng + (end.lng - start.lng) * (i / steps);
    routePoints.push({ lat, lng });
  }
  return routePoints;
}

/**
 * Starts the simulation along a generated route.
 * @param {object} startCoords - The starting coordinates {lat, lng}.
 * @param {object} endCoords - The ending coordinates {lat, lng}.
 * @param {function} onStep - Callback function executed on each step with the new location.
 * @param {function} onFinish - Callback function executed when the route is complete.
 * @param {number} speed - Interval speed in milliseconds.
 */
export function startSimulation(
  startCoords,
  endCoords,
  onStep,
  onFinish,
  speed = 2000
) {
  stopSimulation(); // Ensure any existing simulation is stopped

  route = generateRoute(startCoords, endCoords);
  currentIndex = 0;
  onStepCallback = onStep;
  onFinishCallback = onFinish;

  simulationInterval = setInterval(() => {
    if (currentIndex < route.length) {
      const currentLocation = route[currentIndex];
      if (onStepCallback) {
        onStepCallback(currentLocation);
      }
      currentIndex++;
    } else {
      stopSimulation();
      if (onFinishCallback) {
        onFinishCallback();
      }
    }
  }, speed);
}

/**
 * Stops the current simulation.
 */
export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  route = [];
  currentIndex = 0;
  onStepCallback = null;
  onFinishCallback = null;
}
