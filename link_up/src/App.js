import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Sidebar/Layout"; // Import Layout
import HomePage from "./HomePage";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import Feed from "./Components/Feed/Feed";
import Profile from "./Components/Profile/Profile"; // ✅ Import Profile Page
import { UserProvider } from "./contextProvider"; // Import UserProvider
import CustomizeProfile from "./Components/Profile/EditProfile";

function LinkUp() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Pages WITHOUT Sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customize-profile/:username" element={<CustomizeProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} /> 
        {/* Pages WITH Sidebar */}
        <Route path="/feed" element={<Layout><Feed /></Layout>} />

      </Routes>
    </Router>
    </UserProvider>
  );
}

export default LinkUp;

