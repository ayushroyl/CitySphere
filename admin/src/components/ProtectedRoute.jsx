import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const adminId = localStorage.getItem("adminId");

  return adminId ? <Outlet /> : <Navigate to="/accesslogin" />;
};

export default ProtectedRoute;
