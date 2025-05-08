import React from "react";
import { Link,useNavigate } from "react-router-dom";

const WorkerNavbar = () => {
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
        <li><Link to="/worker/tasks-assigned" style={styles.link}>Tasks Assigned</Link></li>
        <li><Link to="/worker/completed-tasks" style={styles.link}>Completed Tasks</Link></li>
        <li><Link to="/worker/chat" style={styles.link}>Chat</Link></li>
        <li><Link to="/worker/profile" style={styles.link}>Profile</Link></li>
        <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#003366",
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

export default WorkerNavbar;
