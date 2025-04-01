import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import "./SideBar.css"; 

const SideBar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar on mobile

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close sidebar on logout (optional)
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button (Visible on Mobile Only) */}
      <button className="hamburger-button" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"} {/* Toggle between hamburger (☰) and close (✕) */}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {`${user?.name?.split(" ")[0] || "User"}'s Diary`}
        </div>

        {/* Timeline Button */}
        <Link to="/home" className="sidebar-link">
          <button
            className="sidebar-button"
            onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
          >
            Timeline
          </button>
        </Link>

        {/* Add Story Button */}
        <Link to="/add" className="sidebar-link">
          <button
            className="sidebar-button"
            onClick={() => setIsOpen(false)}
          >
            Add
          </button>
        </Link>

        {/* Draft Button */}
        <Link to="/draft" className="sidebar-link">
          <button
            className="sidebar-button"
            onClick={() => setIsOpen(false)}
          >
            Draft
          </button>
        </Link>

        {/* Logout Button */}
        <button
          className="sidebar-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default SideBar;