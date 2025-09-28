// src/components/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function EventForm() {
  const { eventId } = useParams(); // Check if we're editing an existing event
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/events/${eventId}`);
          const eventData = response.data;
          setFormData({
            name: eventData.name,
            // Format date to 'YYYY-MM-DD' for input type="date"
            date: new Date(eventData.date).toISOString().split('T')[0],
            venue: eventData.venue,
            description: eventData.description,
          });
        } catch (err) {
          setError('Failed to load event details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (eventId) {
        await api.put(`/events/${eventId}`, formData);
        setSuccess('Event updated successfully!');
      } else {
        await api.post('/events', formData);
        setSuccess('Event created successfully!');
        setFormData({ name: '', date: '', venue: '', description: '' }); // Clear form
      }
      navigate('/admin'); // Redirect to dashboard or event list
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">
        {eventId ? 'Edit Event' : 'Create New Event'}
      </h1>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Food Details / Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'Saving...' : (eventId ? 'Update Event' : 'Create Event')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EventForm;