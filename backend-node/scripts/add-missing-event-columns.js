const pool = require('../src/services/db');

async function run() {
  try {
    console.log('Checking events table for missing columns...');

    const res = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='events' AND column_name IN ('is_published','status')"
    );

    const existing = res.rows.map(r => r.column_name);

    if (!existing.includes('is_published')) {
      console.log('Adding column is_published...');
      await pool.query("ALTER TABLE events ADD COLUMN is_published BOOLEAN DEFAULT false");
      console.log('is_published added');
    } else {
      console.log('Column is_published already exists');
    }

    if (!existing.includes('status')) {
      console.log('Adding column status...');
      await pool.query("ALTER TABLE events ADD COLUMN status VARCHAR(50) DEFAULT 'active'");
      console.log('status added');
    } else {
      console.log('Column status already exists');
    }

    console.log('Migration finished');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
