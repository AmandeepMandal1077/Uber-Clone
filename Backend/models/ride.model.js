import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },
    otp: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

const RIDE = mongoose.model("Ride", rideSchema);
export default RIDE;
