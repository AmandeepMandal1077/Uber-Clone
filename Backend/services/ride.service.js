import { getDistanceAndDuration } from "./map.service.js";
import RIDE from "../models/ride.model.js";
import crypto from "crypto";
import CAPTAIN from "../models/captain.model.js";
import mongoose from "mongoose";

const calculateFare = async ({ pickup, destination }) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  console.log("Calculating fare...", {
    pickup,
    destination,
  });
  const dummyFare = {
    car: 100,
    bike: 200,
    rickshaw: 300,
  };
  try {
    const { distanceInKm } = await getDistanceAndDuration({
      origin: pickup,
      destination,
    });

    const baseFare = {
      car: 50,
      bike: 20,
      rickshaw: 30,
    };

    const perKm = {
      car: 10,
      bike: 3,
      rickshaw: 5,
    };

    const fare = {
      car: Math.round(baseFare.car + perKm.car * distanceInKm),
      bike: Math.round(baseFare.bike + perKm.bike * distanceInKm),
      rickshaw: Math.round(baseFare.rickshaw + perKm.rickshaw * distanceInKm),
    };

    return fare;
  } catch (error) {
    return dummyFare;
    // throw new Error("Failed to calculate fare");
  }
};

const generateOTP = (num) => {
  return crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1)
    .toString();
};

const createRideService = async ({
  userId,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  try {
    const dummyFare = {
      car: 100,
      bike: 200,
      rickshaw: 300,
    };
    let fare = await calculateFare({ pickup, destination });
    if (!fare) {
      fare = dummyFare;
    }

    const ride = await RIDE.create({
      user: userId,
      pickupLocation: pickup,
      dropoffLocation: destination,
      fare: fare[vehicleType],
      vehicleType: vehicleType,
      otp: generateOTP(6),
    });

    console.log("Ride details: ", ride);

    return ride;
  } catch (error) {
    throw new Error("Failed to create ride");
  }
};

const confirmRideByCaptain = async ({ rideId, captainId }) => {
  if (!rideId || !captainId) {
    throw new Error("Ride ID and Captain ID are required");
  }

  try {
    // Update ride status and assign captain
    await RIDE.findByIdAndUpdate(rideId, {
      status: "confirmed",
      captain: captainId,
    });

    // Update captain's current ride
    await CAPTAIN.findByIdAndUpdate(captainId, {
      currentRide: rideId,
    });

    const ride = await RIDE.findById(rideId).populate("captain").select("+otp");
    return ride;
  } catch (error) {
    throw new Error("Failed to confirm ride");
  }
};

const getRideDetailsByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const ride = await RIDE.findOne({
      user: new mongoose.Types.ObjectId(userId.toString()),
      $or: [
        { status: { $exists: false } },
        { status: { $ne: "completed" } },
        { status: { $ne: "cancelled" } },
      ],
    });
    if (!ride) {
      throw new Error("Ride not found");
    }

    return ride;
  } catch (error) {
    throw new Error(`Error fetching ride details: \n${error.message}`);
  }
};

const updateRideDetailsByUserId = async ({ userId, rideData }) => {
  if (!userId || !rideData) {
    throw new Error("User ID and ride data are required");
  }

  try {
    const ride = await RIDE.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(userId.toString()),
        $or: [
          { status: { $exists: false } },
          { status: { $ne: "completed" } },
          { status: { $ne: "cancelled" } },
        ],
      },
      { $set: rideData },
      { new: true }
    );
    if (!ride) {
      throw new Error("Ride not found");
    }

    return ride;
  } catch (error) {
    throw new Error(`Error updating ride details: \n${error.message}`);
  }
};

export {
  createRideService,
  generateOTP,
  calculateFare,
  confirmRideByCaptain,
  getRideDetailsByUserId,
  updateRideDetailsByUserId,
};
