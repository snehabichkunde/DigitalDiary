import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./context/ContextProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Signup";
import AddStory from "./pages/AddStory";
import StoryDetails from "./pages/StoryDetail";
import Drafts  from "./pages/Drafts";
import "./App.css";

const App = () => {
  const { user } = useAuth(); // Retrieve user context for authentication

  return (
    <div className="app-wrapper">
      <Router>
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
            path="/story/:id"
            element={
              <PrivateRoute>
                <StoryDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/draft"
            element={
              <PrivateRoute>
                <Drafts />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={user ? <Home /> : <Login />} // Redirect to Home if logged in, Login otherwise
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
