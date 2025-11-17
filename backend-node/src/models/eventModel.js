// PostgreSQL-based Event model (no sequelize dependency)
const pool = require('../services/db');

const Event = {
    create: async (data) => {
        const { title, description, date, location, capacity, user_id } = data;
        const result = await pool.query(
            'INSERT INTO events (title, description, date, location, max_capacity, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            [title, description, date, location, capacity, user_id]
        );
        return result.rows[0];
    },

    findAll: async () => {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { title, description, date, location, capacity } = data;
        const result = await pool.query(
            'UPDATE events SET title = $1, description = $2, date = $3, location = $4, max_capacity = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
            [title, description, date, location, capacity, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
        return { success: true };
    }
};

module.exports = Event;