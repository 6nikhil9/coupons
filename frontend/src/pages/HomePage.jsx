// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoginForm from '../components/auth/LoginForm';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          Seamless Event Experiences
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          Your All-In-One Solution for Secure Food & Access Management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Admin Card */}
          <div className="bg-gray-800 border border-purple-800/50 rounded-lg p-8 flex flex-col hover:border-purple-600 transition-all duration-300">
            <div className="flex-grow">
              <i className="fas fa-user-shield text-4xl text-purple-400 mb-4"></i>
              <h2 className="text-2xl font-bold mb-3">Event Convener (Admin)</h2>
              <p className="text-gray-400">
                Create events, generate secure QR coupons, and get real-time analytics.
              </p>
            </div>
            {/* The login form will handle navigation */}
            <LoginForm /> 
          </div>

          {/* Volunteer Card */}
          <div className="bg-gray-800 border border-indigo-800/50 rounded-lg p-8 flex flex-col hover:border-indigo-600 transition-all duration-300">
            <div className="flex-grow">
              <i className="fas fa-qrcode text-4xl text-indigo-400 mb-4"></i>
              <h2 className="text-2xl font-bold mb-3">Volunteer (Validator)</h2>
              <p className="text-gray-400 mb-6">
                Use any device with a camera to scan and validate coupons instantly.
              </p>
            </div>
            <button
              onClick={() => navigate('/scan')}
              className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Access Scan Page
            </button>
          </div>

          {/* Attendee Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col opacity-60">
            <div className="flex-grow">
              <i className="fas fa-ticket-alt text-4xl text-gray-500 mb-4"></i>
              <h2 className="text-2xl font-bold mb-3">Attendee (User)</h2>
              <p className="text-gray-400 mb-6">
                Simply present your QR code for a fast and easy meal redemption experience.
              </p>
            </div>
            <button
              disabled
              className="w-full mt-auto bg-gray-700 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              View My Coupon (Coming Soon)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;