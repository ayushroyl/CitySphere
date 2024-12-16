import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import BASE_URL from '../config/apiConfig';
import { useSpring, animated } from 'react-spring';

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

  const formStyle = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-30px)' },
    config: { tension: 170, friction: 26 },
  });

  useEffect(() => {
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
        setIsVerified(true);
        setIsNewUser(true);
      } else {
        console.log('Invalid OTP. Please try again.');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 p-4">
      <animated.div style={formStyle} className="bg-white rounded-xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-600" />
          {isLogin && !isNewUser ? 'Login' : 'Create an Account'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            isNewUser ? handleRegister() : handleLogin();
          }}
          className="space-y-6"
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
                    className="w-full px-4 py-3 font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleOtpVerification}
                    className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600">+91</span>
                    <input
                      type="number"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-16 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {isVerified && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Set Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Register
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600">+91</span>
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-16 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Login
              </button>
            </>
          )}
        </form>

        {!isNewUser && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <button
              onClick={() => setIsNewUser(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Register Now
            </button>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default AuthPage;
