import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginSignup.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    for (const key in formData) {
      if (!formData[key]) {
        setError("All fields are required.");
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Username: formData.username,
            email: formData.email,
            Password: formData.password,
            createdAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create account. Please try again.");
      }

      alert("Sign-up successful! Redirecting to Log In...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Sign-up failed. Please try again.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Signup Form Section */}
      <div className={styles.container}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subText}>Join LinkUp today and connect with your friends.</p>
  
        {error && <p className={styles.error}>{error}</p>}
  
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input}>
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input}>
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input}>
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
  
          <button type="submit" className={styles.submit}>Sign Up</button>
        </form>
  
        <p className={styles.loginText}>
          Already have an account? <span onClick={() => navigate("/login")}>Log In</span>
        </p>
      </div>

    </div>
  );  
};

export default Signup;
