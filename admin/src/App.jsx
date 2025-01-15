import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/ManageUsers";
import Orders from "./pages/ManageOrders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

// Main Layout Component
const MainLayout = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/accesslogin";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/accesslogin" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

// ProtectedRoute Component
const ProtectedRoute = () => {
  const adminId = localStorage.getItem("adminId");
  return adminId ? <Outlet /> : <Navigate to="/accesslogin" />;
};

export default App;