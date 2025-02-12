import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import checkmarkAnimation from "../assets/checkmark.json";
import BASE_URL from '../config/apiConfig';

const FlatBooking = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, flatId: null });
  const navigate = useNavigate();

  // Fetch all flats from backend
  const fetchFlats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/flat`);
      setFlats(response.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flats:", error);
    }
  };

  // Simulate booking process
  const handleBooking = async (flatId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userData").split('"')[1];
    if (!token) {
      navigate("/authpage");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        { flatId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/myorder");
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Error confirming booking:", error);
      navigate('/authpage');
    }
  };

  const openConfirmModal = (flatId) => {
    setConfirmModal({ isOpen: true, flatId });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, flatId: null });
  };

  const confirmBooking = () => {
    if (confirmModal.flatId) {
      handleBooking(confirmModal.flatId);
    }
    closeConfirmModal();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % flats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [flats]);

  useEffect(() => {
    fetchFlats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading flats...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 md:px-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-12">
        {flats.map((flat, index) => (
          <motion.div
            key={flat._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform transition-all duration-300"
          >
            <div className="relative w-full h-48 md:h-64 overflow-hidden">
              {flat.photos.map((photo, photoIndex) => (
                <img
                  key={photoIndex}
                  src={`${BASE_URL}${photo}`}
                  alt={`${flat.flatName} image`}
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                    currentSlide === photoIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-700">{flat.flatName}</h2>
              <p className="text-gray-500 mt-1">{flat.description}</p>
              <p className="text-blue-600 font-semibold mt-2">
                ₹{flat.price.toLocaleString()} / Month
              </p>
              <button
                onClick={() => openConfirmModal(flat._id)}
                className="mt-4 w-full font-medium bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              >
                Book For Rent
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm text-center shadow-lg">
            <h3 className="text-lg font-bold text-black">
              Confirm Your Booking
            </h3>
            <p className="text-black font-medium mt-2">
              Are you sure you want to book this flat?
            </p>
            <div className="flex mt-4 gap-4 justify-center">
              <button
                onClick={confirmBooking}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg">Processing your booking...</p>
          </div>
        </div>
      )}

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

export default FlatBooking;