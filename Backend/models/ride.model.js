import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
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
    vehicleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", //user entering details
        "payed", //user entered details, and is going to pay
        "confirmed", //user has confirmed the ride
        "ongoing", //ride is currently ongoing
        "completed", //ride has been completed
        "cancelled", //ride has been cancelled
      ],
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
