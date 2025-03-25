import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Sidebar/Layout";
import HomePage from "./HomePage";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import Feed from "./Components/Feed/Feed";
import Profile from "./Components/Profile/Profile";
import CustomizeProfile from "./Components/Profile/EditProfile";
import Messages from "./Components/Messages/Messages"; // ✅ NEW
import Friends from "./Components/Friends/Friends";   // ✅ NEW
import Explore from "./Components/Explore/Explore";   // ✅ NEW
import Notifications from "./Components/Notification1/Notifications"; // ✅ NEW
import { UserProvider } from "./contextProvider";

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
          <Route path="/messages" element={<Layout><Messages /></Layout>} />
          <Route path="/friends" element={<Layout><Friends /></Layout>} />
          <Route path="/explore" element={<Layout><Explore /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default LinkUp;