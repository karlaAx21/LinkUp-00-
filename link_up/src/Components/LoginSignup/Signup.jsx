import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import { useNavigate } from "react-router-dom";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key].trim() === "") {
        setError("All fields are required.");
        return;
      }
    }

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
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
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
    <div className={styles.container}>
      <h2>Sign Up</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-envelope"></i>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className={styles.submit}>Sign Up</button>
      </form>

      <p>Already have an account? <span onClick={() => navigate("/login")}>Log In</span></p>
    </div>
  );
};

export default Signup;
