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
  const navigate = useNavigate();

  useEffect(() => {
    // Page reload logic
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true');
      //window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.otpless = async (otplessUser) => {
      try {
        const mobile = otplessUser.identities?.find(identity => identity.identityType === "MOBILE")?.identityValue;
        console.log(mobile)

        const response = await fetch(`${BASE_URL}/api/users/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userData', JSON.stringify(data.userId));
          localStorage.setItem('token', data.token);
          setTimeout(() => navigate('/myprofile'), 2000);
        }
        else {
          setMobile(mobile);
          setIsVerified(true);
          setIsNewUser(true);
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error during OTPLESS verification:", error);
        alert("Server Error");
      }
    };
  }, [navigate]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified, name, mobile, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate('/myprofile');
      } else {
        alert("Server Error");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: `91${mobile}`, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.userId));
        localStorage.setItem('token', data.token);
        navigate('/myprofile');
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-400">
      <div className="bg-white w-full max-w-md p-6 text-center">
        {/* Conditionally render otpless-login-page */}
        {!isNewUser && <div id="otpless-login-page" data-type="SIDE_CURTAIN"></div>}

        <h2 className="text-3xl font-medium text-gray-800 mt-6">
          <FontAwesomeIcon icon={faLock} />
          {isLogin && !isNewUser ? ' Login Using Password' : ' Create an Account'}
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
              <div className="relative">
                <span className="absolute font-medium inset-y-0 left-0 flex items-center pl-3">
                  +91
                </span>
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobile.startsWith("91") ? mobile.slice(2) : mobile}
                  readOnly
                  className="w-full pl-14 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none"
                  required
                  onKeyDown={(e) =>
                    (e.key === 'e' || e.key === '+' || e.key === '-') && e.preventDefault()
                  }
                  style={{ MozAppearance: 'textfield' }}
                />
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-medium px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
              <input
                type="password"
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-medium px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
              <button
                type="button"
                //onClick={handleRegister}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="relative">
                <span className="absolute font-medium inset-y-0 left-0 flex items-center pl-3">
                  +91
                </span>
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none"
                  required
                  onKeyDown={(e) =>
                    (e.key === 'e' || e.key === '+' || e.key === '-') && e.preventDefault()
                  }
                  style={{ MozAppearance: 'textfield' }}
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
                type="button"
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
              <div className="mt-4 text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    localStorage.removeItem('reloaded');
                    setTimeout(() => {
                      window.location.reload();
                      // Scroll to the top after the page refresh
                      window.scrollTo(0, 0);
                    }, 100);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Register Now
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
