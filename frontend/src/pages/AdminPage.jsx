// src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import EventForm from '../components/admin/EventForm';
import CouponGenerationSection from '../components/admin/CouponGenerationSection';
import AdminNavbar from '../components/admin/AdminNavbar';

function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* AdminNavbar now handles its own logout logic */}
      <AdminNavbar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/:eventId/edit" element={<EventForm />} />
          <Route path="coupons/:eventId" element={<CouponGenerationSection />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;