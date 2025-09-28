// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoginForm from '../components/auth/LoginForm'; // Re-use for admin login

function HomePage() {
  const navigate = useNavigate();

  const handleAdminLoginSuccess = () => {
    navigate('/admin');
  };

  return (
    <>
      <Navbar /> {/* Simple Navbar, maybe just logo and About */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-gradient-to-br from-purple-900 to-indigo-900">
        <h1 className="text-5xl font-extrabold text-white mb-8 text-center leading-tight">
          EventWise: Seamless Event Experiences
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl text-center">
          Your All-in-One Solution for Secure Food & Access Management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {/* Admin Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center">
              <i className="fas fa-user-shield mr-3"></i> Event Convener (Admin)
            </h2>
            <p className="text-gray-300 mb-6">Manage events, generate coupons, and track redemption.</p>
            {/* Login form for admin */}
            <LoginForm onLoginSuccess={handleAdminLoginSuccess} role="admin" />
          </div>

          {/* Volunteer Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4 flex items-center">
              <i className="fas fa-qrcode mr-3"></i> Volunteer (Validator)
            </h2>
            <p className="text-gray-300 mb-6">Quickly scan QR codes to validate participant coupons.</p>
            <button
              onClick={() => navigate('/scan')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
            >
              Access Scan Page
            </button>
          </div>

          {/* Attendee Card (Future Expansion) */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl opacity-70 cursor-not-allowed">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <i className="fas fa-ticket-alt mr-3"></i> Attendee (User)
            </h2>
            <p className="text-gray-300 mb-6">View your digital coupons and event details. (Coming Soon!)</p>
            <button
              disabled
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg opacity-50 cursor-not-allowed"
            >
              View My Coupon
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;