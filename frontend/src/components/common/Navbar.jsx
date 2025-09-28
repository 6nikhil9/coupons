// src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-9" alt="EventWise Logo" /> {/* Make sure you have a logo.png in your /public folder */}
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">EventWise</span>
        </Link>

        {/* Navigation Links (if any, for public access) */}
        <div className="flex items-center space-x-6">
          {/* Example public link */}
          {/* <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
            About
          </Link> */}
          {/* A login button could also be here if the homepage itself doesn't offer it prominently */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;