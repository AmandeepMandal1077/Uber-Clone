import React from "react";

const OTPDisplay = ({ otp, pickup, destination, activeRide, onBack }) => {
  return (
    <div className="h-full w-full bg-[#fdf0d5] flex flex-col overflow-hidden">
      {/* Header with OTP */}
      <div className="flex-shrink-0 bg-white p-4 shadow-md">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#003049] mb-2 ">
            Driver Found! Share Your OTP
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <div className="bg-white rounded-lg p-2 flex justify-center">
              <span className="text-xl font-bold tracking-wider text-green-700">
                {otp}
              </span>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-2">
            Share this OTP with your driver to start the ride
          </p>
        </div>
      </div>

      {/* Ride details section */}
      <div className="flex-1 p-4 bg-white">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-[#003049] mb-4">
            Ride Details
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pickup:</span>
              <span className="font-medium text-black">{pickup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Destination:</span>
              <span className="font-medium text-black">{destination}</span>
            </div>
            {activeRide && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium text-black">
                    {activeRide.captain?.fullname?.firstname &&
                    activeRide.captain?.fullname?.lastname
                      ? `${activeRide.captain.fullname.firstname} ${activeRide.captain.fullname.lastname}`
                      : "Driver"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-black">
                    {activeRide.captain?.vehicle?.vehicleType || "Vehicle"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer with action */}
      <div className="flex-shrink-0 p-4 bg-white border-t">
        <button
          onClick={onBack}
          className="w-full text-[#003049] hover:text-[#c1121f] text-sm font-medium"
        >
          Book another ride
        </button>
      </div>
    </div>
  );
};

export default OTPDisplay;
