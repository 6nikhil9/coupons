// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, eventsResponse] = await Promise.all([
          api.get('/admin/dashboard-stats'),
          api.get('/admin/events?limit=5') // Fetch recent 5 events for dashboard
        ]);
        setStats(statsResponse.data);
        setEvents(eventsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard Overview</h1>
        <Link
          to="/admin/events/new"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Events" value={stats.totalEvents} icon="fas fa-calendar-days" />
        <StatCard title="Active Events" value={stats.activeEvents} icon="fas fa-calendar-check" />
        <StatCard title="Coupons Generated" value={stats.totalCouponsGenerated} icon="fas fa-ticket-alt" />
        <StatCard title="Coupons Redeemed" value={stats.totalCouponsRedeemed} icon="fas fa-check-circle" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Upcoming & Recent Events</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map(event => <EventListItem key={event._id} event={event} />)}
          </ul>
        ) : (
          <p className="text-gray-400">No events created yet.</p>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mr-4">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value ?? 0}</p>
      </div>
    </div>
  </div>
);

const EventListItem = ({ event }) => (
    <li className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
        <div>
            <p className="font-semibold text-lg">{event.name}</p>
            <p className="text-sm text-gray-400">
                <i className="fas fa-calendar-alt mr-2"></i>
                {new Date(event.date).toLocaleDateString()}
            </p>
        </div>
        <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                {event.status}
            </span>
            <Link to={`/admin/events/edit/${event._id}`} className="text-gray-400 hover:text-white">
                <i className="fas fa-pencil-alt"></i>
            </Link>
            <Link to={`/admin/coupons/${event._id}`} className="text-gray-400 hover:text-white">
                <i className="fas fa-ticket-alt"></i>
            </Link>
        </div>
    </li>
);

export default AdminDashboard;