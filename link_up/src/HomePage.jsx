import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="homepage">
      <nav className="navbar">
        <h1 className="logo">LinkUp</h1>
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate("/login-signup")}>
            Log In
          </button>
          <button className="signup-btn" onClick={() => navigate("/login-signup")}>
            Sign Up
          </button>
        </div>
      </nav>
      <div className="center-content">
        <h1 className="main-title glow">LinkUp</h1>
      </div>
    </div>
  );
};

export default HomePage;
