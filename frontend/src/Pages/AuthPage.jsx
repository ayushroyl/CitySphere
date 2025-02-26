import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../config/apiConfig';
import logo from '../assets/logo-long.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSection, setOtpSection] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const formStyle = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-30px)' },
    config: { tension: 170, friction: 26 },
  });

  const initiateOTPless = async () => {
    const OTPless = window.OTPlessSignin;
    if (!OTPless) {
      toast.error('Network error. Please try again.');
      return;
    }

    try {
      setIsSending(true);
      const request = {
        channel: 'PHONE',
        phone: phoneNumber,
        countryCode: '+91',
        deliveryChannel: 'SMS',
        otpLength: 4,
        expiry: '120',
      };

      const result = await OTPless.initiate(request);
      toast.success('OTP sent successfully!');
      setOtpSection(true);
    } catch (error) {
      toast.error('Error sending OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTPless = async () => {
    const OTPless = window.OTPlessSignin;
    if (!OTPless) {
      toast.error('Network error. Please try again.');
      return;
    }

    try {
      setIsVerifying(true);
      const request = {
        channel: 'PHONE',
        phone: phoneNumber,
        otp,
        countryCode: '+91',
      };

      const result = await OTPless.verify(request);
      //console.log('Verify Result:', result.success);

      if (result.success == true) {
        if (!isLogin) {
          await registerUser();
        } else {
          toast.error('Please try again.');
        }
      } else {
        toast.error('Incorrect OTP');
      }
    } catch (error) {
      toast.error('Please try again after some time.');
    } finally {
      setIsVerifying(false);
    }
  };

  const registerUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile: phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate(location.state?.from || "/myprofile", { replace: true });
      } else {
        const errorData = await response.json();
        if (errorData.message === 'User Already exist') {
          toast.error('User already exist, You can login now');
          setIsLogin(true);
          resetFields();
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate(location.state?.from || "/myprofile", { replace: true });
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Invalid credentials or mobile not verified') {
          toast.error('Mobile number not found. Please register first.');
          setIsLogin(false);
          resetFields();
        } else {
          toast.error('Wrong Mobile or Password');
        }
      }
    } catch (error) {
      toast.error('Login error:', error);
    }
  };

  const resetFields = () => {
    setName('');
    setPassword('');
    setPhoneNumber('');
    setOtp('');
    setOtpSection(false);
    setErrorMessage('');
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://otpless.com/v4/headless.js';
    script.id = 'otpless-sdk';
    script.setAttribute('data-appid', 'QYPIGX6IFB9UNZA1C5QA');
    document.head.appendChild(script);

    script.onload = () => {
      const OTPless = window.OTPless;
      if (OTPless) {
        window.OTPlessSignin = new OTPless((response) => {
          console.log('OTPLess Callback:', response);
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <animated.div
      style={formStyle}
      className="flex flex-col font-bold justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500"
    >
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl p-8 w-11/12 sm:w-96">
        <div className="flex justify-center mb-4">
          <img className="h-24" src={logo} alt="CitySphere" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h1>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">
            {errorMessage}
          </p>
        )}
        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className="block w-full p-3 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <input
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Mobile Number"
          className="block w-full p-3 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? "Enter Password" : "Create Password"}
          className="block w-full p-3 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {otpSection && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="block w-full p-3 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        {isLogin ? (
          <div
            className="text-sky-500 text-right cursor-pointer"
            onClick={() => navigate('/forget-password')}
          >
            Forget Password?
          </div>
        ) : null}
        <button
          onClick={
            otpSection
              ? verifyOTPless
              : isLogin
                ? handleLogin
                : initiateOTPless
          }
          disabled={isSending || isVerifying}
          className={`w-full p-3 text-white font-bold rounded-md mt-2 ${isSending || isVerifying
            ? "bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {otpSection
            ? isVerifying
              ? "Verifying..."
              : "Verify OTP"
            : isLogin
              ? "Login"
              : isSending
                ? "Sending OTP..."
                : "Send OTP"}
        </button>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            resetFields();
          }}
          className="w-full p-3 text-gray-700 font-semibold rounded-md mt-4 border border-gray-300 bg-gray-100 hover:bg-gray-200"
        >
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </div>
    </animated.div>
  );
};

export default AuthPage;