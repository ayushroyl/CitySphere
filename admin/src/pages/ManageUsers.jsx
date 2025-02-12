import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config/apiConfig";
import ConfirmationModal from "../components/ConfirmationModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        navigate("/accesslogin");
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch users");
        toast.error("Error fetching users");
        setLoading(false);
        navigate("/accesslogin");
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/users/delete/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userToDelete));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the user");
    }

    setIsConfirmModalOpen(false);
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
  };

  const handleViewProfile = (userId) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm)
  );

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Manage Users</h1>

      {/* Search Box */}
      <div className="mb-6 flex items-center justify-between space-x-4">
        <input
          type="text"
          className="p-2 w-full md:w-1/3 border rounded-lg"
          placeholder="Search by name or mobile"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md mb-10 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR. No.</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Mobile</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-t border-gray-300 hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.mobile}</td>
                <td className="py-2 px-4">{user.email || "N/A"}</td>
                <td className="py-2 px-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => handleViewProfile(user._id)}
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 sm:max-w-xl">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedUser.mobile}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address || "N/A"}
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg text-sm sm:text-base">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this user? Make sure to clear all orders of this user."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default ManageUsers;