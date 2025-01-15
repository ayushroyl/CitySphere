import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate to handle navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref to the menu for detecting outside clicks
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/accesslogin"); // Redirect to login after logout
  };

  const isAuthenticated = localStorage.getItem("token"); // Check if the user is authenticated based on token

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img className="h-16" src={logo} alt="CitySphere Logo" />
            <p className="text-lg font-medium">Admin</p>
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-200 font-medium">
              Dashboard
            </Link>
            <Link to="/users" className="hover:text-gray-200 font-medium">
              Users
            </Link>
            <Link to="/orders" className="hover:text-gray-200 font-medium">
              Orders
            </Link>
            <Link to="/settings" className="hover:text-gray-200 font-medium">
              Settings
            </Link>

            {/* Show LogOut button if token exists, else show Login button */}
            {isAuthenticated ? (
              <Link onClick={handleLogout} className="hover:text-gray-200 font-medium">
                Logout
              </Link>
            ) : (
              <Link to="/accesslogin" className="hover:text-gray-200 font-medium">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div ref={menuRef} className="absolute top-16 left-0 right-0 bg-blue-700 z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Dashboard
            </Link>
            <Link
              to="/users"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Users
            </Link>
            <Link
              to="/orders"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Orders
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Settings
            </Link>

            {/* Mobile LogOut/Login */}
            {isAuthenticated ? (
              <Link
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </Link>
            ) : (
              <Link
                to="/accesslogin"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;