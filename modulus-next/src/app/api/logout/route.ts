import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.headers.set('Set-Cookie', serialize('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/'
  }));
  return res;
}