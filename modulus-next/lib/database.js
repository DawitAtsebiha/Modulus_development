
import { Pool } from 'pg';


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If your database requires SSL (e.g. Neon), enable it:
  ssl: { rejectUnauthorized: false },
});
