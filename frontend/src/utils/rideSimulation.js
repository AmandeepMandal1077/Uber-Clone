// Locations data for ride simulation
export const locations = [
  { name: "Connaught Place", coords: { lat: 28.6304, lng: 77.2177 } },
  { name: "India Gate", coords: { lat: 28.6129, lng: 77.2295 } },
  { name: "Lotus Temple", coords: { lat: 28.5535, lng: 77.2601 } },
  { name: "Red Fort", coords: { lat: 28.6562, lng: 77.241 } },
  { name: "Qutub Minar", coords: { lat: 28.5244, lng: 77.1855 } },
];

// Customer names for ride simulation
export const customerNames = [
  "Rahul",
  "Priya",
  "Amit",
  "Neha",
  "Vikram",
  "Anjali",
];

// Generate a random ride request
export const generateRideRequest = () => {
  const pickupIndex = Math.floor(Math.random() * locations.length);
  let dropoffIndex = Math.floor(Math.random() * locations.length);

  // Ensure pickup and dropoff are different locations
  while (dropoffIndex === pickupIndex) {
    dropoffIndex = Math.floor(Math.random() * locations.length);
  }

  const distance = (Math.random() * (15 - 1) + 1).toFixed(1);
  const duration = Math.floor(distance * 2 + Math.random() * 5);
  const fare = Math.floor(50 + distance * 15 + Math.random() * 30);
  const customerName =
    customerNames[Math.floor(Math.random() * customerNames.length)];
  const customerRating = (4 + Math.random()).toFixed(1);
  const otp = String(1000 + Math.floor(Math.random() * 9000)); // 4-digit OTP

  return {
    id: Date.now().toString(),
    customerName,
    customerRating,
    pickup: locations[pickupIndex].name,
    dropoff: locations[dropoffIndex].name,
    pickupCoords: locations[pickupIndex].coords,
    dropoffCoords: locations[dropoffIndex].coords,
    distance: `${distance} km`,
    duration: `${duration} min`,
    fare: `₹${fare}`,
    otp,
  };
};
