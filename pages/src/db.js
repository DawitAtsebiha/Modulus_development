import dotenv from 'dotenv';
dotenv.config({ path: './database.env' });

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Turn TLS on and skip CA verification (Neon’s cert chain is valid,
  // but skipping verification avoids Windows-OpenSSL hassles in dev)
  ssl: { require: true, rejectUnauthorized: false }
});