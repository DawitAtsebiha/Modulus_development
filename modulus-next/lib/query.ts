import { pool } from './database';



export async function getUserFirstName(userId: string) {
  const res = await pool.query(
    'SELECT first_name FROM users WHERE id = $1',
    [userId]
  );
  return res.rows[0]?.first_name ?? 'Guest';
}