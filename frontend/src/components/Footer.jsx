import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path) => location.pathname === path;

  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white py-2 md:py-8">
      {/* Mobile Footer Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-400 shadow-lg border-t flex justify-between px-3 py-1 md:hidden z-50">
        <Link
          to="/"
          className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
            isActive("/") ? "text-indigo-600" : "text-white hover:text-gray-800"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isActive("/") ? "bg-indigo-100 shadow" : "hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon
              icon={faHome}
              className={`text-lg ${isActive("/") ? "text-indigo-600" : "text-white"}`}
            />
          </div>
          <span
            className={`text-xs ${isActive("/") ? "font-bold text-white" : "font-bold text-white"}`}
          >
            Home
          </span>
        </Link>
        <Link
          to="/services"
          className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
            isActive("/services") ? "text-indigo-600" : "text-white hover:text-gray-800"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isActive("/services") ? "bg-indigo-100 shadow" : "hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon
              icon={faClipboardList}
              className={`text-xl ${isActive("/services") ? "text-indigo-600" : "text-white"}`}
            />
          </div>
          <span
            className={`mt-1 text-xs ${isActive("/services") ? "font-bold text-white" : "font-bold text-white"}`}
          >
            Services
          </span>
        </Link>
        <Link
          to="/myorder"
          className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
            isActive("/myorder") ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isActive("/myorder") ? "bg-indigo-100 shadow" : "hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className={`text-xl ${isActive("/myorder") ? "text-indigo-600" : "text-white"}`}
            />
          </div>
          <span
            className={`mt-1 text-xs ${isActive("/myorder") ? "font-bold text-white" : "font-bold text-white"}`}
          >
            Orders
          </span>
        </Link>
        <Link
          to="/myprofile"
          className={`flex flex-col items-center transition-all duration-300 ease-in-out ${
            isActive("/myprofile") ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isActive("/myprofile") ? "bg-indigo-100 shadow" : "hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon
              icon={faUser}
              className={`text-xl ${isActive("/myprofile") ? "text-indigo-600" : "text-white"}`}
            />
          </div>
          <span
            className={`mt-1 text-xs ${isActive("/myprofile") ? "font-bold text-white" : "font-bold text-white"}`}
          >
            Profile
          </span>
        </Link>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex font-medium flex-col items-center space-y-4">
        <div className="flex space-x-8">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/services" className="hover:text-gray-200">Services</Link>
          <Link to="/myorder" className="hover:text-gray-200">My Orders</Link>
          <Link to="/myprofile" className="hover:text-gray-200">Profile</Link>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <p>CitySphere © All rights reserved</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="/privacy-policy" className="hover:text-gray-200 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
