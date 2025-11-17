import React from 'react';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{event.title}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="event-detail-section">
                        <h3>📅 Date & Time</h3>
                        <p className="detail-value">
                            {formattedDate} at {formattedTime}
                        </p>
                    </div>

                    <div className="event-detail-section">
                        <h3>📍 Location</h3>
                        <p className="detail-value">{event.location}</p>
                    </div>

                    <div className="event-detail-section">
                        <h3>👥 Capacity</h3>
                        <p className="detail-value">{event.capacity} attendees</p>
                    </div>

                    <div className="event-detail-section">
                        <h3>📝 Description</h3>
                        <p className="detail-value">
                            {event.description || 'No description provided'}
                        </p>
                    </div>

                    <div className="event-detail-section">
                        <h3>Status</h3>
                        <div className="status-badge">
                            <span className={`badge badge-${event.status}`}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                            {event.is_published ? (
                                <span className="badge badge-published">Published</span>
                            ) : (
                                <span className="badge badge-draft">Draft</span>
                            )}
                        </div>
                    </div>

                    <div className="event-detail-section">
                        <h3>Created</h3>
                        <p className="detail-value">
                            {new Date(event.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
