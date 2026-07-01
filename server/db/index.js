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
  .then(client => {
    console.log('Connected to PostgreSQL successfully');
    client.release();
  })
  .catch(err => {
    console.error('Error acquiring client from postgres pool:', err.message);
  });

export default pool;
