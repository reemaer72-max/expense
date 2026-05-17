import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStoredUser } from "./utils/storage";

const ProtectedRoute = ({ children }) => {
  const reduxUser = useSelector((state) => state.users.user);
  const user = reduxUser || getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
