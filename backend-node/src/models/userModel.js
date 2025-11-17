// PostgreSQL-based User model (no mongoose/sequelize dependency)
const pool = require('../services/db');
const bcryptjs = require('bcryptjs');

const User = {
    create: async (data) => {
        const { username, email, password } = data;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [username, email, hashedPassword]
        );
        return result.rows[0];
    },

    findAll: async () => {
        const result = await pool.query('SELECT id, username, email, created_at FROM users');
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    findByUsername: async (username) => {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { email, username } = data;
        const result = await pool.query(
            'UPDATE users SET email = $1, username = $2 WHERE id = $3 RETURNING id, username, email, created_at',
            [email, username, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return { success: true };
    }
};

module.exports = User;