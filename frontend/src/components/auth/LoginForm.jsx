// src/components/auth/LoginForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // This effect runs after a successful login and redirects the user
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'volunteer') {
        navigate('/scan');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
      // Redirection is handled by the useEffect hook above
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username-login" className="sr-only">Username</label>
        <input
          id="username-login"
          type="text"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password-login" className="sr-only">Password</label>
        <input
          id="password-login"
          type="password"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;