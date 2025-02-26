import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import checkmarkAnimation from "../assets/checkmark.json";
import BASE_URL from "../config/apiConfig";

const FlatBooking = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndices, setSlideIndices] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, flatId: null });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all flats from backend
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/flat`);
        setFlats(response.data.reverse());
        const initialIndices = {};
        response.data.forEach(flat => {
          initialIndices[flat._id] = 0;
        });
        setSlideIndices(initialIndices);
      } catch (error) {
        alert("Failed to load flats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, []);

  // Automatic sliding for each flat
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndices(prev => {
        const newIndices = { ...prev };
        flats.forEach(flat => {
          if (flat.photos.length > 1) {
            newIndices[flat._id] = (prev[flat._id] + 1) % flat.photos.length;
          }
        });
        return newIndices;
      });
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [flats]);

  // Handle manual slide navigation
  const handlePrevSlide = (flatId, photoCount) => {
    setSlideIndices(prev => ({
      ...prev,
      [flatId]: (prev[flatId] - 1 + photoCount) % photoCount
    }));
  };

  const handleNextSlide = (flatId, photoCount) => {
    setSlideIndices(prev => ({
      ...prev,
      [flatId]: (prev[flatId] + 1) % photoCount
    }));
  };

  // Handle booking process
  const handleBooking = async (flatId) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    const userId = userData ? userData.split('"')[1] : null;

    if (!token || !userId) {
      setErrorMessage("You need to log in to book a flat.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        { flatId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => navigate("/myorder"), 2000);
        }, 1500);
      }
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 md:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
          Loading flats...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-12">
          {flats.map((flat) => (
            <motion.div
              key={flat._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full h-48 md:h-64 overflow-hidden">
                {flat.photos.length > 0 && (
                  <>
                    {flat.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={`${BASE_URL}${photo}`}
                        alt={`${flat.flatName} image ${index + 1}`}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                          slideIndices[flat._id] === index ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                    {/* Navigation Arrows */}
                    {flat.photos.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevSlide(flat._id, flat.photos.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => handleNextSlide(flat._id, flat.photos.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                        >
                          →
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-700">{flat.flatName}</h2>
                <p className="text-gray-500 mt-1">{flat.description}</p>
                <p className="text-green-600 font-semibold mt-2">
                  ₹{flat.price.toLocaleString()} / Month
                </p>
                <button
                  onClick={() => setConfirmModal({ isOpen: true, flatId: flat._id })}
                  className={`mt-4 w-full font-medium py-2 rounded-md transition-all duration-300 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Book For Rent"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Show Error Message If Authentication Fails */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg w-96 text-center">
            <p className="font-semibold">{errorMessage}</p>
            <button
              onClick={() => navigate("/authpage", { state: { from: location.pathname } })}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login / Signup
            </button>
            <button
              onClick={() => setErrorMessage("")}
              className="mt-3 ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-md shadow-md p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Booking</h3>
            <p className="text-black font-medium mt-2">
              Are you sure you want to book this flat?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setConfirmModal({ isOpen: false, flatId: null })}
                className="bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleBooking(confirmModal.flatId);
                  setConfirmModal({ isOpen: false, flatId: null });
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg">Processing your booking...</p>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-white flex items-center justify-center z-50"
        >
          <div className="w-64 h-64">
            <Lottie animationData={checkmarkAnimation} loop={false} />
          </div>
          <p className="absolute bottom-8 text-lg font-semibold text-green-500">
            Booking Confirmed!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FlatBooking;