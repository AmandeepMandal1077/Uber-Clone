import React, { useState, useEffect } from "react";
import axios from "axios";

export const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // Start with null instead of empty object
  const [loading, setLoading] = useState(true);

  // Wrapper function to add logging
  const setUserWithLogging = (userData) => {
    console.log("UserContext: setUser called with:", userData);
    setUser(userData);
  };

  // Set loading to false once user is set (by ProtectedRoute or other components)
  // useEffect(() => {
  //   console.log("UserContext: User state changed:", user);
  //   if (user?._id) {
  //     setLoading(false);
  //   }
  // }, [user]); // Use the full user object instead of user._id

  return (
    <UserContext.Provider
      value={{ user, setUser: setUserWithLogging, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
