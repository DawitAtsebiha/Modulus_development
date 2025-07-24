import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/database';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  const { rows: [user] } = await pool.query(
    `SELECT user_id, password_hashed, email_verified FROM public.users WHERE email=$1`,
    [email.toLowerCase()]
  );
  if (!user || !(await bcrypt.compare(password, user.password_hashed))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  if (!user.email_verified) {
    return NextResponse.json({ error: 'Verify your email first' }, { status: 403 });
  }

  const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '2h' });
  const res = NextResponse.json({ message: 'Login successful' });
  res.headers.set('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60,
    path: '/'
  }));
  return res;
}