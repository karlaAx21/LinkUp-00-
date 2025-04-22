import React from "react";
import { Link } from "react-router-dom";
import styles from "./usercard.module.css";

const UserCard = ({ user }) => {
  return (
    <div className={styles.userCard}>
      <Link to={`/profile/${user.Username}`} className={styles.username}>
        <h4>{user.Username}</h4>
      </Link>
      <button className={styles.followBtn}>Follow</button>
    </div>
  );
};

export default UserCard;
