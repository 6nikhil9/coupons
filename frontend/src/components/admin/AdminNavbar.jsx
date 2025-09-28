// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-chart-line' },
    { name: 'Events', path: '/admin/events', icon: 'fas fa-calendar-alt' },
    { name: 'Coupons', path: '/admin/coupons', icon: 'fas fa-ticket-alt' },
    // { name: 'Reports', path: '/admin/reports', icon: 'fas fa-file-alt' },
  ];

  return (
    <nav className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg border-r border-gray-700/50">
      <div className="flex items-center mb-12">
        <i className="fas fa-ticket-alt text-3xl text-purple-400"></i>
        <h2 className="text-2xl font-bold text-white ml-3">EventWise</h2>
      </div>
      <ul className="flex-grow space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200 text-gray-300 ${
                  isActive ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-gray-700'
                }`
              }
            >
              <i className={`${item.icon} mr-4 w-5 text-center`}></i>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
         {/* Settings Button */}
        <button className="flex items-center w-full py-2.5 px-4 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <i className="fas fa-cog mr-4 w-5 text-center"></i>
            <span className="font-medium">Settings</span>
        </button>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-2.5 px-4 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-4 w-5 text-center"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;