const pool = require('./db');

// Get all events
const getEvents = async () => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        return { data: result.rows, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Get single event by ID
const getEventById = async (eventId) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Create event
const createEvent = async (eventData) => {
    const { title, description, date, location, max_capacity, user_id } = eventData;
    try {
        const result = await pool.query(
            'INSERT INTO events (title, description, date, location, max_capacity, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            [title, description, date, location, max_capacity, user_id]
        );
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Update event
const updateEvent = async (eventId, eventData) => {
    const { title, description, date, location, max_capacity } = eventData;
    try {
        const result = await pool.query(
            'UPDATE events SET title = $1, description = $2, date = $3, location = $4, max_capacity = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
            [title, description, date, location, max_capacity, eventId]
        );
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Delete event
const deleteEvent = async (eventId) => {
    try {
        await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
        return { data: { success: true }, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Register user for event
const registerUserForEvent = async (eventId, userId) => {
    try {
        const result = await pool.query(
            'INSERT INTO event_registrations (event_id, user_id, registered_at) VALUES ($1, $2, NOW()) RETURNING *',
            [eventId, userId]
        );
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Get user registrations
const getUserRegistrations = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT e.*, er.registered_at 
             FROM events e 
             JOIN event_registrations er ON e.id = er.event_id 
             WHERE er.user_id = $1 
             ORDER BY e.date ASC`,
            [userId]
        );
        return { data: result.rows, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Get event registrations count
const getEventRegistrationsCount = async (eventId) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1',
            [eventId]
        );
        return { data: parseInt(result.rows[0].count), error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Check in user (on-site management)
const checkInUser = async (eventId, userId) => {
    try {
        const result = await pool.query(
            'UPDATE event_registrations SET checked_in = true, checked_in_at = NOW() WHERE event_id = $1 AND user_id = $2 RETURNING *',
            [eventId, userId]
        );
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Manage waitlist - add user
const addToWaitlist = async (eventId, userId) => {
    try {
        const result = await pool.query(
            'INSERT INTO waitlist (event_id, user_id, added_at) VALUES ($1, $2, NOW()) RETURNING *',
            [eventId, userId]
        );
        return { data: result.rows[0], error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Get waitlist for event
const getWaitlist = async (eventId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM waitlist WHERE event_id = $1 ORDER BY added_at ASC',
            [eventId]
        );
        return { data: result.rows, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

// Remove from waitlist
const removeFromWaitlist = async (waitlistId) => {
    try {
        await pool.query('DELETE FROM waitlist WHERE id = $1', [waitlistId]);
        return { data: { success: true }, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerUserForEvent,
    getUserRegistrations,
    getEventRegistrationsCount,
    checkInUser,
    addToWaitlist,
    getWaitlist,
    removeFromWaitlist
};