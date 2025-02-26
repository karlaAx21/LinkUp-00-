import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Components/LoginSignup/Login"; // ✅ Correct Import
import Signup from "./Components/LoginSignup/Signup"; // ✅ Correct Import
import Feed from "./Components/Feed/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Corrected Path */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ Corrected Path */}
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
