import React from "react";
import { HashRouter  as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";

const App = () => {
  // Function to check if the admin is logged in
  const isAdminAuthenticated = () => {
    return localStorage.getItem("adminData") !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<AdminRegister />} />

        {/* Protected Route for Admin Dashboard with nested routes */}
        <Route
          path="/dashboard/*"
          element={isAdminAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;