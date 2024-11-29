import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white py-4 md:py-8">
      {/* Mobile Footer Tab Bar */}
      <div className="md:hidden fixed font-medium bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-white flex justify-around py-3 shadow-lg">
        <Link to="/" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faHome} className="text-lg" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/services" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faClipboardList} className="text-lg" />
          <span className="text-xs">Services</span>
        </Link>
        <Link to="/myorder" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
          <span className="text-xs">My Orders</span>
        </Link>
        <Link to="/myprofile" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex flex-col items-center space-y-4">
        {/* Navigation Links */}
        <div className="flex space-x-8">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/services" className="hover:text-gray-200">
            Services
          </Link>
          <Link to="/myorder" className="hover:text-gray-200">
            My Orders
          </Link>
          <Link to="/myprofile" className="hover:text-gray-200">
            Profile
          </Link>
        </div>

        {/* Social Media Links and Copyright */}
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
