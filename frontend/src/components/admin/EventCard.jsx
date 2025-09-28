// src/components/admin/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event, onDelete }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-all">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-purple-600 h-10 w-10 flex items-center justify-center rounded-lg mr-4">
            <i className="fas fa-calendar-alt text-white"></i>
        </div>
        <div>
            <p className="font-semibold text-white">{event.name}</p>
            <p className="text-sm text-gray-400">{formattedDate} at {event.venue}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Link to={`/admin/coupons/${event._id}`} title="Manage Coupons" className="text-gray-400 hover:text-white">
          <i className="fas fa-ticket-alt"></i>
        </Link>
        <Link to={`/admin/events/edit/${event._id}`} title="Edit Event" className="text-gray-400 hover:text-white">
          <i className="fas fa-pencil-alt"></i>
        </Link>
        <button onClick={() => onDelete(event._id)} title="Delete Event" className="text-gray-400 hover:text-red-500">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default EventCard;