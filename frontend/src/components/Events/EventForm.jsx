import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:5000/api/events', {
                title: eventName,
                date: eventDate,
                location: eventLocation,
                description: eventDescription
            });
            // Reset form fields
            setEventName('');
            setEventDate('');
            setEventLocation('');
            setEventDescription('');
            alert('Event created successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Event</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label>Event Name:</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Event Date:</label>
                <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Event Location:</label>
                <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Event Description:</label>
                <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
            </button>
        </form>
    );
};

export default EventForm;