import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave, FaUserEdit, FaClipboardList, FaSpinner, FaPlus, FaLock, FaSignOutAlt } from "react-icons/fa";
import BASE_URL from '../config/apiConfig';

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Success message
  const [loading, setLoading] = useState(true);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/authpage");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setProfileImage(response.data.profilePic || null);
        // Simulate a delay for the loader (e.g., 1 second)
        setTimeout(() => setLoading(false), 1000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
        navigate("/authpage");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle Profile Picture Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/users/profile/picture`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileImage(response.data.profilePic);
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      setError("Error uploading profile picture. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/api/users/profile`,
        { name: userData.name, email: userData.email, address: userData.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError('Failed to save changes.');
    }
  };

  // Function to validate that new password and confirm password match
  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return false;
    }
    return true;
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    // Validate password matching
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true); // Start loading spinner or disable button

    try {
      // Make the API request to change the password
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/users/profile/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } });

      // Clear errors and set success message
      setError("");
      setMessage(response.data.message);

      // Clear form fields after success
      clearForm();
    } catch (error) {
      // Handle any errors that occur during the API request
      setError("Error updating password. Please try again.");
      setMessage(""); // Clear any success messages
    } finally {
      setIsLoading(false); // Stop loading spinner or re-enable button
    }
  };

  // Function to clear the form fields
  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authpage");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen mt-8 font-medium bg-gradient-to-b from-white-300 via-white to-gray-100 flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-sm rounded-xl shadow-lg p-4">
        <div className="text-center mb-6 relative">
          {/* Profile Picture Circle */}
          <div className="overflow-hidden w-32 h-32 mx-auto relative">
            <div className="relative w-28 h-28 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-400">
              {profileImage ? (
                <img
                  src={`${BASE_URL}${profileImage}`}
                  alt="Profile"
                  className="absolute w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="absolute w-28 h-28 text-gray-200 left-1 top-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>

            {/* Camera Icon and File Upload */}
            <div className="absolute bottom-2 right-6">
              <label htmlFor="file-upload" className="cursor-pointer">
                <i className="fa fa-camera text-gray-600 text-lg"></i>
              </label>
              <input
                id="file-upload"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* User Information */}
          <h2 className="text-xl font-bold text-orange-500">
            {userData.name || "Your Name"}
          </h2>
          <h2 className="text-sm font-medium text-stone-700">
            +{userData.mobile || "Mobile"}
          </h2>
        </div>


        {/* Menu Options */}
        <ul className="space-y-4">
          <li
            className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg shadow-sm cursor-pointer hover:bg-orange-100"
            onClick={() => setIsEditing(true)} // Set editing state to true
          >
            <span className="flex items-center gap-4">
              <FaUserEdit className="text-orange-400" /> Edit Profile
            </span>
            <FaEdit />
          </li>

          {/* Conditionally Render Form When Editing */}
          {isEditing && (
            <li className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)} // Close the form
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </li>
          )}
          {/* Saved Addresses Option */}
          <li
            className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg shadow-sm cursor-pointer hover:bg-orange-100"
            onClick={() => setShowAddresses(true)} // Show saved addresses
          >
            <span className="flex items-center gap-4">
              <FaPlus className="text-orange-400" /> Saved Addresses
            </span>
            <FaPlus />
          </li>

          {/* Conditionally Render Saved Address */}
          {showAddresses && (
            <li className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Your Address</h3>
              <div className="mb-4">
                <p className="w-full p-2 border rounded bg-gray-100">
                  {userData?.address || "No address available"}
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowAddresses(false)} // Close address view
                >
                  Close
                </button>
              </div>
            </li>
          )}
          {/* My Orders Option */}
          <li
            className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg shadow-sm cursor-pointer hover:bg-orange-100"
            onClick={() => navigate("/myorder")} // Navigate to /myorder page
          >
            <span className="flex items-center gap-4">
              <FaClipboardList className="text-orange-400" /> My Orders
            </span>
            <FaClipboardList />
          </li>
          {/* Change Password Option */}
          <li
            className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg shadow-sm cursor-pointer hover:bg-orange-100"
            onClick={() => setShowChangePassword(true)} // Show change password form
          >
            <span className="flex items-center gap-4">
              <FaLock className="text-orange-400" /> Change Password
            </span>
            <FaLock />
          </li>

          {/* Change Password Form */}
          {showChangePassword && (
            <div className="p-6 bg-orange-50 rounded-lg shadow-md mt-4 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-6 text-center text-orange-600">Change Password</h3>

              {/* Old Password Field */}
              <div className="mb-4">
                <label htmlFor="oldPassword" className="block text-sm font-medium mb-2">Old Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your old password"
                  required
                />
              </div>

              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                  required
                />
              </div>

              {/* Confirm New Password Field */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between">
                <button
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onClick={handlePasswordChange}
                >
                  Save
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => setShowChangePassword(false)} // Close the form
                >
                  Cancel
                </button>
              </div>

              {/* Success/Error Message */}
              {message && <p className="mt-4 text-center text-green-500">{message}</p>}
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
          )}

          <li
            className="flex items-center justify-between px-4 py-3 bg-red-50 rounded-lg shadow-sm cursor-pointer hover:bg-red-100"
            onClick={handleLogout}  // Call handleLogout when the button is clicked
          >
            <span className="flex items-center gap-4 text-red-500">
              <FaSignOutAlt /> Log Out
            </span>
            <FaSignOutAlt className="text-red-500" />
          </li>
        </ul>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6 text-sm">Version 1.01 &copy; CitySphere</p>
      </div>
    </div>
  );
};

export default MyProfile;