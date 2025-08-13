import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainContext } from "./CaptainContext.jsx";
import { SocketContext } from "./SocketContext.jsx";

function CaptainProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainContext);
  const { isConnected } = useContext(SocketContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    const fetchCaptainProfile = async () => {
      try {
        // setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data && response.data.captain) {
          // Captain is authenticated
          // Update the captain context with the returned data
          setCaptain(response.data.captain);
          // setLoading(false);
        } else {
          console.error(
            "CaptainProtectedRoute: Invalid response structure:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching captain profile:", error);
        // If there's an error, redirect to login
        localStorage.removeItem("token");
        navigate("/captain-login");
      } finally {
        setIsChecking(false);
      }
    };

    fetchCaptainProfile();
  }, [token, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#fdf0d5] flex items-center justify-center">
        <div className="text-[#780000] text-xl font-bold">
          Loading Captain Dashboard...
        </div>
      </div>
    );
  }

  if (!token) {
    return null; // or a loading spinner while redirecting
  }

  return <>{children}</>;
}

export default CaptainProtectedRoute;
