import React, { useState } from 'react';
import axios from 'axios';
import './CreateEvent.css';

const CreateEvent = ({ onEventCreated }) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // Get user ID from localStorage (would be set during login)
            const userId = localStorage.getItem('userId');
            
            if (!formData.title || !formData.date || !formData.location || !formData.capacity) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:5000/api/events', {
                ...formData,
                capacity: parseInt(formData.capacity),
                userId: userId || 1 // Default to user 1 for testing
            });

            setSuccess('Event created successfully!');
            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                capacity: ''
            });
            setShowForm(false);
            
            // Notify parent component
            if (onEventCreated) {
                onEventCreated(response.data.data);
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            {!showForm ? (
                <button 
                    className="btn btn-primary create-event-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Create Event
                </button>
            ) : (
                <div className="create-event-form-wrapper">
                    <div className="form-header">
                        <h2>Create New Event</h2>
                        <button 
                            className="close-btn"
                            onClick={() => setShowForm(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="event-form">
                        <div className="form-group">
                            <label htmlFor="title">Event Title *</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g., Tech Conference 2025"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                placeholder="Describe your event..."
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">Date & Time *</label>
                                <input
                                    id="date"
                                    type="datetime-local"
                                    name="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Venue/Location *</label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    className="form-control"
                                    placeholder="e.g., Convention Center"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacity">Max Capacity *</label>
                            <input
                                id="capacity"
                                type="number"
                                name="capacity"
                                className="form-control"
                                placeholder="e.g., 100"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateEvent;
