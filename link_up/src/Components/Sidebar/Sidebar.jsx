import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import io from "socket.io-client";
import styles from "./Sidebar.module.css";

const socket = io("http://localhost:5001");

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    socket.emit("logout", user?.id);
    socket.disconnect();
    localStorage.removeItem("currentUser");
    navigate("/login");
    window.location.reload();
  };

  return (
    <aside
      className="d-flex flex-column bg-white px-4 py-4 vh-100 border-end shadow-sm position-sticky top-0"
      style={{ width: "280px", minWidth: "280px" }}
    >
      <h1 className={`${styles.logo} mb-4`}>
        Link<span className={styles.mint}>Up</span>
      </h1>

      <div className="mb-4 w-100 text-center">
      <img
        src={`http://localhost:5001/users/${user.id}/profile-pic?${Date.now()}`}
        alt="Avatar"
        className="rounded-circle mb-2 shadow-sm border"
        style={{ width: "70px", height: "70px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default.jpg"; 
        }}
      />

        <div className="fw-semibold">{user?.FirstName} {user?.LastName}</div>
        <div className="text-muted small">@{user?.Username}</div>
      </div>

      <nav className="nav flex-column flex-grow-1 w-100">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          📰 Feed
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          💬 Messages
        </NavLink>
        <NavLink
          to="/friends"
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          👥 Friends
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          🔍 Explore
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          🔔 Notifications
        </NavLink>
        <NavLink
          to={`/profile/${user?.Username}`}
          className={({ isActive }) =>
            `nav-link ${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
          }
        >
          🙍‍♂️ Profile
        </NavLink>
      </nav>
      <button
        className="btn btn-outline-success w-100 mt-auto rounded-pill fw-semibold"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;