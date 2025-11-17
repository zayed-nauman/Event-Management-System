const pool = require('./src/services/db');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        // Drop existing tables (in reverse order of dependencies)
        console.log('Dropping existing tables...');
        await pool.query('DROP TABLE IF EXISTS waitlist CASCADE');
        await pool.query('DROP TABLE IF EXISTS event_registrations CASCADE');
        await pool.query('DROP TABLE IF EXISTS events CASCADE');
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        console.log('✅ Existing tables dropped');

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table created');

        // Create events table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date TIMESTAMP NOT NULL,
                location VARCHAR(255),
                capacity INT,
                created_by INT REFERENCES users(id) ON DELETE CASCADE,
                is_published BOOLEAN DEFAULT false,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Events table created/verified');

        // Create event_registrations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                checked_in BOOLEAN DEFAULT FALSE,
                checked_in_at TIMESTAMP,
                UNIQUE(user_id, event_id)
            );
        `);
        console.log('✅ Event registrations table created/verified');

        // Create waitlist table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS waitlist (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                position INT,
                UNIQUE(user_id, event_id)
            );
        `);
        console.log('✅ Waitlist table created/verified');

        console.log('✅ Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
}

initializeDatabase();
