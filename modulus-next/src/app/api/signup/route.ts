import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/database';
import { sendVerificationCode } from '@/lib/mailer';

export async function POST(req: Request) {
  const { firstName, lastName, email, password, dateOfBirth, schoolStatus, uniAffiliation } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password too short' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  const code = Math.floor(100000 + Math.random()*900000).toString();
  const expires = new Date(Date.now() + 15*60*1000);

  try {
    await pool.query(
      `INSERT INTO public.users
         (first_name,last_name,email,password_hashed,verification_code,verification_expires_at,date_of_birth,school_status,uni_affiliation)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [firstName, lastName, email.toLowerCase(), hash, code, expires, dateOfBirth, schoolStatus, uniAffiliation || 'None']
    );
    await sendVerificationCode(email, code);
    return NextResponse.json({ message: 'Verification code sent' });
  } catch (err: any) {
    if (err.code === '23505') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}