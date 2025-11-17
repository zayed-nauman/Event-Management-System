import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import CreateEvent from '../Events/CreateEvent';
import EventDetailsModal from '../Events/EventDetailsModal';
import EditEventModal from '../Events/EditEventModal';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshEvents, setRefreshEvents] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data.data || []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [refreshEvents]);

    const handleEventCreated = () => {
        setRefreshEvents(prev => prev + 1);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const userId = localStorage.getItem('userId') || 1;
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                data: { userId }
            });
            setRefreshEvents(prev => prev + 1);
            alert('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEditEvent = async (eventId, updatedData) => {
        try {
            const userId = localStorage.getItem('userId') || 1;
            const response = await axios.put(`http://localhost:5000/api/events/${eventId}`, {
                ...updatedData,
                userId
            });
            setRefreshEvents(prev => prev + 1);
            setEditingEvent(null);
            alert('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
            throw new Error(error.response?.data?.message || 'Failed to update event');
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Loading events...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="container dashboard">
                <h1>🎯 Your Event Dashboard</h1>
                <CreateEvent onEventCreated={handleEventCreated} />
                <h2>📅 Your Events</h2>
                
                {events.length === 0 ? (
                    <div className="empty-state">
                        <h3>No events found</h3>
                        <p>You haven't created any events yet. Start by creating your first event!</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="event-header">
                                    <h3>{event.title || 'Untitled Event'}</h3>
                                    <p>{event.description?.substring(0, 100)}...</p>
                                </div>
                                <div className="event-body">
                                    <div className="event-meta">
                                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                        <span>📍 {event.location || 'Location TBA'}</span>
                                        <span>👥 Capacity: {event.capacity || 'Unlimited'}</span>
                                    </div>
                                    <div className="event-actions">
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setEditingEvent(event)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedEvent && (
                <EventDetailsModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
            {editingEvent && (
                <EditEventModal 
                    event={editingEvent} 
                    onClose={() => setEditingEvent(null)}
                    onSave={handleEditEvent}
                />
            )}
        </div>
    );
};

export default Dashboard;
