// src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import EventManagementPage from '../components/admin/EventManagementPage';
import CouponGenerationSection from '../components/admin/CouponGenerationSection';
import AdminNavbar from '../components/admin/AdminNavbar';
import EventForm from '../components/admin/EventForm';

function AdminPage() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <AdminNavbar />
      <main className="flex-1 p-10">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<EventManagementPage />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/edit/:eventId" element={<EventForm />} />
          <Route path="coupons/:eventId" element={<CouponGenerationSection />} />
          {/* Define a route for the main coupon management page */}
          <Route path="coupons" element={<EventManagementPage />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;