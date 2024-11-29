import React from 'react';
import { FaWrench, FaBolt, FaCar, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomeBtn = () => {
  return (
    <section className="grid grid-cols-2 gap-4 p-4">
      <div className="service-card bg-white shadow-lg rounded-lg p-4 text-center">
        <img src="/images/card1.jpg" alt="Quick Services" className="w-full h-32 object-cover rounded-md mb-4" />
        <div className="service-content">
          <FaBolt className="text-yellow-500 text-3xl mb-2" />
          <p className="font-bold">Quick Services</p>
        </div>
      </div>
  
      <div className="service-card bg-white shadow-lg rounded-lg p-4 text-center">
        <img src="/images/card2.jpg" alt="All Services" className="w-full h-32 object-cover rounded-md mb-4" />
        <div className="service-content">
          <FaWrench className="text-blue-500 text-3xl mb-2" />
          <Link to="/services" className="font-bold">
            All Services
          </Link>
        </div>
      </div>

      <div className="service-card bg-white shadow-lg rounded-lg p-4 text-center">
        <img src="/images/card3.jpg" alt="Flat Booking" className="w-full h-32 object-cover rounded-md mb-4" />
        <div className="service-content">
          <FaBuilding className="text-green-500 text-3xl mb-2" />
          <p className="font-bold">Flat Booking</p>
        </div>
      </div>

      <div className="service-card bg-white shadow-lg rounded-lg p-4 text-center">
        <img src="/images/card4.jpg" alt="Car Booking" className="w-full h-32 object-cover rounded-md mb-4" />
        <div className="service-content">
          <FaCar className="text-red-500 text-3xl mb-2" />
          <p className="font-bold">Car Booking</p>
        </div>
      </div>
    </section>
  );
};

export default HomeBtn;
