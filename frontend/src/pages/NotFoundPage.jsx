// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar'; // Assuming you want a Navbar on this page
import Footer from '../components/common/Footer'; // Assuming you want a Footer on this page

function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Navbar /> {/* Include Navbar */}
      <main className="flex-grow flex items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-9xl font-extrabold text-purple-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-300 mb-8">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            <i className="fas fa-home mr-3"></i> Go to Homepage
          </Link>
        </div>
      </main>
      <Footer /> {/* Include Footer */}
    </div>
  );
}

export default NotFoundPage;