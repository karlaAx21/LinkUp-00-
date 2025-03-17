import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId); // Debugging log
  
    if (!userId) {
      console.error("No user logged in.");
      return;
    }
  
    fetch(`https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data); // Debugging log
        setUser(data);
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
