import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";

const NavBar = ({ onLogout }) => {
  const { user } = useAuth();

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
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    quote: {
      fontSize: "18px",
      fontWeight: "500",
      margin: "0",
      fontStyle: "italic", // Adds elegance
      color: "#555", // Softer text for the quote
    },
    button: {
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
    buttonHover: {
      backgroundColor: "#0056b3", // Darker shade of blue on hover
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
    },
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = styles.button.background;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <h1 style={styles.quote}>{`${user?.name || "User"}'s diary`}</h1>
      </div>
      <div style={styles.buttonContainer}>
        {/* Timeline Button */}
        <Link to="/home">
          <button
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Timeline
          </button>
        </Link>

        {/* Add Story Button */}
        <Link to="/add">
          <button
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Add
          </button>
        </Link>

        {/* Logout Button */}
        <button
          style={styles.button}
          onClick={onLogout}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;