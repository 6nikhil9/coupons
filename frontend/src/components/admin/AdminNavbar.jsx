// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // <-- IMPORT THE HOOK

function AdminNavbar() {
  const { logout } = useAuth(); // <-- GET LOGOUT DIRECTLY FROM CONTEXT
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'fas fa-chart-line' },
    { name: 'Events', path: '/admin/events', icon: 'fas fa-calendar-alt' },
    { name: 'Coupon Management', path: '/admin/coupons', icon: 'fas fa-ticket-alt' },
  ];

  return (
    <nav className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
      <div className="flex items-center mb-10">
        {/* Make sure you have a logo.png in your /public folder */}
        <img src="/logo.png" alt="EventWise Logo" className="h-10 mr-3" />
        <h2 className="text-2xl font-bold text-white">Admin</h2>
      </div>
      <ul className="flex-grow">
        {navItems.map((item) => (
          <li key={item.name} className="mb-4">
            <NavLink
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <i className={`${item.icon} mr-3`}></i>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout} // <-- This now works correctly
        className="flex items-center w-full mt-auto py-2 px-4 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200"
      >
        <i className="fas fa-sign-out-alt mr-3"></i>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;