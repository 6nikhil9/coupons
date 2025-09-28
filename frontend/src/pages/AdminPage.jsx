// src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import EventForm from '../components/admin/EventForm'; // Used for create/edit
import CouponGenerationSection from '../components/admin/CouponGenerationSection';
import AdminNavbar from '../components/admin/AdminNavbar'; // Admin-specific navbar/sidebar

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Basic logout handler (will interact with AuthContext)
  const handleLogout = () => {
    // Call logout function from AuthContext
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminNavbar onLogout={handleLogout} currentPath={location.pathname} />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/:eventId/edit" element={<EventForm />} />
          <Route path="coupons/:eventId" element={<CouponGenerationSection />} />
          {/* Add more admin routes as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;