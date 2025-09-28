// src/components/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function EventForm({ onEventCreated }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', date: '', venue: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(eventId);

  useEffect(() => {
    if (isEditing) {
      api.get(`/events/${eventId}`).then(res => {
        const { name, date, venue, description } = res.data;
        setFormData({ name, date: new Date(date).toISOString().slice(0, 10), venue, description });
      });
    }
  }, [eventId, isEditing]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await api.put(`/events/${eventId}`, formData);
      } else {
        const res = await api.post('/events', formData);
        if (onEventCreated) onEventCreated(res.data);
      }
      navigate('/admin/events');
    } catch (err) {
      setError('Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400">{error}</p>}
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" required className="w-full p-2 bg-gray-700 rounded-md" />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded-md" />
        <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" required className="w-full p-2 bg-gray-700 rounded-md" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Food Details / Description" className="w-full p-2 bg-gray-700 rounded-md" />
        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-3 rounded-lg">
            {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </button>
    </form>
  );
}

export default EventForm;