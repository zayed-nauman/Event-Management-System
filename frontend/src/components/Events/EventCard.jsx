import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Capacity: {event.capacity}</p>
            <p>Registered: {event.registeredCount}</p>
            <button>Register</button>
        </div>
    );
};

export default EventCard;