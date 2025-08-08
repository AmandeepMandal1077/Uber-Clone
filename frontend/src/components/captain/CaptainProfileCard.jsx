import React from "react";

const CaptainProfileCard = ({ captain, isOnline, toggleOnlineStatus }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-[#780000] text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
          <span className="text-xl">👤</span>
        </div>
        <div>
          <h2 className="font-bold text-[#003049]">
            {captain.fullname?.firstname} {captain.fullname?.lastname}
          </h2>
          <p className="text-sm text-[#669bbc]">Captain</p>
        </div>
      </div>
      <button
        onClick={toggleOnlineStatus}
        className={`${
          isOnline
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white py-2 px-4 rounded-lg font-medium shadow transition-colors`}
      >
        {isOnline ? "Go Offline" : "Go Online"}
      </button>
    </div>
  );
};

export default CaptainProfileCard;
