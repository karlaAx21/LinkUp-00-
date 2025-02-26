import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users");
      const users = await response.json();

      const user = users.find((u) => u.username === formData.username && u.password === formData.password);

      if (user) {
        alert(`Welcome, ${user.username}!`);
        navigate("/dashboard"); // Redirect to dashboard (or home)
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className={styles.submit}>Log In</button>
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span></p>
    </div>
  );
};

export default Login;