import React, { useState } from "react";

export const CaptainContext = React.createContext();

function CaptainContextProvider({ children }) {
  const [captain, setCaptain] = useState({
    fullname: {
      firstname: "",
      lastname: "",
    },
    email: "",
    vehicle: {
      type: "",
      color: "",
      capacity: "",
      number: "",
    },
  });

  return (
    <CaptainContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainContext.Provider>
  );
}

export default CaptainContextProvider;
