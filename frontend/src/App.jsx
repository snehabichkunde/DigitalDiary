import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./context/ContextProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Signup";
import AddStory from "./pages/AddStory"; 

const App = () => {
  const { user } = useAuth(); 
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Protected Home route */}
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
          element={user ? <Home /> : <Login />} // If user is logged in, redirect to Home
        />
      </Routes>
    </Router>
  );
};

export default App;
