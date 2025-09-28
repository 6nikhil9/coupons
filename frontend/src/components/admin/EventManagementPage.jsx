// src/components/admin/EventManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import EventCard from './EventCard'; // We'll create/update this next

function EventManagementPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/events');
                setEvents(response.data);
            } catch (err) {
                setError('Could not fetch events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);
    
    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event and all its coupons?')) {
            try {
                await api.delete(`/events/${eventId}`);
                setEvents(events.filter(event => event._id !== eventId));
            } catch (err) {
                alert('Failed to delete event.');
            }
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Event Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Event Form */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 p-6 rounded-lg">
                         <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                         {/* This form is now a separate component */}
                         <EventForm onEventCreated={(newEvent) => setEvents([newEvent, ...events])} />
                    </div>
                </div>
                {/* Existing Events List */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
                        {loading ? <p>Loading events...</p> : (
                            <div className="space-y-4">
                                {events.length > 0 ? events.map(event => (
                                    <EventCard key={event._id} event={event} onDelete={handleDelete} />
                                )) : <p className="text-gray-400">No events found.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventManagementPage;