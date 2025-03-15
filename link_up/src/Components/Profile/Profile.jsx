import React from "react";
import styles from "./Profile.module.css";
const Profile = () => {
  return (
    <div style={{
      textAlign: "center",
      padding: "20px"
    }}>
      <h1>Profile Page</h1>
      <p>If you see this, you're on the correct page.</p>

      <button onClick={() => alert("Button Clicked!")}>
        Click Me
      </button>

      <div style={{
        marginTop: "20px"
      }}>
        <h3>Test Image Below:</h3>
        <img 
          src="https://via.placeholder.com/200" 
          alt="Test Image" 
          style={{
            border: "2px solid red",
            width: "200px",
            height: "200px"
          }}
        />
      </div>
    </div>
  );
};

export default Profile;

