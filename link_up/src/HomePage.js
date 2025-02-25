import React from "react";
import "./style.css"; // Import custom CSS file

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">LinkUp</h1>
        <div className="nav-buttons">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>

      {/* Centered Content */}
      <div className="center-content">
        <h1 className="main-title glow">LinkUp</h1>
      </div>
    </div>
  );
};

export default HomePage;
