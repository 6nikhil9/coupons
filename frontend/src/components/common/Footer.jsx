// src/components/common/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 p-6 text-center text-gray-400 text-sm shadow-inner mt-auto">
      <div className="container mx-auto">
        <p>&copy; {currentYear} EventWise. All rights reserved.</p>
        <p className="mt-2">
          Designed with <i className="fas fa-heart text-red-500 mx-1"></i> by [Your Team/Name]
        </p>
        {/* Optional: Add social media links or other navigation */}
        <div className="mt-4 flex justify-center space-x-4">
          {/* <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fab fa-github"></i>
          </a> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;