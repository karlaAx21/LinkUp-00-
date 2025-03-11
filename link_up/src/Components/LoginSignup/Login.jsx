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
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users");
      if (!response.ok) throw new Error("Failed to fetch user data.");

      const users = await response.json();

      const user = users.find((u) => u.Username === formData.Username && u.Password === formData.Password);

      if (user) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/feed");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subText}>Log in to connect with your friends</p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="Username"
            placeholder="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>

        <p className={styles.forgotPassword} onClick={() => alert("Forgot Password clicked!")}>
          Forgot Password?
        </p>

        <button type="submit" className={styles.submit}>Log In</button>
      </form>

      <p className={styles.loginText}>
        Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;