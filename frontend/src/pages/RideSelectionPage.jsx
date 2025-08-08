import React from "react";

const RideSelectionPage = ({
  rideOptions,
  selectedRide,
  onRideSelect,
  onBookRide,
  onBack,
  isSearchingDriver,
  showPaymentConfirm,
  onConfirmPayment,
}) => {
  if (isSearchingDriver) {
    return (
      <div className="h-full w-full flex flex-col bg-[#fdf0d5]">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-[#c1121f] mx-auto mb-4"></div>
            <h3 className="text-lg md:text-xl font-semibold text-[#003049] mb-2">
              Looking for drivers...
            </h3>
            <p className="text-[#003049] opacity-75 text-sm md:text-base">
              We're finding the best driver for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentConfirm) {
    return (
      <div className="h-full w-full flex flex-col bg-[#fdf0d5]">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 md:p-6 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-[#003049] mb-2">
              Driver Found!
            </h3>
            <p className="text-[#003049] opacity-75 mb-4 text-sm md:text-base">
              Confirm your payment to complete the booking
            </p>
            <div className="bg-[#fdf0d5] rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#003049] font-medium text-sm md:text-base">Ride Type:</span>
                <span className="text-[#003049] text-sm md:text-base">{selectedRide?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#003049] font-medium text-sm md:text-base">Total Amount:</span>
                <span className="text-[#c1121f] font-bold text-lg">{selectedRide?.price}</span>
              </div>
            </div>
            <button
              onClick={onConfirmPayment}
              className="w-full bg-[#c1121f] hover:bg-[#780000] text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors text-sm md:text-base"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#fdf0d5]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#003049] hover:text-[#c1121f] transition-colors"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm md:text-base">Back</span>
        </button>
        <h2 className="text-lg md:text-xl font-bold text-[#003049]">Choose a ride</h2>
        <div className="w-16"></div> {/* Spacer for center alignment */}
      </div>

      {/* Ride Options */}
      <div className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto">
        {rideOptions.map((ride) => (
          <div
            key={ride.id}
            onClick={() => onRideSelect(ride)}
            className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
              selectedRide?.id === ride.id
                ? "border-[#c1121f] bg-white shadow-md"
                : "border-[#669bbc] bg-white hover:border-[#c1121f] hover:bg-[#fdf0d5]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#669bbc] rounded-lg flex items-center justify-center">
                  <i className={`${ride.icon} text-white text-lg md:text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-[#003049] text-sm md:text-lg">{ride.name}</h3>
                  <p className="text-[#003049] opacity-75 text-xs md:text-sm">{ride.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="text-[#003049] text-xs">{ride.rating}</span>
                    <span className="text-[#003049] opacity-50 text-xs">• {ride.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#c1121f] font-bold text-sm md:text-lg">{ride.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Ride Button */}
      {selectedRide && (
        <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
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
