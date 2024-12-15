import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import BASE_URL from '../config/apiConfig';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Page reload prevention logic
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true');
    }
  }, []);

  const sendOtp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      if (response.ok) {
        alert('OTP sent successfully!');
        setIsOtpSent(true);
      } else {
        setIsNewUser(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleOtpVerification = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('OTP verified successfully!');
        setIsVerified(true);
        setIsNewUser(true);
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified, name, mobile, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate('/myprofile');
      } else {
        alert('Server Error. Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate('/myprofile');
      } else {
        alert('Wrong Mobile or Password');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-400">
      <div className="bg-white w-full max-w-md p-6 text-center">
        <h2 className="text-3xl font-medium text-gray-800 mt-6">
          <FontAwesomeIcon icon={faLock} /> {isLogin && !isNewUser ? ' Login Using Password' : ' Create an Account'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            isNewUser ? handleRegister() : handleLogin();
          }}
          className="space-y-4"
        >
          {isNewUser ? (
            <>
              {isOtpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleOtpVerification}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute font-medium inset-y-0 left-0 flex items-center pl-3">+91</span>
                    <input
                      type="number"
                      placeholder="Mobile Number"
                      value={mobile.startsWith('91') ? mobile.slice(2) : mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {isVerified && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Set Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="relative">
                <span className="absolute font-medium inset-y-0 left-0 flex items-center pl-3">+91</span>
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none"
                  required
                />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </>
          )}
        </form>

        {!isNewUser && (
          <div className="mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              onClick={() => setIsNewUser(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;