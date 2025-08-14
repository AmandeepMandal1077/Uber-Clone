import React, { useState } from "react";
import OtpVerificationForm from "./OtpVerificationForm";

const CurrentRidePanel = ({
  currentRide,
  rideStarted,
  onVerifyOtp,
  onCompleteRide,
}) => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  const handleVerify = () => {
    onVerifyOtp(enteredOtp);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-bold text-xl text-black mb-3">
        {rideStarted ? "En Route to Destination" : "Head to Pickup"}
      </h3>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 text-black">
        <p>
          <strong>Pickup:</strong> {currentRide.pickupLocation}
        </p>
        <p>
          <strong>Dropoff:</strong> {currentRide.dropoffLocation}
        </p>
        <p>
          <strong>Fare:</strong> ₹{currentRide.fare}
        </p>
        <p className="text-sm text-red-600 mt-2">Test OTP: {currentRide.otp}</p>
      </div>

      {!rideStarted ? (
        showOtpForm ? (
          <OtpVerificationForm
            enteredOtp={enteredOtp}
            setEnteredOtp={setEnteredOtp}
            onVerify={handleVerify}
            onCancel={() => setShowOtpForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowOtpForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Arrived at Pickup - Verify OTP
          </button>
        )
      ) : (
        <button
          onClick={onCompleteRide}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
        >
          Complete Ride
        </button>
      )}
    </div>
  );
};

export default CurrentRidePanel;
