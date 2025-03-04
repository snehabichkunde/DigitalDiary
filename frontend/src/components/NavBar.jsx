import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";

const SideBar = () => {
  const { user, logout } = useAuth(); // Access logout from useAuth

  const styles = {
    sidebar: {
      height: "100vh", // Fixed height
      width: "250px", // Fixed width
      background: "#2c3e50",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "20px",
      position: "fixed",
      top: "0",
      left: "0",
      boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease",
    },
    header: {
      marginBottom: "20px",
      fontSize: "22px",
      fontWeight: "bold",
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    button: {
      width: "100%",
      padding: "10px 0",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffffff",
      background: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      margin: "10px 0",
      textAlign: "center",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    link: {
      width: "100%",
      textDecoration: "none",
    },
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = styles.button.background;
  };

  const handleLogout = () => {
    logout(); // Calls logout from useAuth
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>{`${user?.name?.split(" ")[0] || "User"}'s Diary`}</div>


      {/* Timeline Button */}
      <Link to="/home" style={styles.link}>
        <button
          style={styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Timeline
        </button>
      </Link>

      {/* Add Story Button */}
      <Link to="/add" style={styles.link}>
        <button
          style={styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Add
        </button>
      </Link>

      {/* Draft Button */}
      <Link to="/draft" style={styles.link}>
        <button
          style={styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Draft
        </button>
      </Link>

      {/* Logout Button */}
      <button
        style={styles.button}
        onClick={handleLogout} // Calls the logout handler
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Logout
      </button>
    </div>
  );
};

export default SideBar;