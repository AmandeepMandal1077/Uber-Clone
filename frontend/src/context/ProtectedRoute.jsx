import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import { SocketContext } from "./SocketContext.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(UserContext);
  const { isConnected, setIsConnected } = useContext(SocketContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // console.log("ProtectedRoute: Starting user profile fetch...");
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("ProtectedRoute: API response:", response);

        if (response.status === 200 && response.data && response.data.user) {
          // User is authenticated
          // Update the user context with the returned data
          // console.log("ProtectedRoute: Setting user data:", response.data.user);
          setUser(response.data.user);
          setLoading(false);
        } else {
          console.error(
            "ProtectedRoute: Invalid response structure:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If there's an error, redirect to login
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  if (!token) {
    return null; // or a loading spinner while redirecting
  }

  return <>{children}</>;
}

export default ProtectedRoute;
