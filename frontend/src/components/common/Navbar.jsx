// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // <-- IMPORT THE HOOK

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth(); // <-- USE THE HOOK
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-9" alt="EventWise Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">EventWise</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user && (
            <span className="text-gray-300 text-sm hidden md:block">
              Logged in as: {user.username}
            </span>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;