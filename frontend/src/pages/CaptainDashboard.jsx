import React, { useContext, useEffect } from "react";
import { CaptainContext } from "../context/CaptainContext";
import { Link } from "react-router-dom";

function CaptainDashboard() {
  const { captain } = useContext(CaptainContext);

  return (
    <div className="min-h-screen bg-[#fdf0d5]">
      {/* Header */}
      <header className="bg-[#780000] text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">YATRA Captain Dashboard</h1>
          <Link
            to="/captain/logout"
            className="bg-[#c1121f] px-4 py-2 rounded-lg text-sm hover:bg-[#003049] transition-colors"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-[#780000] text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#003049]">
                Welcome, Captain {captain.fullname?.firstname}!
              </h2>
              <p className="text-[#669bbc]">Ready to earn with YATRA</p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-[#780000] mb-4">
              Status
            </h3>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-[#003049]">Online & Available</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-[#780000] mb-4">
              Today's Earnings
            </h3>
            <p className="text-2xl font-bold text-[#003049]">₹0</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#780000] mb-4">
            Your Vehicle
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#669bbc] text-sm">Type</p>
              <p className="text-[#003049] font-medium">
                {captain.vehicle?.type || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[#669bbc] text-sm">Color</p>
              <p className="text-[#003049] font-medium">
                {captain.vehicle?.color || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[#669bbc] text-sm">Capacity</p>
              <p className="text-[#003049] font-medium">
                {captain.vehicle?.capacity || "Not set"} seats
              </p>
            </div>
            <div>
              <p className="text-[#669bbc] text-sm">Number</p>
              <p className="text-[#003049] font-medium">
                {captain.vehicle?.number || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-[#780000] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#c1121f] transition-colors">
            Go Online
          </button>
          <button className="bg-[#669bbc] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#003049] transition-colors">
            View Ride History
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaptainDashboard;
