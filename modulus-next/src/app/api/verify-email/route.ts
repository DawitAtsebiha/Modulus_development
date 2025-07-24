import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/database';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const { rows: [row] } = await pool.query(
    `SELECT user_id, verification_code, verification_expires_at FROM public.users WHERE email=$1`,
    [email]
  );
  if (!row || row.verification_code !== code) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }
  if (new Date(row.verification_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code expired' }, { status: 400 });
  }

  await pool.query(
    `UPDATE public.users
        SET email_verified=true, verification_code=NULL, verification_expires_at=NULL
      WHERE email=$1`,
    [email]
  );

  const token = jwt.sign({ id: row.user_id }, process.env.JWT_SECRET!, { expiresIn: '2h' });
  const res = NextResponse.json({ message: 'Email verified' });
  res.headers.set('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60,
    path: '/'
  }));
  return res;
}