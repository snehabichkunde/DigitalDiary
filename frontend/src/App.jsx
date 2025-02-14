import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/ContextProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Signup";
import AddStory from "./pages/AddStory";
import StoryDetails from "./pages/StoryDetail";
import Drafts from "./pages/Drafts";
import "./App.css";

const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname !== "/login" && location.pathname !== "/register") {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [user, location]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const lastPath = sessionStorage.getItem("lastPath") || "/home";

    if (isLoggedIn && !user) {
      navigate(lastPath);
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/add" element={<PrivateRoute><AddStory /></PrivateRoute>} />
      <Route path="/story/:id" element={<PrivateRoute><StoryDetails /></PrivateRoute>} />
      <Route path="/draft" element={<PrivateRoute><Drafts /></PrivateRoute>} />
      <Route path="/" element={user ? <Home /> : <Login />} />
    </Routes>
  );
};

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
