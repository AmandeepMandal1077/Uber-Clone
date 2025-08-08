import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            // User is authenticated
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          navigate("/login");
        });
    }
  }, [token, navigate]);

  if (!token) {
    return null; // or a loading spinner while redirecting
  }

  return <>{children}</>;
}

export default ProtectedRoute;
