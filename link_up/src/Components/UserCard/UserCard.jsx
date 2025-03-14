import React from "react";
import styles from "./usercard.module.css";

const UserCard = ({ user }) => {
  return (
    <div className={styles.userCard}>
      <h4 className={styles.username}>{user.Username}</h4>
      <button className={styles.followBtn}>Follow</button>
    </div>
  );
};

export default UserCard;
