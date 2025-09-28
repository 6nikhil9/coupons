// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Assuming AuthContext for login logic

function LoginForm({ onLoginSuccess, role }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // Use login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Mock API call or actual API call via AuthContext
      const success = await login(username, password, role); 
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials or unauthorized role.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
        <input
          type="text"
          id="username"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
        disabled={loading}
      >
        {loading ? 'Logging in...' : `Login as ${role === 'admin' ? 'Admin' : 'User'}`}
      </button>
    </form>
  );
}

export default LoginForm;