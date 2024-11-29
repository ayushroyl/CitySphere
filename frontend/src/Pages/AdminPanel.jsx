import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  faHome,
  faUsers,
  faClipboardList,
  faCog,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BASE_URL from '../config/apiConfig';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, revenue: 0 });
  const [modal, setModal] = useState({ isOpen: false, type: "", id: null });
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();

    // Check if adminId exists in local storage
    useEffect(() => {
      if (!adminId) {
        // Redirect to login page if adminId doesn't exist
        navigate("/accesslogin");
      }
    }, [adminId, navigate]); // Only run once when the component mounts

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        //const statsResponse = await axios.get("http://localhost:5000/api/admin/stats");
        //setStats(statsResponse.data);

        // Fetch users
        const usersResponse = await axios.get(`${BASE_URL}/api/users/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);

        // Fetch orders
        const ordersResponse = await axios.get(`${BASE_URL}/api/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
        body: JSON.stringify({ status }),
      });
  
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: updatedOrder.order.status } : order
          )
        );
        alert(`Order status updated to ${status}`);
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );
  
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${BASE_URL}/api/orders/delete/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
      });
  
      if (response.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        alert("Order deleted successfully");
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  //handleAddServices
  const handleAddService = async (e) => {
    e.preventDefault();

    // // Check if all fields are filled
    // if (!serviceName || !description || !price || !icon) {
    //   alert('Please fill in all fields.');
    //   return;
    // }

    try {
      // Send POST request to add the service
      const response = await axios.post(`${BASE_URL}/api/services/add`, 
      {
        serviceName,
        description,
        price,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      if (response.data.success) {
        alert('Service added successfully');
        // Optionally, reset the form fields
        setServiceName('');
        setDescription('');
        setPrice('');
      } else {
        alert('Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('An error occurred while adding the service.');
    }
  };

  // Modal Confirmation
  const openModal = (type, id) => setModal({ isOpen: true, type, id });
  const closeModal = () => setModal({ isOpen: false });

  // Render Dashboard
  const renderDashboard = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-500 text-white p-4 rounded-lg shadow">
          <p className="text-lg">Total Users</p>
          <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <p className="text-lg">Total Orders</p>
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
          <p className="text-lg">Revenue</p>
          <h3 className="text-2xl font-bold">₹{stats.revenue}</h3>
        </div>
      </div>
    </div>
  );

  // Render Users
  const renderUsers = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user._id} className="flex justify-between items-center py-3">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.mobile}</p>
              </div>
              <button
                onClick={() => openModal("deleteUser", user._id)}
                className="text-red-600 hover:text-red-800"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="p-4">  
      {orders.length === 0 ? (
        <div className="flex flex-col items-center text-center">
          <p className="text-lg text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 mb-12">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {order.serviceId?.serviceName || order.flatId?.flatName || order.carId?.carName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
  
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Address:</span> {order.address}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">User:</span> {order.userId.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Phone:</span> {order.userId.mobile}
                </p>
              </div>
  
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(order._id, "Confirmed")}
                  className="flex-grow bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all text-center"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                  className="flex-grow bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-all text-center"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, "Completed")}
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all text-center"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="flex-grow bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all text-center"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );  

  const renderSettings = () => (
    <div className="p-4 mt-2 mb-10">      
      {/* Add Service */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add Service</h3>
        <form onSubmit={handleAddService}>
          <input
            type="text"
            placeholder="Service Name"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 mb-2 w-full"
          />
          <button className="bg-blue-500 text-white p-2 mt-2 w-full">Add Service</button>
        </form>
      </div>
  
      {/* Add Car */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add Car</h3>
        <form>
          <input
            type="text"
            placeholder="Car Model"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 mb-2 w-full"
          />
          <button className="bg-green-500 text-white p-2 mt-2 w-full">Add Car</button>
        </form>
      </div>
  
      {/* Add Flat */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add Flat</h3>
        <form>
          <input
            type="text"
            placeholder="Flat Name"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 mb-2 w-full"
          />
          <button className="bg-yellow-500 text-white p-2 mt-2 w-full">Add Flat</button>
        </form>
      </div>
  
      {/* Delete Options */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Delete Service/Car/Flat</h3>
        <form>
          <select className="border p-2 mb-2 w-full">
            <option>Select Service/Car/Flat</option>
            {/* Add options dynamically based on available services, cars, flats */}
          </select>
          <button className="bg-red-500 text-white p-2 mt-2 w-full">Delete</button>
        </form>
      </div>
  
      {/* Additional Settings */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Other Settings</h3>
        {/* Additional settings can go here */}
        <button className="bg-gray-500 text-white p-2 mt-2 w-full">Save Settings</button>
      </div>
    </div>
  );
  

  // Render Modal
  const renderModal = () => {
    if (!modal.isOpen) return null;
    const isDeleteUser = modal.type === "deleteUser";
    const isCancelOrder = modal.type === "cancelOrder";

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to {isDeleteUser ? "delete this user" : "cancel this order"}?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                isDeleteUser ? handleDeleteUser(modal.id) : handleCancelOrder(modal.id)
              }
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Content
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "orders":
        return renderOrders();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-xl text-white p-4 text-center font-bold">
        Admin Panel
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-bold shadow fixed bottom-0 inset-x-0 flex justify-around">
        {[
          { tab: "dashboard", icon: faHome, label: "Dashboard" },
          { tab: "users", icon: faUsers, label: "Users" },
          { tab: "orders", icon: faClipboardList, label: "Orders" },
          { tab: "settings", icon: faCog, label: "Settings" },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 flex flex-col items-center ${
              activeTab === tab ? "text-gray-300" : "text-white"
            }`}
          >
            <FontAwesomeIcon icon={icon} size="lg" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminPanel;