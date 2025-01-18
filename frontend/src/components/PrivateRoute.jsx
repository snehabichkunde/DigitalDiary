import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
