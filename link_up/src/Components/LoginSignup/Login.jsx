import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ Username: "", Password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Username || !formData.Password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users");
      const users = await res.json();

      const user = users.find(
        (u) => u.Username === formData.Username && u.Password === formData.Password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/feed");
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Login to LinkUp</h2>
        <p className={styles.authSubtitle}>Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit}>
          <label className={styles.authLabel}>Username</label>
          <input
            className={styles.authInput}
            type="text"
            name="Username"
            value={formData.Username}
            placeholder="name@example.com"
            onChange={handleChange}
            required
          />

          <div className={styles.authPasswordRow}>
            <label className={styles.authLabel}>Password</label>
            <span className={styles.forgotPassword}>Forgot password?</span>
          </div>
          <input
            className={styles.authInput}
            type="password"
            name="Password"
            value={formData.Password}
            placeholder="••••••••"
            onChange={handleChange}
            required
          />

          {error && <div className={styles.authError}>{error}</div>}

          <button type="submit" className={styles.authButton}>
            Login
          </button>
        </form>

        <div className={styles.authFooter}>
          <span>Don't have an account?</span>
          <span className={styles.signupLink} onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
