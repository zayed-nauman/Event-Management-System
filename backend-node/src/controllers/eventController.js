const pool = require('../services/db');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, capacity, userId } = req.body;

        // Validate inputs
        if (!title || !date || !location || !capacity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title, date, location, and capacity are required' 
            });
        }

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required. Please log in first.' 
            });
        }

        const result = await pool.query(
            `INSERT INTO events (title, description, date, location, capacity, created_by, is_published, status)
             VALUES ($1, $2, $3, $4, $5, $6, false, 'active')
             RETURNING *`,
            [title, description, date, location, capacity, userId]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Event created successfully',
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all published events
exports.getAllEvents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM events ORDER BY date ASC'
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an event (only if not published or by admin)
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, capacity } = req.body;
        const userId = req.body.userId || req.user?.id;

        // Check if event exists and user is creator
        const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event = eventResult.rows[0];
        if (event.created_by !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
        }

        const result = await pool.query(
            `UPDATE events 
             SET title = $1, description = $2, date = $3, location = $4, capacity = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [title || event.title, description || event.description, date || event.date, 
             location || event.location, capacity || event.capacity, id]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Event updated successfully',
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Publish an event (make visible to attendees)
exports.publishEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.user?.id;

        // Check if event exists and user is creator
        const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event = eventResult.rows[0];
        if (event.created_by !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to publish this event' });
        }

        const result = await pool.query(
            'UPDATE events SET is_published = true, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Event published successfully',
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Publish event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel or postpone an event
exports.cancelOrPostponeEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, newDate } = req.body;
        const userId = req.body.userId || req.user?.id;

        if (!['cancelled', 'postponed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Check if event exists and user is creator
        const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event = eventResult.rows[0];
        if (event.created_by !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this event' });
        }

        let updateQuery, params;
        if (status === 'cancelled') {
            updateQuery = 'UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
            params = ['cancelled', id];
        } else {
            updateQuery = 'UPDATE events SET status = $1, date = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
            params = ['postponed', newDate, id];
        }

        const result = await pool.query(updateQuery, params);

        // Notify registered users
        const registeredUsers = await pool.query(
            'SELECT user_id FROM event_registrations WHERE event_id = $1',
            [id]
        );

        res.status(200).json({ 
            success: true, 
            message: `Event ${status} successfully. Notifications sent to ${registeredUsers.rows.length} registered users.`,
            data: result.rows[0],
            notifiedUsers: registeredUsers.rows.length
        });
    } catch (error) {
        console.error('Cancel/postpone event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.user?.id;

        // Check if event exists and user is creator
        const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event = eventResult.rows[0];
        if (event.created_by !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }

        await pool.query('DELETE FROM events WHERE id = $1', [id]);

        res.status(200).json({ 
            success: true, 
            message: 'Event deleted successfully' 
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's events (created by user)
exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.body.userId || req.user?.id;

        const result = await pool.query(
            'SELECT * FROM events WHERE created_by = $1 ORDER BY date ASC',
            [userId]
        );

        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get user events error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};