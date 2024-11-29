import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router-dom for navigation
import checkmarkAnimation from "../assets/checkmark.json";
import BASE_URL from '../config/apiConfig';

const FlatBooking = () => {
  const [flatTypes, setFlatTypes] = useState([
    { id: 1, type: 'Students', description: 'Ideal for students with shared accommodations' },
    { id: 2, type: '1BHK', description: 'Perfect for singles or couples' },
    { id: 3, type: '2BHK', description: 'Suitable for small families' },
    { id: 4, type: '3BHK', description: 'Perfect for medium-sized families' },
    { id: 5, type: 'Larger', description: 'For larger families or groups' },
  ]);
  const [selectedFlatType, setSelectedFlatType] = useState('');
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [moveInDate, setMoveInDate] = useState('');
  const [budget, setBudget] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Animation state
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
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
          setAddress("");  // Request user to fill address
        } else {
          setName(user.name);
          setMobile(user.mobile);
          setAddress(user.address);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    fetchUserDetails();
  }, [navigate]);

  const handleRequestBooking = async () => {
    if (!selectedFlatType || !address || !moveInDate || !budget.min || !budget.max) {
      alert("Please fill all the details before proceeding.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userData').split('"')[1];

    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        {
          flatType: selectedFlatType,
          userId,
          address,
          moveInDate,
          budget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false); // Hide success animation after 3 seconds
          setShowAddressModal(false);
          setSelectedServiceId(null);
        }, 1500);
        // Optionally, reset form or navigate elsewhere
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRequestBooking(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Flat Type</label>
              <select
                value={selectedFlatType}
                onChange={(e) => setSelectedFlatType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select a flat type</option>
                {flatTypes.map((flat) => (
                  <option key={flat.id} value={flat.type}>
                    {flat.type} - {flat.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Budget</label>
                <input
                  type="number"
                  value={budget.min}
                  onChange={(e) => setBudget({ ...budget, min: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Min budget"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Budget</label>
                <input
                  type="number"
                  value={budget.max}
                  onChange={(e) => setBudget({ ...budget, max: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Max budget"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleRequestBooking}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Request to Book'}
            </button>
          </form>

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

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FlatBooking;