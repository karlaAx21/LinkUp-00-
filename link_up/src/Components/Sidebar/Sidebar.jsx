import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>Link<span>Up</span></h1>

      <div className={styles.profileCard}>
        <img
          src={user?.ProfilePic || "/default.png"}
          alt="Profile"
          className={styles.avatar}
        />
        <p className={styles.name}>{user?.FirstName} {user?.LastName}</p>
        <p className={styles.handle}>@{user?.Username}</p>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/feed" className={styles.link}>Feed</NavLink>
        <NavLink to="/messages" className={styles.link}>Messages <span className={styles.badge}>3</span></NavLink>
        <NavLink to="/friends" className={styles.link}>Friends <span className={styles.badge}>2</span></NavLink>
        <NavLink to="/explore" className={styles.link}>Explore</NavLink>
        <NavLink to="/notifications" className={styles.link}>Notifications <span className={styles.badge}>5</span></NavLink>
        <NavLink to={`/profile/${user?.Username}`} className={styles.link}>Profile</NavLink>
      </nav>

      <button className={styles.logout} onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
