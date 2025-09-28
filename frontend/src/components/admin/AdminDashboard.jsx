// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EventCard from './EventCard';

function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalCouponsGenerated: 0,
    totalCouponsRedeemed: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Corrected API endpoints to match your backend routes
        const statsResponse = await api.get('/admin/dashboard-stats');
        const eventsResponse = await api.get('/admin/events');

        setDashboardStats(statsResponse.data);
        setUpcomingEvents(eventsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-400 p-4 bg-red-900/50 rounded">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Events" value={dashboardStats.totalEvents} icon="fas fa-calendar-days" color="purple" />
        <StatCard title="Active Events" value={dashboardStats.activeEvents} icon="fas fa-calendar-check" color="indigo" />
        <StatCard title="Coupons Generated" value={dashboardStats.totalCouponsGenerated} icon="fas fa-ticket-alt" color="green" />
        <StatCard title="Coupons Redeemed" value={dashboardStats.totalCouponsRedeemed} icon="fas fa-check-circle" color="teal" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Your Events</h2>
        <Link
          to="/admin/events/new"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Create New Event
        </Link>
      </div>

      {/* Upcoming Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No events found. Start by creating one!</p>
        )}
      </div>
    </div>
  );
}

// Helper component for stat cards
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-${color}-600`}>
    <div className="flex items-center justify-between">
      <div className={`text-4xl text-${color}-400`}>
        <i className={icon}></i>
      </div>
      <div className="text-right">
        <p className="text-lg text-gray-300">{title}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;