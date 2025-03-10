import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css"; // Import CSS Module
import logo from "./Components/images/LinkLogo.webp"; // Adjust file type if necessary

const HomePage = () => {
  const navigate = useNavigate();

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

      {/* Centered Content with Logo */}
      <div className={styles.centerContent}>
        <div className={styles.card}>
          {/* Logo */}
          <img src={logo} alt="LinkUp Logo" className={styles.logoImage} />
          <h1 className={styles.mainTitle}>Connect. Share. Grow.</h1>
          <p className={styles.subText}>
            Join LinkUp to meet new people, share your moments, and build your community.
          </p>
          <button className={styles.getStartedBtn} onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
