
import { Pool } from 'pg';

console.log('🔑 DATABASE_URL=', process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If your database requires SSL (e.g. Neon), enable it:
  ssl: { rejectUnauthorized: false },
});
