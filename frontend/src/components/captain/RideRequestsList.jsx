import React from "react";
import RideRequestCard from "./RideRequestCard";

const RideRequestsList = ({ rideRequests, onAcceptRide, onDeclineRide }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-[#003049] mb-2">Ride Requests</h3>
      {rideRequests.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No ride requests at the moment. Stay online to receive requests.
        </p>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-600">
              Available Requests
            </h4>
            <span className="bg-[#003049] text-white text-xs px-2 py-1 rounded-full">
              {rideRequests.length}{" "}
              {rideRequests.length === 1 ? "request" : "requests"}
            </span>
          </div>
          {rideRequests.length > 2 && (
            <p className="text-xs text-gray-500 italic mb-2 text-right md:block">
              Scroll to see {rideRequests.length - 2} more{" "}
              {rideRequests.length - 2 === 1 ? "request" : "requests"}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pr-2 overflow-y-auto md:h-[250px] max-h-[400px] relative">
            {rideRequests.length > 2 && (
              <div className="hidden md:block absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
            {rideRequests.map((request) => (
              <RideRequestCard
                key={request.id || request._id || `ride-${Math.random()}`}
                request={request}
                onAccept={onAcceptRide}
                onDecline={onDeclineRide}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RideRequestsList;
