import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import checkmarkAnimation from "../assets/checkmark.json";
import BASE_URL from '../config/apiConfig'; 

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Animation state
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();


  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

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
      setIsProcessing(true);
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
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true); // Show success animation
          setTimeout(() => {
            setIsSuccess(false); // Hide success animation after 3 seconds
            setShowAddressModal(false);
            setSelectedServiceId(null);
            navigate("/myorder")
          }, 1500);
        }, 1000); // Simulate processing delay
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Error confirming booking:", error);
      console.log("Failed to place order. Please try again.");
    }
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <div className="container mx-auto p-6 mt-14 mb-8">
        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-3 px-5 bg-white rounded-full text-gray-800 shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
            <div className="absolute right-3 top-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M9 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl hover:translate-y-2 p-6 flex flex-col items-center text-center"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {service.serviceName}
                </h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-lg font-bold text-green-600 mb-4">
                  ₹{service.price}
                </div>
                <button
                  onClick={() => handleBookService(service._id)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No services found.</p>
        )}
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

export default Services;