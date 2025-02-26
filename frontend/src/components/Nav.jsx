import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo1.png';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref to the menu for detecting outside clicks

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-14" src={logo} alt="CitySphere Logo" />
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-200 font-medium">
              Home
            </Link>
            <Link to="/services" className="hover:text-gray-200 font-medium">
              Services
            </Link>
            <Link to="/myorder" className="hover:text-gray-200 font-medium">
              My Order
            </Link>
            <Link to="/myprofile" className="hover:text-gray-200 font-medium">
              My Profile
            </Link>
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
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Services
            </Link>
            <Link
              to="/myorder"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              My Order
            </Link>
            <Link
              to="/myprofile"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              My Profile
            </Link>
            <Link
              to="/privacy-policy"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
