import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaptainLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutCaptain = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Call backend logout endpoint
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/captains/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        // Clear token from localStorage
        localStorage.removeItem("captain-token");

        // Navigate to captain login
        navigate("/captain-login");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if logout fails, clear token and navigate
        localStorage.removeItem("captain-token");
        navigate("/captain-login");
      }
    };

    logoutCaptain();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fdf0d5] flex items-center justify-center">
      <div className="text-center">
        <div className="bg-[#780000] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚗</span>
        </div>
        <h2 className="text-2xl font-bold text-[#003049] mb-2">
          Logging out...
        </h2>
        <p className="text-[#669bbc]">Thank you for driving with YATRA</p>
      </div>
    </div>
  );
}

export default CaptainLogout;
