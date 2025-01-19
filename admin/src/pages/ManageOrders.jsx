import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const ManageOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState("service");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/accesslogin");
      return;
    }
    fetchAllOrders();
  }, [token, navigate]);

  // Fetch all orders from the backend
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orders = response.data.reverse(); // Show newest orders on top
      setAllOrders(orders);
      filterOrdersByType("service", orders); // Default category
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by type and update the filteredOrders state
  const filterOrdersByType = (type, orders = allOrders) => {
    const categorizedOrders = orders.filter((order) => order.type === type);
    setFilteredOrders(categorizedOrders);
    setActiveCategory(type);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await axios.delete(`${BASE_URL}/api/orders/delete/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const updatedOrders = allOrders.filter((order) => order._id !== orderToDelete);
        setAllOrders(updatedOrders);
        filterOrdersByType(activeCategory, updatedOrders); // Re-filter orders after deletion
        setShowDeleteModal(false);
        setOrderToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/orders/update/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        // Update the status locally in the state
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
  
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };  

  const handleSendWhatsApp = (order) => {
    let message = "Hello, your order is being processed. Thank you for choosing our service!"; // Default message
  
    // Create custom message based on order status
    switch (order.status) {
      case "Pending":
        message = `Hello ${order?.userId?.name || " "}, your order is currently pending. We will update you once it's processed. Thank you for your patience!`;
        break;
      case "Accepted":
        message = `Hello ${order?.userId?.name || " "}, your order has been accepted! We are now working on it and will notify you once it's ready. Thank you!`;
        break;
      case "Completed":
        message = `Hello ${order?.userId?.name || " "}, your order has been completed successfully! Thank you for using our service. We hope you are satisfied!`;
        break;
      case "Cancelled":
        message = `Hello ${order?.userId?.name || " "}, unfortunately, your order has been cancelled. If you have any questions, feel free to reach out to us.`;
        break;
      default:
        message = `Hello ${order?.userId?.name || " "}, your order status is "${order.status}". We'll keep you updated on any further changes.`;
        break;
    }
  
    const phoneNumber = order?.userId?.mobile || "0000000000"; // Fallback number
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.location.href = url;
  };  

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 bg-gray-50 min-h-screen">
      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mt-14 my-6">
        {["service", "car", "flat"].map((type) => (
          <button
            key={type}
            onClick={() => filterOrdersByType(type)}
            className={`px-6 py-3 font-semibold rounded-full transition duration-200 ${activeCategory === type
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-500 hover:text-white"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color="#3498db" />
        </div>
      ) : filteredOrders.length ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="relative border p-6 rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-300"
            >
              {/* Delete Button */}
              <button
                onClick={() => {
                  setOrderToDelete(order._id);
                  setShowDeleteModal(true);
                }}
                className="absolute top-2 right-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

              {/* Order Details */}
              {activeCategory === "service" && (
                <>
                  <h2 className="font-semibold text-xl mb-2">
                  {order?.serviceId?.serviceName || "Service Name Unavailable"}
                  </h2>
                  <p className="text-gray-800">
                    <strong>Order Details:</strong>
                    <p>
                    <span>Order Id:</span> {order?._id?.slice(-7).toUpperCase() || "Order ID Unavailable"}
                    </p>
                    <p>
                    <span>Order Address:</span> {order?.address || "Address Unavailable"}
                    </p>
                    <p>
                      <span>Time:</span> {new Date(order?.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }) || "Time Unavailable"}
                    </p>
                  </p>
                </>
              )}

              {activeCategory === "car" && (
                <>
                  <h2 className="font-semibold text-xl mb-2">
                    {order?.carType || "Model Unavailable"}
                  </h2>
                  <p>
                    <strong>Order Id:</strong> {order._id.slice(-7).toUpperCase() || "Order ID Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Pickup:</span> {order?.pickup || "Pickup Info Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Dropoff:</span> {order?.dropoff || "Dropoff Info Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Journey Type:</span> {order?.journeyType || "Journey Type Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Distance:</span> {order?.distance || "Distance Info Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {order?.duration || "Duration Info Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Fare:</span> ₹{order?.fare || "Not Available"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {new Date(order?.date).toDateString() || "Date Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {order?.time || "Time Unavailable"}
                  </p>
                </>
              )}

              {activeCategory === "flat" && (
                <>
                  <h2 className="font-semibold text-xl mb-2">
                    {order?.flatId?.flatName || "Flat Name Unavailable"}
                  </h2>
                  <p>
                    <span className="font-medium">Location:</span> {order?.flatId?.description || "Description Unavailable"}
                  </p>
                  <p>
                    <span className="font-medium">Rent:</span> {order?.flatId?.price || "Rent Unavailable"} per month
                  </p>
                </>
              )}

              {/* User Details */}
              <p className="text-gray-800">
                <strong>User Details:</strong>
                <h3 className="text-black">
                  Name: {order?.userId?.name || "Name Unavailable"}
                </h3>
                <p className="text-black">
                  Mobile: {order?.userId?.mobile || "Mobile Unavailable"}
                </p>
              </p>

              {/* Actions */}
              <div className="flex flex-wrap font-medium gap-2 mt-4">
                {["Pending", "Accepted", "Completed", "Cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(order._id, status)}
                      className={`flex-1 min-w-[calc(50%-0.5rem)] px-4 py-2 text-sm rounded-lg ${order.status === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                      {status}
                    </button>
                  )
                )}
                <button
                  onClick={() => handleSendWhatsApp(order)}
                  className="flex-1 min-w-[calc(50%-0.5rem)] px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Update User by WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-400">
          No {activeCategory} orders found
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this order?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;