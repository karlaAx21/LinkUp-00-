import React from "react";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css"; // Create this CSS file

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
