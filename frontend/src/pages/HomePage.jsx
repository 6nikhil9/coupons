// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/common/Navbar';
import LoginForm from '../components/auth/LoginForm';

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-6 bg-gradient-to-br from-purple-900 to-indigo-900">
        <h1 className="text-5xl font-extrabold text-white mb-8 text-center leading-tight">
          EventWise: Seamless Event Experiences
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl text-center">
          Your All-in-One Solution for Secure Food & Access Management
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4 text-center">
            Dashboard Login
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            Admins and Volunteers, please enter your credentials.
          </p>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default HomePage;