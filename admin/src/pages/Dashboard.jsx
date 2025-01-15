import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import axios from "axios";
import BASE_URL from "../config/apiConfig";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/accesslogin");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch users and orders concurrently
        const [usersResponse, ordersResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/users/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again.");
        navigate("/accesslogin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Calculate total revenue for completed orders
  const completedOrders = orders.filter((order) => order.status === "Completed");

  const revenue = completedOrders.reduce((total, order) => {
    if (order.type === "car") {
      return total + (order.fare || 0);
    } else if (order.type === "flat") {
      return total + (order.flatId?.price || 0);
    } else if (order.type === "service") {
      return total + (order.serviceId?.price || 0);
    }
    return total;
  }, 0);

  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    revenue,
  };

  if (isLoading) {
    return <p className="text-center p-4">Loading Dashboard...</p>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 font-bold mt-20">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Users" value={stats.totalUsers} color="bg-indigo-500" />
        <StatsCard title="Total Orders" value={stats.totalOrders} color="bg-green-500" />
        <StatsCard
          title="Total Completed Orders"
          value={stats.completedOrders}
          color="bg-blue-500"
        />
        <StatsCard
          title="Revenue (Completed Orders)"
          value={`₹${stats.revenue.toLocaleString()}`}
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
