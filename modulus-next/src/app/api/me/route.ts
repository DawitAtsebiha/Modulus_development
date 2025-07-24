import { NextResponse } from 'next/server';
import { getUserFromReq } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserFromReq(req as any);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json(user);
}