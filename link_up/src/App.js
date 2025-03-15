import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Sidebar/Layout"; // Import Layout
import HomePage from "./HomePage";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import Feed from "./Components/Feed/Feed";
import Profile from "./Components/Profile/Profile"; // ✅ Import Profile Page

function LinkUp() {
  return (
    <Router>
      <Routes>
        {/* Pages WITHOUT Sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Pages WITH Sidebar */}
        <Route path="/feed" element={<Layout><Feed /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} /> {/* ✅ Add Profile Route */}
        <Route path="/profile/:username" element={<Layout><Profile /></Layout>} /> {/* ✅ Dynamic Profile Route */}
      </Routes>
    </Router>
  );
}

export default LinkUp;

