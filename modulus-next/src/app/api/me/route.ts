import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { pool } from '@/lib/database';

export async function GET(req: Request) {
  // 1) grab the cookie
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  if (!match) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }
  const token = match[1];

  try {
    // 2) verify JWT
    const payload = verify(token, process.env.JWT_SECRET!) as { id: number };

    // 3) look up the user
    const { rows: [user] } = await pool.query(
      `SELECT
         user_id         AS id,
         first_name      AS "firstName",
         last_name       AS "lastName",
         email,
         date_of_birth   AS "dateOfBirth",
         creation_date   AS "creationDate",
         school_status   AS "schoolStatus",
         uni_affiliation AS "uniAffiliation"
       FROM public.users
       WHERE user_id = $1`,
      [payload.id]
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4) respond with their profile
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}