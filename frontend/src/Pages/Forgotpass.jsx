import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config/apiConfig";
import logo from '../assets/logo.png';

const ForgetPass = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("verifyUser"); // "verifyUser" -> "otp" -> "resetPassword"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkUserExists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/users/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      const data = await response.json();
      if (data.exists) {
        toast.success("User found. Sending OTP...");
        initiateOtpRequest();
      } else {
        toast.error("User not registered.");
        navigate("/authpage", {
          state: { mode: "register", error: "User not registered." },
        });
      }
    } catch (error) {
      toast.error("Error checking user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initiateOtpRequest = async () => {
    const OTPless = window.OTPlessSignin;
    if (!OTPless) {
      toast.error("Network error. Please try again.");
      return;
    }

    try {
      setLoading(true);
      await OTPless.initiate({
        channel: "PHONE",
        phone: phoneNumber,
        countryCode: "+91",
        deliveryChannel: "SMS",
        otpLength: 4,
        expiry: "120",
      });
      toast.success("OTP sent successfully!");
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const OTPless = window.OTPlessSignin;
    if (!OTPless) {
      toast.error("Network error. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const result = await OTPless.verify({
        channel: "PHONE",
        phone: phoneNumber,
        otp,
        countryCode: "+91",
      });

      if (result.success) {
        toast.success("OTP Verified! Proceed to reset your password.");
        setStep("resetPassword");
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/users/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: phoneNumber,
          password: newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password updated successfully!");
        navigate("/authpage", { state: { mode: "login" } });
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      toast.error("Error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://otpless.com/v4/headless.js";
    script.id = "otpless-sdk";
    script.setAttribute("data-appid", "QYPIGX6IFB9UNZA1C5QA");
    document.head.appendChild(script);

    script.onload = () => {
      const OTPless = window.OTPless;
      if (OTPless) {
        window.OTPlessSignin = new OTPless();
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="absolute top-4 left-4">
        <Link
          to="/authpage"
          className="flex items-center text-white text-sm font-medium bg-transparent border border-white px-4 py-2 rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Login
        </Link>
      </div>
      <ToastContainer />
      <div className="bg-white shadow-xl font-medium rounded-lg p-8 w-11/12 sm:w-96">
        <div className="flex justify-center mb-4">
          <img className="h-24" src={logo} alt="CitySphere" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Forget Password ?
        </h1>
        {step === "verifyUser" && (
          <>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Mobile Number"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={checkUserExists}
              disabled={loading}
              className={`w-full p-3 text-white rounded-md ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Checking..." : "Next"}
            </button>
          </>
        )}
        {step === "otp" && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full p-3 text-white rounded-md ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
        {step === "resetPassword" && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className={`w-full p-3 text-white rounded-md ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPass;