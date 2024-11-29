import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AuthPage from "./Pages/AuthPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import MyOrder from "./Pages/MyOrder";
import MyProfile from "./Pages/MyProfile";
import CarBooking from './Pages/CarBooking';
import FlatBooking from './Pages/FlatBooking';
import AdminPanel from "./Pages/AdminPanel";
import AccessLogin from "./Pages/accesslogin";

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/authpage" || location.pathname.startsWith("/adminpanel");

  return (
    <>
      {!hideNavAndFooter && <Nav />}
      <Routes>
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/myorder" element={<MyOrder />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/car-booking" element={<CarBooking />} />
        <Route path="/flat-booking" element={<FlatBooking />} />
        <Route path="/accesslogin" element={<AccessLogin />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
