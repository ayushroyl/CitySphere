import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AuthPage from "./Pages/AuthPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import MyOrder from "./Pages/MyOrder";
import MyProfile from "./Pages/MyProfile";
import CarBooking from './Pages/CarBooking';
import FinalCarBook from './Pages/FinalCarBook';
import FlatBooking from './Pages/FlatBooking';
import ForgetPass from "./Pages/Forgotpass";
import NotFound from "./Pages/NotFound";
import PrivacyPolicy from "./Pages/PrivacyPolicy";


function App() {
  return (
    <Router>
      {/* Ensure layout spans full height */}
      <div className="flex flex-col min-h-screen">
        <MainRoutes />
      </div>
    </Router>
  );
}

function MainRoutes() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/authpage" || location.pathname.startsWith("/forget-password") || location.pathname.startsWith("/privacy-policy");

  return (
    <>
      {!hideNavAndFooter && <Nav />}
      <main className="flex-grow">
        {/* Main content goes here */}
        <Routes>
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/forget-password" element={<ForgetPass />} />
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/car-booking" element={<CarBooking />} />
          <Route path="/finalcarbook" element={<FinalCarBook />} />
          <Route path="/flat-booking" element={<FlatBooking />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;