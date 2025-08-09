import { getDistanceAndDuration } from "./map.service.js";
import RIDE from "../models/ride.model.js";
import crypto from "crypto";

const calculateFare = async ({ pickup, destination }) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  try {
    const { distanceInKm } = await getDistanceAndDuration({
      origin: pickup,
      destination,
    });

    const baseFare = {
      car: 50,
      bike: 30,
      rickshaw: 20,
    };

    const perKm = {
      car: 10,
      bike: 5,
      rickshaw: 3,
    };

    const fare = {
      car: Math.round(baseFare.car + perKm.car * distanceInKm),
      bike: Math.round(baseFare.bike + perKm.bike * distanceInKm),
      rickshaw: Math.round(baseFare.rickshaw + perKm.rickshaw * distanceInKm),
    };

    return fare;
  } catch (error) {
    throw new Error("Failed to calculate fare");
  }
};

const generateOTP = (num) => {
  return crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1)
    .toString();
};

const createRide = async ({ userId, pickup, destination, vehicleType }) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  try {
    const fare = await calculateFare({ pickup, destination });

    const ride = RIDE.create({
      userId,
      pickupLocation: pickup,
      dropoffLocation: destination,
      fare: fare[vehicleType],
      otp: generateOTP(6),
    });

    return ride;
  } catch (error) {
    throw new Error("Failed to create ride");
  }
};

export { createRide, generateOTP };
