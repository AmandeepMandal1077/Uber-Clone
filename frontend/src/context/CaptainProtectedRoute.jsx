import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaptainProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/captain-login");
    } else {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsChecking(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching captain profile:", error);
          navigate("/captain-login");
        });

      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#fdf0d5] flex items-center justify-center">
        <div className="text-[#780000] text-xl font-bold">
          Loading Captain Dashboard...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default CaptainProtectedRoute;
