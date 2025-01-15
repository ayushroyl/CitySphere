import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faUsers, faShoppingCart, faGear } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white bottom-0 py-4 md:py-8">
      {/* Mobile Footer Tab Bar */}
      <div className="md:hidden fixed font-medium bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-white flex justify-around py-3 shadow-lg">
        <Link to="/" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faDashboard} className="text-lg" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link to="/users" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faUsers} className="text-lg" />
          <span className="text-xs">Users</span>
        </Link>
        <Link to="/orders" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
          <span className="text-xs">Orders</span>
        </Link>
        <Link to="/settings" className="tab-icon flex flex-col items-center">
          <FontAwesomeIcon icon={faGear} className="text-lg" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex flex-col items-center space-y-4">
        {/* Navigation Links */}
        <div className="flex space-x-8">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/users" className="hover:text-gray-200">
            Users
          </Link>
          <Link to="/order" className="hover:text-gray-200">
            Orders
          </Link>
          <Link to="/settings" className="hover:text-gray-200">
            Settings
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
