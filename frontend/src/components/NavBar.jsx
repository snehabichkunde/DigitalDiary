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
      background: "transparent", // Make the navbar background transparent
      color: "#fff", // White text color to contrast with the background image
      borderBottom: "none", // Remove the bottom border if you want it to blend completely
      boxShadow: "none", // Remove shadow to make it look flat and seamless
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
      color: "#fff", // Use white for quote text to contrast with the background
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
