import React from 'react';
import styles from './LoginSignup.module.css'; // Importing CSS Module

const LoginSignup = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>Sign Up</div>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <i className="fa-solid fa-user"></i>
          <input type="text" placeholder="Enter your username" />
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <i className="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Enter your email" />
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <i className="fa-solid fa-lock"></i>
          <input type="password" placeholder="Enter your password" />
        </div>
      </div>

      <div className={styles.forgotPassword}>
        Forgot password? <span>Click Here!</span>
      </div>

      <div className={styles.submitContainer}>
        <div className={styles.submit}>Sign Up</div>
        <div className={styles.submit}>Login</div>
      </div>
    </div>
  );
};

export default LoginSignup;
