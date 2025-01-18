import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './context/ContextProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Signup';

const App = () => {
  const { user } = useAuth();  // Access the user from context

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

        {/* Default route: redirect to home if the user is logged in, otherwise go to login */}
        <Route
          path="/"
          element={user ? <Home /> : <Login />}  // If user is logged in, redirect to Home
        />
      </Routes>
    </Router>
  );
};

export default App;
