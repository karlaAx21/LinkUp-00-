import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // ✅ Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser, // ✅ make setUser accessible so Login can update it
        messages,
        setMessages,
        activeChat,
        setActiveChat,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
