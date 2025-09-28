// src/components/admin/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event, onDelete, onEdit }) {
  // Assuming 'event' object has _id, name, date, status, etc.
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusColor = event.status === 'Active' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{event.name}</h3>
        <span className={`${statusColor} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
          {event.status}
        </span>
      </div>
      <p className="text-gray-400 mb-2 flex items-center">
        <i className="fas fa-calendar-alt mr-2"></i> {formattedDate}
      </p>
      <p className="text-gray-400 mb-4 flex items-center">
        <i className="fas fa-map-marker-alt mr-2"></i> {event.venue || 'N/A'}
      </p>
      <div className="mt-auto flex justify-end space-x-3">
        <Link
          to={`/admin/events/${event._id}/edit`}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          Edit
        </Link>
        <Link
          to={`/admin/coupons/${event._id}`}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-1.5 px-3 rounded-md transition-colors duration-200"
        >
          Manage Coupons
        </Link>
        {/* <button onClick={() => onDelete(event._id)} className="text-red-400 hover:text-red-300 text-sm">
          Delete
        </button> */}
      </div>
    </div>
  );
}

export default EventCard;