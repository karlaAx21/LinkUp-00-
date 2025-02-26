import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css"; // Import CSS Module

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className={styles.homepage}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>LinkUp</h1>
        <div className={styles.navButtons}>
          <button className={styles.loginBtn} onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className={styles.signupBtn} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* Centered Content */}
      <div className={styles.centerContent}>
        <h1 className={`${styles.mainTitle} ${styles.glow}`}>LinkUp</h1>
      </div>
    </div>
  );
};

export default HomePage;
