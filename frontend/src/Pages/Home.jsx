import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faHome, faBolt, faWrench, faFire, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import image1 from '../assets/img1.jpg';
import image2 from '../assets/img2.jpg';
import image3 from '../assets/img3.jpg';
import checkmarkAnimation from "../assets/checkmark.json";
import BASE_URL from '../config/apiConfig';

const Home = () => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Animation state
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const services = [
    { id: '67892c876c55625177544caa', name: 'AC Repair', description: 'Quick and reliable AC repair services for your home.', icon: faFire },
    { id: '67892c876c55625177544ca8', name: 'Electrical Repairs', description: 'Professional electricians for all your needs.', icon: faBolt },
    { id: '67892c876c55625177544ca9', name: 'Plumbing Services', description: 'Experienced plumbers to solve your plumbing issues.', icon: faWrench },
  ];

  // Function to handle service booking
  const handleBookService = async (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/authpage");
      return;
    }

    try {
      const userResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data;

      if (!user.address) {
        setName(user.name);
        setMobile(user.mobile);
        setSelectedServiceId(serviceId);
        setShowAddressModal(true);
      } else {
        setName(user.name);
        setMobile(user.mobile);
        setAddress(user.address);
        setSelectedServiceId(serviceId);
        setShowAddressModal(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userData").split('"')[1];
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        {
          serviceId: selectedServiceId,
          userId,
          address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setIsProcessing(false);
        setIsSuccess(true); // Show success animation
        setTimeout(() => {
          setIsSuccess(false); // Hide success animation after 3 seconds
          setShowAddressModal(false);
          setSelectedServiceId(null);
          navigate("/myorder");
        }, 1500);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <div className="max-w-8xl mx-auto relative">

      {/* Carousel Section */}
      <div className="mb-8 relative">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={3000}
          className="rounded-lg shadow-md"
        >
          {[{ image: image1, title: "Fast Plumbing Services", text: "Quick, reliable plumbing solutions at your doorstep." },
          { image: image2, title: "Professional Electricians", text: "Certified electricians for all home and office needs." },
          { image: image3, title: "On-Demand Car Rentals", text: "Affordable, convenient car rentals for every journey." }]
            .map((item, index) => (
              <div key={index} className="relative">
                <img src={item.image} alt={item.title} className="object-cover h-[300px] w-full md:h-[400px]" />

                {/* Overlay Gradient Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold">{item.title}</h2>
                    <p className="text-sm md:text-base">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
        </Carousel>

        {/* Fixed Buttons on the Right Side */}
        <div className="absolute right-4 top-28 flex flex-col items-center space-y-4 z-10">
          {/* Call Now Attention Text */}
          <div
            className="bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full shadow-lg mb-2 animate-bounce"
            style={{
              animation: "pulse 2s infinite",
            }}
          >
            <a
              href="tel:+919117547911">Call Now!
            </a>
          </div>

          {/* Call Button */}
          <a
            href="tel:+919117547911"
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition duration-300 animate-ping-once"
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
            }}
            aria-label="Call Us"
          >
            <FontAwesomeIcon icon={faPhone} size="xl" />
          </a>
        </div>

      </div>

      {/* Quick Services Section */}
      <div className="mb-8 px-4">
        <div className="grid grid-cols-2 font-medium md:grid-cols-4 gap-4">
          <Link to="/car-booking" className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center hover:from-indigo-700 hover:to-blue-600 transition">
            <FontAwesomeIcon icon={faCar} size="2x" />
            <span className="mt-2">Car Booking</span>
          </Link>
          <Link to="/flat-booking" className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center hover:from-indigo-700 hover:to-blue-600 transition">
            <FontAwesomeIcon icon={faHome} size="2x" />
            <span className="mt-2">Flat Booking</span>
          </Link>
          {[
            { icon: faBolt, label: "Electrician", id: '67892c876c55625177544ca8' },
            { icon: faWrench, label: "Plumber", id: '67892c876c55625177544ca9' }
          ].map((item, index) => (
            <div key={index} onClick={() => handleBookService(item.id)} className="cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center hover:from-indigo-700 hover:to-blue-600 transition">
              <FontAwesomeIcon icon={item.icon} size="2x" />
              <span className="mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Services Button */}
      <div className="flex justify-center mb-8">
        <Link to="/services" className="bg-gradient-to-r from-indigo-600 to-blue-500 font-medium hover:from-indigo-700 hover:to-blue-600 text-white py-2 px-4 rounded-full text-lg shadow-md transition">
          View All Services
        </Link>
      </div>

      {/* Trending Services Section */}
      <div className="mb-8 px-4">
        <h2 className="text-3xl font-bold mb-6 text-indigo-900">Trending Services</h2>
        <div className="grid grid-cols-1 mb-12 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleBookService(service.id)}
              className="cursor-pointer bg-gradient-to-br from-indigo-100 to-white shadow-lg p-6 rounded-xl hover:from-indigo-200 hover:to-blue-100 transition transform hover:-translate-y-1"
            >
              <FontAwesomeIcon icon={service.icon} size="2x" className="text-sky-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-full mt-4 shadow-lg hover:from-indigo-600 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white font-medium rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Your Personal Details:</h2>
            <span className="text-lg font-medium">Name: </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <span className="text-lg font-medium">Phone: </span>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Phone No"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <span className="text-lg font-medium">Address: </span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={confirmBooking}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Processing Animation */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-semibold">Processing your booking...</p>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {isSuccess && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="w-64 h-64">
            <Lottie animationData={checkmarkAnimation} loop={false} />
          </div>
          <p className="absolute bottom-8 text-lg font-semibold text-green-500">
            Booking Confirmed!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;