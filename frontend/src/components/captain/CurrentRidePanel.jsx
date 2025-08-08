import React from "react";
import OtpVerificationForm from "./OtpVerificationForm";

const CurrentRidePanel = ({
  currentRide,
  rideStarted,
  showOtpVerification,
  completingRide,
  enteredOtp,
  setEnteredOtp,
  testMode,
  onArrivedAtPickup,
  onVerifyOtp,
  onCompleteRide,
  onConfirmRideComplete,
  onCancelOtp,
}) => {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-[#003049]">
          {rideStarted ? "Ride in Progress" : "Pickup Passenger"}
        </h3>
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            rideStarted
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {rideStarted ? "In Progress" : "Pickup"}
        </div>
      </div>

      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-[#669bbc] rounded-full flex items-center justify-center mr-3 text-white font-bold">
          {currentRide.customerName.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{currentRide.customerName}</p>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm text-gray-600">
              {currentRide.customerRating}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg mb-3">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-[#c1121f] rounded-full mr-2"></div>
          <p className="text-sm">{currentRide.pickup}</p>
        </div>
        <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1.5"></div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#669bbc] rounded-full mr-2"></div>
          <p className="text-sm">{currentRide.dropoff}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <div>
          <span className="font-medium">Distance:</span> {currentRide.distance}
        </div>
        <div>
          <span className="font-medium">Duration:</span> {currentRide.duration}
        </div>
        <div>
          <span className="font-medium">Fare:</span> {currentRide.fare}
        </div>
      </div>

      {/* Test Mode OTP Display */}
      {testMode && !rideStarted && (
        <div className="bg-yellow-100 p-2 mb-3 rounded text-center">
          <p className="font-bold text-yellow-800">TEST MODE</p>
          <p className="text-yellow-800">
            OTP for testing:{" "}
            <span className="font-bold">{currentRide.otp}</span>
          </p>
        </div>
      )}

      {!rideStarted ? (
        showOtpVerification ? (
          <OtpVerificationForm
            enteredOtp={enteredOtp}
            setEnteredOtp={setEnteredOtp}
            onVerify={onVerifyOtp}
            onCancel={onCancelOtp}
          />
        ) : (
          <button
            onClick={onArrivedAtPickup}
            className="w-full bg-[#003049] text-white py-3 rounded-lg font-medium hover:bg-[#00436b] transition-colors"
          >
            Arrived at Pickup - Verify OTP
          </button>
        )
      ) : completingRide ? (
        <button
          onClick={onConfirmRideComplete}
          className="w-full bg-[#c1121f] text-white py-3 rounded-lg font-medium hover:bg-[#780000] transition-colors"
        >
          Confirm Ride Complete
        </button>
      ) : (
        <button
          onClick={onCompleteRide}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Complete Ride
        </button>
      )}
    </div>
  );
};

export default CurrentRidePanel;
