import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Hardcoded admin credentials
    const adminUsername = 'Maidonhu';
    const adminPassword = 'Maidonhu';

    // Handle form submission
    const handleLogin = (e) => {
        e.preventDefault();
        setError('');  // Clear any previous error message

        // Check if the entered username and password match the hardcoded values
        if (username === adminUsername && password === adminPassword) {
            // On success, store data in local storage
            localStorage.setItem('adminId', '6749253f1c57cdeda259142b');  // Hardcoded adminId

            // Redirect to the admin panel after successful login
            navigate('/adminpanel');
        } else {
            // Handle invalid credentials
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen font-bold bg-gray-900">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl text-gray-700 font-bold text-center mb-6">Admin Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccessLogin;