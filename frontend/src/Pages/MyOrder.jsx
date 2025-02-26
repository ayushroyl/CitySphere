import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faTimesCircle,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Lottie from "lottie-react";
import emptyStateAnimation from "../assets/empty-state.json";
import BASE_URL from '../config/apiConfig';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userData")?.split('"')[1];
      if (!token || !userId) return;

      try {
        const response = await axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/orders/delete/${selectedOrder._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(orders.filter((order) => order._id !== selectedOrder._id));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error canceling order:", err);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Accepted":
        return "text-blue-600 bg-blue-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return faClock;
      case "Accepted":
        return faCheckCircle;
      case "Completed":
        return faCheckCircle;
      case "Cancelled":
        return faTimesCircle;
      default:
        return faExclamationTriangle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-12">
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-10 h-10 border-4 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
          <span className="text-lg text-indigo-600">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 text-lg">Failed to load orders. Try again later.</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center">
          <Lottie animationData={emptyStateAnimation} loop className="w-64 h-64" />
          <p className="mt-4 text-gray-600 text-lg">You have no orders yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {order.type === "flat"
                    ? order.flatId?.flatName || "Unavailable"
                    : order.type === "service"
                      ? order.serviceId?.serviceName || "Unavailable"
                      : `Car Booking (${order?.carType || "Unavailable"})`}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 space-y-2 font-normal text-gray-800">
                <p className="font-medium">Order Details:</p>
                <p>
                  <span className="font-medium">Order Id:</span> {order._id.slice(-7).toUpperCase()}
                </p>
                {order.type === "car" && (
                  <>
                    <p>
                      <span className="font-medium">Pickup:</span> {order.pickup}
                    </p>
                    <p>
                      <span className="font-medium">Dropoff:</span> {order.dropoff}
                    </p>
                    <p>
                      <span className="font-medium">Journey Type:</span> {order.journeyType}
                    </p>
                    <p>
                      <span className="font-medium">Distance:</span> {order.distance} km
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {order.duration}
                    </p>
                    <p>
                      <span className="font-medium">Fare:</span> ₹{order.fare}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {new Date(order.date).toDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {order.time}
                    </p>
                  </>
                )}
                {order.type === "flat" && (
                  <>
                    <p>
                      <span className="font-medium">Flat Location & Details:</span> {order?.flatId?.description || "Unavailable"}
                    </p>
                    <p>
                      <span className="font-medium">Rent:</span> {order?.flatId?.price || "Unavailable"} per month
                    </p>
                  </>
                )}
                {order.type === "service" && (
                  <p>
                    <span className="font-medium">Service Address:</span> {order?.address || "Unavailable"}
                  </p>
                )}
              </div>
              <div
                className={`flex items-center mt-4 rounded-full px-3 py-2 ${getStatusClass(
                  order?.status || "Unavailable"
                )}`}
              >
                <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
                <span className="font-medium">{order.status}</span>
              </div>
              {order.status !== "Completed" && order.status !== "Cancelled" && (
                <button
                  onClick={() => openModal(order)}
                  className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all flex items-center"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>

      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cancel Order</h3>
            <p className="text-black font-medium mb-6">
              Are you sure you want to cancel this{" "}
              {selectedOrder.type === "flat"
                ? `flat booking`
                : selectedOrder.type == "service"
                  ? `service ${selectedOrder.serviceId?.serviceName || "Unavailable"}`
                  :`this trip`} ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;