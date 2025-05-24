import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {

     const navigate = useNavigate();
    
      const handleLogout = () => {
        // Clear local storage/session/cookies if needed
        localStorage.removeItem("token"); // Example: clearing auth token
        sessionStorage.clear();
        
        // Then navigate to login page
        navigate("/login");
      };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li><Link to="/admin/notice" style={styles.link}>Notice</Link></li>
        <li><Link to="/admin/manage-users" style={styles.link}>Manage Users</Link></li>
        <li><Link to="/admin/manage-tasks" style={styles.link}>Manage Tasks</Link></li>
        <li><Link to="/admin/reports" style={styles.link}>Reports</Link></li>
        <li><Link to="/admin/settings" style={styles.link}>Settings</Link></li>
        <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#1e1e2f",
    padding: "12px 20px",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  logoutButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    textDecoration: "underline",
  }

};

export default AdminNavbar;
