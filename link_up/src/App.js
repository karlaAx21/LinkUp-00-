import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Sidebar/Layout"; // Import Layout
import HomePage from "./HomePage";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import Feed from "./Components/Feed/Feed";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITHOUT Sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Pages WITH Sidebar */}
        <Route path="/feed" element={<Layout><Feed /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
