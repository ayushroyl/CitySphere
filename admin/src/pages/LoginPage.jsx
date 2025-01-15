import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config/apiConfig";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/admin/login`, { username, password });

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminId", response.data.adminId);
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 2000); // Navigate after a short delay for the toast to show
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen font-bold bg-gradient-to-r from-indigo-600 to-blue-400">
      <form className="p-6 bg-white shadow-md rounded-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Login</h2>
        <label className="block mb-2">
          Username:
          <input
            type="text"
            className="block w-full p-2 border rounded mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </label>
        <label className="block mb-4">
          Password:
          <input
            type="password"
            className="block w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;