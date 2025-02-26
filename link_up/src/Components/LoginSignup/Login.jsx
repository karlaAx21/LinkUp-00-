import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // ✅ State for handling errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users");
      if (!response.ok) throw new Error("Failed to fetch user data.");

      const users = await response.json();
      const user = users.find((u) => u.username === formData.username && u.password === formData.password);

      if (user) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Store logged-in user session
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
      <h2>Log In</h2>
      {/* ✅ Display error messages */}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>

        {/* ✅ Forgot Password section */}
        <p className={styles.forgotPassword} onClick={() => alert("Forgot Password clicked!")}>
          Forgot Password?
        </p>

        <button type="submit" className={styles.submit}>Log In</button>
      </form>

      <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span></p>
    </div>
  );
};

export default Login;
