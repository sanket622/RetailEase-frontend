import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Ensure jwt-decode is imported

const PrivateComponent = () => {
  const auth = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Check if token exists and is valid
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" />;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" />;
    }
  }

  // If user and token exist, render Outlet for protected routes
  return auth && token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateComponent;
