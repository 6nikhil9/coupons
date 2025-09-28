// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminNavbar({ onLogout, currentPath }) {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'fas fa-chart-line' },
    { name: 'Events', path: '/admin/events', icon: 'fas fa-calendar-alt' },
    { name: 'Coupon Management', path: '/admin/coupons', icon: 'fas fa-ticket-alt' },
    // { name: 'Reports', path: '/admin/reports', icon: 'fas fa-file-alt' },
    // { name: 'Settings', path: '/admin/settings', icon: 'fas fa-cog' },
  ];

  return (
    <nav className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
      <div className="flex items-center mb-10">
        <img src="/logo.png" alt="EventWise Logo" className="h-10 mr-3" />
        <h2 className="text-2xl font-bold text-white">Admin</h2>
      </div>
      <ul className="flex-grow">
        {navItems.map((item) => (
          <li key={item.name} className="mb-4">
            <NavLink
              to={item.path}
              end={item.path === '/admin'} // 'end' prop for exact match on dashboard
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
        onClick={onLogout}
        className="flex items-center py-2 px-4 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200"
      >
        <i className="fas fa-sign-out-alt mr-3"></i>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;