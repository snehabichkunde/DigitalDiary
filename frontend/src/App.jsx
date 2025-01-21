import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./context/ContextProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Signup";
import AddStory from "./pages/AddStory";
import "./App.css"; 

const App = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check localStorage for the theme preference on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", !isDarkMode); // Add or remove dark-mode class from body
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div>
      <Router>
        {/* Add a global theme toggle button */}
        <header className="header">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddStory />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={user ? <Home /> : <Login />} // Default route
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
