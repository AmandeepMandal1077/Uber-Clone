import React from "react";
import { Link } from "react-router-dom";

const CaptainHeader = ({ isOnline, toggleOnlineStatus }) => {
  return (
    <header className="bg-[#780000] text-white p-4 shadow-lg z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">YATRA Captain</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 ${
                isOnline ? "bg-green-500" : "bg-red-500"
              } rounded-full mr-2`}
            ></div>
            <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className={`${
              isOnline
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white py-1 px-3 rounded-lg text-sm shadow transition-colors`}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
          <Link
            to="/captain/logout"
            className="bg-[#c1121f] px-3 py-1 rounded-lg text-sm hover:bg-[#003049] transition-colors"
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CaptainHeader;
