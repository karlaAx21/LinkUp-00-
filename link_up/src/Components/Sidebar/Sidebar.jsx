import React, { useContext } from "react";
import { NavLink, Link} from "react-router-dom";
import styles from "./Sidebar.module.css";
import { UserContext } from "../../contextProvider";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className={styles.sidebar}>
  
  <h1 className={styles.logo}>LinkUp</h1>

  <Link to={`/profile/${user?.Username}`} className={styles.profile}>

    <img
      src={"./logo512.png"}
      alt="User"
      className={styles.profilePic}
    />
    <Link 
      to={`/profile/${user?.FirstName}-${user?.LastName}`} 
      className={styles.username}>
      {user?.FirstName} {user?.LastName}
    </Link>
    {user?.Username && (
       <Link to={`/profile/${user.Username}`} className={styles.userHandle}>
          <span>@{user.Username}</span>
       </Link>
    )}
  </Link>
      <ul className={styles.navList}>
        <li><NavLink to="/" className={styles.navItem}>🏠 Home</NavLink></li>
        <li><NavLink to="/explore" className={styles.navItem}>🔍 Explore</NavLink></li>
        <li><NavLink to="/people" className={styles.navItem}>👥 People</NavLink></li>
        <li><NavLink to="/saved" className={styles.navItem}>📌 Saved</NavLink></li>
        <li><NavLink to="/create-post" className={styles.navItem}>➕ Create Post</NavLink></li>
      </ul>
      <button
        className={styles.logout}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login"; 
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Sidebar;