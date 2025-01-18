import React from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../context/ContextProvider";

const NavBar = ({ onLogout }) => {
    const {user} = useAuth()
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 30px",
      background: "#ffffff", // Clean white background
      color: "#333", // Neutral dark text color
      borderBottom: "2px solid #f0f0f0", // Subtle border for separation
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Minimal shadow for depth
    },
    quote: {
      fontSize: "18px",
      fontWeight: "500",
      margin: "0",
      fontStyle: "italic", // Adds elegance
      color: "#555", // Softer text for the quote
    },
    logoutButton: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#ffffff",
      background: "#007bff", // Professional blue
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    logoutButtonHover: {
      backgroundColor: "#0056b3", // Darker shade of blue on hover
    },
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = styles.logoutButton.background;
  };

  return (
    <nav style={styles.navbar}>
    <h1 style={styles.quote}>{`${user?.name || "User"}'s diary`}</h1>
    <button
        style={styles.logoutButton}
        onClick={onLogout}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
