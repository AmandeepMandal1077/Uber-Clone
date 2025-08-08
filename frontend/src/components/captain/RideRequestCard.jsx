import React from "react";

const RideRequestCard = ({ request, onAccept, onDecline }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#669bbc] rounded-full flex items-center justify-center mr-3 text-white font-bold">
            {request.customerName.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{request.customerName}</p>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm text-gray-600">
                {request.customerRating}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-[#c1121f]">{request.fare}</p>
          <p className="text-sm text-gray-500">{request.distance}</p>
        </div>
      </div>

      <div className="bg-white p-2 rounded mb-3">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-[#c1121f] rounded-full mr-2"></div>
          <p className="text-sm">{request.pickup}</p>
        </div>
        <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1.5"></div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#669bbc] rounded-full mr-2"></div>
          <p className="text-sm">{request.dropoff}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onDecline(request.id)}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition-colors text-sm"
        >
          Decline
        </button>
        <button
          onClick={() => onAccept(request)}
          className="flex-1 bg-[#003049] text-white py-2 rounded font-medium hover:bg-[#00436b] transition-colors text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default RideRequestCard;
