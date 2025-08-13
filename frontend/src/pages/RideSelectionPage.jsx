import React, { useContext } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import RideTracker from "../components/RideTracker";
import SearchingDriver from "../components/SearchingDriver";
import PaymentConfirmation from "../components/PaymentConfirmation";
import OTPDisplay from "../components/OTPDisplay";

const RideSelectionPage = ({
  rideOptions,
  selectedRide,
  onRideSelect,
  onBookRide,
  onBack,
  isSearchingDriver,
  showPaymentConfirm,
  onConfirmPayment,
  pickup,
  destination,
  otp,
  isLoadingOtp,
  // New props for ride tracking
  activeRide,
  rideState,
  pickupCoords,
  destinationCoords,
  onRideComplete,
}) => {
  const { sendMessage } = useContext(SocketContext);

  if (isSearchingDriver) {
    return <SearchingDriver />;
  }

  if (showPaymentConfirm) {
    // If OTP is available and we have an active ride, show only the OTP section
    if (otp && activeRide) {
      return (
        <OTPDisplay
          otp={otp}
          pickup={pickup}
          destination={destination}
          activeRide={activeRide}
          onBack={onBack}
        />
      );
    }

    // Default payment confirmation screen (before OTP)
    return (
      <PaymentConfirmation
        onConfirmPayment={onConfirmPayment}
        pickup={pickup}
        destination={destination}
      />
    );
  }

  return (
    <div className="h-full w-full bg-[#fdf0d5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#003049] hover:text-[#c1121f] transition-colors"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium text-sm md:text-base">Back</span>
        </button>
        <h2 className="text-lg md:text-xl font-bold text-[#003049]">
          Choose a ride
        </h2>
        <div className="w-16"></div> {/* Spacer for center alignment */}
      </div>

      {/* Ride Options */}
      <div className="flex-1 p-3 md:p-4 space-y-3 overflow-y-auto">
        {rideOptions.map((ride) => (
          <div
            key={ride.id}
            onClick={() => onRideSelect(ride)}
            className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all flex-shrink-0 ${
              selectedRide?.id === ride.id
                ? "border-[#c1121f] bg-white shadow-md"
                : "border-[#669bbc] bg-white hover:border-[#c1121f] hover:bg-[#fdf0d5]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#669bbc] rounded-lg flex items-center justify-center flex-shrink-0">
                  <i
                    className={`${ride.icon} text-white text-lg md:text-xl`}
                  ></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#003049] text-sm md:text-lg">
                    {ride.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#003049] opacity-50 text-xs">
                      {ride.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[#c1121f] font-bold text-sm md:text-lg">
                  {ride.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Ride Button */}
      {selectedRide && (
        <div className="flex-shrink-0 p-3 md:p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onBookRide}
            className="w-full bg-[#c1121f] hover:bg-[#780000] text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            Book {selectedRide.name} - {selectedRide.price}
          </button>
        </div>
      )}
    </div>
  );
};

export default RideSelectionPage;
