import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// The pool uses the DATABASE_URL environment variable if provided, 
// otherwise falls back to a default connection string meant for docker-compose.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://admin:password123@localhost:5432/olfactura',
});

// Test connection
pool.connect()
  .then(async client => {
    console.log('Connected to PostgreSQL successfully');
    
    // Initialize required database tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_query (
        query_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        urgency VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS client_feedback (
        feedback_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        name VARCHAR(255),
        email VARCHAR(255),
        experience_rating INT,
        accuracy_rating INT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables support_query and client_feedback initialized successfully');
    
    client.release();
  })
  .catch(err => {
    console.error('Error acquiring client from postgres pool:', err.message);
  });

export default pool;
